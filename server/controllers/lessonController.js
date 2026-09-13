const { getDbStatus, getPool, memoryStore } = require('../config/db');

// GET /api/lessons
exports.getAllLessons = async (req, res) => {
  try {
    const { level } = req.query;

    let list = [...memoryStore.lessons];
    if (level) {
      list = list.filter(l => l.level === parseInt(level, 10));
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/lessons/:id/complete
exports.completeLesson = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { isConnected, isMySQLConnected } = getDbStatus();

    const lesson = memoryStore.lessons.find(l => l.id === id);
    if (lesson) {
      lesson.is_completed = true;
    }
    if (memoryStore.progress) {
      memoryStore.progress.lessonsFinished = (memoryStore.progress.lessonsFinished || 0) + 1;
    }

    if (isConnected || isMySQLConnected) {
      const pool = getPool();
      if (pool) {
        await pool.query('UPDATE lessons SET is_completed = true WHERE id = ?', [id]).catch(() => {});
        await pool.query('UPDATE user_progress SET lessons_completed = lessons_completed + 1 WHERE user_id = 1').catch(() => {});
      }
    }

    res.json({ success: true, message: 'Lesson completed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
