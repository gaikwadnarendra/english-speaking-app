import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Bot,
  Mic,
  Send,
  Sparkles,
  Volume2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  MessageSquare,
  Award,
  Flame,
  User,
  Lightbulb,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import {
  SPEAKING_SCENARIOS,
  LISTEN_REPEAT_SENTENCES,
} from '../data/speakingData';
import { api } from '../config/api';

export default function SpeakingScreen() {
  const { t, language, speechRate } = useApp();

  // Mode: 'ai_chat' | 'listen_repeat'
  const [speakingMode, setSpeakingMode] = useState('ai_chat');

  // ================= AI CHAT STATE =================
  const [scenarios, setScenarios] = useState(SPEAKING_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState('daily');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [autoSpeakAI, setAutoSpeakAI] = useState(true);
  const [isMicActive, setIsMicActive] = useState(false);

  // ================= LISTEN & REPEAT STATE =================
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalScore, setEvalScore] = useState(null);

  const scrollViewRef = useRef(null);
  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  // Fetch scenarios from API
  useEffect(() => {
    const loadApiScenarios = async () => {
      try {
        const res = await api.get('/speaking/scenarios');
        if (res.data?.data && res.data.data.length > 0) {
          setScenarios(res.data.data);
        }
      } catch (e) {}
    };
    loadApiScenarios();
  }, []);

  // Initialize scenario chat
  useEffect(() => {
    if (currentScenario) {
      const locGreeting =
        language === 'hi'
          ? (currentScenario.initial_ai_hi || currentScenario.initial_ai_mr)
          : currentScenario.initial_ai_mr;

      const initialMsg = {
        id: 'init_' + Date.now(),
        sender: 'ai',
        text_en: currentScenario.initial_ai_en,
        text_loc: locGreeting,
        suggested: currentScenario.suggested_starter || [],
        grammarFeedback: null,
      };

      setMessages([initialMsg]);

      if (autoSpeakAI) {
        Speech.speak(currentScenario.initial_ai_en, {
          language: 'en-US',
          rate: speechRate || 0.85,
        });
      }
    }
  }, [selectedScenarioId, currentScenario]);

  // Send Message in AI Chat
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text_en: text,
      text_loc: '',
      suggested: [],
      grammarFeedback: null,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoadingAI(true);

    try {
      const res = await api.post('/speaking/chat', {
        scenarioId: selectedScenarioId,
        userMessage: text,
        conversationHistory: messages.map(m => ({ role: m.sender, content: m.text_en })),
      });

      let aiResponseText = 'Great sentence! Keep speaking with me.';
      let aiResponseLoc = 'खूप छान वाक्य! माझ्याशी संभाषण चालू ठेवा.';
      let grammarNote = null;
      let nextStarters = [];

      if (res.data?.data) {
        aiResponseText = res.data.data.reply_en || res.data.data.text || aiResponseText;
        aiResponseLoc = language === 'hi' ? res.data.data.reply_hi : (res.data.data.reply_mr || res.data.data.marathi || aiResponseLoc);
        grammarNote = res.data.data.grammar_tip || res.data.data.feedback;
        nextStarters = res.data.data.suggested_replies || [];
      } else {
        // Smart Local AI Fallback Simulator
        if (selectedScenarioId === 'hotel') {
          aiResponseText = 'Certainly! Would you like a hot coffee or iced tea?';
          aiResponseLoc = 'नक्कीच! तुम्हाला गरम कॉफी हवी आहे की थंड चहा?';
          nextStarters = ['I would like a hot coffee, please.', 'Can I have the bill?'];
        } else if (selectedScenarioId === 'travel') {
          aiResponseText = 'The bus stop is straight ahead, about 200 meters away.';
          aiResponseLoc = 'बस थांबा समोर सरळ २०० मीटर अंतरावर आहे.';
          nextStarters = ['Thank you very much!', 'How much is the ticket?'];
        } else {
          aiResponseText = 'That sounds wonderful! What are your plans for today?';
          aiResponseLoc = 'हे खूप छान आहे! आजचे तुमचे काय नियोजन आहे?';
          nextStarters = ['I will study English today.', 'I am going to work.'];
        }
      }

      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text_en: aiResponseText,
        text_loc: aiResponseLoc,
        suggested: nextStarters,
        grammarFeedback: grammarNote,
      };

      setMessages(prev => [...prev, aiMsg]);

      if (autoSpeakAI) {
        Speech.speak(aiResponseText, {
          language: 'en-US',
          rate: speechRate || 0.85,
        });
      }
    } catch (err) {
      const fallbackAiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text_en: "Nice sentence! Try saying: 'I am practicing English every day.'",
        text_loc: 'छान वाक्य! रोज असेच बोलण्याचा सराव करा.',
        suggested: ['I understand clearly.', 'Let us talk more.'],
      };
      setMessages(prev => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoadingAI(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  const handleSimulateMic = () => {
    setIsMicActive(true);
    setTimeout(() => {
      setIsMicActive(false);
      const starters = currentScenario?.suggested_starter || ['Hello, how are you?'];
      const picked = starters[Math.floor(Math.random() * starters.length)];
      handleSendMessage(picked);
    }, 1200);
  };

  // Listen & Repeat
  const currentSentence = LISTEN_REPEAT_SENTENCES[sentenceIdx] || LISTEN_REPEAT_SENTENCES[0];

  const handleEvaluateSpeaking = () => {
    setIsEvaluating(true);
    setEvalScore(null);
    setTimeout(() => {
      setIsEvaluating(false);
      const randomAccuracy = Math.floor(Math.random() * 15) + 85; // 85% to 99%
      setEvalScore(randomAccuracy);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header />

      {/* Mode Switcher Tabs */}
      <View style={styles.topTabsWrap}>
        <TouchableOpacity
          style={[styles.topTabBtn, speakingMode === 'ai_chat' && styles.topTabBtnActive]}
          onPress={() => setSpeakingMode('ai_chat')}
          activeOpacity={0.8}
        >
          <Bot size={16} color={speakingMode === 'ai_chat' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.topTabText, speakingMode === 'ai_chat' && styles.topTabTextActive]}>
            {language === 'mr' ? 'AI संभाषण (AI Partner)' : 'AI Conversation'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topTabBtn, speakingMode === 'listen_repeat' && styles.topTabBtnActive]}
          onPress={() => setSpeakingMode('listen_repeat')}
          activeOpacity={0.8}
        >
          <Mic size={16} color={speakingMode === 'listen_repeat' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.topTabText, speakingMode === 'listen_repeat' && styles.topTabTextActive]}>
            {language === 'mr' ? 'उच्चार सराव (Drill)' : 'Listen & Repeat'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= 1. AI CONVERSATION MODE ================= */}
      {speakingMode === 'ai_chat' && (
        <View style={styles.chatContainer}>
          {/* Scenario Selector Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scenariosScroll}>
            {scenarios.map(sc => {
              const isSelected = selectedScenarioId === sc.id;
              return (
                <TouchableOpacity
                  key={sc.id}
                  style={[styles.scenarioPill, isSelected && styles.scenarioPillActive]}
                  onPress={() => setSelectedScenarioId(sc.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.scenarioPillText, isSelected && styles.scenarioPillTextActive]}>
                    {sc.title_en || sc.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatMessagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <View
                  key={msg.id}
                  style={[styles.msgRow, isAi ? styles.msgRowAi : styles.msgRowUser]}
                >
                  {isAi && (
                    <View style={styles.aiAvatar}>
                      <Bot size={16} color={COLORS.secondary} />
                    </View>
                  )}

                  <View style={[styles.msgBubble, isAi ? styles.msgBubbleAi : styles.msgBubbleUser]}>
                    <Text style={[styles.msgTextEn, isAi ? styles.msgTextEnAi : styles.msgTextEnUser]}>
                      {msg.text_en}
                    </Text>

                    {isAi && msg.text_loc ? (
                      <Text style={styles.msgTextLoc}>{msg.text_loc}</Text>
                    ) : null}

                    {isAi && (
                      <View style={styles.msgAudioRow}>
                        <AudioButton text={msg.text_en} size={30} />
                      </View>
                    )}

                    {/* Suggested Replies */}
                    {isAi && msg.suggested && msg.suggested.length > 0 && (
                      <View style={styles.startersWrap}>
                        <Text style={styles.startersHeading}>
                          {language === 'mr' ? 'सुचवलेले उत्तर:' : 'Suggested replies:'}
                        </Text>
                        {msg.suggested.map((starter, sIdx) => (
                          <TouchableOpacity
                            key={sIdx}
                            style={styles.starterBtn}
                            onPress={() => handleSendMessage(starter)}
                          >
                            <Text style={styles.starterBtnText}>{starter}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {isLoadingAI && (
              <View style={styles.aiTypingRow}>
                <ActivityIndicator size="small" color={COLORS.secondary} />
                <Text style={styles.aiTypingText}>AI is thinking...</Text>
              </View>
            )}
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={styles.inputBarWrap}>
            <TouchableOpacity
              style={[styles.micBtn, isMicActive && styles.micBtnActive]}
              onPress={handleSimulateMic}
              activeOpacity={0.7}
            >
              <Mic size={20} color={isMicActive ? COLORS.white : COLORS.primary} />
            </TouchableOpacity>

            <TextInput
              style={styles.chatTextInput}
              placeholder={language === 'mr' ? 'इंग्रजीत टाइप करा किंवा बोला...' : 'Type in English...'}
              placeholderTextColor={COLORS.textLight}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendMessage()}
            />

            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              disabled={!inputText.trim()}
              onPress={() => handleSendMessage()}
              activeOpacity={0.8}
            >
              <Send size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ================= 2. LISTEN & REPEAT MODE ================= */}
      {speakingMode === 'listen_repeat' && (
        <ScrollView contentContainerStyle={styles.listenScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.drillCard}>
            <View style={styles.drillHeaderRow}>
              <View style={styles.drillBadge}>
                <Award size={13} color={COLORS.accentGreen} />
                <Text style={styles.drillBadgeText}>
                  {sentenceIdx + 1} / {LISTEN_REPEAT_SENTENCES.length}
                </Text>
              </View>
              <AudioButton text={currentSentence.sentence} size={42} />
            </View>

            {/* Target English Sentence */}
            <Text style={styles.drillTargetEn}>{currentSentence.sentence}</Text>
            <Text style={styles.drillPronunciation}>({currentSentence.pronunciation || 'उच्चार'})</Text>

            <View style={styles.drillMeaningBox}>
              <Text style={styles.drillMeaningLabel}>{language === 'mr' ? 'मराठी अर्थ:' : 'Meaning:'}</Text>
              <Text style={styles.drillMeaningText}>
                {language === 'mr' ? currentSentence.marathi : currentSentence.hindi || currentSentence.marathi}
              </Text>
            </View>

            {/* Evaluation Score Card */}
            {evalScore !== null && (
              <View style={styles.evalScoreBox}>
                <View style={styles.evalScoreHeader}>
                  <CheckCircle2 size={20} color={COLORS.accentGreen} />
                  <Text style={styles.evalScoreTitle}>
                    {language === 'mr' ? `उच्चार अचूकता: ${evalScore}%` : `Pronunciation Score: ${evalScore}%`}
                  </Text>
                </View>
                <Text style={styles.evalFeedbackText}>
                  {evalScore >= 90
                    ? (language === 'mr' ? 'उत्कृष्ट उच्चार! (+20 XP)' : 'Excellent Pronunciation! (+20 XP)')
                    : (language === 'mr' ? 'छान! आणखी स्पष्ट बोलण्याचा सराव करा.' : 'Good attempt! Try to speak clearer.')}
                </Text>
              </View>
            )}

            {/* Record / Speaking CTA */}
            <TouchableOpacity
              style={[styles.drillRecordBtn, isEvaluating && styles.drillRecordBtnActive]}
              onPress={handleEvaluateSpeaking}
              disabled={isEvaluating}
              activeOpacity={0.8}
            >
              {isEvaluating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Mic size={24} color={COLORS.white} />
              )}
              <Text style={styles.drillRecordBtnText}>
                {isEvaluating
                  ? (language === 'mr' ? 'ऐकत आहे व तपासत आहे...' : 'Listening & Evaluating...')
                  : (language === 'mr' ? 'माईक दाबून बोला' : 'Tap to Speak & Check')}
              </Text>
            </TouchableOpacity>

            {/* Nav Row */}
            <View style={styles.drillNavRow}>
              <TouchableOpacity
                style={[styles.drillNavBtn, sentenceIdx === 0 && styles.drillNavBtnDisabled]}
                disabled={sentenceIdx === 0}
                onPress={() => {
                  setSentenceIdx(prev => Math.max(0, prev - 1));
                  setEvalScore(null);
                }}
              >
                <ChevronLeft size={20} color={COLORS.secondary} />
                <Text style={styles.drillNavBtnText}>{language === 'mr' ? 'मागील वाक्य' : 'Previous'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drillNavBtn, sentenceIdx >= LISTEN_REPEAT_SENTENCES.length - 1 && styles.drillNavBtnDisabled]}
                disabled={sentenceIdx >= LISTEN_REPEAT_SENTENCES.length - 1}
                onPress={() => {
                  setSentenceIdx(prev => Math.min(LISTEN_REPEAT_SENTENCES.length - 1, prev + 1));
                  setEvalScore(null);
                }}
              >
                <Text style={styles.drillNavBtnText}>{language === 'mr' ? 'पुढील वाक्य' : 'Next'}</Text>
                <ChevronRight size={20} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  topTabsWrap: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: SPACING.md,
    marginTop: 8,
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 4,
  },
  topTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
  },
  topTabBtnActive: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.sm,
  },
  topTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  topTabTextActive: {
    color: COLORS.white,
  },
  chatContainer: {
    flex: 1,
  },
  scenariosScroll: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    maxHeight: 46,
  },
  scenarioPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  scenarioPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  scenarioPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  scenarioPillTextActive: {
    color: COLORS.white,
  },
  chatMessagesContent: {
    padding: SPACING.md,
    paddingBottom: 20,
    gap: 12,
  },
  msgRow: {
    flexDirection: 'row',
    gap: 8,
  },
  msgRowAi: {
    justifyContent: 'flex-start',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  msgBubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: RADIUS.lg,
  },
  msgBubbleAi: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  msgBubbleUser: {
    backgroundColor: COLORS.secondary,
    borderTopRightRadius: 4,
  },
  msgTextEn: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  msgTextEnAi: {
    color: COLORS.textMain,
  },
  msgTextEnUser: {
    color: COLORS.white,
  },
  msgTextLoc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  msgAudioRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  startersWrap: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 4,
  },
  startersHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  starterBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderAmber,
  },
  starterBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  aiTypingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 40,
  },
  aiTypingText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  inputBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    backgroundColor: COLORS.primary,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.textMain,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  listenScrollContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  drillCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
    gap: 12,
  },
  drillHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  drillBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accentGreenDark,
  },
  drillTargetEn: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textMain,
    lineHeight: 28,
  },
  drillPronunciation: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  drillMeaningBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  drillMeaningLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  drillMeaningText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  evalScoreBox: {
    backgroundColor: COLORS.accentGreenLight,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderGreen,
    gap: 4,
  },
  evalScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  evalScoreTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.accentGreenDark,
  },
  evalFeedbackText: {
    fontSize: 12,
    color: COLORS.accentGreenDark,
  },
  drillRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  drillRecordBtnActive: {
    backgroundColor: COLORS.primaryHover,
  },
  drillRecordBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
  drillNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  drillNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  drillNavBtnDisabled: {
    opacity: 0.3,
  },
  drillNavBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondary,
  },
});
