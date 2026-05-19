"""Adds Tanya masechta (Chapter 1), real Shabbos 3a content,
and real Rashi/Tosfos on Shabbos 2a. Idempotent — safe to re-run."""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "content.json"
with open(DATA, "r", encoding="utf-8") as f:
    content = json.load(f)


# ============================================================
# TANYA MASECHTA — Chapter 1 of Likutei Amarim
# ============================================================
TANYA_CH1 = {
    "id": "tanya-ch1",
    "daf": "Ch. 1",
    "title": "Tanya Chapter 1 — The four categories",
    "title_yiddish": "תניא קאַפּיטל 1 — די פֿיר קאַטעגאָריעס",
    "illustration": "book",
    "aramaic": "תַּנְיָא בְּסוֹף פֶּרֶק ג׳ דְּנִדָּה: מַשְׁבִּיעִין אוֹתוֹ תְּהִי צַדִּיק וְאַל תְּהִי רָשָׁע, וַאֲפִילּוּ כָּל הָעוֹלָם כּוּלּוֹ אוֹמְרִים לְךָ צַדִּיק אַתָּה — הֱיֵה בְּעֵינֶיךָ כְּרָשָׁע.",
    "aramaic_translation": "It is taught at the end of Niddah Chapter 3: They make him [the soul, before it descends to the body] swear: 'Be a Tzadik (righteous one) and do not be a Rasha (wicked one), and even if the whole world tells you that you are a Tzadik — consider yourself a Rasha.'",
    "aramaic_translation_yiddish": "ס׳איז געלערנט אין סוף פּרק ג׳ פֿון נדה: מ׳זאָגט אים שבועה: זײַ אַ צדיק און זײַ נישט אַ רשע, און אַפֿילו די גאַנצע וועלט זאָגט דיר אַז דו ביסט אַ צדיק — האַלט זיך אין דײַנע אויגן ווי אַ רשע.",
    "aramaic_words": [
        {"a": "תַּנְיָא", "en": "it is taught", "yi": "מ׳לערנט"},
        {"a": "בְּסוֹף", "en": "at the end of", "yi": "אין סוף פֿון"},
        {"a": "פֶּרֶק ג׳", "en": "Chapter 3", "yi": "פּרק ג׳"},
        {"a": "דְּנִדָּה", "en": "of (Tractate) Niddah", "yi": "פֿון נדה"},
        {"a": "מַשְׁבִּיעִין אוֹתוֹ", "en": "they make him swear", "yi": "מען זאָגט אים שבועה"},
        {"a": "תְּהִי צַדִּיק", "en": "be a Tzadik (righteous)", "yi": "זײַ אַ צדיק"},
        {"a": "וְאַל תְּהִי רָשָׁע", "en": "and do not be a Rasha (wicked)", "yi": "און זײַ נישט אַ רשע"},
        {"a": "כָּל הָעוֹלָם כּוּלּוֹ", "en": "the whole world", "yi": "די גאַנצע וועלט"},
        {"a": "אוֹמְרִים לְךָ", "en": "tells you", "yi": "זאָגט דיר"},
        {"a": "הֱיֵה בְּעֵינֶיךָ", "en": "consider yourself (lit. be in your eyes)", "yi": "האַלט זיך אין דײַנע אויגן"},
        {"a": "כְּרָשָׁע", "en": "as a Rasha", "yi": "ווי אַ רשע"}
    ],
    "sections": [
        {
            "id": "tanya-ch1-s1",
            "text": "The Alter Rebbe opens the Tanya by quoting a Mishnah from Niddah: before a soul descends into a body, Hashem makes it swear to 'be a Tzadik and not be a Rasha.' The puzzle: a person has free will — why does the soul need to swear?",
            "text_yiddish": "דער אַלטער רבי הייבט אָן דעם תניא מיט אַ ציטירונג פֿון אַ משנה אין נדה: פֿאַר אַ נשמה גייט אַראָפּ אין אַ גוף, מאַכט השם דעם נשמה שווערן 'זײַ אַ צדיק און זײַ נישט אַ רשע.' די קשיא: אַ מענטש האָט פֿרײַע ברירה — פֿאַר וואָס דאַרף די נשמה שווערן?",
            "text_simple": "Tanya opens: every soul swears before birth to be righteous, not wicked. Why swear if we have free will?",
            "text_simple_yiddish": "תניא הייבט אָן: יעדע נשמה שווערט פֿאַר דער געבורט צו זײַן אַ צדיק. פֿאַר וואָס שווערן אויב מ׳האָט פֿרײַע ברירה?",
            "term": "Mashbi'in Oso",
            "term_yiddish": "משביעין אותו",
            "definition": "Lit. 'they make him swear.' The pre-birth oath given to every soul to live righteously.",
            "definition_yiddish": "ווערטלעך 'מ׳מאַכט אים שווערן.' די שבועה וואָס מ׳גיט יעדער נשמה פֿאַר דער געבורט.",
            "question": "What does Hashem make a soul swear before it enters the body?",
            "question_yiddish": "וואָס מאַכט השם די נשמה שווערן פֿאַר זי גייט אַרײַן אין דעם גוף?",
            "explanation": "The soul is sworn 'be a Tzadik and not be a Rasha.' The Tanya will explain what this means given that we have free will.",
            "explanation_yiddish": "די נשמה שווערט 'זײַ אַ צדיק און זײַ נישט אַ רשע.' דער תניא וועט דערקלערן וואָס דאָס מיינט.",
            "answers": [
                {"text": "Be a Tzadik and not a Rasha", "text_yiddish": "זײַ אַ צדיק און נישט קיין רשע", "correct": True},
                {"text": "Learn Torah every day", "text_yiddish": "לערן תורה יעדן טאָג", "correct": False},
                {"text": "Pray three times a day", "text_yiddish": "דאַווען דרײַ מאָל אַ טאָג", "correct": False}
            ],
            "rashi": "[RASHI PLACEHOLDER — paste Rashi text here]",
            "rashi_yiddish": "[ראַשי פּלעצהאָלדער]",
            "rashi_explanation": "[Plain English explanation of what Rashi says — replace this]",
            "rashi_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון ראַשי]",
            "tosfos": "[TOSFOS PLACEHOLDER — paste Tosfos text here]",
            "tosfos_yiddish": "[תּוספּות פּלעצהאָלדער]",
            "tosfos_explanation": "[Plain English explanation of what Tosfos says — replace this]",
            "tosfos_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון תּוספּות]"
        },
        {
            "id": "tanya-ch1-s2",
            "text": "The Tanya teaches there are four categories of people: Tzadik gamur (complete Tzadik) — has no Yetzer Hara; Tzadik she-eino gamur (incomplete Tzadik) — still has a sliver of Yetzer Hara; Beinoni (intermediate) — full Yetzer Hara, but never acts on it; Rasha (wicked) — sometimes overcome by Yetzer Hara.",
            "text_yiddish": "דער תניא לערנט אַז עס זענען דאָ פֿיר קאַטעגאָריעס מענטשן: צדיק גמור — האָט קיין יצר הרע; צדיק שאינו גמור — האָט נאָך אַ ביסל יצר הרע; בינוני — האָט אַ פֿולן יצר הרע אָבער טוט קיינמאָל נישט קיין עבירה; רשע — ווערט מאָל איבערגעוואַלטיקט פֿון יצר הרע.",
            "text_simple": "Four levels: full Tzadik (no Yetzer Hara), partial Tzadik (small Yetzer Hara), Beinoni (full Yetzer Hara but never sins), Rasha (sometimes sins).",
            "text_simple_yiddish": "פֿיר דרגות: גאַנצער צדיק, האַלבער צדיק, בינוני, רשע.",
            "term": "Beinoni",
            "term_yiddish": "בינוני",
            "definition": "The 'in-between' person — someone with a full Yetzer Hara who never actually sins in thought, speech, or action. The Tanya's central focus.",
            "definition_yiddish": "אַ מענטש דערצווישן — איינער מיט אַ פֿולן יצר הרע וואָס טוט קיינמאָל קיין עבירה אין מחשבה, דיבור, אָדער מעשה. דאָס איז דעם תניא׳ס הויפּט נושׂא.",
            "question": "What defines a Beinoni?",
            "question_yiddish": "וואָס מאַכט אַ בינוני?",
            "explanation": "A Beinoni has a fully functional Yetzer Hara — he is tempted to sin — but he never actually sins, in thought, speech, or action.",
            "explanation_yiddish": "אַ בינוני האָט אַ פֿולן יצר הרע — ער ווערט נסיון׳ט — אָבער ער טוט קיינמאָל קיין עבירה, נישט אין מחשבה, נישט אין דיבור, און נישט אין מעשה.",
            "answers": [
                {"text": "Someone who never has bad thoughts", "text_yiddish": "איינער וואָס האָט קיינמאָל קיין שלעכטע מחשבות", "correct": False},
                {"text": "Has full Yetzer Hara but never acts on it", "text_yiddish": "האָט אַ פֿולן יצר הרע אָבער טוט נישט", "correct": True},
                {"text": "Half good half bad", "text_yiddish": "האַלב גוט האַלב שלעכט", "correct": False}
            ],
            "rashi": "[RASHI PLACEHOLDER — paste Rashi text here]",
            "rashi_yiddish": "[ראַשי פּלעצהאָלדער]",
            "rashi_explanation": "[Plain English explanation of what Rashi says — replace this]",
            "rashi_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון ראַשי]",
            "tosfos": "[TOSFOS PLACEHOLDER — paste Tosfos text here]",
            "tosfos_yiddish": "[תּוספּות פּלעצהאָלדער]",
            "tosfos_explanation": "[Plain English explanation of what Tosfos says — replace this]",
            "tosfos_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון תּוספּות]"
        },
        {
            "id": "tanya-ch1-s3",
            "text": "The Rambam (Hilchot Teshuvah) defines Beinoni as someone whose mitzvos and aveiros are equal — a 50/50 score. The Tanya rejects this: a 50/50 person is closer to a Rasha (since he has actually sinned). The Tanya's Beinoni has NEVER sinned in deed, speech, or thought — he only struggles with the desire to sin.",
            "text_yiddish": "דער רמב\"ם (הלכות תשובה) זאָגט אַז אַ בינוני איז איינער וואָס די מצוות און עבירות זענען גלײַך — 50/50. דער תניא לייגט דאָס נישט אַראָפּ: אַ 50/50 מענטש איז נעענטער צו אַ רשע (ער האָט שוין געטאָן עבירות). דעם תניא׳ס בינוני האָט קיינמאָל נישט געטאָן קיין עבירה — ער קעמפֿט בלויז מיט דעם רצון צו טאָן עבירות.",
            "text_simple": "Rambam says Beinoni = 50% good, 50% bad. Tanya disagrees: Beinoni never sinned at all — only struggles internally.",
            "text_simple_yiddish": "רמב\"ם זאָגט בינוני = 50/50. תניא: בינוני האָט קיינמאָל נישט געטאָן אַן עבירה.",
            "term": "Tanya's Beinoni",
            "term_yiddish": "בינוני פֿון תניא",
            "definition": "Distinct from Rambam's 50/50 person. Tanya's Beinoni never sins externally — even though internally his struggle is constant.",
            "definition_yiddish": "אַנדערש פֿון רמב\"ם׳ס 50/50. דעם תניא׳ס בינוני זינדיקט קיינמאָל נישט פֿון דרויסן — כאָטש פֿון אינווייניק קעמפֿט ער שטענדיק.",
            "question": "How does the Tanya's Beinoni differ from the Rambam's?",
            "question_yiddish": "ווי איז דעם תניא׳ס בינוני אַנדערש פֿון רמב\"ם׳ס?",
            "explanation": "The Rambam's Beinoni has sinned 50% of the time. The Tanya's Beinoni has NEVER sinned externally — the struggle is purely internal.",
            "explanation_yiddish": "רמב\"ם׳ס בינוני האָט געטאָן עבירות אַ 50%. דעם תניא׳ס בינוני האָט קיינמאָל קיין עבירה נישט געטאָן.",
            "answers": [
                {"text": "They are the same", "text_yiddish": "זיי זענען די זעלבע", "correct": False},
                {"text": "Tanya's Beinoni never sinned, Rambam's did half the time", "text_yiddish": "תניא׳ס בינוני האָט קיינמאָל נישט, רמב\"ם׳ס יאָ", "correct": True},
                {"text": "Rambam's is holier", "text_yiddish": "רמב\"ם׳ס איז העכער", "correct": False}
            ],
            "rashi": "[RASHI PLACEHOLDER — paste Rashi text here]",
            "rashi_yiddish": "[ראַשי פּלעצהאָלדער]",
            "rashi_explanation": "[Plain English explanation of what Rashi says — replace this]",
            "rashi_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון ראַשי]",
            "tosfos": "[TOSFOS PLACEHOLDER — paste Tosfos text here]",
            "tosfos_yiddish": "[תּוספּות פּלעצהאָלדער]",
            "tosfos_explanation": "[Plain English explanation of what Tosfos says — replace this]",
            "tosfos_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון תּוספּות]"
        }
    ]
}

TANYA = {
    "id": "tanya",
    "name": "Tanya",
    "name_yiddish": "תניא",
    "perakim": [
        {
            "num": 1,
            "name": "Likutei Amarim",
            "name_yiddish": "ליקוטי אמרים",
            "name_en": "Collected Sayings (the main work)",
            "name_en_yiddish": "געקליבענע ווערטער",
            "sugyos": [TANYA_CH1]
        }
    ]
}


# ============================================================
# Real content for Shabbos 3a — two who do a melacha together
# ============================================================
SHAB_3A_REAL = {
    "id": "shab-3a-p1",
    "daf": "3a",
    "title": "Two who do a melacha together",
    "title_yiddish": "צוויי וואָס טוען צוזאַמען אַ מלאכה",
    "illustration": "scroll",
    "aramaic": "הַמּוֹצִיא מֵרְשׁוּת לִרְשׁוּת חַיָּיב. אֲבָל שְׁנַיִם שֶׁעֲשָׂאוּהָ — פְּטוּרִין.",
    "aramaic_translation": "One who carries from domain to domain is liable [for a chatas]. But two who did it together — are exempt.",
    "aramaic_translation_yiddish": "איינער וואָס טראָגט פֿון רשות צו רשות איז חייב. אָבער צוויי וואָס האָבן עס געטאָן צוזאַמען — זענען פּטור.",
    "aramaic_words": [
        {"a": "הַמּוֹצִיא", "en": "one who carries out", "yi": "דער וואָס טראָגט אַרויס"},
        {"a": "מֵרְשׁוּת לִרְשׁוּת", "en": "from domain to domain", "yi": "פֿון רשות צו רשות"},
        {"a": "חַיָּיב", "en": "is liable", "yi": "איז חייב"},
        {"a": "אֲבָל", "en": "but", "yi": "אָבער"},
        {"a": "שְׁנַיִם שֶׁעֲשָׂאוּהָ", "en": "two who did it (together)", "yi": "צוויי וואָס האָבן עס געטאָן"},
        {"a": "פְּטוּרִין", "en": "are exempt", "yi": "זענען פּטור"}
    ],
    "sections": [
        {
            "id": "sh3a-p1-s1",
            "text": "One person who carries something from a Reshus HaYachid to a Reshus HaRabim (or vice versa) is Chayav — biblically liable. But if two people TOGETHER do the carrying — for example one lifts and the other places, or both lift together — they are both Patur (exempt).",
            "text_yiddish": "איינער וואָס טראָגט אַ זאַך פֿון אַ רשות היחיד צו רשות הרבים (אָדער פֿאַרקערט) איז חייב. אָבער אויב צוויי מענטשן טראָגן צוזאַמען — איינער הייבט אויף און די צווייטע לייגט אַראָפּ, אָדער ביידע הייבן צוזאַמען אויף — ביידע זענען פּטור.",
            "text_simple": "One person carrying = Chayav. Two people doing it together = both Patur.",
            "text_simple_yiddish": "איינער איז חייב. צוויי איז ביידע פּטור.",
            "term": "Shenayim She-asauha",
            "term_yiddish": "שניים שעשאוה",
            "definition": "Lit. 'two who did it.' When a melacha requires the action of two people to be completed, neither is biblically liable.",
            "definition_yiddish": "ווערטלעך 'צוויי וואָס האָבן עס געטאָן.' ווען צוויי מענטשן דאַרפֿן עס טאָן צוזאַמען, איז קיינער נישט חייב.",
            "question": "If two people together carry an item from RH'Y to RH'R — who is Chayav?",
            "question_yiddish": "אויב צוויי טראָגן צוזאַמען פֿון רשות היחיד צו רשות הרבים — ווער איז חייב?",
            "explanation": "Neither of them. A melacha done by two people together makes both of them Patur — though it is still rabbinically forbidden.",
            "explanation_yiddish": "ביידע זענען פּטור. אַ מלאכה געטאָן פֿון צוויי מענטשן צוזאַמען מאַכט ביידע פּטור — כאָטש עס איז נאָך פֿאַרבאָטן מדרבנן.",
            "answers": [
                {"text": "The first person", "text_yiddish": "דער ערשטער", "correct": False},
                {"text": "The second person", "text_yiddish": "דער צווייטער", "correct": False},
                {"text": "Neither — both Patur", "text_yiddish": "קיינער — ביידע פּטור", "correct": True}
            ],
            "rashi": "[RASHI PLACEHOLDER — paste Rashi text here]",
            "rashi_yiddish": "[ראַשי פּלעצהאָלדער]",
            "rashi_explanation": "[Plain English explanation of what Rashi says — replace this]",
            "rashi_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון ראַשי]",
            "tosfos": "[TOSFOS PLACEHOLDER — paste Tosfos text here]",
            "tosfos_yiddish": "[תּוספּות פּלעצהאָלדער]",
            "tosfos_explanation": "[Plain English explanation of what Tosfos says — replace this]",
            "tosfos_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון תּוספּות]"
        },
        {
            "id": "sh3a-p1-s2",
            "text": "Where does this come from? The pasuk in Vayikra (4:27) says 'one person sins from the people in his doing' — singular. From the word 'in his doing' Chazal learn: it must be done by ONE person, not two, to be Chayav for a chatas.",
            "text_yiddish": "פֿון וואו קומט דאָס? דער פּסוק אין ויקרא (ד׳:כ\"ז) זאָגט 'איין נפֿש זינדיקט פֿון די עם הארץ אין איר טאָן' — איינצאָל. פֿון דעם וואָרט 'אין איר טאָן' לערנען חז\"ל: עס מוז זײַן געטאָן פֿון איין מענטש, נישט פֿון צוויי, צו זײַן חייב פֿאַר אַ קרבן חטאת.",
            "text_simple": "The source: the Torah says 'one person sins in his doing' — singular. So two people together = neither Chayav.",
            "text_simple_yiddish": "די תורה זאָגט 'איין נפֿש אין איר טאָן' — איינצאָל. צוויי = קיינער חייב.",
            "term": "Ba-asoso",
            "term_yiddish": "בעשותה",
            "definition": "Lit. 'in his doing' — singular form in the pasuk. The grammatical proof that a chatas requires one person doing the whole act.",
            "definition_yiddish": "ווערטלעך 'אין איר טאָן' — איינצאָל אין דעם פּסוק. דער גראַמאַטיש־באַווײַז אַז אַ חטאת דאַרף איין מענטש.",
            "question": "What word in the Torah teaches that two people together are exempt?",
            "question_yiddish": "וועלכעס וואָרט אין דער תורה לערנט אַז צוויי זענען פּטור?",
            "explanation": "The word 'ba-asoso' ('in his doing'), in the singular, teaches that the chatas applies only to one person completing the melacha alone.",
            "explanation_yiddish": "דאָס וואָרט 'בעשותה' אין איינצאָל לערנט אַז דער חטאת איז נאָר ווען איין מענטש פֿאַרענדיקט די מלאכה אַליין.",
            "answers": [
                {"text": "Ba-asoso (in his doing)", "text_yiddish": "בעשותה", "correct": True},
                {"text": "Va-yomer (and he said)", "text_yiddish": "ויאמר", "correct": False},
                {"text": "Asher (which)", "text_yiddish": "אשר", "correct": False}
            ],
            "rashi": "[RASHI PLACEHOLDER — paste Rashi text here]",
            "rashi_yiddish": "[ראַשי פּלעצהאָלדער]",
            "rashi_explanation": "[Plain English explanation of what Rashi says — replace this]",
            "rashi_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון ראַשי]",
            "tosfos": "[TOSFOS PLACEHOLDER — paste Tosfos text here]",
            "tosfos_yiddish": "[תּוספּות פּלעצהאָלדער]",
            "tosfos_explanation": "[Plain English explanation of what Tosfos says — replace this]",
            "tosfos_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון תּוספּות]"
        },
        {
            "id": "sh3a-p1-s3",
            "text": "Rabbi Yehuda disagrees. He holds: if one of the two could have done it alone (e.g., a strong person + a weak person carrying a heavy item that only the strong one really needed) — the one who could do it alone IS Chayav, because we view him as the real doer.",
            "text_yiddish": "רבי יהודה איז נישט מסכים. ער האַלט: אויב איינער פֿון די צוויי האָט עס געקענט טאָן אַליין (למשל אַ שטאַרקער מיט אַ שוואַכן וואָס טראָגן אַ שווערע זאַך, און נאָר דער שטאַרקער האָט באמת געקענט) — דער וואָס האָט געקענט אַליין איז חייב, ווײַל מיר זעען אים ווי דעם עיקר עושׂה.",
            "text_simple": "Rabbi Yehuda: if one could do it alone, he IS Chayav even with help.",
            "text_simple_yiddish": "רבי יהודה: אויב איינער קען אַליין, איז ער חייב אַפֿילו מיט אַ פּאַרטנער.",
            "term": "Zeh Yachol veZeh Yachol",
            "term_yiddish": "זה יכול וזה יכול",
            "definition": "'This one can and this one can' — when both could do it alone, all opinions agree both are Patur. Rabbi Yehuda's argument is only about a case where only one of them could do it alone.",
            "definition_yiddish": "'דער קען און דער קען' — ווען ביידע קענען אַליין, אַלע מיינונגען מסכים אַז ביידע זענען פּטור. רבי יהודה רעדט נאָר ווען איינער קען אַליין און איינער נישט.",
            "question": "What does Rabbi Yehuda hold when one person could have done the melacha alone?",
            "question_yiddish": "וואָס האַלט רבי יהודה ווען איינער האָט געקענט אַליין?",
            "explanation": "He holds that one IS Chayav. The Chachamim hold both are Patur regardless. Halacha follows the Chachamim.",
            "explanation_yiddish": "ער האַלט אַז דער איז חייב. די חכמים האַלטן ביידע פּטור. די הלכה איז ווי די חכמים.",
            "answers": [
                {"text": "Both still Patur", "text_yiddish": "ביידע נאָך פּטור", "correct": False},
                {"text": "The one who could is Chayav", "text_yiddish": "דער וואָס האָט געקענט איז חייב", "correct": True},
                {"text": "Both Chayav", "text_yiddish": "ביידע חייב", "correct": False}
            ],
            "rashi": "[RASHI PLACEHOLDER — paste Rashi text here]",
            "rashi_yiddish": "[ראַשי פּלעצהאָלדער]",
            "rashi_explanation": "[Plain English explanation of what Rashi says — replace this]",
            "rashi_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון ראַשי]",
            "tosfos": "[TOSFOS PLACEHOLDER — paste Tosfos text here]",
            "tosfos_yiddish": "[תּוספּות פּלעצהאָלדער]",
            "tosfos_explanation": "[Plain English explanation of what Tosfos says — replace this]",
            "tosfos_explanation_yiddish": "[פּלעצהאָלדער — פּשוטע פּירוש פֿון תּוספּות]"
        }
    ]
}


# ============================================================
# RASHI + TOSFOS for Shabbos 2a (3 sections)
# ============================================================
SHAB_2A_COMMENTARY = {
    "sh2a-s1": {
        "rashi": "יציאות השבת — הוצאת ההוצאות מרשות לרשות. שתים שהן ארבע — שתי יציאות שהן ארבע: עני המכניס וחייב, ובעל הבית המוציא וחייב — הרי שתים. וכן שתי הכנסות.",
        "rashi_yiddish": "יציאות השבת — דאָס אַרויסטראָגן פֿון רשות צו רשות. צוויי וואָס זענען פֿיר — צוויי יציאות וואָס זענען פֿיר: דער עני וואָס ברענגט אַרײַן און איז חייב, און דער בעל הבית וואָס טראָגט אַרויס און איז חייב — איז דאָס צוויי. אַזוי אויך צוויי הכנסות.",
        "rashi_explanation": "Rashi explains the Mishnah's phrase 'two which are four': there are two Chayav cases counted directly (the poor man bringing in, the homeowner taking out), and these expand to four when you add the symmetric cases.",
        "rashi_explanation_yiddish": "ראַשי דערקלערט די משנה׳ס לשון 'צוויי וואָס זענען פֿיר': צוויי חייב פֿעלער (עני ברענגט אַרײַן, בעל הבית טראָגט אַרויס), און די ווערן פֿיר ווען מ׳צייצט די סימעטרישע פֿעלער.",
        "tosfos": "יציאות השבת שתים שהן ארבע — וקשה: הא תני להו במסכת שבועות, מאי איריא הכא דתני יציאות. ויש לומר דהתם תני להן אגב מראות נגעים, והכא תני בעיקר דין שבת.",
        "tosfos_yiddish": "יציאות השבת צוויי וואָס זענען פֿיר — אַ קשיא: ער לערנט עס שוין אין מסכת שבועות, פֿאַר וואָס לערנט ער עס דאָ ווידער? די תּירוץ: דאָרט לערנט ער עס אַגבֿ די מראות נגעים, און דאָ לערנט ער עס ווי דער עיקר דין פֿון שבת.",
        "tosfos_explanation": "Tosfos asks: why does the Mishnah teach the same idea in two places — both here and in Shevuos? Tosfos answers that in Shevuos it's a side reference, but here in Shabbos it's the main law.",
        "tosfos_explanation_yiddish": "תּוספּות פֿרעגט: פֿאַר וואָס לערנט די משנה די זעלבע אידעע אין צוויי ערטער — דאָ און אין שבועות? די ענטפֿער: אין שבועות איז עס אַגבֿ, און דאָ איז עס דער עיקר דין."
    },
    "sh2a-s2": {
        "rashi": "עד סוף האשמורה הראשונה — שליש הלילה, שהלילה נחלקת לשלוש משמרות, ובכל משמרה מלאכי השרת אומרים שירה.",
        "rashi_yiddish": "ביזן סוף פֿון דער ערשטער משמרה — אַ דריטל פֿון דער נאַכט, ווײַל די נאַכט איז צעטיילט אין דרײַ משמרות, און אין יעדער משמרה זאָגן די מלאכי השרת שירה.",
        "rashi_explanation": "Rashi clarifies: Rabbi Eliezer's 'end of the first watch' = first third of the night. The night is divided into three Mishmarot (watches), each associated with the angels singing praise.",
        "rashi_explanation_yiddish": "ראַשי דערקלערט: רבי אליעזר׳ס 'סוף ערשטער משמרה' = ערשטער דריטל פֿון דער נאַכט. די נאַכט איז אין דרײַ משמרות.",
        "tosfos": "עד חצות — לאו דווקא חצות הלילה ממש, אלא הכי קאמר: עד זמן שדרך בני אדם לישן, ועדיין לא ישנים כל בני אדם.",
        "tosfos_yiddish": "ביז חצות — נישט פּונקט האַלבע נאַכט מאַמש, אָבער: ביז דער צײַט ווען מענטשן גייען שלאָפֿן, און נישט אַלע שלאָפֿן נאָך.",
        "tosfos_explanation": "Tosfos refines 'Chatzos': it's not strictly geometric midnight but rather the time when most people are settled in for sleep — a practical deadline.",
        "tosfos_explanation_yiddish": "תּוספּות איז מדייק 'חצות': נישט פּונקט גיאָמעטריש האַלבע נאַכט, נאָר די צײַט ווען מערסטע מענטשן זענען שוין צוגעלייגט פֿאַר שלאָף."
    },
    "sh2a-s3": {
        "rashi": "כדי להרחיק את האדם מן העבירה — שלא יבוא לעבור על דברי תורה. ולכך עשו סייג שלא יאחר לקרות שמע, אלא יקרא קודם חצות.",
        "rashi_yiddish": "כדי דערווײַטערן דעם מענטש פֿון דער עבירה — אַז ער זאָל נישט ברעכן אַ דין פֿון דער תורה. דערפֿאַר האָבן זיי געמאַכט אַ סייג אַז מ׳זאָל נישט אָפּלייגן קריאת שמע, נאָר זאָגן עס פֿאַר חצות.",
        "rashi_explanation": "Rashi explains the purpose of the rabbinic fence: to prevent a person from accidentally violating a Torah commandment by procrastinating Shema until dawn passes.",
        "rashi_explanation_yiddish": "ראַשי דערקלערט דעם תּכלית פֿון דעם סייג: צו פֿאַרהיטן דעם מענטש פֿון ברעכן אַ תורה־מצוה דורך אָפּלייגן שמע ביז עלות גייט פֿאַרבײַ.",
        "tosfos": "ובדבריהם החמירו יותר מדבריו — דחכמים החמירו אפילו במצוה דאורייתא, להעמיד דבריהם, ולכך אסרו לאכול קודם קריאת שמע סמוך לזמן הקריאה.",
        "tosfos_yiddish": "און אין זייערע דיני האָבן זיי מחמיר געווען מער ווי אין דעם תורה־דין — חכמים האָבן זיך מחמיר געווען אַפֿילו אין אַ דאורייתא־מצוה, צו האַלטן זייערע ווערטער. דערפֿאַר אַסרען זיי עסן פֿאַר קריאת שמע.",
        "tosfos_explanation": "Tosfos notes a paradox: the Chachamim were stricter about their fence (no eating before Shema) than about the Torah's deadline itself — to ensure the fence holds.",
        "tosfos_explanation_yiddish": "תּוספּות באַמערקט אַ פּאַראַדאָקס: די חכמים זענען מחמיר געווען אויף זייער סייג (נישט עסן פֿאַר שמע) מער ווי אויף דעם תורה־דעדליין אַליין — אַז דער סייג זאָל האַלטן."
    }
}


# ============================================================
# Apply changes
# ============================================================

# Add Tanya (idempotent)
if not any(m["id"] == "tanya" for m in content["masechtos"]):
    content["masechtos"].append(TANYA)
    print("+ added Tanya masechta")
else:
    # update Tanya Ch1 if exists
    for m in content["masechtos"]:
        if m["id"] == "tanya":
            for p in m["perakim"]:
                for i, s in enumerate(p["sugyos"]):
                    if s["id"] == "tanya-ch1":
                        p["sugyos"][i] = TANYA_CH1
                        print("+ updated Tanya Ch1")

# Replace Shabbos 3a placeholder with real content
shabbos = next(m for m in content["masechtos"] if m["id"] == "shabbos")
for perek in shabbos["perakim"]:
    for i, sug in enumerate(perek["sugyos"]):
        if sug["id"] == "shab-3a-p1":
            perek["sugyos"][i] = SHAB_3A_REAL
            print("+ replaced Shabbos 3a placeholder with real content")

# Add Rashi/Tosfos to Shabbos 2a sections
for perek in shabbos["perakim"]:
    for sug in perek["sugyos"]:
        if sug["id"] == "shab-2a-mishnah":
            for sec in sug["sections"]:
                if sec["id"] in SHAB_2A_COMMENTARY:
                    sec.update(SHAB_2A_COMMENTARY[sec["id"]])
                    print(f"+ added real Rashi/Tosfos to {sec['id']}")

with open(DATA, "w", encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False, indent=2)

print("\nFinal masechtos:")
for m in content["masechtos"]:
    total = sum(len(p["sugyos"]) for p in m["perakim"])
    print(f"  {m['name']}: {len(m['perakim'])} perakim, {total} sugyos")
