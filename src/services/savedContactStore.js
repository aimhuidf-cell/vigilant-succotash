const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'saved-contacts.json');
const ALLOWED_CATEGORIES = ['Customer', 'Supplier', 'Support', 'Other'];

function normalizeCategory(value) {
  const raw = String(value || '').trim();
  return ALLOWED_CATEGORIES.includes(raw) ? raw : 'Other';
}

function normalizePhone(value) {
  const raw = String(value || '').trim();
  const digits = raw.replace(/[^\d+]/g, '');
  return digits;
}

function normalizeContact(item) {
  if (!item || typeof item !== 'object') return null;

  const name = String(item.name || '').trim();
  const phone = normalizePhone(item.phone);
  if (!name || !phone) return null;

  return {
    id: String(item.id || randomUUID()).trim(),
    name,
    phone,
    category: normalizeCategory(item.category),
    note: String(item.note || '').trim(),
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

function loadContacts() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeContact).filter(Boolean);
  } catch (error) {
    return [];
  }
}

let contacts = loadContacts();

function persist() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));
}

function listContacts() {
  return [...contacts];
}

function findContact(id) {
  const key = String(id || '').trim();
  return contacts.find((item) => item.id === key) || null;
}

function createContact(payload) {
  const normalized = normalizeContact({ ...payload, id: undefined });
  if (!normalized) {
    throw new Error('Name and phone number are required');
  }

  const duplicate = contacts.some((item) => item.phone === normalized.phone);
  if (duplicate) {
    throw new Error('A contact with this phone number already exists');
  }

  contacts.push(normalized);
  persist();
  return normalized;
}

function updateContact(id, payload) {
  const key = String(id || '').trim();
  const index = contacts.findIndex((item) => item.id === key);
  if (index === -1) {
    throw new Error('Contact not found');
  }

  const merged = normalizeContact({ ...contacts[index], ...payload, id: key });
  if (!merged) {
    throw new Error('Name and phone number are required');
  }

  const duplicate = contacts.some((item) => item.id !== key && item.phone === merged.phone);
  if (duplicate) {
    throw new Error('A contact with this phone number already exists');
  }

  contacts[index] = merged;
  persist();
  return merged;
}

function removeContact(id) {
  const key = String(id || '').trim();
  const index = contacts.findIndex((item) => item.id === key);
  if (index === -1) return false;

  contacts.splice(index, 1);
  persist();
  return true;
}

function findMatches(query) {
  const needle = String(query || '').trim().toLowerCase();
  if (!needle) return listContacts();

  return contacts.filter((item) => {
    const haystack = `${item.name} ${item.phone} ${item.category} ${item.note}`.toLowerCase();
    return haystack.includes(needle);
  });
}

module.exports = {
  ALLOWED_CATEGORIES,
  listContacts,
  findContact,
  createContact,
  updateContact,
  removeContact,
  findMatches,
};
