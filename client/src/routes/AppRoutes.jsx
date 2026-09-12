import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Onboarding from '../pages/Onboarding';
import Learn from '../pages/Learn';
import Vocabulary from '../pages/Vocabulary';
import Verbs from '../pages/Verbs';
import Practice from '../pages/Practice';
import Speaking from '../pages/Speaking';
import DailyChallenge from '../pages/DailyChallenge';
import Favorites from '../pages/Favorites';
import Progress from '../pages/Progress';
import Settings from '../pages/Settings';
import { useProgress, LEVELS } from '../context/ProgressContext';
import { Lock, ChevronRight } from 'lucide-react';

// ---- Level Gate: Blocks access to locked sections ----
const LevelGate = ({ requiredLevel, taskRoute, children }) => {
  const { isLevelUnlocked, isTaskCompleted, getCompletedCount } = useProgress();
  const navigate = useNavigate();

  // Find which level grants access to this route
  const gatingLevel = LEVELS.find(l => l.id === requiredLevel);

  if (!gatingLevel || isLevelUnlocked(requiredLevel)) {
    return children;
  }

  const prevLevel = LEVELS.find(l => l.id === requiredLevel - 1);
  const doneCount = getCompletedCount(requiredLevel - 1);
  const totalTasks = prevLevel?.tasks.length || 0;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: '24px',
      padding: '40px 20px', textAlign: 'center'
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }}>
        <Lock size={36} color="#94a3b8" />
      </div>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          🔒 {gatingLevel.name} Level Locked
        </h2>
        <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '400px' }}>
          Complete <strong>{prevLevel?.name}</strong> level first to unlock this section.
        </p>
      </div>

      {prevLevel && (
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '24px',
          width: '100%', maxWidth: '460px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
              {prevLevel.name} — Progress
            </h3>
            <span style={{
              fontSize: '0.82rem', fontWeight: 700, color: prevLevel.color,
              background: `${prevLevel.color}18`, padding: '4px 10px', borderRadius: '99px'
            }}>
              {doneCount}/{totalTasks} Done
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {prevLevel.tasks.map(task => {
              const done = isTaskCompleted(prevLevel.id, task.key);
              return (
                <div key={task.key} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '10px',
                  background: done ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${done ? '#bbf7d0' : '#e2e8f0'}`
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{task.icon}</span>
                  <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600, color: done ? '#166534' : '#475569' }}>
                    {task.label}
                  </span>
                  {done
                    ? <span style={{ fontSize: '1rem' }}>✅</span>
                    : <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pending</span>
                  }
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate(prevLevel.tasks.find(t => !isTaskCompleted(prevLevel.id, t.key))?.route || '/')}
            style={{
              marginTop: '16px', width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <span>Continue {prevLevel.name}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Onboarding Screen */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Main App Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        {/* Level 1 — always accessible */}
        <Route path="learn" element={<Learn />} />
        <Route path="vocab" element={<Vocabulary />} />
        <Route path="practice" element={<Practice />} />

        {/* Level 2 — requires Level 1 complete */}
        <Route path="speaking" element={
          <LevelGate requiredLevel={2}>
            <Speaking />
          </LevelGate>
        } />
        <Route path="verbs" element={
          <LevelGate requiredLevel={2}>
            <Verbs />
          </LevelGate>
        } />

        {/* Level 4 — requires Level 3 complete */}
        <Route path="daily-challenge" element={
          <LevelGate requiredLevel={4}>
            <DailyChallenge />
          </LevelGate>
        } />

        {/* Always accessible */}
        <Route path="favorites" element={<Favorites />} />
        <Route path="progress" element={<Progress />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
