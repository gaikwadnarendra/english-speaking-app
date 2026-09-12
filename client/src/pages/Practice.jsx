import React, { useState, useEffect } from 'react';
import { Award, HelpCircle, Layers, ArrowLeftRight, CheckCircle2, RotateCcw, Puzzle, Zap, Volume2, Trophy, ArrowRight, XCircle } from 'lucide-react';
import QuizCard from '../components/practice/QuizCard';
import MatchPairs from '../components/practice/MatchPairs';
import AudioButton from '../components/common/AudioButton';
import { fetchQuizzes } from '../services/api';
import { speakText } from '../utils/ttsHelper';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import confetti from 'canvas-confetti';

const Practice = () => {
  const { t, language, soundSpeed } = useApp();
  const { completeTask, isTaskCompleted } = useProgress();
  const [activeMode, setActiveMode] = useState('mcq'); // 'mcq', 'matching', 'sentence-builder', 'speed-drill'
  const [quizzes, setQuizzes] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Practice Session Score Tracking
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);

  // Sentence Builder State
  const sentencePuzzles = [
    {
      id: 1,
      targetEn: "I want to learn English",
      meaning_mr: "मला इंग्रजी शिकायचे आहे.",
      meaning_hi: "मुझे अंग्रेजी सीखनी है।",
      words: ["learn", "want", "English", "I", "to"]
    },
    {
      id: 2,
      targetEn: "Can you help me today",
      meaning_mr: "तुम्ही मला आज मदत करू शकता का?",
      meaning_hi: "क्या आप आज मेरी मदद कर सकते हैं?",
      words: ["today", "you", "me", "Can", "help"]
    },
    {
      id: 3,
      targetEn: "Where is the bus stop",
      meaning_mr: "बस थांबा कुठे आहे?",
      meaning_hi: "बस स्टॉप कहाँ है?",
      words: ["bus", "the", "Where", "stop", "is"]
    },
    {
      id: 4,
      targetEn: "Thank you very much my friend",
      meaning_mr: "खूप खूप धन्यवाद माझ्या मित्रा.",
      meaning_hi: "बहुत बहुत धन्यवाद मेरे दोस्त।",
      words: ["friend", "much", "very", "Thank", "my", "you"]
    }
  ];

  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [assembledWords, setAssembledWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [puzzleStatus, setPuzzleStatus] = useState(null); // null, 'correct', 'wrong'

  const currentPuzzle = sentencePuzzles[puzzleIndex];

  useEffect(() => {
    if (currentPuzzle) {
      setAvailableWords([...currentPuzzle.words].sort(() => Math.random() - 0.5));
      setAssembledWords([]);
      setPuzzleStatus(null);
    }
  }, [puzzleIndex]);

  const fallbackQuizzes = [
    {
      id: 1,
      type: "mcq",
      topic: "vocabulary",
      question_mr: "'पाणी' या शब्दाला इंग्रजीत काय म्हणतात?",
      question_hi: "'पानी' को अंग्रेजी में क्या कहते हैं?",
      question_en: "What is the English word for 'Water'?",
      options: ["Food", "Water", "House", "Friend"],
      correctAnswer: "Water",
      explanation_mr: "पाणी = Water (उच्चार: वॉटर)",
      explanation_hi: "पानी = Water (उच्चारण: वॉटर)"
    },
    {
      id: 2,
      type: "mcq",
      topic: "phrases",
      question_mr: "'मला समजले नाही' चे योग्य इंग्रजी भाषांतर कोणते?",
      question_hi: "'मुझे समझ नहीं आया' का सही अंग्रेजी अनुवाद कौन सा है?",
      question_en: "Choose correct English translation for 'I didn't understand':",
      options: [
        "I don't know",
        "I didn't understand",
        "I am not coming",
        "I need help"
      ],
      correctAnswer: "I didn't understand",
      explanation_mr: "मला समजले नाही = I didn't understand (आय डिडंट अंडरस्टँड)",
      explanation_hi: "मुझे समझ नहीं आया = I didn't understand"
    },
    {
      id: 3,
      type: "mcq",
      topic: "grammar",
      question_mr: "'Go' (जाणे) चे भूतकाळी रूप (V2 - Past Form) काय आहे?",
      question_hi: "'Go' (जाना) का Past Form (V2) क्या है?",
      question_en: "What is the V2 Past Tense form of the verb 'Go'?",
      options: ["Gone", "Went", "Going", "Goes"],
      correctAnswer: "Went",
      explanation_mr: "Go (V1) -> Went (V2) -> Gone (V3)",
      explanation_hi: "Go (V1) -> Went (V2) -> Gone (V3)"
    },
    {
      id: 4,
      type: "mcq",
      topic: "phrases",
      question_mr: "'शुभ सकाळ' ला इंग्रजीत कसे अभिवादन करतात?",
      question_hi: "'शुभ प्रभात' को अंग्रेजी में क्या कहते हैं?",
      question_en: "How do you say 'Good Morning' in English?",
      options: ["Good Evening", "Good Night", "Good Morning", "Goodbye"],
      correctAnswer: "Good Morning",
      explanation_mr: "शुभ सकाळ = Good Morning (गुड मॉर्निंग)",
      explanation_hi: "शुभ प्रभात = Good Morning (गुड मॉर्निंग)"
    }
  ];

  useEffect(() => {
    const loadQuizData = async () => {
      setLoading(true);
      try {
        const res = await fetchQuizzes();
        if (res.data?.data && res.data.data.length > 0) {
          const mcqs = res.data.data.filter(q => q.type === 'mcq');
          setQuizzes(mcqs.length > 0 ? mcqs : fallbackQuizzes);
        } else {
          setQuizzes(fallbackQuizzes);
        }
      } catch (err) {
        console.warn('Could not fetch remote quizzes, using built-in quizzes:', err);
        setQuizzes(fallbackQuizzes);
      } finally {
        setLoading(false);
      }
    };
    loadQuizData();
  }, []);

  const filteredQuizzes = quizzes.filter(q => {
    if (selectedTopic === 'all') return true;
    return q.topic === selectedTopic;
  });

  const getLanguagePairs = () => {
    if (language === 'hi') {
      return [
        { left: "पानी (Water)", right: "Water" },
        { left: "घर (Home)", right: "House" },
        { left: "मित्र (Friend)", right: "Friend" },
        { left: "समय (Time)", right: "Time" },
        { left: "सीखना (Learn)", right: "Learn" }
      ];
    }
    if (language === 'en') {
      return [
        { left: "Aqua / Drink", right: "Water" },
        { left: "Residence", right: "House" },
        { left: "Companion", right: "Friend" },
        { left: "Clock / Duration", right: "Time" },
        { left: "Study / Acquire", right: "Learn" }
      ];
    }
    return [
      { left: "पाणी (Water)", right: "Water" },
      { left: "घर (Home)", right: "House" },
      { left: "मित्र (Friend)", right: "Friend" },
      { left: "वेळ (Time)", right: "Time" },
      { left: "शिकणे (Learn)", right: "Learn" }
    ];
  };

  const handleNextQuestion = () => {
    setSessionScore(prev => prev + 10);
    setSessionStreak(prev => prev + 1);
    if (currentQuizIndex < (filteredQuizzes.length > 0 ? filteredQuizzes.length - 1 : quizzes.length - 1)) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setCurrentQuizIndex(0);
      confetti({ particleCount: 100, spread: 70 });
    }
  };

  // Word tap for sentence builder
  const handleSelectWord = (word, index) => {
    setAssembledWords([...assembledWords, word]);
    const newAvail = [...availableWords];
    newAvail.splice(index, 1);
    setAvailableWords(newAvail);
  };

  const handleRemoveWord = (word, index) => {
    const newAssembled = [...assembledWords];
    newAssembled.splice(index, 1);
    setAssembledWords(newAssembled);
    setAvailableWords([...availableWords, word]);
  };

  const checkSentence = () => {
    const built = assembledWords.join(' ').toLowerCase().trim();
    const expected = currentPuzzle.targetEn.toLowerCase().trim();
    if (built === expected) {
      setPuzzleStatus('correct');
      confetti({ particleCount: 60, spread: 50 });
      speakText(currentPuzzle.targetEn, 'en-US', soundSpeed);
      setSessionScore(prev => prev + 15);
      setSessionStreak(prev => prev + 1);
    } else {
      setPuzzleStatus('wrong');
    }
  };

  const activeQuizList = filteredQuizzes.length > 0 ? filteredQuizzes : quizzes;
  const currentQuizItem = activeQuizList[currentQuizIndex] || activeQuizList[0];

  return (
    <div className="practice-page-container">
      {/* Header */}
      <div className="practice-header-block">
        <div>
          <h2 className="page-main-title">{t.practicePageTitle}</h2>
          <p className="page-main-subtitle">
            {t.practicePageSub}
          </p>
        </div>

        {/* Practice Stats Pill */}
        <div className="practice-stats-pill">
          <Trophy size={16} className="trophy-gold" />
          <span>{t.scoreSessionLabel}: <b>{sessionScore} XP</b></span>
          <span className="streak-dot">•</span>
          <span>🔥 {sessionStreak}</span>
        </div>

        {/* Practice Mode Selector Pills */}
        <div className="mode-selector-pills">
          <button
            className={`mode-pill ${activeMode === 'mcq' ? 'active' : ''}`}
            onClick={() => setActiveMode('mcq')}
          >
            <HelpCircle size={16} />
            <span>{t.mcqQuizTab}</span>
          </button>
          <button
            className={`mode-pill ${activeMode === 'matching' ? 'active' : ''}`}
            onClick={() => setActiveMode('matching')}
          >
            <Layers size={16} />
            <span>{t.matchingTab}</span>
          </button>
          <button
            className={`mode-pill ${activeMode === 'sentence-builder' ? 'active' : ''}`}
            onClick={() => setActiveMode('sentence-builder')}
          >
            <Puzzle size={16} />
            <span>{t.sentenceBuilderTab}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Practice Workspace */}
      <div className="practice-workspace-area">
        {loading ? (
          <div className="loading-state">
            <p>{t.loadingWords}</p>
          </div>
        ) : activeMode === 'mcq' && activeQuizList.length > 0 && currentQuizItem ? (
          <div className="quiz-container-wrapper">
            <div className="quiz-progress-indicator">
              <span>{t.questionWord} {currentQuizIndex + 1} / {activeQuizList.length}</span>
            </div>
            <QuizCard
              key={currentQuizItem.id}
              quiz={currentQuizItem}
              onNext={handleNextQuestion}
            />
          </div>
        ) : activeMode === 'matching' ? (
          <MatchPairs pairs={getLanguagePairs()} />
        ) : activeMode === 'sentence-builder' && currentPuzzle ? (
          /* Interactive Sentence Builder */
          <div className="sentence-builder-card glass-card">
            <div className="builder-header">
              <span className="badge badge-indigo">{t.sentenceBuilderTab} ({puzzleIndex + 1} / {sentencePuzzles.length})</span>
              <p className="builder-meaning-target">
                {language === 'hi' ? currentPuzzle.meaning_hi : currentPuzzle.meaning_mr}
              </p>
            </div>

            {/* Assembled Sentence Area */}
            <div className="assembled-sentence-box">
              {assembledWords.length === 0 ? (
                <span className="empty-assembled-hint">Tap words below in correct order...</span>
              ) : (
                assembledWords.map((word, idx) => (
                  <button
                    key={idx}
                    className="assembled-word-chip"
                    onClick={() => handleRemoveWord(word, idx)}
                  >
                    <span>{word}</span>
                    <span className="remove-cross">✕</span>
                  </button>
                ))
              )}
            </div>

            {/* Available Scrambled Words */}
            <div className="available-words-pool">
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  className="pool-word-btn hover-lift"
                  onClick={() => handleSelectWord(word, idx)}
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Verification / Next Question */}
            {puzzleStatus === 'correct' && (
              <div className="builder-status-box success-box">
                <CheckCircle2 size={20} />
                <span>{t.correctSentenceMsg}</span>
                <AudioButton text={currentPuzzle.targetEn} size={15} />
              </div>
            )}

            {puzzleStatus === 'wrong' && (
              <div className="builder-status-box wrong-box">
                <XCircle size={20} />
                <span>{t.tryAgainOrderMsg}</span>
              </div>
            )}

            <div className="builder-actions-row">
              <button
                className="btn-outline"
                onClick={() => {
                  setAvailableWords([...currentPuzzle.words].sort(() => Math.random() - 0.5));
                  setAssembledWords([]);
                  setPuzzleStatus(null);
                }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>

              {puzzleStatus !== 'correct' ? (
                <button
                  className="btn-primary"
                  onClick={checkSentence}
                  disabled={assembledWords.length === 0}
                >
                  <span>{t.checkOrderBtn}</span>
                  <CheckCircle2 size={16} />
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => {
                    setPuzzleIndex(prev => (prev < sentencePuzzles.length - 1 ? prev + 1 : 0));
                  }}
                >
                  <span>{t.nextQuestionBtn}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state-box">
            <p>{t.noWordsHere}</p>
          </div>
        )}
      </div>

      <style>{`
        .practice-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .practice-header-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .practice-stats-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: #fef3c7;
          color: #92400e;
          font-weight: 700;
          font-size: 0.88rem;
          border: 1px solid #fde68a;
        }
        .trophy-gold {
          color: #d97706;
        }
        .streak-dot {
          color: #d97706;
        }
        .mode-selector-pills {
          display: flex;
          gap: 8px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-md);
          flex-wrap: wrap;
          width: 100%;
        }
        .mode-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.9rem;
          color: #475569;
          border: none;
          background: transparent;
          cursor: pointer;
          flex: 1 1 auto;
        }
        .mode-pill:hover {
          color: var(--primary);
        }
        .mode-pill.active {
          background: #ffffff;
          color: var(--primary-dark);
          box-shadow: var(--shadow-sm);
        }
        .practice-workspace-area {
          max-width: 780px;
          margin: 0 auto;
          width: 100%;
        }
        .quiz-container-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .quiz-progress-indicator {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-muted);
          text-align: right;
        }
        /* Sentence Builder Styles */
        .sentence-builder-card {
          padding: clamp(16px, 4vw, 28px);
          border-radius: var(--radius-lg);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 20px;
          border: 1px solid var(--border-color);
          width: 100%;
        }
        .builder-header {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .builder-meaning-target {
          font-size: clamp(1.1rem, 3vw, 1.3rem);
          font-weight: 800;
          color: #0f172a;
          word-break: break-word;
        }
        .assembled-sentence-box {
          min-height: 64px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .empty-assembled-hint {
          color: #94a3b8;
          font-style: italic;
          font-size: 0.9rem;
        }
        .assembled-word-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          background: var(--primary);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
        }
        .remove-cross {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        .available-words-pool {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 8px 0;
        }
        .pool-word-btn {
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: #ffffff;
          border: 1.5px solid var(--border-color);
          font-weight: 700;
          font-size: 0.95rem;
          color: #1e293b;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
        }
        .pool-word-btn:hover {
          border-color: var(--primary);
          background: #fff7ed;
        }
        .builder-status-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.92rem;
        }
        .success-box {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }
        .wrong-box {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
        .builder-actions-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 480px) {
          .builder-actions-row {
            flex-direction: column;
            align-items: stretch;
          }
          .builder-actions-row button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* ===== Level Progression Banner ===== */}
      <div style={{
        marginTop: '20px', padding: '18px 22px',
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        borderRadius: '14px', border: '1.5px solid #bbf7d0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>🎯</span>
          <div>
            <p style={{ fontWeight: 800, color: '#14532d', fontSize: '0.95rem', marginBottom: '2px' }}>
              Practice Progress Tasks
            </p>
            <p style={{ fontSize: '0.82rem', color: '#16a34a' }}>
              Complete practice modes to unlock the next level
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!isTaskCompleted(1, 'practice_mcq') && (
            <button
              onClick={() => completeTask(1, 'practice_mcq')}
              style={{
                padding: '10px 20px', background: '#22c55e', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark MCQ Quiz Done
            </button>
          )}
          {!isTaskCompleted(3, 'practice_builder') && (
            <button
              onClick={() => completeTask(3, 'practice_builder')}
              style={{
                padding: '10px 20px', background: '#8b5cf6', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark Sentence Builder Done
            </button>
          )}
          {!isTaskCompleted(4, 'practice_speed') && (
            <button
              onClick={() => completeTask(4, 'practice_speed')}
              style={{
                padding: '10px 20px', background: '#ef4444', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark Speed Drill Done
            </button>
          )}
          {!isTaskCompleted(5, 'practice_master') && (
            <button
              onClick={() => completeTask(5, 'practice_master')}
              style={{
                padding: '10px 20px', background: '#0f172a', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark All Practice Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
