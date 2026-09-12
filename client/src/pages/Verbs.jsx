import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Search, LayoutGrid, Table as TableIcon, HelpCircle, CheckCircle2, RotateCcw, ArrowRight, Volume2, Trophy } from 'lucide-react';
import AudioButton from '../components/common/AudioButton';
import { fetchVerbs } from '../services/api';
import { speakText } from '../utils/ttsHelper';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';

const Verbs = () => {
  const { t, language, soundSpeed } = useApp();
  const { completeTask, isTaskCompleted } = useProgress();
  const [allVerbs, setAllVerbs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [verbTypeFilter, setVerbTypeFilter] = useState('all'); // 'all', 'regular', 'irregular'
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'quiz'
  const [loading, setLoading] = useState(true);

  // Verb Quiz State
  const [quizVerbIndex, setQuizVerbIndex] = useState(0);
  const [quizReveal, setQuizReveal] = useState(false);
  const [userGuessV2, setUserGuessV2] = useState('');
  const [quizScore, setQuizScore] = useState(0);

  // Fetch master verbs list once on mount
  useEffect(() => {
    let isMounted = true;
    const loadVerbs = async () => {
      setLoading(true);
      try {
        const res = await fetchVerbs({});
        if (isMounted && res.data?.data) {
          setAllVerbs(res.data.data);
        }
      } catch (err) {
        console.warn('Verbs load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadVerbs();
    return () => { isMounted = false; };
  }, []);

  // Instant In-Memory 0ms Filtering
  const filteredVerbs = useMemo(() => {
    let list = allVerbs;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(v =>
        (v.english && v.english.toLowerCase().includes(q)) ||
        (v.marathi && v.marathi.includes(q)) ||
        (v.hindi && v.hindi.includes(q)) ||
        (v.pronunciation && v.pronunciation.toLowerCase().includes(q)) ||
        (v.v1 && v.v1.toLowerCase().includes(q)) ||
        (v.v2 && v.v2.toLowerCase().includes(q)) ||
        (v.v3 && v.v3.toLowerCase().includes(q))
      );
    }

    if (verbTypeFilter === 'regular') {
      list = list.filter(verb => verb.v2?.endsWith('ed') || verb.v3?.endsWith('ed'));
    } else if (verbTypeFilter === 'irregular') {
      list = list.filter(verb => !verb.v2?.endsWith('ed'));
    }

    return list;
  }, [allVerbs, searchQuery, verbTypeFilter]);

  const currentQuizVerb = filteredVerbs[quizVerbIndex] || filteredVerbs[0];

  const handleNextQuizVerb = () => {
    setQuizReveal(false);
    setUserGuessV2('');
    if (quizVerbIndex < filteredVerbs.length - 1) {
      setQuizVerbIndex(prev => prev + 1);
    } else {
      setQuizVerbIndex(0);
    }
  };

  return (
    <div className="verbs-page-container">
      {/* Header Block */}
      <div className="verbs-header-block">
        <div>
          <h2 className="page-main-title">{t.verbsPageTitle}</h2>
          <p className="page-main-subtitle">
            {t.verbsPageSub}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="view-toggle-pills">
          <button
            className={`toggle-pill-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid size={16} />
            <span>{t.cardsView}</span>
          </button>
          <button
            className={`toggle-pill-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <TableIcon size={16} />
            <span>{t.tableView}</span>
          </button>
          <button
            className={`toggle-pill-btn ${viewMode === 'quiz' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('quiz');
              setQuizVerbIndex(0);
              setQuizReveal(false);
            }}
          >
            <HelpCircle size={16} />
            <span>{t.verbTestTab}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="verbs-filter-bar glass-card">
        <div className="search-box-verbs">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-verbs-input"
            placeholder={t.searchVerbsPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Regular / Irregular Filter Pills */}
        <div className="verb-type-pills">
          <button
            className={`verb-type-pill ${verbTypeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setVerbTypeFilter('all')}
          >
            {t.allVerbsTab}
          </button>
          <button
            className={`verb-type-pill ${verbTypeFilter === 'irregular' ? 'active' : ''}`}
            onClick={() => setVerbTypeFilter('irregular')}
          >
            {t.irregularVerbs}
          </button>
          <button
            className={`verb-type-pill ${verbTypeFilter === 'regular' ? 'active' : ''}`}
            onClick={() => setVerbTypeFilter('regular')}
          >
            {t.regularVerbs}
          </button>
        </div>
      </div>

      {/* Verbs Presentation */}
      {loading ? (
        <div className="loading-state">
          <p>{t.loadingWords}</p>
        </div>
      ) : filteredVerbs.length === 0 ? (
        <div className="empty-state-box glass-card">
          <Zap size={48} className="empty-icon" />
          <h3>{t.noWordsFound}</h3>
          <p>{t.tryAnotherSearch}</p>
        </div>
      ) : viewMode === 'quiz' && currentQuizVerb ? (
        /* Interactive Verb Conjugation Drill */
        <div className="verb-quiz-container glass-card">
          <div className="verb-quiz-header">
            <span className="badge badge-primary">{t.verbTestTab} ({quizVerbIndex + 1} / {filteredVerbs.length})</span>
            <span className="verb-quiz-streak">{t.scoreSessionLabel}: {quizScore}</span>
          </div>

          <div className="verb-quiz-challenge-card">
            <div className="verb-quiz-prompt">
              <span className="prompt-label">Base Form (V1):</span>
              <h2 className="prompt-verb-title">{currentQuizVerb.english}</h2>
              <p className="prompt-meaning">
                {language === 'hi' ? currentQuizVerb.hindi : currentQuizVerb.marathi} ({currentQuizVerb.pronunciation})
              </p>
              <AudioButton text={currentQuizVerb.english} label="Listen V1" />
            </div>

            {/* Reveal Answer Section */}
            {!quizReveal ? (
              <div className="reveal-action-box">
                <p className="guess-question">What are the V2 (Past) and V3 (Past Participle) forms?</p>
                <button
                  className="btn-primary reveal-btn"
                  onClick={() => {
                    setQuizReveal(true);
                    setQuizScore(prev => prev + 1);
                    speakText(`${currentQuizVerb.v1}, ${currentQuizVerb.v2}, ${currentQuizVerb.v3}`, 'en-US', soundSpeed);
                  }}
                >
                  <span>Reveal Conjugations & Audio</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div className="revealed-conjugation-grid">
                <div className="revealed-col">
                  <span className="rev-label">V1 Base</span>
                  <span className="rev-val">{currentQuizVerb.v1}</span>
                  <AudioButton text={currentQuizVerb.v1} size={14} />
                </div>
                <div className="revealed-col highlight-col">
                  <span className="rev-label">V2 Past</span>
                  <span className="rev-val">{currentQuizVerb.v2}</span>
                  <AudioButton text={currentQuizVerb.v2} size={14} />
                </div>
                <div className="revealed-col highlight-col">
                  <span className="rev-label">V3 Past Part.</span>
                  <span className="rev-val">{currentQuizVerb.v3}</span>
                  <AudioButton text={currentQuizVerb.v3} size={14} />
                </div>
                <div className="revealed-col">
                  <span className="rev-label">V-ing</span>
                  <span className="rev-val">{currentQuizVerb.ving}</span>
                  <AudioButton text={currentQuizVerb.ving} size={14} />
                </div>
              </div>
            )}

            {currentQuizVerb.example_en && (
              <div className="verb-quiz-example">
                <p className="ex-text">"{currentQuizVerb.example_en}"</p>
                <p className="ex-trans">{language === 'hi' ? currentQuizVerb.example_hi : currentQuizVerb.example_mr}</p>
              </div>
            )}
          </div>

          <div className="verb-quiz-footer">
            <button className="btn-outline" onClick={handleNextQuizVerb}>
              <span>{t.nextQuestionBtn}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="verbs-cards-grid">
          {filteredVerbs.map((verb) => (
            <div key={verb.id} className="verb-item-card glass-card hover-lift">
              <div className="verb-card-header">
                <div className="verb-title-row">
                  <h3 className="verb-main-en">{verb.english}</h3>
                  <span className="verb-pron">/{verb.pronunciation}/</span>
                </div>
                <AudioButton text={verb.english} label="V1" />
              </div>

              <div className="verb-meanings-row">
                <div className="mr-box">मराठी: <b>{verb.marathi}</b></div>
                <div className="hi-box">हिंदी: <b>{verb.hindi}</b></div>
              </div>

              {/* V1, V2, V3, V-ing Grid */}
              <div className="conjugations-table-box">
                <div className="conj-col">
                  <span className="conj-label">V1 ({t.baseForm})</span>
                  <span className="conj-val">{verb.v1}</span>
                </div>
                <div className="conj-col">
                  <span className="conj-label">V2 ({t.pastForm})</span>
                  <span className="conj-val">{verb.v2}</span>
                </div>
                <div className="conj-col">
                  <span className="conj-label">V3 ({t.pastPartForm})</span>
                  <span className="conj-val">{verb.v3}</span>
                </div>
                <div className="conj-col">
                  <span className="conj-label">V-ing ({t.vingForm})</span>
                  <span className="conj-val">{verb.ving}</span>
                </div>
              </div>

              {/* Real Sentence Usage */}
              {verb.example_en && (
                <div className="verb-example-box">
                  <div className="ex-en-row">
                    <span>"{verb.example_en}"</span>
                    <AudioButton text={verb.example_en} size={14} />
                  </div>
                  <p className="ex-mr">मराठी: {verb.example_mr}</p>
                  {verb.example_hi && <p className="ex-hi">हिंदी: {verb.example_hi}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="verbs-table-wrapper glass-card">
          <table className="verbs-data-table">
            <thead>
              <tr>
                <th>English</th>
                <th>मराठी अर्थ</th>
                <th>हिंदी अर्थ</th>
                <th>V1</th>
                <th>V2</th>
                <th>V3</th>
                <th>V-ing</th>
                <th>{t.exampleSentenceHeader}</th>
              </tr>
            </thead>
            <tbody>
              {filteredVerbs.map((verb) => (
                <tr key={verb.id}>
                  <td className="font-bold">{verb.english}</td>
                  <td className="text-marathi">{verb.marathi}</td>
                  <td className="text-hindi">{verb.hindi}</td>
                  <td><span className="badge badge-primary">{verb.v1}</span></td>
                  <td><span className="badge badge-indigo">{verb.v2}</span></td>
                  <td><span className="badge badge-green">{verb.v3}</span></td>
                  <td><span className="badge badge-amber">{verb.ving}</span></td>
                  <td>
                    <AudioButton text={verb.english} size={15} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .verbs-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .verbs-header-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .view-toggle-pills {
          display: flex;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-sm);
          flex-wrap: wrap;
        }
        .toggle-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.85rem;
          color: #64748b;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .toggle-pill-btn.active {
          background: #ffffff;
          color: var(--primary-dark);
          box-shadow: var(--shadow-sm);
        }
        .verbs-filter-bar {
          padding: 16px 20px;
          border-radius: var(--radius-md);
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .search-box-verbs {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1.5px solid var(--border-color);
          padding: 4px 14px;
          border-radius: var(--radius-md);
          flex: 1;
          min-width: 240px;
        }
        .search-verbs-input {
          width: 100%;
          padding: 8px 10px;
          border: none;
          outline: none;
          font-size: 0.95rem;
          background: transparent;
        }
        .verb-type-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .verb-type-pill {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: #f1f5f9;
          color: #475569;
          font-weight: 700;
          font-size: 0.85rem;
          border: 1.5px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .verb-type-pill:hover {
          background: #e2e8f0;
        }
        .verb-type-pill.active {
          background: var(--primary-light);
          color: var(--primary-dark);
          border-color: var(--primary);
        }
        .verbs-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          width: 100%;
        }
        .verb-item-card {
          padding: 18px;
          border-radius: var(--radius-md);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 14px;
          border: 1px solid var(--border-color);
        }
        .verb-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .verb-title-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .verb-main-en {
          font-size: clamp(1.2rem, 3vw, 1.4rem);
          font-weight: 800;
          color: #0f172a;
        }
        .verb-pron {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--secondary);
        }
        .verb-meanings-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 0.9rem;
        }
        .mr-box {
          background: #fff7ed;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          color: #9a3412;
          word-break: break-word;
        }
        .hi-box {
          background: #f8fafc;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          color: #334155;
          word-break: break-word;
        }
        .conjugations-table-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          background: #f8fafc;
          padding: 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        .conj-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2px;
          min-width: 0;
        }
        .conj-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .conj-val {
          font-size: clamp(0.8rem, 2vw, 0.92rem);
          font-weight: 800;
          color: #0f172a;
          word-break: break-all;
        }
        .verb-example-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
        }
        .ex-en-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
          color: #14532d;
          gap: 8px;
        }
        .ex-mr {
          color: #166534;
          margin-top: 3px;
        }
        .ex-hi {
          color: #15803d;
          margin-top: 2px;
        }
        .verbs-table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-color);
          width: 100%;
        }
        .verbs-data-table {
          width: 100%;
          min-width: 650px;
          border-collapse: collapse;
          text-align: left;
        }
        .verbs-data-table th, .verbs-data-table td {
          padding: 12px 14px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.9rem;
        }
        .verbs-data-table th {
          background: #f8fafc;
          font-weight: 700;
          color: var(--text-muted);
        }

        /* Verb Quiz Drill Styles */
        .verb-quiz-container {
          max-width: 680px;
          margin: 0 auto;
          width: 100%;
          padding: clamp(16px, 4vw, 28px);
          border-radius: var(--radius-lg);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .verb-quiz-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .verb-quiz-streak {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--primary-dark);
        }
        .verb-quiz-challenge-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          text-align: center;
          padding: 10px 0;
          width: 100%;
        }
        .verb-quiz-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .prompt-label {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .prompt-verb-title {
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          font-weight: 900;
          color: #0f172a;
        }
        .prompt-meaning {
          font-size: clamp(1rem, 3vw, 1.15rem);
          font-weight: 700;
          color: #9a3412;
        }
        .reveal-action-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
          width: 100%;
        }
        .guess-question {
          font-size: 1.05rem;
          font-weight: 700;
          color: #334155;
        }
        .revealed-conjugation-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          width: 100%;
          margin-top: 10px;
        }
        @media (max-width: 580px) {
          .revealed-conjugation-grid {
            grid-template-columns: 1fr 1fr;
          }
          .verbs-filter-bar {
            padding: 12px 14px;
          }
          .search-box-verbs {
            min-width: 100%;
          }
          .verb-type-pills {
            width: 100%;
          }
          .verb-type-pill {
            flex: 1;
            text-align: center;
            padding: 7px 10px;
            font-size: 0.8rem;
          }
          .view-toggle-pills {
            width: 100%;
          }
          .toggle-pill-btn {
            flex: 1;
            justify-content: center;
          }
        }
        .revealed-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 8px;
          border-radius: var(--radius-md);
          background: #f8fafc;
          border: 1.5px solid var(--border-color);
          min-width: 0;
        }
        .revealed-col.highlight-col {
          background: #ecfdf5;
          border-color: #10b981;
        }
        .rev-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .rev-val {
          font-size: clamp(1rem, 3vw, 1.25rem);
          font-weight: 800;
          color: #0f172a;
          word-break: break-all;
        }
        .verb-quiz-example {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          width: 100%;
          text-align: left;
        }
        .ex-text {
          font-weight: 700;
          color: #14532d;
        }
        .ex-trans {
          font-size: 0.88rem;
          color: #166534;
          margin-top: 2px;
        }
        .verb-quiz-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }
      `}</style>

      {/* ===== Level Progression Banner ===== */}
      <div style={{
        marginTop: '20px', padding: '18px 22px',
        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
        borderRadius: '14px', border: '1.5px solid #bfdbfe',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>⚡</span>
          <div>
            <p style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.95rem', marginBottom: '2px' }}>
              Verbs Progress Task
            </p>
            <p style={{ fontSize: '0.82rem', color: '#3b82f6' }}>
              Study verbs to unlock higher levels
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!isTaskCompleted(2, 'verbs_basic') && (
            <button
              onClick={() => completeTask(2, 'verbs_basic')}
              style={{
                padding: '10px 20px', background: '#3b82f6', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark Basic Verbs Done
            </button>
          )}
          {!isTaskCompleted(3, 'verbs_quiz') && (
            <button
              onClick={() => completeTask(3, 'verbs_quiz')}
              style={{
                padding: '10px 20px', background: '#8b5cf6', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              <Trophy size={16} /> Mark Verb Quiz Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verbs;
