/* game.js — Game mode with all V2 fixes and features */
(function (global) {
  const GAME = {
    page: null,
    sections: [],
    idx: 0,
    score: 0,
    answered: false,

    start(page) {
      this.page = page;
      this.sections = page.sections || [];
      this.idx = 0;
      this.score = 0;
      this.answered = false;
      this.render();
    },

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

    render() {
      const c = document.getElementById("learn-container");
      const lang = I18N.current;

      if (this.idx >= this.sections.length) {
        this.renderFinal();
        return;
      }

      const sec = this.sections[this.idx];
      const text = this.pickText(sec);
      const question = lang === "yi" ? (sec.question_yiddish || sec.question) : sec.question;

      const sbs = document.body.classList.contains("side-by-side-active") && getCurrentSugya() && getCurrentSugya().aramaic;
      const textHtml = renderTappableText(text);

      let html = '<div class="game-container">';
      html += '<div class="game-score">' + I18N.t("score") + ': ' + this.score + ' &nbsp;·&nbsp; ' + (this.idx + 1) + '/' + this.sections.length + '</div>';
      html += cardActionsRow(sec.id);

      // Bug fix 1 + 4: text above question + side-by-side + word-by-word
      if (sbs) {
        html += '<div class="side-by-side-wrap">' +
          '<div class="side-col"><div class="side-col-label">📜 ' + I18N.t("aramaic_label") + '</div><div class="aramaic-text">' + escapeHtml(getCurrentSugya().aramaic) + '</div></div>' +
          '<div class="side-col"><div class="side-col-label">' + I18N.t("translation_label") + '</div><div class="game-text">' + textHtml + '</div></div>' +
        '</div>';
      } else {
        html += '<div class="game-text focus-target">' + textHtml + '</div>';
      }

      // Word-by-word collapsible panel (Bug fix 4)
      html += wbwPanelHtml();

      // Rashi/Tosfos panels
      html += commentaryHtml(sec);

      html += '<div class="game-card">';
      html += '<div class="game-question">' + escapeHtml(question || "") + '</div>';
      (sec.answers || []).forEach((a, i) => {
        const t = lang === "yi" ? (a.text_yiddish || a.text) : a.text;
        html += '<button class="game-answer" data-i="' + i + '">' + escapeHtml(t) + '</button>';
      });
      html += '<div id="game-feedback"></div>';
      html += '</div></div>';

      c.innerHTML = html;

      wireCardActions(c, this.page.id, sec.id, () => this.render());
      wireWbwToggle(c);
      wireCommentaryToggles(c);
      wireTappableWords(c, getCurrentSugya());

      c.querySelectorAll(".game-answer").forEach((btn) => {
        btn.addEventListener("click", () => this.answer(parseInt(btn.dataset.i, 10), btn));
      });

      maybeReadAloud(text);
    },

    answer(i, btn) {
      if (this.answered) return;
      this.answered = true;
      const sec = this.sections[this.idx];
      const ans = sec.answers[i];
      const fb = document.getElementById("game-feedback");
      const lang = I18N.current;

      const buttons = document.querySelectorAll(".game-answer");
      buttons.forEach((b) => { b.disabled = true; });

      if (ans.correct) {
        btn.classList.add("correct");
        this.score += 10;
        fb.innerHTML = '<div class="game-feedback">✅ ' + I18N.t("correct") + '</div>';
        AUDIO.play("correct");
        XP.addXP(10);
        XP.onCorrect();
        XP.incrementDaily();
        MASCOT.react("happy");
        if (PROGRESS.state.ageGroup === "kids") celebrate();
        setTimeout(() => {
          this.idx += 1;
          this.answered = false;
          this.render();
        }, 900);
      } else {
        btn.classList.add("wrong");
        const correctIdx = sec.answers.findIndex((a) => a.correct);
        if (correctIdx >= 0) buttons[correctIdx].classList.add("correct");
        const explanation = lang === "yi" ? (sec.explanation_yiddish || sec.explanation) : sec.explanation;
        fb.innerHTML =
          '<div class="game-feedback">❌ ' + I18N.t("wrong") + '<br><b>' + I18N.t("explanation_label") + '</b> ' + escapeHtml(explanation || "") +
          '<br><button class="got-it-btn" id="got-it">' + I18N.t("got_it") + '</button></div>';
        AUDIO.play("wrong");
        XP.onWrong();
        MASCOT.react("sad");
        PROGRESS.addMistake(this.page.id, sec.id);

        const advance = () => {
          this.idx += 1;
          this.answered = false;
          this.render();
        };
        // Bug fix 6: slower (3500ms) + Got it button
        let timer = setTimeout(advance, 3500);
        const gotIt = document.getElementById("got-it");
        if (gotIt) {
          gotIt.addEventListener("click", () => {
            clearTimeout(timer);
            advance();
          });
        }
      }
    },

    renderFinal() {
      const c = document.getElementById("learn-container");
      const prev = PROGRESS.ensurePage(this.page.id).game.highScore || 0;
      const isNewBest = this.score > prev;
      PROGRESS.setGameProgress(this.page.id, this.score, true);
      PROGRESS.addSticker(this.page.id);

      let html = '<div class="game-final">';
      html += '<h2>' + I18N.t("done") + '</h2>';
      html += '<p>' + I18N.t("score") + ': <b>' + this.score + '</b></p>';
      html += '<p class="personal-best">' + I18N.t("personal_best") + ' <b>' + Math.max(prev, this.score) + '</b></p>';
      if (isNewBest) html += '<p class="new-record">' + I18N.t("new_record") + '</p>';
      html += '<div class="big-buttons two-col" style="max-width:520px;margin:18px auto;">';
      html += '<button class="primary-btn" id="game-replay">' + I18N.t("replay") + '</button>';
      const nxt = findNextSugya(this.page.id);
      if (nxt) html += '<button class="primary-btn" id="game-next">' + I18N.t("next_sugya") + '</button>';
      html += '<button class="choice-btn" id="game-switch">' + I18N.t("switch_mode") + '</button>';
      html += '</div></div>';
      c.innerHTML = html;

      document.getElementById("game-replay").addEventListener("click", () => this.start(this.page));
      document.getElementById("game-switch").addEventListener("click", () => showScreen("screen-mode"));
      if (nxt) {
        document.getElementById("game-next").addEventListener("click", () => {
          pickSugyaAndStart(nxt.id, "game");
        });
      }

      if (isNewBest) AUDIO.play("levelup");
      if (PROGRESS.state.ageGroup === "kids") { celebrate(); MASCOT.react("excited"); AUDIO.play("sticker"); }
    }
  };

  global.GAME = GAME;
})(window);
