/* plainread.js — "Plain Read" mode.
   Designed for Tanya / Chumash / Mishnayos: read the original Hebrew big,
   tap any word → popup with English + Yiddish translation.
   For Chumash, also shows Rashi alongside each pasuk/section. */
(function (global) {
  const PLAINREAD = {
    page: null,       // the sugya
    sections: [],
    idx: 0,           // current section index (= pasuk / mishnah / chapter section)
    sugya: null,

    start(page) {
      this.page = page;
      this.sections = page.sections || [];
      this.idx = 0;
      this.sugya = getCurrentSugya();
      this.render();
    },

    /** Build the Hebrew text from sugya.aramaic, wrapping each known word in a tappable span. */
    renderTappableHebrew(hebrewText, words) {
      if (!hebrewText) return "";
      let html = escapeHtml(hebrewText);
      if (!words || !words.length) return html;
      // Sort by length descending so longer phrases get wrapped before shorter ones
      const sorted = [...words].sort((a, b) => (b.a || "").length - (a.a || "").length);
      sorted.forEach((w, i) => {
        if (!w.a) return;
        const escA = escapeHtml(w.a);
        const safeId = "pw-" + i;
        // Wrap all occurrences (literal text match)
        const parts = html.split(escA);
        if (parts.length > 1) {
          html = parts.join('<span class="pr-word" data-pw="' + safeId + '">' + escA + '</span>');
          // store the meaning so the tap handler can find it
          PLAINREAD._wordMap[safeId] = w;
        }
      });
      return html;
    },

    render() {
      const c = document.getElementById("learn-container");
      const lang = I18N.current;
      if (this.idx >= this.sections.length) { this.renderDone(); return; }

      const sec = this.sections[this.idx];
      // Prefer section-level Hebrew + words (each section is one paragraph).
      // Fall back to sugya-level if section doesn't have its own.
      const original = sec.aramaic || (this.sugya && this.sugya.aramaic);
      const sectionWords = sec.aramaic_words && sec.aramaic_words.length ? sec.aramaic_words : (this.sugya && this.sugya.aramaic_words);
      const translation = lang === "yi"
        ? (sec.aramaic_translation_yiddish || sec.aramaic_translation || (this.sugya && (this.sugya.aramaic_translation_yiddish || this.sugya.aramaic_translation)))
        : (sec.aramaic_translation || (this.sugya && this.sugya.aramaic_translation));
      const explanation = lang === "yi" ? (sec.text_yiddish || sec.text) : sec.text;
      const isChumash = (PROGRESS.state.currentContentType === "chumash") || (this.sugya && this.sugya.id && this.sugya.id.startsWith("ber-"));
      const hasRashi = isRealCommentary(sec.rashi) || isRealCommentary(sec.rashi_explanation);

      // reset word map
      PLAINREAD._wordMap = {};
      const tappableHebrew = this.renderTappableHebrew(original, sectionWords);

      let html = '<div class="plainread-container">';
      html += cardActionsRow(sec.id);
      html += '<div class="plainread-progress">' + (this.idx + 1) + ' / ' + this.sections.length + '</div>';

      // Original Hebrew, big and prominent
      html += '<div class="plainread-original focus-target">';
      html += '<div class="plainread-hebrew">' + tappableHebrew + '</div>';
      html += '<div class="plainread-hint">' + I18N.t("plainread_hint") + '</div>';
      html += '</div>';

      // Toggleable translation
      if (translation) {
        html += '<details class="plainread-translation"><summary>' + I18N.t("plainread_show_translation") + '</summary>';
        html += '<div class="plainread-translation-body">' + escapeHtml(translation) + '</div>';
        html += '</details>';
      }

      // Toggleable plain-English explanation (per section)
      if (explanation) {
        html += '<details class="plainread-explanation" open><summary>' + I18N.t("plainread_explanation") + '</summary>';
        html += '<div class="plainread-explanation-body">' + escapeHtml(explanation) + '</div>';
        html += '</details>';
      }

      // Rashi panel for Chumash (or anything with real rashi)
      if (isChumash && hasRashi) {
        const rashi = lang === "yi" ? (sec.rashi_yiddish || sec.rashi) : sec.rashi;
        const rashiExp = lang === "yi" ? (sec.rashi_explanation_yiddish || sec.rashi_explanation) : sec.rashi_explanation;
        html += '<details class="plainread-rashi" open><summary>🔍 ' + I18N.t("plainread_rashi") + '</summary>';
        html += '<div class="plainread-rashi-body">';
        if (rashi) html += '<div class="plainread-rashi-hebrew">' + escapeHtml(rashi) + '</div>';
        if (rashiExp) html += '<div class="plainread-rashi-explanation">' + escapeHtml(rashiExp) + '</div>';
        html += '</div></details>';
      }

      // Nav row
      html += '<div class="plainread-nav">';
      if (this.idx > 0) {
        html += '<button class="back-btn" id="pr-prev">← ' + I18N.t("previous") + '</button>';
      } else {
        html += '<span></span>';
      }
      if (this.idx < this.sections.length - 1) {
        html += '<button class="primary-btn" id="pr-next">' + I18N.t("next_section") + ' →</button>';
      } else {
        html += '<button class="primary-btn" id="pr-finish">' + I18N.t("finish") + '</button>';
      }
      html += '</div>';
      html += '</div>';

      c.innerHTML = html;

      wireCardActions(c, this.page.id, sec.id, () => this.render());

      // Wire tappable words
      c.querySelectorAll(".pr-word").forEach((span) => {
        span.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = span.dataset.pw;
          const w = PLAINREAD._wordMap[id];
          if (!w) return;
          showWordPopup(span, w);
        });
      });

      // Nav buttons
      const prev = document.getElementById("pr-prev");
      if (prev) prev.addEventListener("click", () => { this.idx -= 1; this.render(); });
      const next = document.getElementById("pr-next");
      if (next) next.addEventListener("click", () => {
        XP.addXP(5);
        XP.incrementDaily();
        this.idx += 1;
        this.render();
      });
      const finish = document.getElementById("pr-finish");
      if (finish) finish.addEventListener("click", () => {
        XP.addXP(10);
        XP.incrementDaily();
        PROGRESS.setStoryProgress(this.page.id, this.sections.length, true);
        PROGRESS.addSticker(this.page.id);
        this.idx += 1;
        this.render();
      });

      PROGRESS.setStoryProgress(this.page.id, this.idx, false);
      maybeReadAloud(original);
    },

    renderDone() {
      const c = document.getElementById("learn-container");
      // Check if any sections have a real quiz (non-empty answers)
      const hasQuiz = (this.sections || []).some(s => Array.isArray(s.answers) && s.answers.length > 0);

      let html = '<div class="game-final">';
      html += '<h2>' + I18N.t("done") + '</h2>';
      html += '<div class="big-buttons two-col" style="max-width:560px;margin:18px auto;">';
      if (hasQuiz) {
        html += '<button class="primary-btn" id="pr-quiz">🎯 ' + I18N.t("review_quiz") + '</button>';
      }
      html += '<button class="primary-btn" id="pr-replay">' + I18N.t("replay") + '</button>';
      const nxt = findNextSugya(this.page.id);
      if (nxt) html += '<button class="primary-btn" id="pr-next-sugya">' + I18N.t("next_sugya") + '</button>';
      html += '<button class="choice-btn" id="pr-switch">' + I18N.t("switch_mode") + '</button>';
      html += '</div></div>';
      c.innerHTML = html;
      document.getElementById("pr-replay").addEventListener("click", () => { this.idx = 0; this.render(); });
      document.getElementById("pr-switch").addEventListener("click", () => showScreen("screen-mode"));
      if (nxt) {
        document.getElementById("pr-next-sugya").addEventListener("click", () => {
          pickSugyaAndStart(nxt.id, "plain_read");
        });
      }
      if (hasQuiz) {
        document.getElementById("pr-quiz").addEventListener("click", () => {
          // Switch to game mode on the same sugya
          GAME.start({ id: this.page.id, sections: this.sections });
        });
      }
      if (PROGRESS.state.ageGroup === "kids") { celebrate(); MASCOT.react("excited"); AUDIO.play("sticker"); }
    },

    _wordMap: {}
  };

  /** Show a popup tooltip with the word's translation. */
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
    // Keep on-screen
    left = Math.max(8, Math.min(left, window.innerWidth - popRect.width - 8));
    popup.style.left = left + "px";
    popup.style.top = top + "px";

    AUDIO.play("click");
    // Click-outside to dismiss
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
