const { getDbStatus, getPool, memoryStore } = require('../config/db');

// GET /api/progress
exports.getProgress = async (req, res) => {
  try {
    const { isMySQLConnected } = getDbStatus();

    if (isMySQLConnected) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM user_progress WHERE user_id = 1');
      if (rows.length > 0) {
        return res.json({ success: true, data: rows[0] });
      }
    }

    res.json({
      success: true,
      data: {
        ...memoryStore.progress,
        totalVocabCount: memoryStore.vocab.length,
        totalVerbsCount: memoryStore.verbs.length,
        totalLessonsCount: memoryStore.lessons.length,
        targets: {
          vocab: 500,
          sentences: 300,
          lessons: 50,
          speaking: 30
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/progress/streak
exports.incrementStreak = async (req, res) => {
  try {
    memoryStore.progress.streak += 1;
    memoryStore.progress.lastActive = new Date().toISOString().split('T')[0];
    res.json({
      success: true,
      streak: memoryStore.progress.streak,
      message: 'अभिनंदन! Streak वाढली आहे 🔥'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/progress/settings
exports.updateSettings = async (req, res) => {
  try {
    const { uiLanguage, reminderTime, targetDailyMinutes } = req.body;
    if (uiLanguage) memoryStore.progress.uiLanguage = uiLanguage;
    if (reminderTime) memoryStore.progress.reminderTime = reminderTime;
    if (targetDailyMinutes) memoryStore.progress.targetDailyMinutes = targetDailyMinutes;

    res.json({ success: true, data: memoryStore.progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/progress/reset
exports.resetProgress = async (req, res) => {
  try {
    memoryStore.progress = {
      userId: 1,
      streak: 1,
      lastActive: new Date().toISOString().split('T')[0],
      wordsLearned: 0,
      sentencesPracticed: 0,
      speakingCompleted: 0,
      lessonsFinished: 0,
      quizScoreAvg: 0,
      targetDailyMinutes: 5,
      todayMinutes: 0,
      reminderTime: '08:00 PM',
      uiLanguage: 'mr'
    };
    memoryStore.vocab.forEach(v => {
      v.srs_box = 'new';
      v.is_favorite = false;
      v.is_difficult = false;
    });
    res.json({ success: true, message: 'प्रगती रीसेट झाली आहे.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
