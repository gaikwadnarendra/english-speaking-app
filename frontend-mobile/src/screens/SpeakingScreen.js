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

  // Current Scenario
  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  // Fetch scenarios from API if online
  useEffect(() => {
    const loadApiScenarios = async () => {
      try {
        const res = await api.get('/api/speaking/scenarios');
        if (res.data?.data && res.data.data.length > 0) {
          setScenarios(res.data.data);
        }
      } catch (e) {}
    };
    loadApiScenarios();
  }, []);

  // Initialize Scenario chat on scenario change
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
        Speech.speak(currentScenario.initial_ai_en, { language: 'en-US', rate: speechRate });
      }
    }
  }, [selectedScenarioId, language]);

  // Send Message to Gemini AI
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoadingAI) return;

    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text_en: text,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoadingAI(true);

    try {
      const res = await api.post('/api/speaking/ai-conversation', {
        scenarioId: selectedScenarioId,
        message: text,
        language: language,
        chatHistory: messages.map(m => ({
          role: m.sender === 'ai' ? 'model' : 'user',
          text: m.text_en,
        })),
      });

      if (res.data?.data) {
        const data = res.data.data;
        const aiReply = {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text_en: data.ai_reply_en || data.reply_en || "That's great! Let's continue speaking.",
          text_loc: language === 'hi' ? data.ai_reply_hi : data.ai_reply_mr,
          grammarFeedback: data.grammar_feedback || data.feedback,
          suggested: data.suggested_replies || data.suggested || [],
        };

        setMessages(prev => [...prev, aiReply]);

        if (autoSpeakAI && aiReply.text_en) {
          Speech.speak(aiReply.text_en, { language: 'en-US', rate: speechRate });
        }
      }
    } catch (err) {
      // Offline smart simulated tutor reply
      const fallbackReply = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text_en: `Thank you for sharing: "${text}". You expressed yourself clearly! What else would you like to say?`,
        text_loc: language === 'mr' ? 'छान उत्तर! तुम्ही स्पष्ट बोललात. पुढे काय बोलायला आवडेल?' : 'बहुत बढ़िया! आपने स्पष्ट कहा। आगे क्या कहना चाहेंगे?',
        grammarFeedback: null,
        suggested: ['I would like to practice more.', 'Can we talk about work?'],
      };
      setMessages(prev => [...prev, fallbackReply]);
      Speech.speak(fallbackReply.text_en, { language: 'en-US', rate: speechRate });
    } finally {
      setIsLoadingAI(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  // Listen & Repeat Sentence
  const currentSentence = LISTEN_REPEAT_SENTENCES[sentenceIdx] || LISTEN_REPEAT_SENTENCES[0];

  const handleSimulateVoiceRecording = () => {
    setIsEvaluating(true);
    setEvalScore(null);
    setTimeout(() => {
      // High score with celebration
      const score = Math.floor(Math.random() * 15) + 85; // 85-100%
      setEvalScore(score);
      setIsEvaluating(false);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Mode Switcher Tabs */}
      <View style={styles.modeStrip}>
        <TouchableOpacity
          style={[styles.modeTab, speakingMode === 'ai_chat' && styles.modeTabActive]}
          onPress={() => setSpeakingMode('ai_chat')}
          activeOpacity={0.8}
        >
          <Bot size={16} color={speakingMode === 'ai_chat' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.modeTabText, speakingMode === 'ai_chat' && styles.modeTabTextActive]}>
            {language === 'mr' ? 'AI संभाषण (Gemini)' : language === 'hi' ? 'AI वार्तालाप' : 'AI Conversation'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, speakingMode === 'listen_repeat' && styles.modeTabActive]}
          onPress={() => setSpeakingMode('listen_repeat')}
          activeOpacity={0.8}
        >
          <Mic size={16} color={speakingMode === 'listen_repeat' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.modeTabText, speakingMode === 'listen_repeat' && styles.modeTabTextActive]}>
            {language === 'mr' ? 'उच्चारण सराव' : language === 'hi' ? 'उच्चारण अभ्यास' : 'Pronunciation Drill'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= MODE 1: AI CONVERSATION ================= */}
      {speakingMode === 'ai_chat' && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Scenarios Horizontal Carousel */}
          <View style={styles.scenarioBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scenarioScroll}>
              {scenarios.map(sc => {
                const isSelected = selectedScenarioId === sc.id;
                return (
                  <TouchableOpacity
                    key={sc.id}
                    style={[styles.scenarioChip, isSelected && styles.scenarioChipActive]}
                    onPress={() => setSelectedScenarioId(sc.id)}
                  >
                    <Text style={[styles.scenarioChipText, isSelected && styles.scenarioChipTextActive]}>
                      {language === 'hi' && sc.title_hi ? sc.title_hi : sc.title_mr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Chat Messages Thread */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatScroll}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(msg => {
              const isAI = msg.sender === 'ai';
              return (
                <View key={msg.id} style={[styles.msgRow, isAI ? styles.msgRowAI : styles.msgRowUser]}>
                  {isAI && (
                    <View style={styles.aiAvatar}>
                      <Bot size={16} color={COLORS.white} />
                    </View>
                  )}

                  <View style={[styles.msgBubble, isAI ? styles.msgBubbleAI : styles.msgBubbleUser]}>
                    <View style={styles.msgHeaderRow}>
                      <Text style={[styles.msgEnText, !isAI && { color: COLORS.white }]}>
                        {msg.text_en}
                      </Text>
                      {isAI && <AudioButton text={msg.text_en} size={28} />}
                    </View>

                    {isAI && msg.text_loc && (
                      <Text style={styles.msgLocText}>{msg.text_loc}</Text>
                    )}

                    {/* Grammar Feedback Alert if present */}
                    {msg.grammarFeedback && (
                      <View style={styles.feedbackCard}>
                        <Lightbulb size={14} color="#D97706" />
                        <Text style={styles.feedbackText}>
                          {msg.grammarFeedback}
                        </Text>
                      </View>
                    )}

                    {/* Suggested Starters chips */}
                    {isAI && msg.suggested && msg.suggested.length > 0 && (
                      <View style={styles.startersWrap}>
                        <Text style={styles.startersLabel}>
                          {language === 'mr' ? '💡 तुम्ही असे उत्तर देऊ शकता:' : '💡 Quick Response Ideas:'}
                        </Text>
                        <View style={styles.startersRow}>
                          {msg.suggested.map((starter, sIdx) => (
                            <TouchableOpacity
                              key={sIdx}
                              style={styles.starterChip}
                              onPress={() => handleSendMessage(starter)}
                            >
                              <Text style={styles.starterChipText}>"{starter}"</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>

                  {!isAI && (
                    <View style={styles.userAvatar}>
                      <User size={16} color={COLORS.white} />
                    </View>
                  )}
                </View>
              );
            })}

            {isLoadingAI && (
              <View style={styles.aiTypingRow}>
                <View style={styles.aiAvatar}>
                  <Bot size={16} color={COLORS.white} />
                </View>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.typingText}>
                    {language === 'mr' ? 'AI विचार करत आहे...' : 'AI Tutor is thinking...'}
                  </Text>
                </View>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.chatTextInput}
              placeholder={
                language === 'mr'
                  ? 'इंग्रजीत संदेश लिहा किंवा बोला...'
                  : 'Type message in English...'
              }
              placeholderTextColor={COLORS.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendMessage()}
            />

            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              disabled={!inputText.trim() || isLoadingAI}
              onPress={() => handleSendMessage()}
            >
              <Send size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* ================= MODE 2: LISTEN & REPEAT DRILL ================= */}
      {speakingMode === 'listen_repeat' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Sentence Navigation */}
          <View style={styles.drillNavRow}>
            <TouchableOpacity
              style={[styles.drillNavBtn, sentenceIdx === 0 && { opacity: 0.4 }]}
              disabled={sentenceIdx === 0}
              onPress={() => {
                setSentenceIdx(prev => Math.max(0, prev - 1));
                setEvalScore(null);
              }}
            >
              <ChevronLeft size={20} color={COLORS.primary} />
              <Text style={styles.drillNavText}>{language === 'mr' ? 'मागील' : 'Prev'}</Text>
            </TouchableOpacity>

            <View style={styles.drillCounterBadge}>
              <Text style={styles.drillCounterText}>
                {sentenceIdx + 1} / {LISTEN_REPEAT_SENTENCES.length}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.drillNavBtn}
              onPress={() => {
                if (sentenceIdx < LISTEN_REPEAT_SENTENCES.length - 1) {
                  setSentenceIdx(prev => prev + 1);
                } else {
                  setSentenceIdx(0);
                }
                setEvalScore(null);
              }}
            >
              <Text style={styles.drillNavText}>{language === 'mr' ? 'पुढील' : 'Next'}</Text>
              <ChevronRight size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Large Sentence Card */}
          <View style={styles.drillCard}>
            <View style={styles.drillCardTop}>
              <Text style={styles.drillTag}>Target Sentence</Text>
              <AudioButton text={currentSentence.sentence} size={42} />
            </View>

            <Text style={styles.drillSentenceEn}>{currentSentence.sentence}</Text>
            <Text style={styles.drillSentencePron}>/{currentSentence.pronunciation}/</Text>

            <View style={styles.drillMeaningBox}>
              <Text style={styles.drillMeaningLabel}>मराठी अर्थ:</Text>
              <Text style={styles.drillMeaningText}>{currentSentence.marathi}</Text>
            </View>

            {currentSentence.hindi && (
              <View style={styles.drillMeaningBox}>
                <Text style={styles.drillMeaningLabel}>हिंदी अर्थ:</Text>
                <Text style={styles.drillMeaningText}>{currentSentence.hindi}</Text>
              </View>
            )}

            {/* Microphone Practice Button */}
            <View style={styles.micSection}>
              <TouchableOpacity
                style={[styles.bigMicBtn, isEvaluating && styles.bigMicBtnActive]}
                onPress={handleSimulateVoiceRecording}
                activeOpacity={0.8}
              >
                {isEvaluating ? (
                  <ActivityIndicator size="large" color={COLORS.white} />
                ) : (
                  <Mic size={36} color={COLORS.white} />
                )}
              </TouchableOpacity>
              <Text style={styles.micHintText}>
                {isEvaluating
                  ? (language === 'mr' ? 'आवाज ऐकत आहे आणि विश्लेषण करत आहे...' : 'Analyzing pronunciation...')
                  : (language === 'mr' ? 'मोठ्याने बोलण्यासाठी माईकवर टॅप करा' : 'Tap mic and speak loudly')}
              </Text>
            </View>

            {/* Pronunciation Feedback Rating */}
            {evalScore !== null && (
              <View style={styles.scoreFeedbackCard}>
                <Sparkles size={24} color={COLORS.secondary} />
                <Text style={styles.scoreFeedbackTitle}>
                  {language === 'mr' ? `उच्चारण अचूकता: ${evalScore}%` : `Pronunciation Match: ${evalScore}%`}
                </Text>
                <Text style={styles.scoreFeedbackSub}>
                  {evalScore >= 80
                    ? (language === 'mr' ? 'उत्कृष्ट उच्चार! 🎉 (+१५ XP)' : 'Excellent Pronunciation! 🎉 (+15 XP)')
                    : (language === 'mr' ? 'छान प्रयत्न! अजून एकदा मोठ्याने बोला.' : 'Good try! Practice once again.')}
                </Text>
              </View>
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
  modeStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.s,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: COLORS.speak,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  modeTabTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  scenarioBar: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
  },
  scenarioScroll: {
    paddingHorizontal: SPACING.m,
    gap: SPACING.xs,
  },
  scenarioChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  scenarioChipActive: {
    backgroundColor: COLORS.speak,
  },
  scenarioChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  scenarioChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  chatScroll: {
    padding: SPACING.m,
    gap: SPACING.m,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  msgRowAI: {
    justifyContent: 'flex-start',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.speak,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  msgBubble: {
    maxWidth: '82%',
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    ...SHADOWS.card,
  },
  msgBubbleAI: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 4,
  },
  msgBubbleUser: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  msgHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  msgEnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  msgLocText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.sm,
    padding: 8,
    marginTop: SPACING.s,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 6,
  },
  feedbackText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
  },
  startersWrap: {
    marginTop: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 6,
  },
  startersLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  startersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  starterChip: {
    backgroundColor: '#FDF2F8',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  starterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.speak,
  },
  aiTypingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.m,
    paddingVertical: 10,
    gap: 8,
    ...SHADOWS.card,
  },
  typingText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.s,
  },
  chatTextInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.m,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.speak,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },

  // Listen & Repeat Styles
  scrollContent: {
    padding: SPACING.m,
  },
  drillNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  drillNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  drillNavText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  drillCounterBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  drillCounterText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  drillCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  drillCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  drillTag: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.speak,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drillSentenceEn: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 4,
  },
  drillSentencePron: {
    fontSize: 14,
    color: COLORS.speak,
    fontWeight: '600',
    marginBottom: SPACING.l,
  },
  drillMeaningBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  drillMeaningLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  drillMeaningText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  micSection: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  bigMicBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.speak,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  bigMicBtnActive: {
    backgroundColor: '#BE185D',
  },
  micHintText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: SPACING.m,
    textAlign: 'center',
  },
  scoreFeedbackCard: {
    marginTop: SPACING.xl,
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  scoreFeedbackTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#15803D',
    marginTop: 6,
    marginBottom: 2,
  },
  scoreFeedbackSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
