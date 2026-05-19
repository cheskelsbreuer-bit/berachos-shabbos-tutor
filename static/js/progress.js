/* progress.js — localStorage progress save/load (expanded) */
(function (global) {
  const KEY = "lt_progress";

  const defaultState = () => ({
    language: null,
    ageGroup: null,
    challenges: [],
    preferredMode: null,
    currentSugyaId: null,
    streak: { current: 0, lastVisit: null, longest: 0 },
    progress: {},
    badges: [],
    // V2 additions
    xp: 0,
    level: 1,
    dailyProgress: { date: "", count: 0 },
    weeklyActivity: {},
    bookmarks: [],
    notes: {},
    mistakes: {},
    stickers: [],
    smartReviewQueue: [],
    chazaraHistory: []
  });

  const PROGRESS = {
    state: defaultState(),

    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const fresh = defaultState();
          // shallow-merge top level, preserve nested objects
          this.state = { ...fresh, ...parsed };
          this.state.streak = { ...fresh.streak, ...(parsed.streak || {}) };
          this.state.progress = parsed.progress || {};
          this.state.badges = parsed.badges || [];
          this.state.challenges = parsed.challenges || [];
          this.state.bookmarks = parsed.bookmarks || [];
          this.state.notes = parsed.notes || {};
          this.state.mistakes = parsed.mistakes || {};
          this.state.stickers = parsed.stickers || [];
          this.state.weeklyActivity = parsed.weeklyActivity || {};
          this.state.dailyProgress = parsed.dailyProgress || { date: "", count: 0 };
          this.state.xp = parsed.xp || 0;
          this.state.level = parsed.level || 1;
        }
      } catch (e) {
        this.state = defaultState();
      }
      return this.state;
    },

    save() {
      try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (e) { /* ignore */ }
    },

    reset() {
      this.state = defaultState();
      this.save();
    },

    setLanguage(lang) { this.state.language = lang; this.save(); },
    setAgeGroup(g)    { this.state.ageGroup = g; this.save(); },
    setChallenges(c)  { this.state.challenges = c; this.save(); },
    setPreferredMode(m) { this.state.preferredMode = m; this.save(); },

    ensurePage(pageId) {
      if (!this.state.progress[pageId]) {
        this.state.progress[pageId] = {
          game: { score: 0, completed: false, highScore: 0 },
          flashcard: { cards: {} },
          story: { currentSection: 0, completed: false }
        };
      }
      const p = this.state.progress[pageId];
      if (!p.game.highScore) p.game.highScore = 0;
      return p;
    },

    setGameProgress(pageId, score, completed) {
      const p = this.ensurePage(pageId);
      p.game.score = score;
      p.game.completed = completed;
      if (score > (p.game.highScore || 0)) p.game.highScore = score;
      this.save();
    },

    setFlashcardProgress(pageId, sectionId, info) {
      const p = this.ensurePage(pageId);
      if (!p.flashcard.cards) p.flashcard.cards = {};
      const prev = p.flashcard.cards[sectionId] || { seen: 0, difficulty: "medium" };
      p.flashcard.cards[sectionId] = {
        seen: (prev.seen || 0) + (info.seen || 0),
        difficulty: info.difficulty || prev.difficulty,
        nextReview: info.nextReview || prev.nextReview
      };
      this.save();
    },

    getFlashcardCard(pageId, sectionId) {
      const p = this.ensurePage(pageId);
      return p.flashcard.cards[sectionId];
    },

    setStoryProgress(pageId, currentSection, completed) {
      const p = this.ensurePage(pageId);
      p.story.currentSection = currentSection;
      p.story.completed = completed;
      this.save();
    },

    addBadge(name) {
      if (!this.state.badges.includes(name)) {
        this.state.badges.push(name);
        this.save();
      }
    },

    hasOnboarded() {
      return !!(this.state.language && this.state.ageGroup && this.state.preferredMode);
    },

    // ============ V2 helpers ============

    addMistake(sugyaId, sectionId) {
      if (!this.state.mistakes[sugyaId]) this.state.mistakes[sugyaId] = {};
      const m = this.state.mistakes[sugyaId][sectionId] || { count: 0 };
      m.count = (m.count || 0) + 1;
      m.lastWrong = new Date().toISOString();
      this.state.mistakes[sugyaId][sectionId] = m;
      this.save();
    },

    clearMistake(sugyaId, sectionId) {
      if (this.state.mistakes[sugyaId]) {
        delete this.state.mistakes[sugyaId][sectionId];
        if (Object.keys(this.state.mistakes[sugyaId]).length === 0) {
          delete this.state.mistakes[sugyaId];
        }
        this.save();
      }
    },

    toggleBookmark(sugyaId) {
      const idx = this.state.bookmarks.indexOf(sugyaId);
      if (idx >= 0) this.state.bookmarks.splice(idx, 1);
      else this.state.bookmarks.push(sugyaId);
      this.save();
      return idx < 0;
    },

    isBookmarked(sugyaId) {
      return this.state.bookmarks.includes(sugyaId);
    },

    saveNote(sugyaId, sectionId, text) {
      if (!text || !text.trim()) {
        if (this.state.notes[sugyaId]) {
          delete this.state.notes[sugyaId][sectionId];
          if (Object.keys(this.state.notes[sugyaId]).length === 0) delete this.state.notes[sugyaId];
        }
      } else {
        if (!this.state.notes[sugyaId]) this.state.notes[sugyaId] = {};
        this.state.notes[sugyaId][sectionId] = text;
      }
      this.save();
    },

    getNote(sugyaId, sectionId) {
      return (this.state.notes[sugyaId] && this.state.notes[sugyaId][sectionId]) || "";
    },

    addSticker(sugyaId) {
      if (!this.state.stickers.includes(sugyaId)) {
        this.state.stickers.push(sugyaId);
        this.save();
      }
    },

    completionStatus(sugyaId) {
      const p = this.state.progress[sugyaId];
      if (!p) return "none";
      const gameDone = p.game && p.game.completed;
      const storyDone = p.story && p.story.completed;
      const flashDone = p.flashcard && p.flashcard.cards && Object.keys(p.flashcard.cards).length > 0;
      const doneCount = (gameDone ? 1 : 0) + (storyDone ? 1 : 0) + (flashDone ? 1 : 0);
      if (doneCount >= 2) return "complete";
      if (doneCount >= 1) return "started";
      return "none";
    }
  };

  global.PROGRESS = PROGRESS;
})(window);
