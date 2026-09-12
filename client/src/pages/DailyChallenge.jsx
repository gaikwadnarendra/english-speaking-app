import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, Circle, Flame, ArrowRight, Trophy, BookOpen, Mic, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';

const DailyChallenge = () => {
  const navigate = useNavigate();
  const { t, language, streak, triggerStreakReward } = useApp();
  const { completeTask, isTaskCompleted } = useProgress();

  const [tasks, setTasks] = useState([
    { id: 1, key: 'task1', type: 'vocab', link: '/vocab', completed: true },
    { id: 2, key: 'task2', type: 'learn', link: '/learn', completed: true },
    { id: 3, key: 'task3', type: 'quiz', link: '/practice', completed: true },
    { id: 4, key: 'task4', type: 'speaking', link: '/speaking', completed: false }
  ]);

  const toggleTask = (id) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);

    const allDone = updated.every(t => t.completed);
    if (allDone) {
      triggerStreakReward();
      completeTask(4, 'daily_streak');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="daily-challenge-page">
      <div className="challenge-hero-card glass-card">
        <div className="challenge-hero-left">
          <div className="challenge-badge">
            <Target size={16} />
            <span>{t.dailyChallengeTitle}</span>
          </div>
          <h2 className="challenge-title">{t.challengeHeroTitle}</h2>
          <p className="challenge-subtitle">
            {t.dailyChallengeSub}
          </p>

          <div className="challenge-progress-bar-wrap">
            <div className="progress-labels">
              <span>{t.progressLabel} {completedCount} / {tasks.length} {t.completedRatioText}</span>
              <span className="percent-label">{progressPercent}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="streak-reward-display">
          <Flame size={44} className="flame-active" />
          <span className="streak-big-num">{streak}</span>
          <span className="streak-sub-text">{t.streakDays}</span>
        </div>
      </div>

      {/* Task Checklist */}
      <div className="tasks-list-container">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-row-card glass-card hover-lift ${task.completed ? 'completed' : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            <div className="task-checkbox-indicator">
              {task.completed ? (
                <CheckCircle2 size={24} className="check-icon-done" />
              ) : (
                <Circle size={24} className="check-icon-todo" />
              )}
            </div>

            <div className="task-info">
              <h4 className="task-title-text">{t[task.key]}</h4>
            </div>

            <button
              className="btn-secondary task-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(task.link);
              }}
            >
              <span>{t.startText}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {progressPercent === 100 && (
        <div className="all-completed-banner glass-card">
          <Trophy size={32} className="trophy-gold" />
          <div className="all-done-text">
            <h3>{t.allTasksDoneTitle}</h3>
            <p>{t.allTasksDoneSub}</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/progress')}>
            <span>{t.viewProgressAndStatus}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      <style>{`
        .daily-challenge-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .challenge-hero-card {
          padding: clamp(16px, 4vw, 32px);
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
          .challenge-hero-card {
            flex-direction: column;
            text-align: left;
            align-items: stretch;
          }
          .streak-reward-display {
            flex-direction: row !important;
            justify-content: center;
            width: 100%;
          }
        }
        .challenge-hero-left {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
          min-width: 240px;
        }
        .challenge-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        .challenge-title {
          font-size: clamp(1.4rem, 4vw, 1.8rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
        }
        .challenge-subtitle {
          font-size: 0.92rem;
          color: #475569;
        }
        .challenge-progress-bar-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 8px;
        }
        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
          flex-wrap: wrap;
          gap: 4px;
        }
        .percent-label {
          color: var(--primary);
        }
        .progress-track {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, #ea580c 100%);
          border-radius: 4px;
          transition: width 0.4s ease;
        }
        .streak-reward-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 14px 20px;
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid #fed7aa;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }
        .streak-big-num {
          font-size: clamp(1.8rem, 4vw, 2.2rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .streak-sub-text {
          font-size: 0.8rem;
          font-weight: 700;
          color: #c2410c;
        }
        .tasks-list-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .task-row-card {
          padding: 16px 18px;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1.5px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-wrap: wrap;
        }
        .task-row-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        .task-row-card.completed {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }
        .check-icon-done {
          color: #10b981;
          flex-shrink: 0;
        }
        .check-icon-todo {
          color: #cbd5e1;
          flex-shrink: 0;
        }
        .task-info {
          flex: 1;
          min-width: 180px;
        }
        .task-title-text {
          font-size: clamp(0.95rem, 2.5vw, 1.05rem);
          font-weight: 700;
          color: #0f172a;
        }
        .task-action-btn {
          padding: 8px 14px;
          font-size: 0.85rem;
          margin-left: auto;
        }
        .all-completed-banner {
          padding: clamp(18px, 4vw, 28px);
          border-radius: var(--radius-lg);
          background: #ecfdf5;
          border: 1.5px solid #a7f3d0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .sparkle-gold {
          color: #f59e0b;
        }
        .all-done-text h3 {
          font-size: 1.2rem;
          color: #065f46;
        }
        .all-done-text p {
          font-size: 0.88rem;
          color: #047857;
          margin-top: 4px;
        }
        @media (max-width: 540px) {
          .all-completed-banner {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }
          .all-completed-banner button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default DailyChallenge;
