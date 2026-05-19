/* streak.js — daily streak tracking and milestone celebrations */
(function (global) {
  const STREAK = {
    todayISO() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    },

    daysBetween(a, b) {
      const da = new Date(a + "T00:00:00");
      const db = new Date(b + "T00:00:00");
      return Math.round((db - da) / (1000 * 60 * 60 * 24));
    },

    get(progress) {
      if (!progress.streak) {
        progress.streak = { current: 0, lastVisit: null, longest: 0 };
      }
      return progress.streak;
    },

    /** Call once per session/load. Updates current streak based on last visit. */
    touchDay(progress) {
      const s = this.get(progress);
      const today = this.todayISO();

      if (!s.lastVisit) {
        s.current = 1;
        s.lastVisit = today;
      } else if (s.lastVisit === today) {
        // same-day, no change
      } else {
        const diff = this.daysBetween(s.lastVisit, today);
        if (diff === 1) {
          s.current += 1;
        } else if (diff > 1) {
          s.current = 1; // reset, count today
        }
        s.lastVisit = today;
      }

      if (s.current > (s.longest || 0)) s.longest = s.current;
      return s;
    },

    milestoneMessageKey(current) {
      if (current === 30) return "streak_message_30";
      if (current === 14) return "streak_message_14";
      if (current === 7) return "streak_message_7";
      if (current === 3) return "streak_message_3";
      return null;
    },

    earnedBadges(current) {
      const badges = [];
      if (current >= 3) badges.push("streak3");
      if (current >= 7) badges.push("streak7");
      if (current >= 14) badges.push("streak14");
      if (current >= 30) badges.push("streak30");
      return badges;
    },

    /** Render streak badge in header. */
    render(progress) {
      const s = this.get(progress);
      const badge = document.getElementById("streak-badge");
      const countEl = document.getElementById("streak-count");
      if (!badge || !countEl) return;
      if (s.current > 0) {
        countEl.textContent = s.current;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    }
  };

  global.STREAK = STREAK;
})(window);
