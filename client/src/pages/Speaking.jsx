import React, { useState } from 'react';
import { Mic, MessageSquare, Volume2, ChevronLeft, ChevronRight, CheckCircle2, Bot, Trophy } from 'lucide-react';
import VoiceRecorder from '../components/speaking/VoiceRecorder';
import AIConversationPartner from '../components/speaking/AIConversationPartner';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';

const Speaking = () => {
  const { t, language, triggerStreakReward } = useApp();
  const { completeTask, isTaskCompleted } = useProgress();
  const [speakingMode, setSpeakingMode] = useState('ai_chat'); // 'ai_chat' or 'listen_repeat'
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const sentences = [
    {
      sentence: "I want water.",
      marathi: "मला पाणी पाहिजे.",
      hindi: "मुझे पानी चाहिए।",
      pronunciation: "आय वॉन्ट वॉटर."
    },
    {
      sentence: "Can you help me?",
      marathi: "तुम्ही मला मदत करू शकता का?",
      hindi: "क्या आप मेरी मदद कर सकते हैं?",
      pronunciation: "कॅन यू हेल्प मी?"
    },
    {
      sentence: "I didn't understand.",
      marathi: "मला समजले नाही.",
      hindi: "मुझे समझ नहीं आया।",
      pronunciation: "आय डिडंट अंडरस्टँड."
    },
    {
      sentence: "Where are you going?",
      marathi: "तुम्ही कुठे जात आहात?",
      hindi: "आप कहाँ जा रहे हैं?",
      pronunciation: "व्हेअर आर यू गोइंग?"
    },
    {
      sentence: "I am very happy today.",
      marathi: "मी आज खूप आनंदी आहे.",
      hindi: "मैं आज बहुत खुश हूँ।",
      pronunciation: "आय एम व्हेरी हॅपी टुडे."
    }
  ];

  const current = sentences[currentSentenceIndex];

  const handleNext = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    } else {
      setCurrentSentenceIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1);
    }
  };

  const handleSpeechComplete = (rating) => {
    if (rating >= 4) {
      triggerStreakReward();
    }
  };

  return (
    <div className="speaking-page-container">
      {/* Header Block */}
      <div className="speaking-header-block">
        <div>
          <h2 className="page-main-title">{t.speakingPageTitle}</h2>
          <p className="page-main-subtitle">
            {t.speakingPageSub}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="speaking-mode-tabs">
          <button
            className={`mode-tab-btn ${speakingMode === 'ai_chat' ? 'active' : ''}`}
            onClick={() => setSpeakingMode('ai_chat')}
          >
            <Bot size={18} />
            <span>{t.aiChatTab}</span>
          </button>
          <button
            className={`mode-tab-btn ${speakingMode === 'listen_repeat' ? 'active' : ''}`}
            onClick={() => setSpeakingMode('listen_repeat')}
          >
            <Mic size={18} />
            <span>{t.listenRepeatTab}</span>
          </button>
        </div>
      </div>

      {/* Main Mode View */}
      {speakingMode === 'ai_chat' ? (
        <AIConversationPartner />
      ) : (
        <div className="listen-repeat-wrapper">
          <div className="drill-nav-bar">
            <button
              className="btn-outline nav-arrow-btn"
              onClick={handlePrev}
              disabled={currentSentenceIndex === 0}
            >
              <ChevronLeft size={20} />
              <span>{t.prevBtn}</span>
            </button>
            <span className="sentence-counter-tag">
              {currentSentenceIndex + 1} / {sentences.length}
            </span>
            <button className="btn-outline nav-arrow-btn" onClick={handleNext}>
              <span>{t.nextBtn}</span>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="speaking-workspace-area">
            <VoiceRecorder
              key={current.sentence}
              targetSentence={current.sentence}
              targetPronunciation={current.pronunciation}
              targetMarathi={current.marathi}
              targetHindi={current.hindi}
              onComplete={handleSpeechComplete}
            />
          </div>
        </div>
      )}

      <style>{`
        .speaking-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .speaking-header-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .speaking-mode-tabs {
          display: flex;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-md);
        }
        .mode-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.9rem;
          color: #64748b;
        }
        .mode-tab-btn:hover {
          color: var(--primary);
        }
        .mode-tab-btn.active {
          background: #ffffff;
          color: var(--primary-dark);
          box-shadow: var(--shadow-sm);
        }
        .listen-repeat-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .drill-nav-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .sentence-counter-tag {
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-main);
        }
        .speaking-workspace-area {
          max-width: 780px;
          margin: 0 auto;
          width: 100%;
        }
      `}</style>

      {/* ===== Level Progression Banner ===== */}
      <div style={{
        marginTop: '12px', padding: '18px 22px',
        background: 'linear-gradient(135deg, #fdf4ff, #fae8ff)',
        borderRadius: '14px', border: '1.5px solid #e9d5ff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>🎤</span>
          <div>
            <p style={{ fontWeight: 800, color: '#581c87', fontSize: '0.95rem', marginBottom: '2px' }}>
              Speaking Progress Tasks
            </p>
            <p style={{ fontSize: '0.82rem', color: '#7c3aed' }}>
              Practice speaking to unlock higher levels
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!isTaskCompleted(2, 'speaking_5') && (
            <button
              onClick={() => completeTask(2, 'speaking_5')}
              style={{
                padding: '10px 20px', background: '#8b5cf6', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark Speaking L2 Done
            </button>
          )}
          {!isTaskCompleted(4, 'speaking_15') && (
            <button
              onClick={() => completeTask(4, 'speaking_15')}
              style={{
                padding: '10px 20px', background: '#7c3aed', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark Speaking L4 Done
            </button>
          )}
          {!isTaskCompleted(5, 'speaking_ai') && (
            <button
              onClick={() => completeTask(5, 'speaking_ai')}
              style={{
                padding: '10px 20px', background: '#4c1d95', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark AI Conversation Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Speaking;
