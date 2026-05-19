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

    /** Wrap each known word in the Hebrew string with a tappable span. */
    renderTappableHebrew(hebrewText, words, secIdx) {
      if (!hebrewText) return "";
      let html = escapeHtml(hebrewText);
      if (!words || !words.length) return html;
      const sorted = [...words].sort((a, b) => (b.a || "").length - (a.a || "").length);
      sorted.forEach((w, i) => {
        if (!w.a) return;
        const escA = escapeHtml(w.a);
        const safeId = "pw-" + secIdx + "-" + i;
        const parts = html.split(escA);
        if (parts.length > 1) {
          html = parts.join('<span class="pr-word" data-pw="' + safeId + '">' + escA + '</span>');
          PLAINREAD._wordMap[safeId] = w;
        }
      });
      return html;
    },

    render() {
      const c = document.getElementById("learn-container");
      const lang = I18N.current;
      PLAINREAD._wordMap = {};

      const isChumash = (PROGRESS.state.currentContentType === "chumash") || (this.sugya && this.sugya.id && this.sugya.id.startsWith("chumash"));

      let html = '<div class="plainread-container">';
      html += cardActionsRow(this.sections[0] ? this.sections[0].id : "");

      // Section block: full Hebrew + tappable words. Translation/explanation/Rashi as collapsible below each.
      this.sections.forEach((sec, idx) => {
        const original = sec.aramaic || (this.sugya && this.sugya.aramaic);
        const sectionWords = (sec.aramaic_words && sec.aramaic_words.length) ? sec.aramaic_words : (this.sugya && this.sugya.aramaic_words);
        const translation = lang === "yi"
          ? (sec.aramaic_translation_yiddish || sec.aramaic_translation || (this.sugya && (this.sugya.aramaic_translation_yiddish || this.sugya.aramaic_translation)))
          : (sec.aramaic_translation || (this.sugya && this.sugya.aramaic_translation));
        const explanation = lang === "yi" ? (sec.text_yiddish || sec.text) : sec.text;
        const hasRashi = isRealCommentary(sec.rashi) || isRealCommentary(sec.rashi_explanation);

        if (!original) return;
        const tappableHebrew = this.renderTappableHebrew(original, sectionWords, idx);

        html += '<div class="pr-section">';
        // Optional small marker: pasuk number, mishnah number, etc.
        const marker = sec.marker || (sec.id && sec.id.match(/(\d+(?::\d+)?)$/) ? sec.id.match(/(\d+(?::\d+)?)$/)[1] : "");
        if (marker && this.sections.length > 1) {
          html += '<div class="pr-section-marker">' + escapeHtml(marker) + '</div>';
        }
        html += '<div class="plainread-hebrew">' + tappableHebrew + '</div>';

        // Per-section translation (collapsible, default closed for clean reading)
        if (translation) {
          html += '<details class="plainread-translation"><summary>' + I18N.t("plainread_show_translation") + '</summary>';
          html += '<div class="plainread-translation-body">' + escapeHtml(translation) + '</div>';
          html += '</details>';
        }
        // Per-section explanation (collapsible)
        if (explanation) {
          html += '<details class="plainread-explanation"><summary>' + I18N.t("plainread_explanation") + '</summary>';
          html += '<div class="plainread-explanation-body">' + escapeHtml(explanation) + '</div>';
          html += '</details>';
        }
        // Per-section Rashi for Chumash
        if (isChumash && hasRashi) {
          const rashi = lang === "yi" ? (sec.rashi_yiddish || sec.rashi) : sec.rashi;
          const rashiExp = lang === "yi" ? (sec.rashi_explanation_yiddish || sec.rashi_explanation) : sec.rashi_explanation;
          html += '<details class="plainread-rashi"><summary>🔍 ' + I18N.t("plainread_rashi") + '</summary>';
          html += '<div class="plainread-rashi-body">';
          if (rashi) html += '<div class="plainread-rashi-hebrew">' + escapeHtml(rashi) + '</div>';
          if (rashiExp) html += '<div class="plainread-rashi-explanation">' + escapeHtml(rashiExp) + '</div>';
          html += '</div></details>';
        }
        html += '</div>'; // .pr-section
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
