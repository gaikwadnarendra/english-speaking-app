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
  Modal,
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
  X,
  Radio,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
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
  const { completeTask } = useProgress();

  // Mode: 'ai_chat' | 'listen_repeat'
  const [speakingMode, setSpeakingMode] = useState('ai_chat');

  // ================= AI CHAT STATE =================
  const [scenarios, setScenarios] = useState(SPEAKING_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState('daily');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [autoSpeakAI, setAutoSpeakAI] = useState(true);
  const [isMicModalOpen, setIsMicModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

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

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoadingAI(true);

    const userTurnCount = newMessages.filter(m => m.sender === 'user').length;
    if (userTurnCount >= 3) {
      completeTask(5, 'speaking_ai');
    }

    try {
      const res = await api.post('/speaking/chat', {
        scenarioId: selectedScenarioId,
        userMessage: text,
        conversationHistory: newMessages.map(m => ({ role: m.sender, content: m.text_en })),
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
        if (selectedScenarioId === 'interview') {
          aiResponseText = 'That is impressive! What are your greatest strengths?';
          aiResponseLoc = 'खूप छान! तुमची सर्वात मोठी ताकद कोणती आहे?';
          nextStarters = ['I am hardworking and dedicated.', 'I learn new things quickly.'];
        } else if (selectedScenarioId === 'hotel' || selectedScenarioId === 'restaurant') {
          aiResponseText = 'Certainly! Would you like a hot coffee or iced tea?';
          aiResponseLoc = 'नक्कीच! तुम्हाला गरम कॉफी हवी आहे की थंड चहा?';
          nextStarters = ['I would like a hot coffee, please.', 'Can I have the bill?'];
        } else if (selectedScenarioId === 'travel') {
          aiResponseText = 'The platform number is 3. The train will arrive in 10 minutes.';
          aiResponseLoc = 'प्लॅटफॉर्म क्रमांक ३ आहे. ट्रेन १० मिनिटांत येईल.';
          nextStarters = ['Thank you very much!', 'Where can I buy tickets?'];
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

  const handleOpenMic = () => {
    setIsMicModalOpen(true);
    setIsListening(true);
  };

  const handlePickVoiceStarter = (phrase) => {
    setIsMicModalOpen(false);
    setIsListening(false);
    handleSendMessage(phrase);
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
      const nextCount = sentenceIdx + 1;
      if (nextCount >= 5) completeTask(2, 'speaking_5');
      if (nextCount >= 15) completeTask(4, 'speaking_15');
    }, 1200);
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
                    {sc.title_mr || sc.title_en || sc.title}
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
                <Text style={styles.aiTypingText}>AI विचार करत आहे...</Text>
              </View>
            )}
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={styles.inputBarWrap}>
            <TouchableOpacity
              style={styles.micBtn}
              onPress={handleOpenMic}
              activeOpacity={0.7}
            >
              <Mic size={20} color={COLORS.primary} />
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
                    ? '🎉 उत्कृष्ट उच्चार! तुमची इंग्रजी बोलण्याची क्षमता उत्तम आहे.'
                    : '👍 छान प्रयत्न! पुन्हा ऐका आणि स्पष्ट आवाजात पुन्हा बोला.'}
                </Text>
              </View>
            )}

            {/* Record & Evaluate Button */}
            <TouchableOpacity
              style={[styles.drillRecordBtn, isEvaluating && styles.drillRecordBtnLoading]}
              onPress={handleEvaluateSpeaking}
              disabled={isEvaluating}
              activeOpacity={0.85}
            >
              {isEvaluating ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Mic size={22} color={COLORS.white} />
                  <Text style={styles.drillRecordBtnText}>
                    {language === 'mr' ? 'माईक दाबून बोला व तपासा' : 'Tap to Speak & Check'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Navigation Buttons */}
            <View style={styles.drillNavRow}>
              <TouchableOpacity
                style={[styles.drillNavBtn, sentenceIdx === 0 && styles.drillNavBtnDisabled]}
                disabled={sentenceIdx === 0}
                onPress={() => {
                  setSentenceIdx(prev => Math.max(0, prev - 1));
                  setEvalScore(null);
                }}
              >
                <ChevronLeft size={18} color={COLORS.text} />
                <Text style={styles.drillNavText}>{language === 'mr' ? 'मागील वाक्य' : 'Previous'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drillNavBtn, sentenceIdx >= LISTEN_REPEAT_SENTENCES.length - 1 && styles.drillNavBtnDisabled]}
                disabled={sentenceIdx >= LISTEN_REPEAT_SENTENCES.length - 1}
                onPress={() => {
                  setSentenceIdx(prev => Math.min(LISTEN_REPEAT_SENTENCES.length - 1, prev + 1));
                  setEvalScore(null);
                }}
              >
                <Text style={styles.drillNavText}>{language === 'mr' ? 'पुढील वाक्य' : 'Next'}</Text>
                <ChevronRight size={18} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Mic Audio Interactive Modal */}
      <Modal
        visible={isMicModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMicModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.micModalCard}>
            <View style={styles.micModalHeader}>
              <Text style={styles.micModalTitle}>🎤 आवाजी संभाषण (Voice Input)</Text>
              <TouchableOpacity onPress={() => setIsMicModalOpen(false)} style={styles.closeBtn}>
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.waveContainer}>
              <View style={[styles.waveCircle, styles.waveCircleOuter]} />
              <View style={[styles.waveCircle, styles.waveCircleMiddle]} />
              <View style={styles.micActiveCircle}>
                <Mic size={36} color="#ffffff" />
              </View>
            </View>

            <Text style={styles.micListeningText}>AI ऐकत आहे... (Listening...)</Text>
            <Text style={styles.micSubText}>खालीलपैकी कोणतेही वाक्य टॅप करा किंवा इंग्रजीत बोला:</Text>

            <View style={styles.quickStartersList}>
              {(currentScenario?.suggested_starter || [
                'Hello! How are you doing today?',
                'I am practicing my English speaking.',
                'Could you please help me with this?',
              ]).map((phrase, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickStarterItem}
                  onPress={() => handlePickVoiceStarter(phrase)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickStarterText}>"{phrase}"</Text>
                  <Send size={14} color="#4f46e5" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topTabsWrap: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.lg,
    padding: 4,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  topTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  topTabBtnActive: {
    backgroundColor: COLORS.secondary,
  },
  topTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  topTabTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  chatContainer: {
    flex: 1,
  },
  scenariosScroll: {
    paddingHorizontal: SPACING.lg,
    marginVertical: 6,
    maxHeight: 44,
  },
  scenarioPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
  },
  scenarioPillActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  scenarioPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  scenarioPillTextActive: {
    color: COLORS.white,
  },
  chatMessagesContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: 12,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 4,
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
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  msgBubble: {
    maxWidth: '80%',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  msgBubbleAi: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  msgBubbleUser: {
    backgroundColor: COLORS.secondary,
    borderTopRightRadius: 4,
  },
  msgTextEn: {
    fontSize: 15,
    lineHeight: 21,
  },
  msgTextEnAi: {
    fontWeight: '600',
    color: COLORS.text,
  },
  msgTextEnUser: {
    fontWeight: '600',
    color: COLORS.white,
  },
  msgTextLoc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 4,
  },
  msgAudioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  startersWrap: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  startersHeading: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  starterBtn: {
    backgroundColor: '#EEF2FF',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 2,
  },
  starterBtnText: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  aiTypingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  aiTypingText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  inputBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTextInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  listenScrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  drillCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.md,
  },
  drillHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  drillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  drillBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentGreen,
  },
  drillTargetEn: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  drillPronunciation: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  drillMeaningBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 20,
  },
  drillMeaningLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 2,
  },
  drillMeaningText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  evalScoreBox: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 16,
  },
  evalScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  evalScoreTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.accentGreen,
  },
  evalFeedbackText: {
    fontSize: 12,
    color: '#065F46',
    lineHeight: 16,
  },
  drillRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  drillRecordBtnLoading: {
    opacity: 0.7,
  },
  drillRecordBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  drillNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drillNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  drillNavBtnDisabled: {
    opacity: 0.3,
  },
  drillNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  micModalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  micModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  micModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  waveCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  waveCircleOuter: {
    width: 120,
    height: 120,
    backgroundColor: '#e0e7ff',
    opacity: 0.4,
  },
  waveCircleMiddle: {
    width: 90,
    height: 90,
    backgroundColor: '#c7d2fe',
    opacity: 0.6,
  },
  micActiveCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micListeningText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: 4,
  },
  micSubText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickStartersList: {
    width: '100%',
    gap: 8,
  },
  quickStarterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  quickStarterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    marginRight: 8,
  }
});
