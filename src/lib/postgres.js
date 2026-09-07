const { Pool } = require('pg');

const connectionString = String(process.env.DATABASE_URL || '').trim();
const useDatabase = Boolean(connectionString);

let pool = null;

if (useDatabase) {
  const shouldUseSsl = !/sslmode=disable/i.test(connectionString);
  const config = {
    connectionString,
    max: Number(process.env.PG_POOL_MAX || 10),
  };

  if (shouldUseSsl) {
    config.ssl = { rejectUnauthorized: false };
  }

  pool = new Pool(config);

  pool.on('error', (error) => {
    console.error('[Postgres] Unexpected pool error:', error.message);
  });
}

function hasDatabase() {
  return useDatabase;
}

async function query(text, params = []) {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured');
  }

  return pool.query(text, params);
}

async function close() {
  if (!pool) return;
  await pool.end();
  pool = null;
}

module.exports = {
  hasDatabase,
  query,
  close,
};
