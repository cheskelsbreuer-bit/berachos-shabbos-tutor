/* settings.js — global settings store with localStorage persistence */
(function (global) {
  const KEY = "tutorSettings";
  const DEFAULTS = {
    // Learning aids
    readAloud: false,
    slowReveal: false,
    focusMode: false,
    highlightAsYouRead: false,
    simplifiedMode: false,
    wordTap: true,
    repeatButton: true,
    chunkedReading: false,
    // Motivation
    xpBar: true,
    dailyGoal: true,
    dailyGoalAmount: 10,
    comboMultiplier: true,
    soundEffects: true,
    completionMap: true,
    // Review tools
    bookmarks: true,
    notes: true,
    mistakesList: true,
    weakSpots: true,
    smartDailyReview: true,
    chazaraMode: true,
    dailyPlan: true,
    // Commentary
    showRashi: true,
    showTosfos: true,
    // Kids
    mascot: true,
    stickerBook: true,
    // UI
    sideBySide: false
  };

  const SETTINGS = {
    data: { ...DEFAULTS },
    _listeners: [],

    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) this.data = { ...DEFAULTS, ...JSON.parse(raw) };
      } catch (e) { /* ignore */ }
    },
    save() {
      try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) { /* ignore */ }
    },
    get(key) { return this.data[key]; },
    set(key, value) {
      this.data[key] = value;
      this.save();
      this._listeners.forEach((fn) => { try { fn(key, value); } catch (e) {} });
    },
    onChange(fn) { this._listeners.push(fn); },

    render() {
      const overlay = document.getElementById("settings-overlay");
      const body = document.getElementById("settings-body");
      const showKids = document.body.getAttribute("data-age") === "kids";

      const sections = [
        {
          title: I18N.t("settings_learning_aids"),
          rows: [
            ["readAloud", "read_aloud"],
            ["slowReveal", "slow_reveal"],
            ["focusMode", "focus_mode"],
            ["highlightAsYouRead", "highlight_reading"],
            ["simplifiedMode", "simplified_mode"],
            ["wordTap", "word_tap"],
            ["repeatButton", "repeat_btn"],
            ["chunkedReading", "chunked_reading"]
          ]
        },
        {
          title: I18N.t("settings_motivation"),
          rows: [
            ["xpBar", "xp_bar"],
            ["dailyGoal", "daily_goal"],
            ["dailyGoalAmount", "daily_goal_amount", "number"],
            ["comboMultiplier", "combo_multiplier"],
            ["soundEffects", "sound_effects"],
            ["completionMap", "completion_map"]
          ]
        },
        {
          title: I18N.t("settings_review_tools"),
          rows: [
            ["bookmarks", "bookmarks"],
            ["notes", "notes"],
            ["mistakesList", "mistakes_list"],
            ["weakSpots", "weak_spots"],
            ["smartDailyReview", "smart_review"],
            ["chazaraMode", "chazara_mode"],
            ["dailyPlan", "daily_plan_setting"]
          ]
        },
        {
          title: I18N.t("settings_commentary"),
          rows: [
            ["showRashi", "show_rashi"],
            ["showTosfos", "show_tosfos"]
          ]
        }
      ];
      if (showKids) {
        sections.push({
          title: I18N.t("settings_kids"),
          rows: [
            ["mascot", "mascot"],
            ["stickerBook", "sticker_book"]
          ]
        });
      }

      let html = "";
      sections.forEach((sec) => {
        html += '<div class="settings-section"><h3>' + escapeHtml(sec.title) + '</h3>';
        sec.rows.forEach((row) => {
          const key = row[0];
          const label = I18N.t(row[1]);
          const type = row[2] || "toggle";
          if (type === "number") {
            html +=
              '<div class="settings-row"><label>' + escapeHtml(label) + '</label>' +
              '<input type="number" min="1" max="50" data-setting-num="' + key + '" value="' + (this.data[key] || 10) + '" class="settings-number" /></div>';
          } else {
            const checked = this.data[key] ? " checked" : "";
            html +=
              '<div class="settings-row"><label>' + escapeHtml(label) + '</label>' +
              '<label class="toggle-switch"><input type="checkbox" data-setting="' + key + '"' + checked + ' /><span class="toggle-slider"></span></label></div>';
          }
        });
        html += '</div>';
      });
      body.innerHTML = html;

      body.querySelectorAll("[data-setting]").forEach((inp) => {
        inp.addEventListener("change", () => {
          SETTINGS.set(inp.dataset.setting, inp.checked);
        });
      });
      body.querySelectorAll("[data-setting-num]").forEach((inp) => {
        inp.addEventListener("change", () => {
          const v = parseInt(inp.value, 10);
          if (!isNaN(v) && v > 0) SETTINGS.set(inp.dataset.settingNum, v);
        });
      });
    },

    open() {
      this.render();
      document.getElementById("settings-overlay").classList.remove("hidden");
    },
    close() {
      document.getElementById("settings-overlay").classList.add("hidden");
    },

    applyVisualToggles() {
      document.body.classList.toggle("focus-active", !!this.data.focusMode);
      document.body.classList.toggle("side-by-side-active", !!this.data.sideBySide);
    },

    init() {
      this.load();
      this.applyVisualToggles();
      this.onChange(() => this.applyVisualToggles());
    }
  };

  global.SETTINGS = SETTINGS;
})(window);
