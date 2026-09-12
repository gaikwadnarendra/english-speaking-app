import React, { useState, useEffect } from 'react';
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
  Trophy,
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
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // ================= MATCHING PAIRS STATE =================
  const [pairSetIdx, setPairSetIdx] = useState(0);
  const currentPairSet = MATCH_PAIRS_SETS[pairSetIdx] || MATCH_PAIRS_SETS[0];
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);

  // ================= SENTENCE BUILDER STATE =================
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const currentPuzzle = SENTENCE_PUZZLES[puzzleIdx] || SENTENCE_PUZZLES[0];
  const [assembledWords, setAssembledWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [builderStatus, setBuilderStatus] = useState(null); // null | 'correct' | 'wrong'

  // Load Score
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
      await api.post('/progress/xp', { xp: points }).catch(() => {});
    } catch (e) {}
  };

  // Init Puzzle
  useEffect(() => {
    if (currentPuzzle) {
      setAvailableWords([...currentPuzzle.words].sort(() => 0.5 - Math.random()));
      setAssembledWords([]);
      setBuilderStatus(null);
    }
  }, [puzzleIdx]);

  // Handle Matching pair check
  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        setMatchedIds(prev => [...prev, selectedLeft]);
        addScore(10);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 600);
      }
    }
  }, [selectedLeft, selectedRight]);

  const currentQuiz = quizzes[quizIdx] || quizzes[0];

  const handleSelectAnswer = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
    setIsAnswerSubmitted(true);
    const correctIdx = currentQuiz.correctAnswerIdx !== undefined ? currentQuiz.correctAnswerIdx : 1;
    if (idx === correctIdx) {
      addScore(10);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuiz = () => {
    if (quizIdx < quizzes.length - 1) {
      setQuizIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizIdx(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleCheckSentence = () => {
    const assembledStr = assembledWords.join(' ').toLowerCase().replace(/[.,]/g, '');
    const targetStr = currentPuzzle.targetEn.toLowerCase().replace(/[.,]/g, '');
    if (assembledStr === targetStr) {
      setBuilderStatus('correct');
      addScore(15);
    } else {
      setBuilderStatus('wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Score & Streak Header Card */}
        <View style={styles.scoreHeaderCard}>
          <View style={styles.scoreCol}>
            <View style={styles.scorePill}>
              <Trophy size={14} color={COLORS.accentAmberDark} />
              <Text style={styles.scorePillText}>{score} XP</Text>
            </View>
            <Text style={styles.scoreSub}>{language === 'mr' ? 'एकूण जमा गुण' : 'Total XP Earned'}</Text>
          </View>

          <View style={styles.streakCol}>
            <View style={styles.streakPill}>
              <Flame size={14} color={COLORS.primary} fill={COLORS.primary} />
              <Text style={styles.streakPillText}>{streak} {language === 'mr' ? 'सलग' : 'Streak'}</Text>
            </View>
            <Text style={styles.scoreSub}>{language === 'mr' ? 'सलग अचूक उत्तरे' : 'Accuracy streak'}</Text>
          </View>
        </View>

        {/* Mode Selector Tabs */}
        <View style={styles.modeTabsRow}>
          <TouchableOpacity
            style={[styles.modeTabBtn, activeMode === 'mcq' && styles.modeTabBtnActive]}
            onPress={() => setActiveMode('mcq')}
          >
            <HelpCircle size={15} color={activeMode === 'mcq' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.modeTabText, activeMode === 'mcq' && styles.modeTabTextActive]}>
              {language === 'mr' ? 'MCQ क्विझ' : 'MCQ Quiz'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTabBtn, activeMode === 'matching' && styles.modeTabBtnActive]}
            onPress={() => setActiveMode('matching')}
          >
            <ArrowLeftRight size={15} color={activeMode === 'matching' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.modeTabText, activeMode === 'matching' && styles.modeTabTextActive]}>
              {language === 'mr' ? 'जोड्या लावा' : 'Match Pairs'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTabBtn, activeMode === 'builder' && styles.modeTabBtnActive]}
            onPress={() => setActiveMode('builder')}
          >
            <Puzzle size={15} color={activeMode === 'builder' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.modeTabText, activeMode === 'builder' && styles.modeTabTextActive]}>
              {language === 'mr' ? 'वाक्य जोडा' : 'Word Puzzle'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= 1. MCQ MODE ================= */}
        {activeMode === 'mcq' && currentQuiz && (
          <View style={styles.mcqCard}>
            <View style={styles.mcqTopRow}>
              <Text style={styles.mcqCounter}>
                {language === 'mr' ? `प्रश्न ${quizIdx + 1}/${quizzes.length}` : `Question ${quizIdx + 1}/${quizzes.length}`}
              </Text>
              <AudioButton text={currentQuiz.question_en || currentQuiz.correctAnswer} size={36} />
            </View>

            <Text style={styles.mcqQuestionText}>
              {language === 'mr' ? currentQuiz.question_mr : language === 'hi' ? currentQuiz.question_hi : currentQuiz.question_en}
            </Text>

            {currentQuiz.sentence && (
              <Text style={styles.mcqSentenceHint}>"{currentQuiz.sentence}"</Text>
            )}

            <View style={styles.mcqOptionsCol}>
              {currentQuiz.options.map((opt, optIdx) => {
                const isSelected = selectedAnswer === optIdx;
                const correctIdx = currentQuiz.correctAnswerIdx !== undefined ? currentQuiz.correctAnswerIdx : 1;
                const isCorrect = optIdx === correctIdx;

                let optStyle = styles.mcqOptBtn;
                if (isAnswerSubmitted) {
                  if (isCorrect) optStyle = [styles.mcqOptBtn, styles.mcqOptCorrect];
                  else if (isSelected && !isCorrect) optStyle = [styles.mcqOptBtn, styles.mcqOptWrong];
                } else if (isSelected) {
                  optStyle = [styles.mcqOptBtn, styles.mcqOptSelected];
                }

                return (
                  <TouchableOpacity
                    key={optIdx}
                    style={optStyle}
                    onPress={() => handleSelectAnswer(optIdx)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.mcqOptCircle}>
                      <Text style={styles.mcqOptCircleText}>{String.fromCharCode(65 + optIdx)}</Text>
                    </View>
                    <Text style={styles.mcqOptText}>{opt}</Text>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 size={18} color={COLORS.accentGreen} style={{ marginLeft: 'auto' }} />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle size={18} color={COLORS.accentRed} style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation & Next */}
            {isAnswerSubmitted && (
              <View style={styles.mcqFeedbackBox}>
                <Text style={styles.mcqFeedbackTitle}>
                  {selectedAnswer === (currentQuiz.correctAnswerIdx !== undefined ? currentQuiz.correctAnswerIdx : 1)
                    ? (language === 'mr' ? '🎉 बरोबर उत्तर! (+10 XP)' : '🎉 Correct! (+10 XP)')
                    : (language === 'mr' ? '❌ चूक! योग्य उत्तर पहा:' : '❌ Incorrect! Correct answer:')}
                </Text>
                {currentQuiz.explanation_mr && (
                  <Text style={styles.mcqExplanationText}>{currentQuiz.explanation_mr}</Text>
                )}
                <TouchableOpacity style={styles.mcqNextBtn} onPress={handleNextQuiz}>
                  <Text style={styles.mcqNextBtnText}>{language === 'mr' ? 'पुढील प्रश्न →' : 'Next Question →'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ================= 2. MATCHING PAIRS MODE ================= */}
        {activeMode === 'matching' && currentPairSet && (
          <View style={styles.matchingCard}>
            <Text style={styles.matchingHint}>
              {language === 'mr' ? 'डावीकडील इंग्रजी शब्द आणि उजवीकडील मराठी अर्थाच्या जोड्या लावा.' : 'Match English words with Marathi meanings.'}
            </Text>

            <View style={styles.matchColsRow}>
              {/* Left Col (English) */}
              <View style={styles.matchCol}>
                <Text style={styles.matchColHeading}>English</Text>
                {currentPairSet.pairs.map(p => {
                  const isMatched = matchedIds.includes(p.id);
                  const isSelected = selectedLeft === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.matchItemBtn,
                        isSelected && styles.matchItemBtnSelected,
                        isMatched && styles.matchItemBtnMatched,
                      ]}
                      disabled={isMatched}
                      onPress={() => setSelectedLeft(p.id)}
                    >
                      <Text style={[styles.matchItemText, isMatched && styles.matchItemTextMatched]}>
                        {p.en}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Right Col (Marathi) */}
              <View style={styles.matchCol}>
                <Text style={styles.matchColHeading}>मराठी</Text>
                {currentPairSet.pairs.map(p => {
                  const isMatched = matchedIds.includes(p.id);
                  const isSelected = selectedRight === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.matchItemBtn,
                        isSelected && styles.matchItemBtnSelected,
                        isMatched && styles.matchItemBtnMatched,
                      ]}
                      disabled={isMatched}
                      onPress={() => setSelectedRight(p.id)}
                    >
                      <Text style={[styles.matchItemText, isMatched && styles.matchItemTextMatched]}>
                        {language === 'mr' ? p.mr : p.hi || p.mr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {matchedIds.length === currentPairSet.pairs.length && (
              <View style={styles.matchWinBox}>
                <Sparkles size={24} color={COLORS.accentAmberDark} />
                <Text style={styles.matchWinTitle}>
                  {language === 'mr' ? 'अभिनंदन! सर्व जोड्या जुळल्या! (+50 XP)' : 'Awesome! All matched!'}
                </Text>
                <TouchableOpacity
                  style={styles.matchNextBtn}
                  onPress={() => {
                    setPairSetIdx((pairSetIdx + 1) % MATCH_PAIRS_SETS.length);
                    setMatchedIds([]);
                    setSelectedLeft(null);
                    setSelectedRight(null);
                  }}
                >
                  <Text style={styles.matchNextBtnText}>{language === 'mr' ? 'नवीन सेट खेळा →' : 'Next Set →'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ================= 3. SENTENCE BUILDER MODE ================= */}
        {activeMode === 'builder' && currentPuzzle && (
          <View style={styles.builderCard}>
            <Text style={styles.builderTargetMeaning}>
              {language === 'mr' ? currentPuzzle.meaning_mr : currentPuzzle.meaning_hi || currentPuzzle.meaning_mr}
            </Text>
            <Text style={styles.builderHint}>
              {language === 'mr' ? 'खालील शब्दांवर टॅप करून योग्य इंग्रजी वाक्य बनवा:' : 'Tap words in order to form the correct sentence:'}
            </Text>

            {/* Assembled Words Box */}
            <View style={styles.assembledBox}>
              {assembledWords.length === 0 ? (
                <Text style={styles.assembledPlaceholder}>
                  {language === 'mr' ? 'शब्द येथे दिसतील...' : 'Tapped words appear here...'}
                </Text>
              ) : (
                <View style={styles.tokensRow}>
                  {assembledWords.map((word, wIdx) => (
                    <TouchableOpacity
                      key={wIdx}
                      style={styles.assembledToken}
                      onPress={() => {
                        setAssembledWords(prev => prev.filter((_, i) => i !== wIdx));
                        setAvailableWords(prev => [...prev, word]);
                        setBuilderStatus(null);
                      }}
                    >
                      <Text style={styles.assembledTokenText}>{word}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Available Word Bank Tokens */}
            <View style={styles.availableBox}>
              {availableWords.map((word, wIdx) => (
                <TouchableOpacity
                  key={wIdx}
                  style={styles.availableToken}
                  onPress={() => {
                    setAvailableWords(prev => prev.filter((_, i) => i !== wIdx));
                    setAssembledWords(prev => [...prev, word]);
                    setBuilderStatus(null);
                  }}
                >
                  <Text style={styles.availableTokenText}>{word}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback & Actions */}
            {builderStatus === 'correct' && (
              <View style={styles.builderSuccessBox}>
                <CheckCircle2 size={20} color={COLORS.accentGreen} />
                <Text style={styles.builderSuccessText}>
                  {language === 'mr' ? '✓ अगदी बरोबर वाक्य! (+15 XP)' : '✓ Correct Sentence! (+15 XP)'}
                </Text>
                <AudioButton text={currentPuzzle.targetEn} size={36} />
              </View>
            )}

            {builderStatus === 'wrong' && (
              <View style={styles.builderWrongBox}>
                <XCircle size={20} color={COLORS.accentRed} />
                <Text style={styles.builderWrongText}>
                  {language === 'mr' ? 'वाक्यरचना बरोबर नाही, पुन्हा प्रयत्न करा.' : 'Incorrect order, try again.'}
                </Text>
              </View>
            )}

            <View style={styles.builderActionsRow}>
              <TouchableOpacity
                style={styles.builderResetBtn}
                onPress={() => {
                  setAvailableWords([...currentPuzzle.words].sort(() => 0.5 - Math.random()));
                  setAssembledWords([]);
                  setBuilderStatus(null);
                }}
              >
                <RotateCcw size={16} color={COLORS.textMuted} />
              </TouchableOpacity>

              {builderStatus === 'correct' ? (
                <TouchableOpacity
                  style={styles.builderNextBtn}
                  onPress={() => setPuzzleIdx((puzzleIdx + 1) % SENTENCE_PUZZLES.length)}
                >
                  <Text style={styles.builderNextBtnText}>{language === 'mr' ? 'पुढील वाक्य →' : 'Next Puzzle →'}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.builderCheckBtn, assembledWords.length === 0 && styles.builderCheckBtnDisabled]}
                  disabled={assembledWords.length === 0}
                  onPress={handleCheckSentence}
                >
                  <Text style={styles.builderCheckBtnText}>{language === 'mr' ? 'वाक्य तपासा' : 'Check Sentence'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>
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
  scoreHeaderCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  scoreCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
    paddingRight: 10,
  },
  streakCol: {
    flex: 1,
    paddingLeft: 10,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scorePillText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.accentAmberDark,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakPillText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  scoreSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modeTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.md,
    padding: 3,
    marginBottom: SPACING.md,
    gap: 4,
  },
  modeTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
  },
  modeTabBtnActive: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.sm,
  },
  modeTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  modeTabTextActive: {
    color: COLORS.white,
  },
  mcqCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  mcqTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mcqCounter: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  mcqQuestionText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMain,
    lineHeight: 22,
    marginBottom: 8,
  },
  mcqSentenceHint: {
    fontSize: 13,
    color: COLORS.secondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  mcqOptionsCol: {
    gap: 8,
    marginVertical: 8,
  },
  mcqOptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  mcqOptSelected: {
    backgroundColor: COLORS.secondaryLight,
    borderColor: COLORS.secondary,
  },
  mcqOptCorrect: {
    backgroundColor: COLORS.accentGreenLight,
    borderColor: COLORS.accentGreen,
  },
  mcqOptWrong: {
    backgroundColor: COLORS.accentRedLight,
    borderColor: COLORS.accentRed,
  },
  mcqOptCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mcqOptCircleText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  mcqOptText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMain,
    flex: 1,
  },
  mcqFeedbackBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  mcqFeedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  mcqExplanationText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  mcqNextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: 8,
  },
  mcqNextBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  matchingCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  matchingHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  matchColsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  matchCol: {
    flex: 1,
    gap: 8,
  },
  matchColHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginBottom: 4,
    textAlign: 'center',
  },
  matchItemBtn: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  matchItemBtnSelected: {
    backgroundColor: COLORS.secondaryLight,
    borderColor: COLORS.secondary,
  },
  matchItemBtnMatched: {
    backgroundColor: COLORS.accentGreenLight,
    borderColor: COLORS.accentGreen,
    opacity: 0.6,
  },
  matchItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMain,
    textAlign: 'center',
  },
  matchItemTextMatched: {
    color: COLORS.accentGreenDark,
    textDecorationLine: 'line-through',
  },
  matchWinBox: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  matchWinTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.accentGreenDark,
    textAlign: 'center',
  },
  matchNextBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  matchNextBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  builderCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  builderTargetMeaning: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  builderHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  assembledBox: {
    minHeight: 70,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    marginBottom: 12,
  },
  assembledPlaceholder: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  tokensRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  assembledToken: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  assembledTokenText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  availableBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  availableToken: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  availableTokenText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  builderSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.accentGreenLight,
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: 12,
  },
  builderSuccessText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accentGreenDark,
    flex: 1,
  },
  builderWrongBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.accentRedLight,
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: 12,
  },
  builderWrongText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentRedDark,
    flex: 1,
  },
  builderActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  builderResetBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  builderCheckBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  builderCheckBtnDisabled: {
    opacity: 0.4,
  },
  builderCheckBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
  builderNextBtn: {
    flex: 1,
    backgroundColor: COLORS.accentGreen,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  builderNextBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
});
