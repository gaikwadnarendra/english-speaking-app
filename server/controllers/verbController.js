const { getDbStatus, getPool, memoryStore } = require('../config/db');

// GET /api/verbs
exports.getAllVerbs = async (req, res) => {
  try {
    const { search, limit, page } = req.query;

    let list = [...memoryStore.verbs];

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(v =>
        (v.english && v.english.toLowerCase().includes(q)) ||
        (v.marathi && v.marathi.includes(q)) ||
        (v.hindi && v.hindi.includes(q)) ||
        (v.v1 && v.v1.toLowerCase().includes(q)) ||
        (v.v2 && v.v2.toLowerCase().includes(q)) ||
        (v.v3 && v.v3.toLowerCase().includes(q))
      );
    }

    const totalCount = list.length;
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
