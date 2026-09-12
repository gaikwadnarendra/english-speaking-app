import React from 'react';
import { Heart, Volume2, ShieldCheck, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Footer = () => {
  const { t, language } = useApp();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-motto-block">
          <BookOpen size={16} className="motto-icon" />
          <span className="footer-motto">"{t.slogan}"</span>
        </div>

        <div className="footer-details">
          <div className="footer-badge">
            <ShieldCheck size={15} />
            <span>{t.footerNotice}</span>
          </div>

          <div className="footer-made-with">
            <Heart size={14} className="heart-icon" />
            <span>{t.footerMadeWith}</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-container {
          background: #ffffff;
          border-top: 1px solid var(--border-color);
          padding: 20px 32px;
          margin-top: auto;
        }
        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }
        .footer-motto-block {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff7ed;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          border: 1px solid #fed7aa;
        }
        .motto-icon {
          color: var(--primary);
        }
        .footer-motto {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--primary-dark);
        }
        .footer-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-size: 0.82rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .footer-details {
            justify-content: center;
            flex-direction: column;
            gap: 8px;
          }
        }
        .footer-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #059669;
          font-weight: 600;
        }
        .footer-made-with {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .heart-icon {
          color: #ef4444;
          fill: #ef4444;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
