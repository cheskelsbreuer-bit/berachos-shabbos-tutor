/* glossary.js — built-in cheat-sheet for Gemara/Tanya abbreviations and common phrases.
   Open from menu drawer "Quick reference". */
(function (global) {
  const ENTRIES = [
    // Structural markers
    { abbr: "מתני׳", full: "מַתְנִיתִין", meaning: "The Mishnah", meaning_yi: "די משנה", cat: "structure" },
    { abbr: "גמ׳", full: "גְּמָרָא", meaning: "The Gemara — the Talmudic discussion of the Mishnah", meaning_yi: "די גמרא", cat: "structure" },
    { abbr: "תנא", full: "תַּנָּא", meaning: "The Tanna — a sage of the Mishnaic period", meaning_yi: "אַ תנא", cat: "structure" },
    { abbr: "ת״ר", full: "תָּנוּ רַבָּנָן", meaning: "The Rabbis taught (in a baraita)", meaning_yi: "די רבנן האָבן געלערנט", cat: "structure" },
    { abbr: "תניא", full: "תַּנְיָא", meaning: "It was taught (in a baraita)", meaning_yi: "מ׳האָט געלערנט", cat: "structure" },
    { abbr: "ת״ש", full: "תָּא שְׁמַע", meaning: "Come and hear (introducing a proof from a source)", meaning_yi: "קום און הער (אַ ראיה)", cat: "proof" },

    // Speech / who said what
    { abbr: "א״ר", full: "אָמַר רַבִּי", meaning: "Said Rabbi…", meaning_yi: "ר׳... האָט געזאָגט", cat: "speech" },
    { abbr: "אר״י", full: "אָמַר רַבִּי יוֹחָנָן", meaning: "Said Rabbi Yochanan", meaning_yi: "ר׳ יוחנן האָט געזאָגט", cat: "speech" },
    { abbr: "אר״ל", full: "אָמַר רֵישׁ לָקִישׁ", meaning: "Said Reish Lakish", meaning_yi: "ריש לקיש האָט געזאָגט", cat: "speech" },
    { abbr: "א״ל", full: "אָמַר לוֹ / אָמַר לֵיהּ", meaning: "He said to him", meaning_yi: "ער האָט אים געזאָגט", cat: "speech" },
    { abbr: "אמ״ר", full: "אָמַר מָר", meaning: "The master said (referring to a previous statement)", meaning_yi: "דער מאַסטער האָט געזאָגט", cat: "speech" },

    // Questions
    { abbr: "מאי", full: "מַאי", meaning: "What is…?", meaning_yi: "וואָס איז…?", cat: "question" },
    { abbr: "מ״ט", full: "מַאי טַעְמָא", meaning: "What's the reason?", meaning_yi: "וואָס איז דער טעם?", cat: "question" },
    { abbr: "מנא לן", full: "מְנָא לָן", meaning: "How do we know? (Where is this derived from?)", meaning_yi: "פֿון וואו ווייסן מיר?", cat: "question" },
    { abbr: "מנא ה״מ", full: "מְנָא הָנֵי מִילֵּי", meaning: "Where is this from? (Where do these words come from?)", meaning_yi: "פֿון וואו זענען די ווערטער?", cat: "question" },
    { abbr: "בעיא", full: "בָּעֲיָא", meaning: "A question", meaning_yi: "אַ קשיא", cat: "question" },
    { abbr: "ק״ו", full: "קַל וָחֹמֶר", meaning: "All the more so / a fortiori inference", meaning_yi: "אַ קל וחומר", cat: "question" },

    // Answer/resolution
    { abbr: "ש״מ", full: "שְׁמַע מִינַּהּ", meaning: "Learn from this / hence we derive", meaning_yi: "לערן פֿון דעם", cat: "answer" },
    { abbr: "תיובתא", full: "תְּיוּבְתָּא", meaning: "A refutation — the previous opinion is overturned", meaning_yi: "אַ תּיובתא", cat: "answer" },
    { abbr: "תיקו", full: "תֵּיקוּ", meaning: "The question stands unresolved", meaning_yi: "די קשיא בלײַבט", cat: "answer" },
    { abbr: "אלא", full: "אֶלָּא", meaning: "Rather (introducing a new explanation)", meaning_yi: "נאָר", cat: "answer" },
    { abbr: "דאמר", full: "דְּאָמַר", meaning: "Who said / that said", meaning_yi: "וואָס האָט געזאָגט", cat: "answer" },

    // Citing / sources
    { abbr: "דכתיב", full: "דִּכְתִיב", meaning: "As it is written (citing a pasuk)", meaning_yi: "ווי עס שטייט (אַ פּסוק)", cat: "proof" },
    { abbr: "שנא׳", full: "שֶׁנֶּאֱמַר", meaning: "As it is said (citing scripture)", meaning_yi: "ווי עס שטייט", cat: "proof" },
    { abbr: "וכת׳", full: "וּכְתִיב", meaning: "And it is written", meaning_yi: "און עס שטייט", cat: "proof" },

    // Common shortcuts
    { abbr: "וכו׳", full: "וְכוּלֵיהּ", meaning: "Etc.", meaning_yi: "א.אַ.וו.", cat: "misc" },
    { abbr: "וגו׳", full: "וְגוֹמֵר", meaning: "And so on (when quoting a pasuk)", meaning_yi: "און ווײַטער", cat: "misc" },
    { abbr: "ז״ל", full: "זִכְרוֹנוֹ לִבְרָכָה", meaning: "Of blessed memory", meaning_yi: "זכרונו לברכה", cat: "misc" },
    { abbr: "זצ״ל", full: "זֵכֶר צַדִּיק לִבְרָכָה", meaning: "Memory of the righteous is a blessing", meaning_yi: "זכר צדיק לברכה", cat: "misc" },
    { abbr: "ע״ז", full: "עַל זֶה", meaning: "On this / regarding this", meaning_yi: "אויף דעם", cat: "misc" },
    { abbr: "ע״כ", full: "עַד כָּאן", meaning: "Up to here (end of citation)", meaning_yi: "ביז דאָ", cat: "misc" }
  ];

  const CATEGORIES = {
    structure: { en: "📜 Mishnah / Gemara markers", yi: "📜 משנה/גמרא צייכנס" },
    speech: { en: "💬 Who said what", yi: "💬 ווער האָט געזאָגט" },
    question: { en: "❓ Questions", yi: "❓ קשיות" },
    answer: { en: "✓ Answers / conclusions", yi: "✓ ענטפֿערס" },
    proof: { en: "📖 Bringing proof", yi: "📖 ראיות" },
    misc: { en: "✨ Common shortcuts", yi: "✨ מיני אַבריוויאַציעס" }
  };

  function render(lang) {
    let html = '<div class="glossary-intro">' +
      (lang === "yi"
        ? "די אַבריוויאַציעס דאַ זענען די וויכטיגסטע צו פֿאַרשטיין אַ דף גמרא. טאַפּט אַ צייל פֿאַר מער."
        : "These are the most common abbreviations you need to read a daf of Gemara. Tap a row for more.") +
      '</div>';
    Object.keys(CATEGORIES).forEach((cat) => {
      const heading = lang === "yi" ? CATEGORIES[cat].yi : CATEGORIES[cat].en;
      const items = ENTRIES.filter(e => e.cat === cat);
      if (!items.length) return;
      html += '<div class="glossary-section"><h3 class="glossary-h">' + heading + '</h3>';
      items.forEach((e) => {
        const meaning = lang === "yi" ? (e.meaning_yi || e.meaning) : e.meaning;
        html +=
          '<div class="glossary-row">' +
            '<div class="glossary-abbr">' + e.abbr + '</div>' +
            '<div class="glossary-body">' +
              '<div class="glossary-full">' + e.full + '</div>' +
              '<div class="glossary-meaning">' + meaning + '</div>' +
            '</div>' +
          '</div>';
      });
      html += '</div>';
    });
    return html;
  }

  global.GLOSSARY = { render };
})(window);
