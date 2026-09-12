# 📚 Marathi → English Learning App (English शिका)

> **"English शिकण्यासाठी आधी English येणे गरजेचे नाही!"**
> A completely free, beginner-friendly Marathi-first English learning platform built with **React, Node.js, Express, and MySQL**.

---

## 🌟 Key Features (v2.0 Specification Compliance)

1. **Modular Reusable Architecture**:
   - Centralized layout with **Header**, **Sidebar**, **Footer**, and **MainLayout**.
   - Decoupled UI components (`WordCard`, `AudioButton`, `VoiceRecorder`, `QuizCard`, `StatCard`, `MatchPairs`).
   - Clean Express REST API routes (`/api/vocab`, `/api/verbs`, `/api/lessons`, `/api/practice`, `/api/srs`, `/api/progress`).
2. **Trilingual System**:
   - English + Marathi + Hindi + Devanagari Phonetic Pronunciation on every card and sentence.
   - UI chrome language toggle (मराठी / हिंदी / English).
3. **Spaced Repetition System (SRS)**:
   - Leitner 4-box retention system: `New` → `Learning (1d)` → `Reviewing (3d)` → `Mastered (7d)`.
   - Wrong answers automatically tag into **Difficult Words** and trigger scheduled reviews on the Home Screen.
4. **Speaking Practice (Listen & Repeat + Record & Compare)**:
   - Speech Recognition live accuracy scoring.
   - Offline voice recording with side-by-side playback comparison with model pronunciation and self-rating.
5. **Verb Library (V1, V2, V3, V-ing)**:
   - Dedicated table and card views with practical real-life sentence usage.
6. **Progress & Habit Retention**:
   - Streak tracking with glowing flame indicator.
   - 1-click **Share to WhatsApp Status** milestone card with celebration confetti.
   - Daily habit reminder and target configuration.
7. **MySQL & Offline Resilient Storage**:
   - MySQL database connection pooling with automatic schema initialization and seeding.
   - Resilient in-memory fallback for instant zero-config startup.

---

## 🚀 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- MySQL Server (optional for persistent database storage; the app also has automatic fallback)

### Step 1: Install Dependencies
In the project root directory:
```bash
# Install root, backend, and frontend packages
npm install
npm install --prefix server
npm install --prefix client
```

### Step 2: Configure MySQL (Optional)
Create `server/.env` (or use defaults in `.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=marathi_english_db
```

### Step 3: Run the Full-Stack Application
Start the backend server and frontend client concurrently:
```bash
# Start backend on http://localhost:5000
npm run server

# Start frontend on http://localhost:5173
npm run client
```

Or run both together:
```bash
npm run dev
```

---

## 📁 Project Directory Structure

```
English Speaking App/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # WordCard, AudioButton, StatCard
│   │   │   ├── layout/         # Header, Sidebar, Footer, MainLayout
│   │   │   ├── practice/       # QuizCard, MatchPairs
│   │   │   └── speaking/       # VoiceRecorder, Comparison
│   │   ├── context/            # AppContext (Language, Streak, Progress)
│   │   ├── pages/              # Home, Learn, Vocab, Verbs, Practice, Speaking,
│   │   │                       # DailyChallenge, Favorites, Progress, Settings, Onboarding
│   │   ├── routes/             # AppRoutes.jsx
│   │   ├── services/           # api.js (Axios API Client)
│   │   ├── utils/              # ttsHelper.js, translations.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js (MySQL pool & auto-migrations)
│   ├── controllers/            # vocab, verb, lesson, practice, srs, progress
│   ├── data/                   # seedData.js (Trilingual dataset)
│   ├── routes/                 # Express API routes
│   ├── index.js                # Server entry point
│   └── package.json
├── package.json                # Root package runner
└── README.md
```
