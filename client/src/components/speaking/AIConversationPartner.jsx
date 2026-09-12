import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Send,
  Volume2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Bot,
  User,
  Coffee,
  Briefcase,
  ShoppingBag,
  Utensils,
  Plane,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { fetchScenarios, sendAIConversationMessage } from '../../services/api';
import { speakText } from '../../utils/ttsHelper';
import { useApp } from '../../context/AppContext';

const scenarioIcons = {
  daily: Coffee,
  interview: Briefcase,
  shopping: ShoppingBag,
  restaurant: Utensils,
  travel: Plane,
  doctor: Stethoscope
};

const AIConversationPartner = () => {
  const { soundSpeed, triggerStreakReward, language, t } = useApp();
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('daily');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [autoSpeakAI, setAutoSpeakAI] = useState(true);

  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Load scenarios on mount
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const res = await fetchScenarios();
        if (res.data?.data) {
          setScenarios(res.data.data);
          const initialScenario = res.data.data[0];
          if (initialScenario) {
            initScenarioChat(initialScenario);
          }
        }
      } catch (err) {
        console.warn(err);
      }
    };
    loadScenarios();
  }, []);

  const getScenarioTitle = (sc) => {
    if (!sc) return '';
    if (language === 'hi') return sc.title_hi || sc.title_mr;
    if (language === 'en') return sc.title_en || sc.title_mr;
    return sc.title_mr;
  };

  const getScenarioDesc = (sc) => {
    if (!sc) return '';
    if (language === 'hi') return sc.description_hi || sc.description_mr;
    if (language === 'en') return sc.description_en || sc.description_mr;
    return sc.description_mr;
  };

  const initScenarioChat = (scenario) => {
    const initialTranslation = language === 'hi' 
      ? (scenario.initial_ai_hi || scenario.initial_ai_mr)
      : scenario.initial_ai_mr;

    const initialMsg = {
      id: Date.now(),
      sender: 'ai',
      text_en: scenario.initial_ai_en,
      text_mr: initialTranslation,
      grammarFeedback: null,
      suggestedResponses: scenario.suggested_starter || []
    };
    setMessages([initialMsg]);

    if (autoSpeakAI) {
      speakText(scenario.initial_ai_en, 'en-US', soundSpeed);
    }
  };

  const handleScenarioChange = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      initScenarioChat(scenario);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingAI]);

  // Web Speech Recognition for live microphone speech-to-text
  const toggleListening = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.micPermissionAlert);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        if (transcript.trim()) {
          sendMessage(transcript.trim());
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const sendMessage = async (textToSend) => {
    const cleanText = (textToSend || inputText).trim();
    if (!cleanText || isLoadingAI) return;

    // Append user message to UI
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text_en: cleanText
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoadingAI(true);

    try {
      // Prepare history formatted for API
      const conversationHistory = newHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text_en
      }));

      const res = await sendAIConversationMessage({
        userText: cleanText,
        conversationHistory,
        scenarioId: selectedScenarioId,
        language
      });

      if (res.data?.data) {
        const aiData = res.data.data;
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text_en: aiData.aiReplyEnglish,
          text_mr: language === 'hi' ? (aiData.aiReplyHindi || aiData.aiReplyMarathi) : aiData.aiReplyMarathi,
          grammarFeedback: aiData.grammarFeedback,
          suggestedResponses: aiData.suggestedResponses || []
        };

        setMessages(prev => [...prev, aiMsg]);

        if (autoSpeakAI && aiData.aiReplyEnglish) {
          speakText(aiData.aiReplyEnglish, 'en-US', soundSpeed);
        }

        // Reward daily streak if conversation is ongoing
        if (messages.length >= 4) {
          triggerStreakReward();
        }
      }
    } catch (err) {
      console.warn('AI conversation error:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSuggestedClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  return (
    <div className="ai-partner-container">
      {/* Scenario Picker Carousel */}
      <div className="scenario-chips-row">
        {scenarios.map((sc) => {
          const Icon = scenarioIcons[sc.id] || MessageSquare;
          return (
            <button
              key={sc.id}
              className={`scenario-chip ${selectedScenarioId === sc.id ? 'active' : ''}`}
              onClick={() => handleScenarioChange(sc.id)}
            >
              <Icon size={16} />
              <span>{getScenarioTitle(sc).split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Title Bar */}
      {currentScenario && (
        <div className="active-scenario-banner glass-card">
          <div className="scenario-info-col">
            <h4 className="scenario-title-mr">{getScenarioTitle(currentScenario)}</h4>
            <p className="scenario-desc-mr">{getScenarioDesc(currentScenario)}</p>
          </div>

          <div className="scenario-actions-col">
            <button
              className="btn-outline reset-chat-btn"
              onClick={() => initScenarioChat(currentScenario)}
              title={t.restartChatBtn}
            >
              <RotateCcw size={15} />
              <span>{t.restartChatBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="chat-messages-scroll-area glass-card">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
            <div className="bubble-avatar">
              {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
            </div>

            <div className="bubble-content-col">
              <div className="bubble-main-box">
                <div className="bubble-text-row">
                  <p className="bubble-en-text">{msg.text_en}</p>
                  {msg.sender === 'ai' && (
                    <button
                      className="replay-audio-btn"
                      onClick={() => speakText(msg.text_en, 'en-US', soundSpeed)}
                      title={t.audioTest}
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>

                {msg.text_mr && (
                  <p className="bubble-mr-translation">
                    {language === 'hi' ? 'हिंदी' : language === 'en' ? 'Meaning' : 'मराठी'}: {msg.text_mr}
                  </p>
                )}
              </div>

              {/* Real-time Grammar Feedback Mentoring Pill */}
              {msg.grammarFeedback && (
                <div className="grammar-mentor-pill">
                  <AlertCircle size={16} className="mentor-alert-icon" />
                  <div className="mentor-text-block">
                    <span className="mentor-label">{t.grammarMentorLabel}</span>
                    <span className="mentor-msg">{msg.grammarFeedback}</span>
                  </div>
                </div>
              )}

              {/* Clickable Suggested Response Chips */}
              {msg.suggestedResponses && msg.suggestedResponses.length > 0 && (
                <div className="suggested-replies-wrap">
                  <span className="suggested-header">{t.suggestedRepliesLabel}</span>
                  <div className="suggested-chips-list">
                    {msg.suggestedResponses.map((sug, idx) => (
                      <button
                        key={idx}
                        className="suggested-reply-chip"
                        onClick={() => handleSuggestedClick(sug)}
                      >
                        <span>"{sug}"</span>
                        <ChevronRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoadingAI && (
          <div className="chat-bubble-row ai loading">
            <div className="bubble-avatar"><Bot size={20} /></div>
            <div className="ai-typing-indicator">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="typing-text">{t.aiThinkingText}</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Voice & Input Controls Footer */}
      <div className="chat-input-controls-bar glass-card">
        {/* Big Mic Speaking Button */}
        <button
          className={`mic-speak-btn ${isRecording ? 'listening' : ''}`}
          onClick={toggleListening}
          title={isRecording ? t.stopRecordingBtn : t.tapToSpeak}
        >
          {isRecording ? <Square size={20} /> : <Mic size={22} />}
          <span>{isRecording ? t.listeningState : t.tapToSpeak}</span>
        </button>

        {/* Text Input for quiet typing */}
        <div className="chat-text-input-wrap">
          <input
            type="text"
            className="chat-text-field"
            placeholder={t.typeEnglishPlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!inputText.trim() || isLoadingAI}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .ai-partner-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .scenario-chips-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 4px;
          width: 100%;
        }
        .scenario-chips-row::-webkit-scrollbar {
          display: none;
        }
        .scenario-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          background: #ffffff;
          border: 1.5px solid var(--border-color);
          font-weight: 700;
          font-size: 0.85rem;
          color: #475569;
          white-space: nowrap;
          transition: all 0.2s ease;
          cursor: pointer;
          flex-shrink: 0;
        }
        .scenario-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .scenario-chip.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
        }
        .active-scenario-banner {
          padding: 14px 18px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
          border: 1.5px solid #fed7aa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .scenario-title-mr {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }
        .scenario-desc-mr {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .reset-chat-btn {
          padding: 6px 12px;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .chat-messages-scroll-area {
          height: clamp(340px, 50vh, 480px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: clamp(12px, 3vw, 20px);
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .chat-bubble-row {
          display: flex;
          gap: 10px;
          max-width: 88%;
        }
        @media (max-width: 600px) {
          .chat-bubble-row {
            max-width: 96%;
          }
        }
        .chat-bubble-row.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .chat-bubble-row.ai {
          align-self: flex-start;
        }
        .bubble-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .chat-bubble-row.ai .bubble-avatar {
          background: #e0e7ff;
          color: #4f46e5;
        }
        .chat-bubble-row.user .bubble-avatar {
          background: #ffedd5;
          color: #f97316;
        }
        .bubble-content-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }
        .bubble-main-box {
          padding: 12px 16px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          word-break: break-word;
        }
        .chat-bubble-row.ai .bubble-main-box {
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-top-left-radius: 4px;
        }
        .chat-bubble-row.user .bubble-main-box {
          background: linear-gradient(135deg, var(--primary) 0%, #ea580c 100%);
          color: #ffffff;
          border-top-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
        }
        .bubble-text-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .bubble-en-text {
          font-size: 0.98rem;
          font-weight: 700;
          line-height: 1.4;
        }
        .replay-audio-btn {
          color: var(--secondary);
          padding: 4px;
          border-radius: 50%;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
        }
        .replay-audio-btn:hover {
          background: #e0e7ff;
        }
        .bubble-mr-translation {
          font-size: 0.85rem;
          color: #475569;
          font-weight: 500;
          margin-top: 2px;
          border-top: 1px dashed #e2e8f0;
          padding-top: 4px;
        }
        .grammar-mentor-pill {
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.85rem;
          color: #92400e;
        }
        .mentor-alert-icon {
          color: #d97706;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .mentor-text-block {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .mentor-label {
          font-weight: 800;
        }
        .mentor-msg {
          font-weight: 600;
        }
        .suggested-replies-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 4px;
        }
        .suggested-header {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .suggested-chips-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .suggested-reply-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          background: #ffffff;
          border: 1px solid #c7d2fe;
          color: var(--secondary);
          font-size: 0.82rem;
          font-weight: 700;
          text-align: left;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .suggested-reply-chip:hover {
          background: var(--secondary-light);
          transform: translateX(3px);
        }
        .ai-typing-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: #f1f5f9;
          border-radius: 16px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .dot {
          width: 6px;
          height: 6px;
          background: var(--primary);
          border-radius: 50%;
          animation: blink 1.2s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .chat-input-controls-bar {
          padding: 10px 14px;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .mic-speak-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--primary) 0%, #ea580c 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.88rem;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);
          border: none;
          cursor: pointer;
        }
        .mic-speak-btn.listening {
          background: #ef4444;
          box-shadow: 0 0 18px rgba(239, 68, 68, 0.6);
          animation: pulseRed 1.2s infinite;
        }
        .chat-text-input-wrap {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 180px;
          background: #f8fafc;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 4px 6px 4px 14px;
        }
        .chat-text-field {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.92rem;
          min-width: 0;
        }
        .chat-send-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--secondary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
        }
        .chat-send-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }
        @media (max-width: 480px) {
          .chat-input-controls-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .mic-speak-btn {
            width: 100%;
            justify-content: center;
          }
          .chat-text-input-wrap {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AIConversationPartner;
