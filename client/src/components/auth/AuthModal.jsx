import React, { useState } from 'react';
import { X, Lock, Mail, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const { language, t } = useApp();

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, language);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || t.authErrorFallback
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@learner.com');
    setPassword('password123');
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={closeAuthModal}>
          <X size={20} />
        </button>

        <div className="auth-brand-header">
          <img src="/logo.png" alt={t.appName} className="auth-logo-img" />
          <h2 className="auth-modal-title">
            {activeTab === 'login' ? t.authModalLoginTitle : t.authModalRegisterTitle}
          </h2>
          <p className="auth-modal-sub">
            {t.authModalSub}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs-row">
          <button
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
          >
            <LogIn size={16} />
            <span>{t.loginBtn}</span>
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
          >
            <UserPlus size={16} />
            <span>{t.authModalRegisterTitle}</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-error-box">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="auth-input-group">
              <label>{t.fullNameLabel}</label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>{t.emailLabel}</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>{t.passwordLabel}</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={isSubmitting}
          >
            <span>
              {isSubmitting
                ? t.loggingInText
                : activeTab === 'login'
                ? t.loginBtn
                : t.createAccountBtn}
            </span>
          </button>
        </form>

        {/* Quick Demo Credentials */}
        {activeTab === 'login' && (
          <div className="demo-credentials-box">
            <span>{t.demoCredentialsTitle}</span>
            <button type="button" className="btn-outline demo-btn" onClick={fillDemo}>
              {t.demoAccountBtn}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .auth-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .auth-modal-card {
          max-width: 460px;
          width: 100%;
          background: #ffffff;
          border-radius: var(--radius-lg);
          padding: 32px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-color);
        }
        .auth-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          color: var(--text-muted);
          padding: 6px;
        }
        .auth-brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
        }
        .auth-logo-img {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          object-fit: cover;
          box-shadow: 0 6px 18px rgba(249, 115, 22, 0.35);
          margin-bottom: 4px;
        }
        .auth-logo-badge {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary) 0%, #ea580c 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(249, 115, 22, 0.35);
          margin-bottom: 4px;
        }
        .auth-modal-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0f172a;
        }
        .auth-modal-sub {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .auth-tabs-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-sm);
        }
        .auth-tab-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.9rem;
          color: #64748b;
        }
        .auth-tab-btn.active {
          background: #ffffff;
          color: var(--primary-dark);
          box-shadow: var(--shadow-sm);
        }
        .auth-error-box {
          background: #fee2e2;
          color: #991b1b;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .auth-input-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }
        .input-with-icon input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-color);
          font-size: 0.95rem;
          outline: none;
        }
        .input-with-icon input:focus {
          border-color: var(--primary);
        }
        .auth-submit-btn {
          padding: 12px;
          font-size: 1rem;
          margin-top: 6px;
        }
        .demo-credentials-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .demo-btn {
          padding: 4px 10px;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
