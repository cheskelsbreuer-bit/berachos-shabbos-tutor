/* audio.js — Web Audio API tone generator, no external files */
(function (global) {
  let ctx = null;
  function getCtx() {
    if (ctx) return ctx;
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    } catch (e) { ctx = null; }
    return ctx;
  }

  function tone(freq, duration, type, gain) {
    const c = getCtx();
    if (!c) return;
    if (!SETTINGS.get("soundEffects")) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(gain || 0.15, c.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  }

  function sequence(notes) {
    if (!SETTINGS.get("soundEffects")) return;
    let delay = 0;
    notes.forEach((n) => {
      setTimeout(() => tone(n.f, n.d, n.t || "sine", n.g), delay);
      delay += (n.delay || (n.d * 800));
    });
  }

  const AUDIO = {
    play(name) {
      switch (name) {
        case "correct":
          sequence([
            { f: 660, d: 0.12 },
            { f: 880, d: 0.18 }
          ]);
          break;
        case "wrong":
          sequence([
            { f: 330, d: 0.18 },
            { f: 220, d: 0.22 }
          ]);
          break;
        case "levelup":
          sequence([
            { f: 523, d: 0.12 },
            { f: 659, d: 0.12 },
            { f: 784, d: 0.18 },
            { f: 1047, d: 0.22 }
          ]);
          break;
        case "streak":
          sequence([
            { f: 784, d: 0.1 },
            { f: 988, d: 0.1 },
            { f: 1175, d: 0.18 }
          ]);
          break;
        case "click":
          tone(440, 0.05, "square", 0.07);
          break;
        case "sticker":
          sequence([
            { f: 1047, d: 0.1 },
            { f: 1319, d: 0.15 }
          ]);
          break;
      }
    }
  };

  global.AUDIO = AUDIO;
})(window);
