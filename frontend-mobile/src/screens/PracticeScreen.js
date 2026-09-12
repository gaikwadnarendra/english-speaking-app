import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Award,
  HelpCircle,
  Puzzle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Flame,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowLeftRight,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import {
  INITIAL_PRACTICE_QUIZZES,
  MATCH_PAIRS_SETS,
  SENTENCE_PUZZLES,
} from '../data/practiceData';
import { api } from '../config/api';

const PRACTICE_SCORE_KEY = '@english_shika_practice_score';

export default function PracticeScreen() {
  const { t, language, speechRate } = useApp();

  // Mode: 'mcq' | 'matching' | 'builder'
  const [activeMode, setActiveMode] = useState('mcq');

  // Gamification Score & Streak
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // ================= MCQ STATE =================
  const [quizzes, setQuizzes] = useState(INITIAL_PRACTICE_QUIZZES);
  const [selectedTopic, setSelectedTopic] = useState('all'); // 'all' | 'vocabulary' | 'phrases' | 'grammar'
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // ================= MATCHING PAIRS STATE =================
  const [activePairSetIdx, setActivePairSetIdx] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [wrongPair, setWrongPair] = useState(false);

  // ================= SENTENCE BUILDER STATE =================
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [assembledWords, setAssembledWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [builderStatus, setBuilderStatus] = useState(null); // null | 'correct' | 'wrong'

  // Load Score from storage
  useEffect(() => {
    const loadScore = async () => {
      try {
        const stored = await AsyncStorage.getItem(PRACTICE_SCORE_KEY);
        if (stored) setScore(parseInt(stored, 10));
      } catch (e) {}
    };
    loadScore();
  }, []);

  const addScore = async (points) => {
    const newScore = score + points;
    setScore(newScore);
    setStreak(prev => prev + 1);
    try {
      await AsyncStorage.setItem(PRACTICE_SCORE_KEY, newScore.toString());
      await api.post('/api/progress/xp', { xp: points }).catch(() => {});
    } catch (e) {}
  };

  // Init Sentence Builder on puzzle change
  const currentPuzzle = SENTENCE_PUZZLES[puzzleIdx] || SENTENCE_PUZZLES[0];
  useEffect(() => {
    if (currentPuzzle) {
      setAvailableWords([...currentPuzzle.words].sort(() => 0.5 - Math.random()));
      setAssembledWords([]);
      setBuilderStatus(null);
    }
  }, [puzzleIdx]);

  // Init Match Pairs on Set change
  const currentPairSet = MATCH_PAIRS_SETS[activePairSetIdx] || MATCH_PAIRS_SETS[0];
  useEffect(() => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setWrongPair(false);
  }, [activePairSetIdx]);

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    if (selectedTopic === 'all') return quizzes;
    return quizzes.filter(q => q.topic === selectedTopic);
  }, [quizzes, selectedTopic]);

  const currentQuiz = filteredQuizzes[quizIdx] || filteredQuizzes[0] || {};

  // Handle MCQ Option Select
  const handleSelectOption = (opt) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(opt);
    setIsAnswerSubmitted(true);

    if (opt === currentQuiz.correctAnswer) {
      addScore(10);
      Speech.speak(opt, { language: 'en-US', rate: speechRate });
    } else {
      setStreak(0);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    if (quizIdx < filteredQuizzes.length - 1) {
      setQuizIdx(prev => prev + 1);
    } else {
      setQuizIdx(0);
      Alert.alert(
        language === 'mr' ? 'अभिनंदन! 🎉' : 'Great Job! 🎉',
        language === 'mr' ? 'तुम्ही सर्व प्रश्न सोडवले आहेत!' : 'You have completed this quiz set!'
      );
    }
  };

  // Handle Match Pair Selection
  const handleLeftClick = (pair) => {
    if (matchedIds.includes(pair.id)) return;
    setSelectedLeft(pair);
    setWrongPair(false);

    if (selectedRight) {
      checkPair(pair, selectedRight);
    }
  };

  const handleRightClick = (pair) => {
    if (matchedIds.includes(pair.id)) return;
    setSelectedRight(pair);
    setWrongPair(false);

    if (selectedLeft) {
      checkPair(selectedLeft, pair);
    }
  };

  const checkPair = (left, right) => {
    if (left.id === right.id) {
      // Correct match
      const updated = [...matchedIds, left.id];
      setMatchedIds(updated);
      setSelectedLeft(null);
      setSelectedRight(null);
      addScore(10);
      Speech.speak(right.right, { language: 'en-US', rate: speechRate });

      if (updated.length === currentPairSet.pairs.length) {
        addScore(30); // bonus for finishing set
      }
    } else {
      // Wrong match
      setWrongPair(true);
      setStreak(0);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongPair(false);
      }, 700);
    }
  };

  // Handle Sentence Builder Word Tap
  const handleTapAvailableWord = (word, index) => {
    setAssembledWords([...assembledWords, word]);
    const nextAvail = [...availableWords];
    nextAvail.splice(index, 1);
    setAvailableWords(nextAvail);
    setBuilderStatus(null);
  };

  const handleTapAssembledWord = (word, index) => {
    const nextAssembled = [...assembledWords];
    nextAssembled.splice(index, 1);
    setAssembledWords(nextAssembled);
    setAvailableWords([...availableWords, word]);
    setBuilderStatus(null);
  };

  const handleCheckSentence = () => {
    const assembledText = assembledWords.join(' ').trim().toLowerCase();
    const targetText = currentPuzzle.targetEn.trim().toLowerCase();

    if (assembledText === targetText) {
      setBuilderStatus('correct');
      addScore(20);
      Speech.speak(currentPuzzle.targetEn, { language: 'en-US', rate: speechRate });
    } else {
      setBuilderStatus('wrong');
      setStreak(0);
    }
  };

  const handleNextPuzzle = () => {
    if (puzzleIdx < SENTENCE_PUZZLES.length - 1) {
      setPuzzleIdx(prev => prev + 1);
    } else {
      setPuzzleIdx(0);
      Alert.alert(
        language === 'mr' ? 'शाब्बास! 🎉' : 'Well Done! 🎉',
        language === 'mr' ? 'तुम्ही सर्व वाक्य रचना कोडी सोडवली आहेत!' : 'You completed all sentence builder puzzles!'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Gamification Bar */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreItem}>
          <Award size={18} color={COLORS.accent} />
          <Text style={styles.scoreText}>{score} XP</Text>
        </View>

        <View style={styles.streakItem}>
          <Flame size={18} color={COLORS.streak} />
          <Text style={styles.streakText}>{streak} {language === 'mr' ? 'सातत्य' : 'Streak'}</Text>
        </View>
      </View>

      {/* 3-Mode Pill Switcher */}
      <View style={styles.modeStrip}>
        <TouchableOpacity
          style={[styles.modeTab, activeMode === 'mcq' && styles.modeTabActive]}
          onPress={() => setActiveMode('mcq')}
          activeOpacity={0.8}
        >
          <HelpCircle size={15} color={activeMode === 'mcq' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.modeTabText, activeMode === 'mcq' && styles.modeTabTextActive]}>
            {language === 'mr' ? 'क्विझ (MCQ)' : 'MCQ Quiz'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, activeMode === 'matching' && styles.modeTabActive]}
          onPress={() => setActiveMode('matching')}
          activeOpacity={0.8}
        >
          <ArrowLeftRight size={15} color={activeMode === 'matching' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.modeTabText, activeMode === 'matching' && styles.modeTabTextActive]}>
            {language === 'mr' ? 'जोड्या जुळवा' : 'Match Pairs'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, activeMode === 'builder' && styles.modeTabActive]}
          onPress={() => setActiveMode('builder')}
          activeOpacity={0.8}
        >
          <Puzzle size={15} color={activeMode === 'builder' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.modeTabText, activeMode === 'builder' && styles.modeTabTextActive]}>
            {language === 'mr' ? 'वाक्य रचना' : 'Sentence Builder'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= MODE 1: MCQ QUIZZES ================= */}
      {activeMode === 'mcq' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Topic Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicChipsRow}
          >
            {[
              { id: 'all', label: language === 'mr' ? 'सर्व सराव' : 'All Topics' },
              { id: 'vocabulary', label: language === 'mr' ? 'शब्दसंग्रह' : 'Vocabulary' },
              { id: 'phrases', label: language === 'mr' ? 'दैनंदिन वाक्ये' : 'Phrases' },
              { id: 'grammar', label: language === 'mr' ? 'व्याकरण व काळ' : 'Grammar' },
            ].map(topic => {
              const isSelected = selectedTopic === topic.id;
              return (
                <TouchableOpacity
                  key={topic.id}
                  style={[styles.topicChip, isSelected && styles.topicChipActive]}
                  onPress={() => {
                    setSelectedTopic(topic.id);
                    setQuizIdx(0);
                    setSelectedAnswer(null);
                    setIsAnswerSubmitted(false);
                  }}
                >
                  <Text style={[styles.topicChipText, isSelected && styles.topicChipTextActive]}>
                    {topic.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Quiz Card */}
          <View style={styles.quizCard}>
            <View style={styles.quizCardHeader}>
              <View style={styles.quizNumBadge}>
                <Text style={styles.quizNumText}>Q {quizIdx + 1} / {filteredQuizzes.length}</Text>
              </View>
              <Text style={styles.quizTopicTag}>{currentQuiz.topic?.toUpperCase()}</Text>
            </View>

            <Text style={styles.quizQuestionLocal}>
              {language === 'hi' && currentQuiz.question_hi
                ? currentQuiz.question_hi
                : (currentQuiz.question_mr || currentQuiz.question_en)}
            </Text>

            {currentQuiz.question_en && (
              <View style={styles.quizQuestionEnRow}>
                <Text style={styles.quizQuestionEn}>{currentQuiz.question_en}</Text>
                <AudioButton text={currentQuiz.question_en} size={28} />
              </View>
            )}

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuiz.options?.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === currentQuiz.correctAnswer;

                let optStyle = styles.optButton;
                let optTextStyle = styles.optButtonText;

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optStyle = [styles.optButton, styles.optCorrect];
                    optTextStyle = [styles.optButtonText, styles.optTextCorrect];
                  } else if (isSelected) {
                    optStyle = [styles.optButton, styles.optWrong];
                    optTextStyle = [styles.optButtonText, styles.optTextWrong];
                  }
                } else if (isSelected) {
                  optStyle = [styles.optButton, styles.optSelected];
                  optTextStyle = [styles.optButtonText, styles.optTextSelected];
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={optStyle}
                    disabled={isAnswerSubmitted}
                    onPress={() => handleSelectOption(opt)}
                    activeOpacity={0.8}
                  >
                    <Text style={optTextStyle}>{opt}</Text>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 size={18} color="#15803D" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle size={18} color="#B91C1C" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation Breakdown */}
            {isAnswerSubmitted && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  {selectedAnswer === currentQuiz.correctAnswer
                    ? (language === 'mr' ? 'उत्कृष्ट! बरोबर उत्तर 🎉 (+१० XP)' : 'Excellent! Correct Answer 🎉 (+10 XP)')
                    : (language === 'mr' ? 'चूक! योग्य उत्तर खालीलप्रमाणे आहे:' : 'Incorrect! Correct answer is:')}
                </Text>
                <Text style={styles.explanationBody}>
                  💡 {language === 'hi' && currentQuiz.explanation_hi
                    ? currentQuiz.explanation_hi
                    : currentQuiz.explanation_mr}
                </Text>

                <TouchableOpacity
                  style={styles.nextQuizBtn}
                  onPress={handleNextQuiz}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextQuizBtnText}>
                    {language === 'mr' ? 'पुढील प्रश्न सोडवा ➔' : 'Next Question ➔'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ================= MODE 2: MATCH THE PAIRS ================= */}
      {activeMode === 'matching' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Pair Set Switcher */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicChipsRow}
          >
            {MATCH_PAIRS_SETS.map((set, idx) => {
              const isSelected = activePairSetIdx === idx;
              return (
                <TouchableOpacity
                  key={set.id}
                  style={[styles.topicChip, isSelected && styles.topicChipActive]}
                  onPress={() => setActivePairSetIdx(idx)}
                >
                  <Text style={[styles.topicChipText, isSelected && styles.topicChipTextActive]}>
                    {set.title_mr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.matchingBoardCard}>
            <View style={styles.matchingHeader}>
              <Text style={styles.matchingTitle}>
                {language === 'mr' ? 'योग्य जोड्या जुळवा' : 'Match the Pairs'}
              </Text>
              <Text style={styles.matchingProgress}>
                {matchedIds.length} / {currentPairSet.pairs.length} {language === 'mr' ? 'जुळले' : 'Matched'}
              </Text>
            </View>

            <View style={styles.columnsContainer}>
              {/* Left Column (Marathi/Hindi) */}
              <View style={styles.matchingCol}>
                <Text style={styles.colHeader}>{language === 'mr' ? 'मराठी अर्थ' : 'Meaning'}</Text>
                {currentPairSet.pairs.map(p => {
                  const isMatched = matchedIds.includes(p.id);
                  const isSelected = selectedLeft?.id === p.id;

                  let itemStyle = styles.matchItem;
                  let itemTextStyle = styles.matchItemText;

                  if (isMatched) {
                    itemStyle = [styles.matchItem, styles.matchItemMatched];
                    itemTextStyle = [styles.matchItemText, styles.matchItemTextMatched];
                  } else if (isSelected) {
                    itemStyle = [styles.matchItem, styles.matchItemSelected];
                    itemTextStyle = [styles.matchItemText, styles.matchItemTextSelected];
                  }

                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={itemStyle}
                      disabled={isMatched}
                      onPress={() => handleLeftClick(p)}
                      activeOpacity={0.8}
                    >
                      <Text style={itemTextStyle}>{p.left}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Right Column (English) */}
              <View style={styles.matchingCol}>
                <Text style={styles.colHeader}>English Word</Text>
                {currentPairSet.pairs.map(p => {
                  const isMatched = matchedIds.includes(p.id);
                  const isSelected = selectedRight?.id === p.id;

                  let itemStyle = styles.matchItem;
                  let itemTextStyle = styles.matchItemText;

                  if (isMatched) {
                    itemStyle = [styles.matchItem, styles.matchItemMatched];
                    itemTextStyle = [styles.matchItemText, styles.matchItemTextMatched];
                  } else if (isSelected) {
                    itemStyle = [styles.matchItem, styles.matchItemSelected];
                    itemTextStyle = [styles.matchItemText, styles.matchItemTextSelected];
                  }

                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={itemStyle}
                      disabled={isMatched}
                      onPress={() => handleRightClick(p)}
                      activeOpacity={0.8}
                    >
                      <Text style={itemTextStyle}>{p.right}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Set Completion Banner */}
            {matchedIds.length === currentPairSet.pairs.length && (
              <View style={styles.allMatchedBox}>
                <Sparkles size={24} color={COLORS.secondary} />
                <Text style={styles.allMatchedTitle}>
                  {language === 'mr' ? 'सर्व जोड्या अचूक जुळल्या! 🎉 (+५० XP)' : 'All Pairs Matched! 🎉 (+50 XP)'}
                </Text>
                <TouchableOpacity
                  style={styles.nextSetBtn}
                  onPress={() => {
                    if (activePairSetIdx < MATCH_PAIRS_SETS.length - 1) {
                      setActivePairSetIdx(prev => prev + 1);
                    } else {
                      setActivePairSetIdx(0);
                    }
                  }}
                >
                  <Text style={styles.nextSetBtnText}>
                    {language === 'mr' ? 'पुढील जोड्यांचा संच ➔' : 'Next Pair Set ➔'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ================= MODE 3: SENTENCE BUILDER ================= */}
      {activeMode === 'builder' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.builderCard}>
            <View style={styles.builderHeader}>
              <View style={styles.quizNumBadge}>
                <Text style={styles.quizNumText}>
                  {language === 'mr' ? `वाक्य ${puzzleIdx + 1} / ${SENTENCE_PUZZLES.length}` : `Sentence ${puzzleIdx + 1} / ${SENTENCE_PUZZLES.length}`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setAvailableWords([...currentPuzzle.words].sort(() => 0.5 - Math.random()));
                  setAssembledWords([]);
                  setBuilderStatus(null);
                }}
              >
                <RotateCcw size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Native Sentence Target Prompt */}
            <Text style={styles.targetSentencePrompt}>
              {language === 'hi' && currentPuzzle.meaning_hi
                ? currentPuzzle.meaning_hi
                : currentPuzzle.meaning_mr}
            </Text>
            <Text style={styles.builderSubHint}>
              {language === 'mr' ? 'योग्य क्रमाने इंग्रजी शब्द निवडून वाक्य तयार करा:' : 'Tap words in correct order to form English sentence:'}
            </Text>

            {/* Assembled Sentence Drop Zone */}
            <View style={styles.assembledDropZone}>
              {assembledWords.length === 0 ? (
                <Text style={styles.dropZonePlaceholder}>
                  {language === 'mr' ? 'खालील शब्दांवर टॅप करा...' : 'Tap words below...'}
                </Text>
              ) : (
                <View style={styles.wordChipsRow}>
                  {assembledWords.map((word, wIdx) => (
                    <TouchableOpacity
                      key={wIdx}
                      style={styles.assembledChip}
                      onPress={() => handleTapAssembledWord(word, wIdx)}
                    >
                      <Text style={styles.assembledChipText}>{word}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Available Word Chips */}
            <Text style={styles.availableHeading}>
              {language === 'mr' ? 'उपलब्ध शब्द:' : 'Available Words:'}
            </Text>
            <View style={styles.availableChipsGrid}>
              {availableWords.map((word, wIdx) => (
                <TouchableOpacity
                  key={wIdx}
                  style={styles.availableChip}
                  onPress={() => handleTapAvailableWord(word, wIdx)}
                >
                  <Text style={styles.availableChipText}>{word}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Validation Feedback */}
            {builderStatus === 'correct' && (
              <View style={styles.builderSuccessBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <CheckCircle2 size={18} color="#15803D" />
                  <Text style={styles.builderSuccessText}>
                    {language === 'mr' ? 'अचूक वाक्य रचना! 🎉 (+२० XP)' : 'Correct Sentence! 🎉 (+20 XP)'}
                  </Text>
                </View>
                <View style={styles.audioRow}>
                  <Text style={styles.fullSentenceEn}>"{currentPuzzle.targetEn}"</Text>
                  <AudioButton text={currentPuzzle.targetEn} size={30} />
                </View>

                <TouchableOpacity
                  style={styles.nextQuizBtn}
                  onPress={handleNextPuzzle}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextQuizBtnText}>
                    {language === 'mr' ? 'पुढील वाक्य ➔' : 'Next Sentence ➔'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {builderStatus === 'wrong' && (
              <View style={styles.builderWrongBox}>
                <Text style={styles.builderWrongText}>
                  {language === 'mr' ? 'वाक्य रचना चुकीची आहे. शब्दांचा क्रम तपासून पुन्हा प्रयत्न करा!' : 'Order is incorrect. Rearrange words and try again!'}
                </Text>
              </View>
            )}

            {builderStatus !== 'correct' && (
              <TouchableOpacity
                style={[
                  styles.checkSentenceBtn,
                  assembledWords.length === 0 && { opacity: 0.5 },
                ]}
                disabled={assembledWords.length === 0}
                onPress={handleCheckSentence}
                activeOpacity={0.85}
              >
                <CheckCircle2 size={18} color={COLORS.white} />
                <Text style={styles.checkSentenceBtnText}>
                  {language === 'mr' ? 'वाक्य तपासा' : 'Check Sentence'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scoreBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C2410C',
  },
  modeStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.xs,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: '#F3F4F6',
    gap: 4,
  },
  modeTabActive: {
    backgroundColor: COLORS.accent,
  },
  modeTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  modeTabTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  scrollContent: {
    padding: SPACING.m,
  },
  topicChipsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.m,
  },
  topicChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topicChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  topicChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  topicChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },

  // MCQ Styles
  quizCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    ...SHADOWS.card,
  },
  quizCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  quizNumBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  quizNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  quizTopicTag: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  quizQuestionLocal: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.s,
  },
  quizQuestionEnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: SPACING.s,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.l,
  },
  quizQuestionEn: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
  },
  optionsContainer: {
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  optButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.md,
  },
  optButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  optSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: COLORS.primary,
  },
  optTextSelected: {
    color: COLORS.primary,
    fontWeight: '800',
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
  explanationBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    marginTop: SPACING.s,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  explanationBody: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: SPACING.m,
  },
  nextQuizBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  nextQuizBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },

  // Matching Pairs
  matchingBoardCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    ...SHADOWS.card,
  },
  matchingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  matchingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  matchingProgress: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  matchingCol: {
    flex: 1,
    gap: SPACING.s,
  },
  colHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  matchItem: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: SPACING.s,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  matchItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  matchItemSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: COLORS.primary,
  },
  matchItemTextSelected: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  matchItemMatched: {
    backgroundColor: '#DCFCE7',
    borderColor: COLORS.secondary,
    opacity: 0.6,
  },
  matchItemTextMatched: {
    color: '#15803D',
    textDecorationLine: 'line-through',
  },
  allMatchedBox: {
    marginTop: SPACING.xl,
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.md,
    padding: SPACING.l,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  allMatchedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15803D',
    marginVertical: SPACING.s,
    textAlign: 'center',
  },
  nextSetBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: SPACING.l,
    borderRadius: RADIUS.md,
  },
  nextSetBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },

  // Sentence Builder
  builderCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    ...SHADOWS.card,
  },
  builderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  targetSentencePrompt: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  builderSubHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.m,
  },
  assembledDropZone: {
    minHeight: 80,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    padding: SPACING.m,
    justifyContent: 'center',
    marginBottom: SPACING.l,
  },
  dropZonePlaceholder: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  wordChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assembledChip: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  assembledChipText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  availableHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.s,
  },
  availableChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.l,
  },
  availableChip: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  availableChipText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  checkSentenceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 6,
    ...SHADOWS.button,
  },
  checkSentenceBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  builderSuccessBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  builderSuccessText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803D',
  },
  audioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  fullSentenceEn: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
  },
  builderWrongBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: RADIUS.md,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  builderWrongText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
  },
});
