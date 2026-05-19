/* plainread.js — "Plain Read" mode.
   Shows the WHOLE chapter/daf as one scrollable page. Every Hebrew word is tappable.
   For Chumash, Rashi shown next to each pasuk. Bottom-of-page buttons for quiz / next. */
(function (global) {
  const PLAINREAD = {
    page: null,
    sections: [],
    sugya: null,

    start(page) {
      this.page = page;
      this.sections = page.sections || [];
      this.sugya = getCurrentSugya();
      this.render();
    },

    /** Wrap EVERY Hebrew word in a tappable span. Lookup happens live via Sefaria lexicon. */
    renderTappableHebrew(hebrewText, words, secIdx) {
      if (!hebrewText) return "";
      // Pre-canned word map (still supported as fallback) — but every Hebrew token gets the .pr-word class.
      PLAINREAD._wordMap = PLAINREAD._wordMap || {};
      if (words && words.length) {
        words.forEach((w) => {
          if (!w || !w.a) return;
          PLAINREAD._wordMap["canned:" + w.a] = w;
        });
      }
      // Split on whitespace, wrap any Hebrew-containing token.
      const tokens = hebrewText.split(/(\s+)/);
      return tokens.map((tok) => {
        if (/^\s+$/.test(tok)) return tok;
        // Anything containing Hebrew letters becomes tappable
        if (!/[֐-׿]/.test(tok)) return escapeHtml(tok);
        return '<span class="pr-word" data-w="' + escapeHtml(tok) + '">' + escapeHtml(tok) + '</span>';
      }).join("");
    },

    render() {
      const c = document.getElementById("learn-container");
      const lang = I18N.current;
      PLAINREAD._wordMap = {};

      const isChumash = (PROGRESS.state.currentContentType === "chumash") || (this.sugya && this.sugya.id && this.sugya.id.startsWith("chumash"));

      // Two cases:
      //   A) Each section has its OWN Hebrew (Tanya, Chumash merged, Avos merged) → render per-section blocks.
      //   B) Only sugya-level Hebrew exists (older Gemara sugyos) → render ONE Hebrew block at top, then explanation-only sections below.
      const anySectionHasOwnHebrew = this.sections.some(s => !!s.aramaic);
      const sugyaLevelHebrew = !anySectionHasOwnHebrew && this.sugya && this.sugya.aramaic;

      let html = '<div class="plainread-container">';
      html += cardActionsRow(this.sections[0] ? this.sections[0].id : "");

      // Case B: top-of-page sugya Hebrew block (shown once)
      if (sugyaLevelHebrew) {
        const sugyaWords = this.sugya.aramaic_words;
        const sugyaTappable = this.renderTappableHebrew(this.sugya.aramaic, sugyaWords, -1);
        const sugyaTranslation = lang === "yi"
          ? (this.sugya.aramaic_translation_yiddish || this.sugya.aramaic_translation)
          : this.sugya.aramaic_translation;
        html += '<div class="pr-section pr-section-top">';
        html += '<div class="plainread-hebrew">' + sugyaTappable + '</div>';
        if (sugyaTranslation) {
          html += '<details class="plainread-translation"><summary>' + I18N.t("plainread_show_translation") + '</summary>';
          html += '<div class="plainread-translation-body">' + escapeHtml(sugyaTranslation) + '</div>';
          html += '</details>';
        }
        html += '</div>';
      }

      // Per-section blocks
      this.sections.forEach((sec, idx) => {
        const ownAramaic = sec.aramaic; // strictly section-level, NO fallback
        const sectionWords = (sec.aramaic_words && sec.aramaic_words.length) ? sec.aramaic_words : (this.sugya && this.sugya.aramaic_words);
        const translation = lang === "yi"
          ? (sec.aramaic_translation_yiddish || sec.aramaic_translation)
          : sec.aramaic_translation;
        const explanation = lang === "yi" ? (sec.text_yiddish || sec.text) : sec.text;
        const term = lang === "yi" ? (sec.term_yiddish || sec.term) : sec.term;
        const definition = lang === "yi" ? (sec.definition_yiddish || sec.definition) : sec.definition;
        const hasRashi = isRealCommentary(sec.rashi) || isRealCommentary(sec.rashi_explanation);
        const hasAnyContent = ownAramaic || explanation || term || hasRashi;
        if (!hasAnyContent) return;

        html += '<div class="pr-section">';
        const marker = sec.marker || (sec.id && sec.id.match(/(\d+(?::\d+)?)$/) ? sec.id.match(/(\d+(?::\d+)?)$/)[1] : "");
        if (marker && this.sections.length > 1) {
          html += '<div class="pr-section-marker">' + escapeHtml(marker) + '</div>';
        }

        // Section-level Hebrew (only if section has its own)
        if (ownAramaic) {
          const tappableHebrew = this.renderTappableHebrew(ownAramaic, sectionWords, idx);
          html += '<div class="plainread-hebrew">' + tappableHebrew + '</div>';
        }

        // Term + definition (glossary-style block for sugyos that don't have section-level Hebrew)
        if (!ownAramaic && term) {
          html += '<div class="pr-section-glossary"><b>' + escapeHtml(term) + '</b>';
          if (definition) html += ' — ' + escapeHtml(definition);
          html += '</div>';
        }

        // Section-level translation (only if section has own)
        if (ownAramaic && translation) {
          html += '<details class="plainread-translation"><summary>' + I18N.t("plainread_show_translation") + '</summary>';
          html += '<div class="plainread-translation-body">' + escapeHtml(translation) + '</div>';
          html += '</details>';
        }

        // Explanation (per section)
        if (explanation) {
          html += '<details class="plainread-explanation"' + (ownAramaic ? '' : ' open') + '><summary>' + I18N.t("plainread_explanation") + '</summary>';
          html += '<div class="plainread-explanation-body">' + escapeHtml(explanation) + '</div>';
          html += '</details>';
        }

        // Rashi
        if (isChumash && hasRashi) {
          const rashi = lang === "yi" ? (sec.rashi_yiddish || sec.rashi) : sec.rashi;
          const rashiExp = lang === "yi" ? (sec.rashi_explanation_yiddish || sec.rashi_explanation) : sec.rashi_explanation;
          html += '<details class="plainread-rashi"><summary>🔍 ' + I18N.t("plainread_rashi") + '</summary>';
          html += '<div class="plainread-rashi-body">';
          if (rashi) html += '<div class="plainread-rashi-hebrew">' + escapeHtml(rashi) + '</div>';
          if (rashiExp) html += '<div class="plainread-rashi-explanation">' + escapeHtml(rashiExp) + '</div>';
          html += '</div></details>';
        }
        html += '</div>';
      });

      // Bottom hint
      html += '<div class="plainread-hint plainread-hint-bottom">' + I18N.t("plainread_hint") + '</div>';

      // Sefaria full text panel (authoritative source)
      const found = findSugya(this.page.id);
      const masechta = found && found.masechta;
      const sefRef = SEFARIA.refFor(this.sugya, masechta);
      if (sefRef) {
        html += '<details class="sefaria-panel"><summary>📖 ' + I18N.t("sefaria_full_text") + '</summary>';
        html += '<div class="sefaria-panel-body" data-sefaria-ref="' + escapeHtml(sefRef) + '"><div class="sefaria-loading">…</div></div>';
        html += '</details>';
      }

      // TorahAnytime shiur link
      const taUrl = SEFARIA.torahAnytimeUrl(this.sugya, masechta);
      if (taUrl) {
        html += '<a class="torahanytime-btn" href="' + taUrl + '" target="_blank" rel="noopener">🎧 ' + I18N.t("listen_shiur") + '</a>';
      }

      // Bottom action buttons
      html += '<div class="plainread-bottom-actions">';
      const hasQuiz = (this.sections || []).some(s => Array.isArray(s.answers) && s.answers.length > 0);
      if (hasQuiz) {
        html += '<button class="primary-btn" id="pr-quiz">🎯 ' + I18N.t("review_quiz") + '</button>';
      }
      const nxt = findNextSugya(this.page.id);
      if (nxt) {
        const lang2 = I18N.current;
        const nxtTitle = lang2 === "yi" ? (nxt.title_yiddish || nxt.title) : nxt.title;
        html += '<button class="primary-btn" id="pr-next-sugya">' + I18N.t("next_sugya") + ': ' + escapeHtml(nxtTitle) + ' →</button>';
      }
      html += '<button class="choice-btn" id="pr-switch">' + I18N.t("switch_mode") + '</button>';
      html += '</div>';
      html += '</div>'; // .plainread-container
      c.innerHTML = html;

      wireCardActions(c, this.page.id, this.sections[0] ? this.sections[0].id : "", () => this.render());

      // Wire tappable words — every Hebrew token, live lexicon lookup
      c.querySelectorAll(".pr-word").forEach((span) => {
        span.addEventListener("click", (e) => {
          e.stopPropagation();
          const rawWord = span.dataset.w;
          if (!rawWord) return;
          // Check pre-canned first
          const canned = PLAINREAD._wordMap["canned:" + rawWord];
          if (canned) { showWordPopup(span, canned); return; }
          // Live Sefaria lexicon lookup
          showWordPopupLive(span, rawWord);
        });
      });

      // Bottom buttons
      const quizBtn = document.getElementById("pr-quiz");
      if (quizBtn) {
        quizBtn.addEventListener("click", () => {
          GAME.start({ id: this.page.id, sections: this.sections });
        });
      }
      const nextBtn = document.getElementById("pr-next-sugya");
      if (nextBtn && nxt) {
        nextBtn.addEventListener("click", () => pickSugyaAndStart(nxt.id, "plain_read"));
      }
      document.getElementById("pr-switch").addEventListener("click", () => showScreen("screen-mode"));

      // Lazy-load Sefaria text when the panel is opened
      const sefDetails = c.querySelector(".sefaria-panel");
      if (sefDetails) {
        sefDetails.addEventListener("toggle", async () => {
          if (!sefDetails.open) return;
          const body = sefDetails.querySelector(".sefaria-panel-body");
          if (body.dataset.loaded === "1") return;
          const ref = body.dataset.sefariaRef;
          const result = await SEFARIA.fetchRef(ref);
          body.innerHTML = SEFARIA.renderResult(result);
          body.dataset.loaded = "1";
        });
      }

      // Mark as completed for streak/progress
      PROGRESS.setStoryProgress(this.page.id, this.sections.length, true);
      PROGRESS.addSticker(this.page.id);
      XP.addXP(10);
      XP.incrementDaily();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "auto" });
    },

    _wordMap: {}
  };

  function stripNikud(w) {
    return String(w || "").replace(/[֑-ׇ]/g, "").replace(/[.,;:()\[\]"'׳״־?!]/g, "").trim();
  }

  async function showWordPopupLive(anchor, rawWord) {
    const clean = stripNikud(rawWord);
    const popup = document.getElementById("word-popup");
    popup.innerHTML =
      '<div class="word-popup-aramaic">' + escapeHtml(clean) + '</div>' +
      '<div class="word-popup-en"><i>Looking up…</i></div>';
    positionPopup(popup, anchor);
    popup.classList.remove("hidden");

    try {
      const res = await fetch("/api/lexicon/" + encodeURIComponent(clean));
      const data = await res.json();
      const entries = Array.isArray(data) ? data : (data && Array.isArray(data.lexicon_entries) ? data.lexicon_entries : []);
      if (!entries.length) {
        popup.innerHTML =
          '<div class="word-popup-aramaic">' + escapeHtml(clean) + '</div>' +
          '<div class="word-popup-en"><i>No dictionary entry found.</i></div>';
      } else {
        const senses = [];
        const walk = (node) => {
          if (!node) return;
          if (typeof node === "string") {
            const s = node.replace(/<[^>]+>/g, "").trim();
            if (s) senses.push(s);
            return;
          }
          if (Array.isArray(node)) { node.forEach(walk); return; }
          if (typeof node === "object") {
            if (node.definition) walk(node.definition);
            if (node.senses) walk(node.senses);
            if (node.content) walk(node.content);
          }
        };
        const e = entries[0];
        walk(e.content);
        walk(e.senses);
        walk(e.definition);
        const def = senses.slice(0, 3).join(" • ").slice(0, 280) || "No definition found.";
        const source = (e.parent_lexicon_details && (e.parent_lexicon_details.name || e.parent_lexicon)) || e.parent_lexicon || "";
        popup.innerHTML =
          '<div class="word-popup-aramaic">' + escapeHtml(e.headword || clean) + '</div>' +
          '<div class="word-popup-en">' + escapeHtml(def) + '</div>' +
          (source ? '<div class="word-popup-yi" style="font-size:0.75em;color:#6b7280;margin-top:6px">— ' + escapeHtml(source) + '</div>' : '');
      }
    } catch (err) {
      popup.innerHTML =
        '<div class="word-popup-aramaic">' + escapeHtml(clean) + '</div>' +
        '<div class="word-popup-en"><i>Lookup failed.</i></div>';
    }
    positionPopup(popup, anchor);
    AUDIO.play("click");
    setTimeout(() => {
      const dismiss = (e) => {
        if (!popup.contains(e.target) && e.target !== anchor) {
          popup.classList.add("hidden");
          document.removeEventListener("click", dismiss);
        }
      };
      document.addEventListener("click", dismiss);
    }, 0);
  }

  function positionPopup(popup, anchor) {
    const rect = anchor.getBoundingClientRect();
    const popRect = popup.getBoundingClientRect();
    let left = rect.left + window.scrollX + rect.width / 2 - popRect.width / 2;
    let top = rect.bottom + window.scrollY + 8;
    left = Math.max(8, Math.min(left, window.innerWidth - popRect.width - 8));
    popup.style.left = left + "px";
    popup.style.top = top + "px";
  }

  function showWordPopup(anchor, word) {
    const popup = document.getElementById("word-popup");
    popup.innerHTML =
      '<div class="word-popup-aramaic">' + escapeHtml(word.a) + '</div>' +
      (word.en ? '<div class="word-popup-en">' + escapeHtml(word.en) + '</div>' : '') +
      (word.yi ? '<div class="word-popup-yi">' + escapeHtml(word.yi) + '</div>' : '');
    popup.classList.remove("hidden");
    const rect = anchor.getBoundingClientRect();
    const popRect = popup.getBoundingClientRect();
    let left = rect.left + window.scrollX + rect.width / 2 - popRect.width / 2;
    let top = rect.bottom + window.scrollY + 8;
    left = Math.max(8, Math.min(left, window.innerWidth - popRect.width - 8));
    popup.style.left = left + "px";
    popup.style.top = top + "px";
    AUDIO.play("click");
    setTimeout(() => {
      const dismiss = (e) => {
        if (!popup.contains(e.target) && e.target !== anchor) {
          popup.classList.add("hidden");
          document.removeEventListener("click", dismiss);
        }
      };
      document.addEventListener("click", dismiss);
    }, 0);
  }

  global.PLAINREAD = PLAINREAD;
})(window);
