import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import AudioButton from '../common/AudioButton';
import { useApp } from '../../context/AppContext';

const MatchPairs = ({ pairs = [], onComplete }) => {
  const { t, language } = useApp();
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [shuffledRight, setShuffledRight] = useState([]);

  useEffect(() => {
    if (pairs && pairs.length > 0) {
      setShuffledRight([...pairs.map(p => p.right)].sort(() => Math.random() - 0.5));
      setMatchedPairs([]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }, [pairs]);

  const leftItems = pairs.map(p => p.left);

  const handleLeftClick = (item) => {
    if (matchedPairs.some(p => p.left === item)) return;
    setSelectedLeft(item);
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleRightClick = (item) => {
    if (matchedPairs.some(p => p.right === item)) return;
    setSelectedRight(item);
    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (left, right) => {
    const isPair = pairs.some(p => p.left === left && p.right === right);
    if (isPair) {
      const newMatched = [...matchedPairs, { left, right }];
      setMatchedPairs(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (newMatched.length === pairs.length) {
        confetti({ particleCount: 80, spread: 60 });
        if (onComplete) onComplete();
      }
    } else {
      setWrongAttempt(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongAttempt(false);
      }, 700);
    }
  };

  const handleReset = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    if (pairs && pairs.length > 0) {
      setShuffledRight([...pairs.map(p => p.right)].sort(() => Math.random() - 0.5));
    }
  };

  return (
    <div className="match-pairs-container glass-card">
      <div className="match-header">
        <span className="badge badge-indigo">{t.matchBadge}</span>
        <p className="match-sub">{t.matchInstruction}</p>
      </div>

      <div className="match-columns-grid">
        {/* Left Column (Meaning) */}
        <div className="match-column">
          <h4 className="column-title">{t.marathiMeaningCol}</h4>
          {leftItems.map((item, idx) => {
            const isMatched = matchedPairs.some(p => p.left === item);
            const isSelected = selectedLeft === item;
            return (
              <button
                key={idx}
                className={`match-tile ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${wrongAttempt && isSelected ? 'wrong' : ''}`}
                onClick={() => handleLeftClick(item)}
                disabled={isMatched}
              >
                <span>{item}</span>
                {isMatched && <CheckCircle2 size={18} className="matched-icon" />}
              </button>
            );
          })}
        </div>

        {/* Right Column (English Words) */}
        <div className="match-column">
          <h4 className="column-title">{t.englishWordCol}</h4>
          {shuffledRight.map((item, idx) => {
            const isMatched = matchedPairs.some(p => p.right === item);
            const isSelected = selectedRight === item;
            return (
              <button
                key={idx}
                className={`match-tile ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${wrongAttempt && isSelected ? 'wrong' : ''}`}
                onClick={() => handleRightClick(item)}
                disabled={isMatched}
              >
                <span>{item}</span>
                {isMatched && <AudioButton text={item} size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      {matchedPairs.length === pairs.length && (
        <div className="match-completion-box">
          <Trophy size={24} className="trophy-icon" />
          <h3>{t.allPairsMatched}</h3>
          <button className="btn-outline" onClick={handleReset}>
            <RotateCcw size={16} />
            <span>{t.playAgain}</span>
          </button>
        </div>
      )}

      <style>{`
        .match-pairs-container {
          padding: 24px;
          border-radius: var(--radius-lg);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 20px;
          border: 1px solid var(--border-color);
        }
        .match-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .match-sub {
          font-size: 0.92rem;
          color: var(--text-muted);
        }
        .match-columns-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .match-columns-grid {
            grid-template-columns: 1fr;
          }
        }
        .match-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .column-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 4px;
        }
        .match-tile {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-radius: var(--radius-sm);
          background: #f8fafc;
          border: 1.5px solid var(--border-color);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
          transition: all 0.2s ease;
        }
        .match-tile:hover:not(:disabled) {
          border-color: var(--primary);
          background: #fff7ed;
          transform: translateY(-1px);
        }
        .match-tile.selected {
          border-color: var(--secondary);
          background: var(--secondary-light);
          color: var(--secondary);
        }
        .match-tile.matched {
          background: #ecfdf5;
          border-color: #10b981;
          color: #065f46;
          opacity: 0.8;
        }
        .match-tile.wrong {
          background: #fef2f2;
          border-color: #ef4444;
          color: #ef4444;
        }
        .matched-icon {
          color: #10b981;
        }
        .match-completion-box {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 18px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }
        .sparkle-icon {
          color: #10b981;
        }
      `}</style>
    </div>
  );
};

export default MatchPairs;
