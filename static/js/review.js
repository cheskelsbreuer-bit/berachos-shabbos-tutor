/* review.js — smart daily review + chazara mode */
(function (global) {
  const REVIEW = {
    todayISO() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    },

    /** Build flashcard queue across ALL sugyos where nextReview <= today. */
    collectDueCards(content) {
      const today = this.todayISO();
      const due = [];
      (content.masechtos || []).forEach((m) => {
        (m.perakim || []).forEach((perek) => {
          (perek.sugyos || []).forEach((sugya) => {
            (sugya.sections || []).forEach((sec) => {
              const card = PROGRESS.getFlashcardCard(sugya.id, sec.id);
              if (card && card.nextReview && card.nextReview <= today) {
                due.push({ sugya, section: sec });
              }
            });
          });
        });
      });
      return due;
    },

    /** Pick all completed sugyos for chazara. */
    collectCompletedSugyos(content) {
      const done = [];
      (content.masechtos || []).forEach((m) => {
        (m.perakim || []).forEach((perek) => {
          (perek.sugyos || []).forEach((sugya) => {
            const p = PROGRESS.state.progress[sugya.id];
            if (p && p.game && p.game.completed) done.push(sugya);
          });
        });
      });
      return done;
    },

    /** Pick all wrong-answered sections for "Practice Mistakes". */
    collectMistakeSections(content) {
      const out = [];
      const mistakes = PROGRESS.state.mistakes || {};
      (content.masechtos || []).forEach((m) => {
        (m.perakim || []).forEach((perek) => {
          (perek.sugyos || []).forEach((sugya) => {
            const sm = mistakes[sugya.id];
            if (!sm) return;
            (sugya.sections || []).forEach((sec) => {
              if (sm[sec.id]) out.push({ sugya, section: sec });
            });
          });
        });
      });
      return out;
    }
  };

  global.REVIEW = REVIEW;
})(window);
