require('dotenv').config();
const { Pool } = require('pg');
const { seedVocab1500, seedVerbs300 } = require('./data/seed1500');
const { seedLessons } = require('./data/seedLessons');

async function runSeed() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL is not set in server/.env file!');
    console.log('👉 Please add: DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require');
    process.exit(1);
  }

  console.log('🚀 Connecting to Neon PostgreSQL...');
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    console.log('⚙️ Ensuring tables exist...');

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

    console.log('✅ Tables checked & ready.');

    // ----------------- Seeding Vocabularies -----------------
    console.log(`🌱 Seeding ${seedVocab1500.length} Vocabularies into Neon PostgreSQL...`);
    await client.query('TRUNCATE TABLE vocabularies RESTART IDENTITY');
    
    const chunkSize = 100;
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
      process.stdout.write(`\r   ⏳ Inserted ${Math.min(i + chunkSize, seedVocab1500.length)} / ${seedVocab1500.length} vocabularies...`);
    }
    console.log('\n✅ 1500+ Vocabularies seeded successfully!');

    // ----------------- Seeding Verbs -----------------
    console.log(`🌱 Seeding ${seedVerbs300.length} Verbs into Neon PostgreSQL...`);
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
    console.log('✅ 300+ Verbs seeded successfully!');

    // ----------------- Seeding Lessons -----------------
    console.log(`🌱 Seeding ${seedLessons.length} Interactive Lessons into Neon PostgreSQL...`);
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
    console.log('✅ All Lessons seeded successfully!');

    // ----------------- Summary -----------------
    const vRes = await client.query('SELECT COUNT(*) FROM vocabularies');
    const vbRes = await client.query('SELECT COUNT(*) FROM verbs');
    const lRes = await client.query('SELECT COUNT(*) FROM lessons');

    console.log('\n🎉 ================= DATABASE SUMMARY =================');
    console.log(`📚 Vocabularies count : ${vRes.rows[0].count}`);
    console.log(`🔤 Verbs count        : ${vbRes.rows[0].count}`);
    console.log(`📖 Lessons count      : ${lRes.rows[0].count}`);
    console.log('🎉 =====================================================\n');

  } catch (err) {
    console.error('❌ Seeding failed with error:', err);
  } finally {
    client.release();
    await pool.end();
    console.log('👋 Done.');
  }
}

runSeed();
