/* sefaria.js — fetches authoritative text + word definitions from Sefaria.
   Uses Flask proxy at /api/sefaria/<ref> and /api/lexicon/<word> to avoid CORS. */
(function (global) {
  const CACHE_KEY = "sefaria_v2_cache";
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch (e) {}

  function saveCache() {
    try {
      // Bound cache size to avoid filling localStorage
      const keys = Object.keys(cache);
      if (keys.length > 200) {
        keys.slice(0, keys.length - 200).forEach(k => delete cache[k]);
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {}
  }

  function stripHtml(s) {
    if (!s) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = String(s);
    return tmp.textContent || tmp.innerText || "";
  }

  function flatten(x) {
    if (x == null || x === "") return [];
    if (typeof x === "string") {
      const s = stripHtml(x).trim();
      return s ? [s] : [];
    }
    if (Array.isArray(x)) {
      const out = [];
      x.forEach(item => { flatten(item).forEach(s => out.push(s)); });
      return out;
    }
    return [];
  }

  /** Strip vowels/cantillation from a Hebrew word so the lexicon API can find it. */
  function stripNikud(w) {
    return String(w || "").replace(/[֑-ׇ]/g, "");
  }

  async function fetchText(ref) {
    if (!ref) return null;
    const cacheKey = "T:" + ref;
    if (cache[cacheKey]) return cache[cacheKey];
    try {
      const res = await fetch("/api/sefaria/" + encodeURIComponent(ref));
      if (!res.ok) return null;
      const data = await res.json();
      if (data.error) return null;
      const result = {
        ref: data.ref || ref,
        he: flatten(data.he),
        text: flatten(data.text),
        sectionRef: data.sectionRef || ref,
        next: data.next,
        prev: data.prev
      };
      cache[cacheKey] = result;
      saveCache();
      return result;
    } catch (e) {
      return null;
    }
  }

  async function fetchWord(rawWord) {
    const word = stripNikud(rawWord).replace(/[.,;:()\[\]"׳״־]/g, "").trim();
    if (!word) return null;
    const cacheKey = "W:" + word;
    if (cache[cacheKey]) return cache[cacheKey];
    try {
      const res = await fetch("/api/lexicon/" + encodeURIComponent(word));
      if (!res.ok) return null;
      const data = await res.json();
      const entries = Array.isArray(data) ? data : (data && Array.isArray(data.lexicon_entries) ? data.lexicon_entries : []);
      const cleaned = entries.slice(0, 3).map(e => ({
        headword: e.headword || e.headword_with_diacriticals || word,
        senses: collectSenses(e),
        source: (e.parent_lexicon_details && (e.parent_lexicon_details.name || e.parent_lexicon_details.text)) || e.parent_lexicon || ""
      })).filter(e => e.senses.length > 0);
      cache[cacheKey] = cleaned;
      saveCache();
      return cleaned;
    } catch (e) {
      return null;
    }
  }

  function collectSenses(entry) {
    const out = [];
    const walk = (node) => {
      if (!node) return;
      if (typeof node === "string") {
        const s = stripHtml(node).trim();
        if (s) out.push(s);
        return;
      }
      if (Array.isArray(node)) { node.forEach(walk); return; }
      if (typeof node === "object") {
        if (node.definition) walk(node.definition);
        if (node.senses) walk(node.senses);
        if (node.content && typeof node.content === "string") walk(node.content);
      }
    };
    walk(entry.content);
    walk(entry.senses);
    walk(entry.definition);
    // Dedupe + size
    const seen = new Set();
    return out.filter(s => {
      if (seen.has(s)) return false;
      seen.add(s);
      return s.length < 240;
    }).slice(0, 4);
  }

  global.SEFARIA = { fetchText, fetchWord, stripNikud };
})(window);
