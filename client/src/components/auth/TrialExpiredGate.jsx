import React from 'react';
import { Lock, LogIn, UserPlus, CheckCircle2, ShieldCheck, Clock, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const TrialExpiredGate = () => {
  const { isTrialExpired, isAuthenticated, openAuthModal, resetTrial } = useAuth();
  const { t } = useApp();

  if (!isTrialExpired || isAuthenticated) return null;

  return (
    <div className="trial-gate-overlay">
      <div className="trial-gate-card glass-card">
        <div className="gate-lock-badge">
          <Lock size={32} />
        </div>

        <div className="gate-header">
          <div className="trial-end-pill">
            <Clock size={16} />
            <span>{t.trialGateHeader}</span>
          </div>
          <h2 className="gate-title">{t.trialGateTitle}</h2>
          <p className="gate-subtitle">
            {t.trialGateSub}
          </p>
        </div>

        {/* Benefits list unlocked upon login */}
        <div className="benefits-card">
          <h4 className="benefits-heading">{t.benefitsHeader}</h4>
          <div className="benefit-item">
            <CheckCircle2 size={18} className="benefit-check" />
            <span>{t.benefit1}</span>
          </div>
          <div className="benefit-item">
            <CheckCircle2 size={18} className="benefit-check" />
            <span>{t.benefit2}</span>
          </div>
          <div className="benefit-item">
            <CheckCircle2 size={18} className="benefit-check" />
            <span>{t.benefit3}</span>
          </div>
          <div className="benefit-item">
            <CheckCircle2 size={18} className="benefit-check" />
            <span>{t.benefit4}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="gate-actions">
          <button className="btn-primary gate-main-btn" onClick={openAuthModal}>
            <LogIn size={20} />
            <span>{t.loginToContinueBtn}</span>
          </button>
        </div>

        <div className="gate-footer-note">
          <ShieldCheck size={16} />
          <span>{t.secureNotice}</span>
        </div>

        {/* Developer / Testing reset link */}
        <button className="test-reset-link" onClick={resetTrial}>
          <RotateCcw size={14} />
          <span>{t.devResetLink}</span>
        </button>
      </div>

      <style>{`
        .trial-gate-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          z-index: 90;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .trial-gate-card {
          max-width: 540px;
          width: 100%;
          background: #ffffff;
          border-radius: var(--radius-lg);
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          border: 1.5px solid #fed7aa;
          position: relative;
        }
        .gate-lock-badge {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(249, 115, 22, 0.45);
        }
        .gate-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .trial-end-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          background: #fee2e2;
          color: #991b1b;
          font-weight: 700;
          font-size: 0.8rem;
        }
        .gate-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
        }
        .gate-subtitle {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
        }
        .benefits-card {
          width: 100%;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }
        .benefits-heading {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 2px;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #334155;
          font-weight: 600;
        }
        .benefit-check {
          color: #10b981;
          flex-shrink: 0;
        }
        .gate-actions {
          width: 100%;
        }
        .gate-main-btn {
          width: 100%;
          padding: 14px;
          font-size: 1.05rem;
          border-radius: var(--radius-sm);
        }
        .gate-footer-note {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #059669;
          font-weight: 600;
        }
        .test-reset-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #94a3b8;
          cursor: pointer;
        }
        .test-reset-link:hover {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default TrialExpiredGate;
