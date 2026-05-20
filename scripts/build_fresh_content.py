"""Fresh content builder — pulls verified text from Sefaria for:
  - Shabbos 2a through 10b (17 amudim)
  - Tanya Likkutei Amarim chapters 1 through 5

Builds a clean content.json. No hand-curated text, no placeholders.
Tap-on-word in the app will use Sefaria's lexicon API live at runtime."""
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "content.json"
DATA.parent.mkdir(exist_ok=True)


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


def fetch_sefaria(ref):
    url = "https://www.sefaria.org/api/texts/" + urllib.parse.quote(ref) + "?context=0&commentary=0"
    print(f"  fetching {ref}…")
    time.sleep(0.4)
    req = urllib.request.Request(url, headers={"User-Agent": "tap-to-learn/1.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode("utf-8"))
    if data.get("error"):
        raise RuntimeError(f"Sefaria error for {ref}: {data['error']}")
    return {
        "ref": data.get("ref", ref),
        "he": flatten(data.get("he")),
        "text": flatten(data.get("text")),
    }


def build_sections(sefaria_data):
    """Each Sefaria paragraph becomes one section."""
    he_lines = sefaria_data["he"]
    en_lines = sefaria_data["text"]
    n = max(len(he_lines), len(en_lines))
    sections = []
    for i in range(n):
        he = he_lines[i] if i < len(he_lines) else ""
        en = en_lines[i] if i < len(en_lines) else ""
        if not he and not en:
            continue
        sections.append({
            "id": f"sec-{i + 1}",
            "marker": str(i + 1),
            "aramaic": he,
            "aramaic_translation": en,
            "aramaic_translation_yiddish": "",
            "aramaic_words": [],
            "text": en,           # used by story mode + explanation fallback
            "text_yiddish": "",
            "text_simple": en,
            "text_simple_yiddish": "",
            "term": "",
            "term_yiddish": "",
            "definition": "",
            "definition_yiddish": "",
            "question": "",
            "question_yiddish": "",
            "explanation": "",
            "explanation_yiddish": "",
            "answers": [],
            "rashi": "", "rashi_yiddish": "",
            "rashi_explanation": "", "rashi_explanation_yiddish": "",
            "tosfos": "", "tosfos_yiddish": "",
            "tosfos_explanation": "", "tosfos_explanation_yiddish": ""
        })
    return sections


def build_gemara_shabbos():
    print("Building Shabbos 2a-10b …")
    sugyos = []
    for n in range(2, 11):
        for amud in ("a", "b"):
            daf = f"{n}{amud}"
            ref = f"Shabbat.{daf}"
            data = fetch_sefaria(ref)
            sugyos.append({
                "id": f"shabbos-{daf}",
                "daf": daf,
                "title": f"Shabbos {daf}",
                "title_yiddish": f"שבת {daf}",
                "illustration": "scroll",
                "sefaria_ref": ref,
                "aramaic": "",
                "aramaic_translation": "",
                "aramaic_translation_yiddish": "",
                "aramaic_words": [],
                "sections": build_sections(data)
            })
    return {
        "id": "shabbos",
        "name": "Shabbos",
        "name_yiddish": "שבת",
        "content_type": "gemara",
        "default_mode": "plain_read",
        "perakim": [
            {
                "num": 1,
                "name": "Daf 2 — 10",
                "name_yiddish": "דף ב׳ — י׳",
                "name_en": "First nine dapim",
                "name_en_yiddish": "ערשטע נײַן דפֿים",
                "sugyos": sugyos
            }
        ]
    }


def build_tanya():
    print("Building Tanya chapters 1-5 …")
    sugyos = []
    for ch in range(1, 6):
        ref = f"Tanya, Part I; Likkutei Amarim {ch}"
        data = fetch_sefaria(ref)
        sugyos.append({
            "id": f"tanya-ch{ch}",
            "daf": f"Ch. {ch}",
            "title": f"Tanya Chapter {ch}",
            "title_yiddish": f"תניא פּרק {ch}",
            "illustration": "book",
            "sefaria_ref": ref,
            "aramaic": "",
            "aramaic_translation": "",
            "aramaic_translation_yiddish": "",
            "aramaic_words": [],
            "sections": build_sections(data)
        })
    return {
        "id": "tanya",
        "name": "Tanya",
        "name_yiddish": "תניא",
        "content_type": "tanya",
        "default_mode": "plain_read",
        "perakim": [
            {
                "num": 1,
                "name": "Likkutei Amarim",
                "name_yiddish": "ליקוטי אמרים",
                "name_en": "Chapters 1-5",
                "name_en_yiddish": "פּרקים א׳–ה׳",
                "sugyos": sugyos
            }
        ]
    }


def build_chumash():
    print("Building Chumash Bereishis perakim 1-5 …")
    sugyos = []
    for ch in range(1, 6):
        ref = f"Genesis.{ch}"
        data = fetch_sefaria(ref)
        sugyos.append({
            "id": f"chumash-bereishis-p{ch}",
            "daf": f"Perek {ch}",
            "title": f"Bereishis Perek {ch}",
            "title_yiddish": f"בראשית פּרק {ch}",
            "illustration": "scroll",
            "sefaria_ref": ref,
            "aramaic": "", "aramaic_translation": "", "aramaic_translation_yiddish": "",
            "aramaic_words": [],
            "sections": build_sections(data)
        })
    return {
        "id": "chumash-bereishis",
        "name": "Bereishis",
        "name_yiddish": "בראשית",
        "content_type": "chumash",
        "default_mode": "plain_read",
        "perakim": [
            {"num": 1, "name": "Perakim 1-5", "name_yiddish": "פּרקים א׳–ה׳",
             "name_en": "First five chapters", "name_en_yiddish": "ערשטע פֿינף פּרקים",
             "sugyos": sugyos}
        ]
    }


def build_pirkei_avos():
    print("Building Pirkei Avos perakim 1-6 …")
    sugyos = []
    for ch in range(1, 7):
        ref = f"Pirkei Avot.{ch}"
        data = fetch_sefaria(ref)
        sugyos.append({
            "id": f"pirkei-avos-p{ch}",
            "daf": f"Perek {ch}",
            "title": f"Pirkei Avos Perek {ch}",
            "title_yiddish": f"פּרקי אבות פּרק {ch}",
            "illustration": "scroll",
            "sefaria_ref": ref,
            "aramaic": "", "aramaic_translation": "", "aramaic_translation_yiddish": "",
            "aramaic_words": [],
            "sections": build_sections(data)
        })
    return {
        "id": "pirkei-avos",
        "name": "Pirkei Avos",
        "name_yiddish": "פּרקי אבות",
        "content_type": "mishnayos",
        "default_mode": "plain_read",
        "perakim": [
            {"num": 1, "name": "Perakim 1-6", "name_yiddish": "פּרקים א׳–ו׳",
             "name_en": "All six chapters", "name_en_yiddish": "אַלע זעקס פּרקים",
             "sugyos": sugyos}
        ]
    }


def main():
    content = {
        "masechtos": [
            build_gemara_shabbos(),
            build_tanya(),
            build_chumash(),
            build_pirkei_avos()
        ]
    }

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

    print("\nDone. Summary:")
    for m in content["masechtos"]:
        for p in m["perakim"]:
            for s in p["sugyos"]:
                print(f"  {s['id']}: {len(s['sections'])} sections, "
                      f"{sum(len(sec['aramaic']) for sec in s['sections'])} chars Hebrew")


if __name__ == "__main__":
    main()
