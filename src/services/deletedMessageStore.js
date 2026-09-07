const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'deleted-messages.json');
const MAX_RECORDS = 500;

function loadRecords() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

const records = loadRecords();

function persistRecords() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
  } catch (error) {
    console.error('[DeletedMessageStore] Failed to persist records:', error.message);
  }
}

function listRecords() {
  return [...records].sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
}

function addRecord(entry) {
  const normalizedStatus = String(entry.status || '').trim().toLowerCase();
  const status = ['recovered', 'partial', 'missing'].includes(normalizedStatus)
    ? normalizedStatus
    : 'recovered';

  const record = {
    id: Date.now() + Math.random().toString(16).slice(2),
    chatId: String(entry.chatId || ''),
    chatName: String(entry.chatName || ''),
    senderId: String(entry.senderId || ''),
    senderName: String(entry.senderName || ''),
    isGroup: Boolean(entry.isGroup),
    type: String(entry.type || 'text'),
    text: String(entry.text || ''),
    mediaUrl: entry.mediaUrl ? String(entry.mediaUrl) : '',
    fileName: entry.fileName ? String(entry.fileName) : '',
    mimeType: entry.mimeType ? String(entry.mimeType) : '',
    durationSeconds: Number.isFinite(Number(entry.durationSeconds))
      ? Number(entry.durationSeconds)
      : null,
    fileSizeBytes: Number.isFinite(Number(entry.fileSizeBytes))
      ? Number(entry.fileSizeBytes)
      : null,
    status,
    originalTimestamp: entry.originalTimestamp || null,
    deletedAt: new Date().toISOString(),
  };

  records.unshift(record);
  if (records.length > MAX_RECORDS) {
    records.length = MAX_RECORDS;
  }

  persistRecords();
  return record;
}

function removeRecord(id) {
  const index = records.findIndex((item) => item.id === id);
  if (index === -1) return false;

  records.splice(index, 1);
  persistRecords();
  return true;
}

function clearRecords() {
  records.length = 0;
  persistRecords();
}

function removeRecordsByChatId(chatId) {
  const target = String(chatId || '').trim();
  if (!target) return 0;

  const before = records.length;
  for (let index = records.length - 1; index >= 0; index -= 1) {
    if (String(records[index]?.chatId || '').trim() === target) {
      records.splice(index, 1);
    }
  }

  const removed = before - records.length;
  if (removed > 0) {
    persistRecords();
  }

  return removed;
}

module.exports = {
  listRecords,
  addRecord,
  removeRecord,
  clearRecords,
  removeRecordsByChatId,
};
