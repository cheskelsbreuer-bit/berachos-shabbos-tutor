/* story.js — Story mode with V2 additions */
(function (global) {
  const STORY = {
    page: null,
    idx: 0,
    showingQuestion: false,

    pickText(sec) {
      const lang = I18N.current;
      const simple = SETTINGS.get("simplifiedMode");
      let text = lang === "yi" ? (sec.text_yiddish || sec.text) : sec.text;
      if (simple) {
        const simpleText = lang === "yi" ? sec.text_simple_yiddish : sec.text_simple;
        if (simpleText && !simpleText.includes("[")) text = simpleText;
      }
      return text;
    },

    start(page) {
      this.page = page;
      const saved = PROGRESS.ensurePage(page.id).story;
      this.idx = (saved.currentSection && !saved.completed) ? saved.currentSection : 0;
      if (this.idx >= (page.sections || []).length) this.idx = 0;
      this.showingQuestion = false;
      this.render();
    },

    render() {
      const c = document.getElementById("learn-container");
      const sections = this.page.sections || [];
      if (this.idx >= sections.length) { this.renderDone(); return; }
      if (this.showingQuestion) { this.renderQuestion(); return; }

      const sec = sections[this.idx];
      const lang = I18N.current;
      const text = this.pickText(sec);
      const term = lang === "yi" ? (sec.term_yiddish || sec.term) : sec.term;
      const definition = lang === "yi" ? (sec.definition_yiddish || sec.definition) : sec.definition;

      const sbs = document.body.classList.contains("side-by-side-active") && getCurrentSugya() && getCurrentSugya().aramaic;
      const textHtml = renderTappableText(text);

      let html = '<div class="story-container">';
      html += '<div class="story-progress">' + (this.idx + 1) + ' / ' + sections.length + '</div>';
      html += cardActionsRow(sec.id);

      if (sbs) {
        html += '<div class="side-by-side-wrap">' +
          '<div class="side-col"><div class="side-col-label">📜 ' + I18N.t("aramaic_label") + '</div><div class="aramaic-text">' + escapeHtml(getCurrentSugya().aramaic) + '</div></div>' +
          '<div class="side-col"><div class="side-col-label">' + I18N.t("translation_label") + '</div><div class="story-card">' + textHtml + '</div></div>' +
        '</div>';
      } else {
        html += '<div class="story-card focus-target">' + textHtml + '</div>';
      }

      // Bug fix 2: term/definition as separate glossary block
      if (term || definition) {
        html += '<div class="story-glossary">' +
          (term ? '<div class="story-glossary-term">' + escapeHtml(term) + '</div>' : '') +
          (definition ? '<div class="story-glossary-def">' + escapeHtml(definition) + '</div>' : '') +
        '</div>';
      }

      // Bug fix 4: word-by-word panel in modes
      html += wbwPanelHtml();
      html += commentaryHtml(sec);

      html += '<div class="story-actions">';
      html += '<button class="primary-btn" id="story-next">' + I18N.t("next_section") + ' →</button>';
      html += '</div></div>';
      c.innerHTML = html;

      wireCardActions(c, this.page.id, sec.id, () => this.render());
      wireWbwToggle(c);
      wireCommentaryToggles(c);
      wireTappableWords(c, getCurrentSugya());

      document.getElementById("story-next").addEventListener("click", () => {
        XP.addXP(7);
        XP.incrementDaily();
        this.showingQuestion = true;
        this.render();
      });

      PROGRESS.setStoryProgress(this.page.id, this.idx, false);
      maybeReadAloud(text);
    },

    renderQuestion() {
      const c = document.getElementById("learn-container");
      const sec = this.page.sections[this.idx];
      const lang = I18N.current;
      const question = lang === "yi" ? (sec.question_yiddish || sec.question) : sec.question;

      let html = '<div class="story-container">';
      html += '<div class="story-question focus-target">';
      html += '<div class="quiz-question-text">' + escapeHtml(question || "") + '</div>';
      html += '<div class="quiz-options">';
      (sec.answers || []).forEach((a, i) => {
        const t = lang === "yi" ? (a.text_yiddish || a.text) : a.text;
        html += '<button class="quiz-option" data-i="' + i + '">' + escapeHtml(t) + '</button>';
      });
      html += '</div>';
      html += '<div id="story-feedback" style="margin-top:14px;"></div>';
      html += '</div></div>';
      c.innerHTML = html;

      c.querySelectorAll(".quiz-option").forEach((btn) => {
        btn.addEventListener("click", () => this.answerQuestion(parseInt(btn.dataset.i, 10), btn));
      });
    },

    answerQuestion(i, btn) {
      const sec = this.page.sections[this.idx];
      const ans = sec.answers[i];
      const fb = document.getElementById("story-feedback");
      const buttons = document.querySelectorAll(".quiz-option");
      buttons.forEach((b) => { b.disabled = true; });
      const lang = I18N.current;

      if (ans.correct) {
        btn.classList.add("selected");
        fb.innerHTML = '<div class="game-feedback">✅ ' + I18N.t("correct") + '</div>';
        AUDIO.play("correct");
        XP.addXP(5);
        MASCOT.react("happy");
        if (PROGRESS.state.ageGroup === "kids") celebrate();
        setTimeout(() => this.advance(), 1100);
      } else {
        btn.classList.add("selected");
        btn.style.background = "var(--danger)";
        btn.style.color = "white";
        const explanation = lang === "yi" ? (sec.explanation_yiddish || sec.explanation) : sec.explanation;
        fb.innerHTML =
          '<div class="game-feedback">❌ ' + I18N.t("wrong") + '<br><b>' + I18N.t("explanation_label") + '</b> ' + escapeHtml(explanation || "") +
          '<br><button class="got-it-btn" id="got-it">' + I18N.t("got_it") + '</button></div>';
        AUDIO.play("wrong");
        MASCOT.react("sad");
        PROGRESS.addMistake(this.page.id, sec.id);
        let timer = setTimeout(() => this.advance(), 3500);
        const gotIt = document.getElementById("got-it");
        if (gotIt) gotIt.addEventListener("click", () => { clearTimeout(timer); this.advance(); });
      }
    },

    advance() {
      this.idx += 1;
      this.showingQuestion = false;
      if (this.idx >= this.page.sections.length) {
        PROGRESS.setStoryProgress(this.page.id, this.idx, true);
        PROGRESS.addSticker(this.page.id);
      }
      this.render();
    },

    renderDone() {
      const c = document.getElementById("learn-container");
      let html = '<div class="game-final">';
      html += '<h2>' + I18N.t("done") + '</h2>';
      html += '<div class="big-buttons two-col" style="max-width:520px;margin:18px auto;">';
      html += '<button class="primary-btn" id="story-replay">' + I18N.t("replay") + '</button>';
      const nxt = findNextSugya(this.page.id);
      if (nxt) html += '<button class="primary-btn" id="story-next-sugya">' + I18N.t("next_sugya") + '</button>';
      html += '<button class="choice-btn" id="story-switch">' + I18N.t("switch_mode") + '</button>';
      html += '</div></div>';
      c.innerHTML = html;

      document.getElementById("story-replay").addEventListener("click", () => {
        this.idx = 0;
        PROGRESS.setStoryProgress(this.page.id, 0, false);
        this.render();
      });
      document.getElementById("story-switch").addEventListener("click", () => showScreen("screen-mode"));
      if (nxt) {
        document.getElementById("story-next-sugya").addEventListener("click", () => {
          pickSugyaAndStart(nxt.id, "story");
        });
      }
      if (PROGRESS.state.ageGroup === "kids") { celebrate(); MASCOT.react("excited"); AUDIO.play("sticker"); }
    }
  };

  global.STORY = STORY;
})(window);
