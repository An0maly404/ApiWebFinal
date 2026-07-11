const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function initDB() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS weather_cache (
      city TEXT PRIMARY KEY,
      temperature NUMERIC,
      description TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
    console.log("Connected to PostgreSQL (Database 2) and ensured table exists");
}

module.exports = { pool, initDB };