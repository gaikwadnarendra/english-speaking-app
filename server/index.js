const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { initDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vocabRoutes = require('./routes/vocabRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const verbRoutes = require('./routes/verbRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const srsRoutes = require('./routes/srsRoutes');
const progressRoutes = require('./routes/progressRoutes');
const speakingRoutes = require('./routes/speakingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    app: 'English शिका (Marathi to English Learning Backend)',
    version: '1.0.0',
    database: process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'Fallback Local Store',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Marathi-English Learning API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/vocab', vocabRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/verbs', verbRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/srs', srsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/speaking', speakingRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Initialize DB and start server if executed directly
if (require.main === module) {
  initDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📚 Marathi-English Learning API ready!`);
    });
  }).catch(err => {
    console.warn('Database initialization warning (running in fallback memory/file mode):', err.message);
    app.listen(PORT, () => {
      console.log(`🚀 Server running with resilient local store at http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
