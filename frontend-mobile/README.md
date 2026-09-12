# English शिका (Marathi ➔ English Mobile Learning App)
**React Native (Expo SDK 51) Android Mobile Application**

A lightweight, high-performance, offline-ready Android app built for native Marathi and Hindi speakers learning English. Specially optimized for budget Android devices with zero web DOM dependencies, minimal re-renders, and pure `StyleSheet` tokens.

---

## 📱 Features Overview

1. **Trilingual Support (मराठी, हिंदी, English)**: Instant language switcher in header and settings.
2. **Onboarding Experience**: Step-by-step interactive proficiency level and language selector.
3. **5-Level Master Curriculum (`LearnScreen`)**:
   - 20 comprehensive lessons covering Phonics, Greetings, Daily Routine, Tenses, Public Speaking, and Job Interviews.
   - Interactive 5-tab viewer: Vocabulary with Phonetics, 3D Flip Flashcards, Live Dialogue roleplay with "Play All", Grammar & Pro Tips, and Lesson Mastery Quizzes.
4. **Vocabulary & Verbs Library (`VocabScreen`)**:
   - 0ms instant multi-field search and category filters.
   - 3D Flashcards with Leitner review mode.
   - Verb Forms Table & Cards (Base V1, Past V2, Past Participle V3, Continuous V-ing) with audio on every form.
   - ⚡ Irregular Verb Forms Quiz Drill.
5. **Practice & Quiz Hub (`PracticeScreen`)**:
   - Multiple-Choice Quizzes with instant color-coded feedback and explanations.
   - Match the Pairs 2-column game board.
   - Sentence Construction Builder (scrambled words to assembled sentence).
6. **AI Speaking & Pronunciation (`SpeakingScreen`)**:
   - Live AI Conversation Partner powered by Gemini API across 6 scenarios (Daily Chat, Job Interview, Shopping, Restaurant, Travel, Doctor).
   - Real-time Grammar Feedback & suggested response starters.
   - Listen & Repeat Pronunciation Drill with scoring and star rewards.
7. **Daily Challenge (`DailyScreen`)**:
   - 4-item daily checklist with streak protection and +100 XP rewards.
8. **Saved Favorites (`FavoritesScreen`)**:
   - Bookmarked vocabulary with in-app search, audio playback, and unbookmarking.
9. **Learning Progress (`ProgressScreen`)**:
   - Words Mastered, Lessons Completed, Quizzes Solved, AI Speaking Sessions, and 5-Level Milestone Roadmap.
10. **Settings (`SettingsScreen`)**:
    - App Language, Proficiency Level, TTS Pronunciation Speed (0.75x–1.0x), Notification reminders, and Data Reset.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd frontend-mobile
npm install
```

### 2. Start Expo Development Server
```bash
npx expo start
```

### 3. Run on Device / Emulator
- **Physical Android Device**: Install the **Expo Go** app from Google Play Store, open your phone camera or Expo Go, and scan the QR code displayed in the terminal.
- **Android Emulator**: Press `a` in the terminal to launch on your connected Android Virtual Device.

---

## 📦 How to Build Standalone APK for Android

You can generate a direct, installable `.apk` file using **Expo Application Services (EAS Build)** in cloud without needing heavy local Android SDKs, or locally.

### Cloud Build (Recommended & Easiest):

1. **Install EAS CLI globally** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Build the Standalone APK**:
   ```bash
   eas build -p android --profile preview
   ```
   *This will compile your project in the cloud and provide a direct download link to your `.apk` file that you can install on any Android phone.*

4. **Build Production AAB (for Google Play Store)**:
   ```bash
   eas build -p android --profile production
   ```

---

## 📂 Project Architecture

```
frontend-mobile/
├── App.js                     # Root Providers (SafeArea + AppProvider + AppNavigator)
├── app.json                   # Expo / Android package & permission configuration
├── eas.json                   # Standalone APK and AAB build profiles
├── package.json               # Dependencies (Expo 51, React Navigation, Lucide, Expo Speech)
├── index.js                   # Application entry point
└── src/
    ├── config/
    │   └── api.js             # Axios client with Render backend endpoint & JWT interceptors
    ├── constants/
    │   └── theme.js           # Lightweight Design Tokens: COLORS, SPACING, RADIUS, SHADOWS
    ├── context/
    │   └── AppContext.js      # Global state & AsyncStorage persistence
    ├── data/
    │   ├── lessonsData.js     # 20 Bundled 5-Level lessons with dialogues & quizzes
    │   ├── vocabData.js       # Master offline dictionary + V1-V2-V3 Verbs
    │   ├── practiceData.js    # MCQs, Match Pairs sets & Sentence construction puzzles
    │   └── speakingData.js    # AI conversation scenarios & pronunciation sentences
    ├── utils/
    │   └── translations.js    # Trilingual dictionaries (Marathi, Hindi, English)
    ├── components/
    │   ├── AudioButton.js     # Native TTS pronunciation button with visual feedback
    │   └── Header.js          # App header with Streak, Level, Favorites, and Language switcher
    ├── screens/
    │   ├── OnboardingScreen.js # 3-step interactive onboarding flow
    │   ├── HomeScreen.js      # Daily greeting, 5 words snapshot, sentences & CTA
    │   ├── LearnScreen.js     # 5-Level grammar lessons browser & 5-tab viewer modal
    │   ├── VocabScreen.js     # Vocabulary library + Verbs forms table & quiz drill
    │   ├── PracticeScreen.js  # MCQ Quizzes, Match Pairs & Sentence Builder
    │   ├── SpeakingScreen.js  # Gemini AI Conversation & Pronunciation drill
    │   ├── DailyScreen.js     # Daily challenge tracker
    │   ├── FavoritesScreen.js # Saved bookmarks manager
    │   ├── ProgressScreen.js  # Learning analytics & roadmap
    │   └── SettingsScreen.js  # Language, TTS speed & preferences
    └── navigation/
        └── AppNavigator.js    # React Navigation Stack & Bottom Tab Navigator
```

---

## 🔒 Offline Capability & Performance Notes
- All core curriculum lessons, vocabulary items, verb forms, and quizzes are **bundled locally** inside `src/data/`, allowing seamless offline learning on budget devices.
- Network API calls to Render backend are non-blocking and automatically cache user progress locally via `@react-native-async-storage/async-storage`.
