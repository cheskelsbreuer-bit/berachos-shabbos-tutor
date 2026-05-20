/* daf-summaries.js — hand-written "what's this daf about" intros.
   Shown at the top of Plain Read for any sugya that has a summary here.
   Adding more = just adding more entries to SUMMARIES. */
(function (global) {
  const SUMMARIES = {
    "shabbos-2a": {
      title: "Carrying on Shabbos — the four cases",
      title_yi: "טראָגן אויף שבת — די פֿיר פֿעלער",
      summary: "This is the opening of Masechet Shabbos. The Mishnah teaches the basics of הוצאה (carrying between domains). Two cases for the homeowner, two for the poor man — together 'four' cases, but only two of them are חייב (liable to bring a chatas). Watch for: יציאות = carryings-out, רשות היחיד = private domain, רשות הרבים = public domain.",
      summary_yi: "דאָס איז דער אָנהייב פֿון מסכת שבת. די משנה לערנט די יסודות פֿון הוצאה (טראָגן צווישן רשויות). צוויי פֿעלער פֿאַרן בעל הבית, צוויי פֿאַרן עני — צוזאַמען 'פֿיר' אָבער נאָר צוויי זענען חייב.",
      characters: ["The Tanna", "Rabbi Eliezer", "The Chachamim", "Rabban Gamliel"]
    },
    "shabbos-2b": {
      title: "Why does the Mishnah open this way?",
      title_yi: "פֿאַר וואָס די משנה הייבט אָן אַזוי?",
      summary: "The Gemara opens by asking: where does the Tanna 'stand' (היכא קאי)? Why introduce 'yetzi'os' without setup? The answer is anchored in the pasuk 'אַל יצא איש ממקומו' (Shemos 16:29). Watch for how the Gemara unpacks language choices — this is classic Talmudic analysis.",
      summary_yi: "די גמרא הייבט אָן מיט אַ קשיא: ווו שטייט דער תנא (היכא קאי)? פֿאַר וואָס הייבט ער אָן מיט 'יציאות' אָן הקדמה?",
      characters: ["Rabbi Yochanan", "Reish Lakish"]
    },
    "shabbos-3a": {
      title: "Two people carrying together",
      title_yi: "צוויי וואָס טראָגן צוזאַמען",
      summary: "Key sugya: שניים שעשאוה — what happens when two people carry an object together? The Torah says 'בעשותה' (singular), so only one person doing the whole melacha is biblically liable. Two together = both פטור (exempt from chatas, but still rabbinically forbidden).",
      summary_yi: "אַ וויכטיקע סוגיא: שניים שעשאוה — וואָס איז ווען צוויי טראָגן צוזאַמען? דער פּסוק זאָגט 'בעשותה' (איינצאָל), אַזוי איז נאָר איין מענטש חייב.",
      characters: ["Rabbi Yehuda", "The Chachamim"]
    },
    "shabbos-6a": {
      title: "The four domains of Shabbos",
      title_yi: "די פֿיר רשויות פֿון שבת",
      summary: "Foundational daf for hilchos Shabbos: רשות היחיד (private), רשות הרבים (public), כרמלית (in-between, rabbinic), מקום פטור (exempt). Knowing which space you're in determines what you can carry. Master this and most of hilchos Shabbos clicks into place.",
      summary_yi: "אַ יסודישער דף: די פֿיר רשויות — רשות היחיד, רשות הרבים, כרמלית, מקום פטור.",
      characters: ["The Tanna Kamma"]
    },
    "shabbos-9b": {
      title: "Don't start activities close to Mincha",
      title_yi: "ניט אָנהייבן מלאכות נאָענט צו מנחה",
      summary: "End of perek 1: five activities you shouldn't begin close to Mincha time — haircut, bathhouse, tannery, meal, judging a case — because they might run long and you'll miss davening. The Gemara debates: Mincha Gedolah (12:30 PM) or Mincha Ketana (~3 PM)?",
      summary_yi: "סוף פּרק א׳: פֿינף זאַכן וואָס מ׳זאָל ניט אָנהייבן נאָענט צו מנחה — שערן, באָד, גאַרבערײַ, סעודה, פּסקענען.",
      characters: ["Rabbi Yehoshua ben Levi"]
    },
    "tanya-ch1": {
      title: "The four levels: Tzadik, Beinoni, Rasha",
      title_yi: "די פֿיר דרגות: צדיק, בינוני, רשע",
      summary: "Tanya opens with the Mishnah from Niddah: every soul swears before birth — 'be a Tzadik, not a Rasha.' Then introduces four categories of people. Critically: the Alter Rebbe's definition of a Beinoni differs from the Rambam's. The Tanya's Beinoni has never sinned in deed, speech, OR thought.",
      summary_yi: "תניא הייבט אָן מיט דער משנה אין נדה: יעדע נשמה שווערט פֿאַר דער געבורט — זײַ אַ צדיק, ניט קיין רשע. נאָך דעם פֿיר קאַטעגאָריעס מענטשן.",
      characters: ["The Alter Rebbe", "Rambam", "Rabbi"]
    },
    "tanya-ch2": {
      title: "The Divine Soul — literally a part of God",
      title_yi: "די געטלעכע נשמה",
      summary: "Every Jew has two souls — the animal soul (shared with all creatures) and the Divine Soul (חלק אלוקה ממעל ממש — literally a part of God Above). The Tanya proves this from 'ויפח באפיו נשמת חיים' — when you blow, it comes from inside you. So our soul comes from God's innermost essence.",
      summary_yi: "יעדער ייִד האָט צוויי נשמות — די חיהשע און די געטלעכע. די געטלעכע איז ממש אַ חלק פֿון השם פֿון אויבן.",
      characters: ["The Alter Rebbe"]
    },
    "tanya-ch3": {
      title: "Ten powers of the soul — ChaBaD + 7 Midos",
      title_yi: "צען כוחות פֿון דער נשמה",
      summary: "The soul has 10 inner faculties — like a map of the 10 Sefiros. 3 are intellectual (ChaBaD = Chochmah-Binah-Daas), 7 are emotional (Chesed through Malchus). The key teaching of Chabad chassidus: what the mind grasps deeply, the heart eventually feels.",
      summary_yi: "די נשמה האָט 10 אינערלעכע כוחות — ווי די 10 ספֿירות. 3 שכלדיקע (חב\"ד) און 7 רגשותדיקע (מידות).",
      characters: ["The Alter Rebbe"]
    },
    "tanya-ch4": {
      title: "Three soul-garments: thought, speech, action",
      title_yi: "דרײַ לבושים: מחשבה, דיבור, מעשה",
      summary: "Every soul expresses itself through three 'garments' (לבושים): thought (מחשבה), speech (דיבור), and action (מעשה). Torah and mitzvos work BY clothing the soul in these — Torah study clothes the soul in thought and speech, mitzvos in action. This is how a finite person connects to the Infinite.",
      summary_yi: "יעדע נשמה דריקט זיך אויס דורך דרײַ לבושים: מחשבה, דיבור, מעשה. תורה און מצוות באַקליידן די נשמה דורך זיי.",
      characters: ["The Alter Rebbe"]
    },
    "tanya-ch5": {
      title: "Grasping Torah = uniting with the Infinite",
      title_yi: "תורה לערנען = פֿאַראייניקן זיך מיט דעם אומענדלעכן",
      summary: "When you understand a piece of Torah, your mind grasps Hashem's will — and Hashem's will IS Hashem (אורייתא וקודשא בריך הוא חד). So your mind, embracing Torah, is literally embracing G-d. The Tanya calls this 'יחוד נפלא' — a wondrous unity. This is why learning is the highest connection.",
      summary_yi: "ווען מ׳פֿאַרשטייט אַ שטיקל תורה — דער מוח כאַפּט אַרום השם׳ס ווילן. דאָס איז 'יחוד נפלא' — אַ וווּנדערלעכע פֿאַראייניקונג.",
      characters: ["The Alter Rebbe"]
    }
  };

  global.DAF_SUMMARIES = {
    get(sugyaId) { return SUMMARIES[sugyaId] || null; },
    has(sugyaId) { return !!SUMMARIES[sugyaId]; },
    all() { return SUMMARIES; }
  };
})(window);
