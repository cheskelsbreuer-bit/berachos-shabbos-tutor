"""V7: Restructure Chumash and Pirkei Avos so each perek = ONE sugya
with all pesukim/mishnayos as sections (so Plain Read shows the whole perek).
Idempotent."""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "content.json"
with open(DATA, "r", encoding="utf-8") as f:
    content = json.load(f)


def merge_sugyos_into_one(masechta_id, new_sugya_id, new_title, new_title_yi, new_daf, illustration):
    """For the given masechta, merge ALL sugyos in its perakim into one sugya per perek.
       Each merged sugya keeps the section-level data (text, term, rashi, etc.)
       and lifts each old sugya's aramaic into its single section."""
    masechta = next((m for m in content["masechtos"] if m["id"] == masechta_id), None)
    if not masechta:
        print(f"  ! {masechta_id} not found")
        return

    for perek in masechta["perakim"]:
        # Skip if already merged (only one sugya and it has many sections)
        if len(perek["sugyos"]) == 1 and len(perek["sugyos"][0]["sections"]) > 1:
            print(f"  ↺ {masechta_id} perek {perek.get('num')} already merged, skipping")
            continue

        merged_sections = []
        # Sort the existing sugyos by their daf field (numerically where possible) to keep order
        sugyos_sorted = perek["sugyos"]
        for sug in sugyos_sorted:
            # Each old sugya had one section. Lift the aramaic + words into that section.
            for sec in sug["sections"]:
                # Carry over the aramaic/words from sugya if not already on section
                if not sec.get("aramaic") and sug.get("aramaic"):
                    sec["aramaic"] = sug["aramaic"]
                if not sec.get("aramaic_translation") and sug.get("aramaic_translation"):
                    sec["aramaic_translation"] = sug["aramaic_translation"]
                if not sec.get("aramaic_translation_yiddish") and sug.get("aramaic_translation_yiddish"):
                    sec["aramaic_translation_yiddish"] = sug["aramaic_translation_yiddish"]
                if not sec.get("aramaic_words") and sug.get("aramaic_words"):
                    sec["aramaic_words"] = sug["aramaic_words"]
                # Mark with a friendly label (e.g. "1:1" for Bereishis 1:1)
                sec["marker"] = sug.get("daf", "")
                merged_sections.append(sec)

        new_sugya = {
            "id": new_sugya_id.format(num=perek.get("num", 1)),
            "daf": new_daf.format(num=perek.get("num", 1)),
            "title": new_title.format(num=perek.get("num", 1)),
            "title_yiddish": new_title_yi.format(num=perek.get("num", 1)),
            "illustration": illustration,
            "aramaic": "",  # section-level only
            "aramaic_translation": "",
            "aramaic_translation_yiddish": "",
            "aramaic_words": [],
            "sections": merged_sections
        }
        perek["sugyos"] = [new_sugya]
        print(f"+ merged {masechta_id} perek {perek.get('num')}: {len(merged_sections)} sections")


# Chumash Bereishis: perek 1 = 5 pesukim
merge_sugyos_into_one(
    "chumash-bereishis",
    "chumash-bereishis-p{num}",
    "Bereishis Perek {num}",
    "בראשית פּרק {num}",
    "Perek {num}",
    "scroll"
)

# Pirkei Avos: perek 1 = 3 mishnayos
merge_sugyos_into_one(
    "pirkei-avos",
    "pirkei-avos-p{num}",
    "Pirkei Avos Perek {num}",
    "פּרקי אבות פּרק {num}",
    "Perek {num}",
    "scroll"
)

with open(DATA, "w", encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False, indent=2)

print("\nFinal:")
for m in content["masechtos"]:
    print(f"  [{m.get('content_type','?')}] {m['name']}: {sum(len(p['sugyos']) for p in m['perakim'])} sugyos, "
          f"{sum(len(s['sections']) for p in m['perakim'] for s in p['sugyos'])} sections total")
