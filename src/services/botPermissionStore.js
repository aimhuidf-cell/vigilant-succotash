const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'bot-permissions.json');
const ALLOWED_MODES = ['everyone', 'admins', 'owner', 'off'];

function loadMode() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return ALLOWED_MODES.includes(parsed?.mode) ? parsed.mode : 'everyone';
  } catch (error) {
    return 'everyone';
  }
}

let mode = loadMode();

function persist() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify({ mode }, null, 2));
}

function getSettings() {
  return { mode };
}

function updateSettings(nextSettings = {}) {
  const nextMode = String(nextSettings.mode || '').trim().toLowerCase();
  if (!ALLOWED_MODES.includes(nextMode)) {
    throw new Error('mode must be everyone, admins, owner, or off');
  }
  mode = nextMode;
  persist();
  return getSettings();
}

module.exports = { getSettings, updateSettings };