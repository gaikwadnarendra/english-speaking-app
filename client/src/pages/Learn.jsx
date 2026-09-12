import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  CheckCircle,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Award,
  Lock,
  Unlock,
  Sparkles,
  Search,
  Mic,
  Square,
  RotateCcw,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  Layers,
  ChevronRight,
  CheckCircle2,
  Flame,
  VolumeX,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AudioButton from '../components/common/AudioButton';
import { fetchLessons, markLessonComplete } from '../services/api';
import { useApp } from '../context/AppContext';
import { useProgress, LEVELS } from '../context/ProgressContext';
import { speakText } from '../utils/ttsHelper';

const Learn = () => {
  const { t, language, soundSpeed } = useApp();
  const { completeTask, isTaskCompleted, isLevelUnlocked, isLevelComplete } = useProgress();

  const [activeLevel, setActiveLevel] = useState(1);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab'); // 'vocab' | 'flashcards' | 'dialogue' | 'grammar' | 'quiz'
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Flashcards state
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Voice recording / evaluation state per item
  const [activeMicItem, setActiveMicItem] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [itemScore, setItemScore] = useState({}); // { [itemEn]: score }
  const recognitionRef = useRef(null);

  // Lesson Quiz State
  const [quizAnswers, setQuizAnswers] = useState({}); // { [qIdx]: selectedOptionIdx }
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Fetch lessons when activeLevel changes
  useEffect(() => {
    const loadLevelLessons = async () => {
      setLoading(true);
      try {
        const res = await fetchLessons({ level: activeLevel });
        if (res.data?.data) {
          const list = res.data.data;
          setLessons(list);
          if (list.length > 0) {
            setSelectedLesson(list[0]);
            setFlashcardIdx(0);
            setIsFlipped(false);
            setQuizAnswers({});
            setQuizSubmitted(false);
            setActiveTab('vocab');
          } else {
            setSelectedLesson(null);
          }
        }
      } catch (err) {
        console.warn('Error loading lessons:', err);
      } finally {
        setLoading(false);
      }
    };
    loadLevelLessons();
  }, [activeLevel]);

  // When selected lesson changes, reset tab states
  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setFlashcardIdx(0);
    setIsFlipped(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveTab('vocab');
  };

  // Complete lesson handler
  const handleCompleteLesson = async (lessonId) => {
    try {
      await markLessonComplete(lessonId);
      setLessons(prev =>
        prev.map(l => (l.id === lessonId ? { ...l, is_completed: true } : l))
      );
      if (selectedLesson && selectedLesson.id === lessonId) {
        setSelectedLesson({ ...selectedLesson, is_completed: true });
      }

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Mark progression task based on active level
      if (activeLevel === 1) completeTask(1, 'learn_l1');
      else if (activeLevel === 2) completeTask(2, 'learn_l2');
      else if (activeLevel === 3) completeTask(3, 'learn_l3');
      else if (activeLevel === 4) completeTask(4, 'daily_streak');
      else if (activeLevel === 5) completeTask(5, 'practice_master');
    } catch (err) {
      console.warn('Error completing lesson:', err);
    }
  };

  // Speech Recognition Setup for Card Voice Evaluation
  const startVoicePractice = (targetText) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      setActiveMicItem(null);
      return;
    }

    setActiveMicItem(targetText);
    setIsRecording(true);
    setSpokenText('');

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);

      // Calculate similarity score
      const cleanSpoken = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
      const cleanTarget = targetText.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

      let score = 0;
      if (cleanSpoken === cleanTarget) {
        score = 100;
      } else {
        const spokenWords = cleanSpoken.split(' ');
        const targetWords = cleanTarget.split(' ');
        let matches = 0;
        spokenWords.forEach(w => {
          if (targetWords.includes(w)) matches++;
        });
        score = Math.min(100, Math.round((matches / targetWords.length) * 100));
        if (score === 0 && cleanSpoken.length > 2) score = 65; // partial credit
      }

      setItemScore(prev => ({ ...prev, [targetText]: score }));
      setIsRecording(false);
      setActiveMicItem(null);

      if (score >= 80) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      setIsRecording(false);
      setActiveMicItem(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setActiveMicItem(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Quiz submission evaluation
  const handleQuizOptionSelect = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const quizList = selectedLesson?.quiz || [];
    let correctCount = 0;
    quizList.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correctCount++;
    });

    if (correctCount === quizList.length && quizList.length > 0) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      handleCompleteLesson(selectedLesson.id);
    }
  };

  // Autoplay full dialogue
  const handlePlayFullDialogue = (dialogueList) => {
    if (!dialogueList || dialogueList.length === 0) return;
    let idx = 0;
    const playNext = () => {
      if (idx < dialogueList.length) {
        const item = dialogueList[idx];
        speakText(item.text_en, 'en-US', soundSpeed, () => {
          idx++;
          setTimeout(playNext, 400);
        });
      }
    };
    playNext();
  };

  // Filter lessons by search query and category
  const filteredLessons = lessons.filter(l => {
    const titleMatch =
      (l.title_en && l.title_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.title_mr && l.title_mr.includes(searchQuery)) ||
      (l.title_hi && l.title_hi.includes(searchQuery));
    const catMatch = selectedCategory === 'all' || l.category === selectedCategory;
    return titleMatch && catMatch;
  });

  // Unique categories in current level
  const uniqueCategories = ['all', ...new Set(lessons.map(l => l.category).filter(Boolean))];

  // Level stats
  const completedLessonsCount = lessons.filter(l => l.is_completed).length;
  const levelProgressPercent = lessons.length > 0 ? Math.round((completedLessonsCount / lessons.length) * 100) : 0;
  const isCurrentLevelUnlocked = isLevelUnlocked(activeLevel);

  const levelTabs = [
    { id: 1, label: t.level1Tab || 'Level 1: Beginner', badge: 'L1' },
    { id: 2, label: t.level2Tab || 'Level 2: Daily Life', badge: 'L2' },
    { id: 3, label: t.level3Tab || 'Level 3: Sentence Patterns', badge: 'L3' },
    { id: 4, label: t.level4Tab || 'Level 4: Conversation', badge: 'L4' },
    { id: 5, label: t.level5Tab || 'Level 5: Advanced Fluency', badge: 'L5' }
  ];

  return (
    <div className="learn-page-container">
      {/* ================= PAGE HEADER & LEVEL SELECTOR ================= */}
      <div className="learn-header-banner glass-card">
        <div className="banner-top-row">
          <div>
            <div className="curriculum-badge">
              <Sparkles size={16} />
              <span>{t.appName || 'English शिका'} • 5-Level Master Curriculum</span>
            </div>
            <h1 className="page-main-title">{t.learnPageTitle}</h1>
            <p className="page-main-subtitle">{t.learnPageSub}</p>
          </div>

          <div className="level-stats-card">
            <div className="stats-metric">
              <span className="stats-num">{completedLessonsCount}/{lessons.length}</span>
              <span className="stats-label">{t.completedBadge}</span>
            </div>
            <div className="stats-bar-wrapper">
              <div
                className="stats-bar-fill"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <span className="stats-pct-text">{levelProgressPercent}% Level {activeLevel} Complete</span>
          </div>
        </div>

        {/* 5-Level Switcher Buttons */}
        <div className="level-tabs-strip">
          {levelTabs.map(tab => {
            const unlocked = isLevelUnlocked(tab.id);
            const complete = isLevelComplete(tab.id);
            return (
              <button
                key={tab.id}
                className={`level-tab-chip ${activeLevel === tab.id ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => setActiveLevel(tab.id)}
              >
                <div className="tab-chip-pill">
                  {complete ? (
                    <CheckCircle size={14} className="icon-complete" />
                  ) : !unlocked ? (
                    <Lock size={14} className="icon-lock" />
                  ) : (
                    <span className="pill-num">{tab.badge}</span>
                  )}
                </div>
                <span className="tab-chip-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lock Notice if current level is locked */}
      {!isCurrentLevelUnlocked && (
        <div className="level-locked-banner">
          <Lock size={20} className="lock-banner-icon" />
          <div className="lock-banner-text">
            <strong>{t.lockedBadge || 'Level Locked'}: </strong>
            {t.levelLockedNotice || 'Complete the tasks in previous levels to unlock this level curriculum.'}
          </div>
        </div>
      )}

      {/* ================= MAIN 2-COLUMN LAYOUT ================= */}
      <div className="learn-content-grid">
        {/* LEFT COLUMN: LESSONS SIDEBAR */}
        <div className="lessons-sidebar-panel glass-card">
          <div className="sidebar-header-row">
            <div className="sidebar-title-group">
              <BookOpen size={18} className="sidebar-icon" />
              <h3 className="sidebar-heading">{t.lessonsListTitle}</h3>
            </div>
            <span className="lesson-count-badge">{filteredLessons.length}</span>
          </div>

          {/* Search Box */}
          <div className="lesson-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={t.searchLessons || 'Search lessons...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Category Filter Pills */}
          {uniqueCategories.length > 2 && (
            <div className="category-chips-row">
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? (t.allCategories || 'All') : cat}
                </button>
              ))}
            </div>
          )}

          {/* Lessons List */}
          <div className="lessons-scroll-list">
            {loading ? (
              <div className="loading-state-box">
                <div className="spinner" />
                <p>धडे लोड होत आहेत...</p>
              </div>
            ) : filteredLessons.length === 0 ? (
              <div className="empty-search-state">
                <p>कोणताही धडा सापडला नाही.</p>
              </div>
            ) : (
              filteredLessons.map((lesson, idx) => {
                const isSelected = selectedLesson?.id === lesson.id;
                return (
                  <div
                    key={lesson.id}
                    className={`lesson-list-item ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectLesson(lesson)}
                  >
                    <div className="item-index-badge">
                      {lesson.is_completed ? (
                        <CheckCircle2 size={16} className="item-done-icon" />
                      ) : (
                        <span>#{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                      )}
                    </div>

                    <div className="item-details-col">
                      <span className="item-category-tag">{lesson.category}</span>
                      <h4 className="item-title-local">
                        {language === 'hi' && lesson.title_hi ? lesson.title_hi : lesson.title_mr}
                      </h4>
                      <p className="item-title-en">{lesson.title_en}</p>
                    </div>

                    <ChevronRight size={16} className="item-arrow" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LESSON VIEWER HUB */}
        <div className="lesson-viewer-panel glass-card">
          {selectedLesson ? (
            <div className="lesson-viewer-body">
              {/* Top Banner of Selected Lesson */}
              <div className="viewer-hero-header">
                <div className="hero-tags-row">
                  <span className="badge badge-primary">Level {selectedLesson.level}</span>
                  <span className="badge badge-indigo">{selectedLesson.category}</span>
                  {selectedLesson.is_completed ? (
                    <span className="badge badge-green">
                      <CheckCircle2 size={14} />
                      {t.completedBadge}
                    </span>
                  ) : (
                    <span className="badge badge-amber">अभ्यास सुरू आहे</span>
                  )}
                </div>

                <div className="hero-titles-row">
                  <div>
                    <h2 className="selected-lesson-local">
                      {language === 'hi' && selectedLesson.title_hi
                        ? selectedLesson.title_hi
                        : selectedLesson.title_mr}
                    </h2>
                    <div className="selected-lesson-en-row">
                      <h3 className="selected-lesson-en">{selectedLesson.title_en}</h3>
                      <AudioButton text={selectedLesson.title_en} />
                    </div>
                  </div>
                </div>

                {(selectedLesson.description_mr || selectedLesson.description_hi) && (
                  <p className="selected-lesson-desc">
                    {language === 'hi' && selectedLesson.description_hi
                      ? selectedLesson.description_hi
                      : selectedLesson.description_mr}
                  </p>
                )}
              </div>

              {/* Sub-Tab Navigation Strip */}
              <div className="lesson-subtabs-nav">
                <button
                  className={`subtab-btn ${activeTab === 'vocab' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vocab')}
                >
                  <BookOpen size={16} />
                  <span>{t.lessonTabVocab || '📚 शब्द व वाक्ये'}</span>
                  <span className="tab-count-pill">{selectedLesson.content?.length || 0}</span>
                </button>

                <button
                  className={`subtab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
                  onClick={() => setActiveTab('flashcards')}
                >
                  <Layers size={16} />
                  <span>{t.lessonTabFlashcards || '🗂️ फ्लॅशकार्ड्स'}</span>
                </button>

                {selectedLesson.dialogue && selectedLesson.dialogue.length > 0 && (
                  <button
                    className={`subtab-btn ${activeTab === 'dialogue' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dialogue')}
                  >
                    <MessageSquare size={16} />
                    <span>{t.lessonTabDialogue || '💬 थेट संभाषण'}</span>
                  </button>
                )}

                {selectedLesson.grammar_tip && (
                  <button
                    className={`subtab-btn ${activeTab === 'grammar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('grammar')}
                  >
                    <Lightbulb size={16} />
                    <span>{t.lessonTabGrammar || '💡 व्याकरण व टिप्स'}</span>
                  </button>
                )}

                {selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
                  <button
                    className={`subtab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                  >
                    <HelpCircle size={16} />
                    <span>{t.lessonTabQuiz || '🎯 धड्याची क्विझ'}</span>
                    <span className="tab-count-pill">{selectedLesson.quiz.length} Qs</span>
                  </button>
                )}
              </div>

              {/* ================= TAB 1: VOCABULARY & EXPRESSIONS ================= */}
              {activeTab === 'vocab' && (
                <div className="tab-content-section">
                  <div className="items-header-bar">
                    <h4 className="section-subheading">{t.lessonItemsHeading}</h4>
                    <span className="section-hint">
                      उच्चार ऐका, मोठ्याने बोला किंवा माईकवर क्लिक करून स्वतःचा आवाज तपासा! 🎤
                    </span>
                  </div>

                  <div className="lesson-items-grid">
                    {selectedLesson.content?.map((item, idx) => {
                      const isThisMicActive = isRecording && activeMicItem === item.en;
                      const score = itemScore[item.en];

                      return (
                        <div key={idx} className="lesson-item-card">
                          <div className="item-card-top">
                            <div className="en-word-group">
                              <span className="en-word-text">{item.en}</span>
                              <span className="phonetic-guide-pill">/{item.pron}/</span>
                            </div>
                            <div className="item-action-btns">
                              <AudioButton text={item.en} size={16} />
                              <button
                                className={`mic-practice-btn ${isThisMicActive ? 'recording' : ''}`}
                                onClick={() => startVoicePractice(item.en)}
                                title={t.voicePracticeBtn || 'Practice Speaking'}
                              >
                                {isThisMicActive ? <Square size={14} /> : <Mic size={14} />}
                                <span>{isThisMicActive ? (t.listeningMic || 'Listening...') : (t.tapToSpeakMic || 'Speak')}</span>
                              </button>
                            </div>
                          </div>

                          {/* Voice Evaluation Feedback Score */}
                          {score !== undefined && (
                            <div className={`speech-score-banner ${score >= 75 ? 'good' : 'try-again'}`}>
                              <Sparkles size={14} />
                              <span>{t.voiceScoreLabel || 'Score'}: {score}% Match</span>
                              {score >= 75 ? ' • Excellent! 🎉' : ' • Try repeating clearly! 👍'}
                            </div>
                          )}

                          <div className="item-meanings-block">
                            <div className="meaning-row mr-row">
                              <span className="lang-tag mr">मराठी:</span>
                              <span className="meaning-text">{item.mr}</span>
                            </div>
                            {item.hi && (
                              <div className="meaning-row hi-row">
                                <span className="lang-tag hi">हिंदी:</span>
                                <span className="meaning-text">{item.hi}</span>
                              </div>
                            )}
                          </div>

                          {/* Example Sentence if available */}
                          {item.example_en && (
                            <div className="item-example-box">
                              <div className="example-en-line">
                                <strong>उदा: </strong>
                                <span>{item.example_en}</span>
                                <AudioButton text={item.example_en} size={14} />
                              </div>
                              <div className="example-local-line">
                                {language === 'hi' && item.example_hi ? item.example_hi : item.example_mr}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= TAB 2: FLASHCARDS MODE ================= */}
              {activeTab === 'flashcards' && selectedLesson.content && (
                <div className="tab-content-section flashcards-section">
                  <div className="flashcards-top-bar">
                    <span className="flashcard-counter">
                      Card {flashcardIdx + 1} of {selectedLesson.content.length}
                    </span>
                    <span className="flip-instruction-hint">
                      {t.flipCardHint || 'Click card to flip and view meaning ↺'}
                    </span>
                  </div>

                  {(() => {
                    const currentItem = selectedLesson.content[flashcardIdx] || {};
                    return (
                      <div
                        className={`flashcard-3d-box ${isFlipped ? 'flipped' : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        <div className="flashcard-inner">
                          {/* FRONT */}
                          <div className="flashcard-face flashcard-front">
                            <span className="card-badge">English Phrase</span>
                            <h2 className="flashcard-en-word">{currentItem.en}</h2>
                            <span className="flashcard-pron">/{currentItem.pron}/</span>
                            <div className="flashcard-audio-wrap" onClick={(e) => e.stopPropagation()}>
                              <AudioButton text={currentItem.en} size={20} label="Listen Pronunciation" />
                            </div>
                            <span className="tap-flip-hint">Tap to Flip ↺</span>
                          </div>

                          {/* BACK */}
                          <div className="flashcard-face flashcard-back">
                            <span className="card-badge">Meaning & Example</span>
                            <div className="back-meanings">
                              <h3 className="back-mr-meaning">मराठी: {currentItem.mr}</h3>
                              {currentItem.hi && (
                                <h4 className="back-hi-meaning">हिंदी: {currentItem.hi}</h4>
                              )}
                            </div>
                            {currentItem.example_en && (
                              <div className="back-example-block" onClick={(e) => e.stopPropagation()}>
                                <p className="example-en-txt">"{currentItem.example_en}"</p>
                                <p className="example-loc-txt">
                                  {language === 'hi' && currentItem.example_hi
                                    ? currentItem.example_hi
                                    : currentItem.example_mr}
                                </p>
                                <AudioButton text={currentItem.example_en} size={14} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flashcard-nav-controls">
                    <button
                      className="nav-btn prev-btn"
                      disabled={flashcardIdx === 0}
                      onClick={() => {
                        setIsFlipped(false);
                        setFlashcardIdx(prev => Math.max(0, prev - 1));
                      }}
                    >
                      <ArrowLeft size={16} />
                      <span>{t.flashcardPrev || 'Previous'}</span>
                    </button>

                    <button
                      className="nav-btn flip-btn"
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <RotateCcw size={16} />
                      <span>Flip Card</span>
                    </button>

                    <button
                      className="nav-btn next-btn"
                      disabled={flashcardIdx === selectedLesson.content.length - 1}
                      onClick={() => {
                        setIsFlipped(false);
                        setFlashcardIdx(prev => Math.min(selectedLesson.content.length - 1, prev + 1));
                      }}
                    >
                      <span>{t.flashcardNext || 'Next'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= TAB 3: LIVE DIALOGUE SCENARIO ================= */}
              {activeTab === 'dialogue' && selectedLesson.dialogue && (
                <div className="tab-content-section dialogue-section">
                  <div className="dialogue-header-bar">
                    <div>
                      <h4 className="section-subheading">वास्तविक संभाषण (Real-life Dialogue)</h4>
                      <p className="dialogue-sub-text">
                        दोन्ही पात्रांचे संभाषण ऐका आणि 'Play Full Dialogue' वर क्लिक करून अखंड सराव करा.
                      </p>
                    </div>
                    <button
                      className="btn-play-all-dialogue"
                      onClick={() => handlePlayFullDialogue(selectedLesson.dialogue)}
                    >
                      <Play size={16} />
                      <span>Play Full Dialogue</span>
                    </button>
                  </div>

                  <div className="dialogue-chat-flow">
                    {selectedLesson.dialogue.map((line, idx) => {
                      const isEven = idx % 2 === 0;
                      return (
                        <div
                          key={idx}
                          className={`dialogue-bubble-row ${isEven ? 'speaker-a' : 'speaker-b'}`}
                        >
                          <div className="speaker-avatar">
                            {line.speaker?.slice(0, 1) || (isEven ? 'A' : 'B')}
                          </div>
                          <div className="dialogue-bubble glass-card">
                            <div className="bubble-speaker-name">{line.speaker}</div>
                            <div className="bubble-en-text">
                              <span>{line.text_en}</span>
                              <AudioButton text={line.text_en} size={16} />
                            </div>
                            <div className="bubble-pron">/{line.pron}/</div>
                            <div className="bubble-local-text">
                              {language === 'hi' && line.text_hi ? line.text_hi : line.text_mr}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= TAB 4: GRAMMAR & PRO TIPS ================= */}
              {activeTab === 'grammar' && selectedLesson.grammar_tip && (
                <div className="tab-content-section grammar-section">
                  <div className="grammar-tip-card glass-card">
                    <div className="grammar-card-header">
                      <div className="grammar-bulb-icon">
                        <Lightbulb size={24} />
                      </div>
                      <h3 className="grammar-title">
                        {language === 'hi' && selectedLesson.grammar_tip.title_hi
                          ? selectedLesson.grammar_tip.title_hi
                          : selectedLesson.grammar_tip.title_mr}
                      </h3>
                    </div>

                    <div className="grammar-body-text">
                      <p className="rule-explanation">
                        {language === 'hi' && selectedLesson.grammar_tip.rule_hi
                          ? selectedLesson.grammar_tip.rule_hi
                          : selectedLesson.grammar_tip.rule_mr}
                      </p>

                      {selectedLesson.grammar_tip.example_en && (
                        <div className="grammar-example-highlight">
                          <div className="ex-en-box">
                            <strong>इंग्रजी उदाहरण: </strong>
                            <span>"{selectedLesson.grammar_tip.example_en}"</span>
                            <AudioButton text={selectedLesson.grammar_tip.example_en} size={14} />
                          </div>
                          <div className="ex-loc-box">
                            <strong>अर्थ: </strong>
                            <span>
                              {language === 'hi' && selectedLesson.grammar_tip.example_hi
                                ? selectedLesson.grammar_tip.example_hi
                                : selectedLesson.grammar_tip.example_mr}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 5: LESSON MASTERY QUIZ ================= */}
              {activeTab === 'quiz' && selectedLesson.quiz && (
                <div className="tab-content-section quiz-section">
                  <div className="quiz-header-bar">
                    <div className="quiz-title-badge">
                      <Award size={18} />
                      <span>{t.lessonQuizHeading || 'Lesson Mastery Quiz'}</span>
                    </div>
                    <p className="quiz-intro-text">
                      सर्व प्रश्नांची उत्तरे द्या. 100% गुण मिळवून हा धडा पूर्ण करा आणि पुढील प्रगती अनलॉक करा!
                    </p>
                  </div>

                  <div className="quiz-questions-list">
                    {selectedLesson.quiz.map((q, qIdx) => {
                      const selectedOpt = quizAnswers[qIdx];
                      const isAnswered = selectedOpt !== undefined;
                      const isCorrect = isAnswered && selectedOpt === q.correct;

                      return (
                        <div key={qIdx} className="quiz-question-card glass-card">
                          <div className="question-header">
                            <span className="q-number-pill">Q{qIdx + 1}</span>
                            <h4 className="q-text">
                              {language === 'hi' && q.question_hi
                                ? q.question_hi
                                : (q.question_mr || q.question_en)}
                            </h4>
                          </div>

                          <div className="quiz-options-grid">
                            {q.options.map((opt, optIdx) => {
                              let optStateClass = '';
                              if (quizSubmitted) {
                                if (optIdx === q.correct) optStateClass = 'correct';
                                else if (selectedOpt === optIdx) optStateClass = 'wrong';
                              } else if (selectedOpt === optIdx) {
                                optStateClass = 'selected';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  className={`quiz-option-btn ${optStateClass}`}
                                  onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                                >
                                  <span className="option-bullet">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="option-label">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className={`quiz-feedback-box ${isCorrect ? 'correct' : 'wrong'}`}>
                              {isCorrect ? (
                                <span>✓ बरोबर उत्तर! {q.explanation_mr || q.explanation_hi}</span>
                              ) : (
                                <span>
                                  ❌ चुकीचे उत्तर! योग्य उत्तर: <strong>{q.options[q.correct]}</strong>. {q.explanation_mr || q.explanation_hi}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="quiz-actions-footer">
                    {!quizSubmitted ? (
                      <button
                        className="btn-primary check-answers-btn"
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < selectedLesson.quiz.length}
                      >
                        <CheckCircle size={18} />
                        <span>{t.lessonQuizSubmit || 'Check Answers'}</span>
                      </button>
                    ) : (
                      <button
                        className="btn-secondary retry-quiz-btn"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizAnswers({});
                        }}
                      >
                        <RotateCcw size={18} />
                        <span>{t.lessonQuizTryAgain || 'Retry Quiz'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ================= BOTTOM COMPLETION ACTION BAR ================= */}
              <div className="lesson-footer-actions glass-card">
                {!selectedLesson.is_completed ? (
                  <button
                    className="btn-primary mark-done-btn"
                    onClick={() => handleCompleteLesson(selectedLesson.id)}
                  >
                    <CheckCircle size={20} />
                    <span>{t.markCompletedBtn || 'Mark as Completed'}</span>
                  </button>
                ) : (
                  <div className="completed-success-pill">
                    <CheckCircle2 size={22} className="check-icon" />
                    <div>
                      <strong>{t.completedSuccessMsg || 'Great job! Lesson completed.'}</strong>
                      <p className="completed-subtext">Level {selectedLesson.level} Task Progress Updated ✓</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-lesson-state">
              <BookOpen size={56} className="empty-icon" />
              <h3>{t.emptyLessonSelect || 'Select a lesson from the left list.'}</h3>
              <p>डावीकडील यादीतून कोणताही धडा निवडून शिकायला सुरुवात करा.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= PAGE STYLES ================= */}
      <style>{`
        .learn-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        /* Banner Header */
        .learn-header-banner {
          padding: 24px 28px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
          border: 1px solid #fed7aa;
          box-shadow: 0 4px 20px -4px rgba(249, 115, 22, 0.08);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .banner-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .curriculum-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffedd5;
          color: var(--primary-dark);
          font-weight: 800;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 8px;
        }
        .page-main-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }
        .page-main-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .level-stats-card {
          background: #ffffff;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          min-width: 220px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .stats-metric {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .stats-num {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
        }
        .stats-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .stats-bar-wrapper {
          height: 8px;
          background: #f1f5f9;
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .stats-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316, #22c55e);
          border-radius: var(--radius-full);
          transition: width 0.4s ease;
        }
        .stats-pct-text {
          font-size: 0.76rem;
          font-weight: 700;
          color: #64748b;
          text-align: right;
        }

        /* Level Switcher Strip */
        .level-tabs-strip {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .level-tab-chip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1.5px solid var(--border-color);
          color: #334155;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .level-tab-chip:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        .level-tab-chip.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary-dark);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.28);
        }
        .tab-chip-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .pill-num {
          background: rgba(0,0,0,0.06);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 800;
        }
        .level-tab-chip.active .pill-num {
          background: rgba(255,255,255,0.25);
          color: #ffffff;
        }
        .icon-complete {
          color: #22c55e;
        }
        .level-tab-chip.active .icon-complete {
          color: #ffffff;
        }
        .icon-lock {
          color: #94a3b8;
        }

        /* Locked Banner */
        .level-locked-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-md);
          color: #b91c1c;
          font-size: 0.9rem;
        }
        .lock-banner-icon {
          flex-shrink: 0;
        }

        /* Grid Layout */
        .learn-content-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .learn-content-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Left Column: Lessons Sidebar */
        .lessons-sidebar-panel {
          padding: 20px;
          border-radius: var(--radius-lg);
          background: #ffffff;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .sidebar-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sidebar-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sidebar-icon {
          color: var(--primary);
        }
        .sidebar-heading {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }
        .lesson-count-badge {
          background: var(--primary-light);
          color: var(--primary-dark);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 800;
        }
        .lesson-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          padding: 8px 12px;
          border-radius: var(--radius-md);
        }
        .search-icon {
          color: #94a3b8;
        }
        .search-input {
          border: none;
          background: transparent;
          width: 100%;
          outline: none;
          font-size: 0.88rem;
          color: #1e293b;
        }
        .category-chips-row {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .category-chip {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: #f8fafc;
          font-size: 0.74rem;
          font-weight: 700;
          color: #64748b;
          white-space: nowrap;
          cursor: pointer;
        }
        .category-chip.active {
          background: var(--primary-light);
          color: var(--primary-dark);
          border-color: var(--primary);
        }
        .lessons-scroll-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .lesson-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lesson-list-item:hover {
          border-color: var(--primary);
          transform: translateX(3px);
          background: #fffaf5;
        }
        .lesson-list-item.active {
          border-color: var(--primary);
          background: #fff7ed;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.12);
        }
        .item-index-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          color: #475569;
          flex-shrink: 0;
        }
        .lesson-list-item.active .item-index-badge {
          background: var(--primary);
          color: #ffffff;
        }
        .item-done-icon {
          color: #10b981;
        }
        .item-details-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-grow: 1;
        }
        .item-category-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .item-title-local {
          font-size: 0.94rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.25;
        }
        .item-title-en {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .item-arrow {
          color: #cbd5e1;
          transition: transform 0.2s ease;
        }
        .lesson-list-item.active .item-arrow {
          color: var(--primary);
          transform: translateX(2px);
        }

        /* Right Column: Viewer Hub */
        .lesson-viewer-panel {
          padding: 28px;
          border-radius: var(--radius-lg);
          background: #ffffff;
          border: 1px solid var(--border-color);
          min-height: 600px;
        }
        @media (max-width: 640px) {
          .lesson-viewer-panel {
            padding: 16px;
          }
        }
        .lesson-viewer-body {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .viewer-hero-header {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border-color);
        }
        .hero-tags-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .selected-lesson-local {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
        }
        .selected-lesson-en-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .selected-lesson-en {
          font-size: 1.12rem;
          font-weight: 700;
          color: var(--primary-dark);
        }
        .selected-lesson-desc {
          font-size: 0.92rem;
          color: #475569;
          line-height: 1.4;
        }

        /* Sub-Tabs Nav */
        .lesson-subtabs-nav {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px;
          background: #f8fafc;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
        }
        .subtab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          font-weight: 700;
          color: #475569;
          background: transparent;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .subtab-btn:hover {
          color: var(--primary);
        }
        .subtab-btn.active {
          background: #ffffff;
          color: var(--primary-dark);
          box-shadow: var(--shadow-sm);
        }
        .tab-count-pill {
          background: var(--primary-light);
          color: var(--primary-dark);
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 800;
        }

        /* Items Section */
        .tab-content-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .items-header-bar {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .section-subheading {
          font-size: 1.05rem;
          font-weight: 800;
          color: #1e293b;
        }
        .section-hint {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .lesson-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 14px;
        }
        .lesson-item-card {
          padding: 16px;
          border-radius: var(--radius-md);
          background: #fdfefe;
          border: 1.5px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .lesson-item-card:hover {
          border-color: #cbd5e1;
          box-shadow: var(--shadow-sm);
        }
        .item-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .en-word-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .en-word-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
        }
        .phonetic-guide-pill {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--primary);
        }
        .item-action-btns {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mic-practice-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 9px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mic-practice-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .mic-practice-btn.recording {
          background: #ef4444;
          color: #ffffff;
          border-color: #dc2626;
          animation: pulse 1s infinite;
        }
        .speech-score-banner {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.76rem;
          font-weight: 800;
        }
        .speech-score-banner.good {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
        .speech-score-banner.try-again {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }
        .item-meanings-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.9rem;
        }
        .meaning-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lang-tag {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 3px;
        }
        .lang-tag.mr {
          background: #f1f5f9;
          color: #334155;
        }
        .lang-tag.hi {
          background: #fff7ed;
          color: #c2410c;
        }
        .meaning-text {
          font-weight: 600;
          color: #1e293b;
        }
        .item-example-box {
          background: #f8fafc;
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          border: 1px solid #edf2f7;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.84rem;
        }
        .example-en-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #0f172a;
          font-weight: 600;
        }
        .example-local-line {
          color: #64748b;
          font-size: 0.8rem;
        }

        /* Flashcards Mode */
        .flashcards-section {
          align-items: center;
          padding: 10px 0;
        }
        .flashcards-top-bar {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 500px;
          font-size: 0.84rem;
          color: var(--text-muted);
          font-weight: 700;
        }
        .flashcard-3d-box {
          width: 100%;
          max-width: 500px;
          height: 280px;
          perspective: 1000px;
          cursor: pointer;
        }
        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flashcard-3d-box.flipped .flashcard-inner {
          transform: rotateY(180deg);
        }
        .flashcard-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
          border: 1.5px solid #fed7aa;
        }
        .flashcard-front {
          background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
        }
        .flashcard-back {
          background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
          border-color: #bbf7d0;
          transform: rotateY(180deg);
        }
        .card-badge {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .flashcard-en-word {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
        }
        .flashcard-pron {
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary);
          margin-top: 4px;
        }
        .flashcard-audio-wrap {
          margin-top: 14px;
        }
        .tap-flip-hint {
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 700;
          margin-top: 14px;
        }
        .back-meanings {
          margin-bottom: 12px;
        }
        .back-mr-meaning {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
        }
        .back-hi-meaning {
          font-size: 1rem;
          font-weight: 600;
          color: #475569;
          margin-top: 2px;
        }
        .back-example-block {
          background: rgba(255,255,255,0.8);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid #dcfce7;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .example-en-txt {
          font-weight: 700;
          color: #1e293b;
          font-size: 0.88rem;
        }
        .example-loc-txt {
          font-size: 0.8rem;
          color: #64748b;
        }
        .flashcard-nav-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
        }
        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.88rem;
          border: 1.5px solid var(--border-color);
          background: #ffffff;
          color: #334155;
          cursor: pointer;
        }
        .nav-btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
        }
        .nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .nav-btn.flip-btn {
          background: #fff7ed;
          border-color: #fed7aa;
          color: var(--primary-dark);
        }

        /* Dialogue Section */
        .dialogue-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .dialogue-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .dialogue-sub-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .btn-play-all-dialogue {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }
        .dialogue-chat-flow {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 10px 0;
        }
        .dialogue-bubble-row {
          display: flex;
          gap: 12px;
          max-width: 80%;
        }
        .dialogue-bubble-row.speaker-a {
          align-self: flex-start;
        }
        .dialogue-bubble-row.speaker-b {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .speaker-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .dialogue-bubble-row.speaker-a .speaker-avatar {
          background: #ffedd5;
          color: #c2410c;
        }
        .dialogue-bubble-row.speaker-b .speaker-avatar {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .dialogue-bubble {
          padding: 14px 16px;
          border-radius: var(--radius-lg);
          background: #ffffff;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dialogue-bubble-row.speaker-a .dialogue-bubble {
          border-top-left-radius: 4px;
          background: #fffaf5;
          border-color: #fed7aa;
        }
        .dialogue-bubble-row.speaker-b .dialogue-bubble {
          border-top-right-radius: 4px;
          background: #f8fafc;
        }
        .bubble-speaker-name {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .bubble-en-text {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
        }
        .bubble-pron {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
        }
        .bubble-local-text {
          font-size: 0.85rem;
          color: #475569;
          margin-top: 2px;
        }

        /* Grammar Tip */
        .grammar-tip-card {
          padding: 24px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
          border: 1.5px solid #fde68a;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .grammar-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .grammar-bulb-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #fef3c7;
          color: #d97706;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .grammar-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #78350f;
        }
        .rule-explanation {
          font-size: 0.95rem;
          color: #334155;
          line-height: 1.6;
        }
        .grammar-example-highlight {
          margin-top: 14px;
          background: #ffffff;
          padding: 14px 18px;
          border-radius: var(--radius-md);
          border: 1px solid #fef08a;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ex-en-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          color: #0f172a;
        }
        .ex-loc-box {
          font-size: 0.88rem;
          color: #475569;
        }

        /* Quiz Section */
        .quiz-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .quiz-header-bar {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .quiz-title-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--primary-dark);
          font-weight: 800;
          font-size: 1.05rem;
        }
        .quiz-intro-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .quiz-questions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .quiz-question-card {
          padding: 20px;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1.5px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .question-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .q-number-pill {
          background: var(--primary-light);
          color: var(--primary-dark);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 800;
        }
        .q-text {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
        }
        .quiz-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        @media (max-width: 600px) {
          .quiz-options-grid {
            grid-template-columns: 1fr;
          }
        }
        .quiz-option-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .quiz-option-btn:hover {
          border-color: var(--primary);
          background: #fff7ed;
        }
        .quiz-option-btn.selected {
          border-color: var(--primary);
          background: #fff7ed;
          color: var(--primary-dark);
          font-weight: 700;
        }
        .quiz-option-btn.correct {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
          font-weight: 700;
        }
        .quiz-option-btn.wrong {
          border-color: #ef4444;
          background: #fef2f2;
          color: #b91c1c;
        }
        .option-bullet {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          flex-shrink: 0;
        }
        .quiz-option-btn.selected .option-bullet {
          background: var(--primary);
          color: #ffffff;
        }
        .quiz-option-btn.correct .option-bullet {
          background: #10b981;
          color: #ffffff;
        }
        .quiz-option-btn.wrong .option-bullet {
          background: #ef4444;
          color: #ffffff;
        }
        .quiz-feedback-box {
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 700;
        }
        .quiz-feedback-box.correct {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
        .quiz-feedback-box.wrong {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }
        .quiz-actions-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 10px;
        }
        .check-answers-btn, .retry-quiz-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.95rem;
        }

        /* Footer Completion Action */
        .lesson-footer-actions {
          padding: 20px;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .mark-done-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
        }
        .completed-success-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #059669;
          background: #ecfdf5;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          border: 1.5px solid #a7f3d0;
        }
        .completed-subtext {
          font-size: 0.78rem;
          color: #047857;
          margin-top: 2px;
        }

        /* Empty State */
        .empty-lesson-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          gap: 12px;
          color: #64748b;
        }
        .empty-icon {
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default Learn;
