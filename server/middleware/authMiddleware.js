const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'marathi_english_learning_super_secret_jwt_key_2026';

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'लॉगिन आवश्यक आहे (Authentication Required)' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'अवैध किंवा मुदत संपलेले टोकन (Invalid or expired token)' });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch {
      req.user = { userId: 1, email: 'guest@learner.com', name: 'Learner' };
    }
  } else {
    req.user = { userId: 1, email: 'guest@learner.com', name: 'Learner' };
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  JWT_SECRET
};
