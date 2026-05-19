/* flashcard.js — flashcards with SRS and V2 additions */
(function (global) {
  const INTERVALS = { easy: 4, medium: 2, hard: 1 };

  const FLASH = {
    page: null,
    queue: [],
    idx: 0,
    flipped: false,
    sessionLength: 0,
    customQueue: null,  // for smart daily review / chazara

    todayISO() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    },

    daysUntil(dateISO) {
      if (!dateISO) return -Infinity;
      const today = new Date(this.todayISO() + "T00:00:00");
      const d = new Date(dateISO + "T00:00:00");
      return Math.round((d - today) / (1000 * 60 * 60 * 24));
    },

    buildQueue(page) {
      const sections = page.sections || [];
      const annotated = sections.map((sec) => {
        const card = PROGRESS.getFlashcardCard(page.id, sec.id);
        if (!card) return { sec, priority: 1 };
        const overdue = -this.daysUntil(card.nextReview);
        let p = 5;
        if (overdue >= 0) p = 0;
        else p = 10 + overdue;
        if (card.difficulty === "hard") p -= 1;
        return { sec, priority: p };
      });
      annotated.sort((a, b) => a.priority - b.priority);
      return annotated.map((a) => a.sec);
    },

    start(page) {
      this.page = page;
      this.customQueue = null;
      this.queue = this.buildQueue(page);
      this.idx = 0;
      this.flipped = false;
      this.sessionLength = this.queue.length;
      this.render();
    },

    /** Start with a custom queue (for smart review / chazara). Each entry: { sugya, section } */
    startCustom(items, sourceLabel) {
      this.customQueue = items;
      this.queue = items.map((it) => it.section);
      this.page = { id: "_custom_", sections: this.queue };
      this.idx = 0;
      this.flipped = false;
      this.sessionLength = this.queue.length;
      showScreen("screen-learn");
      document.getElementById("sugya-header").innerHTML =
        '<div class="sugya-header-text"><div class="sugya-header-title">' + escapeHtml(sourceLabel || "") + '</div></div>';
      document.getElementById("aramaic-toggle-wrap").innerHTML = "";
      document.getElementById("aramaic-panel").classList.add("hidden");
      this.render();
    },

    sugyaForSection(sec) {
      if (this.customQueue) {
        const m = this.customQueue.find((it) => it.section.id === sec.id);
        return m ? m.sugya : null;
      }
      return getCurrentSugya();
    },

    render() {
      const c = document.getElementById("learn-container");
      const lang = I18N.current;

      if (this.idx >= this.queue.length) {
        this.renderDone();
        return;
      }

      const sec = this.queue[this.idx];
      const term = lang === "yi" ? (sec.term_yiddish || sec.term) : sec.term;
      const definition = lang === "yi" ? (sec.definition_yiddish || sec.definition) : sec.definition;
      const pct = Math.round((this.idx / this.sessionLength) * 100);
      const sugya = this.sugyaForSection(sec);

      let html = '<div class="flashcard-container">';
      html += cardActionsRow(sec.id);
      html += '<div class="flashcard-progress"><div class="flashcard-progress-fill" style="width:' + pct + '%"></div></div>';
      html += '<div class="flashcard' + (this.flipped ? ' flipped' : '') + ' focus-target" id="card">';
      html += '<div class="flashcard-inner">';
      html += '<div class="flashcard-face front">' + escapeHtml(term || "") + '</div>';
      html += '<div class="flashcard-face back">' + escapeHtml(definition || "") + '</div>';
      html += '</div></div>';
      html += '<div class="flashcard-hint">' + I18N.t("flip_card") + '</div>';

      if (sugya && sugya.aramaic_words && sugya.aramaic_words.length) {
        html += wbwPanelHtml();
      }
      html += commentaryHtml(sec);

      html += '<div class="flashcard-rate" ' + (this.flipped ? '' : 'style="visibility:hidden"') + '>';
      html += '<button data-rate="hard">' + I18N.t("hard") + '</button>';
      html += '<button data-rate="medium">' + I18N.t("medium") + '</button>';
      html += '<button data-rate="easy">' + I18N.t("easy") + '</button>';
      html += '</div>';
      html += '<div style="margin-top:10px;color:var(--text-soft)">' + (this.idx + 1) + ' / ' + this.sessionLength + '</div>';
      html += '</div>';
      c.innerHTML = html;

      wireCardActions(c, this.page.id, sec.id, () => this.render());
      wireWbwToggle(c, sugya);
      wireCommentaryToggles(c);

      document.getElementById("card").addEventListener("click", () => {
        this.flipped = !this.flipped;
        this.render();
      });
      c.querySelectorAll("[data-rate]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.rate(btn.dataset.rate);
        });
      });

      maybeReadAloud(this.flipped ? definition : term);
    },

    rate(difficulty) {
      const sec = this.queue[this.idx];
      const days = INTERVALS[difficulty] || 2;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + days);
      const nextISO = nextDate.getFullYear() + "-" + String(nextDate.getMonth() + 1).padStart(2, "0") + "-" + String(nextDate.getDate()).padStart(2, "0");

      const sugya = this.sugyaForSection(sec);
      const pageId = sugya ? sugya.id : this.page.id;
      PROGRESS.setFlashcardProgress(pageId, sec.id, {
        seen: 1,
        difficulty,
        nextReview: nextISO
      });

      const xpFor = { easy: 5, medium: 8, hard: 12 }[difficulty] || 5;
      XP.addXP(xpFor);
      XP.incrementDaily();
      AUDIO.play("click");

      this.idx += 1;
      this.flipped = false;
      this.render();
    },

    renderDone() {
      const c = document.getElementById("learn-container");
      let html = '<div class="game-final">';
      html += '<h2>' + I18N.t("deck_complete") + '</h2>';
      if (PROGRESS.state.ageGroup === "kids") {
        html += '<p style="font-size:1.3em">' + I18N.t("kids_badge") + '</p>';
        PROGRESS.addBadge("deck_complete");
        if (this.page.id !== "_custom_") PROGRESS.addSticker(this.page.id);
      }
      html += '<div class="big-buttons two-col" style="max-width:520px;margin:18px auto;">';
      html += '<button class="primary-btn" id="flash-replay">' + I18N.t("replay") + '</button>';
      const nxt = (this.page.id !== "_custom_") ? findNextSugya(this.page.id) : null;
      if (nxt) html += '<button class="primary-btn" id="flash-next">' + I18N.t("next_sugya") + '</button>';
      html += '<button class="choice-btn" id="flash-switch">' + I18N.t("switch_mode") + '</button>';
      html += '</div></div>';
      c.innerHTML = html;

      document.getElementById("flash-replay").addEventListener("click", () => {
        if (this.customQueue) this.startCustom(this.customQueue, "");
        else this.start(this.page);
      });
      document.getElementById("flash-switch").addEventListener("click", () => showScreen("screen-mode"));
      if (nxt) {
        document.getElementById("flash-next").addEventListener("click", () => {
          pickSugyaAndStart(nxt.id, "flashcard");
        });
      }
      if (PROGRESS.state.ageGroup === "kids") { celebrate(); MASCOT.react("excited"); AUDIO.play("sticker"); }
    }
  };

  global.FLASH = FLASH;
})(window);
