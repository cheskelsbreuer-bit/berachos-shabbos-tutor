"""V6: Add per-section Hebrew + word-by-word for Tanya chapters 1, 2, 3.
Each section becomes a real paragraph of the actual Tanya text, so Plain Read
lets you read the whole chapter, not just the opening line.

Idempotent."""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "content.json"
with open(DATA, "r", encoding="utf-8") as f:
    content = json.load(f)


def w(pairs):
    return [{"a": h, "en": e, "yi": y} for h, e, y in pairs]


# ============================================================
# TANYA CHAPTER 1 — per-section Hebrew + word-by-word
# ============================================================
TANYA_CH1_PARAS = {
    "tanya-ch1-s1": {
        "aramaic": "תַּנְיָא בְּסוֹף פֶּרֶק ג׳ דְּנִדָּה: מַשְׁבִּיעִין אוֹתוֹ — תְּהִי צַדִּיק וְאַל תְּהִי רָשָׁע. וַאֲפִילּוּ כָּל הָעוֹלָם כּוּלּוֹ אוֹמְרִים לְךָ צַדִּיק אַתָּה — הֱיֵה בְּעֵינֶיךָ כְּרָשָׁע. וְצָרִיךְ לְהָבִין: דְּהָא תְּנַן בְּאָבוֹת, וְאַל תְּהִי רָשָׁע בִּפְנֵי עַצְמְךָ.",
        "aramaic_translation": "It is taught at the end of Chapter 3 of Niddah: They make him swear — Be a Tzadik and do not be a Rasha. And even if the entire world tells you 'You are a Tzadik' — consider yourself a Rasha. But this needs explanation: we learned in Avos, 'Do not be a Rasha in your own eyes' [the opposite!].",
        "aramaic_translation_yiddish": "ס׳איז געלערנט אין סוף פּרק ג׳ פֿון נדה: מ׳זאָגט אים אַ שבועה — זײַ אַ צדיק און זײַ נישט קיין רשע. און אַפֿילו די גאַנצע וועלט זאָגט דיר 'דו ביסט אַ צדיק' — האַלט זיך אין דײַנע אויגן ווי אַ רשע. אָבער עס דאַרף אַ דערקלערונג: מיר האָבן געלערנט אין אבות 'און זײַ נישט קיין רשע אין דײַנע אייגענע אויגן' [פֿאַרקערט!].",
        "words": [
            ("תַּנְיָא", "it is taught", "מ׳לערנט"),
            ("בְּסוֹף", "at the end of", "אין סוף פֿון"),
            ("פֶּרֶק ג׳ דְּנִדָּה", "Chapter 3 of Niddah", "פּרק ג׳ פֿון נדה"),
            ("מַשְׁבִּיעִין אוֹתוֹ", "they make him swear", "מ׳זאָגט אים שבועה"),
            ("תְּהִי צַדִּיק", "be a Tzadik", "זײַ אַ צדיק"),
            ("וְאַל תְּהִי רָשָׁע", "and do not be a Rasha", "און זײַ נישט קיין רשע"),
            ("וַאֲפִילּוּ", "and even (if)", "און אַפֿילו"),
            ("כָּל הָעוֹלָם", "the whole world", "די גאַנצע וועלט"),
            ("כּוּלּוֹ", "all of it", "די גאַנצע"),
            ("אוֹמְרִים לְךָ", "tells you", "זאָגט דיר"),
            ("צַדִּיק אַתָּה", "you are a Tzadik", "דו ביסט אַ צדיק"),
            ("הֱיֵה בְּעֵינֶיךָ", "consider yourself (lit. be in your eyes)", "האַלט זיך אין דײַנע אויגן"),
            ("כְּרָשָׁע", "as a Rasha", "ווי אַ רשע"),
            ("וְצָרִיךְ לְהָבִין", "and (this) needs to be understood", "און עס דאַרף אַ דערקלערונג"),
            ("דְּהָא תְּנַן", "for behold we learned", "ווײַל מיר האָבן געלערנט"),
            ("בְּאָבוֹת", "in (Pirkei) Avos", "אין אבות"),
            ("בִּפְנֵי עַצְמְךָ", "in your own eyes", "אין דײַנע אייגענע אויגן")
        ]
    },
    "tanya-ch1-s2": {
        "aramaic": "וְגַם, אִם הוּא בְּעֵינָיו כְּרָשָׁע יֵרַע לְבָבוֹ וְיִהְיֶה עָצֵב, וְלֹא יוּכַל לַעֲבֹד ה׳ בְּשִׂמְחָה וּבְטוּב לֵבָב. אַךְ הָעִנְיָן, כִּי הִנֵּה מָצִינוּ בַּגְּמָרָא חֲמִשָּׁה חֲלוּקוֹת: צַדִּיק וְטוֹב לוֹ, צַדִּיק וְרַע לוֹ, רָשָׁע וְטוֹב לוֹ, רָשָׁע וְרַע לוֹ, וּבֵינוֹנִי. וּפֵרְשׁוּ בַּגְּמָרָא: צַדִּיק וְטוֹב לוֹ — צַדִּיק גָּמוּר. צַדִּיק וְרַע לוֹ — צַדִּיק שֶׁאֵינוֹ גָּמוּר.",
        "aramaic_translation": "Also, if a person considers himself a Rasha, his heart will be pained and he will be depressed, and he will not be able to serve Hashem with joy and goodness of heart. But the explanation: behold we find in the Gemara five categories: Tzadik and good to him, Tzadik and bad to him, Rasha and good to him, Rasha and bad to him, and Beinoni. The Gemara explains: Tzadik with good = complete Tzadik; Tzadik with bad = incomplete Tzadik.",
        "aramaic_translation_yiddish": "אויך, אויב אַ מענטש האַלט זיך פֿאַר אַ רשע, וועט זײַן האַרץ זײַן באַטריבט און ער וועט זײַן טרויעריק, און וועט נישט קענען דינען השם מיט פֿרייד. אָבער די ערקלערונג: מיר געפֿינען אין דער גמרא פֿינף חלוקות: צדיק וטוב לו, צדיק ורע לו, רשע וטוב לו, רשע ורע לו, און בינוני. די גמרא דערקלערט: צדיק מיט גוטס = צדיק גמור; צדיק מיט שלעכטס = צדיק שאינו גמור.",
        "words": [
            ("וְגַם", "and also", "און אויך"),
            ("אִם הוּא", "if he is", "אויב ער איז"),
            ("יֵרַע לְבָבוֹ", "his heart will be pained", "וועט זײַן האַרץ באַטריבט"),
            ("וְיִהְיֶה עָצֵב", "and he will be depressed", "און ער וועט זײַן טרויעריק"),
            ("לַעֲבֹד ה׳", "to serve Hashem", "צו דינען השם"),
            ("בְּשִׂמְחָה", "with joy", "מיט פֿרייד"),
            ("וּבְטוּב לֵבָב", "and good-heartedness", "און מיט גוטס פֿון האַרץ"),
            ("אַךְ הָעִנְיָן", "but the matter is", "אָבער די ערקלערונג"),
            ("מָצִינוּ בַּגְּמָרָא", "we find in the Gemara", "מיר געפֿינען אין גמרא"),
            ("חֲמִשָּׁה חֲלוּקוֹת", "five categories", "פֿינף חלוקות"),
            ("צַדִּיק וְטוֹב לוֹ", "Tzadik and good to him", "צדיק וטוב לו"),
            ("צַדִּיק וְרַע לוֹ", "Tzadik and bad to him", "צדיק ורע לו"),
            ("רָשָׁע וְטוֹב לוֹ", "Rasha and good to him", "רשע וטוב לו"),
            ("רָשָׁע וְרַע לוֹ", "Rasha and bad to him", "רשע ורע לו"),
            ("וּבֵינוֹנִי", "and Beinoni", "און בינוני"),
            ("צַדִּיק גָּמוּר", "complete Tzadik", "צדיק גמור"),
            ("צַדִּיק שֶׁאֵינוֹ גָּמוּר", "incomplete Tzadik", "צדיק שאינו גמור")
        ]
    },
    "tanya-ch1-s3": {
        "aramaic": "וְהָרַמְבַּ\"ם פֵּרֵשׁ בְּהִלְכוֹת תְּשׁוּבָה דְּבֵינוֹנִי הוּא מַחֲצָה זְכוּיוֹת וּמַחֲצָה עֲוֹנוֹת. אַךְ קָשֶׁה — אִם כֵּן הָוֵה לֵיהּ לְמִתְנֵי שִׁבְעָה חֲלוּקוֹת. וְעוֹד, בֵּינוֹנִי שֶׁעָבַר עֲבֵרָה — נִקְרָא רָשָׁע גָּמוּר! אֶלָּא וַדַּאי, בֵּינוֹנִי דְּתַנְיָא — לֹא עָבַר עֲבֵרָה מִיָּמָיו, וְלֹא יַעֲבֹר. וְהוּא נִלְחָם תָּמִיד עִם יִצְרוֹ.",
        "aramaic_translation": "The Rambam explained in Hilchot Teshuvah that a Beinoni is half merits and half sins. But this is difficult — then there would have been seven categories! Furthermore, a Beinoni who committed a sin would be called a total Rasha! Rather: the Beinoni of Tanya is one who has never sinned in his lifetime and never will sin. He fights constantly with his Yetzer Hara.",
        "aramaic_translation_yiddish": "דער רמב\"ם דערקלערט אין הלכות תשובה אַז אַ בינוני איז האַלב זכותים און האַלב עוונות. אָבער דאָס איז שווער — אויב אַזוי, וואָלט מען געצייכנט זיבן חלוקות! און נאָך, אַ בינוני וואָס האָט געטאָן אַן עבירה — וואָלט גערופֿן אַ רשע גמור! אַלזאָ: דעם תניא׳ס בינוני — האָט קיינמאָל נישט געטאָן אַן עבירה, און וועט קיינמאָל נישט טאָן. ער קעמפֿט שטענדיק מיט זײַן יצר הרע.",
        "words": [
            ("וְהָרַמְבַּ\"ם", "and the Rambam", "און דער רמב\"ם"),
            ("פֵּרֵשׁ", "explained", "האָט דערקלערט"),
            ("בְּהִלְכוֹת תְּשׁוּבָה", "in Hilchot Teshuvah", "אין הלכות תשובה"),
            ("מַחֲצָה זְכוּיוֹת", "half merits", "האַלב זכותים"),
            ("וּמַחֲצָה עֲוֹנוֹת", "and half sins", "און האַלב עוונות"),
            ("אַךְ קָשֶׁה", "but it is difficult", "אָבער ס׳איז שווער"),
            ("אִם כֵּן", "if so", "אויב אַזוי"),
            ("הָוֵה לֵיהּ לְמִתְנֵי", "he should have taught", "וואָלט ער געדאַרפֿט לערנען"),
            ("שִׁבְעָה חֲלוּקוֹת", "seven categories", "זיבן חלוקות"),
            ("וְעוֹד", "and furthermore", "און נאָך"),
            ("שֶׁעָבַר עֲבֵרָה", "who committed a sin", "וואָס האָט געטאָן אַן עבירה"),
            ("נִקְרָא", "is called", "ווערט גערופֿן"),
            ("רָשָׁע גָּמוּר", "a complete Rasha", "אַ רשע גמור"),
            ("אֶלָּא וַדַּאי", "rather certainly", "נאָר זיכער"),
            ("בֵּינוֹנִי דְּתַנְיָא", "the Beinoni of Tanya", "דעם תניא׳ס בינוני"),
            ("לֹא עָבַר עֲבֵרָה", "has not sinned", "האָט נישט געטאָן אַן עבירה"),
            ("מִיָּמָיו", "in his life", "אין זײַן לעבן"),
            ("וְלֹא יַעֲבֹר", "and will not sin", "און וועט נישט טאָן"),
            ("נִלְחָם תָּמִיד", "fights constantly", "קעמפֿט שטענדיק"),
            ("עִם יִצְרוֹ", "with his Yetzer Hara", "מיט זײַן יצר הרע")
        ]
    }
}


# ============================================================
# TANYA CHAPTER 2 — per-section Hebrew
# ============================================================
TANYA_CH2_PARAS = {
    "tanya-ch2-s1": {
        "aramaic": "וְנֶפֶשׁ הַשֵּׁנִית בְּיִשְׂרָאֵל הִיא חֵלֶק אֱלוֹהַּ מִמַּעַל מַמָּשׁ. וְהִיא מִתְלַבֶּשֶׁת בַּגּוּף וּמְחַיָּה אוֹתוֹ. וְזוֹ הִיא הַנֶּפֶשׁ הָאֱלֹקִית, וְלֹא רַק שֶׁל יְהוּדִי גָּדוֹל אוֹ קָטָן, אֶלָּא שֶׁל כָּל יְהוּדִי בְּלִי הֶבְדֵּל.",
        "aramaic_translation": "And the second soul in a Jew is literally a part of God Above. It clothes itself in the body and gives it life. This is the Divine Soul — not only of a great or small Jew, but of every Jew without distinction.",
        "aramaic_translation_yiddish": "און די צווייטע נשמה אין אַ ייִדן איז ממש אַ חלק פֿון השם פֿון אויבן. זי באַקליידעט זיך אין דעם גוף און באַלעבט אים. דאָס איז די געטלעכע נשמה — נישט נאָר פֿון אַ גרויסן אָדער קליינעם ייִדן, נאָר פֿון יעדן ייִדן אָן אונטערשייד.",
        "words": [
            ("וְנֶפֶשׁ הַשֵּׁנִית", "and the second soul", "און די צווייטע נשמה"),
            ("בְּיִשְׂרָאֵל", "in a Jew", "אין אַ ייִדן"),
            ("חֵלֶק אֱלוֹהַּ", "a part of God", "אַ חלק פֿון השם"),
            ("מִמַּעַל", "from Above", "פֿון אויבן"),
            ("מַמָּשׁ", "literally", "ממש"),
            ("מִתְלַבֶּשֶׁת", "clothes itself", "באַקליידעט זיך"),
            ("בַּגּוּף", "in the body", "אין דעם גוף"),
            ("וּמְחַיָּה", "and gives life", "און באַלעבט"),
            ("הַנֶּפֶשׁ הָאֱלֹקִית", "the Divine soul", "די געטלעכע נשמה"),
            ("גָּדוֹל אוֹ קָטָן", "great or small", "גרויסער אָדער קלענערער"),
            ("בְּלִי הֶבְדֵּל", "without distinction", "אָן אונטערשייד")
        ]
    },
    "tanya-ch2-s2": {
        "aramaic": "כְּמוֹ שֶׁכָּתוּב: וַיִּפַּח בְּאַפָּיו נִשְׁמַת חַיִּים. וְאַתָּה נְפַחְתָּהּ בִּי. וְאָמְרוּ בַּזוֹהַר: מַאן דְּנָפַח, מִתּוֹכֵיהּ נָפַח. כְּלוֹמַר, הַנְּפִיחָה בָּאָה מִפְּנִימִיּוּתוֹ שֶׁל הַנּוֹפֵחַ. וּמִכָּאן שֶׁהַנְּשָׁמָה נִמְשֶׁכֶת מִפְּנִימִיּוּתוֹ יִתְבָּרֵךְ.",
        "aramaic_translation": "As it is written: 'And He breathed into his nostrils a soul of life,' and 'You blew it into me.' The Zohar says: One who blows, blows from within himself. That is — the breath comes from the innermost being of the blower. From here we learn that the soul is drawn from God's innermost essence.",
        "aramaic_translation_yiddish": "ווי עס שטייט: 'ויפח באפיו נשמת חיים,' און 'ואתה נפחתה בי.' דער זוהר זאָגט: מאן דנפח מתוכיה נפח. הייסט עס, די בלאָז קומט פֿון דעם בלאָזער׳ס פּנימיות. פֿון דעם לערנען מיר אַז די נשמה ווערט אַראָפּגעצויגן פֿון השם׳ס פּנימיות.",
        "words": [
            ("כְּמוֹ שֶׁכָּתוּב", "as it is written", "ווי עס שטייט"),
            ("וַיִּפַּח", "and He breathed", "און ער האָט אַרײַנגעבלאָזן"),
            ("בְּאַפָּיו", "into his nostrils", "אין זײַנע נאָז־לעכלעך"),
            ("נִשְׁמַת חַיִּים", "a soul of life", "אַ נשמה פֿון לעבן"),
            ("וְאַתָּה נְפַחְתָּהּ בִּי", "You blew it into me", "און דו האָסט עס אַרײַנגעבלאָזן אין מיר"),
            ("בַּזוֹהַר", "in the Zohar", "אין דעם זוהר"),
            ("מַאן דְּנָפַח", "one who blows", "דער וואָס בלאָזט"),
            ("מִתּוֹכֵיהּ", "from within himself", "פֿון זיך אינווייניק"),
            ("נָפַח", "blows", "בלאָזט"),
            ("כְּלוֹמַר", "that is to say", "הייסט עס"),
            ("מִפְּנִימִיּוּתוֹ", "from his innermost", "פֿון זײַן פּנימיות"),
            ("הַנּוֹפֵחַ", "the blower", "דער בלאָזער"),
            ("נִמְשֶׁכֶת", "is drawn", "ווערט אַראָפּגעצויגן"),
            ("יִתְבָּרֵךְ", "(of God) blessed-be-He", "פֿון השם יתברך")
        ]
    },
    "tanya-ch2-s3": {
        "aramaic": "וְשֹׁרֶשׁ הַנֶּפֶשׁ הָאֱלֹקִית הוּא בַּחֲכָמָה דַּאֲצִילוּת — הַמַּדְרֵגָה הַגְּבוֹהָה בְּיוֹתֵר בְּעוֹלַם הָאֲצִילוּת. אַף נֶפֶשׁ פְּשׁוּטָה שֶׁל יְהוּדִי בְּחַיֵּי יוֹם יוֹם — שָׁרְשָׁהּ שָׁם. וּמִשּׁוּם כָּךְ כָּל יְהוּדִי קָשׁוּר בְּמַהוּתוֹ עִם הַקָּדוֹשׁ בָּרוּךְ הוּא, וּלְעוֹלָם לֹא יִנָּתֵק.",
        "aramaic_translation": "The root of the Divine Soul is in Chochmah of Atzilus — the highest level in the world of Atzilus. Even the simple soul of a Jew in his daily life is rooted there. Therefore every Jew is essentially bound up with the Holy One blessed be He, and can never be cut off.",
        "aramaic_translation_yiddish": "דער שורש פֿון דער געטלעכער נשמה איז אין חכמה דאצילות — די העכסטע מדרגה אין דער וועלט פֿון אצילות. אַפֿילו די פּשוטע נשמה פֿון אַ ייִדן אין טאָגיק לעבן — איר שורש איז דאָרט. דערפֿאַר איז יעדער ייִד אין זײַן עצם פֿאַרבונדן מיט דעם הייליקן ברוך הוא, און וועט קיינמאָל נישט אָפּגעריסן ווערן.",
        "words": [
            ("וְשֹׁרֶשׁ", "and the root", "און דער שורש"),
            ("הַנֶּפֶשׁ הָאֱלֹקִית", "the Divine soul", "פֿון דער געטלעכער נשמה"),
            ("בַּחֲכָמָה דַּאֲצִילוּת", "in Chochmah of Atzilus", "אין חכמה דאצילות"),
            ("הַמַּדְרֵגָה הַגְּבוֹהָה", "the high level", "די העכסטע מדרגה"),
            ("בְּיוֹתֵר", "the most", "בעסטענס"),
            ("בְּעוֹלַם הָאֲצִילוּת", "in the world of Atzilus", "אין דער וועלט פֿון אצילות"),
            ("אַף נֶפֶשׁ פְּשׁוּטָה", "even a simple soul", "אַפֿילו אַ פּשוטע נשמה"),
            ("בְּחַיֵּי יוֹם יוֹם", "in daily life", "אין טאָגיק לעבן"),
            ("שָׁרְשָׁהּ שָׁם", "its root is there", "איר שורש איז דאָרט"),
            ("מִשּׁוּם כָּךְ", "therefore", "דערפֿאַר"),
            ("קָשׁוּר בְּמַהוּתוֹ", "bound in his essence", "פֿאַרבונדן אין זײַן עצם"),
            ("הַקָּדוֹשׁ בָּרוּךְ הוּא", "the Holy One blessed be He", "דעם הייליקן ברוך הוא"),
            ("לֹא יִנָּתֵק", "will not be cut off", "וועט נישט אָפּגעריסן ווערן")
        ]
    }
}


# ============================================================
# TANYA CHAPTER 3 — per-section Hebrew
# ============================================================
TANYA_CH3_PARAS = {
    "tanya-ch3-s1": {
        "aramaic": "וְכָל בְּחִינָה וּמַדְרֵגָה מִשְּׁלֹשׁ אֵלֶּה — נֶפֶשׁ רוּחַ וּנְשָׁמָה — יֵשׁ בָּהּ עֶשֶׂר בְּחִינוֹת, כְּנֶגֶד עֶשֶׂר סְפִירוֹת עֶלְיוֹנוֹת שֶׁנִּשְׁתַּלְשְׁלוּ מֵהֶן. וְנֶחֱלָקוֹת לִשְׁתַּיִם: שֶׁהֵן שֵׂכֶל וּמִדּוֹת.",
        "aramaic_translation": "Each level of these three — Nefesh, Ruach, Neshamah — contains ten faculties, corresponding to the ten supernal Sefiros from which they descended. They divide into two: intellect (Sechel) and emotions (Midos).",
        "aramaic_translation_yiddish": "יעדע דרגה פֿון די דרײַ — נפש, רוח, נשמה — האָט צען כוחות, קעגן די צען עליונע ספֿירות פֿון וועלכע זיי קומען אַראָפּ. זיי טיילן זיך אין צוויי: שכל און מידות.",
        "words": [
            ("וְכָל בְּחִינָה", "and each aspect", "און יעדע בחינה"),
            ("וּמַדְרֵגָה", "and level", "און דרגה"),
            ("מִשְּׁלֹשׁ אֵלֶּה", "of these three", "פֿון די דרײַ"),
            ("נֶפֶשׁ רוּחַ וּנְשָׁמָה", "Nefesh, Ruach, Neshamah", "נפש, רוח, נשמה"),
            ("עֶשֶׂר בְּחִינוֹת", "ten faculties", "צען כוחות"),
            ("כְּנֶגֶד", "corresponding to", "קעגן"),
            ("עֶשֶׂר סְפִירוֹת", "ten Sefiros", "צען ספֿירות"),
            ("עֶלְיוֹנוֹת", "supernal", "עליונע"),
            ("נִשְׁתַּלְשְׁלוּ מֵהֶן", "descended from them", "זענען אַראָפּגעקומען פֿון זיי"),
            ("וְנֶחֱלָקוֹת", "and they divide", "און טיילן זיך"),
            ("לִשְׁתַּיִם", "into two", "אין צוויי"),
            ("שֵׂכֶל וּמִדּוֹת", "intellect and emotions", "שכל און מידות")
        ]
    },
    "tanya-ch3-s2": {
        "aramaic": "הַשֵּׂכֶל כּוֹלֵל חָכְמָה, בִּינָה וְדַעַת — וְהֵן הַנִּקְרָאוֹת חָבַ\"ד. חָכְמָה — הַבָּרָק הָרִאשׁוֹן שֶׁל הָרַעְיוֹן. בִּינָה — הִתְבּוֹנְנוּת וְהַרְחָבָה שֶׁל אוֹתָהּ הָרַעְיוֹן. דַּעַת — הִתְקַשְּׁרוּת פְּנִימִית, שֶׁהַשֵּׂכֶל יִכָּנֵס לְלֵב הָאָדָם וְיַשְׁפִּיעַ עַל מַעֲשָׂיו.",
        "aramaic_translation": "The intellect includes Chochmah, Binah, and Daas — called ChaBaD. Chochmah is the first flash of an idea. Binah is contemplation and expansion of that idea. Daas is internal bonding — the intellect must enter the heart and shape one's actions.",
        "aramaic_translation_yiddish": "דער שכל נעמט אַרײַן חכמה, בינה און דעת — וואָס הייסן חב\"ד. חכמה — דער ערשטער בליץ פֿון אַ געדאַנק. בינה — אַ באַטראַכטונג און פֿאַרברייטערונג פֿון דעם זעלביקן געדאַנק. דעת — אַ פּנימיותדיקע פֿאַרבינדונג, אַז דער שכל זאָל אַרײַנקומען אין דעם האַרץ און באַווירקן די מעשים.",
        "words": [
            ("הַשֵּׂכֶל", "the intellect", "דער שכל"),
            ("כּוֹלֵל", "includes", "נעמט אַרײַן"),
            ("חָכְמָה בִּינָה וְדַעַת", "Chochmah, Binah, Daas", "חכמה, בינה, דעת"),
            ("הַנִּקְרָאוֹת", "called", "וואָס הייסן"),
            ("חָבַ\"ד", "ChaBaD", "חב\"ד"),
            ("הַבָּרָק הָרִאשׁוֹן", "the first flash", "דער ערשטער בליץ"),
            ("שֶׁל הָרַעְיוֹן", "of the idea", "פֿון דעם געדאַנק"),
            ("הִתְבּוֹנְנוּת", "contemplation", "אַ באַטראַכטונג"),
            ("וְהַרְחָבָה", "and expansion", "און פֿאַרברייטערונג"),
            ("הִתְקַשְּׁרוּת פְּנִימִית", "internal bonding", "פּנימיותדיקע פֿאַרבינדונג"),
            ("יִכָּנֵס לְלֵב", "enters the heart", "גייט אַרײַן אין דעם האַרץ"),
            ("וְיַשְׁפִּיעַ", "and influences", "און באַווירקט"),
            ("עַל מַעֲשָׂיו", "his actions", "די מעשים")
        ]
    },
    "tanya-ch3-s3": {
        "aramaic": "וְשִׁבְעַת הַמִּדּוֹת הֵן: חֶסֶד, גְּבוּרָה, תִּפְאֶרֶת, נֶצַח, הוֹד, יְסוֹד וּמַלְכוּת. הֵן יוֹצְאוֹת מִן הַשֵּׂכֶל בְּדֶרֶךְ הִשְׁתַּלְשְׁלוּת — מַה שֶּׁהַשֵּׂכֶל מַבִּין וְקוֹלֵט, הַלֵּב סוֹף סוֹף מַרְגִּישׁ. וְזֶהוּ יְסוֹד עֲבוֹדַת חַסִּידוּת חָבַ\"ד.",
        "aramaic_translation": "The seven Midos are: Chesed, Gevurah, Tiferes, Netzach, Hod, Yesod, and Malchus. They emerge from the intellect through a process of descent — what the mind understands and absorbs, the heart eventually feels. This is the foundation of Chabad Chassidic service.",
        "aramaic_translation_yiddish": "די זיבן מידות זענען: חסד, גבורה, תפארת, נצח, הוד, יסוד, און מלכות. זיי קומען אַרויס פֿון דעם שכל אין דרך פֿון השתלשלות — וואָס דער שכל פֿאַרשטייט און נעמט אויף, פֿילט סוף־כל־סוף דאָס האַרץ. דאָס איז דער יסוד פֿון חב\"ד חסידות עבודה.",
        "words": [
            ("וְשִׁבְעַת", "and the seven", "און די זיבן"),
            ("הַמִּדּוֹת", "the Midos", "די מידות"),
            ("חֶסֶד", "Chesed (kindness)", "חסד"),
            ("גְּבוּרָה", "Gevurah (might)", "גבורה"),
            ("תִּפְאֶרֶת", "Tiferes (harmony)", "תפארת"),
            ("נֶצַח", "Netzach (perseverance)", "נצח"),
            ("הוֹד", "Hod (humility)", "הוד"),
            ("יְסוֹד", "Yesod (bonding)", "יסוד"),
            ("וּמַלְכוּת", "and Malchus (kingship)", "און מלכות"),
            ("יוֹצְאוֹת", "emerge", "קומען אַרויס"),
            ("מִן הַשֵּׂכֶל", "from the intellect", "פֿון דעם שכל"),
            ("בְּדֶרֶךְ הִשְׁתַּלְשְׁלוּת", "through descent", "דורך השתלשלות"),
            ("מַבִּין", "understands", "פֿאַרשטייט"),
            ("וְקוֹלֵט", "and absorbs", "און נעמט אויף"),
            ("הַלֵּב סוֹף סוֹף", "the heart eventually", "דאָס האַרץ סוף־כל־סוף"),
            ("מַרְגִּישׁ", "feels", "פֿילט"),
            ("יְסוֹד עֲבוֹדַת", "foundation of the service", "יסוד פֿון דער עבודה"),
            ("חַסִּידוּת חָבַ\"ד", "Chabad Chassidus", "חב\"ד חסידות")
        ]
    }
}


# Apply patches: add per-section aramaic + aramaic_words
ALL_PARAS = {**TANYA_CH1_PARAS, **TANYA_CH2_PARAS, **TANYA_CH3_PARAS}

tanya = next(m for m in content["masechtos"] if m["id"] == "tanya")
patched = 0
for perek in tanya["perakim"]:
    for sug in perek["sugyos"]:
        for sec in sug["sections"]:
            if sec["id"] in ALL_PARAS:
                p = ALL_PARAS[sec["id"]]
                sec["aramaic"] = p["aramaic"]
                sec["aramaic_translation"] = p["aramaic_translation"]
                sec["aramaic_translation_yiddish"] = p["aramaic_translation_yiddish"]
                sec["aramaic_words"] = w(p["words"])
                patched += 1
                print(f"+ patched section {sec['id']}")

print(f"\nPatched {patched} sections")

with open(DATA, "w", encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False, indent=2)
