/* xp.js — XP, levels, daily goal, combo */
(function (global) {
  const XP_PER_LEVEL = 100;
  let comboCount = 0;
  let comboMultiplier = 1;

  const XP = {
    addXP(amount) {
      if (!amount || amount <= 0) return;
      const bonus = (SETTINGS.get("comboMultiplier") && comboMultiplier > 1) ? comboMultiplier : 1;
      const total = Math.round(amount * bonus);
      PROGRESS.state.xp = (PROGRESS.state.xp || 0) + total;
      this.checkLevelUp();
      this.render();
      PROGRESS.save();
    },

    checkLevelUp() {
      const xp = PROGRESS.state.xp || 0;
      const expected = Math.floor(xp / XP_PER_LEVEL) + 1;
      const prev = PROGRESS.state.level || 1;
      if (expected > prev) {
        PROGRESS.state.level = expected;
        showToast("⭐ " + I18N.t("level_up") + " " + expected + "!", 2800);
        celebrate();
        AUDIO.play("levelup");
      }
    },

    render() {
      const wrap = document.getElementById("xp-bar-wrap");
      if (!wrap) return;
      if (!SETTINGS.get("xpBar")) {
        wrap.classList.add("hidden");
        return;
      }
      wrap.classList.remove("hidden");
      const xp = PROGRESS.state.xp || 0;
      const lvl = PROGRESS.state.level || 1;
      const inLevel = xp % XP_PER_LEVEL;
      const pct = Math.round((inLevel / XP_PER_LEVEL) * 100);
      wrap.innerHTML =
        '<span class="xp-level-label">⭐ ' + I18N.t("level_label") + ' ' + lvl + '</span>' +
        '<div class="xp-bar-bg"><div class="xp-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<span class="xp-num">' + inLevel + '/' + XP_PER_LEVEL + '</span>';
    },

    onCorrect() {
      comboCount += 1;
      if (SETTINGS.get("comboMultiplier")) {
        if (comboCount === 3) {
          comboMultiplier = 2;
          showToast("🔥 " + I18N.t("combo_label") + " x2!", 1800);
          AUDIO.play("streak");
        } else if (comboCount === 6) {
          comboMultiplier = 3;
          showToast("🔥🔥 " + I18N.t("combo_label") + " x3!", 1800);
          AUDIO.play("streak");
        }
      }
    },

    onWrong() {
      comboCount = 0;
      comboMultiplier = 1;
    },

    getCombo() { return comboCount; },

    // ============ Daily Goal ============
    todayISO() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    },

    incrementDaily() {
      const today = this.todayISO();
      if (!PROGRESS.state.dailyProgress) PROGRESS.state.dailyProgress = { date: today, count: 0 };
      if (PROGRESS.state.dailyProgress.date !== today) {
        PROGRESS.state.dailyProgress = { date: today, count: 0 };
      }
      PROGRESS.state.dailyProgress.count += 1;

      if (!PROGRESS.state.weeklyActivity) PROGRESS.state.weeklyActivity = {};
      PROGRESS.state.weeklyActivity[today] = (PROGRESS.state.weeklyActivity[today] || 0) + 1;
      this.pruneWeekly();

      const goal = SETTINGS.get("dailyGoalAmount") || 10;
      if (PROGRESS.state.dailyProgress.count === goal) {
        showToast("🎯 " + I18N.t("daily_goal_hit") + " +25 XP!", 2600);
        this.addXP(25);
      }
      this.renderDailyGoal();
      PROGRESS.save();
    },

    pruneWeekly() {
      const now = new Date();
      const cutoff = new Date(now); cutoff.setDate(now.getDate() - 7);
      const cutoffISO = cutoff.toISOString().slice(0, 10);
      const w = PROGRESS.state.weeklyActivity || {};
      Object.keys(w).forEach((k) => { if (k < cutoffISO) delete w[k]; });
    },

    renderDailyGoal() {
      const wrap = document.getElementById("daily-goal-bar");
      if (!wrap) return;
      if (!SETTINGS.get("dailyGoal")) { wrap.classList.add("hidden"); return; }
      wrap.classList.remove("hidden");
      const today = this.todayISO();
      const dp = PROGRESS.state.dailyProgress;
      const count = (dp && dp.date === today) ? dp.count : 0;
      const goal = SETTINGS.get("dailyGoalAmount") || 10;
      const pct = Math.min(100, Math.round((count / goal) * 100));
      wrap.innerHTML =
        '<span class="dg-label">' + I18N.t("today_label") + ' ' + count + '/' + goal + '</span>' +
        '<div class="dg-bg"><div class="dg-fill" style="width:' + pct + '%"></div></div>';
    },

    init() {
      this.render();
      this.renderDailyGoal();
      SETTINGS.onChange((k) => {
        if (k === "xpBar") this.render();
        if (k === "dailyGoal" || k === "dailyGoalAmount") this.renderDailyGoal();
      });
    }
  };

  global.XP = XP;
})(window);
