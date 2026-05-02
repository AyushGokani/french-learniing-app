# Bonjour Buddy

A beginner-friendly French learning web app with guided lessons, vocabulary
flashcards, quick quizzes, TEF/TCF/DELF exam practice, speech practice,
lightweight progress tracking, and demo account storage.

## Features

- Short lessons for greetings, polite basics, and cafe phrases
- Flashcards for essential beginner vocabulary
- Browser speech synthesis for French pronunciation practice
- Multiple-choice quiz with instant feedback
- Dedicated TEF, TCF, and DELF tests page with login-gated skill drills
- Writing, speaking, reading, listening, and language-structure practice prompts
- Local progress tracking toward a daily activity goal
- Login and sign-up forms for learner profiles
- Browser database storage with IndexedDB for users and per-user progress
- Test modules, model answers, and exam progress require login or sign-up
- Responsive layout for desktop and mobile screens

## Account storage

The deployed static app stores user accounts in IndexedDB, the browser's
built-in database. Accounts are saved on the device/browser where they are
created, with salted SHA-256 password hashes rather than plain-text passwords.

For shared accounts across devices, add a server-backed database and API such as
Supabase, Firebase, Neon, or Vercel Postgres.

## Run locally

No build step or external dependencies are required.

1. Open `index.html` in a browser, or
2. Serve the folder with any static server:

   ```bash
   python3 -m http.server 8000
   ```

Then visit `http://localhost:8000`.

## Project structure

```text
index.html   # Main app markup and account sections
tests.html   # Dedicated TEF, TCF, and DELF test prep page
styles.css   # Responsive visual design
app.js       # Lessons, flashcards, quiz behavior, auth, and progress
tests.js     # Test-page data, drill rendering, and interactions
```
