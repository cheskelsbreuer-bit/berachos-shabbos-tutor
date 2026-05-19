"""V3 content restructure:
- Adds content_type to every masechta (gemara / tanya / chumash / mishnayos).
- Adds Chumash Bereishis 1:1–1:5 with word-by-word Hebrew and Rashi on each pasuk.
- Adds Pirkei Avos Chapter 1 mishnayos 1–3 with word-by-word Hebrew.
- Idempotent: safe to re-run.
"""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "content.json"
with open(DATA, "r", encoding="utf-8") as f:
    content = json.load(f)


def make_words(pairs):
    """pairs = [(hebrew, english, yiddish), ...]"""
    return [{"a": h, "en": e, "yi": y} for h, e, y in pairs]


# ============================================================
# CHUMASH — Bereishis Perek 1, pesukim 1–5
# ============================================================
def pasuk(num, hebrew, translation, translation_yi, words, plain_text, plain_text_yi, term, term_yi, definition, definition_yi, rashi, rashi_yi, rashi_explanation, rashi_explanation_yi):
    return {
        "id": f"ber-1-{num}",
        "daf": f"1:{num}",
        "title": f"Bereishis 1:{num}",
        "title_yiddish": f"בראשית א׳:{num}",
        "illustration": "scroll",
        "aramaic": hebrew,
        "aramaic_translation": translation,
        "aramaic_translation_yiddish": translation_yi,
        "aramaic_words": make_words(words),
        "sections": [
            {
                "id": f"ber-1-{num}-s1",
                "text": plain_text,
                "text_yiddish": plain_text_yi,
                "text_simple": plain_text,
                "text_simple_yiddish": plain_text_yi,
                "term": term,
                "term_yiddish": term_yi,
                "definition": definition,
                "definition_yiddish": definition_yi,
                "question": "(Plain-read pasuk — no quiz)",
                "question_yiddish": "(פּשוט-לערן פּסוק — קיין קעשיא)",
                "explanation": "",
                "explanation_yiddish": "",
                "answers": [],
                "rashi": rashi,
                "rashi_yiddish": rashi_yi,
                "rashi_explanation": rashi_explanation,
                "rashi_explanation_yiddish": rashi_explanation_yi,
                "tosfos": "",
                "tosfos_yiddish": "",
                "tosfos_explanation": "",
                "tosfos_explanation_yiddish": ""
            }
        ]
    }


BER_1_1 = pasuk(
    1,
    "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ.",
    "In the beginning, God created the heavens and the earth.",
    "אין אָנהייב האָט גאָט באַשאַפֿן דעם הימל און די ערד.",
    [
        ("בְּרֵאשִׁית", "in the beginning", "אין אָנהייב"),
        ("בָּרָא", "created", "האָט באַשאַפֿן"),
        ("אֱלֹהִים", "God", "גאָט"),
        ("אֵת", "(direct-object marker)", "(ניצט פֿאַר אַ ספּעציפֿישן אָביעקט)"),
        ("הַשָּׁמַיִם", "the heavens", "דעם הימל"),
        ("וְאֵת", "and (direct-object)", "און (ניצט פֿאַר ספּעציפֿישן אָביעקט)"),
        ("הָאָרֶץ", "the earth", "די ערד")
    ],
    "The Torah opens by stating that God created the universe — both the spiritual realms (heavens) and the physical world (earth). The word 'Bereishis' literally means 'in the beginning of.'",
    "די תורה הייבט אָן מיט דעם אַז גאָט האָט באַשאַפֿן די וועלט — סײַ די גײַסטיקע וועלטן (הימל) סײַ די גשמיותדיקע וועלט (ערד). דאָס וואָרט 'בראשית' מיינט ווערטלעך 'אין אָנהייב פֿון.'",
    "Bereishis",
    "בראשית",
    "Lit. 'in the beginning of' — the opening word of the Torah, from which the whole sefer takes its name.",
    "ווערטלעך 'אין אָנהייב פֿון' — דאָס ערשטע וואָרט פֿון דער תורה.",
    "אָמַר רַבִּי יִצְחָק, לֹא הָיָה צָרִיךְ לְהַתְחִיל אֶת הַתּוֹרָה אֶלָּא מֵהַחֹדֶשׁ הַזֶּה לָכֶם, שֶׁהִיא מִצְוָה רִאשׁוֹנָה שֶׁנִּצְטַוּוּ יִשְׂרָאֵל. וּמַה טַּעַם פָּתַח בִּבְרֵאשִׁית? מִשּׁוּם כֹּחַ מַעֲשָׂיו הִגִּיד לְעַמּוֹ, לָתֵת לָהֶם נַחֲלַת גּוֹיִם.",
    "רבי יצחק זאָגט: די תורה האָט נישט באַדאַרפֿט אָנהייבן ביז 'החודש הזה לכם' (די ערשטע מצוה צו ישראל). פֿאַר וואָס הייבט זי אָן מיט בראשית? ווײַל 'כּח מעשיו הגיד לעמו לתת להם נחלת גוים' — צו געבן ישראל די ערד.",
    "Rashi's famous question: why does the Torah begin with creation instead of the first mitzvah? Answer: to establish that God created the world and therefore has the right to give Eretz Yisrael to whomever He chooses — namely, to Klal Yisrael.",
    "ראַשי׳ס באַרימטע קשיא: פֿאַר וואָס הייבט די תורה אָן מיט באַשאַף און נישט מיט דער ערשטער מצוה? תּירוץ: צו ווײַזן אַז גאָט האָט באַשאַפֿן די וועלט און האָט דעריבער די רעכט צו געבן ארץ ישראל וועמען ער וויל — צו כּלל ישראל."
)

BER_1_2 = pasuk(
    2,
    "וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל פְּנֵי הַמָּיִם.",
    "And the earth was empty and chaotic, and darkness covered the deep, and the spirit of God hovered over the waters.",
    "און די ערד איז געווען וויסט און פּוסט, און פֿינצטערניש איבער דעם תּהום, און דער גײַסט פֿון גאָט האָט געשוועבט איבער די וואַסערן.",
    [
        ("וְהָאָרֶץ", "and the earth", "און די ערד"),
        ("הָיְתָה", "was", "איז געווען"),
        ("תֹהוּ", "empty / formless", "וויסט / אָן פֿאָרעם"),
        ("וָבֹהוּ", "and void / chaotic", "און פּוסט / כאַאָטיש"),
        ("וְחֹשֶׁךְ", "and darkness", "און פֿינצטערניש"),
        ("עַל פְּנֵי", "over the face of", "איבער דעם פּנים פֿון"),
        ("תְהוֹם", "the deep / abyss", "דעם תּהום"),
        ("וְרוּחַ אֱלֹהִים", "and the spirit of God", "און דער גײַסט פֿון גאָט"),
        ("מְרַחֶפֶת", "hovered", "האָט געשוועבט"),
        ("עַל פְּנֵי הַמָּיִם", "over the waters", "איבער די וואַסערן")
    ],
    "Before creation took form, the earth existed as Tohu va'Vohu — chaos and emptiness. Darkness covered the cosmic deep, and the Divine Presence hovered over the primordial waters, ready to bring order.",
    "פֿאַר דער באַשאַף האָט אַ פֿאָרעם גענומען, איז די ערד געווען תּהו ובהו — כאַאָס און פּוסט. פֿינצטערניש האָט באַדעקט דעם קאָסמישן תּהום, און די שכינה האָט געשוועבט איבער די אורווײַטע וואַסערן.",
    "Tohu va'Vohu",
    "תהו ובהו",
    "A famous phrase meaning 'chaos and void' — the primordial state of the universe before God brought order.",
    "אַ באַרימטע צוויי-וואָרט אויסדרוק: 'כאַאָס און פּוסט' — דער אורווײַטער מצב פֿון דער וועלט פֿאַר גאָט האָט געברענגט אָרדנונג.",
    "תֹהוּ וָבֹהוּ — תֹּהוּ לְשׁוֹן תָּמָה וְשׁוֹמְמוֹן, שֶׁאָדָם תּוֹהֶא וּמִשְׁתּוֹמֵם עַל בֹּהוּ שֶׁבָּהּ. וָבֹהוּ לְשׁוֹן רֵיקוּת וְצָדוּ.",
    "תהו ובהו — 'תּהו' מיינט וווּנדער און עלנט, אַז אַ מענטש שטוינט און איז פֿאַרגלאָצט פֿון דעם פּוסטקייט וואָס דאָרט איז. 'בהו' מיינט פּוסטקייט און וויסטקייט.",
    "Rashi defines the two words: Tohu = stunned amazement at the emptiness; Bohu = actual void and emptiness. Together they describe a state of utter chaos before form was given.",
    "ראַשי דערקלערט די צוויי ווערטער: תּהו = שטוינענדיקע ווונדער פֿון דער פּוסטקייט; בהו = די פּוסטקייט אַליין. צוזאַמען באַשרײַבן זיי אַ אינגאַנצן כאַאָטישן מצב."
)

BER_1_3 = pasuk(
    3,
    "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר.",
    "And God said: Let there be light — and there was light.",
    "און גאָט האָט געזאָגט: זאָל זײַן ליכט — און עס איז געווען ליכט.",
    [
        ("וַיֹּאמֶר", "and (He) said", "און ער האָט געזאָגט"),
        ("אֱלֹהִים", "God", "גאָט"),
        ("יְהִי", "let there be", "זאָל זײַן"),
        ("אוֹר", "light", "ליכט"),
        ("וַיְהִי אוֹר", "and there was light", "און עס איז געווען ליכט")
    ],
    "God's first creative act: with a single word — 'Let there be light' — light came into being. This is the prototype of creation through speech.",
    "גאָט׳ס ערשטע באַשעפֿערישע מעשה: מיט איין וואָרט — 'יהי אור' — איז ליכט געקומען. דאָס איז דער שטייגער פֿון באַשאַף דורך רעדן.",
    "Yehi Or",
    "יהי אור",
    "'Let there be light' — the first creative speech. The Midrash teaches this was the spiritual 'Or HaGanuz' (hidden light), not the sun (which comes later on day 4).",
    "'יהי אור' — די ערשטע באַשעפֿערישע ווערטער. דער מדרש לערנט אַז דאָס איז געווען דאָס גײַסטיקע 'אור הגנוז' (פֿאַרבאָרגענע ליכט), נישט די זון (וואָס קומט אויפֿן פֿערטן טאָג).",
    "יְהִי אוֹר — וַיְהִי אוֹר. רָאָה הַקָּדוֹשׁ בָּרוּךְ הוּא בָּאוֹר שֶׁאֵינוֹ כְדַאי לְהִשְׁתַּמֵּשׁ בּוֹ רְשָׁעִים, וְהִבְדִּילוֹ לַצַּדִּיקִים לֶעָתִיד לָבֹא.",
    "יהי אור — ויהי אור. דער הייליקער ברוך הוא האָט געזען אַז ס׳איז ניט ראוי פֿאַר רשעים זיך צו ניצן מיט דעם ליכט, און האָט עס פֿאַרבאָרגן פֿאַר די צדיקים אין דער עתיד.",
    "Rashi (citing Chagigah 12a): God saw that the original light was too holy for wicked people to use, so He hid it away — reserving it for the righteous in the World to Come (Or HaGanuz).",
    "ראַשי (ציטירט חגיגה י\"ב): גאָט האָט געזען אַז דאָס ערשטע ליכט איז צו הייליק פֿאַר רשעים, און האָט עס פֿאַרבאָרגן — פֿאַר די צדיקים אין עולם הבא (אור הגנוז)."
)

BER_1_4 = pasuk(
    4,
    "וַיַּרְא אֱלֹהִים אֶת הָאוֹר כִּי טוֹב וַיַּבְדֵּל אֱלֹהִים בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ.",
    "And God saw the light, that it was good, and God separated between the light and the darkness.",
    "און גאָט האָט געזען דאָס ליכט, אַז עס איז גוט, און גאָט האָט אונטערשיידן צווישן דעם ליכט און דער פֿינצטערניש.",
    [
        ("וַיַּרְא", "and (He) saw", "און ער האָט געזען"),
        ("אֶת הָאוֹר", "the light", "דאָס ליכט"),
        ("כִּי טוֹב", "that (it was) good", "אַז עס איז גוט"),
        ("וַיַּבְדֵּל", "and (He) separated", "און ער האָט אונטערשיידן"),
        ("בֵּין הָאוֹר", "between the light", "צווישן דעם ליכט"),
        ("וּבֵין הַחֹשֶׁךְ", "and between the darkness", "און צווישן דער פֿינצטערניש")
    ],
    "God saw that the light was 'good' and separated it from darkness. This separation is the foundation of order — each thing now has its proper place.",
    "גאָט האָט געזען אַז דאָס ליכט איז 'גוט' און האָט עס אונטערשיידן פֿון דער פֿינצטערניש. די אונטערשיידונג איז דער יסוד פֿון אָרדנונג — יעדע זאַך האָט איצט איר פּלאַץ.",
    "Havdalah",
    "הבדלה",
    "Separation — the act of distinguishing one thing from another. Echoed every week in the Havdalah ceremony after Shabbos.",
    "אַ פֿאַנאַנדערשיידונג — די מעשה פֿון אונטערשיידן איין זאַך פֿון אַן אַנדערער. ווידערגעקלונגען יעדע וואָך אין הבדלה נאָך שבת.",
    "וַיַּרְא אֱלֹהִים אֶת הָאוֹר כִּי טוֹב וַיַּבְדֵּל — אַף בָּזֶה אָנוּ צְרִיכִים לְדִבְרֵי אַגָּדָה: רָאָהוּ שֶׁאֵינוֹ כְדַאי לְהִשְׁתַּמֵּשׁ בּוֹ רְשָׁעִים, וְהִבְדִּילוֹ לַצַּדִּיקִים לֶעָתִיד לָבֹא.",
    "וירא אלהים את האור כי טוב ויבדל — אויך דאָ דאַרפֿן מיר ווערטער פֿון אגדה: ער האָט עס געזען אַז ס׳איז ניט ראוי פֿאַר רשעים, און האָט עס אונטערשיידן פֿאַר די צדיקים אין דער עתיד.",
    "Rashi explains the 'separation': it wasn't physical but spiritual. God hid the original light away from the wicked and reserved it for the Tzadikim in the World to Come.",
    "ראַשי דערקלערט די 'אונטערשיידונג': נישט פֿיזיש, נאָר גײַסטיק. גאָט האָט פֿאַרבאָרגן דאָס ליכט פֿון די רשעים און עס אָפּגעלייגט פֿאַר די צדיקים אין עולם הבא."
)

BER_1_5 = pasuk(
    5,
    "וַיִּקְרָא אֱלֹהִים לָאוֹר יוֹם וְלַחֹשֶׁךְ קָרָא לָיְלָה וַיְהִי עֶרֶב וַיְהִי בֹקֶר יוֹם אֶחָד.",
    "And God called the light Day, and the darkness He called Night. And it was evening, and it was morning — one day.",
    "און גאָט האָט אָנגערופֿן דאָס ליכט טאָג, און די פֿינצטערניש האָט ער אָנגערופֿן נאַכט. און עס איז געווען אָוונט, און עס איז געווען פֿרי — איין טאָג.",
    [
        ("וַיִּקְרָא", "and (He) called", "און ער האָט אָנגערופֿן"),
        ("לָאוֹר יוֹם", "the light: 'Day'", "דאָס ליכט 'טאָג'"),
        ("וְלַחֹשֶׁךְ", "and the darkness", "און די פֿינצטערניש"),
        ("קָרָא לָיְלָה", "He called Night", "האָט ער אָנגערופֿן נאַכט"),
        ("וַיְהִי עֶרֶב", "and it was evening", "און עס איז געווען אָוונט"),
        ("וַיְהִי בֹקֶר", "and it was morning", "און עס איז געווען פֿרי"),
        ("יוֹם אֶחָד", "one day (lit. day-one)", "איין טאָג")
    ],
    "God names the cycles: light = Day, darkness = Night. The pasuk ends 'evening and morning, one day.' From here we learn that a halachic day starts at night.",
    "גאָט גיט נעמען צו די ציקלען: ליכט = טאָג, פֿינצטערניש = נאַכט. דער פּסוק ענדיקט 'ערב ובוקר יום אחד.' פֿון דאָ לערנען מיר אַז אַ הלכישער טאָג הייבט אָן בײַ נאַכט.",
    "Yom Echad",
    "יום אחד",
    "'One day' (not 'first day') — emphasizing the unique singleness of day one. The pasuk teaches that night precedes day in halachic time.",
    "'איין טאָג' (נישט 'דער ערשטער טאָג') — אַ באַזונדערע איינצאָליקייט. דער פּסוק לערנט אַז נאַכט קומט פֿאַר טאָג אין הלכה.",
    "יוֹם אֶחָד — לְפִי סֵדֶר לְשׁוֹן הַפָּרָשָׁה הָיָה לוֹ לִכְתֹּב יוֹם רִאשׁוֹן. וְלָמָּה כָּתַב 'אֶחָד'? לְפִי שֶׁהָיָה הַקָּדוֹשׁ בָּרוּךְ הוּא יָחִיד בְּעוֹלָמוֹ, שֶׁלֹּא נִבְרְאוּ הַמַּלְאָכִים עַד יוֹם שֵׁנִי.",
    "יום אחד — לויט דעם סדר פֿון לשון פֿון דער פּרשה האָט ער געזאָלט שרײַבן 'יום ראשון'. פֿאַר וואָס שרײַבט ער 'אחד'? ווײַל דער הייליקער ברוך הוא איז געווען איינציק אין זײַן וועלט, ווײַל די מלאכים זענען נישט באַשאַפֿן געוואָרן ביזן צווייטן טאָג.",
    "Rashi: Why 'one day' instead of 'first day'? Because on that day God was utterly alone in His world — even the angels were not yet created (they were created on day 2). 'Echad' (one) emphasizes uniqueness.",
    "ראַשי: פֿאַר וואָס 'יום אחד' און נישט 'יום ראשון'? ווײַל אויף יענעם טאָג איז גאָט געווען לגמרי איינציק — אַפֿילו די מלאכים זענען נאָך נישט באַשאַפֿן (זיי זענען באַשאַפֿן געוואָרן צווייטן טאָג). 'אחד' באַטאָנט די איינציקייט."
)

CHUMASH = {
    "id": "chumash-bereishis",
    "name": "Bereishis",
    "name_yiddish": "בראשית",
    "content_type": "chumash",
    "default_mode": "plain_read",
    "perakim": [
        {
            "num": 1,
            "name": "Perek 1 — Creation",
            "name_yiddish": "פּרק א׳ — באַשאַף",
            "name_en": "The seven days of creation",
            "name_en_yiddish": "די זיבן טעג פֿון באַשאַף",
            "sugyos": [BER_1_1, BER_1_2, BER_1_3, BER_1_4, BER_1_5]
        }
    ]
}


# ============================================================
# PIRKEI AVOS — Chapter 1, mishnayos 1, 2, 3
# ============================================================
def mishnah(num, hebrew, translation, translation_yi, words, plain, plain_yi, term, term_yi, definition, definition_yi):
    return {
        "id": f"avos-1-{num}",
        "daf": f"1:{num}",
        "title": f"Avos 1:{num}",
        "title_yiddish": f"אבות א׳:{num}",
        "illustration": "scroll",
        "aramaic": hebrew,
        "aramaic_translation": translation,
        "aramaic_translation_yiddish": translation_yi,
        "aramaic_words": make_words(words),
        "sections": [
            {
                "id": f"avos-1-{num}-s1",
                "text": plain,
                "text_yiddish": plain_yi,
                "text_simple": plain,
                "text_simple_yiddish": plain_yi,
                "term": term,
                "term_yiddish": term_yi,
                "definition": definition,
                "definition_yiddish": definition_yi,
                "question": "(Plain mishnah — no quiz)",
                "question_yiddish": "(פּשוטע משנה — קיין קעשיא)",
                "explanation": "",
                "explanation_yiddish": "",
                "answers": [],
                "rashi": "",
                "rashi_yiddish": "",
                "rashi_explanation": "",
                "rashi_explanation_yiddish": "",
                "tosfos": "",
                "tosfos_yiddish": "",
                "tosfos_explanation": "",
                "tosfos_explanation_yiddish": ""
            }
        ]
    }


AVOS_1_1 = mishnah(
    1,
    "מֹשֶׁה קִבֵּל תּוֹרָה מִסִּינַי, וּמְסָרָהּ לִיהוֹשֻׁעַ, וִיהוֹשֻׁעַ לִזְקֵנִים, וּזְקֵנִים לִנְבִיאִים, וּנְבִיאִים מְסָרוּהָ לְאַנְשֵׁי כְּנֶסֶת הַגְּדוֹלָה. הֵם אָמְרוּ שְׁלֹשָׁה דְבָרִים: הֱווּ מְתוּנִים בַּדִּין, וְהַעֲמִידוּ תַלְמִידִים הַרְבֵּה, וַעֲשׂוּ סְיָג לַתּוֹרָה.",
    "Moshe received the Torah from Sinai, and transmitted it to Yehoshua, and Yehoshua to the Elders, and the Elders to the Prophets, and the Prophets transmitted it to the Men of the Great Assembly. They said three things: Be deliberate in judgment, raise up many students, and make a fence around the Torah.",
    "משה האָט באַקומען די תורה פֿון סיני, און איבערגעגעבן צו יהושע, יהושע צו די זקנים, די זקנים צו די נביאים, די נביאים צו די אַנשי כנסת הגדולה. זיי האָבן געזאָגט דרײַ זאַכן: זײַט באַרעכענט אין משפּט, שטעלט אויף סך תּלמידים, און מאַכט אַ סייג צו דער תורה.",
    [
        ("מֹשֶׁה", "Moshe (Moses)", "משה"),
        ("קִבֵּל תּוֹרָה", "received (the) Torah", "האָט באַקומען די תורה"),
        ("מִסִּינַי", "from Sinai", "פֿון סיני"),
        ("וּמְסָרָהּ", "and transmitted it", "און איבערגעגעבן עס"),
        ("לִיהוֹשֻׁעַ", "to Yehoshua", "צו יהושע"),
        ("לִזְקֵנִים", "to the Elders", "צו די זקנים"),
        ("לִנְבִיאִים", "to the Prophets", "צו די נביאים"),
        ("אַנְשֵׁי כְּנֶסֶת הַגְּדוֹלָה", "Men of the Great Assembly", "אַנשי כנסת הגדולה"),
        ("הֱווּ מְתוּנִים", "be deliberate", "זײַט באַרעכענט"),
        ("בַּדִּין", "in judgment", "אין משפּט"),
        ("הַעֲמִידוּ תַלְמִידִים", "raise up students", "שטעלט אויף תּלמידים"),
        ("הַרְבֵּה", "many", "סך"),
        ("עֲשׂוּ סְיָג", "make a fence", "מאַכט אַ סייג"),
        ("לַתּוֹרָה", "for the Torah", "פֿאַר דער תורה")
    ],
    "The opening of Pirkei Avos traces the chain of Torah transmission from Sinai down to the Anshei Knesses HaGedolah, then quotes their three teachings: careful judgment, abundant teaching, and protective fences.",
    "די הקדמה פֿון פּרקי אבות וויזט די קייט פֿון מסירת התורה פֿון סיני ביז די אנשי כנסת הגדולה, און ציטירט זייערע דרײַ ווערטער: באַרעכענטער משפּט, סך תּלמידים, און סייגות.",
    "Mesorah",
    "מסורה",
    "The unbroken chain of transmission of the Torah from generation to generation, beginning with Moshe at Sinai.",
    "די אומאויפֿהערלעכע קייט פֿון איבערגעבן די תורה פֿון דור צו דור, אָנהייבנדיק מיט משה רבינו בײַ סיני."
)

AVOS_1_2 = mishnah(
    2,
    "שִׁמְעוֹן הַצַּדִּיק הָיָה מִשְּׁיָרֵי כְּנֶסֶת הַגְּדוֹלָה. הוּא הָיָה אוֹמֵר, עַל שְׁלֹשָׁה דְבָרִים הָעוֹלָם עוֹמֵד: עַל הַתּוֹרָה, וְעַל הָעֲבוֹדָה, וְעַל גְּמִילוּת חֲסָדִים.",
    "Shimon HaTzadik was among the remnants of the Great Assembly. He used to say: The world stands on three things — on Torah, on Avodah (Divine service), and on Gemilus Chasadim (acts of kindness).",
    "שמעון הצדיק איז געווען פֿון די לעצטע פֿון כנסת הגדולה. ער פֿלעגט זאָגן: די וועלט שטייט אויף דרײַ זאַכן — אויף תורה, אויף עבודה, און אויף גמילות חסדים.",
    [
        ("שִׁמְעוֹן הַצַּדִּיק", "Shimon HaTzadik", "שמעון הצדיק"),
        ("הָיָה מִשְּׁיָרֵי", "was among the remnants", "איז געווען פֿון די לעצטע"),
        ("כְּנֶסֶת הַגְּדוֹלָה", "the Great Assembly", "כנסת הגדולה"),
        ("עַל שְׁלֹשָׁה דְבָרִים", "on three things", "אויף דרײַ זאַכן"),
        ("הָעוֹלָם עוֹמֵד", "the world stands", "די וועלט שטייט"),
        ("עַל הַתּוֹרָה", "on the Torah", "אויף דער תורה"),
        ("וְעַל הָעֲבוֹדָה", "and on the Service", "און אויף דער עבודה"),
        ("גְּמִילוּת חֲסָדִים", "acts of kindness", "גמילות חסדים")
    ],
    "Shimon HaTzadik's famous three-pillar teaching: the entire world is sustained by Torah study, Avodah (originally the Beis HaMikdash service, today tefillah), and acts of kindness toward others.",
    "שמעון הצדיק׳ס באַרימטע דרײַ-זײַלן לערנונג: די גאַנצע וועלט ווערט אונטערגעהאַלטן דורך תורה לימוד, עבודה (אַ מאָל די בית המקדש עבודה, איצט תפילה), און חסד צו אַנדערע.",
    "Sheloshah Devarim",
    "שלושה דברים",
    "'Three things' — Shimon HaTzadik's three pillars on which the world stands: Torah, Avodah, Gemilus Chasadim.",
    "'דרײַ זאַכן' — שמעון הצדיק׳ס דרײַ זײַלן אויף וועלכע די וועלט שטייט: תורה, עבודה, גמילות חסדים."
)

AVOS_1_3 = mishnah(
    3,
    "אַנְטִיגְנוֹס אִישׁ סוֹכוֹ קִבֵּל מִשִּׁמְעוֹן הַצַּדִּיק. הוּא הָיָה אוֹמֵר, אַל תִּהְיוּ כַּעֲבָדִים הַמְּשַׁמְּשִׁין אֶת הָרַב עַל מְנָת לְקַבֵּל פְּרָס, אֶלָּא הֱווּ כַּעֲבָדִים הַמְּשַׁמְּשִׁין אֶת הָרַב שֶׁלֹּא עַל מְנָת לְקַבֵּל פְּרָס, וִיהִי מוֹרָא שָׁמַיִם עֲלֵיכֶם.",
    "Antignus of Socho received from Shimon HaTzadik. He used to say: Do not be like servants who serve the master in order to receive a reward, but be like servants who serve the master not in order to receive a reward — and may the fear of Heaven be upon you.",
    "אַנטיגנוס איש סוכו האָט באַקומען פֿון שמעון הצדיק. ער פֿלעגט זאָגן: זײַט נישט ווי קנעכט וואָס דינען זייער האַר אויף צו באַקומען אַ באַלוינונג, נאָר זײַט ווי קנעכט וואָס דינען זייער האַר נישט אויף צו באַקומען אַ באַלוינונג, און די מורא פֿון הימל זאָל זײַן אויף אײַך.",
    [
        ("אַנְטִיגְנוֹס", "Antignus", "אַנטיגנוס"),
        ("אִישׁ סוֹכוֹ", "of Socho", "איש סוכו"),
        ("אַל תִּהְיוּ", "do not be", "זײַט נישט"),
        ("כַּעֲבָדִים", "like servants", "ווי קנעכט"),
        ("הַמְּשַׁמְּשִׁין", "who serve", "וואָס דינען"),
        ("אֶת הָרַב", "the master", "דעם האַר"),
        ("עַל מְנָת", "in order", "אויף צו"),
        ("לְקַבֵּל פְּרָס", "receive a reward", "באַקומען אַ באַלוינונג"),
        ("שֶׁלֹּא עַל מְנָת", "not in order", "נישט אויף צו"),
        ("מוֹרָא שָׁמַיִם", "fear of Heaven", "מורא פֿון הימל"),
        ("עֲלֵיכֶם", "upon you", "אויף אײַך")
    ],
    "Antignus teaches: serve God for love, not for reward. The relationship should be loyalty itself, not a transaction. And: keep yir'as shamayim (awe of Heaven) as your foundation.",
    "אַנטיגנוס לערנט: דין השם פֿאַר ליבע, נישט פֿאַר באַלוינונג. דאָס פֿאַרבונד זאָל זײַן טרײַשאַפֿט אַליין, נישט אַ האַנדל. און: האַלט יראת שמים ווי דײַן יסוד.",
    "Lo al menat lekabel peras",
    "לא על מנת לקבל פרס",
    "'Not in order to receive a reward' — Antignus's call to serve God out of pure love rather than for personal gain.",
    "'נישט אויף צו באַקומען אַ באַלוינונג' — אַנטיגנוס׳ס רוף צו דינען השם פֿון ריינער ליבע, נישט פֿאַר פּערזענלעכן רווח."
)

AVOS = {
    "id": "pirkei-avos",
    "name": "Pirkei Avos",
    "name_yiddish": "פּרקי אבות",
    "content_type": "mishnayos",
    "default_mode": "story",
    "perakim": [
        {
            "num": 1,
            "name": "Perek 1",
            "name_yiddish": "פּרק א׳",
            "name_en": "The chain of Mesorah",
            "name_en_yiddish": "די קייט פֿון מסורה",
            "sugyos": [AVOS_1_1, AVOS_1_2, AVOS_1_3]
        }
    ]
}


# ============================================================
# Add content_type to existing masechtos
# ============================================================
TYPE_MAP = {
    "shabbos": ("gemara", "game"),
    "berachos": ("gemara", "game"),
    "tanya": ("tanya", "plain_read"),
}

for m in content["masechtos"]:
    if m["id"] in TYPE_MAP:
        ctype, default = TYPE_MAP[m["id"]]
        m["content_type"] = ctype
        m["default_mode"] = default
        print(f"+ tagged {m['name']} → {ctype}")

# Add Chumash if missing
if not any(m["id"] == "chumash-bereishis" for m in content["masechtos"]):
    content["masechtos"].append(CHUMASH)
    print("+ added Chumash Bereishis perek 1 (5 pesukim)")
else:
    for i, m in enumerate(content["masechtos"]):
        if m["id"] == "chumash-bereishis":
            content["masechtos"][i] = CHUMASH
            print("+ replaced Chumash Bereishis")

# Add Pirkei Avos if missing
if not any(m["id"] == "pirkei-avos" for m in content["masechtos"]):
    content["masechtos"].append(AVOS)
    print("+ added Pirkei Avos perek 1 (3 mishnayos)")
else:
    for i, m in enumerate(content["masechtos"]):
        if m["id"] == "pirkei-avos":
            content["masechtos"][i] = AVOS
            print("+ replaced Pirkei Avos")

with open(DATA, "w", encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False, indent=2)

print("\nFinal masechtos:")
for m in content["masechtos"]:
    total = sum(len(p["sugyos"]) for p in m["perakim"])
    print(f"  [{m.get('content_type','?')}] {m['name']}: {total} sugyos")
