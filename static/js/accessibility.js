/* accessibility.js — font size, contrast, audio toggle, panel controls */
(function (global) {
  const STORAGE_KEY = "lt_a11y";
  const defaults = { font: "medium", contrast: "normal", audio: "off" };

  const A11Y = {
    settings: { ...defaults },

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) this.settings = { ...defaults, ...JSON.parse(raw) };
      } catch (e) { /* ignore */ }
      this.apply();
    },

    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    },

    apply() {
      document.body.setAttribute("data-font", this.settings.font);
      document.body.setAttribute("data-contrast", this.settings.contrast);
      this.reflectButtons();
    },

    reflectButtons() {
      document.querySelectorAll("[data-font]").forEach((b) => {
        b.classList.toggle("active", b.dataset.font === this.settings.font);
      });
      document.querySelectorAll("[data-contrast]").forEach((b) => {
        b.classList.toggle("active", b.dataset.contrast === this.settings.contrast);
      });
      document.querySelectorAll("[data-audio]").forEach((b) => {
        b.classList.toggle("active", b.dataset.audio === this.settings.audio);
      });
    },

    setFont(size)         { this.settings.font = size; this.save(); this.apply(); },
    setContrast(c)        { this.settings.contrast = c; this.save(); this.apply(); },
    setAudio(state)       { this.settings.audio = state; this.save(); this.apply(); },

    speak(text) {
      if (this.settings.audio !== "on") return;
      if (!("speechSynthesis" in window)) return;
      try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = (document.body.getAttribute("data-lang") === "yi") ? "yi" : "en-US";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } catch (e) { /* ignore */ }
    },

    init() {
      this.load();
      const btn = document.getElementById("a11y-btn");
      const panel = document.getElementById("a11y-panel");
      const close = document.getElementById("a11y-close");

      btn.addEventListener("click", () => panel.classList.toggle("hidden"));
      close.addEventListener("click", () => panel.classList.add("hidden"));

      document.querySelectorAll("[data-font]").forEach((b) => {
        b.addEventListener("click", () => this.setFont(b.dataset.font));
      });
      document.querySelectorAll("[data-contrast]").forEach((b) => {
        b.addEventListener("click", () => this.setContrast(b.dataset.contrast));
      });
      document.querySelectorAll("[data-audio]").forEach((b) => {
        b.addEventListener("click", () => this.setAudio(b.dataset.audio));
      });
    }
  };

  global.A11Y = A11Y;
})(window);
