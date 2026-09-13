const { getDbStatus, getPool, memoryStore } = require('../config/db');

const SRS_BOXES = ['new', 'learning', 'reviewing', 'mastered'];

// GET /api/srs/due
// Returns cards that are ready for review today
exports.getDueReviews = async (req, res) => {
  try {
    const { isConnected, isMySQLConnected } = getDbStatus();

    if (isConnected || isMySQLConnected) {
      const pool = getPool();
      // In a real app we'd filter by review timestamps; here we fetch due learning/reviewing items
      const [rows] = await pool.query(
        "SELECT * FROM vocabularies WHERE srs_box IN ('learning', 'reviewing') OR is_difficult = true LIMIT 10"
      );
      return res.json({ success: true, count: rows.length, data: rows });
    }

    const dueList = memoryStore.vocab.filter(
      v => v.srs_box === 'learning' || v.srs_box === 'reviewing' || v.is_difficult
    );
    res.json({ success: true, count: dueList.length, data: dueList.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/srs/stats
exports.getSRSStats = async (req, res) => {
  try {
    const counts = {
      new: 0,
      learning: 0,
      reviewing: 0,
      mastered: 0,
      difficult: 0
    };

    memoryStore.vocab.forEach(v => {
      if (counts[v.srs_box] !== undefined) {
        counts[v.srs_box] += 1;
      }
      if (v.is_difficult) {
        counts.difficult += 1;
      }
    });

    res.json({ success: true, data: counts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/srs/answer
// Body: { vocabId, isCorrect }
exports.updateSRSBox = async (req, res) => {
  try {
    const { vocabId, isCorrect } = req.body;
    const { isConnected, isMySQLConnected } = getDbStatus();
    const id = parseInt(vocabId, 10);

    const item = memoryStore.vocab.find(v => v.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Vocabulary not found' });
    }

    let currentBoxIndex = SRS_BOXES.indexOf(item.srs_box);
    if (currentBoxIndex === -1) currentBoxIndex = 0;

    let newBox = item.srs_box;
    let isDifficult = item.is_difficult;

    if (isCorrect) {
      // Advance to next box up to 'mastered'
      if (currentBoxIndex < SRS_BOXES.length - 1) {
        newBox = SRS_BOXES[currentBoxIndex + 1];
      }
      if (newBox === 'mastered') {
        isDifficult = false; // Resolved
      }
    } else {
      // Drop back to 'learning' and mark difficult
      newBox = 'learning';
      isDifficult = true;
    }

    item.srs_box = newBox;
    item.is_difficult = isDifficult;

    if (isConnected || isMySQLConnected) {
      const pool = getPool();
      await pool.query('UPDATE vocabularies SET srs_box = ?, is_difficult = ? WHERE id = ?', [
        newBox,
        Boolean(isDifficult),
        id
      ]);
    }

    res.json({
      success: true,
      data: {
        id,
        word: item.word,
        newBox,
        isDifficult,
        message: isCorrect ? 'Word moved to next memory box!' : 'Word added to Difficult Words for review.'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
