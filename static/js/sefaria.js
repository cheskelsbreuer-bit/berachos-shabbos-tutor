/* sefaria.js — Pulls authoritative text from Sefaria's API.
   This is the *real* verified source for every word of Gemara, Tanach, Mishnah, Tanya, etc.
   We hit https://www.sefaria.org/api/texts/<ref> and cache responses in localStorage. */
(function (global) {
  const CACHE_KEY = "sefaria_cache_v1";
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch (e) {}

  function saveCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) {}
  }

  /** Try to derive a Sefaria reference from a sugya. Prefers explicit sefaria_ref field. */
  function refFor(sugya, masechta) {
    if (sugya && sugya.sefaria_ref) return sugya.sefaria_ref;
    if (!sugya) return null;
    const mid = (masechta && masechta.id) || "";
    const daf = sugya.daf || "";
    if (mid === "shabbos") return "Shabbat." + daf;
    if (mid === "berachos") return "Berakhot." + daf;
    if (mid === "tanya") {
      // sugya id like "tanya-ch1" → "Tanya, Part I; Likkutei Amarim 1"
      const m = (sugya.id || "").match(/ch(\d+)/);
      if (m) return "Tanya, Part I; Likkutei Amarim " + m[1];
    }
    if (mid === "chumash-bereishis") {
      // Sugya merged: perek 1 → Genesis.1
      const m = (sugya.id || "").match(/p(\d+)/);
      if (m) return "Genesis." + m[1];
    }
    if (mid === "pirkei-avos") {
      const m = (sugya.id || "").match(/p(\d+)/);
      if (m) return "Pirkei Avot." + m[1];
    }
    return null;
  }

  /** Fetch + cache. Returns { he, text, ref } or null on failure. */
  async function fetchRef(ref) {
    if (!ref) return null;
    if (cache[ref]) return cache[ref];
    try {
      const url = "https://www.sefaria.org/api/texts/" + encodeURIComponent(ref) + "?context=0&commentary=0";
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      // Sefaria returns "he" (Hebrew/Aramaic, can be string or array) and "text" (English, same)
      const result = {
        ref: data.ref || ref,
        he: flatten(data.he),
        text: flatten(data.text),
        sectionRef: data.sectionRef || ref
      };
      cache[ref] = result;
      saveCache();
      return result;
    } catch (e) {
      return null;
    }
  }

  function flatten(x) {
    if (!x) return [];
    if (typeof x === "string") return [x];
    if (Array.isArray(x)) {
      const out = [];
      x.forEach(item => { flatten(item).forEach(s => out.push(s)); });
      return out;
    }
    return [];
  }

  /** Strip HTML tags so we display plain text. */
  function stripHtml(s) {
    if (!s) return "";
    return String(s).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  }

  /** Render a Sefaria result into HTML. */
  function renderResult(result) {
    if (!result) return '<div class="sefaria-err">Could not load Sefaria text.</div>';
    let html = '<div class="sefaria-ref">' + escapeHtml(result.ref) + '</div>';
    if (result.he && result.he.length) {
      html += '<div class="sefaria-hebrew">';
      result.he.forEach((p, i) => {
        const clean = stripHtml(p);
        if (clean.trim()) html += '<p>' + escapeHtml(clean) + '</p>';
      });
      html += '</div>';
    }
    if (result.text && result.text.length) {
      html += '<details class="sefaria-translation"><summary>📝 Show English translation (Sefaria)</summary><div class="sefaria-translation-body">';
      result.text.forEach((p) => {
        const clean = stripHtml(p);
        if (clean.trim()) html += '<p>' + escapeHtml(clean) + '</p>';
      });
      html += '</div></details>';
    }
    html += '<div class="sefaria-attribution">Text from <a href="https://www.sefaria.org/' + encodeURIComponent(result.sectionRef) + '" target="_blank" rel="noopener">Sefaria</a>.</div>';
    return html;
  }

  /** Build a TorahAnytime search URL for the current sugya. */
  function torahAnytimeUrl(sugya, masechta) {
    let q = "";
    if (masechta && masechta.name) q += masechta.name + " ";
    if (sugya && sugya.daf) q += sugya.daf;
    return "https://www.torahanytime.com/search?q=" + encodeURIComponent(q.trim());
  }

  global.SEFARIA = {
    refFor,
    fetchRef,
    renderResult,
    torahAnytimeUrl
  };
})(window);
