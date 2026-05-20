/* features-v10.js — Daf summaries, Rabbi-name bios, Daily Torah card,
   My Library screen, Achievements view, Print mode trigger. */
(function (global) {

  // ============================================================
  // Detect Rabbi names in displayed Hebrew and wrap them as tappable
  // ============================================================
  global.wrapRabbiNames = function (html) {
    if (!html || typeof RABBIS !== "object") return html;
    // Strip nikud just for matching, but preserve original.
    // We do a simple find on the *innerHTML* — match patterns and wrap with a span.
    const all = RABBIS.all();
    // Sort patterns longest first so "רבי אליעזר" wins over "רבי"
    const flat = [];
    all.forEach((r) => r.patterns.forEach((p) => flat.push({ p, r })));
    flat.sort((a, b) => b.p.length - a.p.length);
    flat.forEach(({ p, r }) => {
      const escP = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Don't match inside an existing span (avoid double-wrap or breaking the .pr-word spans).
      // Simplest safe approach: skip if pattern is short (so we don't pick up "רב" by itself
      // and clobber every span).
      if (p.length < 4) return;
      const re = new RegExp(escP, "g");
      html = html.replace(re, '<span class="rabbi-name" data-rabbi="' + p + '">' + p + '</span>');
    });
    return html;
  };

  // Strip nikud/punctuation for matching
  function _stripForMatch(s) {
    return String(s || "").replace(/[֑-ׇ]/g, "").replace(/[.,;:()\[\]"'׳״?!]/g, "").trim();
  }

  /** After Plain Read renders, walk consecutive .pr-word spans and add a Rabbi-bio
      indicator on any group whose stripped text matches a Rabbi pattern. */
  global.markRabbiNamesInDOM = function (root) {
    if (!root || typeof RABBIS !== "object") return;
    const all = RABBIS.all();
    // Build pattern list (stripped form for matching)
    const patterns = [];
    all.forEach((r) => {
      r.patterns.forEach((p) => {
        const stripped = _stripForMatch(p);
        if (stripped.length >= 3) patterns.push({ stripped, key: p, rabbi: r });
      });
    });
    patterns.sort((a, b) => b.stripped.length - a.stripped.length);

    root.querySelectorAll(".pr-section").forEach((section) => {
      const words = Array.from(section.querySelectorAll(".pr-word"));
      // Mark by collecting consecutive runs of words and checking against patterns
      const used = new Set();
      for (let i = 0; i < words.length; i++) {
        if (used.has(i)) continue;
        // Build phrases starting at i (1-word, 2-word, 3-word)
        for (let span = 3; span >= 1; span--) {
          if (i + span > words.length) continue;
          const slice = words.slice(i, i + span);
          if (slice.some((w, k) => used.has(i + k))) continue;
          const phrase = slice.map(w => _stripForMatch(w.dataset.w || w.textContent)).join(" ");
          const hit = patterns.find(p => p.stripped === phrase);
          if (hit) {
            slice.forEach((w, k) => {
              w.classList.add("rabbi-name");
              w.dataset.rabbi = hit.key;
              if (k === 0) w.classList.add("rabbi-name-start");
              if (k === slice.length - 1) w.classList.add("rabbi-name-end");
              used.add(i + k);
            });
            i += span - 1; // skip the words we consumed
            break;
          }
        }
      }
      // Wire up bio popup on click — but only intercept on the first word
      section.querySelectorAll(".rabbi-name").forEach((w) => {
        w.addEventListener("click", (e) => {
          // Only show bio if we shift-clicked OR if user wants bio mode
          // To avoid breaking the word-translation click, we use a small flag:
          // double-click → bio, single click → word def (existing behavior)
        }, true);
        w.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (w.dataset.rabbi && typeof window.showRabbiBio === "function") {
            window.showRabbiBio(w, w.dataset.rabbi);
          }
        });
      });
    });
  };

  global.showRabbiBio = function (anchor, patternKey) {
    const rabbi = RABBIS.lookup(patternKey);
    if (!rabbi) return;
    const lang = I18N.current;
    const bio = RABBIS.bio(rabbi, lang);
    const popup = document.getElementById("word-popup");
    popup.innerHTML =
      '<div class="word-popup-aramaic">' + escapeHtml(bio.name) + '</div>' +
      '<div class="word-popup-en" style="font-size:0.78em;color:#6b7280">' + escapeHtml(bio.era) + '</div>' +
      '<div class="word-popup-en" style="margin-top:6px;line-height:1.5">' + escapeHtml(bio.description) + '</div>';
    popup.classList.remove("hidden");
    const rect = anchor.getBoundingClientRect();
    const popRect = popup.getBoundingClientRect();
    let left = rect.left + window.scrollX + rect.width / 2 - popRect.width / 2;
    let top = rect.bottom + window.scrollY + 8;
    left = Math.max(8, Math.min(left, window.innerWidth - popRect.width - 8));
    popup.style.left = left + "px";
    popup.style.top = top + "px";
    setTimeout(() => {
      const dismiss = (e) => {
        if (!popup.contains(e.target) && e.target !== anchor) {
          popup.classList.add("hidden");
          document.removeEventListener("click", dismiss);
        }
      };
      document.addEventListener("click", dismiss);
    }, 0);
  };

  // English names → Hebrew lookup key so we can show a bio
  function englishToHebrewRabbi(englishName) {
    const map = {
      "Rabbi Eliezer": "רבי אליעזר",
      "Rabbi Yehoshua": "רבי יהושע",
      "Rabban Gamliel": "רבן גמליאל",
      "Rabbi Akiva": "רבי עקיבא",
      "Rabbi Meir": "רבי מאיר",
      "Rabbi Yehuda": "רבי יהודה",
      "Rabbi Shimon": "רבי שמעון",
      "Rebbi": "רבי",
      "Rabbi": "רבי",
      "Rava": "רבא",
      "Abaye": "אביי",
      "Rav Papa": "רב פפא",
      "Rav Ashi": "רב אשי",
      "Rabbi Yochanan": "רבי יוחנן",
      "Reish Lakish": "ריש לקיש",
      "Rav": "רב",
      "Shmuel": "שמואל",
      "Rabbi Chiya": "רבי חייא",
      "The Alter Rebbe": "אדמו״ר הזקן",
      "Rambam": "הרמב״ם"
    };
    return map[englishName] || null;
  }

  // ============================================================
  // Daf summary header
  // ============================================================
  global.renderDafSummary = function (sugyaId) {
    if (typeof DAF_SUMMARIES !== "object" || !DAF_SUMMARIES.has(sugyaId)) return "";
    const s = DAF_SUMMARIES.get(sugyaId);
    const lang = I18N.current;
    const title = lang === "yi" ? (s.title_yi || s.title) : s.title;
    const body = lang === "yi" ? (s.summary_yi || s.summary) : s.summary;
    const chars = (s.characters || []).length
      ? '<div class="daf-summary-chars"><b>' + (lang === "yi" ? "וועמען מ׳זעט: " : "Look for: ") + '</b>' +
        s.characters.map((c) => {
          const heKey = englishToHebrewRabbi(c);
          if (heKey) return '<button class="daf-summary-char clickable" data-rabbi="' + escapeHtml(heKey) + '">' + escapeHtml(c) + '</button>';
          return '<span class="daf-summary-char">' + escapeHtml(c) + '</span>';
        }).join(" ") + '</div>'
      : "";
    return '<div class="daf-summary">' +
      '<div class="daf-summary-label">📋 ' + (lang === "yi" ? "וועגן וואָס איז דאָס?" : "What's this about?") + '</div>' +
      '<div class="daf-summary-title">' + escapeHtml(title) + '</div>' +
      '<div class="daf-summary-body">' + escapeHtml(body) + '</div>' +
      chars +
    '</div>';
  };

  // ============================================================
  // Daily Torah card on home/picker screen
  // ============================================================
  const DAILY_TORAH = {
    /** Picks a teaching for today based on the date. */
    pickForToday() {
      const teachings = [
        { ref: "Pirkei Avot 1:2", en: "The world stands on three things: on Torah, on Avodah, and on acts of kindness. — Shimon HaTzadik", he: "עַל שְׁלֹשָׁה דְבָרִים הָעוֹלָם עוֹמֵד: עַל הַתּוֹרָה, וְעַל הָעֲבוֹדָה, וְעַל גְּמִילוּת חֲסָדִים" },
        { ref: "Pirkei Avot 1:14", en: "If I am not for myself, who will be? And if I am only for myself, what am I? And if not now, when? — Hillel", he: "אִם אֵין אֲנִי לִי, מִי לִי. וּכְשֶׁאֲנִי לְעַצְמִי, מָה אֲנִי. וְאִם לֹא עַכְשָׁיו, אֵימָתָי" },
        { ref: "Pirkei Avot 2:5", en: "In a place where there are no men, strive to be a man. — Hillel", he: "וּבְמָקוֹם שֶׁאֵין אֲנָשִׁים, הִשְׁתַּדֵּל לִהְיוֹת אִישׁ" },
        { ref: "Pirkei Avot 2:16", en: "It is not your responsibility to finish the work, but neither are you free to desist from it. — Rabbi Tarfon", he: "לֹא עָלֶיךָ הַמְּלָאכָה לִגְמוֹר, וְלֹא אַתָּה בֶן חוֹרִין לִיבָּטֵל מִמֶּנָּה" },
        { ref: "Pirkei Avot 4:1", en: "Who is wise? One who learns from every person. Who is strong? One who conquers his inclination. — Ben Zoma", he: "אֵיזֶהוּ חָכָם, הַלּוֹמֵד מִכָּל אָדָם. אֵיזֶהוּ גִבּוֹר, הַכּוֹבֵשׁ אֶת יִצְרוֹ" },
        { ref: "Shabbos 2a", en: "There are 39 melachos forbidden on Shabbos — carrying between domains is one of them.", he: "יְצִיאוֹת הַשַּׁבָּת שְׁתַּיִם שֶׁהֵן אַרְבַּע" },
        { ref: "Berachos 2a", en: "From when do we recite the evening Shema? From when the Kohanim go in to eat their Terumah.", he: "מֵאֵימָתַי קוֹרִין אֶת שְׁמַע בְּעַרְבִית" },
        { ref: "Tanya Ch. 1", en: "Be a Tzadik and do not be a Rasha; even if the whole world tells you that you are a Tzadik, consider yourself a Rasha.", he: "הֱוֵי צַדִּיק וְאַל תְּהִי רָשָׁע" },
        { ref: "Tanya Ch. 2", en: "Every Jew has a soul that is literally a part of God Above.", he: "וְנֶפֶשׁ הַשֵּׁנִית בְּיִשְׂרָאֵל הִיא חֵלֶק אֱלוֹהַּ מִמַּעַל מַמָּשׁ" },
        { ref: "Bereishis 1:1", en: "In the beginning God created the heavens and the earth. — The opening of the Torah.", he: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ" }
      ];
      const date = new Date();
      const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
      return teachings[dayOfYear % teachings.length];
    },
    renderInto(elId) {
      const el = document.getElementById(elId);
      if (!el) return;
      const t = this.pickForToday();
      el.innerHTML =
        '<div class="daily-torah">' +
          '<div class="daily-torah-label">✨ ' + (I18N.current === "yi" ? "הײַנטיקע תורה" : "Today's teaching") + '</div>' +
          '<div class="daily-torah-he">' + escapeHtml(t.he) + '</div>' +
          '<div class="daily-torah-en">' + escapeHtml(t.en) + '</div>' +
          '<div class="daily-torah-ref">— ' + escapeHtml(t.ref) + '</div>' +
        '</div>';
    }
  };
  global.DAILY_TORAH = DAILY_TORAH;

  // ============================================================
  // My Library — all bookmarks + sentence-bookmarks + notes
  // ============================================================
  const LIBRARY = {
    open() {
      const overlay = document.getElementById("library-overlay");
      overlay.classList.remove("hidden");
      this.render();
    },
    close() {
      document.getElementById("library-overlay").classList.add("hidden");
    },
    render() {
      const lang = I18N.current;
      const sugyaBookmarks = (PROGRESS.state.bookmarks || []);
      const sentenceBookmarks = (PROGRESS.state.sentenceBookmarks || {});
      const notes = (PROGRESS.state.notes || {});
      const body = document.getElementById("library-body");

      let html = "";

      // Bookmarked sugyos
      html += '<section class="lib-section"><h3 class="lib-h">🔖 ' + (lang === "yi" ? "געספּיכערטע סוגיות" : "Bookmarked sugyos") + '</h3>';
      if (!sugyaBookmarks.length) html += '<div class="lib-empty">' + (lang === "yi" ? "ניטאָ קיינס נאָך" : "Nothing yet.") + '</div>';
      else {
        sugyaBookmarks.forEach((id) => {
          const f = findSugya(id);
          if (!f) return;
          const title = lang === "yi" ? (f.sugya.title_yiddish || f.sugya.title) : f.sugya.title;
          html += '<button class="lib-row" data-open-sugya="' + escapeHtml(id) + '">' + escapeHtml(title) + '</button>';
        });
      }
      html += '</section>';

      // Sentence bookmarks
      html += '<section class="lib-section"><h3 class="lib-h">📑 ' + (lang === "yi" ? "געספּיכערטע זאצן" : "Saved sentences") + '</h3>';
      const sBkCount = Object.values(sentenceBookmarks).reduce((s, a) => s + (a ? a.length : 0), 0);
      if (!sBkCount) html += '<div class="lib-empty">' + (lang === "yi" ? "ניטאָ קיינס" : "None yet.") + '</div>';
      else {
        Object.keys(sentenceBookmarks).forEach((sid) => {
          const arr = sentenceBookmarks[sid] || [];
          if (!arr.length) return;
          const f = findSugya(sid);
          if (!f) return;
          const title = lang === "yi" ? (f.sugya.title_yiddish || f.sugya.title) : f.sugya.title;
          html += '<button class="lib-row" data-open-sugya="' + escapeHtml(sid) + '">' +
            '<span>' + escapeHtml(title) + '</span>' +
            '<span class="lib-count">' + arr.length + '</span>' +
          '</button>';
        });
      }
      html += '</section>';

      // Notes
      html += '<section class="lib-section"><h3 class="lib-h">📝 ' + (lang === "yi" ? "מײַנע נאָטיצן" : "My notes") + '</h3>';
      const noteSugyaIds = Object.keys(notes).filter((sid) => {
        const secs = notes[sid] || {};
        return Object.keys(secs).some((k) => (secs[k] || "").trim());
      });
      if (!noteSugyaIds.length) html += '<div class="lib-empty">' + (lang === "yi" ? "ניטאָ קיין נאָטיצן" : "No notes yet.") + '</div>';
      else {
        noteSugyaIds.forEach((sid) => {
          const f = findSugya(sid);
          if (!f) return;
          const title = lang === "yi" ? (f.sugya.title_yiddish || f.sugya.title) : f.sugya.title;
          const secs = notes[sid] || {};
          Object.keys(secs).forEach((secId) => {
            const txt = (secs[secId] || "").trim();
            if (!txt) return;
            html += '<div class="lib-note">' +
              '<div class="lib-note-head"><button class="lib-note-open" data-open-sugya="' + escapeHtml(sid) + '">' + escapeHtml(title) + '</button></div>' +
              '<div class="lib-note-text">' + escapeHtml(txt) + '</div>' +
            '</div>';
          });
        });
      }
      html += '</section>';

      body.innerHTML = html;
      body.querySelectorAll("[data-open-sugya]").forEach((btn) => {
        btn.addEventListener("click", () => {
          LIBRARY.close();
          pickSugyaAndStart(btn.dataset.openSugya, "plain_read");
        });
      });
    }
  };
  global.LIBRARY = LIBRARY;

  // ============================================================
  // Achievements view (badges)
  // ============================================================
  const ACHIEVEMENTS_LIST = [
    { id: "streak3",      title: "3-day streak",     desc: "Learn 3 days in a row", emoji: "🔥" },
    { id: "streak7",      title: "Week streak",      desc: "7 days in a row",       emoji: "⭐" },
    { id: "streak14",     title: "Two-week streak",  desc: "14 days in a row",      emoji: "🏆" },
    { id: "streak30",     title: "Month streak",     desc: "30 days in a row",      emoji: "🚀" },
    { id: "deck_complete",title: "Deck completed",   desc: "Finished a flashcard deck", emoji: "🎴" }
  ];
  const ACHIEVEMENTS = {
    open() {
      document.getElementById("achievements-overlay").classList.remove("hidden");
      this.render();
    },
    close() {
      document.getElementById("achievements-overlay").classList.add("hidden");
    },
    render() {
      const earned = new Set(PROGRESS.state.badges || []);
      let html = '<div class="ach-grid">';
      ACHIEVEMENTS_LIST.forEach((a) => {
        const got = earned.has(a.id);
        html +=
          '<div class="ach-tile' + (got ? " earned" : "") + '">' +
            '<div class="ach-emoji">' + a.emoji + '</div>' +
            '<div class="ach-title">' + escapeHtml(a.title) + '</div>' +
            '<div class="ach-desc">' + escapeHtml(a.desc) + '</div>' +
          '</div>';
      });
      html += '</div>';
      html += '<div class="ach-summary">' +
        (PROGRESS.state.xp || 0) + ' XP · Level ' + (PROGRESS.state.level || 1) +
      '</div>';
      document.getElementById("achievements-body").innerHTML = html;
    }
  };
  global.ACHIEVEMENTS = ACHIEVEMENTS;

  // ============================================================
  // Init — wire menu buttons and observe picker
  // ============================================================
  function init() {
    // Wire menu items
    const lib = document.getElementById("library-btn");
    if (lib) lib.addEventListener("click", () => LIBRARY.open());
    const libClose = document.getElementById("library-close");
    if (libClose) libClose.addEventListener("click", () => LIBRARY.close());

    const ach = document.getElementById("achievements-btn");
    if (ach) ach.addEventListener("click", () => ACHIEVEMENTS.open());
    const achClose = document.getElementById("achievements-close");
    if (achClose) achClose.addEventListener("click", () => ACHIEVEMENTS.close());

    const print = document.getElementById("print-btn");
    if (print) print.addEventListener("click", () => window.print());

    // Render Daily Torah on picker activation
    const pickEl = document.getElementById("screen-pick");
    if (pickEl) {
      const obs = new MutationObserver(() => {
        if (pickEl.classList.contains("active")) {
          DAILY_TORAH.renderInto("daily-torah-wrap");
        }
      });
      obs.observe(pickEl, { attributes: true, attributeFilter: ["class"] });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
