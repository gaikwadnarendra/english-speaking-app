import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Mic,
  Award,
  Zap,
  Flame,
  Brain,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  Lock,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useProgress, LEVELS } from '../context/ProgressContext';
import StatCard from '../components/common/StatCard';
import WordCard from '../components/common/WordCard';
import AudioButton from '../components/common/AudioButton';
import { fetchVocab } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const { t, language, streak, progress, dueSRSList, onboardingCompleted } = useApp();
  const { isLevelUnlocked, isLevelComplete, isTaskCompleted, getCompletedCount, currentLevel } = useProgress();
  const [todayWords, setTodayWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLevel, setExpandedLevel] = useState(null);

  // Check onboarding
  useEffect(() => {
    if (!onboardingCompleted && localStorage.getItem('onboarding_done') !== 'true') {
      navigate('/onboarding');
    }
  }, [onboardingCompleted, navigate]);

  useEffect(() => {
    const loadTodayContent = async () => {
      try {
        const res = await fetchVocab({ level: 1 });
        if (res.data?.data) {
          setTodayWords(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    loadTodayContent();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetingMorning;
    return t.greetingEvening;
  };

  return (
    <div className="home-page-container">
      {/* Hero Welcome Banner */}
      <div className="hero-banner glass-card">
        <div className="hero-content-left">
          <div className="hero-badge-row">
            <span className="badge badge-primary">
              <Target size={14} />
              <span>{t.dailyMissionBadge}</span>
            </span>
            <span className="streak-tag">
              <Flame size={16} className="flame-active" />
              <span>{streak} {t.streakDays}</span>
            </span>
          </div>

          <h2 className="hero-greeting-text">{getGreeting()}</h2>
          <p className="hero-subtext">
            {t.heroSubtext}
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-primary hero-main-cta"
              onClick={() => navigate('/daily-challenge')}
            >
              <span>{t.startLearningCTA}</span>
              <ArrowRight size={20} />
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/speaking')}
            >
              <Mic size={18} />
              <span>{t.navSpeaking}</span>
            </button>
          </div>
        </div>

        {/* Daily Goal Circle Ring */}
        <div className="hero-goal-widget">
          <div className="goal-circle">
            <span className="goal-number">4/5</span>
            <span className="goal-label">{t.minsToday}</span>
          </div>
          <div className="goal-status-text">
            <Clock size={16} />
            <span>{t.dailyTargetSub}</span>
          </div>
        </div>
      </div>

      {/* Progress Metric Highlights */}
      <div className="stats-grid-row">
        <StatCard
          icon={BookOpen}
          label={t.totalWords}
          value={progress.wordsLearned || 45}
          max={500}
          color="orange"
          subtext={t.goalWords500}
        />
        <StatCard
          icon={Mic}
          label={t.totalSpeaking}
          value={progress.speakingCompleted || 12}
          max={30}
          color="indigo"
          subtext={t.goalSpeaking30}
        />
        <StatCard
          icon={Award}
          label={t.quizAverage}
          value={`${progress.quizScoreAvg || 88}%`}
          color="green"
          subtext={t.accuracyLabel}
        />
        <StatCard
          icon={Target}
          label={t.totalLessons}
          value={progress.lessonsFinished || 5}
          max={50}
          color="purple"
          subtext={t.goalLessons50}
        />
      </div>

      {/* Spaced Repetition Due Reviews Queue */}
      {dueSRSList && dueSRSList.length > 0 && (
        <section className="srs-review-section">
          <div className="section-header-row">
            <div className="section-title-group">
              <div className="icon-badge-srs">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="section-title">{t.dueSRSReviews}</h3>
                <p className="section-subtitle">{t.dueSRSDesc}</p>
              </div>
            </div>
            <button
              className="btn-outline view-all-btn"
              onClick={() => navigate('/favorites')}
            >
              <span>{t.viewAll} ({dueSRSList.length})</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="srs-cards-grid">
            {dueSRSList.slice(0, 2).map((item) => (
              <WordCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Today's Learning Snapshot */}
      <section className="snapshot-section">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">{t.todaySnapshot}</h3>
            <p className="section-subtitle">
              {t.todaySnapshotSub}
            </p>
          </div>
          <button
            className="btn-outline view-all-btn"
            onClick={() => navigate('/vocab')}
          >
            <span>{t.fullVocab}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="words-grid">
          {todayWords.map((word) => (
            <WordCard key={word.id} item={word} />
          ))}
        </div>
      </section>

      {/* ===== Your Learning Journey ===== */}
      <section className="journey-section">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">🗺️ Your Learning Journey</h3>
            <p className="section-subtitle">Complete each level to unlock the next one</p>
          </div>
          <span style={{
            background: '#fff7ed', color: '#c2410c', fontWeight: 800,
            padding: '6px 16px', borderRadius: '99px', fontSize: '0.85rem',
            border: '1.5px solid #fed7aa'
          }}>
            Level {currentLevel} / 5
          </span>
        </div>

        <div className="journey-levels-grid">
          {LEVELS.map((level, index) => {
            const unlocked = isLevelUnlocked(level.id);
            const completed = isLevelComplete(level.id);
            const isCurrent = level.id === currentLevel;
            const doneCount = getCompletedCount(level.id);
            const isExpanded = expandedLevel === level.id;

            return (
              <div
                key={level.id}
                className={`journey-level-card ${completed ? 'level-done' : unlocked ? 'level-active' : 'level-locked'}`}
                style={{ borderLeft: `4px solid ${completed ? '#22c55e' : unlocked ? level.color : '#cbd5e1'}` }}
              >
                <div
                  className="journey-level-header"
                  onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="level-header-left">
                    <div className="level-badge" style={{
                      background: completed ? '#dcfce7' : unlocked ? `${level.color}18` : '#f1f5f9',
                      color: completed ? '#166534' : unlocked ? level.color : '#94a3b8'
                    }}>
                      {completed ? '✅' : unlocked ? `L${level.id}` : <Lock size={14} />}
                    </div>
                    <div>
                      <p className="level-name" style={{ color: unlocked ? '#0f172a' : '#94a3b8' }}>
                        {level.name}
                        {isCurrent && <span className="current-tag">Current</span>}
                      </p>
                      <p className="level-sub" style={{ color: unlocked ? '#64748b' : '#cbd5e1' }}>
                        {completed ? 'Completed ✓' : unlocked ? `${doneCount}/${level.tasks.length} tasks done` : 'Locked 🔒'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {unlocked && (
                      <div className="mini-progress-bar">
                        <div style={{
                          height: '100%', borderRadius: '99px',
                          width: `${(doneCount / level.tasks.length) * 100}%`,
                          background: completed ? '#22c55e' : level.color,
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    )}
                    <ChevronRight size={16} style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s', color: '#94a3b8'
                    }} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="journey-tasks-list">
                    {level.tasks.map(task => {
                      const done = isTaskCompleted(level.id, task.key);
                      return (
                        <div key={task.key} className="journey-task-row" style={{
                          background: done ? '#f0fdf4' : '#f8fafc',
                          border: `1px solid ${done ? '#bbf7d0' : '#e2e8f0'}`
                        }}>
                          <span className="task-icon">{task.icon}</span>
                          <span className="task-label" style={{ color: done ? '#166534' : '#475569' }}>
                            {task.label}
                          </span>
                          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {done
                              ? <CheckCircle2 size={16} color="#22c55e" />
                              : unlocked
                                ? <button
                                    onClick={() => navigate(task.route)}
                                    style={{
                                      padding: '4px 12px', background: level.color,
                                      color: '#fff', border: 'none', borderRadius: '6px',
                                      fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer'
                                    }}
                                  >Go →</button>
                                : <Lock size={14} color="#cbd5e1" />
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Launch Cards */}
      <div className="quick-modules-grid">
        <div className="module-banner-card learn-card" onClick={() => navigate('/learn')}>
          <div className="module-banner-icon"><BookOpen size={28} /></div>
          <h4>{t.module1Title}</h4>
          <p>{t.module1Desc}</p>
          <span className="module-link-text">{t.startText} →</span>
        </div>

        <div className="module-banner-card verbs-card" onClick={() => navigate('/verbs')}>
          <div className="module-banner-icon"><Zap size={28} /></div>
          <h4>{t.module2Title}</h4>
          <p>{t.module2Desc}</p>
          <span className="module-link-text">{t.studyText} →</span>
        </div>

        <div className="module-banner-card practice-card" onClick={() => navigate('/practice')}>
          <div className="module-banner-icon"><Award size={28} /></div>
          <h4>{t.module3Title}</h4>
          <p>{t.module3Desc}</p>
          <span className="module-link-text">{t.playQuizText} →</span>
        </div>
      </div>

      <style>{`
        .home-page-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .hero-banner {
          padding: 28px 32px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
          border: 1.5px solid #fed7aa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        @media (max-width: 860px) {
          .hero-banner {
            flex-direction: column;
            padding: 20px;
            text-align: center;
            align-items: stretch;
          }
        }
        @media (max-width: 480px) {
          .hero-banner {
            padding: 16px 14px;
          }
        }
        .hero-content-left {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 680px;
        }
        .hero-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        @media (max-width: 860px) {
          .hero-badge-row {
            justify-content: center;
          }
        }
        .streak-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 0.88rem;
          color: #c2410c;
        }
        .hero-greeting-text {
          font-size: clamp(1.35rem, 3.5vw, 1.95rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.5px;
        }
        .hero-subtext {
          font-size: clamp(0.9rem, 2.2vw, 1rem);
          color: #475569;
          line-height: 1.5;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        @media (max-width: 860px) {
          .hero-cta-group {
            justify-content: center;
          }
        }
        @media (max-width: 480px) {
          .hero-cta-group {
            flex-direction: column;
            width: 100%;
          }
          .hero-cta-group button {
            width: 100%;
          }
        }
        .hero-main-cta {
          padding: 12px 24px;
          font-size: 0.98rem;
        }
        .hero-goal-widget {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .goal-circle {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #ffffff;
          border: 5px solid var(--primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.18);
        }
        .goal-number {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .goal-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .goal-status-text {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #c2410c;
        }
        .stats-grid-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 1024px) {
          .stats-grid-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 540px) {
          .stats-grid-row {
            grid-template-columns: 1fr;
          }
        }
        .srs-review-section, .snapshot-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .section-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .icon-badge-srs {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--secondary-light);
          color: var(--secondary);
          flex-shrink: 0;
        }
        .section-title {
          font-size: clamp(1.1rem, 3vw, 1.25rem);
          font-weight: 800;
          color: #0f172a;
        }
        .section-subtitle {
          font-size: 0.84rem;
          color: var(--text-muted);
        }
        .srs-cards-grid, .words-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .quick-modules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        @media (max-width: 860px) {
          .quick-modules-grid {
            grid-template-columns: 1fr;
          }
        }
        .module-banner-card {
          padding: 20px;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .module-banner-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .learn-card { border-top: 4px solid var(--primary); }
        .verbs-card { border-top: 4px solid var(--secondary); }
        .practice-card { border-top: 4px solid var(--accent-green); }
        .module-banner-icon {
          color: var(--primary);
        }
        .module-banner-card h4 {
          font-size: 1.05rem;
          font-weight: 800;
        }
        .module-banner-card p {
          font-size: 0.85rem;
          color: var(--text-muted);
          flex: 1;
        }
        .module-link-text {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
        }
        /* Journey Map Styles */
        .journey-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .journey-levels-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .journey-level-card {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .journey-level-card:hover {
          box-shadow: var(--shadow-sm);
        }
        .level-locked {
          opacity: 0.65;
        }
        .journey-level-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 480px) {
          .journey-level-header {
            padding: 12px 14px;
          }
        }
        .level-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .level-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .level-name {
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .current-tag {
          font-size: 0.7rem;
          font-weight: 700;
          background: #fff7ed;
          color: #c2410c;
          border: 1px solid #fed7aa;
          padding: 2px 8px;
          border-radius: 99px;
        }
        .level-sub {
          font-size: 0.8rem;
          margin-top: 2px;
        }
        .mini-progress-bar {
          width: 80px;
          height: 6px;
          background: #e2e8f0;
          border-radius: 99px;
          overflow: hidden;
        }
        .journey-tasks-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 20px 16px;
        }
        .journey-task-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
        }
        .task-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .task-label {
          font-size: 0.88rem;
          font-weight: 600;
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default Home;
