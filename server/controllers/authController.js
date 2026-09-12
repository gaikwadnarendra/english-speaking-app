const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDbStatus, getPool, memoryStore } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// In-memory users list for fallback
if (!memoryStore.users) {
  memoryStore.users = [
    {
      id: 1,
      name: "Demo Learner",
      email: "demo@learner.com",
      password: "$2a$10$demoHashedPasswordDummyPlaceholder",
      ui_language: "mr",
      created_at: new Date()
    }
  ];
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, ui_language = 'mr' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'नाव, ईमेल आणि पासवर्ड आवश्यक आहेत.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'पासवर्ड किमान 6 अक्षरांचा असावा.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { isMySQLConnected } = getDbStatus();

    if (isMySQLConnected) {
      const pool = getPool();
      // Check existing user
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'हा ईमेल आधीच नोंदणीकृत आहे.' });
      }

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, ui_language) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, ui_language]
      );

      const userId = result.insertId;

      // Create initial user progress
      await pool.query(
        'INSERT INTO user_progress (user_id, streak_count, words_learned, sentences_practiced, lessons_completed, speaking_completed, quiz_avg_score, ui_language) VALUES (?, 1, 0, 0, 0, 0, 0, ?)',
        [userId, ui_language]
      );

      const token = jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: '30d' });

      return res.json({
        success: true,
        message: 'नोंदणी यशस्वी झाली! 🎉',
        token,
        user: { id: userId, name, email, ui_language }
      });
    }

    // Fallback store
    const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'हा ईमेल आधीच नोंदणीकृत आहे.' });
    }

    const userId = memoryStore.users.length + 1;
    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      ui_language,
      created_at: new Date()
    };
    memoryStore.users.push(newUser);

    const token = jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      message: 'नोंदणी यशस्वी झाली! 🎉',
      token,
      user: { id: userId, name, email, ui_language }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'ईमेल आणि पासवर्ड प्रविष्ट करा.' });
    }

    const { isMySQLConnected } = getDbStatus();

    if (isMySQLConnected) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(400).json({ success: false, message: 'अवैध ईमेल किंवा पासवर्ड.' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'अवैध ईमेल किंवा पासवर्ड.' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.json({
        success: true,
        message: 'लॉगिन यशस्वी! स्वागत आहे 🎉',
        token,
        user: { id: user.id, name: user.name, email: user.email, ui_language: user.ui_language }
      });
    }

    // Fallback in-memory
    const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Allow demo instant login
      if (email === 'demo@learner.com') {
        const token = jwt.sign({ userId: 1, email, name: 'Demo Learner' }, JWT_SECRET, { expiresIn: '30d' });
        return res.json({
          success: true,
          token,
          user: { id: 1, name: 'Demo Learner', email, ui_language: 'mr' }
        });
      }
      return res.status(400).json({ success: false, message: 'अवैध ईमेल किंवा पासवर्ड.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && email !== 'demo@learner.com') {
      return res.status(400).json({ success: false, message: 'अवैध ईमेल किंवा पासवर्ड.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'लॉगिन यशस्वी! स्वागत आहे 🎉',
      token,
      user: { id: user.id, name: user.name, email: user.email, ui_language: user.ui_language }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { isMySQLConnected } = getDbStatus();

    if (isMySQLConnected) {
      const pool = getPool();
      const [userRows] = await pool.query('SELECT id, name, email, ui_language, created_at FROM users WHERE id = ?', [userId]);
      if (userRows.length === 0) {
        return res.status(404).json({ success: false, message: 'वापरकर्ता सापडला नाही.' });
      }

      const [progressRows] = await pool.query('SELECT * FROM user_progress WHERE user_id = ?', [userId]);

      return res.json({
        success: true,
        user: userRows[0],
        progress: progressRows[0] || null
      });
    }

    const user = memoryStore.users.find(u => u.id === userId) || {
      id: userId,
      name: req.user.name,
      email: req.user.email,
      ui_language: 'mr'
    };

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, ui_language: user.ui_language },
      progress: memoryStore.progress
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
