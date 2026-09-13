import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProgressContext = createContext();

export const LEVELS = [
  {
    id: 1,
    name: 'Beginner',
    nameMr: 'प्रारंभिक (Level 1)',
    nameHi: 'शुरुआती (Level 1)',
    color: '#22c55e',
    tasks: [
      { key: 'learn_l1', label: 'Complete Lesson (Level 1)', labelMr: 'धडा पूर्ण करा (स्तर १)', labelHi: 'पाठ पूरा करें (स्तर १)', screen: 'Learn', icon: 'book-open' },
      { key: 'vocab_l1', label: 'Study 10 Vocabulary Words', labelMr: '10 शब्द शिका', labelHi: '10 शब्द सीखें', screen: 'Vocab', icon: 'file-text' },
      { key: 'practice_mcq', label: 'Complete an MCQ Quiz', labelMr: 'MCQ प्रश्नमंजुषा पूर्ण करा', labelHi: 'MCQ प्रश्नोत्तरी पूरा करें', screen: 'Practice', icon: 'target' },
    ],
  },
  {
    id: 2,
    name: 'Elementary',
    nameMr: 'प्राथमिक (Level 2)',
    nameHi: 'प्रारंभिक (Level 2)',
    color: '#3b82f6',
    tasks: [
      { key: 'learn_l2', label: 'Complete Lesson (Level 2)', labelMr: 'धडा पूर्ण करा (स्तर २)', labelHi: 'पाठ पूरा करें (स्तर २)', screen: 'Learn', icon: 'book-open' },
      { key: 'verbs_basic', label: 'Study Basic Verbs', labelMr: 'मूलभूत क्रियापदे शिका', labelHi: 'बुनियादी क्रियाएं सीखें', screen: 'Practice', icon: 'zap' },
      { key: 'speaking_5', label: 'Practice Speaking (5 sentences)', labelMr: '5 वाक्ये बोलण्याचा सराव करा', labelHi: '5 वाक्य बोलने का अभ्यास करें', screen: 'Speaking', icon: 'mic' },
    ],
  },
  {
    id: 3,
    name: 'Intermediate',
    nameMr: 'मध्यम (Level 3)',
    nameHi: 'मध्यवर्ती (Level 3)',
    color: '#f59e0b',
    tasks: [
      { key: 'learn_l3', label: 'Complete Lesson (Level 3)', labelMr: 'धडा पूर्ण करा (स्तर ३)', labelHi: 'पाठ पूरा करें (स्तर ३)', screen: 'Learn', icon: 'book-open' },
      { key: 'vocab_advanced', label: 'Study Advanced Vocabulary', labelMr: 'प्रगत शब्दसंग्रह शिका', labelHi: 'उन्नत शब्दावली सीखें', screen: 'Vocab', icon: 'file-text' },
      { key: 'verbs_quiz', label: 'Complete Verb Quiz', labelMr: 'क्रियापद क्विझ पूर्ण करा', labelHi: 'क्रिया क्विज़ पूरा करें', screen: 'Practice', icon: 'zap' },
      { key: 'practice_builder', label: 'Sentence Builder Session', labelMr: 'वाक्य निर्माण सत्र', labelHi: 'वाक्य निर्माण सत्र', screen: 'Practice', icon: 'layers' },
    ],
  },
  {
    id: 4,
    name: 'Upper-Intermediate',
    nameMr: 'उच्च-मध्यम (Level 4)',
    nameHi: 'उच्च-मध्यवर्ती (Level 4)',
    color: '#8b5cf6',
    tasks: [
      { key: 'daily_streak', label: 'Complete Daily Challenge', labelMr: 'दैनिक आव्हान पूर्ण करा', labelHi: 'दैनिक चुनौती पूरी करें', screen: 'Daily', icon: 'flame' },
      { key: 'speaking_15', label: 'Practice Speaking (15 sentences)', labelMr: '15 वाक्ये बोलण्याचा सराव करा', labelHi: '15 वाक्य बोलने का अभ्यास करें', screen: 'Speaking', icon: 'mic' },
      { key: 'practice_speed', label: 'Complete Speed Drill Quiz', labelMr: 'वेग-कसोटी क्विझ पूर्ण करा', labelHi: 'स्पीड ड्रिल क्विज़ पूरा करें', screen: 'Practice', icon: 'zap' },
    ],
  },
  {
    id: 5,
    name: 'Advanced',
    nameMr: 'प्रगत (Level 5)',
    nameHi: 'उन्नत (Level 5)',
    color: '#ef4444',
    tasks: [
      { key: 'vocab_master', label: 'Master 50+ Vocabulary Words', labelMr: '50+ शब्द पूर्ण करा', labelHi: '50+ शब्दों में महारत हासिल करें', screen: 'Vocab', icon: 'award' },
      { key: 'practice_master', label: 'Complete All Practice Modes', labelMr: 'सर्व सराव प्रकार पूर्ण करा', labelHi: 'सभी अभ्यास मोड पूरे करें', screen: 'Practice', icon: 'trophy' },
      { key: 'speaking_ai', label: 'Full AI Conversation Session', labelMr: 'पूर्ण AI संवाद सत्र', labelHi: 'पूर्ण AI बातचीत सत्र', screen: 'Speaking', icon: 'bot' },
    ],
  },
];

export const ProgressProvider = ({ children }) => {
  const [levelProgress, setLevelProgress] = useState({});
  const [completionModal, setCompletionModal] = useState(null); // { levelId, levelName, levelNameMr }

  useEffect(() => {
    const loadLevelProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem('level_progress');
        if (stored) {
          setLevelProgress(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Failed to load level progress:', err);
      }
    };
    loadLevelProgress();
  }, []);

  const isTaskCompleted = useCallback((levelId, taskKey) => {
    return Boolean(levelProgress[`${levelId}_${taskKey}`]);
  }, [levelProgress]);

  const isLevelComplete = useCallback((levelId) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return false;
    return level.tasks.every(task => Boolean(levelProgress[`${levelId}_${task.key}`]));
  }, [levelProgress]);

  const isLevelUnlocked = useCallback((levelId) => {
    if (levelId === 1) return true;
    return isLevelComplete(levelId - 1);
  }, [isLevelComplete]);

  const currentLevel = LEVELS.find(l => isLevelUnlocked(l.id) && !isLevelComplete(l.id))?.id || 5;

  const completeTask = useCallback(async (levelId, taskKey) => {
    const progressKey = `${levelId}_${taskKey}`;
    if (levelProgress[progressKey]) return; // already done

    const updated = { ...levelProgress, [progressKey]: true };
    setLevelProgress(updated);
    try {
      await AsyncStorage.setItem('level_progress', JSON.stringify(updated));
    } catch (e) {
      console.warn('Save progress error:', e);
    }

    // Check if entire level was completed
    const level = LEVELS.find(l => l.id === levelId);
    if (level) {
      const allDone = level.tasks.every(task => Boolean(updated[`${levelId}_${task.key}`]));
      if (allDone) {
        setCompletionModal({
          levelId,
          levelName: level.name,
          levelNameMr: level.nameMr,
          nextLevelId: levelId < 5 ? levelId + 1 : null
        });
      }
    }
  }, [levelProgress]);

  const resetAllProgress = async () => {
    try {
      await AsyncStorage.removeItem('level_progress');
      setLevelProgress({});
    } catch (e) {
      console.warn('Reset progress error:', e);
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        LEVELS,
        levelProgress,
        isTaskCompleted,
        isLevelComplete,
        isLevelUnlocked,
        currentLevel,
        completeTask,
        completionModal,
        closeCompletionModal: () => setCompletionModal(null),
        resetAllProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
