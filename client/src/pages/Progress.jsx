import React from 'react';
import {
  TrendingUp,
  Share2,
  Flame,
  Award,
  BookOpen,
  Mic,
  Target,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import StatCard from '../components/common/StatCard';
import { useApp } from '../context/AppContext';

const Progress = () => {
  const { t, language, streak, progress } = useApp();

  const handleShareWhatsApp = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    const shareText = `🔥 ${t.appName}: ${t.milestoneTitlePrefix} ${streak} ${t.milestoneTitleSuffix}\n\n📚 ${t.totalWords}: ${progress.wordsLearned || 145}/500\n🗣️ ${t.totalSpeaking}: ${progress.speakingCompleted || 24}/30\n🎯 ${t.quizAverage}: ${progress.quizScoreAvg || 92}%\n\n${t.slogan} ✨`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="progress-page-container">
      {/* Page Header */}
      <div className="progress-header-block">
        <div>
          <h2 className="page-main-title">{t.progressPageTitle}</h2>
          <p className="page-main-subtitle">
            {t.progressPageSub}
          </p>
        </div>

        <button className="btn-primary whatsapp-share-btn" onClick={handleShareWhatsApp}>
          <Share2 size={18} />
          <span>{t.shareWhatsApp}</span>
        </button>
      </div>

      {/* Hero Streak & Share Milestone Banner */}
      <div className="milestone-hero-card glass-card">
        <div className="milestone-left">
          <div className="milestone-badge">
            <Trophy size={16} />
            <span>{t.milestoneBadge}</span>
          </div>
          <h2 className="milestone-title">{t.milestoneTitlePrefix} {streak} {t.milestoneTitleSuffix}</h2>
          <p className="milestone-desc">
            {t.milestoneDesc}
          </p>
          <div className="share-actions-row">
            <button className="btn-primary" onClick={handleShareWhatsApp}>
              <Share2 size={18} />
              <span>{t.shareWhatsApp}</span>
            </button>
          </div>
        </div>

        <div className="milestone-graphic-box">
          <div className="flame-halo">
            <Flame size={60} className="flame-active" />
          </div>
          <span className="streak-giant-text">{streak} {t.streakUnit?.toUpperCase()}</span>
          <span className="streak-motto-text">{t.activeStreakBadge}</span>
        </div>
      </div>

      {/* Full Stats Counters Grid */}
      <div className="progress-stats-grid">
        <StatCard
          icon={BookOpen}
          label={t.totalWords}
          value={progress.wordsLearned || 45}
          max={500}
          color="orange"
          subtext={t.goalWords500}
        />
        <StatCard
          icon={Target}
          label={t.totalSentences}
          value={progress.sentencesPracticed || 28}
          max={300}
          color="indigo"
          subtext={t.goalSentences300}
        />
        <StatCard
          icon={BookOpen}
          label={t.totalLessons}
          value={progress.lessonsFinished || 5}
          max={50}
          color="purple"
          subtext={t.goalLessons50}
        />
        <StatCard
          icon={Mic}
          label={t.totalSpeaking}
          value={progress.speakingCompleted || 12}
          max={30}
          color="green"
          subtext={t.goalSpeaking30}
        />
      </div>

      {/* Habit Building Advice Card */}
      <div className="habit-advice-card glass-card">
        <div className="habit-icon-badge">💡</div>
        <div className="habit-content">
          <h4>{t.habitRulesTitle}</h4>
          <ul>
            <li>{t.habitRule1}</li>
            <li>{t.habitRule2}</li>
            <li>{t.habitRule3}</li>
          </ul>
        </div>
      </div>

      <style>{`
        .progress-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .progress-header-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .whatsapp-share-btn {
          background: #25d366;
          color: #ffffff;
        }
        .whatsapp-share-btn:hover {
          background: #128c7e;
        }
        .milestone-hero-card {
          padding: clamp(18px, 4vw, 36px);
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
          border: 1.5px solid #fed7aa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .milestone-hero-card {
            flex-direction: column;
            text-align: left;
            align-items: stretch;
          }
          .milestone-graphic-box {
            width: 100%;
          }
        }
        .milestone-left {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
          min-width: 240px;
        }
        .milestone-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        .milestone-title {
          font-size: clamp(1.4rem, 4vw, 1.9rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
        }
        .milestone-desc {
          font-size: 0.92rem;
          color: #475569;
        }
        .share-actions-row {
          margin-top: 8px;
        }
        .milestone-graphic-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 28px;
          background: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid #fed7aa;
          box-shadow: var(--shadow-md);
          flex-shrink: 0;
        }
        .flame-halo {
          margin-bottom: 8px;
        }
        .streak-giant-text {
          font-size: clamp(1.4rem, 3vw, 1.8rem);
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .streak-motto-text {
          font-size: 0.75rem;
          font-weight: 800;
          color: #c2410c;
          letter-spacing: 1px;
        }
        .progress-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          width: 100%;
        }
        .habit-advice-card {
          padding: clamp(16px, 3vw, 24px);
          border-radius: var(--radius-md);
          background: #ffffff;
          display: flex;
          gap: 16px;
          border-left: 4px solid var(--secondary);
        }
        .habit-icon-badge {
          font-size: 1.6rem;
          flex-shrink: 0;
        }
        .habit-content h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .habit-content ul {
          padding-left: 20px;
          color: #475569;
          font-size: 0.92rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default Progress;
