/* onboarding.js — handles language, age, challenges, diagnostic quiz, mode pick */
(function (global) {
  const QUIZ_QUESTIONS = [
    {
      qKey: "quiz_q1",
      answers: [
        { key: "quiz_q1_a", weights: { flashcard: 1, story: 1 } },
        { key: "quiz_q1_b", weights: { story: 2 } },
        { key: "quiz_q1_c", weights: { game: 2 } }
      ]
    },
    {
      qKey: "quiz_q2",
      answers: [
        { key: "quiz_q2_a", weights: { game: 2, flashcard: 1 } },
        { key: "quiz_q2_b", weights: { flashcard: 2 } },
        { key: "quiz_q2_c", weights: { story: 2 } }
      ]
    },
    {
      qKey: "quiz_q3",
      answers: [
        { key: "quiz_q3_a", weights: { flashcard: 2 } },
        { key: "quiz_q3_b", weights: { game: 1, flashcard: 1 } },
        { key: "quiz_q3_c", weights: { story: 2 } }
      ]
    },
    {
      qKey: "quiz_q4",
      answers: [
        { key: "quiz_q4_a", weights: { game: 2 } },
        { key: "quiz_q4_b", weights: { flashcard: 1, game: 1 } },
        { key: "quiz_q4_c", weights: { story: 2 } }
      ]
    },
    {
      qKey: "quiz_q5",
      answers: [
        { key: "quiz_q5_a", weights: { game: 3 } },
        { key: "quiz_q5_b", weights: { flashcard: 3 } },
        { key: "quiz_q5_c", weights: { story: 3 } }
      ]
    }
  ];

  const ONBOARDING = {
    quizIdx: 0,
    quizAnswers: [],

    recommendFromChallenges(challenges) {
      // Heuristic mapping without quiz
      const scores = { game: 0, flashcard: 0, story: 0 };
      if (challenges.includes("focus")) scores.game += 2;
      if (challenges.includes("memory")) scores.flashcard += 3;
      if (challenges.includes("reading")) scores.game += 1; // less text-heavy
      if (challenges.includes("slow")) scores.story += 1;
      return this.topKey(scores) || "game";
    },

    recommendFromQuiz(answers) {
      const scores = { game: 0, flashcard: 0, story: 0 };
      answers.forEach((ans, i) => {
        if (ans == null) return;
        const w = QUIZ_QUESTIONS[i].answers[ans].weights || {};
        Object.keys(w).forEach((k) => { scores[k] = (scores[k] || 0) + w[k]; });
      });
      return this.topKey(scores) || "flashcard";
    },

    topKey(scores) {
      let top = null, max = -Infinity;
      Object.entries(scores).forEach(([k, v]) => {
        if (v > max) { max = v; top = k; }
      });
      return top;
    },

    renderQuiz() {
      const area = document.getElementById("quiz-question-area");
      const progressEl = document.getElementById("quiz-progress");
      const q = QUIZ_QUESTIONS[this.quizIdx];
      progressEl.textContent = (this.quizIdx + 1) + " / " + QUIZ_QUESTIONS.length;
      const selected = this.quizAnswers[this.quizIdx];

      let html = '<div class="quiz-question-text">' + I18N.t(q.qKey) + '</div>';
      html += '<div class="quiz-options">';
      q.answers.forEach((a, i) => {
        const cls = (selected === i) ? "quiz-option selected" : "quiz-option";
        html += '<button class="' + cls + '" data-ans="' + i + '">' + I18N.t(a.key) + '</button>';
      });
      html += '</div>';
      area.innerHTML = html;

      area.querySelectorAll(".quiz-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.quizAnswers[this.quizIdx] = parseInt(btn.dataset.ans, 10);
          this.renderQuiz();
        });
      });

      const nextBtn = document.getElementById("quiz-next");
      nextBtn.textContent = (this.quizIdx === QUIZ_QUESTIONS.length - 1) ? I18N.t("finish") : I18N.t("next");
    },

    nextQuiz() {
      if (this.quizAnswers[this.quizIdx] == null) {
        showToast(I18N.t("next") + "?");
        return;
      }
      if (this.quizIdx < QUIZ_QUESTIONS.length - 1) {
        this.quizIdx += 1;
        this.renderQuiz();
      } else {
        const mode = this.recommendFromQuiz(this.quizAnswers);
        PROGRESS.state.preferredMode = mode;
        PROGRESS.save();
        afterQuizFinished(mode);
      }
    },

    backQuiz() {
      if (this.quizIdx > 0) {
        this.quizIdx -= 1;
        this.renderQuiz();
      } else {
        showScreen("screen-challenges");
      }
    },

    startQuiz() {
      this.quizIdx = 0;
      this.quizAnswers = [];
      this.renderQuiz();
      showScreen("screen-quiz");
    }
  };

  global.ONBOARDING = ONBOARDING;
  global.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
})(window);
