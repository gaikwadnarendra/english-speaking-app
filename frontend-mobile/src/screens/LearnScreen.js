import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  Layers,
  MessageSquare,
  Lightbulb,
  HelpCircle,
  Play,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  X,
  Award,
  ChevronRight,
  Volume2,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import { INITIAL_LESSONS } from '../data/lessonsData';
import { api } from '../config/api';

const COMPLETED_LESSONS_KEY = '@english_shika_completed_lessons';
const LESSONS_CACHE_PREFIX = '@english_shika_lessons_cache_lvl_';

export default function LearnScreen() {
  const { t, language, speechRate, userLevel } = useApp();
  const { completeTask } = useProgress();

  const [activeLevel, setActiveLevel] = useState(1);
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [completedIds, setCompletedIds] = useState([1]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab'); // 'vocab' | 'dialogue' | 'flashcards' | 'grammar' | 'quiz'

  // Flashcards state
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Lesson Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load completed lessons & cached lessons from local storage
  useEffect(() => {
    const loadProgressAndCache = async () => {
      try {
        const stored = await AsyncStorage.getItem(COMPLETED_LESSONS_KEY);
        if (stored) setCompletedIds(JSON.parse(stored));

        const cached = await AsyncStorage.getItem(`${LESSONS_CACHE_PREFIX}${activeLevel}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLessons(prev => {
              const updated = [...prev];
              parsed.forEach(pL => {
                const idx = updated.findIndex(u => u.id === pL.id);
                if (idx >= 0) updated[idx] = { ...updated[idx], ...pL };
                else updated.push(pL);
              });
              return updated;
            });
          }
        }
      } catch (e) {}
    };
    loadProgressAndCache();
  }, [activeLevel]);

  // Background fetch online lessons without freezing UI
  useEffect(() => {
    let isMounted = true;
    const fetchApiLessons = async () => {
      try {
        const res = await api.get(`/lessons?level=${activeLevel}`, { timeout: 8000 });
        if (isMounted && res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const apiLessons = res.data.data;
          setLessons(prev => {
            const updated = [...prev];
            apiLessons.forEach(apiL => {
              const idx = updated.findIndex(u => u.id === apiL.id);
              if (idx >= 0) {
                updated[idx] = { ...updated[idx], ...apiL };
              } else {
                updated.push(apiL);
              }
            });
            return updated;
          });
          AsyncStorage.setItem(`${LESSONS_CACHE_PREFIX}${activeLevel}`, JSON.stringify(apiLessons)).catch(() => {});
        }
      } catch (e) {
        // Silently use resilient local dataset with zero lag
      }
    };
    fetchApiLessons();
    return () => {
      isMounted = false;
    };
  }, [activeLevel]);

  const categories = ['All', 'Basics', 'Phrases', 'Grammar', 'Conversation', 'Work'];

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchesLevel = l.level === activeLevel;
      const matchesCategory =
        selectedCategory === 'All' ||
        (l.category && l.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (l.title_en && l.title_en.toLowerCase().includes(q)) ||
        (l.title_mr && l.title_mr.includes(q)) ||
        (l.title_hi && l.title_hi.includes(q));
      return matchesLevel && matchesCategory && matchesSearch;
    });
  }, [lessons, activeLevel, selectedCategory, searchQuery]);

  const handleOpenLesson = (lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('vocab');
    setFlashcardIdx(0);
    setIsFlipped(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleMarkComplete = async (lessonId) => {
    if (!completedIds.includes(lessonId)) {
      const updated = [...completedIds, lessonId];
      setCompletedIds(updated);
      try {
        await AsyncStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(updated));
        await api.post(`/lessons/${lessonId}/complete`).catch(() => {});
        if (activeLevel === 1) completeTask(1, 'learn_l1');
        if (activeLevel === 2) completeTask(2, 'learn_l2');
        if (activeLevel === 3) completeTask(3, 'learn_l3');
      } catch (e) {}
    }
  };

  // Helper to extract lesson words array safely
  const getLessonWords = (lesson) => {
    if (!lesson) return [];
    if (Array.isArray(lesson.content)) return lesson.content;
    if (Array.isArray(lesson.vocabulary)) return lesson.vocabulary;
    if (Array.isArray(lesson.words)) return lesson.words;
    return [];
  };

  // Helper to extract dialogue array safely
  const getLessonDialogues = (lesson) => {
    if (!lesson) return [];
    if (Array.isArray(lesson.dialogue)) return lesson.dialogue;
    if (Array.isArray(lesson.dialogues)) return lesson.dialogues;
    return [];
  };

  // Helper to extract quiz array safely
  const getLessonQuizzes = (lesson) => {
    if (!lesson) return [];
    if (Array.isArray(lesson.quiz)) return lesson.quiz;
    if (Array.isArray(lesson.quizzes)) return lesson.quizzes;
    return [];
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Screen Title & Subtitle */}
        <View style={styles.titleBlock}>
          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <BookOpen size={13} color={COLORS.primary} />
              <Text style={styles.badgePillText}>{language === 'mr' ? 'अभ्यासक्रम' : 'Course Curriculum'}</Text>
            </View>
            <Text style={styles.progressCounterText}>
              {completedIds.length} {language === 'mr' ? 'धडे पूर्ण' : 'lessons completed'}
            </Text>
          </View>
          <Text style={styles.mainTitle}>{language === 'mr' ? 'इंग्रजी धडे व व्याकरण' : 'English Lessons & Grammar'}</Text>
          <Text style={styles.mainSub}>
            {language === 'mr'
              ? 'सोप्या मराठीतून मुळाक्षरे, वाक्यरचना आणि दैनंदिन संभाषण शिका.'
              : 'Learn English step-by-step from zero to fluent speaking.'}
          </Text>
        </View>

        {/* Level Selector Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelRow}>
          {[1, 2, 3, 4, 5].map((lvl) => {
            const isActive = activeLevel === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                style={[styles.levelBtn, isActive && styles.levelBtnActive]}
                onPress={() => setActiveLevel(lvl)}
                activeOpacity={0.7}
              >
                <Text style={[styles.levelBtnText, isActive && styles.levelBtnTextActive]}>
                  {language === 'mr' ? `लेव्हल ${lvl}` : `Level ${lvl}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Category Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryBtnText, isActive && styles.categoryBtnTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'mr' ? 'धडा किंवा विषय शोधा...' : 'Search lessons...'}
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsList}>
          {filteredLessons.length === 0 ? (
            <View style={styles.emptyCard}>
              <BookOpen size={36} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>
                {language === 'mr' ? 'कोणतेही धडे आढळले नाहीत' : 'No lessons found for this filter'}
              </Text>
            </View>
          ) : (
            filteredLessons.map((lesson, idx) => {
              const isDone = completedIds.includes(lesson.id);
              const wordsCount = getLessonWords(lesson).length;
              return (
                <TouchableOpacity
                  key={lesson.id || idx}
                  style={[styles.lessonCard, isDone && styles.lessonCardDone]}
                  onPress={() => handleOpenLesson(lesson)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.lessonNumCircle, isDone && styles.lessonNumCircleDone]}>
                    {isDone ? (
                      <CheckCircle2 size={16} color={COLORS.accentGreen} />
                    ) : (
                      <Text style={styles.lessonNumText}>{lesson.id || idx + 1}</Text>
                    )}
                  </View>

                  <View style={styles.lessonInfoCol}>
                    <Text style={styles.lessonTitleEn}>{lesson.title_en}</Text>
                    <Text style={styles.lessonTitleLoc}>
                      {language === 'mr' ? lesson.title_mr : language === 'hi' ? (lesson.title_hi || lesson.title_mr) : lesson.title_mr}
                    </Text>
                    <View style={styles.lessonMetaRow}>
                      <View style={styles.metaTag}>
                        <Text style={styles.metaTagText}>{lesson.category || 'Basics'}</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.metaDetailText}>
                        {wordsCount > 0 ? `${wordsCount} words` : 'Interactive'}
                      </Text>
                    </View>
                  </View>

                  <ChevronRight size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Interactive Lesson Modal Viewer */}
      {selectedLesson && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedLesson(null)}
        >
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedLesson(null)}
                activeOpacity={0.7}
              >
                <X size={20} color={COLORS.textMain} />
              </TouchableOpacity>

              <View style={styles.modalTitleCol}>
                <Text style={styles.modalLessonTitle} numberOfLines={1}>
                  {selectedLesson.title_en}
                </Text>
                <Text style={styles.modalLessonSub} numberOfLines={1}>
                  {language === 'mr' ? selectedLesson.title_mr : (selectedLesson.title_hi || selectedLesson.title_mr)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalDoneBtn}
                onPress={() => {
                  handleMarkComplete(selectedLesson.id);
                  setSelectedLesson(null);
                }}
              >
                <CheckCircle2 size={16} color={COLORS.white} />
                <Text style={styles.modalDoneBtnText}>{language === 'mr' ? 'पूर्ण' : 'Done'}</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Tabs Bar */}
            <View style={styles.modalTabsRow}>
              {[
                { key: 'vocab', label: language === 'mr' ? 'शब्द' : 'Words', icon: Sparkles },
                { key: 'dialogue', label: language === 'mr' ? 'संभाषण' : 'Dialogue', icon: MessageSquare },
                { key: 'flashcards', label: language === 'mr' ? 'कार्ड' : 'Cards', icon: Layers },
                { key: 'grammar', label: language === 'mr' ? 'नियम' : 'Rules', icon: Lightbulb },
                { key: 'quiz', label: language === 'mr' ? 'क्विझ' : 'Quiz', icon: Award },
              ].map(tItem => {
                const isActive = activeTab === tItem.key;
                const TabIcon = tItem.icon;
                return (
                  <TouchableOpacity
                    key={tItem.key}
                    style={[styles.modalTabBtn, isActive && styles.modalTabBtnActive]}
                    onPress={() => setActiveTab(tItem.key)}
                  >
                    <TabIcon size={14} color={isActive ? COLORS.primary : COLORS.textMuted} />
                    <Text style={[styles.modalTabBtnText, isActive && styles.modalTabBtnTextActive]}>
                      {tItem.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tab 1: Vocabulary Words */}
            {activeTab === 'vocab' && (
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                {getLessonWords(selectedLesson).map((item, idx) => {
                  const enWord = item.en || item.word || item.english || '';
                  const pron = item.pron || item.pronunciation || '';
                  const locWord = language === 'hi' ? (item.hi || item.mr || item.marathi) : (item.mr || item.marathi || item.hi);
                  const example = item.example_en || item.example || (item.examples?.[0]?.english) || '';

                  return (
                    <View key={idx} style={styles.vocabDetailCard}>
                      <View style={styles.vocabDetailTop}>
                        <View style={styles.vocabTextCol}>
                          <Text style={styles.vocabEnWord}>{enWord}</Text>
                          {pron ? <Text style={styles.vocabPronunciation}>({pron})</Text> : null}
                          <Text style={styles.vocabLocMeaning}>{locWord}</Text>
                        </View>
                        <AudioButton text={enWord} size={42} />
                      </View>
                      {example ? (
                        <View style={styles.vocabExampleBox}>
                          <Text style={styles.vocabExampleLabel}>{language === 'mr' ? 'उदा:' : 'Ex:'}</Text>
                          <Text style={styles.vocabExampleText}>{example}</Text>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </ScrollView>
            )}

            {/* Tab 2: Dialogue Conversation */}
            {activeTab === 'dialogue' && (
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                {getLessonDialogues(selectedLesson).length === 0 ? (
                  <View style={styles.emptyCard}>
                    <MessageSquare size={32} color={COLORS.textMuted} />
                    <Text style={styles.emptyText}>या धड्यासाठी संभाषण उपलब्ध नाही.</Text>
                  </View>
                ) : (
                  getLessonDialogues(selectedLesson).map((d, dIdx) => (
                    <View key={dIdx} style={styles.dialogueBubble}>
                      <View style={styles.dialogueTopRow}>
                        <Text style={styles.dialogueSpeaker}>{d.speaker || 'Speaker'}:</Text>
                        <AudioButton text={d.text_en || d.english || ''} size={30} />
                      </View>
                      <Text style={styles.dialogueTextEn}>{d.text_en || d.english}</Text>
                      {d.pron ? <Text style={styles.dialoguePron}>({d.pron})</Text> : null}
                      <Text style={styles.dialogueTextLoc}>
                        {language === 'hi' ? (d.text_hi || d.text_mr) : (d.text_mr || d.text_hi)}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>
            )}

            {/* Tab 3: Flashcards */}
            {activeTab === 'flashcards' && (
              <View style={styles.flashcardWrapper}>
                {(() => {
                  const vocabList = getLessonWords(selectedLesson);
                  if (vocabList.length === 0) {
                    return (
                      <View style={styles.emptyCard}>
                        <Text style={styles.emptyText}>कार्ड्स उपलब्ध नाहीत.</Text>
                      </View>
                    );
                  }
                  const card = vocabList[flashcardIdx] || vocabList[0];
                  const enWord = card.en || card.word || card.english || '';
                  const locWord = language === 'hi' ? (card.hi || card.mr) : (card.mr || card.marathi || card.hi);
                  const pron = card.pron || card.pronunciation || '';
                  const example = card.example_en || card.example || '';

                  return (
                    <View style={styles.flashcardCenter}>
                      <TouchableOpacity
                        style={styles.flashcardBox}
                        onPress={() => setIsFlipped(!isFlipped)}
                        activeOpacity={0.9}
                      >
                        {!isFlipped ? (
                          <View style={styles.flashcardInner}>
                            <Text style={styles.flashcardHint}>
                              {language === 'mr' ? '👆 अर्थ पाहण्यासाठी कार्डवर टॅप करा' : '👆 Tap card to flip'}
                            </Text>
                            <Text style={styles.flashcardMainText}>{enWord}</Text>
                            {pron ? <Text style={styles.flashcardSubText}>({pron})</Text> : null}
                            <View style={{ marginTop: 12 }}>
                              <AudioButton text={enWord} size={44} />
                            </View>
                          </View>
                        ) : (
                          <View style={[styles.flashcardInner, styles.flashcardInnerFlipped]}>
                            <Text style={styles.flashcardHint}>
                              {language === 'mr' ? 'मराठी / हिंदी अर्थ' : 'Meaning'}
                            </Text>
                            <Text style={styles.flashcardMeaningText}>{locWord}</Text>
                            {example ? (
                              <Text style={styles.flashcardExampleText}>"{example}"</Text>
                            ) : null}
                          </View>
                        )}
                      </TouchableOpacity>

                      {/* Controls */}
                      <View style={styles.flashcardControls}>
                        <TouchableOpacity
                          style={[styles.fcBtn, flashcardIdx === 0 && styles.fcBtnDisabled]}
                          disabled={flashcardIdx === 0}
                          onPress={() => {
                            setFlashcardIdx(prev => Math.max(0, prev - 1));
                            setIsFlipped(false);
                          }}
                        >
                          <ArrowLeft size={18} color={COLORS.primary} />
                          <Text style={styles.fcBtnText}>{language === 'mr' ? 'मागे' : 'Prev'}</Text>
                        </TouchableOpacity>

                        <Text style={styles.fcCounter}>
                          {flashcardIdx + 1} / {vocabList.length}
                        </Text>

                        <TouchableOpacity
                          style={[styles.fcBtn, flashcardIdx >= vocabList.length - 1 && styles.fcBtnDisabled]}
                          disabled={flashcardIdx >= vocabList.length - 1}
                          onPress={() => {
                            setFlashcardIdx(prev => Math.min(vocabList.length - 1, prev + 1));
                            setIsFlipped(false);
                          }}
                        >
                          <Text style={styles.fcBtnText}>{language === 'mr' ? 'पुढे' : 'Next'}</Text>
                          <ArrowRight size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })()}
              </View>
            )}

            {/* Tab 4: Grammar Tips */}
            {activeTab === 'grammar' && (
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                {(() => {
                  const gTip = selectedLesson.grammar_tip;
                  const gTitle = typeof gTip === 'object'
                    ? (language === 'hi' ? (gTip?.title_hi || gTip?.title_mr) : (gTip?.title_mr || gTip?.title_en))
                    : (selectedLesson.grammar_rule_title || 'सोपे व्याकरण नियम (Grammar Rules)');
                  
                  const gRule = typeof gTip === 'object'
                    ? (language === 'hi' ? (gTip?.rule_hi || gTip?.rule_mr) : (gTip?.rule_mr || gTip?.rule_en))
                    : (selectedLesson.grammar_rule_desc || selectedLesson.description_mr || 'वाक्यरचना समजून घ्या आणि सराव करा.');

                  const gEx = typeof gTip === 'object' ? gTip?.example_en : null;

                  return (
                    <View style={styles.grammarBox}>
                      <Lightbulb size={26} color={COLORS.accentAmberDark} />
                      <Text style={styles.grammarHeading}>{gTitle || 'व्याकरण नियम'}</Text>
                      <Text style={styles.grammarBody}>{gRule}</Text>
                      {gEx ? (
                        <View style={styles.grammarExBox}>
                          <Text style={styles.grammarExLabel}>💡 उदाहरण (Example):</Text>
                          <Text style={styles.grammarExText}>{gEx}</Text>
                        </View>
                      ) : null}
                    </View>
                  );
                })()}
              </ScrollView>
            )}

            {/* Tab 5: Quick Quiz */}
            {activeTab === 'quiz' && (
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                {getLessonQuizzes(selectedLesson).map((quizItem, qIdx) => {
                  const userAns = quizAnswers[qIdx];
                  const qText = quizItem.question_mr || quizItem.question_hi || quizItem.question_en || quizItem.q || quizItem.question || `प्रश्न ${qIdx + 1}`;
                  const optionsList = Array.isArray(quizItem.options) ? quizItem.options : [];
                  const correctIdx = quizItem.correct !== undefined ? quizItem.correct : (quizItem.ans !== undefined ? quizItem.ans : 0);

                  return (
                    <View key={qIdx} style={styles.quizItemCard}>
                      <Text style={styles.quizQText}>
                        {qIdx + 1}. {qText}
                      </Text>
                      <View style={styles.quizOptionsCol}>
                        {optionsList.map((opt, optIdx) => {
                          const isSelected = userAns === optIdx;
                          const isCorrect = optIdx === correctIdx;
                          let optStyle = styles.quizOptBtn;
                          if (quizSubmitted) {
                            if (isCorrect) optStyle = [styles.quizOptBtn, styles.quizOptBtnCorrect];
                            else if (isSelected && !isCorrect) optStyle = [styles.quizOptBtn, styles.quizOptBtnWrong];
                          } else if (isSelected) {
                            optStyle = [styles.quizOptBtn, styles.quizOptBtnSelected];
                          }
                          return (
                            <TouchableOpacity
                              key={optIdx}
                              style={optStyle}
                              onPress={() => {
                                if (!quizSubmitted) {
                                  setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                }
                              }}
                            >
                              <Text style={styles.quizOptText}>{opt}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      {quizSubmitted && quizItem.explanation_mr ? (
                        <Text style={styles.quizExpText}>💡 {quizItem.explanation_mr}</Text>
                      ) : null}
                    </View>
                  );
                })}

                <TouchableOpacity
                  style={styles.quizSubmitBtn}
                  onPress={() => {
                    setQuizSubmitted(true);
                    handleMarkComplete(selectedLesson.id);
                  }}
                >
                  <Text style={styles.quizSubmitBtnText}>
                    {quizSubmitted ? (language === 'mr' ? '✓ तपासले!' : '✓ Checked!') : (language === 'mr' ? 'उत्तरे तपासा' : 'Submit Answers')}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  titleBlock: {
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderAmber,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  progressCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentGreen,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  mainSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  levelRow: {
    marginVertical: SPACING.sm,
  },
  levelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  levelBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  levelBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  levelBtnTextActive: {
    color: COLORS.white,
  },
  categoryRow: {
    marginBottom: SPACING.md,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  categoryBtnActive: {
    backgroundColor: COLORS.secondaryLight,
    borderColor: COLORS.secondary,
  },
  categoryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  categoryBtnTextActive: {
    color: COLORS.secondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMain,
  },
  lessonsList: {
    gap: 10,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    ...SHADOWS.card,
  },
  lessonCardDone: {
    borderColor: COLORS.accentGreenLight,
  },
  lessonNumCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonNumCircleDone: {
    backgroundColor: COLORS.accentGreenLight,
  },
  lessonNumText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  lessonInfoCol: {
    flex: 1,
  },
  lessonTitleEn: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  lessonTitleLoc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  lessonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  metaTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  metaDot: {
    color: COLORS.textLight,
  },
  metaDetailText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalTitleCol: {
    flex: 1,
  },
  modalLessonTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  modalLessonSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  modalDoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  modalDoneBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  modalTabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
  },
  modalTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  modalTabBtnActive: {
    borderBottomColor: COLORS.primary,
  },
  modalTabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  modalTabBtnTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  modalScrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
    gap: 10,
  },
  vocabDetailCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  vocabDetailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vocabTextCol: {
    flex: 1,
  },
  vocabEnWord: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textMain,
  },
  vocabPronunciation: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginVertical: 2,
  },
  vocabLocMeaning: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  vocabExampleBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    gap: 4,
  },
  vocabExampleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  vocabExampleText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    flex: 1,
  },
  dialogueBubble: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  dialogueTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dialogueSpeaker: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  dialogueTextEn: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  dialoguePron: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginVertical: 2,
  },
  dialogueTextLoc: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  flashcardWrapper: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashcardCenter: {
    width: '100%',
    alignItems: 'center',
  },
  flashcardBox: {
    width: '100%',
    minHeight: 240,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.card,
  },
  flashcardInner: {
    alignItems: 'center',
  },
  flashcardInnerFlipped: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
  },
  flashcardHint: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  flashcardMainText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  flashcardSubText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  flashcardMeaningText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  flashcardExampleText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  flashcardControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  fcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  fcBtnDisabled: {
    opacity: 0.3,
  },
  fcBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  fcCounter: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  grammarBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
    ...SHADOWS.card,
  },
  grammarHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textMain,
  },
  grammarBody: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  grammarExBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: RADIUS.md,
    marginTop: 8,
  },
  grammarExLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  grammarExText: {
    fontSize: 13,
    color: COLORS.textMain,
    fontWeight: '600',
    marginTop: 2,
  },
  quizItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
    ...SHADOWS.card,
  },
  quizQText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  quizOptionsCol: {
    gap: 6,
  },
  quizOptBtn: {
    padding: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quizOptBtnSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  quizOptBtnCorrect: {
    backgroundColor: COLORS.accentGreenLight,
    borderColor: COLORS.accentGreen,
  },
  quizOptBtnWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  quizOptText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  quizExpText: {
    fontSize: 11,
    color: COLORS.accentGreen,
    fontWeight: '700',
  },
  quizSubmitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  quizSubmitBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
