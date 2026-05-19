/* main.js — V2 minimal reading app.
   Flow: pick type → pick sefer → pick daf/chapter → READ
   Read screen pulls authoritative text from Sefaria, shows Hebrew + English inline,
   every Hebrew word tappable for real dictionary lookup. */
(function () {

  // ============================================================
  // CATALOG — what's available to pick.
  // (Adding more is just adding an entry; the read screen handles any Sefaria ref.)
  // ============================================================
  const CATALOG = {
    gemara: {
      title: "Gemara",
      sefarim: [
        { id: "Shabbat",  name: "Shabbos",  pages: dafRange(2, 10) },
        { id: "Berakhot", name: "Berachos", pages: dafRange(2, 10) }
      ]
    },
    chumash: {
      title: "Chumash",
      sefarim: [
        { id: "Genesis",    name: "Bereishis", pages: chRange(1, 5) },
        { id: "Exodus",     name: "Shemos",    pages: chRange(1, 5) },
        { id: "Leviticus",  name: "Vayikra",   pages: chRange(1, 5) },
        { id: "Numbers",    name: "Bamidbar",  pages: chRange(1, 5) },
        { id: "Deuteronomy",name: "Devarim",   pages: chRange(1, 5) }
      ]
    },
    tanya: {
      title: "Tanya",
      sefarim: [
        { id: "Tanya, Part I; Likkutei Amarim", name: "Likutei Amarim", pages: chRange(1, 53) }
      ]
    },
    mishnayos: {
      title: "Mishnayos",
      sefarim: [
        { id: "Pirkei Avot",        name: "Pirkei Avos",  pages: chRange(1, 6) },
        { id: "Mishnah Berakhot",   name: "Berachos",     pages: chRange(1, 9) },
        { id: "Mishnah Shabbat",    name: "Shabbos",      pages: chRange(1, 24) }
      ]
    }
  };

  function dafRange(startNum, endNum) {
    // Gemara: 2a, 2b, 3a, 3b, ...
    const out = [];
    for (let n = startNum; n <= endNum; n++) {
      out.push({ ref: n + "a", label: n + "a" });
      out.push({ ref: n + "b", label: n + "b" });
    }
    return out;
  }
  function chRange(s, e) {
    const out = [];
    for (let i = s; i <= e; i++) out.push({ ref: String(i), label: "Perek " + i });
    return out;
  }

  // ============================================================
  // State + screen routing
  // ============================================================
  const STATE = { type: null, sefer: null, page: null };
  let popupCloser = null;

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
    window.scrollTo(0, 0);
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  // ============================================================
  // Screen 1: Pick type
  // ============================================================
  document.querySelectorAll("[data-type]").forEach(btn => {
    btn.addEventListener("click", () => {
      STATE.type = btn.dataset.type;
      renderSeferGrid();
      showScreen("screen-sefer");
    });
  });

  function renderSeferGrid() {
    const cat = CATALOG[STATE.type];
    document.getElementById("sefer-title").textContent =
      cat.title + " — " + (STATE.type === "gemara" ? I18N.t("pick_masechta") : I18N.t("pick_sefer"));
    const grid = document.getElementById("sefer-grid");
    grid.innerHTML = "";
    cat.sefarim.forEach(s => {
      const btn = document.createElement("button");
      btn.className = "sefer-tile";
      btn.textContent = s.name;
      btn.addEventListener("click", () => {
        STATE.sefer = s;
        renderPageGrid();
        showScreen("screen-page");
      });
      grid.appendChild(btn);
    });
  }

  // ============================================================
  // Screen 2: Pick daf / chapter
  // ============================================================
  function renderPageGrid() {
    const promptKey = STATE.type === "gemara" ? "pick_daf" : "pick_chapter";
    document.getElementById("page-title").textContent =
      STATE.sefer.name + " — " + I18N.t(promptKey);
    const grid = document.getElementById("page-grid");
    grid.innerHTML = "";
    STATE.sefer.pages.forEach(p => {
      const btn = document.createElement("button");
      btn.className = "page-tile";
      btn.textContent = p.label;
      btn.addEventListener("click", () => {
        STATE.page = p;
        loadAndShowRead();
      });
      grid.appendChild(btn);
    });
  }

  // ============================================================
  // Screen 3: READ — fetch Sefaria text + render Hebrew/English/tappable words
  // ============================================================
  function buildRef() {
    return STATE.sefer.id + "." + STATE.page.ref;
  }

  async function loadAndShowRead() {
    document.getElementById("read-title").textContent = STATE.sefer.name + " " + STATE.page.label;
    document.getElementById("read-body").innerHTML = '<div class="loading">' + I18N.t("loading") + '</div>';
    document.getElementById("torahanytime").href =
      "https://www.torahanytime.com/search?q=" + encodeURIComponent(STATE.sefer.name + " " + STATE.page.label);
    renderReadNav();
    showScreen("screen-read");

    const ref = buildRef();
    const data = await SEFARIA.fetchText(ref);
    const body = document.getElementById("read-body");
    if (!data || (!data.he.length && !data.text.length)) {
      body.innerHTML = '<div class="loading">Could not load this section from Sefaria.</div>';
      return;
    }

    // Render segment-by-segment: Hebrew on top, English directly below
    body.innerHTML = "";
    const max = Math.max(data.he.length, data.text.length);
    for (let i = 0; i < max; i++) {
      const seg = document.createElement("div");
      seg.className = "segment";
      const he = data.he[i] || "";
      const en = data.text[i] || "";
      if (he) {
        const heDiv = document.createElement("div");
        heDiv.className = "segment-hebrew";
        heDiv.innerHTML = makeTappable(he);
        seg.appendChild(heDiv);
      }
      if (en) {
        const enDiv = document.createElement("div");
        enDiv.className = "segment-english";
        enDiv.textContent = en;
        seg.appendChild(enDiv);
      }
      body.appendChild(seg);
    }

    // Wire word taps after DOM insertion
    body.querySelectorAll(".tw").forEach(span => {
      span.addEventListener("click", e => {
        e.stopPropagation();
        showWordPopup(span, span.dataset.w);
      });
    });
  }

  // Split a Hebrew string by whitespace, wrap each word in a tappable span.
  // Keep punctuation attached to words; skip pure-punct runs.
  function makeTappable(hebrew) {
    const tokens = hebrew.split(/(\s+)/);
    return tokens.map(tok => {
      if (/^\s+$/.test(tok)) return tok;
      if (!/[֐-׿]/.test(tok)) return escapeHtml(tok); // not Hebrew
      return '<span class="tw" data-w="' + escapeHtml(tok) + '">' + escapeHtml(tok) + '</span>';
    }).join("");
  }

  async function showWordPopup(anchor, rawWord) {
    closeWordPopup();
    const popup = document.getElementById("word-popup");
    const clean = SEFARIA.stripNikud(rawWord).replace(/[.,;:()\[\]"׳״־]/g, "");
    popup.innerHTML =
      '<div class="popup-word">' + escapeHtml(clean) + '</div>' +
      '<div class="popup-def"><i>Looking up…</i></div>';
    positionPopup(popup, anchor);
    popup.classList.remove("hidden");

    const entries = await SEFARIA.fetchWord(rawWord);
    if (!entries || entries.length === 0) {
      popup.innerHTML =
        '<div class="popup-word">' + escapeHtml(clean) + '</div>' +
        '<div class="popup-def popup-empty">' + I18N.t("no_definition") + '</div>';
    } else {
      let html = '<div class="popup-word">' + escapeHtml(entries[0].headword || clean) + '</div>';
      html += '<div class="popup-def">';
      entries.slice(0, 2).forEach((e, i) => {
        if (i > 0) html += '<hr style="border:0;border-top:1px solid var(--border);margin:8px 0">';
        html += escapeHtml(e.senses.slice(0, 3).join(" • "));
        if (e.source) html += '<div class="popup-def-source">— ' + escapeHtml(e.source) + '</div>';
      });
      html += '</div>';
      popup.innerHTML = html;
    }
    positionPopup(popup, anchor);

    setTimeout(() => {
      popupCloser = (e) => {
        if (!popup.contains(e.target) && e.target !== anchor) closeWordPopup();
      };
      document.addEventListener("click", popupCloser);
    }, 0);
  }

  function positionPopup(popup, anchor) {
    const a = anchor.getBoundingClientRect();
    const p = popup.getBoundingClientRect();
    let left = a.left + window.scrollX + a.width / 2 - p.width / 2;
    let top = a.bottom + window.scrollY + 8;
    left = Math.max(8, Math.min(left, window.innerWidth - p.width - 8));
    popup.style.left = left + "px";
    popup.style.top = top + "px";
  }

  function closeWordPopup() {
    const popup = document.getElementById("word-popup");
    popup.classList.add("hidden");
    if (popupCloser) {
      document.removeEventListener("click", popupCloser);
      popupCloser = null;
    }
  }

  function renderReadNav() {
    const nav = document.getElementById("read-nav");
    const pages = STATE.sefer.pages;
    const idx = pages.findIndex(p => p.ref === STATE.page.ref);
    nav.innerHTML = "";
    const prev = document.createElement("button");
    prev.textContent = I18N.t("previous");
    prev.disabled = idx <= 0;
    prev.addEventListener("click", () => {
      if (idx > 0) { STATE.page = pages[idx - 1]; loadAndShowRead(); }
    });
    const next = document.createElement("button");
    next.textContent = I18N.t("next");
    next.disabled = idx >= pages.length - 1;
    next.addEventListener("click", () => {
      if (idx < pages.length - 1) { STATE.page = pages[idx + 1]; loadAndShowRead(); }
    });
    nav.appendChild(prev);
    nav.appendChild(next);
  }

  // ============================================================
  // Topbar buttons
  // ============================================================
  document.getElementById("home-btn").addEventListener("click", () => {
    closeWordPopup();
    showScreen("screen-type");
  });
  document.querySelectorAll("[data-back]").forEach(btn => {
    btn.addEventListener("click", () => {
      closeWordPopup();
      showScreen(btn.dataset.back);
    });
  });

  document.getElementById("font-btn").addEventListener("click", () => {
    const order = ["small", "medium", "large", "xlarge"];
    const cur = document.body.getAttribute("data-font") || "medium";
    const next = order[(order.indexOf(cur) + 1) % order.length];
    document.body.setAttribute("data-font", next);
    try { localStorage.setItem("ui_font", next); } catch (e) {}
  });

  document.getElementById("lang-btn").addEventListener("click", () => {
    I18N.set(I18N.current === "en" ? "yi" : "en");
  });

  // Feedback
  const FEEDBACK_EMAIL = "chesky2039@gmail.com";
  const feedbackModal = document.getElementById("feedback-modal");
  document.getElementById("feedback-btn").addEventListener("click", () => feedbackModal.classList.remove("hidden"));
  document.getElementById("feedback-close").addEventListener("click", () => feedbackModal.classList.add("hidden"));
  document.getElementById("feedback-send").addEventListener("click", () => {
    const txt = document.getElementById("feedback-text").value.trim();
    if (!txt) { toast(I18N.t("feedback_empty")); return; }
    const mailto = "mailto:" + FEEDBACK_EMAIL +
      "?subject=" + encodeURIComponent("[Tap to Learn] Feedback") +
      "&body=" + encodeURIComponent(txt + "\n\n— sent from " + window.location.href);
    window.location.href = mailto;
    toast(I18N.t("feedback_sent"));
    feedbackModal.classList.add("hidden");
    document.getElementById("feedback-text").value = "";
  });

  // ============================================================
  // Init
  // ============================================================
  try {
    const savedLang = localStorage.getItem("ui_lang");
    if (savedLang) I18N.set(savedLang); else I18N.set("en");
    const savedFont = localStorage.getItem("ui_font");
    if (savedFont) document.body.setAttribute("data-font", savedFont);
  } catch (e) { I18N.set("en"); }

  showScreen("screen-type");
})();
