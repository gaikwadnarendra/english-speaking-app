import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

const ProgressContext = createContext();

// ----------- Level definitions -----------
export const LEVELS = [
  {
    id: 1,
    name: 'Beginner',
    nameMr: 'प्रारंभिक',
    nameHi: 'शुरुआती',
    color: '#22c55e',
    tasks: [
      { key: 'learn_l1', label: 'Complete Lesson (Level 1)', labelMr: 'धडा पूर्ण करा (स्तर १)', labelHi: 'पाठ पूरा करें (स्तर १)', route: '/learn', icon: '📖' },
      { key: 'vocab_l1', label: 'Study 10 Vocabulary Words', labelMr: '10 शब्द शिका', labelHi: '10 शब्द सीखें', route: '/vocab', icon: '📝' },
      { key: 'practice_mcq', label: 'Complete an MCQ Quiz', labelMr: 'MCQ प्रश्नमंजुषा पूर्ण करा', labelHi: 'MCQ प्रश्नोत्तरी पूरा करें', route: '/practice', icon: '🎯' },
    ],
  },
  {
    id: 2,
    name: 'Elementary',
    nameMr: 'प्राथमिक',
    nameHi: 'प्रारंभिक',
    color: '#3b82f6',
    tasks: [
      { key: 'learn_l2', label: 'Complete Lesson (Level 2)', labelMr: 'धडा पूर्ण करा (स्तर २)', labelHi: 'पाठ पूरा करें (स्तर २)', route: '/learn', icon: '📖' },
      { key: 'verbs_basic', label: 'Study Basic Verbs', labelMr: 'मूलभूत क्रियापदे शिका', labelHi: 'बुनियादी क्रियाएं सीखें', route: '/verbs', icon: '⚡' },
      { key: 'speaking_5', label: 'Practice Speaking (5 sentences)', labelMr: '5 वाक्ये बोलण्याचा सराव करा', labelHi: '5 वाक्य बोलने का अभ्यास करें', route: '/speaking', icon: '🎤' },
    ],
  },
  {
    id: 3,
    name: 'Intermediate',
    nameMr: 'मध्यम',
    nameHi: 'मध्यवर्ती',
    color: '#f59e0b',
    tasks: [
      { key: 'learn_l3', label: 'Complete Lesson (Level 3)', labelMr: 'धडा पूर्ण करा (स्तर ३)', labelHi: 'पाठ पूरा करें (स्तर ३)', route: '/learn', icon: '📖' },
      { key: 'vocab_advanced', label: 'Study Advanced Vocabulary', labelMr: 'प्रगत शब्दसंग्रह शिका', labelHi: 'उन्नत शब्दावली सीखें', route: '/vocab', icon: '📝' },
      { key: 'verbs_quiz', label: 'Complete Verb Conjugation Quiz', labelMr: 'क्रियापद संयोजन क्विझ पूर्ण करा', labelHi: 'क्रिया रूपांतरण क्विज़ पूरा करें', route: '/verbs', icon: '⚡' },
      { key: 'practice_builder', label: 'Sentence Builder Session', labelMr: 'वाक्य निर्माण सत्र', labelHi: 'वाक्य निर्माण सत्र', route: '/practice', icon: '🧩' },
    ],
  },
  {
    id: 4,
    name: 'Upper-Intermediate',
    nameMr: 'उच्च-मध्यम',
    nameHi: 'उच्च-मध्यवर्ती',
    color: '#8b5cf6',
    tasks: [
      { key: 'daily_streak', label: 'Complete Daily Challenge', labelMr: 'दैनिक आव्हान पूर्ण करा', labelHi: 'दैनिक चुनौती पूरी करें', route: '/daily-challenge', icon: '🔥' },
      { key: 'speaking_15', label: 'Practice Speaking (15 sentences)', labelMr: '15 वाक्ये बोलण्याचा सराव करा', labelHi: '15 वाक्य बोलने का अभ्यास करें', route: '/speaking', icon: '🎤' },
      { key: 'practice_speed', label: 'Complete Speed Drill Quiz', labelMr: 'वेग-कसोटी क्विझ पूर्ण करा', labelHi: 'स्पीड ड्रिल क्विज़ पूरा करें', route: '/practice', icon: '⚡' },
    ],
  },
  {
    id: 5,
    name: 'Advanced',
    nameMr: 'प्रगत',
    nameHi: 'उन्नत',
    color: '#ef4444',
    tasks: [
      { key: 'vocab_master', label: 'Master 50+ Vocabulary Words', labelMr: '50+ शब्द पूर्ण करा', labelHi: '50+ शब्दों में महारत हासिल करें', route: '/vocab', icon: '📝' },
      { key: 'practice_master', label: 'Complete All Practice Modes', labelMr: 'सर्व सराव प्रकार पूर्ण करा', labelHi: 'सभी अभ्यास मोड पूरे करें', route: '/practice', icon: '🏆' },
      { key: 'speaking_ai', label: 'Full AI Conversation Session', labelMr: 'पूर्ण AI संवाद सत्र', labelHi: 'पूर्ण AI बातचीत सत्र', route: '/speaking', icon: '🤖' },
    ],
  },
];

// Helper to get stored progress from localStorage
const getStoredProgress = () => {
  try {
    const raw = localStorage.getItem('level_progress');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const ProgressProvider = ({ children }) => {
  const [levelProgress, setLevelProgress] = useState(getStoredProgress);
  const [completionModal, setCompletionModal] = useState(null); // { levelId, levelName }

  // Check if a specific task is completed
  const isTaskCompleted = useCallback((levelId, taskKey) => {
    return Boolean(levelProgress[`${levelId}_${taskKey}`]);
  }, [levelProgress]);

  // Check if all tasks of a level are done
  const isLevelComplete = useCallback((levelId) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return false;
    return level.tasks.every(task => Boolean(levelProgress[`${levelId}_${task.key}`]));
  }, [levelProgress]);

  // A level is unlocked if it's level 1 OR the previous level is fully complete
  const isLevelUnlocked = useCallback((levelId) => {
    if (levelId === 1) return true;
    return isLevelComplete(levelId - 1);
  }, [isLevelComplete]);

  // Get current active level (lowest unlocked incomplete level)
  const currentLevel = LEVELS.find(l => isLevelUnlocked(l.id) && !isLevelComplete(l.id))?.id || 5;

  // Mark a task complete
  const completeTask = useCallback((levelId, taskKey) => {
    const progressKey = `${levelId}_${taskKey}`;
    setLevelProgress(prev => {
      if (prev[progressKey]) return prev; // already done
      const updated = { ...prev, [progressKey]: true };
      localStorage.setItem('level_progress', JSON.stringify(updated));

      // Check if this just completed the level
      const level = LEVELS.find(l => l.id === levelId);
      if (level) {
        const allDone = level.tasks.every(task => Boolean(updated[`${levelId}_${task.key}`]));
        if (allDone) {
          // Fire confetti & show modal after state update
          setTimeout(() => {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
            setCompletionModal({ levelId, levelName: level.name });
          }, 300);
        }
      }
      return updated;
    });
  }, []);

  // Get tasks completed count for a level
  const getCompletedCount = useCallback((levelId) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return 0;
    return level.tasks.filter(task => Boolean(levelProgress[`${levelId}_${task.key}`])).length;
  }, [levelProgress]);

  // Reset all progress (for dev/testing)
  const resetAllProgress = () => {
    localStorage.removeItem('level_progress');
    setLevelProgress({});
  };

  return (
    <ProgressContext.Provider value={{
      levelProgress,
      completeTask,
      isTaskCompleted,
      isLevelUnlocked,
      isLevelComplete,
      getCompletedCount,
      currentLevel,
      completionModal,
      closeCompletionModal: () => setCompletionModal(null),
      resetAllProgress,
    }}>
      {children}
      {/* Level Completion Modal */}
      {completionModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '24px', padding: '40px 48px',
            textAlign: 'center', maxWidth: '440px', width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Level Complete!
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '6px' }}>
              You completed <strong>{completionModal.levelName}</strong>
            </p>
            {completionModal.levelId < 5 && (
              <p style={{ fontSize: '0.95rem', color: '#22c55e', fontWeight: 700, marginBottom: '24px' }}>
                🔓 Level {completionModal.levelId + 1} is now unlocked!
              </p>
            )}
            {completionModal.levelId === 5 && (
              <p style={{ fontSize: '0.95rem', color: '#f59e0b', fontWeight: 700, marginBottom: '24px' }}>
                🏆 You've mastered all levels! You're Advanced!
              </p>
            )}
            <button
              onClick={() => setCompletionModal(null)}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff', border: 'none', borderRadius: '12px',
                padding: '14px 36px', fontSize: '1rem', fontWeight: 800,
                cursor: 'pointer', transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              Continue Learning 🚀
            </button>
          </div>
          <style>{`@keyframes popIn { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
        </div>
      )}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
