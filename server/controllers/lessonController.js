const { getDbStatus, getPool, memoryStore } = require('../config/db');

// GET /api/lessons
exports.getAllLessons = async (req, res) => {
  try {
    const { level } = req.query;
    const { isConnected, isMySQLConnected } = getDbStatus();

    if (isConnected || isMySQLConnected) {
      const pool = getPool();
      let query = 'SELECT * FROM lessons WHERE 1=1';
      const params = [];
      if (level) {
        query += ' AND level = ?';
        params.push(parseInt(level, 10));
      }
      query += ' ORDER BY level ASC, id ASC';
      const [rows] = await pool.query(query, params);
      const parsed = rows.map(r => {
        let contentObj = typeof r.content === 'string' ? JSON.parse(r.content) : r.content;
        if (contentObj && typeof contentObj === 'object' && !Array.isArray(contentObj)) {
          return {
            ...contentObj,
            ...r,
            is_completed: Boolean(r.is_completed),
            content: contentObj.content || [],
            grammar_tip: contentObj.grammar_tip,
            dialogue: contentObj.dialogue,
            quiz: contentObj.quiz
          };
        }
        return {
          ...r,
          is_completed: Boolean(r.is_completed),
          content: contentObj
        };
      });
      return res.json({ success: true, count: parsed.length, data: parsed });
    }

    let list = [...memoryStore.lessons];
    if (level) {
      list = list.filter(l => l.level === parseInt(level, 10));
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/lessons/:id/complete
exports.completeLesson = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { isConnected, isMySQLConnected } = getDbStatus();

    if (isConnected || isMySQLConnected) {
      const pool = getPool();
      await pool.query('UPDATE lessons SET is_completed = true WHERE id = ?', [id]);
      await pool.query('UPDATE user_progress SET lessons_completed = lessons_completed + 1 WHERE user_id = 1');
      return res.json({ success: true, message: 'Lesson completed' });
    }

    const lesson = memoryStore.lessons.find(l => l.id === id);
    if (lesson) {
      lesson.is_completed = true;
      memoryStore.progress.lessonsFinished += 1;
      return res.json({ success: true, message: 'Lesson completed' });
    }
    res.status(404).json({ success: false, message: 'Lesson not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
