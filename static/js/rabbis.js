/* rabbis.js — built-in database of major Tannaim/Amoraim/etc.
   When a name is detected in Hebrew text, it becomes tappable → bio popup. */
(function (global) {
  // Hebrew patterns → bio. Patterns can match multiple variants of a name.
  // Bio fields: en (English bio), yi (Yiddish bio), era, lived
  const RABBIS = [
    // Tannaim
    {
      patterns: ["רבי אליעזר", "ר׳ אליעזר"],
      name: "Rabbi Eliezer ben Hyrcanus",
      era: "Tanna (1st-2nd c. CE)",
      en: "A senior student of Rabban Yochanan ben Zakai. Famously strict in halachic rulings. Often the strict opinion in debates with the Chachamim.",
      yi: "אַ הויפּט תּלמיד פֿון רבן יוחנן בן זכאי. באַרימט פֿאַר זײַנע שטרענגע פּסקים."
    },
    {
      patterns: ["רבי יהושע", "ר׳ יהושע"],
      name: "Rabbi Yehoshua ben Chananya",
      era: "Tanna (1st-2nd c. CE)",
      en: "Student of Rabban Yochanan ben Zakai. Frequent debate partner of Rabbi Eliezer. Often the more lenient voice. Active during the era after the Churban.",
      yi: "תּלמיד פֿון רבן יוחנן בן זכאי. אָפֿטער דעבאַט־פּאַרטנער מיט רבי אליעזר."
    },
    {
      patterns: ["רבן גמליאל", "רבן גמלי׳"],
      name: "Rabban Gamliel",
      era: "Tanna (~80-110 CE)",
      en: "Nasi (head of the Sanhedrin) at Yavneh. Famous for standardizing Jewish law after the Churban. Several Rabban Gamliels in history — context usually shows which.",
      yi: "נשיא אין יבנה. באַרימט פֿאַרן סטאַנדאַרדיזירן הלכה נאָך דעם חורבן."
    },
    {
      patterns: ["רבי עקיבא", "ר׳ עקיבא"],
      name: "Rabbi Akiva",
      era: "Tanna (~50-135 CE)",
      en: "Began learning at age 40 with the help of his wife Rachel. The greatest of the Tannaim. Teacher of Rabbi Meir, Rabbi Shimon bar Yochai, Rabbi Yehuda. Martyred by the Romans.",
      yi: "האָט אָנגעהויבן לערנען בײַ 40 יאָר. דער גרעסטער פֿון די תנאים. רבי פֿון רבי מאיר און רשב\"י."
    },
    {
      patterns: ["רבי מאיר", "ר׳ מאיר"],
      name: "Rabbi Meir",
      era: "Tanna (~110-175 CE)",
      en: "Star student of Rabbi Akiva. His name means 'one who illuminates.' Often called simply 'Acherim' in the Mishnah. Husband of Beruria.",
      yi: "שטערן־תּלמיד פֿון רבי עקיבא. דער נאָמען מיינט 'איינער וואָס לײַכט.'"
    },
    {
      patterns: ["רבי יהודה", "ר׳ יהודה"],
      name: "Rabbi Yehuda bar Ilai",
      era: "Tanna (~110-180 CE)",
      en: "Student of Rabbi Akiva. The most-cited Tanna in the Mishnah. Often the 'Stam Mishnah' (anonymous Mishnah) follows his opinion.",
      yi: "תּלמיד פֿון רבי עקיבא. דער מערסט־ציטירטער תּנא אין דער משנה."
    },
    {
      patterns: ["רבי שמעון", "רשב״י", "רשב\"י"],
      name: "Rabbi Shimon bar Yochai",
      era: "Tanna (2nd c. CE)",
      en: "Student of Rabbi Akiva. Hid in a cave for 13 years from the Romans. Author of the Zohar (per tradition). His yahrzeit is celebrated on Lag BaOmer.",
      yi: "תּלמיד פֿון רבי עקיבא. האָט זיך באַהאַלטן אין אַ הייל 13 יאָר. דער מחבר פֿונעם זוהר."
    },
    {
      patterns: ["רבי", "ר׳ יהודה הנשיא"],
      name: "Rebbi (Rabbi Yehuda HaNasi)",
      era: "Tanna (~135-217 CE)",
      en: "'Rabbeinu HaKadosh.' Compiled the Mishnah. When the Gemara says simply 'Rebbi' without a name, this is who it means.",
      yi: "רבינו הקדוש. דער קאָמפּילירער פֿון דער משנה. ווען די גמרא זאָגט נאָר 'רבי' מיינט זי דעם."
    },
    // Amoraim - Bavel
    {
      patterns: ["רב יהודה"],
      name: "Rav Yehuda (bar Yechezkel)",
      era: "Amora, Bavel (~220-299 CE)",
      en: "First-generation Babylonian Amora. Founded the Yeshiva in Pumbedita. Student of Rav and Shmuel.",
      yi: "אַמורא, פּומבדיתא. גרינדער פֿון דער ישיבה דאָרט."
    },
    {
      patterns: ["רבא"],
      name: "Rava (bar Yosef bar Chama)",
      era: "Amora, Bavel (~280-352 CE)",
      en: "One of the two giants of Babylonian Talmud, with Abaye. Their endless debates ('הוויות דאביי ורבא') define Talmudic dialectic. Halacha almost always follows Rava.",
      yi: "איינער פֿון די צוויי ריזן פֿון בבלי, מיט אביי. די הלכה גייט כּמעט שטענדיק ווי רבא."
    },
    {
      patterns: ["אביי"],
      name: "Abaye",
      era: "Amora, Bavel (~280-339 CE)",
      en: "Head of the Pumbedita yeshiva. Constant debate partner of Rava. Their disputes are the heart of the Babylonian Talmud.",
      yi: "ראָש ישיבה פֿון פּומבדיתא. שטענדיקער דעבאַט־פּאַרטנער פֿון רבא."
    },
    {
      patterns: ["רב פפא", "רב פּפּא"],
      name: "Rav Papa",
      era: "Amora, Bavel (~300-375 CE)",
      en: "Founded a yeshiva in Naresh. Student of Rava and Abaye. Frequently mentioned in the Gemara as a senior figure.",
      yi: "תּלמיד פֿון רבא און אביי. גרינדער פֿון אַ ישיבה אין נרש."
    },
    {
      patterns: ["רב אשי"],
      name: "Rav Ashi",
      era: "Amora, Bavel (~352-427 CE)",
      en: "Compiled the Babylonian Talmud together with Ravina. The final 'horaa' (legal authority) — the Talmud was sealed in his generation.",
      yi: "צוזאַמען מיט רבינא, האָט ער קאָמפּילירט דעם תלמוד בבלי."
    },
    // Amoraim - Eretz Yisrael
    {
      patterns: ["רבי יוחנן", "ר׳ יוחנן", "ר\"י"],
      name: "Rabbi Yochanan bar Nappacha",
      era: "Amora, Eretz Yisrael (~180-279 CE)",
      en: "Founded the Yeshiva in Tiberias. Compiler of the Jerusalem Talmud. Frequent halachic debate with his brother-in-law Reish Lakish.",
      yi: "גרינדער פֿון דער ישיבה אין טבריה. דעבאַטירט שטענדיק מיט ריש לקיש."
    },
    {
      patterns: ["ריש לקיש", "רבי שמעון בן לקיש", "ר״ל", "ר\"ל"],
      name: "Reish Lakish (Rabbi Shimon ben Lakish)",
      era: "Amora, Eretz Yisrael (3rd c. CE)",
      en: "Former gladiator/bandit who became one of the greatest Amoraim under Rabbi Yochanan's influence. Brother-in-law of Rabbi Yochanan.",
      yi: "פֿריִער אַ גלאַדיאַטאָר, איז געוואָרן איינער פֿון די גרעסטע אמוראים."
    },
    {
      patterns: ["רב", "אָמַר רַב"],
      name: "Rav (Abba bar Aybo)",
      era: "Amora, Bavel (~175-247 CE)",
      en: "First-generation Babylonian Amora. Founded the Yeshiva in Sura. Student of Rebbi (Rabbi Yehuda HaNasi). When the Gemara says 'אמר רב', this is who.",
      yi: "ערשטער דור אמורא. גרינדער פֿון דער ישיבה אין סורא. תּלמיד פֿון רבי."
    },
    {
      patterns: ["שמואל"],
      name: "Shmuel (Mar Shmuel)",
      era: "Amora, Bavel (~165-257 CE)",
      en: "Contemporary of Rav. Founded the Yeshiva in Nehardea. Expert in civil law and astronomy. 'In monetary matters, halacha follows Shmuel.'",
      yi: "צײַטגענאָסע פֿון רב. גרינדער פֿון דער ישיבה אין נהרדעא. עקספּערט אין דיני ממונות."
    },
    {
      patterns: ["רבי חייא", "ר׳ חייא"],
      name: "Rabbi Chiya",
      era: "Tanna/early Amora (~180-230 CE)",
      en: "Compiled the major collection of Baraitos. Uncle of Rav. Bridge generation between Tannaim and Amoraim.",
      yi: "האָט קאָמפּילירט די גרויסע זאַמלונג פֿון ברײַתאָת. דער פֿעטער פֿון רב."
    },
    // Tanya
    {
      patterns: ["אדמו״ר הזקן", "אדמו\"ר הזקן", "הרב", "האדמו״ר"],
      name: "The Alter Rebbe (Rabbi Schneur Zalman of Liadi)",
      era: "1745-1812",
      en: "Author of the Tanya (Likutei Amarim) and the Shulchan Aruch HaRav. Founder of Chabad Chassidus. Disciple of the Maggid of Mezritch.",
      yi: "מחבר פֿון תניא און שולחן ערוך הרב. גרינדער פֿון חב\"ד חסידות."
    },
    {
      patterns: ["הרמב״ם", "הרמב\"ם", "רמב״ם", "רמב\"ם", "הרמב״ם ז״ל"],
      name: "Rambam (Maimonides)",
      era: "1135-1204",
      en: "Rabbi Moshe ben Maimon. Author of the Mishneh Torah, Moreh Nevuchim, and the Yad HaChazaka. Physician to the Sultan in Egypt. One of the greatest legal codifiers in Jewish history.",
      yi: "רבי משה בן מימון. דער מחבר פֿון משנה תורה און מורה נבוכים."
    }
  ];

  // Build a single regex combining all patterns (longest first so we match phrases before substrings)
  const allPatterns = RABBIS.flatMap(r => r.patterns.map(p => ({ p, rabbi: r })))
    .sort((a, b) => b.p.length - a.p.length);

  function findAll(text) {
    const matches = [];
    if (!text) return matches;
    allPatterns.forEach(({ p, rabbi }) => {
      let idx = 0;
      while ((idx = text.indexOf(p, idx)) !== -1) {
        matches.push({ start: idx, end: idx + p.length, rabbi });
        idx += p.length;
      }
    });
    return matches;
  }

  function lookup(text) {
    if (!text) return null;
    // Normalize: strip nikud + punctuation
    const clean = String(text).replace(/[֑-ׇ]/g, "").replace(/[.,;:()\[\]"'׳״?!]/g, "").trim();
    for (const r of RABBIS) {
      for (const p of r.patterns) {
        if (clean === p || clean.includes(p)) return r;
      }
    }
    return null;
  }

  function bio(rabbi, lang) {
    const desc = lang === "yi" ? (rabbi.yi || rabbi.en) : rabbi.en;
    return {
      name: rabbi.name,
      era: rabbi.era,
      description: desc
    };
  }

  global.RABBIS = { findAll, lookup, bio, all: () => RABBIS };
})(window);
