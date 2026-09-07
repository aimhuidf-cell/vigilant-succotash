const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const postgres = require('../lib/postgres');

const passwordFilePath = path.join(process.cwd(), '.schedulebot-password.json');
let initialized = false;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function verifyHash(password, storedHash) {
  const [algorithm, salt, expectedHex] = String(storedHash || '').split(':');
  if (algorithm !== 'scrypt' || !salt || !expectedHex) return false;

  const received = crypto.scryptSync(String(password || ''), salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

function readLocalHash() {
  try {
    return JSON.parse(fs.readFileSync(passwordFilePath, 'utf8')).passwordHash || '';
  } catch (error) {
    return '';
  }
}

function writeLocalHash(passwordHash) {
  fs.writeFileSync(passwordFilePath, `${JSON.stringify({ passwordHash })}\n`, { mode: 0o600 });
  try {
    fs.chmodSync(passwordFilePath, 0o600);
  } catch (error) {
    // Ignore permission errors on filesystems that do not support chmod.
  }
}

async function init() {
  if (initialized) return;

  if (postgres.hasDatabase()) {
    await postgres.query(
      `CREATE TABLE IF NOT EXISTS dashboard_auth (
        id INTEGER PRIMARY KEY DEFAULT 1,
        password_hash TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
    );
  }

  initialized = true;
}

async function getStoredHash() {
  await init();

  if (postgres.hasDatabase()) {
    const result = await postgres.query('SELECT password_hash FROM dashboard_auth WHERE id = 1');
    return result.rows[0]?.password_hash || '';
  }

  return readLocalHash();
}

async function verifyPassword(password, fallbackPassword) {
  const storedHash = await getStoredHash();
  if (storedHash) return verifyHash(password, storedHash);

  return String(password || '') === String(fallbackPassword || '');
}

async function updatePassword(password) {
  const passwordHash = hashPassword(password);
  await init();

  if (postgres.hasDatabase()) {
    await postgres.query(
      `INSERT INTO dashboard_auth (id, password_hash, updated_at)
       VALUES (1, $1, NOW())
       ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = NOW()`,
      [passwordHash]
    );
    return;
  }

  writeLocalHash(passwordHash);
}

module.exports = { verifyPassword, updatePassword };