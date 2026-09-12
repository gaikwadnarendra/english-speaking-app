import React, { useState, useEffect } from 'react';
import { Heart, Brain, AlertTriangle, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import WordCard from '../components/common/WordCard';
import { fetchVocab } from '../services/api';
import { useApp } from '../context/AppContext';

const Favorites = () => {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites', 'difficult', 'srs'
  const [activeSRSBox, setActiveSRSBox] = useState('all'); // 'all', 'new', 'learning', 'reviewing', 'mastered'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab === 'favorites') {
        params.favorite = 'true';
      } else if (activeTab === 'difficult') {
        params.difficult = 'true';
      } else if (activeTab === 'srs') {
        if (activeSRSBox !== 'all') {
          params.srs_box = activeSRSBox;
        }
      }

      const res = await fetchVocab(params);
      if (res.data?.data) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, activeSRSBox]);

  const srsBoxes = [
    { id: 'all', label: t.allBoxes },
    { id: 'new', label: t.boxNew },
    { id: 'learning', label: t.boxLearning },
    { id: 'reviewing', label: t.boxReviewing },
    { id: 'mastered', label: t.boxMastered }
  ];

  return (
    <div className="favorites-page-container">
      {/* Header */}
      <div className="favorites-header-block">
        <div>
          <h2 className="page-main-title">{t.favPageTitle}</h2>
          <p className="page-main-subtitle">
            {t.favPageSub}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="fav-tab-controls">
          <button
            className={`fav-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={16} />
            <span>{t.savedTab}</span>
          </button>
          <button
            className={`fav-tab ${activeTab === 'difficult' ? 'active' : ''}`}
            onClick={() => setActiveTab('difficult')}
          >
            <AlertTriangle size={16} />
            <span>{t.difficultTab}</span>
          </button>
          <button
            className={`fav-tab ${activeTab === 'srs' ? 'active' : ''}`}
            onClick={() => setActiveTab('srs')}
          >
            <Brain size={16} />
            <span>{t.srsBoxesTab}</span>
          </button>
        </div>
      </div>

      {/* SRS Box sub-selector if on SRS tab */}
      {activeTab === 'srs' && (
        <div className="srs-box-selector-row glass-card">
          <span className="srs-label">{t.memoryLevelLabel}</span>
          <div className="srs-pills-wrap">
            {srsBoxes.map((box) => (
              <button
                key={box.id}
                className={`srs-pill ${activeSRSBox === box.id ? 'active' : ''}`}
                onClick={() => setActiveSRSBox(box.id)}
              >
                {box.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Word Cards Grid */}
      {loading ? (
        <div className="loading-state">
          <p>{t.loadingWords}</p>
        </div>
      ) : items.length > 0 ? (
        <div className="favorites-cards-grid">
          {items.map((word) => (
            <WordCard key={word.id} item={word} onFavoriteToggle={loadData} />
          ))}
        </div>
      ) : (
        <div className="empty-state-box glass-card">
          <Heart size={44} className="empty-icon" />
          <h3>{t.noWordsHere}</h3>
          <p>{t.addWordsFromVocab}</p>
        </div>
      )}

      <style>{`
        .favorites-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .favorites-header-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .fav-tab-controls {
          display: flex;
          gap: 8px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-md);
          flex-wrap: wrap;
          width: 100%;
        }
        .fav-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.9rem;
          color: #475569;
          border: none;
          background: transparent;
          cursor: pointer;
          flex: 1 1 auto;
        }
        .fav-tab:hover {
          color: var(--primary);
        }
        .fav-tab.active {
          background: #ffffff;
          color: var(--primary-dark);
          box-shadow: var(--shadow-sm);
        }
        .srs-box-selector-row {
          padding: 14px 18px;
          border-radius: var(--radius-md);
          background: #ffffff;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .srs-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .srs-pills-wrap {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .srs-pill {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          background: #f1f5f9;
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          border: none;
          cursor: pointer;
        }
        .srs-pill:hover {
          background: #e2e8f0;
        }
        .srs-pill.active {
          background: var(--secondary);
          color: #ffffff;
        }
        .favorites-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Favorites;
