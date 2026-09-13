const { Pool: PgPool } = require('pg');
const mysql = require('mysql2/promise');
const { seedVocab1500, seedVerbs300 } = require('../data/seed1500');
const { seedLessons, seedQuizzes } = require('../data/seedData');

// Local fallback store with full 1500+ items
let memoryStore = {
  vocab: [...seedVocab1500],
  verbs: [...seedVerbs300],
  lessons: [...seedLessons],
  quizzes: [...seedQuizzes],
  users: [
    {
      id: 1,
      name: "Demo Learner",
      email: "demo@learner.com",
      password: "password123",
      ui_language: "mr",
      created_at: new Date()
    }
  ],
  progress: {
    userId: 1,
    streak: 3,
    lastActive: new Date().toISOString().split('T')[0],
    wordsLearned: 145,
    sentencesPracticed: 68,
    speakingCompleted: 24,
    lessonsFinished: 5,
    quizScoreAvg: 92,
    targetDailyMinutes: 5,
    todayMinutes: 4,
    reminderTime: '08:00 PM',
    uiLanguage: 'mr'
  }
};

let pool = null;
let isConnected = false;
let dbType = 'memory'; // 'postgres' | 'mysql' | 'memory'

// Convert '?' placeholders to '$1, $2, $3' for Postgres
function formatPgQuery(sql, params) {
  let paramIdx = 1;
  const formattedSql = sql.replace(/\?/g, () => `$${paramIdx++}`);
  return { formattedSql, params: params || [] };
}

async function initPostgres(databaseUrl) {
  const pgPool = new PgPool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000
  });

  const client = await pgPool.connect();

  try {
    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        ui_language VARCHAR(10) DEFAULT 'mr',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Vocabularies Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS vocabularies (
        id SERIAL PRIMARY KEY,
        word VARCHAR(255) NOT NULL,
        marathi VARCHAR(255) NOT NULL,
        hindi VARCHAR(255) NOT NULL,
        pronunciation VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'noun',
        category VARCHAR(100) DEFAULT 'General',
        level INT DEFAULT 1,
        v1 VARCHAR(100) NULL,
        v2 VARCHAR(100) NULL,
        v3 VARCHAR(100) NULL,
        ving VARCHAR(100) NULL,
        srs_box VARCHAR(50) DEFAULT 'new',
        is_favorite BOOLEAN DEFAULT FALSE,
        is_difficult BOOLEAN DEFAULT FALSE,
        examples JSONB NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Verbs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS verbs (
        id SERIAL PRIMARY KEY,
        english VARCHAR(255) NOT NULL,
        marathi VARCHAR(255) NOT NULL,
        hindi VARCHAR(255) NOT NULL,
        pronunciation VARCHAR(255) NOT NULL,
        v1 VARCHAR(100) NOT NULL,
        v2 VARCHAR(100) NOT NULL,
        v3 VARCHAR(100) NOT NULL,
        ving VARCHAR(100) NOT NULL,
        example_en VARCHAR(500) NULL,
        example_mr VARCHAR(500) NULL,
        example_hi VARCHAR(500) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Lessons Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INT PRIMARY KEY,
        title_en VARCHAR(255) NOT NULL,
        title_mr VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NOT NULL,
        level INT NOT NULL DEFAULT 1,
        category VARCHAR(100) DEFAULT 'Basic',
        description_mr TEXT,
        content JSONB NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. User Progress Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INT DEFAULT 1,
        streak_count INT DEFAULT 1,
        last_active_date DATE,
        words_learned INT DEFAULT 0,
        sentences_practiced INT DEFAULT 0,
        lessons_completed INT DEFAULT 0,
        speaking_completed INT DEFAULT 0,
        quiz_avg_score DECIMAL(5,2) DEFAULT 0.0,
        reminder_time VARCHAR(20) DEFAULT '08:00 PM',
        target_daily_minutes INT DEFAULT 5,
        ui_language VARCHAR(10) DEFAULT 'mr',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check Vocab count in Neon Postgres
    const vocabCountRes = await client.query('SELECT COUNT(*) as count FROM vocabularies');
    const vCount = parseInt(vocabCountRes.rows[0].count, 10);
    if (vCount < 1000) {
      console.log('🌱 Seeding 1500+ Vocabularies into Neon PostgreSQL...');
      await client.query('TRUNCATE TABLE vocabularies RESTART IDENTITY');
      const chunkSize = 200;
      for (let i = 0; i < seedVocab1500.length; i += chunkSize) {
        const chunk = seedVocab1500.slice(i, i + chunkSize);
        for (const item of chunk) {
          await client.query(
            `INSERT INTO vocabularies (word, marathi, hindi, pronunciation, type, category, level, v1, v2, v3, ving, srs_box, is_favorite, is_difficult, examples)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
            [
              item.word,
              item.marathi,
              item.hindi,
              item.pronunciation,
              item.type || 'noun',
              item.category || 'General',
              item.level || 1,
              item.v1 || null,
              item.v2 || null,
              item.v3 || null,
              item.ving || null,
              item.srs_box || 'new',
              Boolean(item.is_favorite),
              Boolean(item.is_difficult),
              JSON.stringify(item.examples || [])
            ]
          );
        }
      }
      console.log('✅ Vocabularies seeded into Neon Postgres successfully!');
    }

    // Check Verbs count
    const verbCountRes = await client.query('SELECT COUNT(*) as count FROM verbs');
    const vbCount = parseInt(verbCountRes.rows[0].count, 10);
    if (vbCount < 250) {
      console.log('🌱 Seeding 300+ Verbs into Neon PostgreSQL...');
      await client.query('TRUNCATE TABLE verbs RESTART IDENTITY');
      for (const verb of seedVerbs300) {
        await client.query(
          `INSERT INTO verbs (english, marathi, hindi, pronunciation, v1, v2, v3, ving, example_en, example_mr, example_hi)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            verb.english,
            verb.mr,
            verb.hi,
            verb.pron,
            verb.v1,
            verb.v2,
            verb.v3,
            verb.ving,
            verb.ex_en || '',
            verb.ex_mr || '',
            verb.ex_hi || ''
          ]
        );
      }
      console.log('✅ Verbs seeded into Neon Postgres successfully!');
    }

    // Check Lessons count
    const lessonCountRes = await client.query('SELECT COUNT(*) as count FROM lessons');
    const lCount = parseInt(lessonCountRes.rows[0].count, 10);
    if (lCount < 20) {
      console.log('🌱 Seeding 20 Interactive Lessons into Neon PostgreSQL...');
      await client.query('TRUNCATE TABLE lessons');
      for (const lesson of seedLessons) {
        await client.query(
          `INSERT INTO lessons (id, title_en, title_mr, title_hi, level, category, description_mr, content, is_completed)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            lesson.id,
            lesson.title_en,
            lesson.title_mr,
            lesson.title_hi,
            lesson.level,
            lesson.category,
            lesson.description_mr,
            JSON.stringify(lesson),
            Boolean(lesson.is_completed)
          ]
        );
      }
      console.log('✅ Lessons seeded into Neon Postgres successfully!');
    }

    // Create wrapper pool with MySQL compatibility: [rows] = await pool.query(sql, params)
    pool = {
      query: async (sql, params = []) => {
        let querySql = sql;
        const isInsert = /^\s*insert\s+/i.test(querySql);
        if (isInsert && !/returning/i.test(querySql)) {
          querySql += ' RETURNING id';
        }
        const { formattedSql, params: pgParams } = formatPgQuery(querySql, params);
        const res = await pgPool.query(formattedSql, pgParams);
        const rows = res.rows || [];
        if (isInsert && rows.length > 0 && rows[0].id) {
          rows.insertId = rows[0].id;
        }
        return [rows, res.fields];
      },
      getConnection: async () => {
        const c = await pgPool.connect();
        return {
          query: async (sql, params = []) => {
            let querySql = sql;
            const isInsert = /^\s*insert\s+/i.test(querySql);
            if (isInsert && !/returning/i.test(querySql)) {
              querySql += ' RETURNING id';
            }
            const { formattedSql, params: pgParams } = formatPgQuery(querySql, params);
            const res = await c.query(formattedSql, pgParams);
            const rows = res.rows || [];
            if (isInsert && rows.length > 0 && rows[0].id) {
              rows.insertId = rows[0].id;
            }
            return [rows, res.fields];
          },
          release: () => c.release()
        };
      }
    };

    isConnected = true;
    dbType = 'postgres';
    console.log('🚀 Connected to Neon PostgreSQL and initialized all tables & seed data!');

    // Pre-cache Neon DB data into high-speed memory cache for sub-millisecond responses
    try {
      const [vRows] = await pool.query('SELECT * FROM vocabularies ORDER BY id ASC');
      if (vRows && vRows.length > 0) {
        memoryStore.vocab = vRows.map(r => ({
          ...r,
          is_favorite: Boolean(r.is_favorite),
          is_difficult: Boolean(r.is_difficult),
          examples: typeof r.examples === 'string' ? JSON.parse(r.examples) : (r.examples || [])
        }));
      }
      const [vbRows] = await pool.query('SELECT * FROM verbs ORDER BY english ASC');
      if (vbRows && vbRows.length > 0) {
        memoryStore.verbs = vbRows;
      }
      const [lRows] = await pool.query('SELECT * FROM lessons ORDER BY level ASC, id ASC');
      if (lRows && lRows.length > 0) {
        memoryStore.lessons = lRows.map(r => {
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
          return { ...r, is_completed: Boolean(r.is_completed), content: contentObj };
        });
      }
      console.log(`⚡ Pre-cached ${memoryStore.vocab.length} vocab, ${memoryStore.verbs.length} verbs & ${memoryStore.lessons.length} lessons for sub-millisecond API response!`);
    } catch (cacheErr) {
      console.warn('Memory cache prefill warning:', cacheErr.message);
    }
  } finally {
    client.release();
  }
}

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (databaseUrl) {
    try {
      console.log('🔗 Attempting connection to Neon PostgreSQL via DATABASE_URL...');
      await initPostgres(databaseUrl);
      return;
    } catch (err) {
      console.warn('⚠️ Neon PostgreSQL connection error:', err.message);
    }
  }

  // Fallback to MySQL if DB_HOST is defined
  if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
    try {
      const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'marathi_english_db',
        waitForConnections: true,
        connectionLimit: 10
      };
      pool = mysql.createPool(dbConfig);
      const conn = await pool.getConnection();
      conn.release();
      isConnected = true;
      dbType = 'mysql';
      console.log('✅ Connected to MySQL Database!');
      return;
    } catch (err) {
      console.warn('⚠️ MySQL connection notice:', err.message);
    }
  }

  // Resilient memory store fallback
  isConnected = false;
  dbType = 'memory';
  console.log('💡 Running with high-performance in-memory dataset with 1500+ words, 300+ verbs & 20 lessons.');
}

function getDbStatus() {
  return {
    isMySQLConnected: isConnected,
    isConnected,
    dbType,
    pool,
    memoryStore
  };
}

module.exports = {
  initDatabase,
  getDbStatus,
  getPool: () => pool,
  memoryStore
};
