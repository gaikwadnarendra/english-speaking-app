import React, { useState } from 'react';
import { Flame, Volume2, Globe, Menu, X, Check, User, LogIn, LogOut, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { speakText } from '../../utils/ttsHelper';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { language, changeLanguage, t, streak, soundSpeed } = useApp();
  const { user, isAuthenticated, logout, openAuthModal, currentTrialDay, isTrialActive } = useAuth();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleAudioTest = () => {
    setIsPlayingTest(true);
    const testText = language === 'mr' 
      ? 'Welcome! You can easily learn English through Marathi!'
      : language === 'hi' 
      ? 'Welcome! You can easily learn English through Hindi!' 
      : 'Welcome! Let us practice English together!';
      
    speakText(testText, 'en-US', soundSpeed, () => {
      setIsPlayingTest(false);
    });
  };

  const languages = [
    { code: 'mr', label: 'मराठी (Marathi)', short: 'मरा' },
    { code: 'hi', label: 'हिंदी (Hindi)', short: 'हिं' },
    { code: 'en', label: 'English', short: 'EN' }
  ];

  return (
    <header className="header-bar">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="header-branding">
          <img src="/logo.png" alt="English शिका Logo" className="header-logo-img" />
          <div className="header-titles">
            <h1 className="header-app-title">{t.appName}</h1>
            <p className="header-app-sub">{t.appSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* 3-Day Free Guest Trial Status Pill */}
        {isTrialActive && (
          <div className="trial-status-pill" title={`${t.trialPill} ${currentTrialDay}/3`}>
            <Clock size={16} />
            <span>{t.trialPill} {currentTrialDay}/3</span>
          </div>
        )}

        {/* Streak Counter */}
        <div className="streak-pill" title={`${streak} ${t.streakDays}`}>
          <Flame size={20} className="flame-active" />
          <span className="streak-number">{streak}</span>
          <span className="streak-label">{t.streakUnit}</span>
        </div>

        {/* Audio Test Button */}
        <button
          className={`audio-test-btn ${isPlayingTest ? 'playing' : ''}`}
          onClick={handleAudioTest}
          title={t.audioTest}
        >
          <Volume2 size={18} className={isPlayingTest ? 'pulse-icon' : ''} />
          <span className="desktop-only-text">{t.audioTest}</span>
        </button>

        {/* Language Switcher Dropdown */}
        <div className="lang-dropdown-wrapper">
          <button
            className="lang-select-btn"
            onClick={() => {
              setLangDropdownOpen(!langDropdownOpen);
              setUserDropdownOpen(false);
            }}
            aria-expanded={langDropdownOpen}
          >
            <Globe size={18} />
            <span className="current-lang-code">{language.toUpperCase()}</span>
          </button>

          {langDropdownOpen && (
            <div className="lang-menu glass-card">
              {languages.map(item => (
                <button
                  key={item.code}
                  className={`lang-option ${language === item.code ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage(item.code);
                    setLangDropdownOpen(false);
                  }}
                >
                  <span>{item.label}</span>
                  {language === item.code && <Check size={16} className="check-icon" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Account / Login Button */}
        <div className="user-dropdown-wrapper">
          {isAuthenticated ? (
            <div className="user-profile-widget">
              <button
                className="user-avatar-btn"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setLangDropdownOpen(false);
                }}
              >
                <div className="avatar-circle">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name-text desktop-only-text">{user.name?.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="user-popover-menu glass-card">
                  <div className="popover-user-info">
                    <p className="popover-name">{user.name}</p>
                    <p className="popover-email">{user.email}</p>
                  </div>
                  <button
                    className="popover-logout-btn"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    <span>{t.logoutBtn}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-primary login-nav-btn" onClick={openAuthModal}>
              <LogIn size={16} />
              <span>{t.loginBtn}</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .header-bar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 768px) {
          .header-bar {
            padding: 10px 16px;
          }
        }
        @media (max-width: 420px) {
          .header-bar {
            padding: 8px 10px;
            gap: 6px;
          }
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .mobile-menu-btn {
          display: none;
          padding: 6px;
          border-radius: var(--radius-sm);
          color: #334155;
          flex-shrink: 0;
        }
        @media (max-width: 900px) {
          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .header-branding {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .header-logo-img {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }
        @media (max-width: 420px) {
          .header-logo-img {
            width: 30px;
            height: 30px;
          }
        }
        .header-titles {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .header-app-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.3px;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 480px) {
          .header-app-title {
            font-size: 0.98rem;
          }
        }
        .header-app-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        @media (max-width: 480px) {
          .header-right {
            gap: 5px;
          }
        }
        .trial-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: #e0e7ff;
          border: 1px solid #c7d2fe;
          border-radius: var(--radius-full);
          font-weight: 700;
          color: var(--secondary);
          font-size: 0.8rem;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .trial-status-pill {
            display: none;
          }
        }
        .streak-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: var(--radius-full);
          font-weight: 700;
          color: var(--primary-dark);
          font-size: 0.86rem;
          white-space: nowrap;
        }
        @media (max-width: 420px) {
          .streak-pill {
            padding: 4px 8px;
            font-size: 0.8rem;
          }
        }
        .streak-number {
          font-size: 0.95rem;
          font-weight: 800;
        }
        .streak-label {
          font-size: 0.75rem;
          color: #c2410c;
        }
        .audio-test-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--secondary-light);
          color: var(--secondary);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .audio-test-btn:hover {
          background: #c7d2fe;
        }
        .audio-test-btn.playing {
          background: var(--secondary);
          color: #ffffff;
        }
        .desktop-only-text {
          display: inline;
        }
        @media (max-width: 640px) {
          .desktop-only-text {
            display: none;
          }
          .header-app-sub {
            display: none;
          }
        }
        .lang-dropdown-wrapper, .user-dropdown-wrapper {
          position: relative;
        }
        .lang-select-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #f1f5f9;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-main);
        }
        .lang-select-btn:hover {
          border-color: var(--primary);
          background: #ffffff;
        }
        .lang-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 190px;
          padding: 6px;
          z-index: 50;
        }
        .lang-option {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-main);
          text-align: left;
        }
        .lang-option:hover {
          background: #f1f5f9;
        }
        .lang-option.active {
          background: var(--primary-light);
          color: var(--primary-dark);
          font-weight: 700;
        }
        .check-icon {
          color: var(--primary);
        }
        .login-nav-btn {
          padding: 8px 14px;
          font-size: 0.85rem;
        }
        .user-avatar-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 4px;
          background: #f1f5f9;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
        }
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-name-text {
          font-weight: 700;
          font-size: 0.88rem;
          color: #0f172a;
        }
        .user-popover-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          padding: 12px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .popover-user-info {
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }
        .popover-name {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.92rem;
        }
        .popover-email {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .popover-logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          color: #ef4444;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .popover-logout-btn:hover {
          background: #fee2e2;
        }
      `}</style>
    </header>
  );
};

export default Header;
