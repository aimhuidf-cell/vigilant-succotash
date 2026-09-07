const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'custom-commands.json');

const ALLOWED_CATEGORIES = ['General', 'Greeting', 'Info', 'Utility', 'Fun', 'Media', 'Other'];
const ALLOWED_MEDIA_TYPES = ['image', 'video', 'audio', 'document'];
const DISABLED_TRIGGERS = new Set(['.ytmp3', '.ytmp4', '.facebook', '.instagram', '.fb', '.ig', '!ytmp3', '!ytmp4', '!facebook', '!instagram', '!fb', '!ig']);
const REMOVED_DEFAULT_TRIGGERS = new Set(['.menuedit', '.editreply', '!menuedit', '!editreply']);
const DEFAULT_COMMANDS = [
  {
    trigger: '.alive',
    response: '✅ Bot is alive and running.',
    description: 'Check bot online status quickly',
    category: 'Utility',
    createdAt: new Date().toISOString(),
  },
  {
    trigger: '.vv',
    response: 'Reply to a view-once image/video message with .vv to reopen the media.',
    description: 'Open quoted view-once media',
    category: 'Utility',
    createdAt: new Date().toISOString(),
  },
  {
    trigger: '.sticker',
    response: '🧩 Buat sticker. Usage: reply/kirim gambar/video lalu ketik .sticker',
    description: 'Create sticker from image/video',
    category: 'Media',
    createdAt: new Date().toISOString(),
  },
  {
    trigger: '.timesolat',
    response: '🕌 Usage: .timesolat on | off | status\nAktifkan notifikasi automatik bila masuk waktu solat untuk chat ini.',
    description: 'Toggle auto notifikasi waktu solat',
    category: 'Utility',
    createdAt: new Date().toISOString(),
  },
  {
    trigger: '.menu1',
    response: 'Contoh quick reply 1 button. Tekan button di bawah.',
    description: 'Demo quick reply 1 button',
    category: 'Utility',
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          id: '.alive',
          display_text: 'Check bot',
        }),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    trigger: '.menucombo',
    response: 'Demo gabungan quick reply + single select. Cuba tekan salah satu pilihan di bawah.',
    description: 'Demo quick reply dan single select dalam satu command',
    category: 'Utility',
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          id: '.alive',
          display_text: 'Quick: Alive',
        }),
      },
      {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: 'Single Select Menu',
          sections: [
            {
              title: 'Pilihan',
              rows: [
                {
                  id: '.vv',
                  title: 'Single: View Once',
                  description: 'Trigger .vv',
                },
              ],
            },
          ],
        }),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    trigger: '.demobutton',
    response: 'Demo button interaktif: Quick Reply + Single Select. Pilih mana-mana pilihan di bawah.',
    description: 'Demo rasmi quick reply dan single select',
    category: 'Utility',
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          id: '.alive',
          display_text: 'Quick Reply: Alive',
        }),
      },
      {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: 'Single Select Menu',
          sections: [
            {
              title: 'Demo Options',
              rows: [
                {
                  id: '.menu1',
                  title: 'Row 1: Menu Quick Reply',
                  description: 'Trigger .menu1',
                },
                {
                  id: '.alive',
                  title: 'Row 2: Alive',
                  description: 'Trigger .alive',
                },
              ],
            },
          ],
        }),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    trigger: '.testbutton',
    response: '✅ Tahniah! Button berfungsi. Tekan salah satu button di bawah untuk cuba yang lain.',
    description: 'Test button - pastikan button working',
    category: 'Utility',
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          id: '.menu1',
          display_text: 'Quick Reply Test',
        }),
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

function loadCommands() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function persistCommands() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(commands, null, 2));
  } catch (error) {
    console.error('[CustomCommandStore] Failed to persist commands:', error.message);
  }
}

const commands = loadCommands();

function ensureDefaultCommands() {
  let changed = false;

  for (const fallback of DEFAULT_COMMANDS) {
    const key = normalizeTrigger(fallback.trigger);
    if (!key) continue;

    const existing = commands.find((item) => item.trigger === key);
    if (!existing) {
      const entry = {
        trigger: key,
        response: String(fallback.response || '').trim(),
        description: String(fallback.description || '').trim(),
        category: normalizeCategory(fallback.category),
        createdAt: fallback.createdAt || new Date().toISOString(),
      };

      if (Array.isArray(fallback.buttons) && fallback.buttons.length) {
        entry.buttons = fallback.buttons;
      }

      commands.push(entry);
      changed = true;
      continue;
    }

    if (key === '.menucombo' || key === '.demobutton') {
      const desiredButtons = JSON.stringify(fallback.buttons || []);
      const currentButtons = JSON.stringify(existing.buttons || []);
      const nextResponse = String(fallback.response || '').trim();
      const nextDescription = String(fallback.description || '').trim();
      const nextCategory = normalizeCategory(fallback.category);

      if (existing.response !== nextResponse) {
        existing.response = nextResponse;
        changed = true;
      }
      if (existing.description !== nextDescription) {
        existing.description = nextDescription;
        changed = true;
      }
      if (existing.category !== nextCategory) {
        existing.category = nextCategory;
        changed = true;
      }
      if (currentButtons !== desiredButtons) {
        existing.buttons = fallback.buttons || [];
        changed = true;
      }
    }
  }

  if (changed) {
    persistCommands();
  }
}

ensureDefaultCommands();
migrateLegacyTriggers();
purgeRemovedDefaultCommands();
purgeDisabledCommands();

function normalizeCategory(value) {
  const raw = String(value || '').trim();
  return ALLOWED_CATEGORIES.includes(raw) ? raw : 'General';
}

function normalizeTrigger(value) {
  const clean = String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  return clean;
}

function normalizeStoredTrigger(value) {
  const key = normalizeTrigger(value);
  if (!key) return '';
  if (key.startsWith('.')) return key;
  if (key.startsWith('!')) return `.${key.slice(1)}`;
  return `.${key.replace(/^[^a-z0-9]+/, '')}`;
}

function migrateLegacyTriggers() {
  let changed = false;
  const deduped = [];
  const seen = new Set();

  for (const item of commands) {
    if (!item || typeof item !== 'object') continue;

    const normalized = normalizeStoredTrigger(item.trigger);
    if (!normalized || seen.has(normalized)) {
      changed = true;
      continue;
    }

    if (item.trigger !== normalized) {
      changed = true;
    }

    seen.add(normalized);
    deduped.push({
      ...item,
      trigger: normalized,
      category: normalizeCategory(item.category),
      response: String(item.response || '').trim(),
      description: String(item.description || '').trim(),
    });
  }

  if (!changed) return;

  commands.length = 0;
  commands.push(...deduped);
  persistCommands();
}

function purgeDisabledCommands() {
  const kept = commands.filter((item) => !DISABLED_TRIGGERS.has(normalizeTrigger(item?.trigger)));
  if (kept.length === commands.length) return;

  commands.length = 0;
  commands.push(...kept);
  persistCommands();
}

function purgeRemovedDefaultCommands() {
  const kept = commands.filter((item) => !REMOVED_DEFAULT_TRIGGERS.has(normalizeTrigger(item?.trigger)));
  if (kept.length === commands.length) return;

  commands.length = 0;
  commands.push(...kept);
  persistCommands();
}

function normalizeButtons(buttons) {
  if (buttons == null || buttons === '') return undefined;

  let parsed = buttons;
  if (typeof parsed === 'string') {
    const raw = parsed.trim();
    if (!raw) return undefined;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error('Buttons must be valid JSON');
    }
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Buttons must be an array');
  }

  const cleaned = parsed
    .filter((item) => item && typeof item === 'object' && item.name)
    .map((item) => ({
      name: String(item.name),
      buttonParamsJson:
        typeof item.buttonParamsJson === 'string'
          ? item.buttonParamsJson
          : JSON.stringify(item.buttonParamsJson || {}),
    }));

  return cleaned.length ? cleaned : undefined;
}

function listCommands() {
  return [...commands];
}

function findCommand(trigger) {
  const key = normalizeTrigger(trigger);
  return commands.find((item) => item.trigger === key) || null;
}

function matchCommand(text) {
  const lower = String(text || '').trim().toLowerCase();
  if (!lower) return null;

  return (
    commands.find((item) => {
      return lower === item.trigger || lower.startsWith(`${item.trigger} `);
    }) || null
  );
}

function createCommand(payload) {
  const { trigger, response, description, category, mediaUrl, mediaType, fileName, buttons } = payload;
  const cleanResponse = String(response || '').trim();
  const cleanMediaUrl = String(mediaUrl || '').trim();
  const parsedButtons = normalizeButtons(buttons);

  const cleanTrigger = normalizeTrigger(trigger);
  if (!cleanTrigger) throw new Error('Trigger is required');
  if (!cleanTrigger.startsWith('.')) {
    throw new Error('Trigger must start with . (example: .hello)');
  }
  if (DISABLED_TRIGGERS.has(cleanTrigger)) {
    throw new Error(`Command ${cleanTrigger} is disabled`);
  }

  if (!cleanResponse && !cleanMediaUrl) {
    throw new Error('At least a response text or media URL is required');
  }

  if (!cleanResponse && cleanMediaUrl && parsedButtons) {
    throw new Error('Response text is required when using media with buttons');
  }

  if (findCommand(cleanTrigger)) {
    throw new Error(`Command ${cleanTrigger} already exists`);
  }

  const entry = {
    trigger: cleanTrigger,
    response: cleanResponse,
    description: String(description || '').trim(),
    category: normalizeCategory(category),
    createdAt: new Date().toISOString(),
  };

  if (cleanMediaUrl) {
    const type = String(mediaType || 'image').trim();
    if (!ALLOWED_MEDIA_TYPES.includes(type)) {
      throw new Error('Invalid media type');
    }
    entry.mediaUrl = cleanMediaUrl;
    entry.mediaType = type;
  }

  if (fileName && String(fileName).trim()) {
    entry.fileName = String(fileName).trim();
  }

  if (parsedButtons) entry.buttons = parsedButtons;

  commands.push(entry);
  persistCommands();
  return entry;
}

function updateCommand(trigger, payload) {
  const key = normalizeTrigger(trigger);
  const target = commands.find((item) => item.trigger === key);
  if (!target) throw new Error('Command not found');

  const { response, description, category, mediaUrl, mediaType, fileName, buttons } = payload;
  const cleanResponse = String(response || '').trim();
  const cleanMediaUrl = String(mediaUrl || '').trim();
  const parsedButtons = normalizeButtons(buttons);

  if (!cleanResponse && !cleanMediaUrl) {
    throw new Error('At least a response text or media URL is required');
  }

  if (!cleanResponse && cleanMediaUrl && parsedButtons) {
    throw new Error('Response text is required when using media with buttons');
  }

  target.response = cleanResponse;
  target.description = String(description || '').trim();
  target.category = normalizeCategory(category);

  if (cleanMediaUrl) {
    const type = String(mediaType || 'image').trim();
    if (!ALLOWED_MEDIA_TYPES.includes(type)) {
      throw new Error('Invalid media type');
    }
    target.mediaUrl = cleanMediaUrl;
    target.mediaType = type;
  } else {
    delete target.mediaUrl;
    delete target.mediaType;
  }

  if (fileName && String(fileName).trim()) {
    target.fileName = String(fileName).trim();
  } else {
    delete target.fileName;
  }

  if (parsedButtons) target.buttons = parsedButtons;
  else delete target.buttons;

  persistCommands();
  return target;
}

function removeCommand(trigger) {
  const key = normalizeTrigger(trigger);
  const index = commands.findIndex((item) => item.trigger === key);
  if (index === -1) return false;

  commands.splice(index, 1);
  persistCommands();
  return true;
}

module.exports = {
  ALLOWED_CATEGORIES,
  ALLOWED_MEDIA_TYPES,
  listCommands,
  findCommand,
  matchCommand,
  createCommand,
  updateCommand,
  removeCommand,
};
