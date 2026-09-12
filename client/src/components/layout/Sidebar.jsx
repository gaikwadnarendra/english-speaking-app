import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  BookMarked,
  Zap,
  Award,
  Mic,
  Target,
  Heart,
  TrendingUp,
  Settings,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { t, language } = useApp();

  const navItems = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/learn', label: t.navLearn, icon: BookOpen },
    { to: '/vocab', label: t.navVocab, icon: BookMarked },
    { to: '/verbs', label: t.navVerbs, icon: Zap },
    { to: '/practice', label: t.navPractice, icon: Award },
    { to: '/speaking', label: t.navSpeaking, icon: Mic, isNew: true },
    { to: '/daily-challenge', label: t.navDailyChallenge, icon: Target },
    { to: '/favorites', label: t.navFavorites, icon: Heart },
    { to: '/progress', label: t.navProgress, icon: TrendingUp },
    { to: '/settings', label: t.navSettings, icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/logo.png" alt={t.appName} className="sidebar-logo-img" />
            <div className="brand-text-block">
              <span className="brand-title">{t.appName}</span>
              <span className="brand-badge">{t.brandBadge}</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-scrollable">
          <div className="nav-group-label">
            {t.navGroupTitle}
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `nav-item-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => {
                    if (window.innerWidth <= 900) {
                      onClose();
                    }
                  }}
                >
                  <Icon size={20} className="nav-item-icon" />
                  <span className="nav-item-label">{item.label}</span>
                  {item.isNew && <span className="new-tag">NEW</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Motivational Card at bottom */}
        <div className="sidebar-footer-card">
          <div className="footer-quote-icon">💡</div>
          <p className="footer-quote-text">
            {t.sidebarQuote}
          </p>
        </div>
      </aside>

      <style>{`
        .sidebar-container {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: 260px;
          background: #0f172a;
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          z-index: 50;
          border-right: 1px solid #1e293b;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (max-width: 900px) {
          .sidebar-container {
            transform: translateX(-100%);
          }
          .sidebar-container.open {
            transform: translateX(0);
          }
        }
        .sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 45;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 20px 16px;
          border-bottom: 1px solid #1e293b;
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sidebar-logo-img {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 0 16px rgba(249, 115, 22, 0.4);
        }
        .brand-logo-glow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff;
          box-shadow: 0 0 16px rgba(249, 115, 22, 0.4);
        }
        .brand-text-block {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.2px;
          color: #ffffff;
        }
        .brand-badge {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .sidebar-close-btn {
          display: none;
          color: #94a3b8;
          padding: 6px;
        }
        @media (max-width: 900px) {
          .sidebar-close-btn {
            display: inline-flex;
          }
        }
        .sidebar-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 16px 12px;
        }
        .nav-group-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #64748b;
          padding: 0 12px 10px;
          text-transform: uppercase;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-item-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 600;
          transition: all 0.2s ease;
          position: relative;
        }
        .nav-item-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }
        .nav-item-link.active {
          background: linear-gradient(90deg, rgba(249, 115, 22, 0.18) 0%, rgba(249, 115, 22, 0.05) 100%);
          color: #f97316;
          border-left: 3px solid #f97316;
          font-weight: 700;
        }
        .nav-item-icon {
          flex-shrink: 0;
        }
        .nav-item-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .new-tag {
          font-size: 0.65rem;
          background: #10b981;
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .sidebar-footer-card {
          margin: 12px;
          padding: 14px;
          background: #1e293b;
          border-radius: 12px;
          border: 1px solid #334155;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .footer-quote-icon {
          font-size: 1.2rem;
        }
        .footer-quote-text {
          font-size: 0.78rem;
          color: #cbd5e1;
          line-height: 1.4;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
