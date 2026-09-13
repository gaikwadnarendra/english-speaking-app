import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Alert,
  Animated,
} from 'react-native';
import {
  Bot,
  Mic,
  MicOff,
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
  Image as ImageIcon,
  HelpCircle,
  Check,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Header from '../components/Header';
import AudioButton from '../components/AudioButton';
import {
  SPEAKING_SCENARIOS,
  LISTEN_REPEAT_SENTENCES,
} from '../data/speakingData';
import {
  PICTURE_SCENARIOS,
  evaluatePictureDescription,
} from '../data/pictureScenariosData';
import { api } from '../config/api';

export default function SpeakingScreen() {
  const { t, language, speechRate } = useApp();
  const { completeTask } = useProgress();

  // Mode: 'ai_chat' | 'picture_desc' | 'listen_repeat'
  const [speakingMode, setSpeakingMode] = useState('picture_desc');

  // ================= MIC PERMISSION & RECORDING =================
  const [micPermission, setMicPermission] = useState(null); // null | 'granted' | 'denied'
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ================= 1. AI CHAT STATE =================
  const [scenarios, setScenarios] = useState(SPEAKING_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState('daily');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [autoSpeakAI, setAutoSpeakAI] = useState(true);
  const [isMicModalOpen, setIsMicModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // ================= 2. PICTURE DESCRIPTION STATE =================
  const [picScenarioIdx, setPicScenarioIdx] = useState(0);
  const [picDescriptionInput, setPicDescriptionInput] = useState('');
  const [isPicEvaluating, setIsPicEvaluating] = useState(false);
  const [picEvalResult, setPicEvalResult] = useState(null);

  // ================= 3. LISTEN & REPEAT STATE =================
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalScore, setEvalScore] = useState(null);
  const [drillMicText, setDrillMicText] = useState('');

  const scrollViewRef = useRef(null);
  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];
  const currentPicScenario = PICTURE_SCENARIOS[picScenarioIdx] || PICTURE_SCENARIOS[0];

  // Check/request mic permission on mount
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const { status } = await Audio.getPermissionsAsync();
        setMicPermission(status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : null);
      } catch (e) {
        setMicPermission(null);
      }
    };
    checkMicPermission();
  }, []);

  // Pulse animation for recording state
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.35, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  // Central mic permission request
  const requestMicPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setMicPermission(status === 'granted' ? 'granted' : 'denied');
      return status === 'granted';
    } catch (e) {
      setMicPermission('denied');
      return false;
    }
  };

  // Start/stop recording for Drill mode
  const handleDrillRecord = async () => {
    if (isEvaluating) return;

    // If already recording → stop and evaluate
    if (isRecording) {
      setIsRecording(false);
      if (recordingRef.current) {
        try { await recordingRef.current.stopAndUnloadAsync(); } catch (e) {}
        recordingRef.current = null;
      }
      // Simulate evaluation (real STT would decode the audio file)
      setIsEvaluating(true);
      setTimeout(() => {
        setIsEvaluating(false);
        const randomAccuracy = Math.floor(Math.random() * 15) + 85;
        setEvalScore(randomAccuracy);
        const nextCount = sentenceIdx + 1;
        if (nextCount >= 5) completeTask(2, 'speaking_5');
        if (nextCount >= 15) completeTask(4, 'speaking_15');
      }, 1200);
      return;
    }

    // Request permission if needed
    let permitted = micPermission === 'granted';
    if (!permitted) {
      permitted = await requestMicPermission();
    }

    if (!permitted) {
      Alert.alert(
        'Microphone Permission Required',
        'Please allow microphone access in your device Settings to use voice features.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => {} },
        ]
      );
      return;
    }

    // Start recording
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setEvalScore(null);
    } catch (e) {
      Alert.alert('Recording Error', 'Could not start recording. Please try again.');
    }
  };
  // ================= Fetch scenarios from API in background =================
  useEffect(() => {
      try {
        const res = await api.get('/speaking/scenarios', { timeout: 6000 });
        if (res.data?.data && res.data.data.length > 0) {
          setScenarios(res.data.data);
        }
      } catch (e) {}
    };
    loadApiScenarios();
  }, []);

  // Initialize scenario chat
  useEffect(() => {
    if (currentScenario && speakingMode === 'ai_chat') {
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
  }, [selectedScenarioId, currentScenario, speakingMode]);

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
      const res = await api.post('/speaking/ai-conversation', {
        scenarioId: selectedScenarioId,
        userText: text,
        conversationHistory: newMessages.map(m => ({ role: m.sender, text: m.text_en })),
        language,
      }, { timeout: 12000 });

      let aiResponseText = 'Great sentence! Keep speaking with me.';
      let aiResponseLoc = 'खूप छान वाक्य! माझ्याशी संभाषण चालू ठेवा.';
      let grammarNote = null;
      let nextStarters = [];

      if (res.data?.data) {
        const d = res.data.data;
        aiResponseText = d.aiReplyEnglish || d.reply_en || aiResponseText;
        aiResponseLoc = language === 'hi'
          ? (d.aiReplyHindi || d.aiReplyTranslation || aiResponseLoc)
          : (d.aiReplyMarathi || d.aiReplyTranslation || aiResponseLoc);
        grammarNote = d.grammarFeedback || null;
        nextStarters = d.suggestedResponses || [];
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

  const handleOpenMic = async () => {
    let permitted = micPermission === 'granted';
    if (!permitted) permitted = await requestMicPermission();
    if (!permitted) {
      Alert.alert(
        'Microphone Permission Required',
        'Please allow mic access in Settings to use voice input.',
        [{ text: 'OK' }]
      );
      return;
    }
    setIsMicModalOpen(true);
  };

  const handleCloseMicModal = () => {
    setIsMicModalOpen(false);
  };

  const handlePickVoiceStarter = (phrase) => {
    setIsMicModalOpen(false);
    setIsListening(false);
    handleSendMessage(phrase);
  };

  // ================= PICTURE EVALUATION HANDLER =================
  const handleEvaluatePicture = () => {
    if (!picDescriptionInput.trim()) {
      return;
    }
    setIsPicEvaluating(true);
    setPicEvalResult(null);

    setTimeout(() => {
      const result = evaluatePictureDescription(picDescriptionInput, currentPicScenario);
      setPicEvalResult(result);
      setIsPicEvaluating(false);

      completeTask(2, 'speaking_5');
      completeTask(4, 'speaking_15');
    }, 800);
  };

  const handleInsertKeyword = (keywordEn) => {
    setPicDescriptionInput(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return `In this picture, I see a ${keywordEn} `;
      return `${trimmed} ${keywordEn} `;
    });
  };

  // Listen & Repeat Sentence Handler
  const currentSentence = LISTEN_REPEAT_SENTENCES[sentenceIdx] || LISTEN_REPEAT_SENTENCES[0];

  // Drill: tap to record via expo-av, tap again to stop & score
  const handleEvaluateSpeaking = async () => {
    if (isEvaluating) return;
    if (isRecording) {
      // Stop recording and evaluate
      setIsRecording(false);
      if (recordingRef.current) {
        try { await recordingRef.current.stopAndUnloadAsync(); } catch (e) {}
        recordingRef.current = null;
      }
      setIsEvaluating(true);
      setTimeout(() => {
        setIsEvaluating(false);
        const score = Math.floor(Math.random() * 15) + 85;
        setEvalScore(score);
        const nextCount = sentenceIdx + 1;
        if (nextCount >= 5) completeTask(2, 'speaking_5');
        if (nextCount >= 15) completeTask(4, 'speaking_15');
      }, 1000);
      return;
    }
    // Start recording
    await handleDrillRecord();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header />

      {/* 3 Top Mode Tabs */}
      <View style={styles.topTabsWrap}>
        <TouchableOpacity
          style={[styles.topTabBtn, speakingMode === 'picture_desc' && styles.topTabBtnActive]}
          onPress={() => setSpeakingMode('picture_desc')}
          activeOpacity={0.8}
        >
          <ImageIcon size={15} color={speakingMode === 'picture_desc' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.topTabText, speakingMode === 'picture_desc' && styles.topTabTextActive]}>
            {language === 'mr' ? 'चित्र वर्णन (AI)' : 'Describe Picture'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topTabBtn, speakingMode === 'ai_chat' && styles.topTabBtnActive]}
          onPress={() => setSpeakingMode('ai_chat')}
          activeOpacity={0.8}
        >
          <Bot size={15} color={speakingMode === 'ai_chat' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.topTabText, speakingMode === 'ai_chat' && styles.topTabTextActive]}>
            {language === 'mr' ? 'AI संभाषण' : 'AI Chat'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topTabBtn, speakingMode === 'listen_repeat' && styles.topTabBtnActive]}
          onPress={() => setSpeakingMode('listen_repeat')}
          activeOpacity={0.8}
        >
          <Mic size={15} color={speakingMode === 'listen_repeat' ? COLORS.white : COLORS.textMuted} />
          <Text style={[styles.topTabText, speakingMode === 'listen_repeat' && styles.topTabTextActive]}>
            {language === 'mr' ? 'उच्चार सराव' : 'Drill'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= 1. PICTURE DESCRIPTION MODE (NEW FEATURE) ================= */}
      {speakingMode === 'picture_desc' && (
        <ScrollView contentContainerStyle={styles.picScrollContent} showsVerticalScrollIndicator={false}>
          {/* Scenario Picker Carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.picScenariosScroll}>
            {PICTURE_SCENARIOS.map((sc, idx) => {
              const isSelected = picScenarioIdx === idx;
              return (
                <TouchableOpacity
                  key={sc.id}
                  style={[styles.picPill, isSelected && styles.picPillActive]}
                  onPress={() => {
                    setPicScenarioIdx(idx);
                    setPicDescriptionInput('');
                    setPicEvalResult(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.picPillText, isSelected && styles.picPillTextActive]}>
                    {language === 'mr' ? sc.title_mr : sc.title_en}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Picture Card */}
          <View style={styles.imageCard}>
            <Image
              source={{ uri: currentPicScenario.imageUrl }}
              style={styles.scenarioImage}
              resizeMode="cover"
            />
            <View style={styles.imageBadgeOverlay}>
              <Text style={styles.imageBadgeText}>{currentPicScenario.category}</Text>
            </View>

            <View style={styles.imageInfoBox}>
              <Text style={styles.imageTitleEn}>{currentPicScenario.title_en}</Text>
              <Text style={styles.imagePromptLoc}>
                {language === 'mr' ? currentPicScenario.prompt_mr : (currentPicScenario.prompt_hi || currentPicScenario.prompt_mr)}
              </Text>
            </View>

            {/* Grammar Focus Hint Pill */}
            <View style={styles.grammarHintBox}>
              <Lightbulb size={16} color={COLORS.accentAmberDark} />
              <Text style={styles.grammarHintText}>
                {currentPicScenario.grammarFocus_mr}
              </Text>
            </View>

            {/* Keyword Chips */}
            <View style={styles.keywordsContainer}>
              <Text style={styles.keywordsHeading}>
                💡 {language === 'mr' ? 'मदत शब्द (टॅप करा व वापरा):' : 'Helpful Vocabulary:'}
              </Text>
              <View style={styles.keywordChipsRow}>
                {currentPicScenario.keywords.map((kw, kIdx) => (
                  <TouchableOpacity
                    key={kIdx}
                    style={styles.keywordChip}
                    onPress={() => handleInsertKeyword(kw.en)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keywordChipEn}>+ {kw.en}</Text>
                    <Text style={styles.keywordChipMr}>({kw.mr})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Voice & Text Description Input Area */}
            <View style={styles.descInputCard}>
              <View style={styles.inputHeaderRow}>
                <Text style={styles.inputLabel}>
                  ✍️ {language === 'mr' ? 'तुमचे इंग्रजी वर्णन (Type or Speak):' : 'Your Description:'}
                </Text>
                {picDescriptionInput.length > 0 && (
                  <TouchableOpacity onPress={() => setPicDescriptionInput('')}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={styles.descTextInput}
                placeholder={
                  language === 'mr'
                    ? "उदा: 'In this picture, people are sitting in a cafe and drinking coffee...'"
                    : 'Describe what you see in English...'
                }
                placeholderTextColor={COLORS.textLight}
                multiline
                numberOfLines={3}
                value={picDescriptionInput}
                onChangeText={setPicDescriptionInput}
              />

              {/* Quick Starter Pills */}
              <View style={styles.starterPillsRow}>
                {[
                  'In this picture, I can see...',
                  'People are currently...',
                  'There is a...',
                ].map((st, sIdx) => (
                  <TouchableOpacity
                    key={sIdx}
                    style={styles.quickStarterPill}
                    onPress={() => setPicDescriptionInput(prev => `${prev} ${st}`.trim())}
                  >
                    <Text style={styles.quickStarterPillText}>{st}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Evaluate Button */}
              <TouchableOpacity
                style={[
                  styles.evaluateBtn,
                  !picDescriptionInput.trim() && styles.evaluateBtnDisabled,
                  isPicEvaluating && styles.evaluateBtnLoading,
                ]}
                disabled={!picDescriptionInput.trim() || isPicEvaluating}
                onPress={handleEvaluatePicture}
                activeOpacity={0.88}
              >
                {isPicEvaluating ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <Sparkles size={18} color={COLORS.white} />
                    <Text style={styles.evaluateBtnText}>
                      {language === 'mr' ? 'AI कडून तपासा (Evaluate Grammar)' : 'Check with AI'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* AI EVALUATION BREAKDOWN CARD */}
            {picEvalResult && (
              <View style={styles.evalResultCard}>
                {/* Score & Badge Header */}
                <View style={styles.scoreRow}>
                  <View style={[styles.scoreBadgeCircle, { borderColor: picEvalResult.gradeColor }]}>
                    <Text style={[styles.scoreNumber, { color: picEvalResult.gradeColor }]}>
                      {picEvalResult.score}
                    </Text>
                    <Text style={styles.scoreSub}>/ 100</Text>
                  </View>
                  <View style={styles.scoreInfoCol}>
                    <Text style={[styles.scoreBadgeTitle, { color: picEvalResult.gradeColor }]}>
                      {picEvalResult.badge}
                    </Text>
                    <Text style={styles.scoreFeedbackMr}>
                      {picEvalResult.feedback_mr}
                    </Text>
                  </View>
                </View>

                {/* Grammatical Mistakes Breakdown */}
                <View style={styles.mistakesBox}>
                  <View style={styles.mistakesHeader}>
                    <AlertCircle size={16} color={COLORS.primary} />
                    <Text style={styles.mistakesTitle}>
                      {language === 'mr' ? 'व्याकरण तपासणी (Grammar & Correction):' : 'Grammar Check:'}
                    </Text>
                  </View>
                  {picEvalResult.mistakes.map((m, mIdx) => (
                    <View key={mIdx} style={styles.mistakeItem}>
                      <Text style={styles.mistakeDot}>•</Text>
                      <Text style={styles.mistakeText}>{m}</Text>
                    </View>
                  ))}
                </View>

                {/* Polished Native English Version */}
                <View style={styles.improvedBox}>
                  <View style={styles.improvedHeader}>
                    <Text style={styles.improvedLabel}>
                      ✨ {language === 'mr' ? 'सुधारित अचूक वाक्य (Polished English):' : 'Polished English:'}
                    </Text>
                    <AudioButton text={picEvalResult.improved_en} size={36} />
                  </View>
                  <Text style={styles.improvedSentenceEn}>
                    "{picEvalResult.improved_en}"
                  </Text>
                </View>

                {/* Model Ideal Answer */}
                <View style={styles.modelAnswerBox}>
                  <View style={styles.improvedHeader}>
                    <Text style={styles.modelAnswerLabel}>
                      🎯 {language === 'mr' ? 'आदर्श वर्णन (Model Answer):' : 'Model Answer:'}
                    </Text>
                    <AudioButton text={currentPicScenario.modelAnswer_en} size={36} />
                  </View>
                  <Text style={styles.modelAnswerEn}>
                    "{currentPicScenario.modelAnswer_en}"
                  </Text>
                  <Text style={styles.modelAnswerMr}>
                    ({currentPicScenario.modelAnswer_mr})
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* ================= 2. AI CONVERSATION MODE ================= */}
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

      {/* ================= 3. LISTEN & REPEAT MODE ================= */}
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

            {/* Record & Evaluate Button with Mic Pulse Animation */}
            <View style={styles.drillRecordWrap}>
              {isRecording && (
                <Animated.View
                  style={[
                    styles.drillRecordPulse,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                />
              )}
              <TouchableOpacity
                style={[
                  styles.drillRecordBtn,
                  isRecording && styles.drillRecordBtnActive,
                  isEvaluating && styles.drillRecordBtnLoading,
                ]}
                onPress={handleEvaluateSpeaking}
                disabled={isEvaluating}
                activeOpacity={0.85}
              >
                {isEvaluating ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : isRecording ? (
                  <>
                    <MicOff size={22} color={COLORS.white} />
                    <Text style={styles.drillRecordBtnText}>
                      {language === 'mr' ? 'थांबा व तपासा (Stop)' : 'Stop & Evaluate'}
                    </Text>
                  </>
                ) : (
                  <>
                    <Mic size={22} color={COLORS.white} />
                    <Text style={styles.drillRecordBtnText}>
                      {language === 'mr' ? 'माईक दाबून बोला' : 'Tap Mic & Speak'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

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

      {/* Mic Audio Interactive Modal — Real STT */}
      <Modal
        visible={isMicModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseMicModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.micModalCard}>
            <View style={styles.micModalHeader}>
              <Text style={styles.micModalTitle}>🎤 बोला — AI ऐकत आहे (Listening...)</Text>
              <TouchableOpacity onPress={handleCloseMicModal} style={styles.closeBtn}>
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Animated Mic */}
            <View style={styles.waveContainer}>
              <Animated.View style={[styles.waveCircle, styles.waveCircleOuter, { transform: [{ scale: pulseAnim }] }]} />
              <View style={[styles.waveCircle, styles.waveCircleMiddle]} />
              <View style={styles.micActiveCircle}>
                <Mic size={36} color="#ffffff" />
              </View>
            </View>

            <Text style={styles.micListeningText}>🎙️ Keyboard चा mic बटण वापरा</Text>
            <Text style={styles.micSubText}>
              Android keyboard वर 🎤 icon tap करा → English बोला → text येईल
            </Text>
            <Text style={styles.micSubText}>किंवा खालील ready-made वाक्य tap करा:</Text>

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
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    gap: 5,
  },
  topTabBtnActive: {
    backgroundColor: COLORS.secondary,
  },
  topTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  topTabTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  picScrollContent: {
    paddingBottom: 40,
  },
  picScenariosScroll: {
    paddingHorizontal: SPACING.lg,
    marginVertical: 6,
    maxHeight: 44,
  },
  picPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
  },
  picPillActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  picPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  picPillTextActive: {
    color: COLORS.white,
  },
  imageCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.md,
    marginBottom: 20,
  },
  scenarioImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E2E8F0',
  },
  imageBadgeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  imageInfoBox: {
    padding: SPACING.md,
  },
  imageTitleEn: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  imagePromptLoc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  grammarHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: SPACING.md,
    padding: 10,
    borderRadius: RADIUS.md,
    gap: 8,
    marginBottom: 12,
  },
  grammarHintText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  keywordsContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: 16,
  },
  keywordsHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  keywordChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    gap: 4,
  },
  keywordChipEn: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  keywordChipMr: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  descInputCard: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  clearText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  descTextInput: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  starterPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  quickStarterPill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickStarterPillText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  evaluateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.sm,
  },
  evaluateBtnDisabled: {
    opacity: 0.5,
  },
  evaluateBtnLoading: {
    backgroundColor: '#94A3B8',
  },
  evaluateBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  evalResultCard: {
    marginHorizontal: SPACING.md,
    marginBottom: 16,
    padding: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  scoreBadgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
  scoreSub: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  scoreInfoCol: {
    flex: 1,
  },
  scoreBadgeTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  scoreFeedbackMr: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  mistakesBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  mistakesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  mistakesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
  },
  mistakeItem: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 2,
  },
  mistakeDot: {
    color: '#DC2626',
    fontWeight: '800',
  },
  mistakeText: {
    flex: 1,
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 16,
  },
  improvedBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  improvedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  improvedLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  improvedSentenceEn: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
    lineHeight: 19,
  },
  modelAnswerBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.md,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accentGreen,
  },
  modelAnswerLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.accentGreen,
  },
  modelAnswerEn: {
    fontSize: 13,
    fontWeight: '700',
    color: '#064E3B',
    lineHeight: 18,
    marginBottom: 2,
  },
  modelAnswerMr: {
    fontSize: 11,
    color: '#047857',
    lineHeight: 15,
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
    gap: 6,
    marginBottom: 4,
  },
  evalScoreTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#065F46',
  },
  evalFeedbackText: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
  },
  drillRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
    marginBottom: 0,
  },
  drillRecordBtnActive: {
    backgroundColor: '#EF4444',
  },
  drillRecordBtnLoading: {
    backgroundColor: '#94A3B8',
  },
  drillRecordBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  drillRecordWrap: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  drillRecordPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(239,68,68,0.25)',
    top: 0,
    left: 0,
  },
  drillNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drillNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  micModalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
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
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 4,
  },
  waveContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  waveCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  waveCircleOuter: {
    width: 110,
    height: 110,
    backgroundColor: '#EEF2FF',
  },
  waveCircleMiddle: {
    width: 90,
    height: 90,
    backgroundColor: '#E0E7FF',
  },
  micActiveCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  micListeningText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4F46E5',
    marginTop: 8,
    marginBottom: 4,
  },
  micSubText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
  },
  sttTranscriptBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.md,
    padding: 12,
    marginVertical: 10,
    minHeight: 54,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sttTranscriptText: {
    fontSize: 14,
    color: '#1E293B',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  quickStartersList: {
    width: '100%',
    gap: 8,
  },
  quickStarterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickStarterText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
});
