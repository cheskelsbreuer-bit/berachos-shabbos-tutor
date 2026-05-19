/* Tiny i18n — English + Yiddish UI labels. */
(function (global) {
  const STRINGS = {
    en: {
      pick_type: "What do you want to learn?",
      t_gemara: "Gemara", t_chumash: "Chumash", t_tanya: "Tanya", t_mishnayos: "Mishnayos",
      back: "← Back",
      loading: "Loading authoritative text from Sefaria…",
      tap_hint: "👆 Tap any Hebrew word for a real dictionary translation",
      previous: "← Previous",
      next: "Next →",
      feedback: "Feedback",
      send: "Send",
      pick_masechta: "Pick a masechta",
      pick_sefer: "Pick a sefer",
      pick_perek: "Pick a perek",
      pick_daf: "Pick a daf",
      pick_chapter: "Pick a chapter",
      no_definition: "No dictionary entry found for this word.",
      feedback_sent: "Thanks — opens your email app.",
      feedback_empty: "Type a message first."
    },
    yi: {
      pick_type: "וואָס ווילט איר לערנען?",
      t_gemara: "גמרא", t_chumash: "חומש", t_tanya: "תניא", t_mishnayos: "משניות",
      back: "← צוריק",
      loading: "לאָדן אמתע טעקסט פֿון ספֿאריא…",
      tap_hint: "👆 טאַפּט אַ העברעאיש וואָרט פֿאַר אַן ערקלערונג",
      previous: "← פֿריִער",
      next: "ווײַטער →",
      feedback: "פֿידבעק",
      send: "שיק",
      pick_masechta: "קלייבט אַ מסכת",
      pick_sefer: "קלייבט אַ ספֿר",
      pick_perek: "קלייבט אַ פּרק",
      pick_daf: "קלייבט אַ דף",
      pick_chapter: "קלייבט אַ קאַפּיטל",
      no_definition: "ניטאָ אַ ווערטערבוך־פּירוש פֿאַר דעם וואָרט.",
      feedback_sent: "אַ דאַנק — עפֿנט אייער אימעיל אַפּ.",
      feedback_empty: "שרײַבט אַ מעלדונג ערשט."
    }
  };

  const I18N = {
    current: "en",
    t(k) { return (STRINGS[this.current] && STRINGS[this.current][k]) || STRINGS.en[k] || k; },
    set(lang) {
      if (!STRINGS[lang]) return;
      this.current = lang;
      document.body.setAttribute("data-lang", lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "yi" ? "rtl" : "ltr";
      document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = this.t(el.getAttribute("data-i18n"));
      });
      try { localStorage.setItem("ui_lang", lang); } catch (e) {}
    }
  };

  global.I18N = I18N;
})(window);
