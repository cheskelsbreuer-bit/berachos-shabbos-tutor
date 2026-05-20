"""Build a MUCH bigger content.json by pulling verified text from Sefaria.

Adds:
  Gemara:
    - Shabbos 2a-30b   (~58 amudim)
    - Berachos 2a-20b  (~38 amudim)
  Chumash:
    - Bereishis 1-30, Shemos 1-15, Vayikra 1-10, Bamidbar 1-10, Devarim 1-10
  Tanya:
    - Likkutei Amarim 1-15
  Mishnayos:
    - Berachos, Shabbos, Sukkah, Megillah, Yoma, Pirkei Avos
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
CACHE_FILE = Path(__file__).resolve().parent / ".sefaria_full_cache.json"


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
    return re.sub(r"\s+", " ", s).strip()


def flatten(x):
    if x is None or x == "":
        return []
    if isinstance(x, str):
        c = strip_html(x)
        return [c] if c else []
    if isinstance(x, list):
        out = []
        for item in x:
            out.extend(flatten(item))
        return out
    return []


CACHE = load_cache()


def fetch_sefaria(ref):
    if ref in CACHE:
        return CACHE[ref]
    url = "https://www.sefaria.org/api/texts/" + urllib.parse.quote(ref) + "?context=0&commentary=0"
    print(f"  fetching {ref} …")
    time.sleep(0.35)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "tap-to-learn/1.0"})
        with urllib.request.urlopen(req, timeout=25) as r:
            data = json.loads(r.read().decode("utf-8"))
        if data.get("error"):
            print(f"  ! {ref}: {data['error'][:60]}")
            CACHE[ref] = None
            save_cache(CACHE)
            return None
        result = {
            "ref": data.get("ref", ref),
            "he": flatten(data.get("he")),
            "text": flatten(data.get("text")),
        }
        CACHE[ref] = result
        save_cache(CACHE)
        return result
    except Exception as e:
        print(f"  ! {ref} failed: {e}")
        return None


def build_sections(data):
    he, en = data["he"], data["text"]
    n = max(len(he), len(en))
    out = []
    for i in range(n):
        h, e = (he[i] if i < len(he) else ""), (en[i] if i < len(en) else "")
        if not h and not e:
            continue
        out.append({
            "id": f"sec-{i + 1}",
            "marker": str(i + 1),
            "aramaic": h, "aramaic_translation": e,
            "aramaic_translation_yiddish": "", "aramaic_words": [],
            "text": e, "text_yiddish": "",
            "text_simple": e, "text_simple_yiddish": "",
            "term": "", "term_yiddish": "",
            "definition": "", "definition_yiddish": "",
            "question": "", "question_yiddish": "",
            "explanation": "", "explanation_yiddish": "",
            "answers": [],
            "rashi": "", "rashi_yiddish": "",
            "rashi_explanation": "", "rashi_explanation_yiddish": "",
            "tosfos": "", "tosfos_yiddish": "",
            "tosfos_explanation": "", "tosfos_explanation_yiddish": ""
        })
    return out


def sugya_from(ref, sugya_id, title, title_yi, illustration="scroll"):
    data = fetch_sefaria(ref)
    if not data:
        return None
    return {
        "id": sugya_id, "daf": title.split(" ")[-1] if " " in title else title,
        "title": title, "title_yiddish": title_yi,
        "illustration": illustration, "sefaria_ref": ref,
        "aramaic": "", "aramaic_translation": "", "aramaic_translation_yiddish": "",
        "aramaic_words": [], "sections": build_sections(data)
    }


# ===== GEMARA =====
def build_gemara_masechta(masechta_id, sefaria_name, display_name, display_yi, start, end_inclusive):
    sugyos = []
    for n in range(start, end_inclusive + 1):
        for amud in ("a", "b"):
            ref = f"{sefaria_name}.{n}{amud}"
            sug = sugya_from(ref, f"{masechta_id}-{n}{amud}", f"{display_name} {n}{amud}", f"{display_yi} {n}{amud}", "scroll")
            if sug: sugyos.append(sug)
    return {
        "id": masechta_id, "name": display_name, "name_yiddish": display_yi,
        "content_type": "gemara", "default_mode": "plain_read",
        "perakim": [{
            "num": 1, "name": f"{display_name} {start}-{end_inclusive}", "name_yiddish": f"{display_yi}",
            "name_en": f"Dapim {start}-{end_inclusive}", "name_en_yiddish": f"דפים {start}-{end_inclusive}",
            "sugyos": sugyos
        }]
    }


# ===== CHUMASH =====
def build_chumash_sefer(sefer_id, sefaria_name, display_name, display_yi, end_perek):
    sugyos = []
    for ch in range(1, end_perek + 1):
        ref = f"{sefaria_name}.{ch}"
        sug = sugya_from(ref, f"{sefer_id}-p{ch}", f"{display_name} Perek {ch}", f"{display_yi} פּרק {ch}", "scroll")
        if sug: sugyos.append(sug)
    return {
        "id": sefer_id, "name": display_name, "name_yiddish": display_yi,
        "content_type": "chumash", "default_mode": "plain_read",
        "perakim": [{
            "num": 1, "name": f"Perakim 1-{end_perek}", "name_yiddish": f"פּרקים א׳-{end_perek}",
            "name_en": "Chapters", "name_en_yiddish": "פּרקים",
            "sugyos": sugyos
        }]
    }


# ===== MISHNAYOS =====
def build_mishnah_masechta(masechta_id, sefaria_name, display_name, display_yi, end_perek):
    sugyos = []
    for ch in range(1, end_perek + 1):
        ref = f"{sefaria_name}.{ch}"
        sug = sugya_from(ref, f"{masechta_id}-p{ch}", f"{display_name} Perek {ch}", f"{display_yi} פּרק {ch}", "scroll")
        if sug: sugyos.append(sug)
    return {
        "id": masechta_id, "name": display_name, "name_yiddish": display_yi,
        "content_type": "mishnayos", "default_mode": "plain_read",
        "perakim": [{
            "num": 1, "name": f"Perakim 1-{end_perek}", "name_yiddish": f"פּרקים א׳-{end_perek}",
            "name_en": "All chapters", "name_en_yiddish": "אַלע פּרקים",
            "sugyos": sugyos
        }]
    }


# ===== TANYA =====
def build_tanya(end_ch):
    sugyos = []
    for ch in range(1, end_ch + 1):
        ref = f"Tanya, Part I; Likkutei Amarim {ch}"
        sug = sugya_from(ref, f"tanya-ch{ch}", f"Tanya Chapter {ch}", f"תניא פּרק {ch}", "book")
        if sug: sugyos.append(sug)
    return {
        "id": "tanya", "name": "Tanya", "name_yiddish": "תניא",
        "content_type": "tanya", "default_mode": "plain_read",
        "perakim": [{
            "num": 1, "name": "Likkutei Amarim", "name_yiddish": "ליקוטי אמרים",
            "name_en": f"Chapters 1-{end_ch}", "name_en_yiddish": f"פּרקים א׳-{end_ch}",
            "sugyos": sugyos
        }]
    }


def main():
    masechtos = []
    print("=== GEMARA ===")
    masechtos.append(build_gemara_masechta("shabbos", "Shabbat", "Shabbos", "שבת", 2, 30))
    masechtos.append(build_gemara_masechta("berachos", "Berakhot", "Berachos", "ברכות", 2, 20))
    print("=== TANYA ===")
    masechtos.append(build_tanya(15))
    print("=== CHUMASH ===")
    masechtos.append(build_chumash_sefer("chumash-bereishis", "Genesis", "Bereishis", "בראשית", 30))
    masechtos.append(build_chumash_sefer("chumash-shemos", "Exodus", "Shemos", "שמות", 15))
    masechtos.append(build_chumash_sefer("chumash-vayikra", "Leviticus", "Vayikra", "ויקרא", 10))
    masechtos.append(build_chumash_sefer("chumash-bamidbar", "Numbers", "Bamidbar", "במדבר", 10))
    masechtos.append(build_chumash_sefer("chumash-devarim", "Deuteronomy", "Devarim", "דברים", 10))
    print("=== MISHNAYOS ===")
    masechtos.append(build_mishnah_masechta("pirkei-avos", "Pirkei Avot", "Pirkei Avos", "פּרקי אבות", 6))
    masechtos.append(build_mishnah_masechta("mishnah-berachos", "Mishnah Berakhot", "Mishnah Berachos", "משנה ברכות", 9))
    masechtos.append(build_mishnah_masechta("mishnah-shabbat", "Mishnah Shabbat", "Mishnah Shabbos", "משנה שבת", 15))
    masechtos.append(build_mishnah_masechta("mishnah-sukkah", "Mishnah Sukkah", "Mishnah Sukkah", "משנה סוכה", 5))
    masechtos.append(build_mishnah_masechta("mishnah-megillah", "Mishnah Megillah", "Mishnah Megillah", "משנה מגילה", 4))
    masechtos.append(build_mishnah_masechta("mishnah-yoma", "Mishnah Yoma", "Mishnah Yoma", "משנה יומא", 8))

    content = {"masechtos": masechtos}
    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

    print("\n=== Done ===")
    for m in content["masechtos"]:
        for p in m["perakim"]:
            n_sug = len(p["sugyos"])
            n_sec = sum(len(s["sections"]) for s in p["sugyos"])
            print(f"  [{m.get('content_type')}] {m['name']}: {n_sug} sugyos, {n_sec} sections")


if __name__ == "__main__":
    main()
