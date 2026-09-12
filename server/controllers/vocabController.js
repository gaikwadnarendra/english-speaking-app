const { getDbStatus, getPool, memoryStore } = require('../config/db');

// GET /api/vocab
// Query params: search, category, type, level, favorite, difficult, srs_box, sort
exports.getAllVocab = async (req, res) => {
  try {
    const { search, category, type, level, favorite, difficult, srs_box, sort } = req.query;
    const { isMySQLConnected } = getDbStatus();

    if (isMySQLConnected) {
      const pool = getPool();
      let query = 'SELECT * FROM vocabularies WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (word LIKE ? OR marathi LIKE ? OR hindi LIKE ? OR pronunciation LIKE ?)';
        const s = `%${search}%`;
        params.push(s, s, s, s);
      }
      if (category && category !== 'All') {
        query += ' AND category = ?';
        params.push(category);
      }
      if (type && type !== 'all') {
        query += ' AND type = ?';
        params.push(type);
      }
      if (level) {
        query += ' AND level = ?';
        params.push(parseInt(level, 10));
      }
      if (favorite === 'true') {
        query += ' AND is_favorite = 1';
      }
      if (difficult === 'true') {
        query += ' AND is_difficult = 1';
      }
      if (srs_box) {
        query += ' AND srs_box = ?';
        params.push(srs_box);
      }

      if (sort === 'az') {
        query += ' ORDER BY word ASC';
      } else if (sort === 'za') {
        query += ' ORDER BY word DESC';
      } else {
        query += ' ORDER BY id ASC';
      }

      const [rows] = await pool.query(query, params);
      const parsedRows = rows.map(r => ({
        ...r,
        is_favorite: Boolean(r.is_favorite),
        is_difficult: Boolean(r.is_difficult),
        examples: typeof r.examples === 'string' ? JSON.parse(r.examples) : r.examples
      }));
      return res.json({ success: true, count: parsedRows.length, data: parsedRows });
    }

    // Fallback store
    let list = [...memoryStore.vocab];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.marathi.includes(q) ||
        w.hindi.includes(q) ||
        w.pronunciation.includes(q)
      );
    }
    if (category && category !== 'All') {
      list = list.filter(w => w.category === category);
    }
    if (type && type !== 'all') {
      list = list.filter(w => w.type === type);
    }
    if (level) {
      list = list.filter(w => w.level === parseInt(level, 10));
    }
    if (favorite === 'true') {
      list = list.filter(w => w.is_favorite);
    }
    if (difficult === 'true') {
      list = list.filter(w => w.is_difficult);
    }
    if (srs_box) {
      list = list.filter(w => w.srs_box === srs_box);
    }

    if (sort === 'az') {
      list.sort((a, b) => a.word.localeCompare(b.word));
    } else if (sort === 'za') {
      list.sort((a, b) => b.word.localeCompare(a.word));
    }

    res.json({ success: true, count: list.length, data: list });
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
    const { isMySQLConnected } = getDbStatus();

    if (isMySQLConnected) {
      const pool = getPool();
      await pool.query('UPDATE vocabularies SET is_favorite = NOT is_favorite WHERE id = ?', [id]);
      const [rows] = await pool.query('SELECT is_favorite FROM vocabularies WHERE id = ?', [id]);
      return res.json({ success: true, is_favorite: Boolean(rows[0]?.is_favorite) });
    }

    const item = memoryStore.vocab.find(v => v.id === id);
    if (item) {
      item.is_favorite = !item.is_favorite;
      return res.json({ success: true, is_favorite: item.is_favorite });
    }
    res.status(404).json({ success: false, message: 'Word not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
