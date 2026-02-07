# ✦ FITTY GYAL ✦

A personal fitness tracker for managing gym workouts and running plans — built with React + Vite and backed by Firebase.

## What It Does

- **Workouts** — Plan your weekly gym sessions (exercises, sets, reps, weight), log completed workouts, and track progress over time
- **Running** — Set up a weekly run plan with structured segments (intervals, tempo, easy runs), log your runs with pace/heart rate/distance, and compare week over week
- **Multiple Plans** — Create, duplicate, and switch between different workout programs
- **History & Insights** — Volume tracking, weekly comparisons, and progress graphs

---

## Getting Started (from scratch)

Follow these steps the first time you set up the project on a new machine — or if you come back to it after a while and need a refresher.

### 1. Prerequisites

You need two things installed on your computer:

- **Node.js** (v18 or newer) — download from [nodejs.org](https://nodejs.org/)
- **pnpm** (the package manager this project uses) — after installing Node, run:
  ```bash
  npm install -g pnpm
  ```

To check they're installed, run these in your terminal — each should print a version number:

```bash
node -v
pnpm -v
```

### 2. Install dependencies

Open a terminal in the project folder and run:

```bash
pnpm install
```

This downloads all the libraries the app needs into a `node_modules` folder. You only need to do this once (or again if `package.json` changes).

### 3. Set up environment variables

The app connects to Firebase (the database / auth backend). The connection details live in a **`.env`** file that is **not** committed to git — so you need to create it yourself.

There's a template file called **`.env.example`** in the project root. Copy it to `.env`:

```bash
cp .env.example .env
```

Then open the new `.env` file and replace the placeholder values with your real Firebase credentials. You can find them at:

> [Firebase Console](https://console.firebase.google.com) → select **fitty-gyal** project → **Project Settings** (gear icon) → scroll down to **Your apps** → **Web app** → the `firebaseConfig` object has all the values you need.

The mapping is:

| `.env` variable | Firebase config key |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `measurementId` |

> **Important:** The `.env` file contains your private keys. It is listed in `.gitignore` so it will **never** be pushed to GitHub. Don't share it or commit it.

### 4. Start the app

```bash
pnpm dev
```

The app will be available at **http://localhost:5173**. Open that URL in your browser.

To stop the server, press `Ctrl + C` in the terminal.

---

## Everyday Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start the local dev server (what you'll use most) |
| `pnpm build` | Build a production-ready version into the `dist/` folder |
| `pnpm preview` | Preview the production build locally |

---

## Project Structure (quick reference)

```
project-fittygyal/
├── public/            # Static files (favicons, manifest)
├── src/
│   ├── components/    # UI components (pages, buttons, etc.)
│   ├── contexts/      # React contexts (auth state, etc.)
│   ├── data/          # Default data (workouts, affirmations)
│   ├── hooks/         # Custom React hooks (data fetching logic)
│   ├── firebase.js    # Firebase connection setup (reads from .env)
│   ├── App.jsx        # Main app component
│   ├── App.css        # App styles
│   ├── main.jsx       # Entry point
│   └── index.css      # Global styles
├── .env               # Your private Firebase keys (NOT committed)
├── .env.example       # Template showing which keys you need
├── .gitignore         # Files git should ignore
├── index.html         # HTML shell
├── package.json       # Project metadata and dependencies
├── pnpm-lock.yaml     # Locked dependency versions
└── vite.config.js     # Vite build configuration
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `command not found: pnpm` | Run `npm install -g pnpm` to install it |
| `command not found: node` | Install Node.js from [nodejs.org](https://nodejs.org/) |
| App loads but nothing works / blank screen | Make sure your `.env` file exists and has the correct Firebase values |
| `pnpm install` fails | Try deleting `node_modules` and `pnpm-lock.yaml`, then run `pnpm install` again |
| Port 5173 already in use | Another dev server is running — stop it first, or Vite will pick the next port automatically |
