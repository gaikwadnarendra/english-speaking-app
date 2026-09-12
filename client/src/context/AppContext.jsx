import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { translations } from '../utils/translations';
import { fetchProgress, fetchDueSRS, incrementDailyStreak, updateUserSettings } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('app_lang') || 'mr');
  const [streak, setStreak] = useState(3);
  const [progress, setProgress] = useState({
    wordsLearned: 45,
    sentencesPracticed: 28,
    speakingCompleted: 12,
    lessonsFinished: 5,
    quizScoreAvg: 88,
    targetDailyMinutes: 5,
    todayMinutes: 4,
    reminderTime: '08:00 PM'
  });
  const [dueSRSList, setDueSRSList] = useState([]);
  const [soundSpeed, setSoundSpeed] = useState(0.9);
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    return localStorage.getItem('onboarding_done') === 'true';
  });

  const t = translations[language] || translations.mr;

  const loadData = async () => {
    try {
      const progRes = await fetchProgress();
      if (progRes.data?.data) {
        setProgress(progRes.data.data);
        if (progRes.data.data.streak !== undefined) {
          setStreak(progRes.data.data.streak);
        }
      }

      const srsRes = await fetchDueSRS();
      if (srsRes.data?.data) {
        setDueSRSList(srsRes.data.data);
      }
    } catch (err) {
      console.warn('API sync warning; using local state:', err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('app_lang', newLang);
    updateUserSettings({ uiLanguage: newLang }).catch(() => {});
  };

  const triggerStreakReward = async () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const res = await incrementDailyStreak();
      if (res.data?.streak) {
        setStreak(res.data.streak);
      } else {
        setStreak(prev => prev + 1);
      }
    } catch {
      setStreak(prev => prev + 1);
    }
  };

  const completeOnboarding = (level) => {
    setOnboardingCompleted(true);
    localStorage.setItem('onboarding_done', 'true');
    localStorage.setItem('user_level', level);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        streak,
        progress,
        setProgress,
        dueSRSList,
        setDueSRSList,
        soundSpeed,
        setSoundSpeed,
        triggerStreakReward,
        onboardingCompleted,
        completeOnboarding,
        refreshData: loadData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
