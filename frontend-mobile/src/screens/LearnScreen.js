import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
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
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import { INITIAL_LESSONS } from '../data/lessonsData';
import { api } from '../config/api';

const COMPLETED_LESSONS_KEY = '@english_shika_completed_lessons';

export default function LearnScreen() {
  const { t, language, speechRate, userLevel } = useApp();

  const [activeLevel, setActiveLevel] = useState(1);
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [completedIds, setCompletedIds] = useState([1]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab'); // 'vocab' | 'flashcards' | 'dialogue' | 'grammar' | 'quiz'

  // Flashcards state
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Lesson Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load completed lessons
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem(COMPLETED_LESSONS_KEY);
        if (stored) setCompletedIds(JSON.parse(stored));
      } catch (e) {}
    };
    loadProgress();
  }, []);

  // Fetch online updates
  useEffect(() => {
    const fetchApiLessons = async () => {
      try {
        const res = await api.get(`/lessons?level=${activeLevel}`);
        if (res.data?.data && res.data.data.length > 0) {
          setLessons(res.data.data);
        }
      } catch (e) {}
    };
    fetchApiLessons();
  }, [activeLevel]);

  const categories = ['All', 'Basics', 'Phrases', 'Grammar', 'Conversation', 'Work'];

  const filteredLessons = lessons.filter(l => {
    const matchesLevel = l.level === activeLevel;
    const matchesCategory =
      selectedCategory === 'All' ||
      (l.category && l.category.toLowerCase() === selectedCategory.toLowerCase());
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (l.title_en && l.title_en.toLowerCase().includes(q)) ||
      (l.title_mr && l.title_mr.includes(q)) ||
      (l.title_hi && l.title_hi.includes(q));
    return matchesLevel && matchesCategory && matchesSearch;
  });

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
        await api.post('/progress/complete-lesson', { lessonId }).catch(() => {});
      } catch (e) {}
    }
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
                      {language === 'mr' ? lesson.title_mr : language === 'hi' ? lesson.title_hi : lesson.title_mr}
                    </Text>
                    <View style={styles.lessonMetaRow}>
                      <View style={styles.metaTag}>
                        <Text style={styles.metaTagText}>{lesson.category || 'Basics'}</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.metaDetailText}>
                        {lesson.vocabulary ? `${lesson.vocabulary.length} words` : '5 words'}
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
                  {language === 'mr' ? selectedLesson.title_mr : selectedLesson.title_hi || selectedLesson.title_mr}
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
                { key: 'flashcards', label: language === 'mr' ? 'फ्लॅशकार्ड' : 'Cards', icon: Layers },
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

            {/* Tab 1: Vocabulary List */}
            {activeTab === 'vocab' && (
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                {(selectedLesson.vocabulary || [
                  { en: 'Hello', mr: 'नमस्कार', hi: 'नमस्ते', pronunciation: 'हॅलो', example: 'Hello, how are you?' },
                  { en: 'Good morning', mr: 'शुभ सकाळ', hi: 'सुप्रभात', pronunciation: 'गुड मॉर्निंग', example: 'Good morning, sir.' },
                  { en: 'Thank you', mr: 'धन्यवाद', hi: 'धन्यवाद', pronunciation: 'थँक यू', example: 'Thank you very much.' },
                  { en: 'Please', mr: 'कृपया', hi: 'कृपया', pronunciation: 'प्लीज', example: 'Please help me.' },
                ]).map((item, idx) => (
                  <View key={idx} style={styles.vocabDetailCard}>
                    <View style={styles.vocabDetailTop}>
                      <View style={styles.vocabTextCol}>
                        <Text style={styles.vocabEnWord}>{item.en || item.word}</Text>
                        <Text style={styles.vocabPronunciation}>({item.pronunciation || 'उच्चार'})</Text>
                        <Text style={styles.vocabLocMeaning}>
                          {language === 'mr' ? item.mr || item.marathi : language === 'hi' ? item.hi || item.hindi : item.mr}
                        </Text>
                      </View>
                      <AudioButton text={item.en || item.word} size={42} />
                    </View>
                    {item.example && (
                      <View style={styles.vocabExampleBox}>
                        <Text style={styles.vocabExampleLabel}>{language === 'mr' ? 'उदा:' : 'Ex:'}</Text>
                        <Text style={styles.vocabExampleText}>{item.example}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Tab 2: Flashcards */}
            {activeTab === 'flashcards' && (
              <View style={styles.flashcardWrapper}>
                {(() => {
                  const vocabList = selectedLesson.vocabulary || [
                    { en: 'Hello', mr: 'नमस्कार', pronunciation: 'हॅलो', example: 'Hello, friend!' },
                    { en: 'Thank you', mr: 'धन्यवाद', pronunciation: 'थँक यू', example: 'Thank you for your help.' },
                  ];
                  const card = vocabList[flashcardIdx] || vocabList[0];
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
                            <Text style={styles.flashcardMainText}>{card.en || card.word}</Text>
                            <Text style={styles.flashcardSubText}>({card.pronunciation || ''})</Text>
                            <AudioButton text={card.en || card.word} size={44} />
                          </View>
                        ) : (
                          <View style={[styles.flashcardInner, styles.flashcardInnerFlipped]}>
                            <Text style={styles.flashcardHint}>
                              {language === 'mr' ? 'मराठी अर्थ' : 'Meaning'}
                            </Text>
                            <Text style={styles.flashcardMeaningText}>
                              {language === 'mr' ? card.mr || card.marathi : card.hi || card.mr}
                            </Text>
                            {card.example && (
                              <Text style={styles.flashcardExampleText}>"{card.example}"</Text>
                            )}
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

            {/* Tab 3: Grammar Tips */}
            {activeTab === 'grammar' && (
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <View style={styles.grammarBox}>
                  <Lightbulb size={24} color={COLORS.accentAmberDark} />
                  <Text style={styles.grammarHeading}>
                    {selectedLesson.grammar_rule_title || 'सोपे व्याकरण नियम (Grammar Rule)'}
                  </Text>
                  <Text style={styles.grammarBody}>
                    {selectedLesson.grammar_rule_desc ||
                      'वाक्य बनवताना नेहमी: कर्ता (Subject) + क्रियापद (Verb) + कर्म (Object) हा क्रम ठेवावा. उदा: I (Subject) + speak (Verb) + English (Object).'}
                  </Text>
                </View>
              </ScrollView>
            )}

            {/* Tab 4: Quick Quiz */}
            {activeTab === 'quiz' && (
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                {(selectedLesson.quiz || [
                  {
                    q: "'Thank you' चा मराठी अर्थ काय?",
                    options: ['धन्यवाद', 'नमस्कार', 'कृपया', 'माफ करा'],
                    ans: 0,
                  },
                  {
                    q: "योग्य इंग्रजी शब्द निवडा: 'पुस्तक'",
                    options: ['Pen', 'Book', 'Water', 'Table'],
                    ans: 1,
                  },
                ]).map((quizItem, qIdx) => {
                  const userAns = quizAnswers[qIdx];
                  return (
                    <View key={qIdx} style={styles.quizItemCard}>
                      <Text style={styles.quizQText}>
                        {qIdx + 1}. {quizItem.q || quizItem.question}
                      </Text>
                      <View style={styles.quizOptionsCol}>
                        {quizItem.options.map((opt, optIdx) => {
                          const isSelected = userAns === optIdx;
                          const isCorrect = optIdx === (quizItem.ans !== undefined ? quizItem.ans : quizItem.correct);
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
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accentGreen,
  },
  mainTitle: {
    fontSize: 20,
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
    flexDirection: 'row',
    marginBottom: 10,
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
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
  },
  categoryBtnActive: {
    backgroundColor: COLORS.secondaryLight,
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
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    gap: 8,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMain,
    padding: 0,
  },
  lessonsList: {
    gap: 10,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: 12,
  },
  lessonCardDone: {
    borderLeftColor: COLORS.accentGreen,
  },
  lessonNumCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumCircleDone: {
    backgroundColor: COLORS.accentGreenLight,
  },
  lessonNumText: {
    fontSize: 13,
    fontWeight: '800',
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
    marginTop: 4,
  },
  metaTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  metaDot: {
    color: COLORS.textLight,
  },
  metaDetailText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: RADIUS.full,
    backgroundColor: '#F1F5F9',
  },
  modalTitleCol: {
    flex: 1,
    paddingHorizontal: 10,
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
    gap: 4,
    backgroundColor: COLORS.accentGreen,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  modalDoneBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
  },
  modalTabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
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
    gap: 10,
    paddingBottom: 60,
  },
  vocabDetailCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  vocabDetailTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vocabTextCol: {
    flex: 1,
  },
  vocabEnWord: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  vocabPronunciation: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 1,
  },
  vocabLocMeaning: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
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
    fontWeight: '800',
    color: COLORS.secondary,
  },
  vocabExampleText: {
    fontSize: 12,
    color: COLORS.textMain,
    flex: 1,
  },
  flashcardWrapper: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  flashcardCenter: {
    alignItems: 'center',
    gap: 16,
  },
  flashcardBox: {
    width: '100%',
    minHeight: 220,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.borderAmber,
    ...SHADOWS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashcardInner: {
    alignItems: 'center',
    gap: 8,
  },
  flashcardInnerFlipped: {
    backgroundColor: COLORS.secondaryLight,
    width: '100%',
    padding: 20,
    borderRadius: RADIUS.md,
  },
  flashcardHint: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  flashcardMainText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textMain,
  },
  flashcardSubText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  flashcardMeaningText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  flashcardExampleText: {
    fontSize: 13,
    color: COLORS.textMain,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  flashcardControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  fcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fcBtnDisabled: {
    opacity: 0.4,
  },
  fcBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  fcCounter: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  grammarBox: {
    backgroundColor: COLORS.accentAmberLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
  },
  grammarHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.accentAmberDark,
  },
  grammarBody: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 20,
  },
  quizItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
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
    backgroundColor: COLORS.accentRedLight,
    borderColor: COLORS.accentRed,
  },
  quizOptText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  quizSubmitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: 10,
  },
  quizSubmitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
});
