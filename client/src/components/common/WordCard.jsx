import React, { useState } from 'react';
import { Heart, BookOpen, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import AudioButton from './AudioButton';
import { toggleFavoriteWord, updateSRSWord } from '../../services/api';
import { useApp } from '../../context/AppContext';

const WordCard = ({ item, onFavoriteToggle = null }) => {
  const { language, t } = useApp();
  const [isFavorite, setIsFavorite] = useState(Boolean(item.is_favorite));
  const [showDetails, setShowDetails] = useState(false);
  const [srsBox, setSrsBox] = useState(item.srs_box || 'new');

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      const nextFav = !isFavorite;
      setIsFavorite(nextFav);
      await toggleFavoriteWord(item.id);
      if (onFavoriteToggle) onFavoriteToggle(item.id, nextFav);
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const getSRSBadgeColor = (box) => {
    switch (box) {
      case 'mastered':
        return 'badge-green';
      case 'reviewing':
        return 'badge-indigo';
      case 'learning':
        return 'badge-amber';
      default:
        return 'badge-primary';
    }
  };

  const getSRSBadgeText = (box) => {
    if (language === 'en') {
      switch (box) {
        case 'mastered': return 'Mastered';
        case 'reviewing': return 'Reviewing';
        case 'learning': return 'Learning';
        default: return 'New';
      }
    } else if (language === 'hi') {
      switch (box) {
        case 'mastered': return 'पक्का याद (Mastered)';
        case 'reviewing': return 'रिवीजन (Reviewing)';
        case 'learning': return 'सीख रहे हैं (Learning)';
        default: return 'नया (New)';
      }
    } else {
      switch (box) {
        case 'mastered': return 'पक्के झाले (Mastered)';
        case 'reviewing': return 'उजळणी (Reviewing)';
        case 'learning': return 'शिकत आहे (Learning)';
        default: return 'नवीन (New)';
      }
    }
  };

  return (
    <div className={`word-card-container glass-card hover-lift ${item.is_difficult ? 'difficult-border' : ''}`}>
      {/* Top Meta Bar */}
      <div className="card-top-bar">
        <div className="card-tags">
          <span className={`badge ${getSRSBadgeColor(srsBox)}`}>
            {getSRSBadgeText(srsBox)}
          </span>
          <span className="badge badge-primary">{item.type || 'noun'}</span>
          {item.category && <span className="category-tag">{item.category}</span>}
          {item.is_difficult && <span className="badge badge-red">{t.difficultBadge}</span>}
        </div>

        <button
          className={`fav-button ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          aria-label="Toggle Favorite"
        >
          <Heart size={20} className={isFavorite ? 'heart-filled' : ''} />
        </button>
      </div>

      {/* Main Vocabulary Presentation */}
      <div className="card-main-body">
        <div className="word-header-row">
          <div className="english-title-group">
            <h3 className="english-word">{item.word}</h3>
            <span className="phonetic-pronunciation">/{item.pronunciation}/</span>
          </div>
          <AudioButton text={item.word} lang="en-US" label="Listen" />
        </div>

        {/* Trilingual Meanings Grid */}
        <div className="meanings-grid">
          {language === 'hi' ? (
            <>
              <div className="meaning-item primary-marathi">
                <span className="lang-indicator">हिंदी</span>
                <span className="meaning-text">{item.hindi || item.marathi}</span>
              </div>
              <div className="meaning-item secondary-hindi">
                <span className="lang-indicator">मराठी</span>
                <span className="meaning-text">{item.marathi}</span>
              </div>
            </>
          ) : (
            <>
              <div className="meaning-item primary-marathi">
                <span className="lang-indicator">मराठी</span>
                <span className="meaning-text">{item.marathi}</span>
              </div>
              <div className="meaning-item secondary-hindi">
                <span className="lang-indicator">हिंदी</span>
                <span className="meaning-text">{item.hindi}</span>
              </div>
            </>
          )}
        </div>

        {/* Verb Conjugations (V1, V2, V3, V-ing) if verb */}
        {(item.v1 || item.v2 || item.v3) && (
          <div className="verb-forms-pill-row">
            <span className="verb-chip"><b>V1:</b> {item.v1 || item.word}</span>
            <span className="verb-chip"><b>V2:</b> {item.v2}</span>
            <span className="verb-chip"><b>V3:</b> {item.v3}</span>
            {item.ving && <span className="verb-chip"><b>V-ing:</b> {item.ving}</span>}
          </div>
        )}

        {/* Example Sentences Dropdown */}
        {item.examples && item.examples.length > 0 && (
          <div className="examples-section">
            <button
              className="toggle-examples-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span>{showDetails ? t.hideExamplesBtn : t.viewExamplesBtn}</span>
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showDetails && (
              <div className="examples-list">
                {item.examples.map((ex, idx) => (
                  <div key={idx} className="example-item-box">
                    <div className="example-en-row">
                      <p className="example-en">"{ex.english}"</p>
                      <AudioButton text={ex.english} size={15} />
                    </div>
                    <p className="example-mr">मराठी: {ex.marathi}</p>
                    <p className="example-hi">हिंदी: {ex.hindi}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .word-card-container {
          padding: 18px;
          border-radius: var(--radius-md);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 14px;
          border: 1px solid var(--border-color);
          min-width: 0;
          word-break: break-word;
        }
        .word-card-container.difficult-border {
          border-left: 4px solid var(--accent-red);
        }
        .card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .card-tags {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }
        .category-tag {
          font-size: 0.76rem;
          color: var(--text-muted);
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 600;
        }
        .fav-button {
          padding: 6px;
          border-radius: 50%;
          color: #94a3b8;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          cursor: pointer;
          flex-shrink: 0;
        }
        .fav-button:hover {
          color: #ef4444;
          background: #fee2e2;
        }
        .fav-button.active {
          color: #ef4444;
        }
        .heart-filled {
          fill: #ef4444;
        }
        .word-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .english-title-group {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .english-word {
          font-size: clamp(1.2rem, 3vw, 1.35rem);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.3px;
        }
        .phonetic-pronunciation {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--primary);
        }
        .meanings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }
        @media (max-width: 500px) {
          .meanings-grid {
            grid-template-columns: 1fr;
          }
        }
        .meaning-item {
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .meaning-item.primary-marathi {
          background: #fff7ed;
          border: 1px solid #ffedd5;
        }
        .meaning-item.secondary-hindi {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .lang-indicator {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .meaning-text {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
        }
        .verb-forms-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          padding: 8px 12px;
          background: #f1f5f9;
          border-radius: var(--radius-sm);
        }
        .verb-chip {
          font-size: 0.8rem;
          color: #334155;
        }
        .examples-section {
          margin-top: 6px;
        }
        .toggle-examples-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--secondary);
          padding: 4px 0;
        }
        .toggle-examples-btn:hover {
          color: var(--secondary-hover);
        }
        .examples-list {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .example-item-box {
          background: #f8fafc;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--secondary);
          font-size: 0.88rem;
        }
        .example-en-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
        }
        .example-mr {
          color: #334155;
          margin-top: 3px;
        }
        .example-hi {
          color: #64748b;
          font-size: 0.82rem;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

export default WordCard;
