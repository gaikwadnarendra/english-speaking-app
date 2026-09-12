const { getDbStatus, getPool, memoryStore } = require('../config/db');

// GET /api/verbs
exports.getAllVerbs = async (req, res) => {
  try {
    const { search } = req.query;
    const { isMySQLConnected } = getDbStatus();

    if (isMySQLConnected) {
      const pool = getPool();
      let query = 'SELECT * FROM verbs WHERE 1=1';
      const params = [];
      if (search) {
        query += ' AND (english LIKE ? OR marathi LIKE ? OR hindi LIKE ? OR v1 LIKE ? OR v2 LIKE ? OR v3 LIKE ?)';
        const s = `%${search}%`;
        params.push(s, s, s, s, s, s);
      }
      query += ' ORDER BY english ASC';
      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let list = [...memoryStore.verbs];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(v =>
        v.english.toLowerCase().includes(q) ||
        v.marathi.includes(q) ||
        v.hindi.includes(q) ||
        v.v1.toLowerCase().includes(q) ||
        v.v2.toLowerCase().includes(q) ||
        v.v3.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
