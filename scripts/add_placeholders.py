"""One-off generator: add Rashi/Tosfos/text_simple placeholders to real sections,
and add placeholder dapim 3a–10b to Masechet Shabbos. Run once."""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "content.json"

with open(DATA, "r", encoding="utf-8") as f:
    content = json.load(f)


PH = {
    "rashi": "[RASHI PLACEHOLDER — paste Rashi text here]",
    "rashi_yiddish": "[ראַשי פּלעצהאָלדער]",
    "rashi_explanation": "[Plain English explanation of what Rashi says — replace this]",
    "rashi_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון ראַשי]",
    "tosfos": "[TOSFOS PLACEHOLDER — paste Tosfos text here]",
    "tosfos_yiddish": "[תּוספּות פּלעצהאָלדער]",
    "tosfos_explanation": "[Plain English explanation of what Tosfos says — replace this]",
    "tosfos_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון תּוספּות]",
    "text_simple": "[SIMPLIFIED PLACEHOLDER — 1-2 sentence plain English summary]",
    "text_simple_yiddish": "[פּלעצהאָלדער — קורצע פּשוטע איבערזעצונג]"
}


def add_commentary_fields(section):
    for key, val in PH.items():
        section.setdefault(key, val)


def make_placeholder_section(daf, sugya_idx, section_idx, correct_idx):
    sid = f"sh{daf}-p{sugya_idx}-s{section_idx}"
    section = {
        "id": sid,
        "text": f"[PLACEHOLDER — Daf {daf}, Sugya {sugya_idx}, Section {section_idx} — replace with real content]",
        "text_yiddish": f"[פּלעצהאָלדער — בלאַט {daf}, סוגיא {sugya_idx}, אָפּשניט {section_idx}]",
        "text_simple": "[SIMPLIFIED PLACEHOLDER]",
        "text_simple_yiddish": "[פּלעצהאָלדער]",
        "term": "[TERM PLACEHOLDER]",
        "term_yiddish": "[טערמין פּלעצהאָלדער]",
        "definition": "[DEFINITION PLACEHOLDER]",
        "definition_yiddish": "[הגדרה פּלעצהאָלדער]",
        "question": "[QUESTION PLACEHOLDER]",
        "question_yiddish": "[פֿראַגע פּלעצהאָלדער]",
        "explanation": "[EXPLANATION PLACEHOLDER]",
        "explanation_yiddish": "[דערקלערונג פּלעצהאָלדער]",
        "rashi": PH["rashi"],
        "rashi_yiddish": PH["rashi_yiddish"],
        "rashi_explanation": PH["rashi_explanation"],
        "rashi_explanation_yiddish": PH["rashi_explanation_yiddish"],
        "tosfos": PH["tosfos"],
        "tosfos_yiddish": PH["tosfos_yiddish"],
        "tosfos_explanation": PH["tosfos_explanation"],
        "tosfos_explanation_yiddish": PH["tosfos_explanation_yiddish"],
        "answers": []
    }
    for i in range(3):
        section["answers"].append({
            "text": f"[ANSWER {chr(65+i)} PLACEHOLDER]",
            "text_yiddish": f"[ענטפֿער {chr(0x05D0+i)} פּלעצהאָלדער]",
            "correct": i == correct_idx
        })
    return section


def make_placeholder_sugya(daf, sugya_idx):
    return {
        "id": f"shab-{daf}-p{sugya_idx}",
        "daf": daf,
        "title": f"[PLACEHOLDER — Daf {daf} Topic {sugya_idx}]",
        "title_yiddish": f"[פּלעצהאָלדער — בלאַט {daf} נושׂא {sugya_idx}]",
        "illustration": "scroll",
        "aramaic": "",
        "aramaic_translation": "",
        "aramaic_translation_yiddish": "",
        "aramaic_words": [],
        "sections": [
            make_placeholder_section(daf, sugya_idx, 1, 0),
            make_placeholder_section(daf, sugya_idx, 2, 1),
            make_placeholder_section(daf, sugya_idx, 3, 2)
        ]
    }


# Pass 1: add commentary placeholders to all existing real sections
for m in content["masechtos"]:
    for perek in m["perakim"]:
        for sugya in perek["sugyos"]:
            for section in sugya["sections"]:
                add_commentary_fields(section)


# Pass 2: add new placeholder dapim 3a-10b to Shabbos masechta
new_dapim = ["3a", "3b", "4a", "4b", "5a", "5b", "6b", "7a", "7b", "8a", "8b", "9a", "10a", "10b"]

# Find Shabbos masechta
shabbos = None
for m in content["masechtos"]:
    if m["id"] == "shabbos":
        shabbos = m
        break

# Add a new perek for the placeholder dapim
placeholder_perek = {
    "num": 1,
    "name": "Yetzi'os HaShabbos (continued)",
    "name_yiddish": "יציאות השבת (המשך)",
    "name_en": "More dapim (placeholder content)",
    "name_en_yiddish": "מער בלעטער (פּלעצהאָלדער)",
    "sugyos": []
}

for daf in new_dapim:
    placeholder_perek["sugyos"].append(make_placeholder_sugya(daf, 1))
    placeholder_perek["sugyos"].append(make_placeholder_sugya(daf, 2))

shabbos["perakim"].append(placeholder_perek)


with open(DATA, "w", encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False, indent=2)


print(f"Done. Total masechtos: {len(content['masechtos'])}")
for m in content["masechtos"]:
    total = sum(len(p["sugyos"]) for p in m["perakim"])
    print(f"  {m['name']}: {len(m['perakim'])} perakim, {total} sugyos")
