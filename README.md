# Learning Tutor

A bilingual (English + Yiddish) full-stack learning tutor web app with three learning modes (Game, Flashcard, Story), a diagnostic quiz, daily streak tracking, and accessibility controls. Built with Flask + vanilla HTML/CSS/JS.

## Setup

1. Install Python 3.9+ and pip.
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the server:
   ```
   python app.py
   ```
4. Open http://localhost:5000 in your browser.

## How to add content

All learning content lives in `data/content.json`. Replace the placeholder strings (e.g. `[CONTENT PLACEHOLDER]`, `[YIDDISH ...]`) with real text. Each section needs:

- `text` / `text_yiddish` — body paragraph shown in Story mode
- `term` / `term_yiddish` — flashcard front (a key term)
- `definition` / `definition_yiddish` — flashcard back
- `question` / `question_yiddish` — multiple-choice question shown in Game mode and after each Story section
- `answers` — an array of three answer objects; mark exactly one with `"correct": true`
- `explanation` / `explanation_yiddish` — shown when the learner answers wrong

## How to add more pages

Duplicate an existing entry inside the `pages` array in `data/content.json`. Give the new page a unique `id` (e.g. `"page2"`) and add as many sections as you like (each section needs a unique `id` inside that page).

## Folder structure

```
learning-tutor/
├── app.py                # Flask server (serves index + /api/content)
├── requirements.txt
├── data/
│   └── content.json      # All learning content lives here
├── templates/
│   └── index.html        # Single-page app shell
└── static/
    ├── css/style.css     # Theme + per-age-group styling
    ├── js/
    │   ├── main.js        # Routing, init, app glue
    │   ├── i18n.js        # English + Yiddish UI strings
    │   ├── onboarding.js  # Diagnostic quiz + mode recommendation
    │   ├── streak.js      # Daily streak logic
    │   ├── progress.js    # localStorage save/load
    │   ├── accessibility.js # Font size, contrast, audio panel
    │   └── modes/
    │       ├── game.js      # Multiple-choice quiz mode
    │       ├── flashcard.js # Spaced repetition flashcards
    │       └── story.js     # Chapter-card narrative mode
    └── assets/            # (empty — place images/audio here if needed)
```

## App flow

Language → Age Group → Challenges → (Diagnostic Quiz, if "I don't know") → Mode Selection → Learn → Streak update → Save to localStorage.

A returning user is greeted with a "Welcome back" screen showing their current streak. They can resume or start fresh.

## Notes

- All user state (language, age, challenges, streak, per-page progress, badges, accessibility settings) is stored in `localStorage`. No database needed.
- Yiddish UI is rendered RTL automatically.
- The floating ♿ button (bottom right) opens the accessibility panel (font size, contrast, audio toggle).
- Audio uses the Web Speech API where available; it silently falls back otherwise.
- Flashcard mode uses a simple SRS: Easy = 4 days, Medium = 2 days, Hard = 1 day before the card returns.
