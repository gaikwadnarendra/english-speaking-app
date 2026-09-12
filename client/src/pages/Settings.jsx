import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Volume2,
  Bell,
  RotateCcw,
  ShieldCheck,
  Check,
  Crown,
  Zap,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { speakText, checkSpeechSupport } from '../utils/ttsHelper';
import { resetUserProgress, updateUserSettings } from '../services/api';

const Settings = () => {
  const { language, changeLanguage, t, soundSpeed, setSoundSpeed, refreshData } = useApp();
  const { user, isAuthenticated, isTrialActive, currentTrialDay, trialDaysLeft, simulateTrialExpiry, resetTrial } = useAuth();

  const [reminderTime, setReminderTime] = useState('08:00 PM');
  const [targetMinutes, setTargetMinutes] = useState(5);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const speechStatus = checkSpeechSupport();

  const handleSpeedChange = (speed) => {
    setSoundSpeed(speed);
    speakText('Speech speed updated', 'en-US', speed);
  };

  const handleSaveSettings = async () => {
    try {
      await updateUserSettings({
        uiLanguage: language,
        reminderTime,
        targetDailyMinutes: targetMinutes
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleResetData = async () => {
    if (window.confirm(t.resetConfirmPrompt)) {
      try {
        await resetUserProgress();
        localStorage.removeItem('onboarding_done');
        await refreshData();
        alert(t.resetSuccessAlert);
        window.location.href = '/';
      } catch (err) {
        console.warn(err);
      }
    }
  };

  return (
    <div className="settings-page-container">
      {/* Header */}
      <div className="settings-header-block">
        <div>
          <h2 className="page-main-title">{t.settingsPageTitle}</h2>
          <p className="page-main-subtitle">
            {t.settingsPageSub}
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Pro Membership / Subscription Readiness Card */}
        <div className="settings-card subscription-pro-card glass-card">
          <div className="card-heading-row">
            <div className="crown-badge">
              <Crown size={24} />
            </div>
            <div>
              <div className="pro-heading-badge-row">
                <h3>{t.proPlanTitle}</h3>
                <span className="badge badge-amber">{t.comingSoonBadge}</span>
              </div>
              <p>{t.proPlanSub}</p>
            </div>
          </div>

          <div className="plan-status-pill-box">
            <span className="current-plan-label">{t.currentPlanLabel}</span>
            {isAuthenticated ? (
              <span className="badge badge-green">{t.registeredFreeUser}</span>
            ) : isTrialActive ? (
              <span className="badge badge-indigo">{t.freeTrialActive} {currentTrialDay}/3)</span>
            ) : (
              <span className="badge badge-red">{t.trialOverLoginRequired}</span>
            )}
          </div>

          <div className="pro-features-list">
            <div className="pro-feature-item">
              <Check size={16} className="feature-check-icon" />
              <span>{t.proFeature1}</span>
            </div>
            <div className="pro-feature-item">
              <Check size={16} className="feature-check-icon" />
              <span>{t.proFeature2}</span>
            </div>
            <div className="pro-feature-item">
              <Check size={16} className="feature-check-icon" />
              <span>{t.proFeature3}</span>
            </div>
            <div className="pro-feature-item">
              <Check size={16} className="feature-check-icon" />
              <span>{t.proFeature4}</span>
            </div>
          </div>

          {/* Test Trial simulation options for testing */}
          <div className="trial-test-tools-box">
            <span className="tool-title">{t.devTestTools}</span>
            <div className="test-buttons-row">
              <button className="btn-outline test-btn" onClick={simulateTrialExpiry}>
                {t.testDay4Lock}
              </button>
              <button className="btn-outline test-btn" onClick={resetTrial}>
                {t.resetToDay1}
              </button>
            </div>
          </div>
        </div>

        {/* Language Selection Card */}
        <div className="settings-card glass-card">
          <div className="card-heading-row">
            <Globe size={22} className="setting-icon-primary" />
            <div>
              <h3>{t.appLangTitle}</h3>
              <p>{t.appLangSub}</p>
            </div>
          </div>

          <div className="lang-options-grid">
            {[
              { code: 'mr', title: 'मराठी (Marathi)', desc: 'मराठी-प्रथम इंटरफेस' },
              { code: 'hi', title: 'हिंदी (Hindi)', desc: 'हिंदी इंटरफेस' },
              { code: 'en', title: 'English', desc: 'English Interface' }
            ].map((item) => (
              <div
                key={item.code}
                className={`lang-card-select ${language === item.code ? 'active' : ''}`}
                onClick={() => changeLanguage(item.code)}
              >
                <div className="lang-radio-indicator">
                  {language === item.code && <Check size={16} />}
                </div>
                <div>
                  <h4 className="lang-card-title">{item.title}</h4>
                  <span className="lang-card-sub">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audio & Pronunciation Card */}
        <div className="settings-card glass-card">
          <div className="card-heading-row">
            <Volume2 size={22} className="setting-icon-secondary" />
            <div>
              <h3>{t.audioSpeedTitle}</h3>
              <p>{t.audioSpeedSub}</p>
            </div>
          </div>

          <div className="speed-pills-row">
            {[
              { speed: 0.75, label: t.speedSlow },
              { speed: 0.9, label: t.speedRecommended },
              { speed: 1.0, label: t.speedNormal },
              { speed: 1.25, label: t.speedFast }
            ].map((item) => (
              <button
                key={item.speed}
                className={`speed-pill ${soundSpeed === item.speed ? 'active' : ''}`}
                onClick={() => handleSpeedChange(item.speed)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="device-tts-status-box">
            <span className="tts-status-title">{t.diagnosticsTitle}</span>
            <div className="diagnostics-row">
              <span className={`diag-chip ${speechStatus.hasTTS ? 'supported' : 'missing'}`}>
                {speechStatus.hasTTS ? '✓ Text-to-Speech Ready' : '✗ TTS Unavailable'}
              </span>
              <span className={`diag-chip ${speechStatus.hasSTT ? 'supported' : 'missing'}`}>
                {speechStatus.hasSTT ? '✓ Mic Recognition Ready' : '✗ Speech Rec. Online Only'}
              </span>
              <span className={`diag-chip ${speechStatus.hasMediaRecorder ? 'supported' : 'missing'}`}>
                {speechStatus.hasMediaRecorder ? '✓ Voice Recorder Ready' : '✗ MediaRecorder Off'}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Habit & Reminder Card */}
        <div className="settings-card glass-card">
          <div className="card-heading-row">
            <Bell size={22} className="setting-icon-amber" />
            <div>
              <h3>{t.dailyReminderTitle}</h3>
              <p>{t.dailyReminderSub}</p>
            </div>
          </div>

          <div className="form-fields-grid">
            <div className="form-field">
              <label>{t.dailyPracticeTime}</label>
              <select
                className="input-select"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              >
                <option value="08:00 AM">08:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
                <option value="08:00 PM">08:00 PM</option>
                <option value="09:30 PM">09:30 PM</option>
              </select>
            </div>

            <div className="form-field">
              <label>{t.dailyTargetDuration}</label>
              <select
                className="input-select"
                value={targetMinutes}
                onChange={(e) => setTargetMinutes(parseInt(e.target.value, 10))}
              >
                <option value={3}>3 मिनिटे (अतिशय सोपे)</option>
                <option value={5}>5 मिनिटे (नियमित ध्येय)</option>
                <option value={10}>10 मिनिटे (सखोल सराव)</option>
              </select>
            </div>
          </div>

          <button className="btn-primary save-settings-btn" onClick={handleSaveSettings}>
            <span>बदल सेव्ह करा (Save Settings)</span>
          </button>
          {saveSuccess && (
            <span className="save-success-tag">✓ सेटिंग्ज यशस्वीरित्या सेव्ह झाल्या!</span>
          )}
        </div>

        {/* Data Reset & Privacy */}
        <div className="settings-card glass-card">
          <div className="card-heading-row">
            <RotateCcw size={22} className="setting-icon-red" />
            <div>
              <h3>डेटा व्यवस्थापन आणि गोपनीयता (Data & Privacy)</h3>
              <p>१००% सुरक्षित • डेटा स्थानिकरित्या व क्लाउडवर साठवला जातो.</p>
            </div>
          </div>

          <div className="privacy-actions-row">
            <button className="btn-outline reset-all-btn" onClick={handleResetData}>
              <RotateCcw size={16} />
              <span>सर्व प्रगती रीसेट करा (Reset All Data)</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 800px;
          width: 100%;
        }
        .settings-card {
          padding: clamp(16px, 3vw, 24px);
          border-radius: var(--radius-md);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 18px;
          border: 1px solid var(--border-color);
        }
        .subscription-pro-card {
          background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
          border: 1.5px solid #fed7aa;
        }
        .crown-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #fef3c7;
          color: #d97706;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pro-heading-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .plan-status-pill-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          flex-wrap: wrap;
        }
        .current-plan-label {
          color: var(--text-muted);
        }
        .pro-features-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px;
          background: #ffffff;
          padding: 14px;
          border-radius: var(--radius-sm);
          border: 1px solid #fed7aa;
        }
        .pro-feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: #334155;
          font-weight: 600;
        }
        .feature-check-icon {
          color: #10b981;
          flex-shrink: 0;
        }
        .trial-test-tools-box {
          padding-top: 12px;
          border-top: 1px dashed #fed7aa;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tool-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .test-buttons-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .test-btn {
          font-size: 0.8rem;
          padding: 6px 10px;
        }
        .card-heading-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .card-heading-row h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
        }
        .card-heading-row p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .setting-icon-primary { color: var(--primary); flex-shrink: 0; }
        .setting-icon-secondary { color: var(--secondary); flex-shrink: 0; }
        .setting-icon-amber { color: var(--accent-amber); flex-shrink: 0; }
        .setting-icon-red { color: var(--accent-red); flex-shrink: 0; }

        .lang-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }
        .lang-card-select {
          padding: 12px;
          border-radius: var(--radius-sm);
          background: #f8fafc;
          border: 1.5px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lang-card-select:hover {
          border-color: var(--primary);
        }
        .lang-card-select.active {
          border-color: var(--primary);
          background: #fff7ed;
        }
        .lang-radio-indicator {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }
        .lang-card-select.active .lang-radio-indicator {
          border-color: var(--primary);
          background: #ffffff;
        }
        .lang-card-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f172a;
        }
        .lang-card-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .speed-pills-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .speed-pill {
          padding: 8px 14px;
          border-radius: var(--radius-full);
          background: #f1f5f9;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          border: none;
          cursor: pointer;
        }
        .speed-pill:hover {
          background: #e2e8f0;
        }
        .speed-pill.active {
          background: var(--secondary);
          color: #ffffff;
        }
        .device-tts-status-box {
          background: #f8fafc;
          padding: 12px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tts-status-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .diagnostics-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .diag-chip {
          font-size: 0.78rem;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
        .diag-chip.supported {
          background: #d1fae5;
          color: #065f46;
        }
        .diag-chip.missing {
          background: #fee2e2;
          color: #991b1b;
        }
        .form-fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-field label {
          font-size: 0.88rem;
          font-weight: 700;
          color: #334155;
        }
        .input-select {
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-color);
          background: #ffffff;
          font-size: 0.92rem;
          outline: none;
        }
        .save-settings-btn {
          align-self: flex-start;
          padding: 10px 20px;
        }
        .save-success-tag {
          color: #059669;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .reset-all-btn {
          color: #ef4444;
          border-color: #fecaca;
        }
        .reset-all-btn:hover {
          background: #fee2e2;
          color: #b91c1c;
          border-color: #ef4444;
        }
        @media (max-width: 480px) {
          .save-settings-btn {
            width: 100%;
            justify-content: center;
          }
          .reset-all-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;
