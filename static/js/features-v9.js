/* features-v9.js — Glossary modal, Today's Daf, First-time tutorial,
   Sentence bookmarks (data layer), Long-press grammar lookup,
   Color-coded Gemara structure helpers. */
(function (global) {

  // ============================================================
  // GLOSSARY MODAL
  // ============================================================
  const GLOSSARY_UI = {
    init() {
      const overlay = document.getElementById("glossary-overlay");
      if (!overlay) return;
      const open = () => {
        document.getElementById("glossary-body").innerHTML = GLOSSARY.render(I18N.current);
        overlay.classList.remove("hidden");
      };
      const close = () => overlay.classList.add("hidden");
      const btn = document.getElementById("glossary-btn");
      if (btn) btn.addEventListener("click", open);
      const closeBtn = document.getElementById("glossary-close");
      if (closeBtn) closeBtn.addEventListener("click", close);
      overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    }
  };

  // ============================================================
  // TODAY'S DAF YOMI WIDGET
  // Uses Sefaria's calendars API.
  // ============================================================
  const DAF_YOMI = {
    cache: null,
    async fetch() {
      if (this.cache && Date.now() - this.cache.ts < 12 * 60 * 60 * 1000) return this.cache.data;
      try {
        const r = await fetch("https://www.sefaria.org/api/calendars");
        if (!r.ok) return null;
        const d = await r.json();
        // Find Daf Yomi in the calendar items
        const items = (d && d.calendar_items) || [];
        const daf = items.find((c) => c && c.title && (c.title.en === "Daf Yomi" || (c.title.en || "").toLowerCase().indexOf("daf yomi") >= 0));
        this.cache = { ts: Date.now(), data: daf };
        return daf;
      } catch (e) {
        return null;
      }
    },
    async renderInto(elId) {
      const el = document.getElementById(elId);
      if (!el) return;
      const daf = await this.fetch();
      if (!daf) { el.innerHTML = ""; return; }
      // displayValue.en e.g. "Sanhedrin 14" — ref e.g. "Sanhedrin.14a"
      const display = (daf.displayValue && (daf.displayValue.en || daf.displayValue)) || (daf.title && daf.title.en) || "";
      const ref = daf.url || daf.ref || "";
      const sefariaUrl = ref ? ("https://www.sefaria.org/" + encodeURIComponent(ref).replace(/%20/g, "_")) : "";
      el.innerHTML =
        '<div class="daf-yomi-widget">' +
          '<div class="daf-yomi-label">' + I18N.t("today_daf") + '</div>' +
          '<div class="daf-yomi-title">' + escapeHtml(display) + '</div>' +
          (sefariaUrl ? '<a class="daf-yomi-link" target="_blank" rel="noopener" href="' + escapeHtml(sefariaUrl) + '">📖 Open on Sefaria →</a>' : '') +
        '</div>';
    }
  };

  // ============================================================
  // FIRST-TIME TUTORIAL
  // ============================================================
  const TUTORIAL = {
    steps: ["1", "2", "3", "4", "5"],
    idx: 0,
    init() {
      const seen = PROGRESS.state.tutorialSeen;
      if (seen) return;
      this.idx = 0;
      this.render();
      document.getElementById("tutorial-overlay").classList.remove("hidden");
      document.getElementById("tutorial-skip").addEventListener("click", () => this.finish());
      document.getElementById("tutorial-next").addEventListener("click", () => this.next());
    },
    render() {
      const i = this.idx + 1;
      const title = I18N.t("tut_t" + i);
      const body = I18N.t("tut_b" + i);
      document.getElementById("tutorial-content").innerHTML =
        '<h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(body) + '</p>';
      const dots = this.steps.map((_, k) =>
        '<span class="tut-dot' + (k === this.idx ? ' active' : '') + '"></span>'
      ).join("");
      document.getElementById("tutorial-dots").innerHTML = dots;
      const nextBtn = document.getElementById("tutorial-next");
      nextBtn.textContent = (this.idx === this.steps.length - 1)
        ? I18N.t("tutorial_done")
        : I18N.t("tutorial_next");
    },
    next() {
      if (this.idx >= this.steps.length - 1) { this.finish(); return; }
      this.idx += 1;
      this.render();
    },
    finish() {
      document.getElementById("tutorial-overlay").classList.add("hidden");
      PROGRESS.state.tutorialSeen = true;
      PROGRESS.save();
    }
  };

  // ============================================================
  // SENTENCE-LEVEL BOOKMARKS — extend PROGRESS state
  // ============================================================
  function ensureSentenceBookmarks() {
    if (!PROGRESS.state.sentenceBookmarks) PROGRESS.state.sentenceBookmarks = {};
  }
  global.toggleSentenceBookmark = function (sugyaId, sectionId) {
    ensureSentenceBookmarks();
    const map = PROGRESS.state.sentenceBookmarks;
    if (!map[sugyaId]) map[sugyaId] = [];
    const idx = map[sugyaId].indexOf(sectionId);
    if (idx >= 0) map[sugyaId].splice(idx, 1);
    else map[sugyaId].push(sectionId);
    PROGRESS.save();
    return idx < 0; // true if just added
  };
  global.isSentenceBookmarked = function (sugyaId, sectionId) {
    ensureSentenceBookmarks();
    const arr = (PROGRESS.state.sentenceBookmarks || {})[sugyaId] || [];
    return arr.indexOf(sectionId) >= 0;
  };

  // ============================================================
  // COLOR-CODED GEMARA STRUCTURE
  // Simple pattern-based wrapping: detect common question / answer / proof markers
  // and wrap them in styled spans.
  // ============================================================
  const STRUCT_PATTERNS = [
    { re: /(מַתְנִי׳|גמ׳|תַּנְיָא|תָּנוּ רַבָּנָן|תָּ״ר)/g, cls: "g-marker" },
    { re: /(מַאי טַעְמָא|מְנָא לָן|מְנָא הָנֵי מִילֵּי|מַאי\?|תָּא שְׁמַע|ת״ש|בְּעָא|בָּעְיָא|לֵימָא)/g, cls: "g-question" },
    { re: /(אֲמַר רָבָא|אֲמַר רַבִּי|אָמַר רַב|אָמַר רֵישׁ לָקִישׁ|אַתָּה|אֶלָּא|שְׁמַע מִינַּהּ|דְּאָמַר)/g, cls: "g-answer" },
    { re: /(דִּכְתִיב|שֶׁנֶּאֱמַר|וּכְתִיב)/g, cls: "g-proof" }
  ];
  global.colorCodeHebrew = function (html) {
    if (!SETTINGS.get("colorStructure")) return html;
    STRUCT_PATTERNS.forEach((p) => {
      html = html.replace(p.re, '<span class="' + p.cls + '">$1</span>');
    });
    return html;
  };

  // ============================================================
  // LONG-PRESS HANDLER
  // For mobile: long-press a tappable word to get extended info (all senses, etymology).
  // For desktop: shift-click.
  // ============================================================
  global.attachLongPress = function (element, onLongPress) {
    let timer = null;
    let triggered = false;
    const ms = 650;
    const start = (e) => {
      triggered = false;
      timer = setTimeout(() => {
        triggered = true;
        onLongPress(e);
      }, ms);
    };
    const cancel = () => {
      if (timer) { clearTimeout(timer); timer = null; }
    };
    element.addEventListener("touchstart", start, { passive: true });
    element.addEventListener("touchend", cancel);
    element.addEventListener("touchmove", cancel);
    element.addEventListener("mousedown", (e) => {
      if (e.shiftKey) { onLongPress(e); return; }
      start(e);
    });
    element.addEventListener("mouseup", cancel);
    element.addEventListener("mouseleave", cancel);
    return () => triggered;
  };

  // ============================================================
  // CONTINUE READING widget — on picker screen
  // ============================================================
  const RESUME = {
    renderInto(elId) {
      const el = document.getElementById(elId);
      if (!el) return;
      const sid = PROGRESS.state.currentSugyaId;
      if (!sid) { el.innerHTML = ""; return; }
      const found = findSugya(sid);
      if (!found) { el.innerHTML = ""; return; }
      const lang = I18N.current;
      const title = lang === "yi" ? (found.sugya.title_yiddish || found.sugya.title) : found.sugya.title;
      const mode = PROGRESS.state.preferredMode || "plain_read";
      el.innerHTML =
        '<button class="resume-btn-big" id="resume-now">' +
          '<span class="resume-emoji">▶</span>' +
          '<span class="resume-text">' +
            '<div class="resume-label">' + I18N.t("continue_reading") + '</div>' +
            '<div class="resume-title">' + escapeHtml(title) + '</div>' +
          '</span>' +
        '</button>';
      document.getElementById("resume-now").addEventListener("click", () => {
        pickSugyaAndStart(sid, mode);
      });
    }
  };

  // Initialize all UI hooks on DOM ready
  function init() {
    GLOSSARY_UI.init();
    // Today's daf + Resume render on screen-pick activation
    const observer = new MutationObserver(() => {
      const pick = document.getElementById("screen-pick");
      if (pick && pick.classList.contains("active")) {
        DAF_YOMI.renderInto("daf-yomi-wrap");
        RESUME.renderInto("resume-wrap");
      }
    });
    const pickEl = document.getElementById("screen-pick");
    if (pickEl) observer.observe(pickEl, { attributes: true, attributeFilter: ["class"] });

    // Start tutorial after content loads
    setTimeout(() => TUTORIAL.init(), 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.TUTORIAL = TUTORIAL;
  global.DAF_YOMI = DAF_YOMI;
  global.RESUME = RESUME;
})(window);
