const { getDbStatus, getPool, memoryStore } = require('../config/db');

// GET /api/vocab
// Query params: search, category, type, level, favorite, difficult, srs_box, sort, page, limit
exports.getAllVocab = async (req, res) => {
  try {
    const { search, category, type, level, favorite, difficult, srs_box, sort, page, limit } = req.query;

    let list = [...memoryStore.vocab];

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(w =>
        (w.word && w.word.toLowerCase().includes(q)) ||
        (w.marathi && w.marathi.includes(q)) ||
        (w.hindi && w.hindi.includes(q)) ||
        (w.pronunciation && w.pronunciation.includes(q))
      );
    }
    if (category && category !== 'All') {
      list = list.filter(w => w.category && w.category.toLowerCase() === category.toLowerCase());
    }
    if (type && type !== 'all') {
      list = list.filter(w => w.type && w.type.toLowerCase() === type.toLowerCase());
    }
    if (level) {
      list = list.filter(w => w.level === parseInt(level, 10));
    }
    if (favorite === 'true') {
      list = list.filter(w => Boolean(w.is_favorite));
    }
    if (difficult === 'true') {
      list = list.filter(w => Boolean(w.is_difficult));
    }
    if (srs_box) {
      list = list.filter(w => w.srs_box === srs_box);
    }

    if (sort === 'az') {
      list.sort((a, b) => (a.word || '').localeCompare(b.word || ''));
    } else if (sort === 'za') {
      list.sort((a, b) => (b.word || '').localeCompare(a.word || ''));
    } else {
      list.sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    const totalCount = list.length;

    // Optional pagination support
    if (limit) {
      const l = parseInt(limit, 10);
      const p = parseInt(page || '1', 10);
      const start = (p - 1) * l;
      list = list.slice(start, start + l);
    }

    res.json({
      success: true,
      count: totalCount,
      returnedCount: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/vocab/categories
exports.getCategories = async (req, res) => {
  const categories = [
    'All',
    'Food & Daily',
    'Home',
    'Family & Social',
    'Education',
    'Time & Weather',
    'Shopping & Money',
    'Hospital & Health',
    'Work & Office',
    'Travel & Transport',
    'Technology',
    'Emotions',
    'Common Actions'
  ];
  res.json({ success: true, data: categories });
};

// POST /api/vocab/:id/toggle-favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { isConnected, isMySQLConnected } = getDbStatus();

    let newFavState = false;
    const item = memoryStore.vocab.find(v => v.id === id);
    if (item) {
      item.is_favorite = !item.is_favorite;
      newFavState = item.is_favorite;
    }

    if (isConnected || isMySQLConnected) {
      const pool = getPool();
      if (pool) {
        await pool.query('UPDATE vocabularies SET is_favorite = ? WHERE id = ?', [Boolean(newFavState), id]).catch(() => {});
      }
    }

    return res.json({ success: true, is_favorite: Boolean(newFavState) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
