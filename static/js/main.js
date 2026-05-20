/* main.js — V2 orchestration: settings, picker, mistakes/notes/stickers screens,
   word tap popups, side-by-side, focus mode, weekly recap, smart review, chazara. */
(function () {
  let CONTENT = null;
  let CURRENT_SUGYA = null;
  let PICKER_FILTER = "all"; // "all" or "bookmarks"
  let TYPE_FILTER = "all";   // "all" / "gemara" / "tanya" / "chumash" / "mishnayos"

  // ============ Utilities (globals used by modes) ============
  window.escapeHtml = function (str) {
    if (str == null) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  window.showScreen = function (id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
    document.getElementById("app-header").classList.toggle("hidden", id === "screen-language");
  };

  window.showToast = function (msg, ms) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    setTimeout(() => t.classList.add("hidden"), ms || 2200);
  };

  window.celebrate = function () {
    const c = document.getElementById("celebrate");
    c.innerHTML = "";
    c.classList.remove("hidden");
    const emojis = ["⭐", "🎉", "✨", "🌟", "💫"];
    for (let i = 0; i < 16; i += 1) {
      const span = document.createElement("span");
      span.className = "star";
      span.textContent = emojis[i % emojis.length];
      span.style.left = Math.random() * 90 + 5 + "%";
      span.style.top = Math.random() * 60 + 20 + "%";
      span.style.animationDelay = (Math.random() * 0.3) + "s";
      c.appendChild(span);
    }
    setTimeout(() => { c.classList.add("hidden"); c.innerHTML = ""; }, 1500);
  };

  window.findSugya = function (sugyaId) {
    if (!CONTENT) return null;
    for (const m of CONTENT.masechtos || []) {
      for (const perek of m.perakim || []) {
        for (const sugya of perek.sugyos || []) {
          if (sugya.id === sugyaId) return { sugya, perek, masechta: m };
        }
      }
    }
    return null;
  };

  window.getCurrentSugya = function () { return CURRENT_SUGYA; };

  /** Linear list of all sugyos in order. */
  function allSugyosInOrder() {
    const out = [];
    (CONTENT.masechtos || []).forEach((m) => {
      (m.perakim || []).forEach((perek) => {
        (perek.sugyos || []).forEach((s) => out.push(s));
      });
    });
    return out;
  }

  window.findNextSugya = function (currentId) {
    const all = allSugyosInOrder();
    const idx = all.findIndex((s) => s.id === currentId);
    if (idx < 0 || idx === all.length - 1) return null;
    return all[idx + 1];
  };

  window.pickSugyaAndStart = function (sugyaId, mode) {
    const found = findSugya(sugyaId);
    if (!found) return;
    CURRENT_SUGYA = found.sugya;
    PROGRESS.state.currentSugyaId = sugyaId;
    PROGRESS.save();
    startLearning(mode);
  };

  // ============ Word-by-word panel in modes ============
  function renderWordByWord(words) {
    if (!words || !words.length) return "";
    let html = '<div class="word-grid">';
    words.forEach((w) => {
      const yi = w.yi ? '<div class="word-yi">' + escapeHtml(w.yi) + '</div>' : "";
      const en = w.en ? '<div class="word-en">' + escapeHtml(w.en) + '</div>' : "";
      html += '<div class="word-chip"><div class="word-aramaic">' + escapeHtml(w.a || "") + '</div>' + en + yi + '</div>';
    });
    html += '</div>';
    return html;
  }
  window.renderWordByWord = renderWordByWord;

  window.wbwPanelHtml = function () {
    const sugya = CURRENT_SUGYA;
    if (!sugya || !sugya.aramaic_words || !sugya.aramaic_words.length) return "";
    return '<button class="wbw-panel-toggle" data-wbw-toggle>' + I18N.t("word_by_word_section") + '</button>' +
      '<div class="wbw-panel hidden" data-wbw-panel>' + renderWordByWord(sugya.aramaic_words) + '</div>';
  };

  window.wireWbwToggle = function (root, sugya) {
    const btn = root.querySelector("[data-wbw-toggle]");
    const panel = root.querySelector("[data-wbw-panel]");
    if (!btn || !panel) return;
    btn.addEventListener("click", () => panel.classList.toggle("hidden"));
  };

  // ============ Commentary panels (Rashi / Tosfos) ============
  function isRealCommentary(text) {
    return text && typeof text === "string" && !text.startsWith("[") && text.trim().length > 0;
  }
  window.isRealCommentary = isRealCommentary;

  window.commentaryHtml = function (sec) {
    const lang = I18N.current;
    const showRashi = SETTINGS.get("showRashi") && (isRealCommentary(sec.rashi) || isRealCommentary(sec.rashi_explanation));
    const showTosfos = SETTINGS.get("showTosfos") && (isRealCommentary(sec.tosfos) || isRealCommentary(sec.tosfos_explanation));
    if (!showRashi && !showTosfos) return "";
    let html = '<div class="commentary-row">';
    if (showRashi) html += '<button class="commentary-toggle" data-comm="rashi">' + I18N.t("show_rashi") + '</button>';
    if (showTosfos) html += '<button class="commentary-toggle" data-comm="tosfos">' + I18N.t("show_tosfos") + '</button>';
    html += '</div>';
    if (showRashi) {
      const original = lang === "yi" ? (sec.rashi_yiddish || sec.rashi) : sec.rashi;
      const plain = lang === "yi" ? (sec.rashi_explanation_yiddish || sec.rashi_explanation) : sec.rashi_explanation;
      html += '<div class="commentary-panel hidden" data-comm-panel="rashi">' +
        '<div class="aramaic-section-label">' + I18N.t("rashi_label") + '</div>' +
        (isRealCommentary(original) ? '<div class="commentary-original">' + escapeHtml(original) + '</div>' : '') +
        (isRealCommentary(plain) ? '<div class="commentary-plain">' + escapeHtml(plain) + '</div>' : '') +
      '</div>';
    }
    if (showTosfos) {
      const original = lang === "yi" ? (sec.tosfos_yiddish || sec.tosfos) : sec.tosfos;
      const plain = lang === "yi" ? (sec.tosfos_explanation_yiddish || sec.tosfos_explanation) : sec.tosfos_explanation;
      html += '<div class="commentary-panel hidden" data-comm-panel="tosfos">' +
        '<div class="aramaic-section-label">' + I18N.t("tosfos_label") + '</div>' +
        (isRealCommentary(original) ? '<div class="commentary-original">' + escapeHtml(original) + '</div>' : '') +
        (isRealCommentary(plain) ? '<div class="commentary-plain">' + escapeHtml(plain) + '</div>' : '') +
      '</div>';
    }
    return html;
  };

  window.wireCommentaryToggles = function (root) {
    root.querySelectorAll("[data-comm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.comm;
        const panel = root.querySelector('[data-comm-panel="' + name + '"]');
        if (panel) panel.classList.toggle("hidden");
      });
    });
  };

  // ============ Tappable Aramaic words ============
  window.renderTappableText = function (text) {
    if (!SETTINGS.get("wordTap") || !CURRENT_SUGYA || !CURRENT_SUGYA.aramaic_words) {
      return escapeHtml(text || "");
    }
    let out = escapeHtml(text || "");
    CURRENT_SUGYA.aramaic_words.forEach((w, idx) => {
      const aramaicEsc = escapeHtml(w.a);
      if (!aramaicEsc || !w.a) return;
      // Replace each occurrence (case-sensitive)
      const re = new RegExp(aramaicEsc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      out = out.replace(re, '<span class="tappable-word" data-word-idx="' + idx + '">' + aramaicEsc + '</span>');
    });
    return out;
  };

  window.wireTappableWords = function (root, sugya) {
    if (!sugya || !sugya.aramaic_words) return;
    root.querySelectorAll(".tappable-word").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(el.dataset.wordIdx, 10);
        const w = sugya.aramaic_words[idx];
        if (!w) return;
        const popup = document.getElementById("word-popup");
        popup.innerHTML =
          '<div class="word-popup-aramaic">' + escapeHtml(w.a) + '</div>' +
          (w.en ? '<div class="word-popup-en">' + escapeHtml(w.en) + '</div>' : '') +
          (w.yi ? '<div class="word-popup-yi">' + escapeHtml(w.yi) + '</div>' : '');
        const rect = el.getBoundingClientRect();
        popup.classList.remove("hidden");
        popup.style.left = Math.max(10, rect.left) + "px";
        popup.style.top = (rect.bottom + 6) + "px";
      });
    });
  };

  // Dismiss popup on outside click
  document.addEventListener("click", (e) => {
    const popup = document.getElementById("word-popup");
    if (!popup || popup.classList.contains("hidden")) return;
    if (e.target.closest(".tappable-word") || e.target.closest(".word-popup")) return;
    popup.classList.add("hidden");
  });

  // ============ Card action row (repeat, speaker, notes, bookmark) ============
  window.cardActionsRow = function (sectionId) {
    const sugyaId = CURRENT_SUGYA ? CURRENT_SUGYA.id : "";
    const hasNote = sugyaId && PROGRESS.getNote(sugyaId, sectionId);
    const bookmarked = sugyaId && PROGRESS.isBookmarked(sugyaId);

    let html = '<div class="card-actions-row">';
    if (SETTINGS.get("repeatButton")) html += '<button class="card-action-btn" data-action="repeat" title="Repeat">🔁</button>';
    if (SETTINGS.get("readAloud") || true) html += '<button class="card-action-btn" data-action="speak" title="Read aloud">🔊</button>';
    if (SETTINGS.get("bookmarks") && sugyaId) html += '<button class="card-action-btn" data-action="bookmark" title="Bookmark">' + (bookmarked ? "🔖" : "📑") + '</button>';
    if (SETTINGS.get("notes") && sugyaId) html += '<button class="card-action-btn" data-action="note" title="Add note">' + (hasNote ? "📝✓" : "📝") + '</button>';
    if (sugyaId) html += '<button class="card-action-btn" data-action="share" title="Share">📤</button>';
    html += '</div>';
    html += '<div class="notes-area hidden" data-notes-area></div>';
    return html;
  };

  window.wireCardActions = function (root, sugyaId, sectionId, onRepeat) {
    root.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const a = btn.dataset.action;
        if (a === "repeat") {
          if (onRepeat) onRepeat();
        } else if (a === "speak") {
          const text = root.querySelector(".game-text, .story-card, .flashcard-face.front");
          if (text) speak(text.textContent);
        } else if (a === "bookmark") {
          const added = PROGRESS.toggleBookmark(sugyaId);
          showToast(added ? I18N.t("bookmark_added") : I18N.t("bookmark_removed"));
          btn.textContent = added ? "🔖" : "📑";
        } else if (a === "note") {
          const area = root.querySelector("[data-notes-area]");
          if (area.classList.contains("hidden")) {
            area.classList.remove("hidden");
            const existing = PROGRESS.getNote(sugyaId, sectionId);
            area.innerHTML =
              '<div class="notes-controls"><textarea placeholder="..." data-note-input>' + escapeHtml(existing) + '</textarea>' +
              '<button class="card-action-btn voice-mic-btn" data-voice-mic title="Voice input">🎤</button></div>' +
              '<div style="text-align:end;margin-top:6px"><button class="primary-btn" data-note-save>' + I18N.t("save_note") + '</button></div>';
            const ta = area.querySelector("[data-note-input]");
            const mic = area.querySelector("[data-voice-mic]");
            VOICE.attachToTextarea(ta, mic);
            area.querySelector("[data-note-save]").addEventListener("click", () => {
              VOICE.stop();
              const txt = ta.value;
              PROGRESS.saveNote(sugyaId, sectionId, txt);
              showToast(I18N.t("settings_saved"));
              area.classList.add("hidden");
              btn.textContent = txt ? "📝✓" : "📝";
            });
          } else {
            VOICE.stop();
            area.classList.add("hidden");
          }
        } else if (a === "share") {
          if (CURRENT_SUGYA) SHARE.shareSugya(CURRENT_SUGYA);
        }
      });
    });
  };

  // ============ Read aloud ============
  function speak(text) {
    if (!text) return;
    if (!("speechSynthesis" in window)) { showToast("🔇 audio unavailable"); return; }
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = (I18N.current === "yi") ? "yi" : "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) { /* ignore */ }
  }
  window.speak = speak;
  window.maybeReadAloud = function (text) {
    if (SETTINGS.get("readAloud")) speak(text);
  };

  // ============ Content load ============
  async function loadContent() {
    // Try the Flask API first; fall back to the static JSON file (for GitHub Pages / static hosts).
    const candidates = ["/api/content", "data/content.json", "/data/content.json"];
    for (const url of candidates) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        CONTENT = await res.json();
        if (typeof window.cacheContent === "function") window.cacheContent(CONTENT);
        return CONTENT;
      } catch (e) { /* try next */ }
    }
    CONTENT = { masechtos: [] };
    showToast("Could not load content");
    return CONTENT;
  }

  function firstSugya() {
    if (!CONTENT) return null;
    for (const m of CONTENT.masechtos || []) {
      for (const p of m.perakim || []) {
        if (p.sugyos && p.sugyos.length) return p.sugyos[0];
      }
    }
    return null;
  }

  // ============ Picker ============
  function renderCompletionMap() {
    const wrap = document.getElementById("completion-map");
    if (!SETTINGS.get("completionMap")) { wrap.classList.add("hidden"); return; }
    wrap.classList.remove("hidden");
    let html = '<h3>📍 Completion Map</h3><div class="daf-tile-row">';
    allSugyosInOrder().forEach((sug) => {
      const status = PROGRESS.completionStatus(sug.id);
      html += '<button class="daf-tile ' + status + '" data-jump="' + sug.id + '">' + escapeHtml(sug.daf || sug.id) + '</button>';
    });
    html += '</div>';
    wrap.innerHTML = html;
    wrap.querySelectorAll("[data-jump]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.querySelector('[data-sugya-card="' + btn.dataset.jump + '"]');
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  function renderWeakSpots() {
    const wrap = document.getElementById("weak-spots");
    if (!SETTINGS.get("weakSpots")) { wrap.classList.add("hidden"); return; }
    const mistakes = PROGRESS.state.mistakes || {};
    const flat = [];
    Object.keys(mistakes).forEach((sId) => {
      Object.keys(mistakes[sId]).forEach((secId) => {
        flat.push({ sugyaId: sId, sectionId: secId, count: mistakes[sId][secId].count || 1 });
      });
    });
    if (!flat.length) { wrap.classList.add("hidden"); return; }
    flat.sort((a, b) => b.count - a.count);
    const top = flat.slice(0, 5);

    wrap.classList.remove("hidden");
    let html = '<h3>⚠️ ' + I18N.t("weak_spots_title") + '</h3>';
    top.forEach((entry) => {
      const found = findSugya(entry.sugyaId);
      if (!found) return;
      const sec = (found.sugya.sections || []).find((s) => s.id === entry.sectionId);
      const term = sec ? (I18N.current === "yi" ? (sec.term_yiddish || sec.term) : sec.term) : entry.sectionId;
      html += '<div class="weak-item"><div><b>' + escapeHtml(term || "") + '</b> · <span class="mistake-item-count">' + entry.count + I18N.t("times_wrong") + '</span></div>' +
        '<button data-weak-practice="' + entry.sugyaId + '">' + I18N.t("practice_this") + '</button></div>';
    });
    wrap.innerHTML = html;
    wrap.querySelectorAll("[data-weak-practice]").forEach((btn) => {
      btn.addEventListener("click", () => pickSugyaAndStart(btn.dataset.weakPractice, "flashcard"));
    });
  }

  function renderPickerTools() {
    const wrap = document.getElementById("picker-tools");
    let html = "";
    html += '<button data-filter="all" class="' + (PICKER_FILTER === "all" ? "active" : "") + '">' + I18N.t("show_all") + '</button>';
    if (SETTINGS.get("bookmarks")) {
      html += '<button data-filter="bookmarks" class="' + (PICKER_FILTER === "bookmarks" ? "active" : "") + '">' + I18N.t("filter_bookmarks") + '</button>';
    }
    if (SETTINGS.get("chazaraMode")) html += '<button id="picker-chazara">🔁 ' + I18N.t("chazara_mode") + '</button>';
    if (SETTINGS.get("smartDailyReview")) {
      const due = REVIEW.collectDueCards(CONTENT).length;
      if (due > 0) html += '<button id="picker-smart">' + due + ' ' + I18N.t("due_today") + '</button>';
    }
    if (PROGRESS.state.ageGroup === "kids" && SETTINGS.get("stickerBook")) {
      html += '<button id="picker-stickers">🌟 ' + I18N.t("my_stickers") + '</button>';
    }
    wrap.innerHTML = html;
    wrap.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => { PICKER_FILTER = btn.dataset.filter; renderPicker(); });
    });
    const sm = document.getElementById("picker-smart");
    if (sm) sm.addEventListener("click", () => startSmartReview());
    const cz = document.getElementById("picker-chazara");
    if (cz) cz.addEventListener("click", () => startChazara());
    const sk = document.getElementById("picker-stickers");
    if (sk) sk.addEventListener("click", () => renderStickers());
  }

  function renderPicker() {
    renderPickerTools();
    renderCompletionMap();
    renderWeakSpots();

    const lang = I18N.current;
    const list = document.getElementById("perakim-list");
    list.innerHTML = "";

    (CONTENT.masechtos || []).forEach((m) => {
      // Filter by content type chip
      if (TYPE_FILTER && TYPE_FILTER !== "all" && (m.content_type || "gemara") !== TYPE_FILTER) return;
      const mName = lang === "yi" ? (m.name_yiddish || m.name) : m.name;
      const masechtaHeader = document.createElement("div");
      masechtaHeader.className = "masechta-header";
      const typeLabel = m.content_type ? '<span class="masechta-type-pill">' + I18N.t("type_" + m.content_type) + '</span>' : '';
      masechtaHeader.innerHTML = '<h2 class="masechta-title">' + escapeHtml(mName || "") + ' ' + typeLabel + '</h2>';
      list.appendChild(masechtaHeader);

      (m.perakim || []).forEach((perek) => {
        const perekName = lang === "yi" ? perek.name_yiddish : perek.name;
        const perekSub = lang === "yi" ? perek.name_en_yiddish : perek.name_en;
        const block = document.createElement("div");
        block.className = "perek-block";
        block.innerHTML =
          '<div class="perek-title">' + escapeHtml(perekName || "") + '</div>' +
          (perekSub ? '<div class="perek-subtitle">' + escapeHtml(perekSub) + '</div>' : '') +
          '<div class="sugya-grid"></div>';
        const grid = block.querySelector(".sugya-grid");
        let added = 0;
        (perek.sugyos || []).forEach((sug) => {
          if (PICKER_FILTER === "bookmarks" && !PROGRESS.isBookmarked(sug.id)) return;
          added += 1;
          const title = lang === "yi" ? (sug.title_yiddish || sug.title) : sug.title;
          const status = PROGRESS.completionStatus(sug.id);
          const statusEmoji = status === "complete" ? "✅" : status === "started" ? "⏳" : "";
          const bookmarked = PROGRESS.isBookmarked(sug.id);
          const high = (PROGRESS.state.progress[sug.id] && PROGRESS.state.progress[sug.id].game && PROGRESS.state.progress[sug.id].game.highScore) || 0;

          const card = document.createElement("button");
          card.className = "sugya-card";
          card.setAttribute("data-sugya-card", sug.id);
          card.innerHTML =
            '<div class="sugya-thumb">' + ILLUSTRATIONS.get(sug.illustration) + '</div>' +
            '<div class="sugya-info">' +
              '<div class="sugya-daf">' + I18N.t("daf_label") + ' ' + escapeHtml(sug.daf || "") + ' <span class="sugya-status">' + statusEmoji + '</span></div>' +
              '<div class="sugya-title-text">' + escapeHtml(title || "") + '</div>' +
              (high > 0 ? '<div class="sugya-best">🏆 ' + high + '</div>' : "") +
            '</div>' +
            (SETTINGS.get("bookmarks") ? '<button class="sugya-bookmark ' + (bookmarked ? "active" : "") + '" data-bookmark="' + sug.id + '">🔖</button>' : "");
          card.addEventListener("click", () => pickSugya(sug.id));
          grid.appendChild(card);
        });
        if (added > 0) list.appendChild(block);
      });
    });
    list.querySelectorAll("[data-bookmark]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const added = PROGRESS.toggleBookmark(btn.dataset.bookmark);
        btn.classList.toggle("active", added);
        showToast(added ? I18N.t("bookmark_added") : I18N.t("bookmark_removed"));
      });
    });
  }

  window.pickSugya = function (sugyaId) {
    const found = findSugya(sugyaId);
    if (!found) return;
    CURRENT_SUGYA = found.sugya;
    PROGRESS.state.currentSugyaId = sugyaId;
    PROGRESS.save();
    showModeScreen(PROGRESS.state.preferredMode, "challenges");
  };

  // Find the masechta containing the current sugya, get its content_type
  function getCurrentContentType() {
    const found = CURRENT_SUGYA && findSugya(CURRENT_SUGYA.id);
    return (found && found.masechta && found.masechta.content_type) || "gemara";
  }

  // ============ Mode screen ============
  window.showModeScreen = function (recommendedMode, reason) {
    const summary = document.getElementById("sugya-summary");
    if (CURRENT_SUGYA) {
      const lang = I18N.current;
      const title = lang === "yi" ? (CURRENT_SUGYA.title_yiddish || CURRENT_SUGYA.title) : CURRENT_SUGYA.title;
      summary.innerHTML = '<b>' + I18N.t("daf_label") + ' ' + escapeHtml(CURRENT_SUGYA.daf || "") + ':</b> ' + escapeHtml(title || "");
    } else summary.textContent = "";

    // Filter mode buttons by current content type
    const ctype = getCurrentContentType();
    PROGRESS.state.currentContentType = ctype;
    let firstVisibleMode = null;
    document.querySelectorAll(".mode-btn").forEach((b) => {
      const types = (b.dataset.forTypes || "").split(",").map(s => s.trim()).filter(Boolean);
      const show = types.length === 0 || types.includes(ctype);
      b.style.display = show ? "" : "none";
      if (show && !firstVisibleMode) firstVisibleMode = b.dataset.modeChoice;
    });

    // Use masechta default_mode if available, else recommended, else first visible
    const found = CURRENT_SUGYA && findSugya(CURRENT_SUGYA.id);
    const masechtaDefault = found && found.masechta && found.masechta.default_mode;
    const effectiveRec = masechtaDefault || recommendedMode || firstVisibleMode;

    const recEl = document.getElementById("mode-recommendation");
    if (effectiveRec) {
      const intro = masechtaDefault ? I18N.t("mode_best_for_this") : (reason === "quiz" ? I18N.t("mode_recommended_intro") : I18N.t("mode_chosen_for_challenges"));
      recEl.innerHTML = intro + " <b>" + I18N.t("mode_" + effectiveRec) + "</b>";
    } else recEl.textContent = "";
    document.querySelectorAll(".mode-btn").forEach((b) => {
      b.style.borderColor = (b.dataset.modeChoice === effectiveRec) ? "var(--primary)" : "";
    });
    showScreen("screen-mode");
  };

  // ============ Learn screen header ============
  function renderSugyaHeader() {
    const wrap = document.getElementById("sugya-header");
    const aWrap = document.getElementById("aramaic-toggle-wrap");
    const aPanel = document.getElementById("aramaic-panel");
    if (!CURRENT_SUGYA) {
      wrap.innerHTML = ""; aWrap.innerHTML = ""; aPanel.innerHTML = ""; aPanel.classList.add("hidden");
      return;
    }
    const lang = I18N.current;
    const title = lang === "yi" ? (CURRENT_SUGYA.title_yiddish || CURRENT_SUGYA.title) : CURRENT_SUGYA.title;
    const isPlaceholder = title && title.includes("[");
    wrap.innerHTML =
      '<div class="sugya-header-illustration">' + ILLUSTRATIONS.get(CURRENT_SUGYA.illustration) + '</div>' +
      '<div class="sugya-header-text">' +
        '<div class="sugya-header-title">' + escapeHtml(title || "") + '</div>' +
        '<div class="sugya-header-daf">' + I18N.t("daf_label") + ' ' + escapeHtml(CURRENT_SUGYA.daf || "") + '</div>' +
        (isPlaceholder ? '<div style="color:var(--danger);font-size:0.85em;margin-top:4px">' + I18N.t("placeholder_warning") + '</div>' : '') +
      '</div>';

    if (CURRENT_SUGYA.aramaic) {
      aWrap.innerHTML = '<button class="aramaic-toggle" id="aramaic-toggle">' + I18N.t("show_aramaic") + '</button>';
      const translation = lang === "yi" ? (CURRENT_SUGYA.aramaic_translation_yiddish || CURRENT_SUGYA.aramaic_translation) : CURRENT_SUGYA.aramaic_translation;
      aPanel.innerHTML =
        '<div class="aramaic-section-label">📜 ' + I18N.t("aramaic_label") + '</div>' +
        '<div class="aramaic-text">' + escapeHtml(CURRENT_SUGYA.aramaic) + '</div>' +
        '<div class="aramaic-section-label">' + I18N.t("translation_label") + '</div>' +
        '<div class="aramaic-translation">' + escapeHtml(translation || "") + '</div>' +
        (CURRENT_SUGYA.aramaic_words && CURRENT_SUGYA.aramaic_words.length ?
          '<div class="aramaic-section-label" style="margin-top:14px">🔤 ' + I18N.t("word_by_word_label") + '</div>' +
          renderWordByWord(CURRENT_SUGYA.aramaic_words) : '');
      document.getElementById("aramaic-toggle").addEventListener("click", () => {
        const hidden = aPanel.classList.toggle("hidden");
        document.getElementById("aramaic-toggle").textContent = hidden ? I18N.t("show_aramaic") : I18N.t("hide_aramaic");
      });
    } else {
      aWrap.innerHTML = "";
      aPanel.classList.add("hidden");
    }
  }

  window.startLearning = function (mode) {
    if (!CURRENT_SUGYA) CURRENT_SUGYA = firstSugya();
    if (!CURRENT_SUGYA) { showToast("No content yet"); return; }
    PROGRESS.setPreferredMode(mode);
    document.body.setAttribute("data-mode", mode);
    showScreen("screen-learn");
    renderSugyaHeader();
    const pageLike = { id: CURRENT_SUGYA.id, sections: CURRENT_SUGYA.sections };
    if (mode === "game") GAME.start(pageLike);
    else if (mode === "flashcard") FLASH.start(pageLike);
    else if (mode === "story") STORY.start(pageLike);
    else if (mode === "plain_read") PLAINREAD.start(pageLike);
  };

  // ============ Smart review / Chazara ============
  function startSmartReview() {
    const due = REVIEW.collectDueCards(CONTENT);
    if (!due.length) { showToast(I18N.t("no_due_cards")); return; }
    FLASH.startCustom(due, I18N.t("smart_review"));
  }

  function startChazara() {
    const done = REVIEW.collectCompletedSugyos(CONTENT);
    if (!done.length) { showToast(I18N.t("chazara_title") + ": " + I18N.t("no_due_cards")); return; }
    // Build random question queue from completed sugyos
    const pool = [];
    done.forEach((sug) => (sug.sections || []).forEach((sec) => pool.push({ sug, sec })));
    pool.sort(() => Math.random() - 0.5);
    PROGRESS.state.chazaraHistory.push(new Date().toISOString());
    PROGRESS.save();
    runChazara(pool);
  }

  function runChazara(pool) {
    showScreen("screen-chazara");
    let idx = 0;
    const area = document.getElementById("chazara-area");
    function renderOne() {
      if (idx >= pool.length) { area.innerHTML = '<h2>' + I18N.t("done") + '</h2>'; return; }
      const { sec } = pool[idx];
      const lang = I18N.current;
      const q = lang === "yi" ? (sec.question_yiddish || sec.question) : sec.question;
      let html = '<div class="story-question">';
      html += '<div class="quiz-question-text">' + escapeHtml(q || "") + '</div>';
      html += '<div class="quiz-options">';
      (sec.answers || []).forEach((a, i) => {
        const t = lang === "yi" ? (a.text_yiddish || a.text) : a.text;
        html += '<button class="quiz-option" data-i="' + i + '">' + escapeHtml(t) + '</button>';
      });
      html += '</div></div>';
      area.innerHTML = html;
      area.querySelectorAll(".quiz-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          const a = sec.answers[parseInt(btn.dataset.i, 10)];
          if (a.correct) { AUDIO.play("correct"); btn.classList.add("selected"); btn.style.background = "var(--success)"; btn.style.color = "white"; }
          else { AUDIO.play("wrong"); btn.style.background = "var(--danger)"; btn.style.color = "white"; }
          setTimeout(() => { idx += 1; renderOne(); }, 900);
        });
      });
    }
    renderOne();
  }

  // ============ Mistakes / Notes / Stickers screens ============
  function renderMistakes() {
    const body = document.getElementById("mistakes-list-body");
    const lang = I18N.current;
    body.innerHTML = "";
    const mistakes = PROGRESS.state.mistakes || {};
    const ids = Object.keys(mistakes);
    if (!ids.length) { body.innerHTML = '<p class="subtitle">' + I18N.t("no_mistakes_yet") + '</p>'; return; }
    ids.forEach((sId) => {
      const found = findSugya(sId);
      if (!found) return;
      const sugya = found.sugya;
      Object.keys(mistakes[sId]).forEach((secId) => {
        const sec = (sugya.sections || []).find((s) => s.id === secId);
        if (!sec) return;
        const m = mistakes[sId][secId];
        const q = lang === "yi" ? (sec.question_yiddish || sec.question) : sec.question;
        const correctAns = (sec.answers || []).find((a) => a.correct);
        const ans = correctAns ? (lang === "yi" ? (correctAns.text_yiddish || correctAns.text) : correctAns.text) : "";
        const exp = lang === "yi" ? (sec.explanation_yiddish || sec.explanation) : sec.explanation;
        body.innerHTML +=
          '<div class="mistake-item">' +
            '<div class="mistake-item-q">' + escapeHtml(q || "") + '</div>' +
            '<div class="mistake-item-a">✅ ' + escapeHtml(ans) + '</div>' +
            '<div class="mistake-item-exp">' + escapeHtml(exp || "") + '</div>' +
            '<div class="mistake-item-count">' + (m.count || 1) + I18N.t("times_wrong") + '</div>' +
          '</div>';
      });
    });
    showScreen("screen-mistakes");
  }

  function renderNotes() {
    const body = document.getElementById("notes-list-body");
    body.innerHTML = "";
    const notes = PROGRESS.state.notes || {};
    const ids = Object.keys(notes);
    if (!ids.length) { body.innerHTML = '<p class="subtitle">' + I18N.t("no_notes_yet") + '</p>'; }
    const lang = I18N.current;
    ids.forEach((sId) => {
      const found = findSugya(sId);
      if (!found) return;
      const sugya = found.sugya;
      const title = lang === "yi" ? (sugya.title_yiddish || sugya.title) : sugya.title;
      Object.keys(notes[sId]).forEach((secId) => {
        body.innerHTML +=
          '<div class="note-item">' +
            '<b>' + I18N.t("daf_label") + ' ' + escapeHtml(sugya.daf || "") + '</b> — ' + escapeHtml(title || "") +
            '<div style="margin-top:6px;white-space:pre-wrap">' + escapeHtml(notes[sId][secId]) + '</div>' +
          '</div>';
      });
    });
    showScreen("screen-notes");
  }

  function renderStickers() {
    const grid = document.getElementById("sticker-grid");
    grid.innerHTML = "";
    const stickers = PROGRESS.state.stickers || [];
    allSugyosInOrder().forEach((sug) => {
      const earned = stickers.includes(sug.id);
      const cell = document.createElement("div");
      cell.className = "sticker-cell" + (earned ? " earned" : "");
      const title = I18N.current === "yi" ? (sug.title_yiddish || sug.title) : sug.title;
      cell.innerHTML = '<div class="star">' + (earned ? "⭐" : "·") + '</div><div>' + escapeHtml(sug.daf || "") + '</div>';
      grid.appendChild(cell);
    });
    showScreen("screen-stickers");
  }

  // ============ Welcome-back enhancements ============
  function renderWeeklyRecap() {
    const wrap = document.getElementById("weekly-recap");
    const activity = PROGRESS.state.weeklyActivity || {};
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      days.push({ iso, label: ["Su","Mo","Tu","We","Th","Fr","Sa"][d.getDay()], count: activity[iso] || 0 });
    }
    const max = Math.max(1, ...days.map((d) => d.count));
    const todayISO = days[days.length - 1].iso;
    let bars = '<div class="weekly-bars">';
    days.forEach((d) => {
      const h = Math.round((d.count / max) * 60);
      bars += '<div class="weekly-bar' + (d.iso === todayISO ? " today" : "") + '" style="height:' + (4 + h) + 'px"><span class="weekly-bar-label">' + d.label + '</span></div>';
    });
    bars += '</div>';
    const totalQ = days.reduce((s, d) => s + d.count, 0);
    const streak = PROGRESS.state.streak.current || 0;
    bars += '<div class="weekly-summary">' + I18N.t("this_week") + ' ' + totalQ + ' ' + I18N.t("questions_done") + ' · ' + streak + ' ' + I18N.t("day_streak") + '</div>';
    wrap.innerHTML = bars;
  }

  function renderContinueWhere() {
    const wrap = document.getElementById("continue-where");
    const id = PROGRESS.state.currentSugyaId;
    const found = id ? findSugya(id) : null;
    if (!found) { wrap.innerHTML = ""; return; }
    const lang = I18N.current;
    const title = lang === "yi" ? (found.sugya.title_yiddish || found.sugya.title) : found.sugya.title;
    wrap.innerHTML =
      '<div>' + I18N.t("continue_label") + '</div>' +
      '<button id="continue-btn">▶ ' + I18N.t("daf_label") + ' ' + escapeHtml(found.sugya.daf || "") + ' — ' + escapeHtml(title || "") + '</button>';
    document.getElementById("continue-btn").addEventListener("click", () => {
      pickSugyaAndStart(id, PROGRESS.state.preferredMode || "game");
    });
  }

  function renderDueButton() {
    const wrap = document.getElementById("due-cards-btn-wrap");
    if (!SETTINGS.get("smartDailyReview")) { wrap.innerHTML = ""; return; }
    const due = REVIEW.collectDueCards(CONTENT);
    if (!due.length) { wrap.innerHTML = ""; return; }
    wrap.innerHTML = '<button class="primary-btn" id="due-btn" style="margin:10px auto;display:block">' + due.length + ' ' + I18N.t("due_today") + '</button>';
    document.getElementById("due-btn").addEventListener("click", () => startSmartReview());
  }

  // ============ Onboarding wiring (simplified: skip age/quiz/challenges) ============
  function wireLanguage() {
    document.querySelectorAll("[data-lang-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.langChoice;
        I18N.setLanguage(lang);
        PROGRESS.setLanguage(lang);
        // Default adult/no-challenges/plain-read; go straight to picker
        PROGRESS.setAgeGroup("adults");
        PROGRESS.setChallenges([]);
        PROGRESS.setPreferredMode("plain_read");
        document.body.setAttribute("data-age", "adults");
        document.body.setAttribute("data-mode", "plain_read");
        renderPicker();
        showScreen("screen-pick");
      });
    });
  }
  function wireAge() {
    document.querySelectorAll("[data-age-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const g = btn.dataset.ageChoice;
        document.body.setAttribute("data-age", g);
        PROGRESS.setAgeGroup(g);
        showScreen("screen-challenges");
      });
    });
  }
  function wireChallenges() {
    const list = document.getElementById("challenge-list");
    const unknownBox = list.querySelector('input[value="unknown"]');
    const others = list.querySelectorAll('input[type="checkbox"]:not([value="unknown"])');
    unknownBox.addEventListener("change", () => { if (unknownBox.checked) others.forEach((o) => { o.checked = false; }); });
    others.forEach((o) => o.addEventListener("change", () => { if (o.checked) unknownBox.checked = false; }));
    document.getElementById("challenges-next").addEventListener("click", () => {
      const selected = Array.from(list.querySelectorAll("input:checked")).map((i) => i.value);
      PROGRESS.setChallenges(selected);
      if (selected.includes("unknown") || selected.length === 0) {
        ONBOARDING.startQuiz();
      } else {
        const rec = ONBOARDING.recommendFromChallenges(selected);
        PROGRESS.state.preferredMode = rec;
        PROGRESS.save();
        renderPicker();
        showScreen("screen-pick");
      }
    });
  }
  function wireQuiz() {
    document.getElementById("quiz-next").addEventListener("click", () => ONBOARDING.nextQuiz());
    document.getElementById("quiz-back").addEventListener("click", () => ONBOARDING.backQuiz());
  }
  function wireMode() {
    document.querySelectorAll("[data-mode-choice]").forEach((btn) => {
      btn.addEventListener("click", () => startLearning(btn.dataset.modeChoice));
    });
  }
  function wireBackButtons() {
    document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => showScreen(b.dataset.back)));
    document.getElementById("learn-back").addEventListener("click", () => showScreen("screen-mode"));
    document.getElementById("pick-back").addEventListener("click", () => showScreen("screen-challenges"));
    document.getElementById("mistakes-back").addEventListener("click", () => { renderPicker(); showScreen("screen-pick"); });
    document.getElementById("notes-back").addEventListener("click", () => { renderPicker(); showScreen("screen-pick"); });
    document.getElementById("stickers-back").addEventListener("click", () => { renderPicker(); showScreen("screen-pick"); });
    document.getElementById("chazara-back").addEventListener("click", () => { renderPicker(); showScreen("screen-pick"); });
    document.getElementById("home-btn").addEventListener("click", () => {
      if (PROGRESS.hasOnboarded()) { renderPicker(); showScreen("screen-pick"); }
      else showScreen("screen-language");
    });
    document.getElementById("lang-toggle").addEventListener("click", () => {
      const newLang = I18N.current === "en" ? "yi" : "en";
      I18N.setLanguage(newLang);
      PROGRESS.setLanguage(newLang);
      renderPicker();
      if (CURRENT_SUGYA) renderSugyaHeader();
    });
  }

  // Feedback goes to this email.
  const FEEDBACK_EMAIL = "chesky2039@gmail.com";

  function wireFeedback() {
    const overlay = document.getElementById("feedback-overlay");
    document.getElementById("feedback-btn").addEventListener("click", () => overlay.classList.remove("hidden"));
    document.getElementById("feedback-close").addEventListener("click", () => overlay.classList.add("hidden"));
    document.getElementById("feedback-send").addEventListener("click", () => {
      const type = document.getElementById("feedback-type").value;
      const msg = document.getElementById("feedback-msg").value.trim();
      const from = document.getElementById("feedback-email").value.trim();
      if (!msg) { showToast("Please write a message"); return; }
      const subject = "[Berachos/Shabbos Tutor] " + type;
      const body = msg + (from ? "\n\nFrom: " + from : "") + "\n\n— sent from the Berachos/Shabbos Tutor app";
      const mailto = "mailto:" + FEEDBACK_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      window.location.href = mailto;
      showToast(I18N.t("feedback_sent"));
      overlay.classList.add("hidden");
      document.getElementById("feedback-msg").value = "";
    });
  }

  function wireTypeChips() {
    document.querySelectorAll(".type-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        TYPE_FILTER = chip.dataset.type;
        document.querySelectorAll(".type-chip").forEach(c => c.classList.toggle("active", c === chip));
        renderPicker();
      });
    });
  }

  function wireHeaderButtons() {
    // Menu drawer
    const menu = document.getElementById("menu-overlay");
    document.getElementById("menu-btn").addEventListener("click", () => {
      // Refresh XP + daily inside the menu when opened
      const xpEl = document.getElementById("menu-xp");
      if (xpEl) {
        const xp = PROGRESS.state.xp || 0;
        const lvl = PROGRESS.state.level || 1;
        const xpInLevel = xp % 100;
        const daily = PROGRESS.state.dailyProgress || { count: 0 };
        const goal = SETTINGS.get("dailyGoalAmount") || 10;
        xpEl.innerHTML =
          '<div>⭐ Level ' + lvl + ' — ' + xpInLevel + '/100 XP</div>' +
          '<div>📅 Today: ' + (daily.count || 0) + '/' + goal + '</div>';
      }
      menu.classList.remove("hidden");
    });
    document.getElementById("menu-close").addEventListener("click", () => menu.classList.add("hidden"));
    menu.addEventListener("click", (e) => { if (e.target === menu) menu.classList.add("hidden"); });
    // Close menu when any item inside is clicked
    menu.querySelectorAll(".menu-item").forEach(b => {
      b.addEventListener("click", () => setTimeout(() => menu.classList.add("hidden"), 50));
    });

    document.getElementById("settings-btn").addEventListener("click", () => SETTINGS.open());
    document.getElementById("settings-close").addEventListener("click", () => SETTINGS.close());
    wireFeedback();
    document.getElementById("mistakes-btn").addEventListener("click", () => renderMistakes());
    document.getElementById("notes-btn").addEventListener("click", () => renderNotes());
    document.getElementById("bookmarks-btn").addEventListener("click", () => {
      PICKER_FILTER = "bookmarks";
      renderPicker();
      showScreen("screen-pick");
    });
    document.getElementById("chazara-btn").addEventListener("click", () => startChazara());
    document.getElementById("focus-btn").addEventListener("click", () => {
      SETTINGS.set("focusMode", !SETTINGS.get("focusMode"));
      showToast("Focus: " + (SETTINGS.get("focusMode") ? "ON" : "OFF"));
    });
    document.getElementById("sbs-btn").addEventListener("click", () => {
      SETTINGS.set("sideBySide", !SETTINGS.get("sideBySide"));
      showToast("Side-by-side: " + (SETTINGS.get("sideBySide") ? "ON" : "OFF"));
      if (CURRENT_SUGYA && document.getElementById("screen-learn").classList.contains("active")) {
        startLearning(PROGRESS.state.preferredMode);
      }
    });

    document.getElementById("practice-mistakes-btn").addEventListener("click", () => {
      const items = REVIEW.collectMistakeSections(CONTENT);
      if (!items.length) { showToast(I18N.t("no_mistakes_yet")); return; }
      FLASH.startCustom(items, I18N.t("practice_mistakes"));
    });
  }

  function announceStreakIfMilestone() {
    const s = PROGRESS.state.streak;
    const key = STREAK.milestoneMessageKey(s.current);
    if (key) {
      showToast(I18N.t(key), 3000);
      AUDIO.play("streak");
      STREAK.earnedBadges(s.current).forEach((b) => PROGRESS.addBadge(b));
    }
  }

  window.afterQuizFinished = function (recommendedMode) {
    PROGRESS.state.preferredMode = recommendedMode;
    PROGRESS.save();
    renderPicker();
    showScreen("screen-pick");
  };

  async function init() {
    A11Y.init();
    PROGRESS.load();
    SETTINGS.init();

    const lang = PROGRESS.state.language || "en";
    I18N.setLanguage(lang);
    if (PROGRESS.state.ageGroup) document.body.setAttribute("data-age", PROGRESS.state.ageGroup);
    if (PROGRESS.state.preferredMode) document.body.setAttribute("data-mode", PROGRESS.state.preferredMode);

    STREAK.touchDay(PROGRESS.state);
    PROGRESS.save();
    STREAK.render(PROGRESS.state);

    XP.init();
    MASCOT.init();

    wireLanguage();
    wireAge();
    wireChallenges();
    wireQuiz();
    wireMode();
    wireBackButtons();
    wireHeaderButtons();
    wireTypeChips();

    await loadContent();
    if (window.cacheContent) window.cacheContent(CONTENT);
    SEARCH.init();

    if (PROGRESS.state.currentSugyaId) {
      const found = findSugya(PROGRESS.state.currentSugyaId);
      if (found) CURRENT_SUGYA = found.sugya;
    }

    if (PROGRESS.hasOnboarded()) {
      const msgEl = document.getElementById("welcome-streak-msg");
      const s = PROGRESS.state.streak;
      if (s.current > 0) msgEl.textContent = I18N.t("streak_label") + ": " + s.current + " " + I18N.t("streak_days");
      else msgEl.textContent = I18N.t("streak_lost");

      renderWeeklyRecap();
      renderContinueWhere();
      DAILY.render("daily-plan-wrap");
      renderDueButton();

      document.getElementById("resume-btn").addEventListener("click", () => {
        announceStreakIfMilestone();
        renderPicker();
        showScreen("screen-pick");
      });
      document.getElementById("fresh-btn").addEventListener("click", () => {
        PROGRESS.reset();
        CURRENT_SUGYA = null;
        document.body.removeAttribute("data-age");
        document.body.removeAttribute("data-mode");
        I18N.setLanguage("en");
        showScreen("screen-language");
      });
      showScreen("screen-welcome-back");
    } else {
      showScreen("screen-language");
    }

    SETTINGS.onChange(() => { XP.render(); XP.renderDailyGoal(); });
    announceStreakIfMilestone();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
