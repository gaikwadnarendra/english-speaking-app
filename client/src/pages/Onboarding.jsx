import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BookOpen, Mic, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding, language, t } = useApp();
  const [selectedLevel, setSelectedLevel] = useState(1);

  const levelOptions = [
    {
      id: 1,
      title: t.levelOption1Title,
      desc: t.levelOption1Desc,
      badge: t.levelOption1Badge,
      recommendedLevel: 1
    },
    {
      id: 2,
      title: t.levelOption2Title,
      desc: t.levelOption2Desc,
      badge: t.levelOption2Badge,
      recommendedLevel: 1
    },
    {
      id: 3,
      title: t.levelOption3Title,
      desc: t.levelOption3Desc,
      badge: t.levelOption3Badge,
      recommendedLevel: 2
    },
    {
      id: 4,
      title: t.levelOption4Title,
      desc: t.levelOption4Desc,
      badge: t.levelOption4Badge,
      recommendedLevel: 3
    }
  ];

  const handleFinish = () => {
    completeOnboarding(selectedLevel);
    navigate('/');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card glass-card">
        <div className="onboarding-header">
          <img src="/logo.png" alt={t.appName} className="onboarding-logo-img" />
          <h1 className="onboarding-title">{t.onboardingTitle}</h1>
          <p className="onboarding-subtitle">{t.onboardingSub}</p>
        </div>

        <div className="quote-callout">
          <HeartHandshake size={20} className="quote-icon" />
          <span>"{t.slogan}"</span>
        </div>

        <div className="level-selection-block">
          <h3 className="question-prompt">{t.currentLevelPrompt}</h3>
          
          <div className="options-vertical-list">
            {levelOptions.map((opt) => (
              <div
                key={opt.id}
                className={`level-option-card ${selectedLevel === opt.id ? 'active' : ''}`}
                onClick={() => setSelectedLevel(opt.id)}
              >
                <div className="option-radio-indicator">
                  {selectedLevel === opt.id && <CheckCircle2 size={20} className="radio-check" />}
                </div>
                <div className="option-info-group">
                  <div className="option-top-row">
                    <h4 className="option-title-text">{opt.title}</h4>
                    <span className="badge badge-primary">{opt.badge}</span>
                  </div>
                  <p className="option-desc-text">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary start-journey-btn" onClick={handleFinish}>
          <span>{t.startJourneyBtn}</span>
          <ArrowRight size={20} />
        </button>
      </div>

      <style>{`
        .onboarding-container {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px, 3vw, 24px);
          width: 100%;
          max-width: 100%;
        }
        .onboarding-card {
          max-width: 680px;
          width: 100%;
          padding: clamp(20px, 4vw, 36px);
          border-radius: var(--radius-lg);
          background: #ffffff;
          border: 1.5px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          box-shadow: var(--shadow-xl);
        }
        .onboarding-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }
        .onboarding-logo-img {
          width: clamp(56px, 10vw, 72px);
          height: clamp(56px, 10vw, 72px);
          border-radius: 18px;
          object-fit: cover;
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.4);
          margin-bottom: 6px;
        }
        .onboarding-title {
          font-size: clamp(1.4rem, 4vw, 1.8rem);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .onboarding-subtitle {
          font-size: clamp(0.92rem, 2.5vw, 1.05rem);
          color: var(--text-muted);
          font-weight: 600;
        }
        .quote-callout {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--primary-dark);
          text-align: center;
          flex-wrap: wrap;
          justify-content: center;
        }
        .quote-icon {
          color: var(--primary);
          flex-shrink: 0;
        }
        .level-selection-block {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .question-prompt {
          font-size: clamp(1rem, 3vw, 1.15rem);
          font-weight: 700;
          color: #1e293b;
          text-align: center;
        }
        .options-vertical-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }
        .level-option-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          background: #f8fafc;
          border: 2px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .level-option-card:hover {
          border-color: var(--primary);
          background: #fff7ed;
          transform: translateY(-2px);
        }
        .level-option-card.active {
          border-color: var(--primary);
          background: #fff7ed;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.15);
        }
        .option-radio-indicator {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .level-option-card.active .option-radio-indicator {
          border-color: var(--primary);
        }
        .radio-check {
          color: var(--primary);
        }
        .option-info-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }
        .option-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }
        .option-title-text {
          font-size: 0.98rem;
          font-weight: 700;
          color: #0f172a;
        }
        .option-desc-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .start-journey-btn {
          width: 100%;
          padding: 14px;
          font-size: 1.05rem;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
