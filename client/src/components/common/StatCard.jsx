import React from 'react';

const StatCard = ({ icon: Icon, label, value, max = null, color = 'orange', subtext = '' }) => {
  const percentage = max ? Math.min(100, Math.round((value / max) * 100)) : null;

  return (
    <div className={`stat-card-wrapper glass-card color-${color}`}>
      <div className="stat-card-inner">
        <div className="stat-icon-badge">
          <Icon size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">{label}</span>
          <div className="stat-value-group">
            <span className="stat-number">{value}</span>
            {max && <span className="stat-max">/ {max}</span>}
          </div>
          {subtext && <span className="stat-subtext">{subtext}</span>}
        </div>
      </div>

      {percentage !== null && (
        <div className="stat-progress-bar-bg">
          <div
            className="stat-progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      <style>{`
        .stat-card-wrapper {
          padding: 18px 20px;
          border-radius: var(--radius-md);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 1px solid var(--border-color);
        }
        .stat-card-inner {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .stat-icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          flex-shrink: 0;
        }
        .color-orange .stat-icon-badge {
          background: #ffedd5;
          color: #f97316;
        }
        .color-indigo .stat-icon-badge {
          background: #e0e7ff;
          color: #4f46e5;
        }
        .color-green .stat-icon-badge {
          background: #d1fae5;
          color: #10b981;
        }
        .color-purple .stat-icon-badge {
          background: #f3e8ff;
          color: #a855f7;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .stat-label {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stat-value-group {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .stat-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .stat-max {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stat-subtext {
          font-size: 0.75rem;
          color: var(--text-light);
        }
        .stat-progress-bar-bg {
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }
        .stat-progress-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease;
        }
        .color-orange .stat-progress-bar-fill { background: #f97316; }
        .color-indigo .stat-progress-bar-fill { background: #4f46e5; }
        .color-green .stat-progress-bar-fill { background: #10b981; }
        .color-purple .stat-progress-bar-fill { background: #a855f7; }
      `}</style>
    </div>
  );
};

export default StatCard;
