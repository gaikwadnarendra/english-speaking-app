const { getDbStatus, getPool, memoryStore } = require('../config/db');

// GET /api/practice/quiz
exports.getQuizzes = async (req, res) => {
  try {
    const { type } = req.query;
    let list = [...memoryStore.quizzes];
    if (type) {
      list = list.filter(q => q.type === type);
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/practice/submit
exports.submitQuizResult = async (req, res) => {
  try {
    const { answers, totalQuestions, correctCount } = req.body;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // Update user stats
    memoryStore.progress.quizScoreAvg = Math.round((memoryStore.progress.quizScoreAvg + accuracy) / 2);
    memoryStore.progress.wordsLearned += correctCount;

    res.json({
      success: true,
      accuracy,
      correctCount,
      totalQuestions,
      newAvgScore: memoryStore.progress.quizScoreAvg
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
