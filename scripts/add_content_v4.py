"""V4: Tanya Chapters 2 and 3 — real content, full word-by-word.
Idempotent — safe to re-run."""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "content.json"
with open(DATA, "r", encoding="utf-8") as f:
    content = json.load(f)


def make_words(pairs):
    return [{"a": h, "en": e, "yi": y} for h, e, y in pairs]


def tanya_chapter(num, title_en, title_yi, hebrew, translation_en, translation_yi, words, sections_data):
    """sections_data = list of dicts with text/text_yi/term/term_yi/definition/definition_yi/question/answers fields"""
    return {
        "id": f"tanya-ch{num}",
        "daf": f"Ch. {num}",
        "title": f"Tanya Chapter {num} — {title_en}",
        "title_yiddish": f"תניא קאַפּיטל {num} — {title_yi}",
        "illustration": "book",
        "aramaic": hebrew,
        "aramaic_translation": translation_en,
        "aramaic_translation_yiddish": translation_yi,
        "aramaic_words": make_words(words),
        "sections": [
            {
                "id": f"tanya-ch{num}-s{i+1}",
                "text": sd["text"],
                "text_yiddish": sd["text_yi"],
                "text_simple": sd.get("text_simple", sd["text"]),
                "text_simple_yiddish": sd.get("text_simple_yi", sd["text_yi"]),
                "term": sd["term"],
                "term_yiddish": sd["term_yi"],
                "definition": sd["definition"],
                "definition_yiddish": sd["definition_yi"],
                "question": sd.get("question", ""),
                "question_yiddish": sd.get("question_yi", ""),
                "explanation": sd.get("explanation", ""),
                "explanation_yiddish": sd.get("explanation_yi", ""),
                "answers": sd.get("answers", []),
                "rashi": "",
                "rashi_yiddish": "",
                "rashi_explanation": "",
                "rashi_explanation_yiddish": "",
                "tosfos": "",
                "tosfos_yiddish": "",
                "tosfos_explanation": "",
                "tosfos_explanation_yiddish": ""
            }
            for i, sd in enumerate(sections_data)
        ]
    }


# ============================================================
# TANYA CHAPTER 2 — The Nefesh HaElokis (Divine Soul)
# ============================================================
TANYA_CH2 = tanya_chapter(
    2,
    "The Divine Soul",
    "די געטלעכע נשמה",
    "וְנֶפֶשׁ הַשֵּׁנִית בְּיִשְׂרָאֵל הִיא חֵלֶק אֱלוֹקַהּ מִמַּעַל מַמָּשׁ, כְּמוֹ שֶׁכָּתוּב: וַיִּפַּח בְּאַפָּיו נִשְׁמַת חַיִּים, וְאַתָּה נְפַחְתָּהּ בִּי.",
    "And the second soul in a Jew is literally a part of God Above, as it is written: 'And He breathed into his nostrils a soul of life,' and 'You blew it into me.'",
    "און די צווייטע נשמה אין אַ ייִדן איז ממש אַ חלק פֿון השם פֿון אויבן, ווי עס שטייט: 'ויפח באפיו נשמת חיים,' און 'ואתה נפחתה בי.'",
    [
        ("וְנֶפֶשׁ הַשֵּׁנִית", "and the second soul", "און די צווייטע נשמה"),
        ("בְּיִשְׂרָאֵל", "in a Jew", "אין אַ ייִדן"),
        ("הִיא", "it is", "איז"),
        ("חֵלֶק אֱלוֹקַהּ", "a part of God", "אַ חלק פֿון השם"),
        ("מִמַּעַל", "from Above", "פֿון אויבן"),
        ("מַמָּשׁ", "literally", "ממש (טאַקע)"),
        ("כְּמוֹ שֶׁכָּתוּב", "as it is written", "ווי עס שטייט"),
        ("וַיִּפַּח", "and He breathed", "און ער האָט אַרײַנגעבלאָזן"),
        ("בְּאַפָּיו", "into his nostrils", "אין זײַנע נאָז־לעכלעך"),
        ("נִשְׁמַת חַיִּים", "a soul of life", "אַ נשמה פֿון לעבן"),
        ("וְאַתָּה", "and You", "און דו"),
        ("נְפַחְתָּהּ בִּי", "blew it into me", "האָסט עס אַרײַנגעבלאָזן אין מיר")
    ],
    [
        {
            "text": "The Tanya teaches that every Jew has TWO souls: the Nefesh HaBahamis (animal soul, shared with all living beings) and the Nefesh HaElokis (Divine soul, unique to Jews). The Divine soul is 'literally a part of God Above' — chelek Eloka mi-ma'al mamash.",
            "text_yi": "דער תניא לערנט אַז יעדער ייִד האָט צוויי נשמות: די נפש הבהמית (חיהשע נשמה, וואָס אַלע לעבעדיקע באַשעפֿענישן האָבן) און די נפש האלקית (געטלעכע נשמה, נאָר בײַ ייִדן). די געטלעכע נשמה איז ממש 'אַ חלק פֿון השם פֿון אויבן' — חלק אלוקה ממעל ממש.",
            "text_simple": "Every Jew has two souls: an animal soul (like all creatures) and a Divine soul — literally a piece of God.",
            "text_simple_yi": "יעדער ייִד האָט צוויי נשמות: אַ חיהשע און אַ געטלעכע — די געטלעכע איז ממש אַ חלק פֿון השם.",
            "term": "Chelek Eloka mi-ma'al mamash",
            "term_yi": "חלק אלוקה ממעל ממש",
            "definition": "'Literally a part of God Above' — the Tanya's foundational definition of the Jewish soul. Not a metaphor; the word 'mamash' (literally) is crucial.",
            "definition_yi": "'אַ חלק פֿון השם פֿון אויבן ממש' — דעם תניא׳ס יסוד־דעפֿיניציע פֿון די ייִדישע נשמה. נישט אַ משל; דאָס וואָרט 'ממש' איז גאָר וויכטיק.",
            "question": "What does 'chelek Eloka mi-ma'al mamash' mean?",
            "question_yi": "וואָס מיינט 'חלק אלוקה ממעל ממש'?",
            "explanation": "It means the Jewish soul is literally — not metaphorically — a portion of God Himself. The word 'mamash' (literally) is the Alter Rebbe's emphatic addition.",
            "explanation_yi": "ס׳מיינט אַז די ייִדישע נשמה איז טאַקע — נישט בלויז אַ משל — אַ חלק פֿון השם אַליין. דאָס וואָרט 'ממש' איז דעם אַלטן רבי׳ס באַטאָנונג.",
            "answers": [
                {"text": "A metaphor for spirituality", "text_yiddish": "אַ משל פֿאַר גײַסטיקייט", "correct": False},
                {"text": "Literally a part of God", "text_yiddish": "טאַקע אַ חלק פֿון השם", "correct": True},
                {"text": "A reward for good deeds", "text_yiddish": "אַ באַלוינונג פֿאַר מצוות", "correct": False}
            ]
        },
        {
            "text": "The Tanya proves this from the pasuk about Adam: 'and He breathed into his nostrils a soul of life.' The Zohar explains: 'One who blows, blows from within himself' — meaning, from his own innermost essence. So Hashem's 'blowing' of the soul into the body means the soul is drawn from His very innermost being.",
            "text_yi": "דער תניא ברענגט אַ ראיה פֿון דעם פּסוק וועגן אדם: 'ויפח באפיו נשמת חיים.' דער זוהר דערקלערט: 'מאן דנפח מתוכיה נפח' — דער וואָס בלאָזט, בלאָזט פֿון זיך זעלבסט. אַזוי, השם׳ס 'אַרײַנבלאָזן' פֿון די נשמה אין דעם גוף מיינט אַז די נשמה איז ארויסגעצויגן פֿון השם׳ס אייגענער מהות.",
            "text_simple": "The pasuk says Hashem breathed the soul into Adam. The Zohar explains: when you blow, it comes from inside you. So our soul comes from inside God Himself.",
            "text_simple_yi": "השם האָט אַרײַנגעבלאָזן די נשמה אין אדם. דער זוהר: ווען מ׳בלאָזט, קומט עס פֿון אינווייניק. אַזוי קומט אונדזער נשמה פֿון אינווייניק פֿון השם אַליין.",
            "term": "Vayipach be-Apav",
            "term_yi": "ויפח באפיו",
            "definition": "'And He breathed into his nostrils' — the pasuk in Bereishis 2:7 that the Tanya uses as proof that the soul is from God's own essence.",
            "definition_yi": "'ויפח באפיו' — דער פּסוק אין בראשית ב׳:ז׳ וואָס דער תניא ניצט ווי אַ ראיה אַז די נשמה איז פֿון השם׳ס אייגענער מהות.",
            "question": "What does the Zohar teach about blowing?",
            "question_yi": "וואָס לערנט דער זוהר וועגן בלאָזן?",
            "explanation": "'מאן דנפח מתוכיה נפח' — one who blows, blows from within himself. So the soul that Hashem 'blew' is drawn from His innermost essence.",
            "explanation_yi": "'מאן דנפח מתוכיה נפח' — דער וואָס בלאָזט, בלאָזט פֿון זיך זעלבסט. די נשמה איז פֿון השם׳ס פּנימיות.",
            "answers": [
                {"text": "Blowing makes air move", "text_yiddish": "בלאָזן מאַכט די לופֿט באַוועגן", "correct": False},
                {"text": "One who blows, blows from his innermost self", "text_yiddish": "דער וואָס בלאָזט, בלאָזט פֿון זיך זעלבסט", "correct": True},
                {"text": "Blowing requires effort", "text_yiddish": "בלאָזן פֿאָדערט אָנשטרענגונג", "correct": False}
            ]
        },
        {
            "text": "The Tanya continues: every Jewish soul descends from a higher source — from the level of Chochmah of Atzilus. Even the soul of the simplest Jew has a part rooted in this exalted spiritual world. This is what makes a Jew inherently connected to Hashem, no matter their actions.",
            "text_yi": "דער תניא גייט אָן: יעדע ייִדישע נשמה גייט אַראָפּ פֿון אַ העכערן מקור — פֿון די מדרגה פֿון חכמה דאצילות. אַפֿילו די נשמה פֿון דעם פּשוטסטן ייִדן האָט אַ חלק געוואָרצלט אין דער הויכער גײַסטיקער וועלט. דאָס איז וואָס מאַכט אַ ייִדן אינהערענט פֿאַרבונדן צו השם, אַפֿילו אויב ער טוט נישט אַזוי גוט.",
            "text_simple": "Every Jewish soul is rooted in Chochmah of Atzilus — the highest spiritual world. This makes every Jew connected to Hashem inherently.",
            "text_simple_yi": "יעדע ייִדישע נשמה איז געוואָרצלט אין חכמה דאצילות — די העכסטע גײַסטיקע וועלט. דאָס מאַכט אַז יעדער ייִד איז אינהערענט פֿאַרבונדן צו השם.",
            "term": "Chochmah of Atzilus",
            "term_yi": "חכמה דאצילות",
            "definition": "The supernal level of Wisdom in the world of Atzilus (the highest of the four spiritual worlds). The root-source of every Jewish soul according to Chassidus.",
            "definition_yi": "די העכסטע מדרגה פֿון חכמה אין דער וועלט פֿון אצילות (די העכסטע פֿון די פֿיר גײַסטיקע וועלטן). דער מקור־וואָרצל פֿון יעדער ייִדישער נשמה לויט חסידות.",
            "question": "What is the root of every Jewish soul?",
            "question_yi": "וואָס איז דער שורש פֿון יעדער ייִדישער נשמה?",
            "explanation": "Every Jewish soul is rooted in Chochmah of Atzilus, which means inherently connected to God's wisdom — regardless of the person's level.",
            "explanation_yi": "יעדע ייִדישע נשמה איז געוואָרצלט אין חכמה דאצילות, וואָס מיינט אינהערענט פֿאַרבונדן צו השם׳ס חכמה — אומאָפּהענגיק פֿון דעם מענטש׳ס דרגה.",
            "answers": [
                {"text": "The earth", "text_yiddish": "די ערד", "correct": False},
                {"text": "Chochmah of Atzilus", "text_yiddish": "חכמה דאצילות", "correct": True},
                {"text": "The four elements", "text_yiddish": "די פֿיר יסודות", "correct": False}
            ]
        }
    ]
)


# ============================================================
# TANYA CHAPTER 3 — The 10 powers of the soul
# ============================================================
TANYA_CH3 = tanya_chapter(
    3,
    "Ten faculties of the soul",
    "צען כוחות פֿון דער נשמה",
    "וְכָל בְּחִינָה וּמַדְרֵגָה מִשְּׁלֹשׁ אֵלֶּה — נֶפֶשׁ רוּחַ נְשָׁמָה — יֵשׁ בָּהּ עֶשֶׂר בְּחִינוֹת, כְּנֶגֶד עֶשֶׂר סְפִירוֹת עֶלְיוֹנוֹת שֶׁנִּשְׁתַּלְשְׁלוּ מֵהֶן, וְנֶחֱלָקוֹת לִשְׁתַּיִם: שֶׁהֵן שֵׂכֶל וּמִדּוֹת.",
    "Each of the three levels — Nefesh, Ruach, Neshamah — contains ten faculties, corresponding to the ten supernal Sefiros from which they descended. They divide into two groups: Sechel (intellect) and Midos (emotions).",
    "יעדע מדרגה פֿון די דרײַ — נפש, רוח, נשמה — האָט צען כוחות, קעגן די צען עליונע ספֿירות פֿון וועלכע זיי גייען אַרויס. זיי טיילן זיך אין צוויי: שכל און מידות.",
    [
        ("וְכָל בְּחִינָה", "and each level", "און יעדע מדרגה"),
        ("וּמַדְרֵגָה", "and rank", "און דרגה"),
        ("מִשְּׁלֹשׁ אֵלֶּה", "of these three", "פֿון די דרײַ"),
        ("נֶפֶשׁ רוּחַ נְשָׁמָה", "Nefesh, Ruach, Neshamah", "נפש, רוח, נשמה"),
        ("יֵשׁ בָּהּ", "has in it", "האָט אין זיך"),
        ("עֶשֶׂר בְּחִינוֹת", "ten faculties", "צען כוחות"),
        ("כְּנֶגֶד", "corresponding to", "קעגן"),
        ("עֶשֶׂר סְפִירוֹת", "ten Sefiros", "צען ספֿירות"),
        ("עֶלְיוֹנוֹת", "supernal", "עליונע"),
        ("שֶׁנִּשְׁתַּלְשְׁלוּ", "that descended", "וואָס זענען אַראָפּגעקומען"),
        ("מֵהֶן", "from them", "פֿון זיי"),
        ("וְנֶחֱלָקוֹת", "and divide", "און טיילן זיך"),
        ("לִשְׁתַּיִם", "into two", "אין צוויי"),
        ("שֵׂכֶל", "intellect", "שכל"),
        ("וּמִדּוֹת", "and emotions", "און מידות")
    ],
    [
        {
            "text": "Each soul-level (Nefesh, Ruach, Neshamah) contains 10 powers — like a mini-map of the 10 Sefiros above. These 10 split into two groups: 3 are intellectual (Sechel) and 7 are emotional (Midos). This is the chassidic anatomy of a soul.",
            "text_yi": "יעדע נשמה־דרגה (נפש, רוח, נשמה) האָט 10 כוחות — ווי אַ מיני־מאַפּע פֿון די 10 ספֿירות פֿון אויבן. די 10 טיילן זיך אין צוויי: 3 שכלדיקע און 7 רגשותדיקע. דאָס איז די חסידישע אַנאַטאָמיע פֿון אַ נשמה.",
            "text_simple": "Every soul-level has 10 inner powers — like 10 sefiros inside us. 3 for thinking, 7 for feeling.",
            "text_simple_yi": "יעדע נשמה־דרגה האָט 10 אינערלעכע כוחות. 3 פֿאַר טראַכטן, 7 פֿאַר פֿילן.",
            "term": "10 Faculties",
            "term_yi": "10 כוחות",
            "definition": "The ten powers of the soul, mirroring the ten supernal Sefiros: 3 intellectual + 7 emotional.",
            "definition_yi": "די 10 כוחות פֿון דער נשמה, ווי די 10 עליונע ספֿירות: 3 שכלדיקע + 7 רגשותדיקע.",
            "question": "How are the 10 soul-faculties divided?",
            "question_yi": "ווי טיילן זיך די 10 נשמה־כוחות?",
            "explanation": "Three are intellectual (Sechel — Chochmah, Binah, Daas) and seven are emotional (Midos — Chesed through Malchus).",
            "explanation_yi": "דרײַ זענען שכלדיקע (חכמה, בינה, דעת) און זיבן זענען רגשותדיקע (חסד ביז מלכות).",
            "answers": [
                {"text": "All 10 are equal", "text_yiddish": "אַלע 10 זענען גלײַך", "correct": False},
                {"text": "3 intellect (Sechel) + 7 emotion (Midos)", "text_yiddish": "3 שכל + 7 מידות", "correct": True},
                {"text": "5 spiritual + 5 physical", "text_yiddish": "5 גײַסטיקע + 5 גשמיותדיקע", "correct": False}
            ]
        },
        {
            "text": "The three intellectual faculties are called ChaBaD: Chochmah (flash of insight, the 'aha!'), Binah (developing the insight into understanding), and Daas (connecting the understanding deeply to oneself). Chassidus is named for these — the chassid works to make ChaBaD shape his emotions and actions.",
            "text_yi": "די דרײַ שכלדיקע כוחות הייסן חב\"ד: חכמה (אַ בליץ פֿון השגה, דער 'אַהאַ!'), בינה (אַנטוויקלען די השגה אין פֿאַרשטענדעניש), דעת (פֿאַרבינדן די פֿאַרשטענדעניש טיף צו זיך). חסידות איז גערופֿן אויף די — דער חסיד אַרבעט אַז חב\"ד זאָל מאַכן זײַנע רגשות און מעשים.",
            "text_simple": "Three mind-powers: Chochmah (sudden insight), Binah (understanding it deeply), Daas (making it part of who you are).",
            "text_simple_yi": "דרײַ שכל־כוחות: חכמה (פּלוצלינגע השגה), בינה (טיפֿע פֿאַרשטענדעניש), דעת (מאַכן עס אַ טייל פֿון זיך).",
            "term": "ChaBaD",
            "term_yi": "חב\"ד",
            "definition": "Acronym for Chochmah-Binah-Daas, the three intellectual sefiros. The name of the Chabad Chassidic movement reflects this emphasis on the mind shaping the heart.",
            "definition_yi": "ראשי תיבות פֿון חכמה־בינה־דעת. דער נאָמען פֿון חב\"ד חסידות וויזט די באַטאָנונג אַז דער שכל זאָל פֿאָרמירן דעם האַרץ.",
            "question": "What is Daas?",
            "question_yi": "וואָס איז דעת?",
            "explanation": "Daas is the connecting faculty — taking the understanding (Binah) and making it real and personally felt. Without Daas, knowledge stays abstract.",
            "explanation_yi": "דעת איז דער פֿאַרבינדער — נעמען די בינה און מאַכן עס פּערזענלעך אינווייניק. אָן דעת בלײַבט וויסן אַבסטראַקט.",
            "answers": [
                {"text": "A flash of new insight", "text_yiddish": "אַ בליץ פֿון נײַע השגה", "correct": False},
                {"text": "Connecting understanding deeply to oneself", "text_yiddish": "פֿאַרבינדן פֿאַרשטענדעניש טיף צו זיך", "correct": True},
                {"text": "Memorizing facts", "text_yiddish": "אויסנווייניק לערנען פֿאַקטן", "correct": False}
            ]
        },
        {
            "text": "The seven emotional faculties (Midos) flow from the intellect: Chesed (loving-kindness), Gevurah (strength/restraint), Tiferes (harmony), Netzach (perseverance), Hod (humility/yielding), Yesod (bonding), Malchus (kingship/receiving). The pattern: what the mind grasps, the heart eventually feels.",
            "text_yi": "די זיבן רגשותדיקע כוחות (מידות) פֿליסן פֿון דעם שכל: חסד (גוטסקייט), גבורה (שטאַרקייט, צוריקהאַלטן), תפארת (האַרמאָניע), נצח (אויסהאַלטן), הוד (ענוה, נאָכגעבן), יסוד (פֿאַרבינדן), מלכות (קעניגרײַך, אויפֿנעמען). דער מוסטער: וואָס דער שכל באַגרײַפֿט, פֿילט דאָס האַרץ סוף־כל־סוף.",
            "text_simple": "Seven heart-feelings flow from the mind: love, restraint, harmony, persistence, humility, bonding, receiving.",
            "text_simple_yi": "זיבן הערצנס־געפֿילן קומען פֿון דעם שכל: ליבע, צוריקהאַלטן, האַרמאָניע, אויסדויער, ענוה, פֿאַרבינדן, אויפֿנעמען.",
            "term": "Seven Midos",
            "term_yi": "זיבן מידות",
            "definition": "Chesed, Gevurah, Tiferes, Netzach, Hod, Yesod, Malchus — the seven emotional/character faculties that the intellect (ChaBaD) shapes.",
            "definition_yi": "חסד, גבורה, תפארת, נצח, הוד, יסוד, מלכות — די זיבן רגשותדיקע כוחות וואָס דער שכל פֿאָרמירט.",
            "question": "How do Midos relate to ChaBaD?",
            "question_yi": "ווי האַלטן זיך מידות צו חב\"ד?",
            "explanation": "Midos (emotions) flow FROM ChaBaD (intellect). What you think about deeply (Daas), you eventually feel. This is the foundation of Chabad's avodah.",
            "explanation_yi": "מידות (רגשות) קומען פֿון חב\"ד (שכל). וואָס מ׳טראַכט אויף טיף (דעת), פֿילט מען סוף־כל־סוף. דאָס איז דער יסוד פֿון חב\"ד עבודה.",
            "answers": [
                {"text": "They are unrelated", "text_yiddish": "זיי האָבן קיין שייכות", "correct": False},
                {"text": "Midos flow from intellect — what you think, you feel", "text_yiddish": "מידות קומען פֿון שכל — וואָס מ׳טראַכט, פֿילט מען", "correct": True},
                {"text": "Midos come first, then intellect", "text_yiddish": "מידות פֿריִער, דערנאָך שכל", "correct": False}
            ]
        }
    ]
)


# ============================================================
# Apply: add chapters 2 and 3 to Tanya's perek 1 (Likutei Amarim)
# ============================================================
tanya = next((m for m in content["masechtos"] if m["id"] == "tanya"), None)
if tanya is None:
    raise RuntimeError("Tanya masechta not found — run add_content_v3.py first.")

perek = tanya["perakim"][0]
existing_ids = {s["id"] for s in perek["sugyos"]}

for ch in (TANYA_CH2, TANYA_CH3):
    if ch["id"] in existing_ids:
        for i, s in enumerate(perek["sugyos"]):
            if s["id"] == ch["id"]:
                perek["sugyos"][i] = ch
                print(f"+ replaced {ch['title']}")
                break
    else:
        perek["sugyos"].append(ch)
        print(f"+ added {ch['title']}")

with open(DATA, "w", encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False, indent=2)

print("\nTanya now has", len(perek["sugyos"]), "chapters")
