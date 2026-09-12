import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../utils/translations';

const AppContext = createContext();

const DEFAULT_SNAPSHOT = {
  words: [
    { id: 1, word: 'Water', marathi: 'पाणी', hindi: 'पानी', pronunciation: 'वॉटर', type: 'noun' },
    { id: 2, word: 'Book', marathi: 'पुस्तक', hindi: 'किताब', pronunciation: 'बुक', type: 'noun' },
    { id: 3, word: 'Speak', marathi: 'बोलणे', hindi: 'बोलना', pronunciation: 'स्पीक', type: 'verb', v1: 'speak', v2: 'spoke', v3: 'spoken' },
    { id: 4, word: 'Happy', marathi: 'आनंदी', hindi: 'खुश', pronunciation: 'हॅपी', type: 'adjective' },
    { id: 5, word: 'Friend', marathi: 'मित्र / मैत्रीण', hindi: 'दोस्त', pronunciation: 'फ्रेंड', type: 'noun' }
  ],
  sentences: [
    { id: 1, english: 'I want water.', marathi: 'मला पाणी पाहिजे.', hindi: 'मुझे पानी चाहिए।' },
    { id: 2, english: 'Where are you going?', marathi: 'तुम्ही कुठे जात आहात?', hindi: 'आप कहाँ जा रहे हैं?' },
    { id: 3, english: 'I am learning English.', marathi: 'मी इंग्रजी शिकत आहे.', hindi: 'मैं अंग्रेजी सीख रहा हूँ।' }
  ],
  quiz: {
    id: 1,
    question_mr: '"पाणी" या शब्दासाठी योग्य English शब्द कोणता?',
    question_hi: '"पानी" के लिए सही English शब्द कौन सा है?',
    question_en: 'What is the English word for "Water"?',
    options: ['Water', 'Milk', 'Bread', 'Apple'],
    correctAnswer: 'Water',
    explanation_mr: 'Water म्हणजे पाणी.'
  }
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('mr');
  const [isOnboardingDone, setIsOnboardingDone] = useState(null); // null means loading
  const [userLevel, setUserLevel] = useState(1);
  const [streak, setStreak] = useState(3);
  const [todayMinutes, setTodayMinutes] = useState(3);
  const [soundSpeed, setSoundSpeed] = useState(0.9);
  const [todaySnapshot, setTodaySnapshot] = useState(DEFAULT_SNAPSHOT);
  const [completedTasks, setCompletedTasks] = useState({});

  // Load persistent state on launch
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('app_language');
        const storedOnboarding = await AsyncStorage.getItem('onboarding_done');
        const storedLevel = await AsyncStorage.getItem('user_level');
        const storedStreak = await AsyncStorage.getItem('daily_streak');
        const storedTasks = await AsyncStorage.getItem('completed_tasks');

        if (storedLang) setLanguage(storedLang);
        if (storedLevel) setUserLevel(parseInt(storedLevel, 10));
        if (storedStreak) setStreak(parseInt(storedStreak, 10));
        if (storedTasks) setCompletedTasks(JSON.parse(storedTasks));

        setIsOnboardingDone(storedOnboarding === 'true');
      } catch (err) {
        console.warn('Failed to load local state:', err);
        setIsOnboardingDone(false);
      }
    };
    loadState();
  }, []);

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    try {
      await AsyncStorage.setItem('app_language', newLang);
    } catch (e) {
      console.warn(e);
    }
  };

  const completeOnboarding = async (level = 1) => {
    setUserLevel(level);
    setIsOnboardingDone(true);
    try {
      await AsyncStorage.setItem('onboarding_done', 'true');
      await AsyncStorage.setItem('user_level', level.toString());
    } catch (e) {
      console.warn(e);
    }
  };

  const resetOnboarding = async () => {
    setIsOnboardingDone(false);
    try {
      await AsyncStorage.removeItem('onboarding_done');
    } catch (e) {
      console.warn(e);
    }
  };

  const incrementStreak = async () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    try {
      await AsyncStorage.setItem('daily_streak', newStreak.toString());
    } catch (e) {
      console.warn(e);
    }
  };

  const markTaskDone = async (taskKey) => {
    const updated = { ...completedTasks, [taskKey]: true };
    setCompletedTasks(updated);
    try {
      await AsyncStorage.setItem('completed_tasks', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const t = translations[language] || translations.mr;

  return (
    <AppContext.Provider
      value={{
        language,
        changeLanguage,
        isOnboardingDone,
        completeOnboarding,
        resetOnboarding,
        userLevel,
        setUserLevel,
        streak,
        incrementStreak,
        todayMinutes,
        soundSpeed,
        setSoundSpeed,
        todaySnapshot,
        completedTasks,
        markTaskDone,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
