const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'prayer-reminder.json');

function normalizeConfig(rawConfig) {
  const source = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};
  const enabledChats = source.enabledChats && typeof source.enabledChats === 'object' ? source.enabledChats : {};
  const lastSentByChat = source.lastSentByChat && typeof source.lastSentByChat === 'object' ? source.lastSentByChat : {};
  return { enabledChats, lastSentByChat };
}

function loadConfig() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return normalizeConfig(parsed);
  } catch (error) {
    return normalizeConfig();
  }
}

let config = loadConfig();

function persist() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2));
}

function getConfig() {
  return config;
}

function updateConfig(nextConfig) {
  config = normalizeConfig(nextConfig);
  persist();
  return getConfig();
}

function setEnabledForChat(chatId, enabled) {
  const jid = String(chatId || '').trim();
  if (!jid) return false;

  const next = normalizeConfig({
    enabledChats: { ...config.enabledChats },
    lastSentByChat: { ...config.lastSentByChat },
  });

  if (enabled) {
    next.enabledChats[jid] = true;
  } else {
    delete next.enabledChats[jid];
    delete next.lastSentByChat[jid];
  }

  return updateConfig(next);
}

function isEnabledForChat(chatId) {
  const jid = String(chatId || '').trim();
  return Boolean(jid && config.enabledChats[jid] === true);
}

module.exports = {
  getConfig,
  updateConfig,
  setEnabledForChat,
  isEnabledForChat,
};
