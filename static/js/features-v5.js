/* features-v5.js — Voice notes, Search, Share, Daily Plan. */
(function (global) {

  // ============================================================
  // VOICE NOTES — SpeechRecognition for note-taking
  // ============================================================
  const VOICE = {
    rec: null,
    targetTextarea: null,

    supported() {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    },

    /** Attach a 🎤 button next to a note textarea. */
    attachToTextarea(textarea, micBtn) {
      if (!this.supported()) {
        micBtn.style.opacity = "0.4";
        micBtn.title = "Voice input not supported in this browser";
        micBtn.addEventListener("click", () => showToast("Voice input not supported in this browser"));
        return;
      }
      micBtn.addEventListener("click", () => this.start(textarea, micBtn));
    },

    start(textarea, micBtn) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (this.rec) { this.stop(); return; }
      const rec = new SR();
      rec.lang = (document.body.getAttribute("data-lang") === "yi") ? "he-IL" : "en-US";
      rec.continuous = true;
      rec.interimResults = true;

      let finalText = textarea.value;
      if (finalText && !finalText.endsWith(" ")) finalText += " ";

      rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += t + " ";
          else interim += t;
        }
        textarea.value = finalText + interim;
      };
      rec.onerror = (e) => {
        showToast("Voice error: " + (e.error || "unknown"));
        this.stop();
      };
      rec.onend = () => {
        this.rec = null;
        if (micBtn) { micBtn.textContent = "🎤"; micBtn.classList.remove("recording"); }
      };
      rec.start();
      this.rec = rec;
      if (micBtn) { micBtn.textContent = "⏹️"; micBtn.classList.add("recording"); }
    },

    stop() {
      if (this.rec) {
        try { this.rec.stop(); } catch (e) {}
        this.rec = null;
      }
    }
  };

  // ============================================================
  // SEARCH — Full-text search across all content
  // ============================================================
  const SEARCH = {
    open() {
      const overlay = document.getElementById("search-overlay");
      overlay.classList.remove("hidden");
      const input = document.getElementById("search-input");
      input.value = "";
      document.getElementById("search-results").innerHTML = "";
      setTimeout(() => input.focus(), 50);
    },

    close() {
      document.getElementById("search-overlay").classList.add("hidden");
    },

    query(q) {
      const results = document.getElementById("search-results");
      results.innerHTML = "";
      if (!q || q.trim().length < 2) return;
      const needle = q.toLowerCase().trim();
      const content = getContent();
      const hits = [];

      (content.masechtos || []).forEach((m) => {
        (m.perakim || []).forEach((p) => {
          (p.sugyos || []).forEach((sug) => {
            const fields = [
              sug.title, sug.title_yiddish,
              sug.aramaic, sug.aramaic_translation, sug.aramaic_translation_yiddish,
              sug.daf
            ];
            (sug.aramaic_words || []).forEach((w) => { fields.push(w.a, w.en, w.yi); });
            (sug.sections || []).forEach((s) => {
              fields.push(s.text, s.text_yiddish, s.term, s.term_yiddish, s.definition, s.definition_yiddish);
              fields.push(s.rashi, s.rashi_yiddish, s.rashi_explanation, s.rashi_explanation_yiddish);
              fields.push(s.tosfos, s.tosfos_yiddish, s.tosfos_explanation, s.tosfos_explanation_yiddish);
            });
            const blob = fields.filter(Boolean).join(" ").toLowerCase();
            if (blob.includes(needle)) {
              // Find best snippet
              const idx = blob.indexOf(needle);
              const start = Math.max(0, idx - 50);
              const end = Math.min(blob.length, idx + 80);
              hits.push({ sugya: sug, masechta: m, snippet: blob.slice(start, end) });
            }
          });
        });
      });

      if (hits.length === 0) {
        results.innerHTML = '<div class="search-empty">' + I18N.t("search_no_results") + '</div>';
        return;
      }
      const lang = I18N.current;
      hits.slice(0, 50).forEach((h) => {
        const title = lang === "yi" ? (h.sugya.title_yiddish || h.sugya.title) : h.sugya.title;
        const mName = lang === "yi" ? (h.masechta.name_yiddish || h.masechta.name) : h.masechta.name;
        const card = document.createElement("button");
        card.className = "search-result";
        card.innerHTML =
          '<div class="search-result-title">' + escapeHtml(title) + '</div>' +
          '<div class="search-result-meta">' + escapeHtml(mName) + ' · ' + I18N.t("daf_label") + ' ' + escapeHtml(h.sugya.daf || "") + '</div>' +
          '<div class="search-result-snippet">…' + escapeHtml(h.snippet) + '…</div>';
        card.addEventListener("click", () => {
          SEARCH.close();
          pickSugya(h.sugya.id);
        });
        results.appendChild(card);
      });
      results.insertAdjacentHTML("afterbegin", '<div class="search-count">' + hits.length + ' ' + I18N.t("search_hits") + '</div>');
    },

    init() {
      document.getElementById("search-btn").addEventListener("click", () => this.open());
      document.getElementById("search-close").addEventListener("click", () => this.close());
      const input = document.getElementById("search-input");
      let timer;
      input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => this.query(input.value), 180);
      });
      input.addEventListener("keydown", (e) => { if (e.key === "Escape") this.close(); });
    }
  };

  // ============================================================
  // SHARE — Web Share API + WhatsApp fallback
  // ============================================================
  const SHARE = {
    shareSugya(sugya) {
      const lang = I18N.current;
      const title = lang === "yi" ? (sugya.title_yiddish || sugya.title) : sugya.title;
      const aramaic = sugya.aramaic || "";
      const translation = lang === "yi" ? (sugya.aramaic_translation_yiddish || sugya.aramaic_translation) : sugya.aramaic_translation;
      const url = window.location.href;
      const text = [title, "", aramaic, "", translation, "", "— from " + url].filter(Boolean).join("\n");

      if (navigator.share) {
        navigator.share({ title, text }).catch(() => this.whatsappFallback(text));
      } else {
        this.whatsappFallback(text);
      }
    },

    whatsappFallback(text) {
      const url = "https://wa.me/?text=" + encodeURIComponent(text);
      window.open(url, "_blank");
    }
  };

  // ============================================================
  // DAILY PLAN — auto-suggest one item from each sefer type
  // ============================================================
  const DAILY = {
    /** Returns up to 4 suggested sugyos for today: one of each content type
        the user has but hasn't completed.  Hides if setting is OFF. */
    build() {
      if (!SETTINGS.get("dailyPlan")) return [];
      const content = getContent();
      const seen = {};
      const items = [];
      (content.masechtos || []).forEach((m) => {
        const ctype = m.content_type || "gemara";
        if (seen[ctype]) return;
        // Find first uncompleted sugya, skip pure placeholders
        for (const p of (m.perakim || [])) {
          for (const sug of (p.sugyos || [])) {
            const placeholderish = (sug.title || "").startsWith("[");
            if (placeholderish) continue;
            const status = PROGRESS.completionStatus(sug.id);
            if (status !== "complete") {
              items.push({ sugya: sug, masechta: m, ctype });
              seen[ctype] = true;
              break;
            }
          }
          if (seen[ctype]) break;
        }
      });
      return items;
    },

    render(containerId) {
      const c = document.getElementById(containerId);
      if (!c) return;
      const items = this.build();
      if (!items.length) { c.innerHTML = ""; return; }
      const lang = I18N.current;
      let html = '<div class="daily-plan">';
      html += '<h3 class="daily-plan-title">📅 ' + I18N.t("daily_plan_title") + '</h3>';
      html += '<div class="daily-plan-list">';
      items.forEach((it) => {
        const title = lang === "yi" ? (it.sugya.title_yiddish || it.sugya.title) : it.sugya.title;
        const masName = lang === "yi" ? (it.masechta.name_yiddish || it.masechta.name) : it.masechta.name;
        const typeEmoji = { gemara: "📚", tanya: "✡️", chumash: "📖", mishnayos: "📜" }[it.ctype] || "📜";
        html += '<button class="daily-plan-item" data-sugya="' + escapeHtml(it.sugya.id) + '">';
        html += '<div class="dp-emoji">' + typeEmoji + '</div>';
        html += '<div class="dp-text"><div class="dp-mas">' + escapeHtml(masName) + '</div><div class="dp-title">' + escapeHtml(title) + '</div></div>';
        html += '<div class="dp-go">→</div>';
        html += '</button>';
      });
      html += '</div></div>';
      c.innerHTML = html;
      c.querySelectorAll("[data-sugya]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const found = findSugya(btn.dataset.sugya);
          if (!found) return;
          const mode = found.masechta.default_mode || "story";
          pickSugyaAndStart(btn.dataset.sugya, mode);
        });
      });
    }
  };

  // ============================================================
  // Helpers
  // ============================================================
  function getContent() {
    // global accessor — main.js exposes CONTENT via window.getContent if needed
    return window._CONTENT_CACHE || { masechtos: [] };
  }
  window.cacheContent = function (c) { window._CONTENT_CACHE = c; };

  global.VOICE = VOICE;
  global.SEARCH = SEARCH;
  global.SHARE = SHARE;
  global.DAILY = DAILY;
})(window);
