/* mascot.js — friendly SVG character for kids mode */
(function (global) {
  let idleTimer = null;

  const FACES = {
    happy: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#fcd34d" stroke="#92400e" stroke-width="3"/>
        <circle cx="35" cy="42" r="5" fill="#1f2937"/>
        <circle cx="65" cy="42" r="5" fill="#1f2937"/>
        <path d="M30 60 Q50 80 70 60" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="25" cy="55" r="6" fill="#fb7185" opacity="0.5"/>
        <circle cx="75" cy="55" r="6" fill="#fb7185" opacity="0.5"/>
      </svg>`,
    sad: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#a5b4fc" stroke="#3730a3" stroke-width="3"/>
        <path d="M30 40 L40 45 M70 40 L60 45" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
        <path d="M30 72 Q50 60 70 72" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="35" cy="60" rx="2" ry="4" fill="#60a5fa"/>
      </svg>`,
    excited: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#fb7185" stroke="#9f1239" stroke-width="3"/>
        <path d="M28 38 L42 38 M58 38 L72 38" stroke="#1f2937" stroke-width="4" stroke-linecap="round"/>
        <circle cx="35" cy="42" r="3" fill="#1f2937"/>
        <circle cx="65" cy="42" r="3" fill="#1f2937"/>
        <ellipse cx="50" cy="68" rx="14" ry="10" fill="#1f2937"/>
        <ellipse cx="50" cy="72" rx="10" ry="6" fill="#fb7185"/>
      </svg>`,
    neutral: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#a7f3d0" stroke="#065f46" stroke-width="3"/>
        <circle cx="35" cy="42" r="4" fill="#1f2937" class="mascot-eye"/>
        <circle cx="65" cy="42" r="4" fill="#1f2937" class="mascot-eye"/>
        <line x1="40" y1="65" x2="60" y2="65" stroke="#1f2937" stroke-width="4" stroke-linecap="round"/>
      </svg>`
  };

  const MASCOT = {
    enabled() {
      return document.body.getAttribute("data-age") === "kids" && SETTINGS.get("mascot");
    },

    ensureContainer() {
      let el = document.getElementById("mascot-wrap");
      if (!el) {
        el = document.createElement("div");
        el.id = "mascot-wrap";
        el.className = "mascot-wrap";
        document.body.appendChild(el);
      }
      return el;
    },

    react(mood) {
      if (!this.enabled()) {
        const el = document.getElementById("mascot-wrap");
        if (el) el.classList.add("hidden");
        return;
      }
      const el = this.ensureContainer();
      el.classList.remove("hidden");
      const face = FACES[mood] || FACES.neutral;
      el.innerHTML = '<div class="mascot-face mascot-' + mood + '">' + face + '</div>';
      this.resetIdle();
    },

    resetIdle() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => this.react("neutral"), 10000);
    },

    init() {
      if (this.enabled()) this.react("neutral");
      SETTINGS.onChange((k) => {
        if (k === "mascot") {
          if (this.enabled()) this.react("neutral");
          else {
            const el = document.getElementById("mascot-wrap");
            if (el) el.classList.add("hidden");
          }
        }
      });
    }
  };

  global.MASCOT = MASCOT;
})(window);
