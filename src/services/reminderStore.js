const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'reminders.json');

function normalizeDate(value) {
  const date = String(value || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
}

function normalizeTime(value) {
  const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return '09:00';
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return '09:00';
  return `${String(hour).padStart(2, '0')}:${match[2]}`;
}

function normalizeDays(value) {
  const values = Array.isArray(value) ? value : String(value || '').split(',');
  const days = [...new Set(values.map(Number).filter((day) => Number.isInteger(day) && day >= 0 && day <= 365))];
  return days.length ? days.sort((a, b) => b - a) : [10];
}

function normalizeChats(value) {
  const values = Array.isArray(value) ? value : String(value || '').split(/[\n,]+/);
  return [...new Set(values
    .map((item) => String(item || '').trim())
    .map((item) => {
      if (!item) return '';
      if (item.includes('@')) return item;
      const digits = item.replace(/\D/g, '');
      return digits ? `${digits}@s.whatsapp.net` : '';
    })
    .filter(Boolean))];
}

function normalizeReminder(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return {
    id: String(source.id || crypto.randomUUID()),
    name: String(source.name || '').trim(),
    date: normalizeDate(source.date),
    time: normalizeTime(source.time),
    earlyDays: normalizeDays(source.earlyDays),
    targetChats: normalizeChats(source.targetChats),
    sentOffsets: Array.isArray(source.sentOffsets) ? source.sentOffsets.map(Number).filter(Number.isInteger) : [],
  };
}

function loadItems() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed.map(normalizeReminder).filter((item) => item.name && item.date) : [];
  } catch (error) {
    return [];
  }
}

let items = loadItems();

function persist() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

function listReminders() {
  removeExpiredReminders();
  return items.map((item) => ({ ...item, earlyDays: [...item.earlyDays], targetChats: [...item.targetChats], sentOffsets: [...item.sentOffsets] }));
}

function removeExpiredReminders(dateKey = new Date().toISOString().slice(0, 10)) {
  const remaining = items.filter((item) => item.date >= dateKey);
  if (remaining.length === items.length) return 0;

  const removedCount = items.length - remaining.length;
  items = remaining;
  persist();
  return removedCount;
}

function createReminder(payload) {
  const reminder = normalizeReminder(payload);
  if (!reminder.name || !reminder.date || !reminder.targetChats.length) {
    throw new Error('name, date, and at least one target chat are required');
  }
  items.push(reminder);
  persist();
  return reminder;
}

function updateReminder(id, payload) {
  const index = items.findIndex((item) => item.id === String(id || '').trim());
  if (index < 0) throw new Error('Reminder not found');
  const reminder = normalizeReminder({ ...items[index], ...payload, id: items[index].id, sentOffsets: [] });
  if (!reminder.name || !reminder.date || !reminder.targetChats.length) {
    throw new Error('name, date, and at least one target chat are required');
  }
  items[index] = reminder;
  persist();
  return reminder;
}

function removeReminder(id) {
  const index = items.findIndex((item) => item.id === String(id || '').trim());
  if (index < 0) return false;
  items.splice(index, 1);
  persist();
  return true;
}

function replaceReminder(id, reminder) {
  const index = items.findIndex((item) => item.id === String(id || '').trim());
  if (index < 0) return false;
  items[index] = normalizeReminder(reminder);
  persist();
  return true;
}

module.exports = {
  listReminders,
  removeExpiredReminders,
  createReminder,
  updateReminder,
  removeReminder,
  replaceReminder,
};