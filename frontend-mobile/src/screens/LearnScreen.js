import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab'); // 'vocab' | 'flashcards' | 'dialogue' | 'grammar' | 'quiz'

  // Flashcards state
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Lesson Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load completed lessons from AsyncStorage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem(COMPLETED_LESSONS_KEY);
        if (stored) {
          setCompletedIds(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load completed lessons', e);
      }
    };
    loadProgress();
  }, []);

  // Sync with API if available
  useEffect(() => {
    const fetchApiLessons = async () => {
      try {
        const res = await api.get('/api/lessons');
        if (res.data?.data && res.data.data.length > 0) {
          setLessons(res.data.data);
        }
      } catch (err) {
        // Fallback gracefully to offline INITIAL_LESSONS
      }
    };
    fetchApiLessons();
  }, []);

  // Level Tabs
  const levelTabs = [
    { id: 1, label: language === 'mr' ? 'स्तर १: नवशिक्या' : language === 'hi' ? 'स्तर १: शुरुआती' : 'L1: Beginner', badge: 'L1' },
    { id: 2, label: language === 'mr' ? 'स्तर २: दैनंदिन' : language === 'hi' ? 'स्तर २: दैनिक' : 'L2: Daily Life', badge: 'L2' },
    { id: 3, label: language === 'mr' ? 'स्तर ३: वाक्यरचना' : language === 'hi' ? 'स्तर ३: वाक्य' : 'L3: Patterns', badge: 'L3' },
    { id: 4, label: language === 'mr' ? 'स्तर ४: संभाषण' : language === 'hi' ? 'स्तर ४: बातचीत' : 'L4: Fluent', badge: 'L4' },
    { id: 5, label: language === 'mr' ? 'स्तर ५: प्रगत' : language === 'hi' ? 'स्तर ५: उन्नत' : 'L5: Master', badge: 'L5' },
  ];

  // Filter lessons for active level
  const levelLessons = useMemo(() => {
    return lessons.filter(l => (l.level || 1) === activeLevel);
  }, [lessons, activeLevel]);

  // Unique categories in this level
  const categories = useMemo(() => {
    const cats = new Set();
    levelLessons.forEach(l => {
      if (l.category) cats.add(l.category);
    });
    return ['all', ...Array.from(cats)];
  }, [levelLessons]);

  // Search & category filtered
  const filteredLessons = useMemo(() => {
    return levelLessons.filter(l => {
      const titleMatch =
        (l.title_en && l.title_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (l.title_mr && l.title_mr.includes(searchQuery)) ||
        (l.title_hi && l.title_hi.includes(searchQuery));
      const catMatch = selectedCategory === 'all' || l.category === selectedCategory;
      return titleMatch && catMatch;
    });
  }, [levelLessons, searchQuery, selectedCategory]);

  const completedInLevelCount = levelLessons.filter(l => completedIds.includes(l.id)).length;
  const levelProgress = levelLessons.length > 0 ? Math.round((completedInLevelCount / levelLessons.length) * 100) : 0;

  // Open Lesson Detail Modal
  const openLesson = (lesson) => {
    setSelectedLesson(lesson);
    setFlashcardIdx(0);
    setIsFlipped(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveTab('vocab');
  };

  const closeLesson = () => {
    Speech.stop();
    setSelectedLesson(null);
  };

  // Mark lesson as complete
  const markComplete = async (lessonId) => {
    if (!completedIds.includes(lessonId)) {
      const updated = [...completedIds, lessonId];
      setCompletedIds(updated);
      try {
        await AsyncStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(updated));
        await api.post(`/api/lessons/${lessonId}/complete`).catch(() => {});
      } catch (e) {}
    }
    Alert.alert(
      language === 'mr' ? 'अभिनंदन! 🎉' : language === 'hi' ? 'बधाई हो! 🎉' : 'Congratulations! 🎉',
      language === 'mr'
        ? 'तुम्ही हा धडा यशस्वीरीत्या पूर्ण केला आहे! (+२० XP)'
        : language === 'hi'
        ? 'आपने यह पाठ सफलतापूर्वक पूरा किया! (+२० XP)'
        : 'You have successfully mastered this lesson! (+20 XP)'
    );
  };

  // Play full dialogue sequentially
  const playFullDialogue = (dialogueList) => {
    if (!dialogueList || dialogueList.length === 0) return;
    Speech.stop();
    let idx = 0;
    const playNext = () => {
      if (idx < dialogueList.length) {
        const item = dialogueList[idx];
        Speech.speak(item.text_en, {
          language: 'en-US',
          rate: speechRate,
          onDone: () => {
            idx++;
            setTimeout(playNext, 500);
          },
        });
      }
    };
    playNext();
  };

  // Quiz option select
  const handleQuizOption = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    const quizList = selectedLesson?.quiz || [];
    let correct = 0;
    quizList.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correct++;
    });

    if (correct === quizList.length && quizList.length > 0) {
      markComplete(selectedLesson.id);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <View style={styles.curriculumBadge}>
              <Sparkles size={14} color={COLORS.primary} />
              <Text style={styles.curriculumBadgeText}>
                {language === 'mr' ? '५-स्तरीय संपूर्ण अभ्यासक्रम' : language === 'hi' ? '५-स्तरीय सम्पूर्ण पाठ्यक्रम' : '5-Level Master Course'}
              </Text>
            </View>
            <Text style={styles.bannerTitle}>
              {language === 'mr' ? 'इंग्रजी व्याकरण व धडे' : language === 'hi' ? 'अंग्रेजी व्याकरण व पाठ' : 'Grammar & Lessons'}
            </Text>
            <Text style={styles.bannerSub}>
              {language === 'mr'
                ? 'मूलभूत आवाजांपासून अस्खलित संभाषणापर्यंत सर्वकाही शिका.'
                : language === 'hi'
                ? 'बुनियादी ध्वनियों से लेकर धाराप्रवाह बातचीत तक सीखें।'
                : 'From starter phonics to job interviews & fluent speaking.'}
            </Text>
          </View>

          {/* Level Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                {language === 'mr' ? `स्तर ${activeLevel} प्रगती` : language === 'hi' ? `स्तर ${activeLevel} प्रगति` : `Level ${activeLevel} Progress`}
              </Text>
              <Text style={styles.progressValue}>{completedInLevelCount}/{levelLessons.length} {language === 'mr' ? 'पूर्ण' : 'Done'} ({levelProgress}%)</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${levelProgress}%` }]} />
            </View>
          </View>
        </View>

        {/* 5-Level Horizontal Switcher */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.levelStrip}
        >
          {levelTabs.map(tab => {
            const isActive = activeLevel === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.levelTab, isActive && styles.levelTabActive]}
                onPress={() => {
                  setActiveLevel(tab.id);
                  setSelectedCategory('all');
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.levelTabBadge, isActive && styles.levelTabBadgeActive]}>
                  <Text style={[styles.levelTabBadgeText, isActive && styles.levelTabBadgeTextActive]}>
                    {tab.badge}
                  </Text>
                </View>
                <Text style={[styles.levelTabText, isActive && styles.levelTabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search & Category Filter */}
        <View style={styles.searchWrap}>
          <Search size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'mr' ? 'धडा शोधा...' : language === 'hi' ? 'पाठ खोजें...' : 'Search lessons...'}
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {categories.length > 2 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, isSelected && styles.catChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                    {cat === 'all' ? (language === 'mr' ? 'सर्व' : language === 'hi' ? 'सभी' : 'All') : cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Lessons List Cards */}
        <View style={styles.lessonsList}>
          {filteredLessons.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {language === 'mr' ? 'कोणताही धडा सापडला नाही.' : language === 'hi' ? 'कोई पाठ नहीं मिला।' : 'No lessons found.'}
              </Text>
            </View>
          ) : (
            filteredLessons.map((lesson, idx) => {
              const isDone = completedIds.includes(lesson.id);
              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={[styles.lessonCard, isDone && styles.lessonCardDone]}
                  onPress={() => openLesson(lesson)}
                  activeOpacity={0.85}
                >
                  <View style={styles.lessonCardTop}>
                    <View style={styles.lessonNumTag}>
                      {isDone ? (
                        <CheckCircle2 size={18} color={COLORS.secondary} />
                      ) : (
                        <Text style={styles.lessonNumText}>#{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</Text>
                      )}
                    </View>
                    <View style={styles.lessonCategoryBadge}>
                      <Text style={styles.lessonCategoryText}>{lesson.category}</Text>
                    </View>
                  </View>

                  <Text style={styles.lessonTitleLocal}>
                    {language === 'hi' && lesson.title_hi ? lesson.title_hi : lesson.title_mr}
                  </Text>
                  <Text style={styles.lessonTitleEn}>{lesson.title_en}</Text>

                  <Text style={styles.lessonDesc} numberOfLines={2}>
                    {language === 'hi' && lesson.description_hi
                      ? lesson.description_hi
                      : (lesson.description_mr || lesson.description_en)}
                  </Text>

                  <View style={styles.lessonFooter}>
                    <View style={styles.lessonMetaPill}>
                      <BookOpen size={13} color={COLORS.primary} />
                      <Text style={styles.lessonMetaText}>{lesson.content?.length || 0} {language === 'mr' ? 'शब्द/वाक्ये' : 'Items'}</Text>
                    </View>
                    <View style={styles.startRow}>
                      <Text style={styles.startRowText}>
                        {isDone ? (language === 'mr' ? 'पुन्हा पहा' : 'Review') : (language === 'mr' ? 'सुरू करा' : 'Start')}
                      </Text>
                      <ChevronRight size={16} color={COLORS.primary} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ================= DETAILED LESSON VIEWER MODAL ================= */}
      {selectedLesson && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeLesson}
        >
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeLesson} style={styles.modalCloseBtn}>
                <X size={22} color={COLORS.text} />
              </TouchableOpacity>
              <View style={styles.modalHeaderTitleWrap}>
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                  {language === 'hi' && selectedLesson.title_hi
                    ? selectedLesson.title_hi
                    : selectedLesson.title_mr}
                </Text>
                <Text style={styles.modalHeaderSub} numberOfLines={1}>
                  {selectedLesson.title_en}
                </Text>
              </View>
              <AudioButton text={selectedLesson.title_en} size={34} />
            </View>

            {/* Sub-tabs Navigation */}
            <View style={styles.modalSubtabsStrip}>
              <TouchableOpacity
                style={[styles.modalSubtab, activeTab === 'vocab' && styles.modalSubtabActive]}
                onPress={() => setActiveTab('vocab')}
              >
                <BookOpen size={16} color={activeTab === 'vocab' ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.modalSubtabText, activeTab === 'vocab' && styles.modalSubtabTextActive]}>
                  {language === 'mr' ? 'शब्द व वाक्ये' : language === 'hi' ? 'शब्दावली' : 'Words'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSubtab, activeTab === 'flashcards' && styles.modalSubtabActive]}
                onPress={() => {
                  setActiveTab('flashcards');
                  setIsFlipped(false);
                }}
              >
                <Layers size={16} color={activeTab === 'flashcards' ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.modalSubtabText, activeTab === 'flashcards' && styles.modalSubtabTextActive]}>
                  {language === 'mr' ? 'फ्लॅशकार्ड' : language === 'hi' ? 'फ़्लैशकार्ड' : 'Cards'}
                </Text>
              </TouchableOpacity>

              {selectedLesson.dialogue && selectedLesson.dialogue.length > 0 && (
                <TouchableOpacity
                  style={[styles.modalSubtab, activeTab === 'dialogue' && styles.modalSubtabActive]}
                  onPress={() => setActiveTab('dialogue')}
                >
                  <MessageSquare size={16} color={activeTab === 'dialogue' ? COLORS.primary : COLORS.textMuted} />
                  <Text style={[styles.modalSubtabText, activeTab === 'dialogue' && styles.modalSubtabTextActive]}>
                    {language === 'mr' ? 'संभाषण' : language === 'hi' ? 'वार्तालाप' : 'Dialogue'}
                  </Text>
                </TouchableOpacity>
              )}

              {selectedLesson.grammar_tip && (
                <TouchableOpacity
                  style={[styles.modalSubtab, activeTab === 'grammar' && styles.modalSubtabActive]}
                  onPress={() => setActiveTab('grammar')}
                >
                  <Lightbulb size={16} color={activeTab === 'grammar' ? COLORS.primary : COLORS.textMuted} />
                  <Text style={[styles.modalSubtabText, activeTab === 'grammar' && styles.modalSubtabTextActive]}>
                    {language === 'mr' ? 'नियम' : language === 'hi' ? 'नियम' : 'Grammar'}
                  </Text>
                </TouchableOpacity>
              )}

              {selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
                <TouchableOpacity
                  style={[styles.modalSubtab, activeTab === 'quiz' && styles.modalSubtabActive]}
                  onPress={() => setActiveTab('quiz')}
                >
                  <HelpCircle size={16} color={activeTab === 'quiz' ? COLORS.primary : COLORS.textMuted} />
                  <Text style={[styles.modalSubtabText, activeTab === 'quiz' && styles.modalSubtabTextActive]}>
                    {language === 'mr' ? 'क्विझ' : language === 'hi' ? 'क्विज़' : 'Quiz'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Sub-tab Body Content */}
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* TAB 1: VOCABULARY & SENTENCES */}
              {activeTab === 'vocab' && (
                <View>
                  <Text style={styles.tabSectionHeading}>
                    {language === 'mr' ? 'धड्यातील महत्त्वाचे शब्द व उच्चार' : language === 'hi' ? 'महत्वपूर्ण शब्द और उच्चारण' : 'Vocabulary & Expressions'}
                  </Text>
                  {selectedLesson.content?.map((item, idx) => (
                    <View key={idx} style={styles.itemCard}>
                      <View style={styles.itemCardTopRow}>
                        <View style={styles.itemCardEnWrap}>
                          <Text style={styles.itemEnText}>{item.en}</Text>
                          <Text style={styles.itemPronText}>/{item.pron}/</Text>
                        </View>
                        <AudioButton text={item.en} size={36} />
                      </View>

                      <View style={styles.itemMeaningsRow}>
                        <Text style={styles.itemMeaningLabel}>मराठी:</Text>
                        <Text style={styles.itemMeaningVal}>{item.mr}</Text>
                      </View>

                      {item.hi && (
                        <View style={styles.itemMeaningsRow}>
                          <Text style={styles.itemMeaningLabel}>हिंदी:</Text>
                          <Text style={styles.itemMeaningVal}>{item.hi}</Text>
                        </View>
                      )}

                      {item.example_en && (
                        <View style={styles.itemExampleBox}>
                          <View style={styles.exampleEnRow}>
                            <Text style={styles.exampleEnText}>"{item.example_en}"</Text>
                            <AudioButton text={item.example_en} size={28} />
                          </View>
                          <Text style={styles.exampleLocText}>
                            {language === 'hi' && item.example_hi ? item.example_hi : item.example_mr}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.completeLessonBtn}
                    onPress={() => markComplete(selectedLesson.id)}
                    activeOpacity={0.85}
                  >
                    <CheckCircle2 size={20} color={COLORS.white} />
                    <Text style={styles.completeLessonBtnText}>
                      {language === 'mr' ? 'हा धडा पूर्ण झाला म्हणून चिन्हांकित करा' : language === 'hi' ? 'पाठ पूर्ण चिह्नित करें' : 'Mark Lesson as Complete'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* TAB 2: FLASHCARDS */}
              {activeTab === 'flashcards' && selectedLesson.content && (
                <View style={styles.flashcardsContainer}>
                  <View style={styles.flashcardMetaRow}>
                    <Text style={styles.flashcardCounter}>
                      {flashcardIdx + 1} / {selectedLesson.content.length}
                    </Text>
                    <Text style={styles.flashcardHint}>
                      {language === 'mr' ? 'अर्थ पाहण्यासाठी कार्डवर टॅप करा ↺' : language === 'hi' ? 'अर्थ देखने के लिए कार्ड पर टैप करें ↺' : 'Tap card to flip ↺'}
                    </Text>
                  </View>

                  {(() => {
                    const current = selectedLesson.content[flashcardIdx] || {};
                    return (
                      <TouchableOpacity
                        style={[styles.flashcardCard, isFlipped ? styles.flashcardBack : styles.flashcardFront]}
                        onPress={() => setIsFlipped(!isFlipped)}
                        activeOpacity={0.92}
                      >
                        {!isFlipped ? (
                          <View style={styles.cardCenter}>
                            <Text style={styles.cardBadgeText}>English Word</Text>
                            <Text style={styles.cardMainEn}>{current.en}</Text>
                            <Text style={styles.cardMainPron}>/{current.pron}/</Text>
                            <View style={{ marginTop: 12 }}>
                              <AudioButton text={current.en} size={44} />
                            </View>
                            <Text style={styles.cardTapHint}>{language === 'mr' ? 'अर्थ पाहण्यासाठी टॅप करा' : 'Tap to Flip'}</Text>
                          </View>
                        ) : (
                          <View style={styles.cardCenter}>
                            <Text style={[styles.cardBadgeText, { color: COLORS.secondary }]}>Meaning & Example</Text>
                            <Text style={styles.cardMainMr}>मराठी: {current.mr}</Text>
                            {current.hi && <Text style={styles.cardMainHi}>हिंदी: {current.hi}</Text>}
                            {current.example_en && (
                              <View style={styles.cardExampleWrap}>
                                <Text style={styles.cardExampleEn}>"{current.example_en}"</Text>
                                <Text style={styles.cardExampleLoc}>
                                  {language === 'hi' && current.example_hi ? current.example_hi : current.example_mr}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })()}

                  <View style={styles.flashcardControls}>
                    <TouchableOpacity
                      style={[styles.fcBtn, flashcardIdx === 0 && styles.fcBtnDisabled]}
                      disabled={flashcardIdx === 0}
                      onPress={() => {
                        setIsFlipped(false);
                        setFlashcardIdx(prev => Math.max(0, prev - 1));
                      }}
                    >
                      <ArrowLeft size={18} color={flashcardIdx === 0 ? COLORS.textMuted : COLORS.primary} />
                      <Text style={[styles.fcBtnText, flashcardIdx === 0 && { color: COLORS.textMuted }]}>
                        {language === 'mr' ? 'मागे' : 'Prev'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.fcBtn, styles.fcFlipBtn]}
                      onPress={() => setIsFlipped(!isFlipped)}
                    >
                      <RotateCcw size={18} color={COLORS.white} />
                      <Text style={[styles.fcBtnText, { color: COLORS.white }]}>
                        {language === 'mr' ? 'उलटा' : 'Flip'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.fcBtn, flashcardIdx === selectedLesson.content.length - 1 && styles.fcBtnDisabled]}
                      disabled={flashcardIdx === selectedLesson.content.length - 1}
                      onPress={() => {
                        setIsFlipped(false);
                        setFlashcardIdx(prev => Math.min(selectedLesson.content.length - 1, prev + 1));
                      }}
                    >
                      <Text style={[styles.fcBtnText, flashcardIdx === selectedLesson.content.length - 1 && { color: COLORS.textMuted }]}>
                        {language === 'mr' ? 'पुढे' : 'Next'}
                      </Text>
                      <ArrowRight size={18} color={flashcardIdx === selectedLesson.content.length - 1 ? COLORS.textMuted : COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* TAB 3: LIVE DIALOGUE SCENARIO */}
              {activeTab === 'dialogue' && selectedLesson.dialogue && (
                <View>
                  <View style={styles.dialogueTopBar}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tabSectionHeading}>
                        {language === 'mr' ? 'वास्तविक संवाद सराव' : language === 'hi' ? 'वास्तविक वार्तालाप' : 'Real-Life Dialogue'}
                      </Text>
                      <Text style={styles.dialogueIntro}>
                        {language === 'mr' ? 'दोन्ही पात्रांचे संवाद ऐका व बोला.' : 'Listen and repeat each line.'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.playAllBtn}
                      onPress={() => playFullDialogue(selectedLesson.dialogue)}
                      activeOpacity={0.8}
                    >
                      <Play size={16} color={COLORS.white} />
                      <Text style={styles.playAllBtnText}>{language === 'mr' ? 'संपूर्ण ऐका' : 'Play All'}</Text>
                    </TouchableOpacity>
                  </View>

                  {selectedLesson.dialogue.map((item, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <View
                        key={idx}
                        style={[styles.dialogueBubble, isEven ? styles.bubbleSpeakerA : styles.bubbleSpeakerB]}
                      >
                        <View style={styles.speakerHeaderRow}>
                          <Text style={styles.speakerName}>{item.speaker}</Text>
                          <AudioButton text={item.text_en} size={30} />
                        </View>
                        <Text style={styles.dialogueEnText}>{item.text_en}</Text>
                        <Text style={styles.dialoguePronText}>/{item.pron}/</Text>
                        <Text style={styles.dialogueLocText}>
                          {language === 'hi' && item.text_hi ? item.text_hi : item.text_mr}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* TAB 4: GRAMMAR & RULES */}
              {activeTab === 'grammar' && selectedLesson.grammar_tip && (
                <View style={styles.grammarContainer}>
                  <View style={styles.grammarHeaderCard}>
                    <View style={styles.grammarIconBox}>
                      <Lightbulb size={24} color="#D97706" />
                    </View>
                    <Text style={styles.grammarTitle}>
                      {language === 'hi' && selectedLesson.grammar_tip.title_hi
                        ? selectedLesson.grammar_tip.title_hi
                        : selectedLesson.grammar_tip.title_mr}
                    </Text>
                  </View>

                  <View style={styles.grammarBodyCard}>
                    <Text style={styles.grammarRuleText}>
                      {language === 'hi' && selectedLesson.grammar_tip.rule_hi
                        ? selectedLesson.grammar_tip.rule_hi
                        : selectedLesson.grammar_tip.rule_mr}
                    </Text>

                    {selectedLesson.grammar_tip.example_en && (
                      <View style={styles.grammarExBox}>
                        <View style={styles.exampleEnRow}>
                          <Text style={styles.grammarExEn}>"{selectedLesson.grammar_tip.example_en}"</Text>
                          <AudioButton text={selectedLesson.grammar_tip.example_en} size={30} />
                        </View>
                        <Text style={styles.grammarExLoc}>
                          {language === 'hi' && selectedLesson.grammar_tip.example_hi
                            ? selectedLesson.grammar_tip.example_hi
                            : selectedLesson.grammar_tip.example_mr}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* TAB 5: LESSON MASTERY QUIZ */}
              {activeTab === 'quiz' && selectedLesson.quiz && (
                <View>
                  <Text style={styles.tabSectionHeading}>
                    {language === 'mr' ? 'धडा समजला का? क्विझ सोडवा!' : language === 'hi' ? 'पाठ का क्विज़ हल करें!' : 'Lesson Mastery Quiz'}
                  </Text>

                  {selectedLesson.quiz.map((q, qIdx) => {
                    const selectedOpt = quizAnswers[qIdx];
                    const isAnswered = selectedOpt !== undefined;

                    return (
                      <View key={qIdx} style={styles.quizCard}>
                        <View style={styles.quizQHeader}>
                          <View style={styles.quizQBadge}>
                            <Text style={styles.quizQBadgeText}>Q{qIdx + 1}</Text>
                          </View>
                          <Text style={styles.quizQText}>
                            {language === 'hi' && q.question_hi ? q.question_hi : (q.question_mr || q.question_en)}
                          </Text>
                        </View>

                        <View style={styles.quizOptionsList}>
                          {q.options.map((opt, optIdx) => {
                            let optStyle = styles.optBtn;
                            let optTextStyle = styles.optBtnText;

                            if (quizSubmitted) {
                              if (optIdx === q.correct) {
                                optStyle = [styles.optBtn, styles.optCorrect];
                                optTextStyle = [styles.optBtnText, styles.optTextCorrect];
                              } else if (selectedOpt === optIdx) {
                                optStyle = [styles.optBtn, styles.optWrong];
                                optTextStyle = [styles.optBtnText, styles.optTextWrong];
                              }
                            } else if (selectedOpt === optIdx) {
                              optStyle = [styles.optBtn, styles.optSelected];
                              optTextStyle = [styles.optBtnText, styles.optTextSelected];
                            }

                            return (
                              <TouchableOpacity
                                key={optIdx}
                                style={optStyle}
                                onPress={() => handleQuizOption(qIdx, optIdx)}
                                activeOpacity={0.8}
                              >
                                <Text style={optTextStyle}>{opt}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {quizSubmitted && (
                          <View style={styles.quizExplBox}>
                            <Text style={styles.quizExplText}>
                              💡 {language === 'hi' && q.explanation_hi ? q.explanation_hi : q.explanation_mr}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}

                  {!quizSubmitted ? (
                    <TouchableOpacity
                      style={styles.submitQuizBtn}
                      onPress={submitQuiz}
                      activeOpacity={0.85}
                    >
                      <Award size={20} color={COLORS.white} />
                      <Text style={styles.submitQuizBtnText}>
                        {language === 'mr' ? 'उत्तरे तपासा' : language === 'hi' ? 'उत्तर जाँचें' : 'Check Answers'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.submitQuizBtn, { backgroundColor: COLORS.secondary }]}
                      onPress={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      activeOpacity={0.85}
                    >
                      <RotateCcw size={18} color={COLORS.white} />
                      <Text style={styles.submitQuizBtnText}>
                        {language === 'mr' ? 'पुन्हा प्रयत्न करा' : 'Try Again'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.m,
  },
  bannerCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    ...SHADOWS.card,
  },
  curriculumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  curriculumBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: SPACING.m,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.full,
  },
  levelStrip: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.m,
    paddingVertical: 4,
  },
  levelTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  levelTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  levelTabBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  levelTabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  levelTabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  levelTabBadgeTextActive: {
    color: COLORS.white,
  },
  levelTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  levelTabTextActive: {
    color: COLORS.white,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.m,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.s,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.m,
  },
  catChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catChipActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  catChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  lessonsList: {
    gap: SPACING.m,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  lessonCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.card,
  },
  lessonCardDone: {
    borderLeftColor: COLORS.secondary,
  },
  lessonCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  lessonNumTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  lessonCategoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  lessonCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  lessonTitleLocal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  lessonTitleEn: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  lessonDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: SPACING.m,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: SPACING.s,
  },
  lessonMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonMetaText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  startRowText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalHeaderTitleWrap: {
    flex: 1,
    marginHorizontal: SPACING.s,
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalHeaderSub: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalSubtabsStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.xs,
  },
  modalSubtab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  modalSubtabActive: {
    borderBottomColor: COLORS.primary,
  },
  modalSubtabText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  modalSubtabTextActive: {
    color: COLORS.primary,
  },
  modalContent: {
    padding: SPACING.m,
  },
  tabSectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.card,
  },
  itemCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  itemCardEnWrap: {
    flex: 1,
  },
  itemEnText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  itemPronText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  itemMeaningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  itemMeaningLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  itemMeaningVal: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  itemExampleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    padding: SPACING.s,
    marginTop: SPACING.s,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  exampleEnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  exampleEnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 6,
  },
  exampleLocText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  completeLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    gap: 8,
    marginTop: SPACING.m,
    ...SHADOWS.button,
  },
  completeLessonBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },

  // Flashcards styles
  flashcardsContainer: {
    alignItems: 'center',
  },
  flashcardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.m,
  },
  flashcardCounter: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  flashcardHint: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  flashcardCard: {
    width: '100%',
    minHeight: 220,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
    borderWidth: 2,
    borderColor: '#EEF2FF',
    marginBottom: SPACING.l,
  },
  flashcardFront: {
    borderColor: '#EEF2FF',
  },
  flashcardBack: {
    borderColor: '#DCFCE7',
    backgroundColor: '#F0FDF4',
  },
  cardCenter: {
    alignItems: 'center',
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cardMainEn: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  cardMainPron: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  cardTapHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: SPACING.l,
  },
  cardMainMr: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardMainHi: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  cardExampleWrap: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    width: '100%',
  },
  cardExampleEn: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardExampleLoc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  flashcardControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: SPACING.m,
  },
  fcBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fcFlipBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  fcBtnDisabled: {
    opacity: 0.4,
  },
  fcBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Dialogue styles
  dialogueTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  dialogueIntro: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  playAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  playAllBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  dialogueBubble: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.card,
  },
  bubbleSpeakerA: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  bubbleSpeakerB: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  speakerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  speakerName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  dialogueEnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  dialoguePronText: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 4,
  },
  dialogueLocText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  // Grammar styles
  grammarContainer: {
    gap: SPACING.m,
  },
  grammarHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: SPACING.m,
    borderRadius: RADIUS.md,
    gap: SPACING.m,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  grammarIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grammarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
    flex: 1,
  },
  grammarBodyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.l,
    ...SHADOWS.card,
  },
  grammarRuleText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.m,
  },
  grammarExBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    padding: SPACING.m,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  grammarExEn: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 6,
  },
  grammarExLoc: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  // Quiz styles
  quizCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.card,
  },
  quizQHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: SPACING.m,
  },
  quizQBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  quizQBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  quizQText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  quizOptionsList: {
    gap: SPACING.s,
  },
  optBtn: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: SPACING.m,
  },
  optBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  optSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: COLORS.primary,
  },
  optTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  optCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: COLORS.secondary,
  },
  optTextCorrect: {
    color: '#15803D',
    fontWeight: '800',
  },
  optWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optTextWrong: {
    color: '#B91C1C',
    fontWeight: '700',
  },
  quizExplBox: {
    marginTop: SPACING.s,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    padding: SPACING.s,
  },
  quizExplText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  submitQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
    marginTop: SPACING.s,
    ...SHADOWS.button,
  },
  submitQuizBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
