"""Auto-populate section-level Hebrew + English from Sefaria's authoritative API.

Rules (idempotent, safe to re-run):
- For each sugya: derive its Sefaria reference
- Fetch the verified Hebrew + English text
- Distribute Sefaria's paragraphs across the sugya's existing sections
- Skip any section that already has its OWN section.aramaic (preserve hand-curated work)
- Yiddish stays as-is; UI falls back to English when empty
- Cache Sefaria responses locally so re-runs don't re-hit the API
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "content.json"
CACHE_FILE = Path(__file__).resolve().parent / ".sefaria_cache.json"


def load_cache():
    if CACHE_FILE.exists():
        try:
            return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_cache(cache):
    CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")


def strip_html(s):
    if not s:
        return ""
    s = re.sub(r"<[^>]+>", "", str(s))
    s = s.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def flatten(x):
    """Flatten Sefaria's nested he/text into a list of clean strings."""
    if x is None or x == "":
        return []
    if isinstance(x, str):
        cleaned = strip_html(x)
        return [cleaned] if cleaned else []
    if isinstance(x, list):
        out = []
        for item in x:
            out.extend(flatten(item))
        return out
    return []


def fetch_sefaria(ref, cache):
    if ref in cache:
        return cache[ref]
    url = "https://www.sefaria.org/api/texts/" + urllib.parse.quote(ref) + "?context=0&commentary=0"
    try:
        time.sleep(0.4)  # be polite
        req = urllib.request.Request(url, headers={"User-Agent": "berachos-shabbos-tutor/1.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            raw = r.read().decode("utf-8")
        data = json.loads(raw)
        if data.get("error"):
            print(f"  ! Sefaria error for {ref}: {data['error'][:80]}")
            cache[ref] = None
            save_cache(cache)
            return None
        result = {
            "ref": data.get("ref", ref),
            "he": flatten(data.get("he")),
            "text": flatten(data.get("text")),
        }
        cache[ref] = result
        save_cache(cache)
        return result
    except Exception as e:
        print(f"  ! failed {ref}: {e}")
        cache[ref] = None
        save_cache(cache)
        return None


def derive_ref(sugya, masechta):
    if sugya.get("sefaria_ref"):
        return sugya["sefaria_ref"]
    mid = masechta.get("id", "")
    daf = sugya.get("daf", "").strip()
    if mid == "shabbos":
        return "Shabbat." + daf
    if mid == "berachos":
        return "Berakhot." + daf
    if mid == "tanya":
        m = re.search(r"ch(\d+)", sugya.get("id", ""))
        if m:
            return "Tanya, Part I; Likkutei Amarim " + m.group(1)
    if mid == "chumash-bereishis":
        m = re.search(r"p(\d+)$", sugya.get("id", ""))
        if m:
            return "Genesis." + m.group(1)
    if mid == "pirkei-avos":
        m = re.search(r"p(\d+)$", sugya.get("id", ""))
        if m:
            return "Pirkei Avot." + m.group(1)
    return None


def section_has_real_aramaic(sec):
    return bool(str(sec.get("aramaic") or "").strip())


def section_has_real_translation(sec):
    return bool(str(sec.get("aramaic_translation") or "").strip())


def distribute(paragraphs, n):
    """Distribute paragraphs across n groups roughly evenly. Returns list of n joined strings."""
    if n <= 0 or not paragraphs:
        return [""] * max(n, 1)
    if n == 1:
        return [" ".join(p for p in paragraphs if p)]
    groups = [[] for _ in range(n)]
    per = max(1, (len(paragraphs) + n - 1) // n)
    for i, p in enumerate(paragraphs):
        idx = min(i // per, n - 1)
        groups[idx].append(p)
    return [" ".join(g) for g in groups]


def populate(content):
    cache = load_cache()
    populated = 0
    skipped = 0
    skipped_already = 0
    failed = 0
    total = 0

    for masechta in content.get("masechtos", []):
        for perek in masechta.get("perakim", []):
            for sugya in perek.get("sugyos", []):
                total += 1
                sections = sugya.get("sections", [])
                if not sections:
                    continue

                # If every section already has its own aramaic, skip
                if all(section_has_real_aramaic(s) for s in sections):
                    skipped_already += 1
                    continue

                ref = derive_ref(sugya, masechta)
                if not ref:
                    skipped += 1
                    continue

                print(f"Fetching {ref} for {sugya['id']}...")
                data = fetch_sefaria(ref, cache)
                if not data or not data.get("he"):
                    failed += 1
                    continue

                n = len(sections)
                he_groups = distribute(data["he"], n)
                en_groups = distribute(data.get("text", []), n)

                changed = False
                for i, sec in enumerate(sections):
                    if section_has_real_aramaic(sec):
                        continue
                    if i < len(he_groups) and he_groups[i]:
                        sec["aramaic"] = he_groups[i]
                        changed = True
                    if not section_has_real_translation(sec) and i < len(en_groups) and en_groups[i]:
                        sec["aramaic_translation"] = en_groups[i]
                        changed = True
                if changed:
                    populated += 1
                    print(f"  + populated {sugya['id']} ({n} sections from {ref})")

    return {"populated": populated, "skipped_already": skipped_already, "skipped_no_ref": skipped, "failed": failed, "total": total}


def main():
    with open(DATA, "r", encoding="utf-8") as f:
        content = json.load(f)

    stats = populate(content)

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

    print("\n=== Done ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()
