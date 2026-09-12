import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Filter, BookMarked, ArrowDownAZ, Heart, RotateCcw, LayoutGrid, Layers, Volume2, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Trophy, Sparkles, ChevronDown } from 'lucide-react';
import WordCard from '../components/common/WordCard';
import AudioButton from '../components/common/AudioButton';
import { fetchVocab, fetchCategories, updateSRSWord } from '../services/api';
import { speakText } from '../utils/ttsHelper';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';

const Vocabulary = () => {
  const { t, language, soundSpeed, setSoundSpeed } = useApp();
  const { completeTask, isTaskCompleted, currentLevel } = useProgress();
  const [allVocab, setAllVocab] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [difficultOnly, setDifficultOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'flashcards'
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(36);

  // Initial load: fetch master vocab and categories once immediately without artificial debounce
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [catRes, vocabRes] = await Promise.allSettled([
          fetchCategories(),
          fetchVocab({})
        ]);

        if (isMounted) {
          if (catRes.status === 'fulfilled' && catRes.value?.data?.data) {
            setCategories(catRes.value.data.data);
          }
          if (vocabRes.status === 'fulfilled' && vocabRes.value?.data?.data) {
            setAllVocab(vocabRes.value.data.data);
          }
        }
      } catch (err) {
        console.warn('Vocab load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();
    return () => { isMounted = false; };
  }, []);

  // Instant 0ms In-Memory Filtering via useMemo
  const filteredVocab = useMemo(() => {
    let list = allVocab;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(w =>
        (w.word && w.word.toLowerCase().includes(q)) ||
        (w.marathi && w.marathi.includes(q)) ||
        (w.hindi && w.hindi.includes(q)) ||
        (w.pronunciation && w.pronunciation.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter(w => w.category === selectedCategory);
    }

    // Word type filter
    if (selectedType && selectedType !== 'all') {
      list = list.filter(w => w.type === selectedType);
    }

    // Level filter
    if (selectedLevel && selectedLevel !== 'all') {
      const lvl = parseInt(selectedLevel, 10);
      list = list.filter(w => w.level === lvl);
    }

    // Favorites filter
    if (favoritesOnly) {
      list = list.filter(w => w.is_favorite);
    }

    // Difficult filter
    if (difficultOnly) {
      list = list.filter(w => w.is_difficult);
    }

    // Sorting
    if (sortOrder === 'az') {
      list = [...list].sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortOrder === 'za') {
      list = [...list].sort((a, b) => b.word.localeCompare(a.word));
    }

    return list;
  }, [allVocab, searchQuery, selectedCategory, selectedType, selectedLevel, sortOrder, favoritesOnly, difficultOnly]);

  // Reset pagination on filter changes
  useEffect(() => {
    setVisibleCount(36);
  }, [searchQuery, selectedCategory, selectedType, selectedLevel, sortOrder, favoritesOnly, difficultOnly]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('all');
    setSelectedLevel('all');
    setSortOrder('default');
    setFavoritesOnly(false);
    setDifficultOnly(false);
  };

  const handleFavoriteToggle = (id, newFavState) => {
    setAllVocab(prev => prev.map(item => item.id === id ? { ...item, is_favorite: newFavState } : item));
  };

  const handleFlashcardAnswer = async (isCorrect) => {
    const currentWord = filteredVocab[flashcardIndex];
    if (currentWord) {
      try {
        await updateSRSWord({ vocabId: currentWord.id, isCorrect });
      } catch (e) {
        console.warn('SRS update error:', e);
      }
    }
    setIsFlipped(false);
    if (flashcardIndex < filteredVocab.length - 1) {
      setFlashcardIndex(prev => prev + 1);
    } else {
      setFlashcardIndex(0);
    }
  };

  const currentFlashcard = filteredVocab[flashcardIndex] || filteredVocab[0];
  const visibleWords = useMemo(() => filteredVocab.slice(0, visibleCount), [filteredVocab, visibleCount]);

  return (
    <div className="vocab-page-container">
      {/* Header */}
      <div className="vocab-header-block">
        <div>
          <h2 className="page-main-title">{t.vocabPageTitle}</h2>
          <p className="page-main-subtitle">
            {t.vocabPageSub}
          </p>
        </div>

        <div className="header-actions-cluster">
          {/* View Mode Switcher: Grid vs Flashcards */}
          <div className="view-mode-toggle-group">
            <button
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={16} />
              <span>{t.cardsView}</span>
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'flashcards' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('flashcards');
                setFlashcardIndex(0);
                setIsFlipped(false);
              }}
            >
              <Layers size={16} />
              <span>{t.flashcardsMode}</span>
            </button>
          </div>

          <div className="total-vocab-badge">
            <BookMarked size={18} />
            <span>{filteredVocab.length} {t.wordsAvailable}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="search-filter-panel glass-card">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input-field"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="filter-controls-row">
          {/* Word Type Filter */}
          <select
            className="filter-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">{t.allTypes}</option>
            <option value="noun">{t.nounType}</option>
            <option value="verb">{t.verbType}</option>
            <option value="adjective">{t.adjType}</option>
          </select>

          {/* Level Filter */}
          <select
            className="filter-select"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">{t.allLevels}</option>
            <option value="1">{t.levelBeginner}</option>
            <option value="2">{t.levelIntermediate}</option>
            <option value="3">{t.levelAdvanced}</option>
          </select>

          {/* Sort Order */}
          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">{t.sortDefault}</option>
            <option value="az">{t.sortAZ}</option>
            <option value="za">{t.sortZA}</option>
          </select>

          {/* Speech Speed Pill */}
          <button
            className="speed-toggle-pill"
            onClick={() => setSoundSpeed(soundSpeed === 1.0 ? 0.8 : 1.0)}
            title="Audio Speed"
          >
            <Volume2 size={15} />
            <span>{soundSpeed === 0.8 ? t.soundSpeedSlow : t.soundSpeedNormal}</span>
          </button>

          {/* Favorites Only Toggle */}
          <button
            className={`fav-filter-btn ${favoritesOnly ? 'active' : ''}`}
            onClick={() => setFavoritesOnly(!favoritesOnly)}
          >
            <Heart size={16} className={favoritesOnly ? 'heart-filled' : ''} />
            <span>{t.favOnly}</span>
          </button>

          {/* Difficult Only Toggle */}
          <button
            className={`diff-filter-btn ${difficultOnly ? 'active' : ''}`}
            onClick={() => setDifficultOnly(!difficultOnly)}
          >
            <AlertCircle size={16} />
            <span>{t.difficultOnly}</span>
          </button>

          {/* Reset Filters */}
          <button className="btn-outline reset-btn" onClick={resetFilters} title={t.resetFilters}>
            <RotateCcw size={16} />
            <span>{t.resetFilters}</span>
          </button>
        </div>

        {/* Category Filter Chips Carousel */}
        <div className="category-chips-scroll">
          <button
            className={`category-chip cat-chip ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            {t.allTypes}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip cat-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>{t.loadingWords}</p>
        </div>
      ) : filteredVocab.length === 0 ? (
        <div className="empty-state-box glass-card">
          <BookMarked size={48} className="empty-icon" />
          <h3>{t.noWordsFound}</h3>
          <p>{t.tryAnotherSearch}</p>
          <button className="btn-primary" onClick={resetFilters}>
            <span>{t.showAllWords}</span>
          </button>
        </div>
      ) : viewMode === 'flashcards' ? (
        /* Flashcard Study Deck View */
        <div className="flashcard-deck-container">
          <div className="flashcard-progress-bar-wrap">
            <div className="flashcard-progress-info">
              <span>{t.questionWord} {flashcardIndex + 1} / {filteredVocab.length}</span>
              <span>{currentFlashcard?.category}</span>
            </div>
            <div className="flashcard-progress-track">
              <div
                className="flashcard-progress-fill"
                style={{ width: `${((flashcardIndex + 1) / filteredVocab.length) * 100}%` }}
              />
            </div>
          </div>

          {currentFlashcard && (
            <div
              className={`flashcard-3d-card glass-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {!isFlipped ? (
                /* Front of Flashcard */
                <div className="flashcard-face flashcard-front">
                  <span className="flashcard-category-badge">{currentFlashcard.category}</span>
                  <h2 className="flashcard-word-title">{currentFlashcard.word}</h2>
                  <p className="flashcard-phonetic">/{currentFlashcard.pronunciation}/</p>
                  <div className="flashcard-audio-btn-row" onClick={(e) => e.stopPropagation()}>
                    <AudioButton text={currentFlashcard.word} label="Speak" size={18} />
                  </div>
                  <p className="flashcard-flip-prompt">{t.flipCardHint}</p>
                </div>
              ) : (
                /* Back of Flashcard */
                <div className="flashcard-face flashcard-back">
                  <span className="flashcard-type-tag">{currentFlashcard.type}</span>
                  <div className="flashcard-meaning-block">
                    <div className="meaning-line-mr">
                      <span className="meaning-label">मराठी:</span>
                      <span className="meaning-text">{currentFlashcard.marathi}</span>
                    </div>
                    <div className="meaning-line-hi">
                      <span className="meaning-label">हिंदी:</span>
                      <span className="meaning-text">{currentFlashcard.hindi}</span>
                    </div>
                  </div>

                  {currentFlashcard.examples && currentFlashcard.examples.length > 0 && (
                    <div className="flashcard-example-box" onClick={(e) => e.stopPropagation()}>
                      <p className="example-en">"{currentFlashcard.examples[0].en}"</p>
                      <p className="example-mr">{language === 'hi' ? currentFlashcard.examples[0].hi : currentFlashcard.examples[0].mr}</p>
                      <AudioButton text={currentFlashcard.examples[0].en} size={14} />
                    </div>
                  )}

                  <p className="flashcard-flip-prompt">{t.flipCardHint}</p>
                </div>
              )}
            </div>
          )}

          {/* Flashcard Action Buttons */}
          <div className="flashcard-controls-cluster">
            <button
              className="btn-outline flashcard-nav-btn"
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex(prev => (prev > 0 ? prev - 1 : filteredVocab.length - 1));
              }}
            >
              <ArrowLeft size={16} />
              <span>{t.prevBtn}</span>
            </button>

            <button
              className="flashcard-review-btn"
              onClick={() => handleFlashcardAnswer(false)}
            >
              <RotateCcw size={16} />
              <span>{t.needPracticeBtn}</span>
            </button>

            <button
              className="flashcard-master-btn"
              onClick={() => handleFlashcardAnswer(true)}
            >
              <CheckCircle2 size={16} />
              <span>{t.knowItBtn}</span>
            </button>

            <button
              className="btn-primary flashcard-nav-btn"
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex(prev => (prev < filteredVocab.length - 1 ? prev + 1 : 0));
              }}
            >
              <span>{t.nextBtn}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Regular Vocabulary Cards Grid with progressive rendering */
        <>
          <div className="vocab-cards-grid vocab-grid">
            {visibleWords.map((item) => (
              <WordCard key={item.id} item={item} onFavoriteToggle={handleFavoriteToggle} />
            ))}
          </div>

          {/* Smooth Load More if more words available */}
          {visibleCount < filteredVocab.length && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              <button
                className="btn-outline"
                style={{ padding: '12px 28px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px' }}
                onClick={() => setVisibleCount(prev => prev + 36)}
              >
                <span>{language === 'hi' ? `और शब्द लोड करें (${filteredVocab.length - visibleCount} शेष)` : language === 'en' ? `Load More Words (${filteredVocab.length - visibleCount} remaining)` : `आणखी शब्द लोड करा (${filteredVocab.length - visibleCount} शिल्लक)`}</span>
                <ChevronDown size={18} />
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        .vocab-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .vocab-header-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .total-vocab-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: var(--primary-light);
          color: var(--primary-dark);
          font-weight: 700;
          font-size: 0.9rem;
        }
        .search-filter-panel {
          padding: 16px 20px;
          background: #ffffff;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        @media (max-width: 480px) {
          .search-filter-panel {
            padding: 12px 14px;
            gap: 10px;
          }
        }
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }
        .search-input-field {
          width: 100%;
          padding: 12px 40px 12px 42px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          background: #f8fafc;
          font-size: 0.98rem;
          color: var(--text-main);
          outline: none;
          transition: all 0.2s ease;
        }
        .search-input-field:focus {
          border-color: var(--primary);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
        }
        .clear-search-btn {
          position: absolute;
          right: 14px;
          color: var(--text-muted);
          font-size: 1rem;
        }
        .filter-controls-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .filter-select {
          padding: 7px 12px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-color);
          background: #ffffff;
          color: var(--text-main);
          font-weight: 600;
          font-size: 0.85rem;
          outline: none;
        }
        @media (max-width: 600px) {
          .filter-select {
            flex: 1 1 calc(50% - 6px);
            min-width: 130px;
          }
        }
        .filter-select:focus {
          border-color: var(--primary);
        }
        .fav-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-color);
          background: #ffffff;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .fav-filter-btn.active {
          border-color: #ef4444;
          background: #fee2e2;
          color: #ef4444;
        }
        .fav-filter-btn.active .heart-filled {
          fill: #ef4444;
        }
        .category-chips-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .category-chips-scroll::-webkit-scrollbar {
          display: none;
        }
        .category-chip {
          padding: 5px 12px;
          border-radius: var(--radius-full);
          background: #f1f5f9;
          color: #475569;
          font-weight: 600;
          font-size: 0.82rem;
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .category-chip:hover {
          background: #e2e8f0;
        }
        .category-chip.active {
          background: var(--primary);
          color: #ffffff;
        }
        .header-actions-cluster {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .view-mode-toggle-group {
          display: flex;
          background: #f1f5f9;
          padding: 3px;
          border-radius: var(--radius-sm);
          gap: 4px;
        }
        .view-mode-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.82rem;
          color: #64748b;
          transition: all 0.2s ease;
        }
        .view-mode-btn.active {
          background: #ffffff;
          color: var(--primary-dark);
          box-shadow: var(--shadow-sm);
        }
        .speed-toggle-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 10px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-color);
          background: #ffffff;
          font-weight: 700;
          font-size: 0.82rem;
          color: #0284c7;
          white-space: nowrap;
        }
        .diff-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-color);
          background: #ffffff;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .diff-filter-btn.active {
          border-color: #f59e0b;
          background: #fef3c7;
          color: #b45309;
        }
        /* Flashcard 3D Deck Styles */
        .flashcard-deck-container {
          max-width: 620px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .flashcard-progress-bar-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .flashcard-progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .flashcard-progress-track {
          height: 8px;
          background: #e2e8f0;
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .flashcard-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transition: width 0.3s ease;
        }
        .flashcard-3d-card {
          min-height: 320px;
          padding: 36px 28px;
          border-radius: var(--radius-lg);
          background: #ffffff;
          border: 2px solid var(--border-color);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
        }
        .flashcard-3d-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }
        .flashcard-face {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .flashcard-category-badge {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          background: var(--primary-light);
          color: var(--primary-dark);
          padding: 4px 12px;
          border-radius: var(--radius-full);
        }
        .flashcard-word-title {
          font-size: 2.4rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .flashcard-phonetic {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--secondary);
        }
        .flashcard-type-tag {
          font-size: 0.82rem;
          font-weight: 700;
          background: #f1f5f9;
          color: #475569;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
        }
        .flashcard-meaning-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          background: #f8fafc;
          padding: 16px 24px;
          border-radius: var(--radius-md);
          width: 100%;
        }
        .meaning-line-mr {
          color: #9a3412;
        }
        .meaning-line-hi {
          color: #1e293b;
        }
        .meaning-label {
          font-size: 0.9rem;
          color: #64748b;
          margin-right: 8px;
        }
        .flashcard-example-box {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 14px 18px;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          width: 100%;
        }
        .example-en {
          font-weight: 700;
          color: #065f46;
        }
        .example-mr {
          color: #047857;
          font-size: 0.88rem;
        }
        .flashcard-flip-prompt {
          font-size: 0.82rem;
          font-weight: 700;
          color: #94a3b8;
          margin-top: 10px;
        }
        .flashcard-controls-cluster {
          display: grid;
          grid-template-columns: 1fr 1.3fr 1.3fr 1fr;
          gap: 12px;
        }
        @media (max-width: 540px) {
          .flashcard-controls-cluster {
            grid-template-columns: 1fr 1fr;
          }
        }
        .flashcard-review-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: var(--radius-md);
          background: #fef2f2;
          color: #dc2626;
          border: 1.5px solid #fecaca;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .flashcard-review-btn:hover {
          background: #fee2e2;
        }
        .flashcard-master-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: var(--radius-md);
          background: #ecfdf5;
          color: #059669;
          border: 1.5px solid #a7f3d0;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .flashcard-master-btn:hover {
          background: #d1fae5;
        }
        .flashcard-nav-btn {
          padding: 12px;
          font-weight: 700;
        }
        .vocab-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 18px;
        }
        .empty-state-box {
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .empty-icon {
          color: var(--text-muted);
        }
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px;
          color: var(--text-muted);
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ===== Level Progression Banner ===== */}
      <div style={{
        marginTop: '24px', padding: '20px 24px',
        background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
        borderRadius: '14px', border: '1.5px solid #fed7aa',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>📝</span>
          <div>
            <p style={{ fontWeight: 800, color: '#92400e', fontSize: '0.95rem', marginBottom: '2px' }}>
              Vocabulary Task — Level {currentLevel}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#b45309' }}>
              {isTaskCompleted(1, 'vocab_l1') ? '✅ Level 1 vocab done!' :
               isTaskCompleted(3, 'vocab_advanced') ? '✅ Advanced vocab done!' :
               `Browse words and click "Mark Vocab Done" to complete this task`}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!isTaskCompleted(1, 'vocab_l1') && (
            <button
              onClick={() => completeTask(1, 'vocab_l1')}
              style={{
                padding: '10px 20px', background: '#f97316', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark Level 1 Vocab Done
            </button>
          )}
          {!isTaskCompleted(3, 'vocab_advanced') && (
            <button
              onClick={() => completeTask(3, 'vocab_advanced')}
              style={{
                padding: '10px 20px', background: '#8b5cf6', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark Advanced Vocab Done
            </button>
          )}
          {!isTaskCompleted(5, 'vocab_master') && (
            <button
              onClick={() => completeTask(5, 'vocab_master')}
              style={{
                padding: '10px 20px', background: '#ef4444', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark Master Vocab Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;
