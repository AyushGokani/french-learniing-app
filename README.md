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

The app now includes Vercel API routes for central user storage in Postgres.
Set `DATABASE_URL` in Vercel to store users, sessions, progress, activity
events, and test attempts in a shared database.

If `DATABASE_URL` is not configured, the frontend falls back to IndexedDB so the
demo can still run locally in one browser.

## Database setup

1. Create a Postgres database with Vercel Postgres, Neon, Supabase, or another
   hosted Postgres provider.
2. Add the database connection string as `DATABASE_URL` in Vercel project
   environment variables.
3. Deploy the app. The API creates the required tables automatically on first
   request. The schema is also available in `db/schema.sql`.

The database tracks:

- Users and salted password hashes
- Login sessions
- General activity/progress events
- TEF, TCF, and DELF test attempts, responses, model answers, and strategies

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
api/         # Vercel API routes for auth, progress, and test attempts
db/schema.sql # Postgres database schema
app.js       # Lessons, flashcards, quiz behavior, auth, and progress
tests.js     # Test-page data, drill rendering, and interactions
```
