"""V5: Real content for Shabbos 3b, 5a, 6b. Idempotent."""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "content.json"
with open(DATA, "r", encoding="utf-8") as f:
    content = json.load(f)


def w(pairs):
    return [{"a": h, "en": e, "yi": y} for h, e, y in pairs]


def section(sid, text, text_yi, term, term_yi, definition, definition_yi, question, question_yi, explanation, explanation_yi, answers):
    return {
        "id": sid,
        "text": text, "text_yiddish": text_yi,
        "text_simple": text, "text_simple_yiddish": text_yi,
        "term": term, "term_yiddish": term_yi,
        "definition": definition, "definition_yiddish": definition_yi,
        "question": question, "question_yiddish": question_yi,
        "explanation": explanation, "explanation_yiddish": explanation_yi,
        "answers": answers,
        "rashi": "[RASHI PLACEHOLDER]", "rashi_yiddish": "[ראַשי פּלעצהאָלדער]",
        "rashi_explanation": "[Plain English explanation of Rashi — replace]",
        "rashi_explanation_yiddish": "[פּלעצהאָלדער]",
        "tosfos": "[TOSFOS PLACEHOLDER]", "tosfos_yiddish": "[תּוספּות פּלעצהאָלדער]",
        "tosfos_explanation": "[Plain English explanation of Tosfos — replace]",
        "tosfos_explanation_yiddish": "[פּלעצהאָלדער]"
    }


SHAB_3B = {
    "id": "shab-3b-p1",
    "daf": "3b",
    "title": "When the hand is mid-air between domains",
    "title_yiddish": "ווען די האַנט איז אין דער לופֿטן צווישן רשויות",
    "illustration": "scroll",
    "aramaic": "פָּשַׁט בַּעַל הַבַּיִת אֶת יָדוֹ לַחוּץ וְנָתַן לְתוֹךְ יָדוֹ שֶׁל עָנִי, אוֹ שֶׁנָּטַל מִתּוֹכָהּ וְהִכְנִיס — בַּעַל הַבַּיִת חַיָּיב וְהֶעָנִי פָּטוּר.",
    "aramaic_translation": "The homeowner stretched his hand outside and placed something in the poor man's hand, or took something from it and brought it in — the homeowner is liable, the poor man is exempt.",
    "aramaic_translation_yiddish": "דער בעל הבית האָט אויסגעשטרעקט זײַן האַנט אַרויס און אַרײַנגעלייגט אַ זאַך אין דעם עניס האַנט, אָדער גענומען פֿון אים און אַרײַנגעבראַכט — דער בעל הבית איז חייב, דער עני איז פּטור.",
    "aramaic_words": w([
        ("פָּשַׁט", "stretched", "האָט אויסגעשטרעקט"),
        ("בַּעַל הַבַּיִת", "the homeowner", "דער בעל הבית"),
        ("אֶת יָדוֹ", "his hand", "זײַן האַנט"),
        ("לַחוּץ", "outward", "אַרויס"),
        ("וְנָתַן", "and placed", "און אַרײַנגעלייגט"),
        ("לְתוֹךְ יָדוֹ שֶׁל עָנִי", "in the poor man's hand", "אין דעם עניס האַנט"),
        ("שֶׁנָּטַל", "took", "גענומען"),
        ("מִתּוֹכָהּ", "from it (the hand)", "פֿון איר (פֿון דער האַנט)"),
        ("וְהִכְנִיס", "and brought in", "און אַרײַנגעבראַכט"),
        ("חַיָּיב", "is liable", "איז חייב"),
        ("פָּטוּר", "is exempt", "איז פּטור")
    ]),
    "sections": [
        section(
            "sh3b-p1-s1",
            "The Gemara now asks about the mirror case: when the homeowner reaches OUT of his house. He extends his hand into the public domain and either gives the poor man food (Hotza'ah) or takes the poor man's bag and brings it in (Hachnasah). In both cases, the homeowner is Chayav because HE did the complete melacha.",
            "די גמרא פֿרעגט איצט וועגן דעם פֿאַרקערטן פֿאַל: ווען דער בעל הבית שטעקט אַרויס פֿון זײַן הויז. ער שטרעקט אויס זײַן האַנט אין דעם רשות הרבים און אָדער גיט דעם עני עסן (הוצאה) אָדער נעמט דעם עניס פּעקל און ברענגט עס אַרײַן (הכנסה). אין ביידע פֿאַלן איז דער בעל הבית חייב ווײַל ער האָט געטאָן די פֿולע מלאכה.",
            "Pashat HaBaal HaBayis",
            "פשט הבעל הבית",
            "'The homeowner stretched out his hand' — the Mishnah's second case-pair, mirroring the poor man's case but with the homeowner as the active doer.",
            "'דער בעל הבית האָט אויסגעשטרעקט זײַן האַנט' — דער משנה׳ס צווייטער פֿאַל־פּאָר, ווי דעם עניס פֿאַל אָבער דער בעל הבית איז דער טוער.",
            "Who is Chayav when the homeowner reaches out and gives the poor man food?",
            "ווער איז חייב ווען דער בעל הבית שטעקט אַרויס און גיט דעם עני עסן?",
            "The homeowner — because HE did both the Akirah (lifting inside) and the Hanachah (placing in the poor man's hand outside).",
            "דער בעל הבית — ווײַל ער האָט געטאָן ביידע, די עקירה (אינווייניק) און די הנחה (אין דעם עניס האַנט אין דרויסן).",
            [
                {"text": "The poor man", "text_yiddish": "דער עני", "correct": False},
                {"text": "The homeowner", "text_yiddish": "דער בעל הבית", "correct": True},
                {"text": "Both equally", "text_yiddish": "ביידע גלײַך", "correct": False}
            ]
        ),
        section(
            "sh3b-p1-s2",
            "But what if the homeowner's hand is just suspended outside, holding the object, and he changes his mind? The Gemara explores: is a hand mid-air considered 'placed' or still 'in motion'? The principle: hand status follows the rest of the body — the body is inside, so the hand is technically 'inside' even when extended out.",
            "אָבער וואָס איז אויב דעם בעל הביתס האַנט הענגט נאָר אין דרויסן, מיט דער זאַך, און ער בײַט אים די מיינונג? די גמרא קוקט אַרײַן: איז אַ האַנט אין דער לופֿטן באַטראַכט אַז זי איז 'אַראָפּגעלייגט' אָדער נאָך 'אין באַוועגונג'? דער כּלל: די האַנטס סטאַטוס גייט נאָך דעם רעשט פֿון דעם גוף — דער גוף איז אינווייניק, אַלזאָ די האַנט איז טעכניש 'אינווייניק' אַפֿילו ווען זי איז אויסגעשטרעקט.",
            "Yad k'Gufo",
            "יד כגופו",
            "'The hand follows the body' — a principle that a person's hand, even when extended, is halachically still in the same domain as their body.",
            "'די האַנט גייט נאָך דעם גוף' — אַ כּלל אַז אַ מענטשנס האַנט, אַפֿילו אויסגעשטרעקט, איז הלכישלעך אין דער זעלבער רשות ווי דער גוף.",
            "If a person's body is inside and his hand is extended outside, where is the hand halachically?",
            "אויב דער גוף איז אינווייניק און די האַנט איז אויסגעשטרעקט אַרויס, ווו איז די האַנט לויט הלכה?",
            "It follows the body — so the hand is considered to be in the same domain as the body (inside).",
            "זי גייט נאָך דעם גוף — אַלזאָ די האַנט איז באַטראַכט ווי זי איז אין דער זעלבער רשות ווי דער גוף (אינווייניק).",
            [
                {"text": "The hand is its own domain", "text_yiddish": "די האַנט איז איר אייגענע רשות", "correct": False},
                {"text": "Wherever the hand is physically", "text_yiddish": "וווּ די האַנט איז פֿיזיש", "correct": False},
                {"text": "It follows the body's location", "text_yiddish": "זי גייט נאָך דעם גוף", "correct": True}
            ]
        ),
        section(
            "sh3b-p1-s3",
            "Practical case: a person is standing on a balcony and reaches down to give something to someone in the street. If both Akirah and Hanachah are done by the same person, he is Chayav. If two people split the action (one lifts, the other receives) — both are Patur (as we learned on 3a).",
            "אַ פּראַקטישער פֿאַל: אַ מענטש שטייט אויף אַ באַלקאָן און רעקט אַראָפּ צו געבן עפּעס צו עמעצן אויף דער גאַס. אויב די עקירה און די הנחה זענען געטאָן פֿון דעם זעלבן מענטשן, איז ער חייב. אויב צוויי מענטשן טיילן די מעשה (איינער הייבט אויף, דער אַנדערער נעמט) — ביידע זענען פּטור (ווי מיר האָבן געלערנט אויף 3א).",
            "Same-Person Rule",
            "דער זעלבער מענטש כלל",
            "For Chayav status, one and the same person must perform both the Akirah and the Hanachah of the melacha.",
            "פֿאַר חייב, מוז דער זעלבער מענטש טאָן ביידע די עקירה און די הנחה פֿון דער מלאכה.",
            "If you lift an object inside and someone else takes it out — who is Chayav?",
            "אויב דו הייבסט אויף אַ זאַך אינווייניק און עמעץ אַנדערש נעמט עס אַרויס — ווער איז חייב?",
            "Neither. Two people splitting the action = both Patur, since one person didn't complete the full melacha.",
            "קיינער. צוויי מענטשן טיילן די מעשה = ביידע פּטור, ווײַל איין מענטש האָט נישט פֿאַרענדיקט די פֿולע מלאכה.",
            [
                {"text": "You are Chayav", "text_yiddish": "דו ביסט חייב", "correct": False},
                {"text": "The other person", "text_yiddish": "דער צווייטער", "correct": False},
                {"text": "Neither — both Patur", "text_yiddish": "קיינער — ביידע פּטור", "correct": True}
            ]
        )
    ]
}


SHAB_5A = {
    "id": "shab-5a-p1",
    "daf": "5a",
    "title": "Reshus HaRabim definition: 16 amos wide",
    "title_yiddish": "רשות הרבים דעפֿיניציע: 16 אמות ברייט",
    "illustration": "book",
    "aramaic": "אֵיזוֹ הִיא רְשׁוּת הָרַבִּים? סְרַטְיָא וּפְלַטְיָא גְּדוֹלָה וּמְבוֹאוֹת הַמְּפֻלָּשִׁין. וְכַמָּה רוֹחַב שֶׁל רְשׁוּת הָרַבִּים? שֵׁשׁ עֶשְׂרֵה אַמָּה.",
    "aramaic_translation": "What is Reshus HaRabim (public domain)? A main road, a great plaza, and through-streets that open at both ends. And what is the width of a Reshus HaRabim? Sixteen amos.",
    "aramaic_translation_yiddish": "וואָס איז רשות הרבים? אַ הויפּט־וועג, אַ גרויסער פּלאַץ, און דורכגאַסן וואָס עפֿנען זיך אויף ביידע זײַטן. און וויפֿל איז דער ברייט פֿון רשות הרבים? זעכצן אמות.",
    "aramaic_words": w([
        ("אֵיזוֹ הִיא", "what is", "וואָס איז"),
        ("רְשׁוּת הָרַבִּים", "Reshus HaRabim (public domain)", "רשות הרבים"),
        ("סְרַטְיָא", "a main road / highway", "אַ הויפּט־וועג"),
        ("וּפְלַטְיָא גְּדוֹלָה", "and a great plaza", "און אַ גרויסער פּלאַץ"),
        ("מְבוֹאוֹת", "alleys", "געסלעך"),
        ("הַמְּפֻלָּשִׁין", "that open through (both ends)", "וואָס עפֿענען זיך דורך"),
        ("וְכַמָּה", "and how much", "און וויפֿל"),
        ("רוֹחַב", "width", "ברייט"),
        ("שֵׁשׁ עֶשְׂרֵה", "sixteen", "זעכצן"),
        ("אַמָּה", "amah (cubit)", "אמה (אַ מאָס)")
    ]),
    "sections": [
        section(
            "sh5a-p1-s1",
            "The Gemara now defines exactly what makes a place a Reshus HaRabim (RH'R). Three things qualify: (1) a Seratya — a main highway used by many travelers, (2) a Platya — a large open plaza, (3) Mevo'os HaMefulashin — alleys open at both ends (so people pass through).",
            "די גמרא דעפֿינירט איצט עקזאַקט וואָס מאַכט אַ אָרט אַ רשות הרבים. דרײַ זאַכן זענען ראוי: (א) אַ סרטיא — אַ הויפּט־וועג גענוצט פֿון סך פֿאַרער, (ב) אַ פּלטיא — אַ גרויסער אָפֿענער פּלאַץ, (ג) מבואות המפֿולשין — געסלעך עפֿן אויף ביידע ענדן.",
            "Three Types of RH'R",
            "דרײַ סאָרטן רשות הרבים",
            "Seratya (highway), Platya (plaza), and Mevo'os HaMefulashin (through-alleys) — the three places that qualify as a true Reshus HaRabim.",
            "סרטיא (וועג), פּלטיא (פּלאַץ), און מבואות המפֿולשין (דורכגייענדע געסלעך) — די דרײַ ערטער וואָס זענען אַן אמתע רשות הרבים.",
            "Is a dead-end alley a Reshus HaRabim?",
            "איז אַ פֿאַרשטעלטע געסל אַ רשות הרבים?",
            "No — only an alley open at BOTH ends qualifies (because people pass through). A dead-end is usually a Karmelis at most.",
            "ניין — נאָר אַ געסל וואָס איז עפֿן אויף ביידע ענדן (אַז מענטשן גייען דורך). אַ פֿאַרשטעלטער איז מערסטנס אַ כּרמלית.",
            [
                {"text": "Yes", "text_yiddish": "יאָ", "correct": False},
                {"text": "No, only if open at both ends", "text_yiddish": "ניין, נאָר אויב עפֿן אויף ביידע ענדן", "correct": True},
                {"text": "Only on weekdays", "text_yiddish": "נאָר אין וואָכן־טעג", "correct": False}
            ]
        ),
        section(
            "sh5a-p1-s2",
            "How wide must a public area be to qualify as RH'R? The Gemara says: 16 amos — roughly 24-32 feet, depending on the size of an amah. The source: this matches the width of the wagons that the Levi'im used to transport the Mishkan in the desert. The Torah considers a 'public space' to be at least that wide.",
            "ווי ברייט מוז אַ עפֿנטלעך אָרט זײַן צו זײַן רשות הרבים? די גמרא זאָגט: 16 אמות — אַרום 24-32 פֿיס, אָפּהענגיק פֿון דער גרייס פֿון אַן אמה. דער מקור: עס שטימט מיט דער ברייט פֿון די וועגענער וואָס די לוויים האָבן גענוצט צו טראַנספּאָרטירן דעם משכן אין מדבר. די תורה באַטראַכט אַ 'עפֿנטלעך אָרט' ווי לכל הפּחות אַזוי ברייט.",
            "16 Amos",
            "16 אמות",
            "The minimum width for a true Reshus HaRabim — derived from the wagons of the Mishkan in the desert, which were each 5 amos wide and required 16 amos of road to pass.",
            "די מינימום ברייט פֿאַר אַן אמתע רשות הרבים — אַ לימוד פֿון די וועגענער פֿון דעם משכן אין מדבר, וואָס יעדע איז געווען 5 אמות ברייט.",
            "Why 16 amos specifically?",
            "פֿאַר וואָס דווקא 16 אמות?",
            "Because that's the width of the road between the Levi'im's wagons in the desert. Two wagons (5 amos each) + spacing = 16 amos total.",
            "ווײַל דאָס איז דער ברייט פֿון דעם וועג צווישן די לוויים׳ס וועגענער. צוויי וועגענער (5 אמות יעדע) + פּלאַץ = 16 אמות.",
            [
                {"text": "It's an arbitrary number", "text_yiddish": "אַן אַרביטראַרישע צאָל", "correct": False},
                {"text": "Width of the Mishkan wagons in the desert", "text_yiddish": "ברייט פֿון די משכן־וועגענער אין מדבר", "correct": True},
                {"text": "Number of Shevatim x 2", "text_yiddish": "צאָל פֿון שבטים × 2", "correct": False}
            ]
        ),
        section(
            "sh5a-p1-s3",
            "Practical halacha today: in most modern cities, the streets are wider than 16 amos. BUT — many poskim hold there's a second condition: 600,000 people must regularly pass through (matching the number of Bnei Yisrael in the desert). Many modern cities don't meet this, so they may be a Karmelis even though wide enough.",
            "פּראַקטישע הלכה היינט: אין מערסטע מאָדערנע שטעט, די גאַסן זענען ברייטער ווי 16 אמות. אָבער — סך פּוסקים האַלטן ס׳איז דאָ אַ צווייטער תּנאַי: 600,000 מענטשן מוזן רעגלמעסיק דורכגיין (אַזוי ווי די צאָל פֿון בני ישראל אין מדבר). סך מאָדערנע שטעט מאַכן עס נישט, אַזוי קענען זיי זײַן אַ כּרמלית כאָטש זיי זענען ברייט גענוג.",
            "600,000 Condition",
            "600,000 באַדינגונג",
            "A view among poskim that a true Reshus HaRabim must also have 600,000 people regularly passing through — practical impact: most modern cities are Karmelis-level, not RH'R.",
            "אַ מיינונג בײַ פּוסקים אַז אַן אמתע רשות הרבים מוז אויך האָבן 600,000 מענטשן רעגלמעסיק. פּראַקטיש: מערסטע מאָדערנע שטעט זענען נאָר אַ כּרמלית.",
            "Why might a modern city street NOT be a true RH'R?",
            "פֿאַר וואָס איז אַ מאָדערנע שטאָט־גאַס אפֿשר נישט אַן אמתע רשות הרבים?",
            "Many poskim require 600,000 daily users (matching Bnei Yisrael in the desert). Many cities don't meet this, so they're Karmelis even though wide enough.",
            "סך פּוסקים פֿאָדערן 600,000 טאָגיקע באַניצערס. סך שטעט מאַכן עס נישט, אַזוי זענען זיי נאָר אַ כּרמלית.",
            [
                {"text": "Streets are too narrow", "text_yiddish": "גאַסן זענען צו שמאָל", "correct": False},
                {"text": "May lack 600,000 daily users", "text_yiddish": "אפֿשר פֿעלן 600,000 טאָגיקע באַניצערס", "correct": True},
                {"text": "Cars don't count", "text_yiddish": "אויטאָס ציילן נישט", "correct": False}
            ]
        )
    ]
}


SHAB_6B = {
    "id": "shab-6b-p1",
    "daf": "6b",
    "title": "Why a Karmelis was added as a 4th domain",
    "title_yiddish": "פֿאַר וואָס אַ כרמלית איז צוגעלייגט געוואָרן ווי די 4טע רשות",
    "illustration": "book",
    "aramaic": "אַמַּאי קָרֵי לֵיהּ כַּרְמְלִית? לְפִי שֶׁאֵינוֹ דּוֹמֶה לִרְשׁוּת הָרַבִּים וְלֹא לִרְשׁוּת הַיָּחִיד — לֹא יָבֵשׁ וְלֹא לַח, אֶלָּא בֵּינוֹנִי.",
    "aramaic_translation": "Why is it called Karmelis? Because it resembles neither the Public domain nor the Private domain — not dry and not moist, but in between.",
    "aramaic_translation_yiddish": "פֿאַר וואָס רופֿט מען עס אַ כרמלית? ווײַל עס איז ענלעך נישט צו רשות הרבים און נישט צו רשות היחיד — נישט טרוקן און נישט נאַס, נאָר דערצווישן.",
    "aramaic_words": w([
        ("אַמַּאי", "why", "פֿאַר וואָס"),
        ("קָרֵי לֵיהּ", "is it called", "רופֿט מען עס"),
        ("כַּרְמְלִית", "Karmelis", "כּרמלית"),
        ("לְפִי שֶׁאֵינוֹ דּוֹמֶה", "because it doesn't resemble", "ווײַל עס איז נישט ענלעך"),
        ("לִרְשׁוּת הָרַבִּים", "to RH'R", "צו רשות הרבים"),
        ("וְלֹא לִרְשׁוּת הַיָּחִיד", "and not to RH'Y", "און נישט צו רשות היחיד"),
        ("לֹא יָבֵשׁ", "not dry", "נישט טרוקן"),
        ("וְלֹא לַח", "and not moist", "און נישט נאַס"),
        ("אֶלָּא", "but rather", "נאָר"),
        ("בֵּינוֹנִי", "intermediate", "דערצווישן")
    ]),
    "sections": [
        section(
            "sh6b-p1-s1",
            "The Mishnah on 2a counted only 2 domains for Chayav purposes. But the Gemara introduces a third 'Karmelis' — a domain that the Chachamim added as a rabbinic prohibition. Why? Because some spaces don't clearly fit either category (private home or public street).",
            "די משנה אויף 2א האָט געציילט נאָר 2 רשויות פֿאַר חייב. אָבער די גמרא ברענגט אַ דריטע 'כּרמלית' — אַ רשות וואָס די חכמים האָבן צוגעלייגט מדרבנן. פֿאַר וואָס? ווײַל עטלעכע ערטער פּאַסן זיך נישט קלאָר אין אַ קאַטעגאָריע (פּריוואַט הויז אָדער עפֿנטלעך גאַס).",
            "Karmelis Defined",
            "כּרמלית דעפֿינירט",
            "A rabbinically-added domain for places that are neither truly private (no walls or too small) nor truly public (too small to be RH'R).",
            "אַ רבנישע רשות פֿאַר ערטער וואָס זענען נישט אמת פּריוואַט (אָן ווענט אָדער צו קליין) און נישט אמת עפֿנטלעך (צו קליין פֿאַר רשות הרבים).",
            "Is Karmelis from the Torah or from the Rabbis?",
            "איז כּרמלית פֿון דער תורה אָדער פֿון די רבנים?",
            "It's a Rabbinic addition. The Torah only recognizes two domains; Chazal added Karmelis as a fence.",
            "ס׳איז אַ רבנישע צולייגונג. די תורה האָט נאָר צוויי רשויות; חז\"ל האָבן צוגעלייגט כּרמלית ווי אַ סייג.",
            [
                {"text": "From the Torah (dor'oraisa)", "text_yiddish": "פֿון דער תורה", "correct": False},
                {"text": "Rabbinic addition (mid'rabanan)", "text_yiddish": "אַ רבנישע צולייגונג", "correct": True},
                {"text": "From Moshe Rabbeinu", "text_yiddish": "פֿון משה רבינו", "correct": False}
            ]
        ),
        section(
            "sh6b-p1-s2",
            "Why the strange name 'Karmelis'? The Gemara explains: like the word 'Karmel' (the place name), which connotes something 'soft and tender' — neither dry hard wheat nor fully soft fruit. So too this domain: not dry/public, not moist/private, but in between.",
            "פֿאַר וואָס דער מאָדנער נאָמען 'כּרמלית'? די גמרא דערקלערט: ווי דאָס וואָרט 'כּרמל' (דער אָרט־נאָמען), וואָס פּאַסט אויף עפּעס 'ווייך און צאַרט' — נישט טרוקן האַרט ווייץ און נישט גאַנץ ווייך פֿרוכט. אַזוי דאָ: נישט טרוקן/עפֿנטלעך, נישט נאַס/פּריוואַט, נאָר דערצווישן.",
            "Why 'Karmelis'?",
            "פֿאַר וואָס 'כּרמלית'?",
            "Named after Mount Karmel — connoting an intermediate state, neither one extreme nor the other.",
            "אַ נאָמען נאָך הר כּרמל — באַדײַטנדיק אַ צווישנמצב, נישט קיין עקסטרעם.",
            "What's the metaphor in 'Karmel'?",
            "וואָס איז דער משל אין 'כּרמל'?",
            "Something 'soft and tender' — between dry grain and fully ripe fruit. So too this domain is between Public and Private.",
            "עפּעס 'ווייך און צאַרט' — צווישן טרוקן קאָרן און רײַפֿע פֿרוכט. אַזוי איז די רשות דערצווישן.",
            [
                {"text": "It's the name of a Tanna", "text_yiddish": "ס׳איז דער נאָמען פֿון אַ תנא", "correct": False},
                {"text": "Means 'in-between', from Har Karmel", "text_yiddish": "מיינט 'דערצווישן', פֿון הר כּרמל", "correct": True},
                {"text": "Hebrew for 'private'", "text_yiddish": "לשון קודש פֿאַר 'פּריוואַט'", "correct": False}
            ]
        ),
        section(
            "sh6b-p1-s3",
            "Examples of Karmelis: an empty field, a small alleyway less than 16 amos wide, the sea, a small enclosed area without proper walls. From a Karmelis you may NOT carry items to/from a RH'Y or RH'R — even though biblically it would be allowed. The Chachamim treated it strictly to prevent confusion with the real domains.",
            "בײַשפּילן פֿון כּרמלית: אַ ליידיק פֿעלד, אַ קלין געסל ווייניקער ווי 16 אמות ברייט, די ים, אַ קליין געצוימט אָרט אָן ריכטיקע ווענט. פֿון אַ כּרמלית מעג מען נישט טראַגן זאַכן צו/פֿון אַ רשות היחיד אָדער רשות הרבים — כאָטש פֿון דער תורה וועט עס געווען דערלויבט. די חכמים האָבן עס באַהאַנדלט שטרענג צו פֿאַרהיטן צעמישונג מיט די אמתע רשויות.",
            "Examples",
            "בײַשפּילן",
            "An open field, sea, narrow alley, unwalled area — all are Karmelis. Carrying in/out is rabbinically forbidden.",
            "אַ ליידיק פֿעלד, ים, שמאָל געסל, אומגעצוימט אָרט — אַלע זענען כּרמלית. טראָגן אַרײַן/אַרויס איז פֿאַרבאָטן מדרבנן.",
            "Is the sea a Karmelis or a Reshus HaRabim?",
            "איז דער ים אַ כּרמלית אָדער אַ רשות הרבים?",
            "Karmelis — even though it's huge and open, it doesn't meet the criteria of a Reshus HaRabim (no road through it). Carrying onto a boat from shore is rabbinically forbidden.",
            "כּרמלית — כאָטש ס׳איז גרויס און אָפֿן, ס׳איז נישט רשות הרבים (קיין וועג דאָרט). טראָגן אויף אַ שיף פֿון ברעג איז פֿאַרבאָטן מדרבנן.",
            [
                {"text": "Reshus HaRabim", "text_yiddish": "רשות הרבים", "correct": False},
                {"text": "Karmelis", "text_yiddish": "כּרמלית", "correct": True},
                {"text": "Mekom Petur", "text_yiddish": "מקום פּטור", "correct": False}
            ]
        )
    ]
}


# Apply: replace the placeholder sugyos for these dapim
shabbos = next(m for m in content["masechtos"] if m["id"] == "shabbos")
target_ids = {"shab-3b-p1": SHAB_3B, "shab-5a-p1": SHAB_5A, "shab-6b-p1": SHAB_6B}
for perek in shabbos["perakim"]:
    for i, sug in enumerate(perek["sugyos"]):
        if sug["id"] in target_ids:
            perek["sugyos"][i] = target_ids[sug["id"]]
            print(f"+ replaced {sug['id']} with real content")

with open(DATA, "w", encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False, indent=2)
print("\nDone.")
