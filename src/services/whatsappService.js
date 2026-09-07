const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const qrcode = require('qrcode');
const pino = require('pino');
const baileys = require('atexovi-baileys');
const ytSearch = require('yt-search');
const ffmpegPath = require('ffmpeg-static');

const customCommandStore = require('./customCommandStore');
const botPermissionStore = require('./botPermissionStore');
const deletedMessageStore = require('./deletedMessageStore');
const prayerReminderStore = require('./prayerReminderStore');
const reminderStore = require('./reminderStore');
const savedContactStore = require('./savedContactStore');
const { sendInteractiveButtons } = require('../lib/interactiveButtons');

const uploadDir = path.join(process.cwd(), 'uploads');
const tempDir = path.join(uploadDir, 'tmp');
const execFileAsync = promisify(execFile);

const PRAYER_TIMEZONE = String(process.env.BOT_PRAYER_TIMEZONE || 'Asia/Kuala_Lumpur').trim() || 'Asia/Kuala_Lumpur';
const PRAYER_CITY = String(process.env.BOT_PRAYER_CITY || 'Kuala Lumpur').trim() || 'Kuala Lumpur';
const PRAYER_COUNTRY = String(process.env.BOT_PRAYER_COUNTRY || 'Malaysia').trim() || 'Malaysia';
const PRAYER_METHOD = String(process.env.BOT_PRAYER_METHOD || '3').trim() || '3';
const PRAYER_CHECK_INTERVAL_MS = 30 * 1000;
const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABELS_MS = {
  Fajr: 'Subuh',
  Dhuhr: 'Zohor',
  Asr: 'Asar',
  Maghrib: 'Maghrib',
  Isha: 'Isyak',
};
const prayerTimesCache = new Map();

const makeWASocket = baileys.default;
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  normalizeMessageContent,
  downloadContentFromMessage,
  bytesToCrockford,
} = baileys;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripCommandPrefix(text) {
  return String(text || '').replace(/^[!.][^\s]+\s*/i, '').trim();
}

function parseStickerCommandFlags(text) {
  const normalized = String(text || '').trim().toLowerCase();
  return {
    removeBackground: /(^|\s)(nobg|no-bg|transparent|cutout)(\s|$)/i.test(normalized),
  };
}

function getDateContextInTimeZone(timeZone, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { dateKey: `${lookup.year}-${lookup.month}-${lookup.day}` };
}

function getClockContextInTimeZone(timeZone, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const timeKey = `${lookup.hour}:${lookup.minute}`;
  return { ...getDateContextInTimeZone(timeZone, now), timeKey };
}

function normalizePrayerClockValue(value) {
  const match = String(value || '').match(/(\d{1,2}):(\d{2})/);
  if (!match) return '';
  return `${String(match[1]).padStart(2, '0')}:${match[2]}`;
}

async function fetchPrayerTimesForDate(dateContext) {
  const dateKey = dateContext?.dateKey || '';
  if (!dateKey) return null;

  const cacheKey = `${PRAYER_TIMEZONE}|${dateKey}|${PRAYER_CITY}|${PRAYER_COUNTRY}|${PRAYER_METHOD}`;
  const cached = prayerTimesCache.get(cacheKey);
  if (cached) return cached;

  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(PRAYER_CITY)}&country=${encodeURIComponent(PRAYER_COUNTRY)}&method=${encodeURIComponent(PRAYER_METHOD)}&date=${encodeURIComponent(dateKey.split('-').reverse().join('-'))}`;
  const data = await fetchJsonWithTimeout(url, 15000);

  const timings = data?.data?.timings;
  if (!timings || typeof timings !== 'object') return null;

  const result = {};
  for (const prayerName of PRAYER_NAMES) {
    result[prayerName] = normalizePrayerClockValue(timings[prayerName]);
  }

  prayerTimesCache.set(cacheKey, result);
  return result;
}

function normalizeInteractiveTrigger(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  if (raw.startsWith('.')) return raw;
  if (raw.startsWith('!')) return `.${raw.slice(1)}`;

  const cleaned = raw.replace(/^[^a-z0-9]+/, '');
  if (!cleaned) return '';
  return `.${cleaned}`;
}

function pickInteractiveSelectionFromParsedParams(parsed) {
  if (!parsed || typeof parsed !== 'object') return '';

  const directCandidates = [
    parsed.selected_id,
    parsed.selectedId,
    parsed.selected_row_id,
    parsed.selectedRowId,
    parsed.single_select_reply?.selected_row_id,
    parsed.single_select_reply?.selectedRowId,
    parsed.singleSelectReply?.selected_row_id,
    parsed.singleSelectReply?.selectedRowId,
    parsed.button_id,
    parsed.buttonId,
    parsed.quick_reply_id,
    parsed.quickReplyId,
    parsed.row_id,
    parsed.rowId,
    parsed.id,
    // Additional fallback candidates for native flow responses
    parsed.button?.id,
    parsed.button?.buttonId,
    parsed.reply?.id,
    parsed.button_reply?.id,
  ];

  for (const candidate of directCandidates) {
    const value = String(candidate || '').trim();
    if (value) return value;
  }

  // Some clients can send compact payloads with an unusual key shape.
  // Search nested values and return the first non-empty scalar string.
  const queue = [parsed];
  const seen = new Set();

  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if (seen.has(current)) continue;
    seen.add(current);

    for (const [key, value] of Object.entries(current)) {
      const keyLower = String(key || '').toLowerCase();
      if (['name', 'title', 'display_text', 'description', 'footer', 'body', 'text', 'message'].includes(keyLower)) {
        continue;
      }

      if (typeof value === 'string') {
        const cleaned = value.trim();
        if (cleaned) return cleaned;
        continue;
      }

      if (value && typeof value === 'object') {
        queue.push(value);
      }
    }
  }

  return '';
}

function isLikelyUrl(value) {
  try {
    const parsed = new URL(String(value || '').trim());
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (error) {
    return false;
  }
}

function parseYouTubeInput(input) {
  try {
    const raw = String(input || '').trim();
    if (!raw) return null;

    const url = new URL(raw);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
    const isYoutubeHost = hostname === 'youtu.be'
      || hostname === 'youtube.com'
      || hostname === 'music.youtube.com'
      || hostname.endsWith('.youtube.com')
      || hostname.endsWith('youtube-nocookie.com');

    if (!isYoutubeHost) return null;

    const parts = url.pathname.split('/').filter(Boolean);
    let videoId = '';

    if (hostname === 'youtu.be') {
      videoId = parts[0] || '';
    } else if (url.searchParams.get('v')) {
      videoId = url.searchParams.get('v') || '';
    } else if (['shorts', 'embed', 'live', 'v'].includes(parts[0])) {
      videoId = parts[1] || '';
    } else if (parts[0] && /^[a-zA-Z0-9_-]{11}$/.test(parts[0])) {
      videoId = parts[0];
    }

    if (videoId && !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      videoId = '';
    }

    return {
      videoId,
      playlistOnly: Boolean(url.searchParams.get('list')) && !videoId,
      canonicalUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : raw,
    };
  } catch (error) {
    return null;
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJsonWithTimeout(url, timeoutMs = 30000) {
  const response = await fetchWithTimeout(url, {}, timeoutMs);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

function sanitizeFileName(value, fallback) {
  const clean = String(value || '').replace(/[\\/:*?"<>|]+/g, '').trim();
  return clean || fallback;
}

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

function normalizeConnectedJid(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const atIndex = raw.indexOf('@');
  if (atIndex === -1) return raw;

  const localPart = raw.slice(0, atIndex);
  const domain = raw.slice(atIndex + 1);
  const cleanLocal = localPart.split(':')[0] || localPart;
  return `${cleanLocal}@${domain}`;
}

function isLidJid(value) {
  return normalizeConnectedJid(value).toLowerCase().endsWith('@lid');
}

function extractPhoneFromJid(value) {
  const normalized = normalizeConnectedJid(value);
  if (!normalized) return '';
  const local = normalized.split('@')[0] || '';
  return local.replace(/\D/g, '');
}

function extractDownloadUrlFromPayload(data) {
  if (!data || typeof data !== 'object') return '';

  const candidates = [
    data?.downloadURL,
    data?.download_url,
    data?.dl,
    data?.url,
    data?.result?.url,
    data?.result?.download,
    data?.result?.dl,
    data?.result?.mp3,
    data?.result?.mp4,
    data?.result?.audio,
    data?.result?.video,
    data?.data?.url,
    data?.data?.download,
    data?.data?.download_url,
    data?.data?.dl,
    data?.data?.mp3,
    data?.data?.mp4,
  ];

  for (const candidate of candidates) {
    if (isHttpUrl(candidate)) return String(candidate).trim();
  }

  return '';
}

function extractAudioDownloadUrlFromPayload(data) {
  if (!data || typeof data !== 'object') return '';

  const candidates = [
    data?.audio,
    data?.audioUrl,
    data?.audio_url,
    data?.mp3,
    data?.result?.audio,
    data?.result?.audioUrl,
    data?.result?.audio_url,
    data?.result?.dl_audio,
    data?.result?.mp3,
    data?.result?.download?.audio,
    data?.result?.download?.mp3,
    data?.data?.audio,
    data?.data?.audioUrl,
    data?.data?.audio_url,
    data?.data?.dl_audio,
    data?.data?.mp3,
    data?.data?.download?.audio,
    data?.data?.download?.mp3,
  ];

  for (const candidate of candidates) {
    if (isHttpUrl(candidate)) return String(candidate).trim();
  }

  return extractDownloadUrlFromPayload(data);
}

function extractTitleFromPayload(data) {
  if (!data || typeof data !== 'object') return '';

  const candidates = [
    data?.title,
    data?.result?.title,
    data?.data?.title,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return '';
}

function toMillis(value) {
  if (value == null) return 0;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value < 1e12 ? Math.floor(value * 1000) : Math.floor(value);
  }

  if (typeof value === 'string') {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return numeric < 1e12 ? Math.floor(numeric * 1000) : Math.floor(numeric);
    }
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (typeof value === 'bigint') {
    const numeric = Number(value);
    return Number.isFinite(numeric)
      ? (numeric < 1e12 ? Math.floor(numeric * 1000) : Math.floor(numeric))
      : 0;
  }

  if (typeof value === 'object') {
    if (typeof value.toNumber === 'function') {
      const numeric = Number(value.toNumber());
      if (Number.isFinite(numeric)) {
        return numeric < 1e12 ? Math.floor(numeric * 1000) : Math.floor(numeric);
      }
    }

    if (typeof value.low === 'number') {
      const numeric = Number(value.low);
      if (Number.isFinite(numeric)) {
        return numeric < 1e12 ? Math.floor(numeric * 1000) : Math.floor(numeric);
      }
    }
  }

  return 0;
}

function getChatTypeFromJid(jid) {
  const raw = String(jid || '').trim();
  if (raw.endsWith('@g.us')) return 'group';
  if (raw.endsWith('@s.whatsapp.net')) return 'personal';
  return 'other';
}

function normalizeInboxMediaUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('/')) return raw;
  return '';
}

function summarizeMessageForInbox(content) {
  if (!content || typeof content !== 'object') {
    return {
      text: '',
      type: 'unknown',
      mediaUrl: '',
      fileName: '',
      mimeType: '',
      isVoiceNote: false,
      durationSeconds: null,
    };
  }

  const imageMessage = content.imageMessage || null;
  const videoMessage = content.videoMessage || null;
  const audioMessage = content.audioMessage || null;
  const documentMessage = content.documentMessage || null;

  let detectedType = 'text';
  let mediaUrl = '';
  let fileName = '';
  let mimeType = '';
  let isVoiceNote = false;
  let durationSeconds = null;

  if (imageMessage) {
    detectedType = 'image';
    mediaUrl = normalizeInboxMediaUrl(imageMessage.url);
    mimeType = String(imageMessage.mimetype || '').trim();
  } else if (videoMessage) {
    detectedType = 'video';
    mediaUrl = normalizeInboxMediaUrl(videoMessage.url);
    mimeType = String(videoMessage.mimetype || '').trim();
    durationSeconds = Number.isFinite(Number(videoMessage.seconds))
      ? Number(videoMessage.seconds)
      : null;
  } else if (audioMessage) {
    isVoiceNote = Boolean(audioMessage.ptt);
    detectedType = isVoiceNote ? 'voice' : 'audio';
    mediaUrl = normalizeInboxMediaUrl(audioMessage.url);
    mimeType = String(audioMessage.mimetype || '').trim();
    durationSeconds = Number.isFinite(Number(audioMessage.seconds))
      ? Number(audioMessage.seconds)
      : null;
  } else if (documentMessage) {
    detectedType = 'document';
    mediaUrl = normalizeInboxMediaUrl(documentMessage.url);
    fileName = String(documentMessage.fileName || '').trim();
    mimeType = String(documentMessage.mimetype || '').trim();
  }

  const textCandidates = [
    content.conversation,
    content.extendedTextMessage?.text,
    content.imageMessage?.caption,
    content.videoMessage?.caption,
    content.documentMessage?.caption,
    content.buttonsResponseMessage?.selectedDisplayText,
    content.buttonsResponseMessage?.selectedButtonId,
    content.templateButtonReplyMessage?.selectedDisplayText,
    content.templateButtonReplyMessage?.selectedId,
    content.listResponseMessage?.title,
    content.listResponseMessage?.singleSelectReply?.selectedRowId,
  ];

  for (const candidate of textCandidates) {
    const value = String(candidate || '').trim();
    if (value) {
      return {
        text: value,
        type: detectedType === 'text' ? 'text' : detectedType,
        mediaUrl,
        fileName,
        mimeType,
        isVoiceNote,
        durationSeconds,
      };
    }
  }

  if (imageMessage) {
    return {
      text: '[Image]',
      type: 'image',
      mediaUrl,
      fileName,
      mimeType,
      isVoiceNote,
      durationSeconds,
    };
  }

  if (videoMessage) {
    return {
      text: '[Video]',
      type: 'video',
      mediaUrl,
      fileName,
      mimeType,
      isVoiceNote,
      durationSeconds,
    };
  }

  if (audioMessage) {
    return {
      text: isVoiceNote ? '[Voice Note]' : '[Audio]',
      type: isVoiceNote ? 'voice' : 'audio',
      mediaUrl,
      fileName,
      mimeType,
      isVoiceNote,
      durationSeconds,
    };
  }

  if (documentMessage) {
    return {
      text: fileName || '[Document]',
      type: 'document',
      mediaUrl,
      fileName,
      mimeType,
      isVoiceNote,
      durationSeconds,
    };
  }

  if (content.stickerMessage) {
    return {
      text: '[Sticker]',
      type: 'sticker',
      mediaUrl: '',
      fileName: '',
      mimeType: '',
      isVoiceNote: false,
      durationSeconds: null,
    };
  }

  if (content.contactMessage || content.contactsArrayMessage) {
    return {
      text: '[Contact]',
      type: 'contact',
      mediaUrl: '',
      fileName: '',
      mimeType: '',
      isVoiceNote: false,
      durationSeconds: null,
    };
  }

  if (content.locationMessage || content.liveLocationMessage) {
    return {
      text: '[Location]',
      type: 'location',
      mediaUrl: '',
      fileName: '',
      mimeType: '',
      isVoiceNote: false,
      durationSeconds: null,
    };
  }

  if (content.pollCreationMessage || content.pollCreationMessageV3) {
    return {
      text: '[Poll]',
      type: 'poll',
      mediaUrl: '',
      fileName: '',
      mimeType: '',
      isVoiceNote: false,
      durationSeconds: null,
    };
  }

  return {
    text: '[Unsupported message]',
    type: 'unknown',
    mediaUrl: '',
    fileName: '',
    mimeType: '',
    isVoiceNote: false,
    durationSeconds: null,
  };
}

class WhatsAppService {
  constructor() {
    this.sock = null;
    this.qrCodeDataUrl = null;
    this.profilePictureUrl = '';
    this.ready = false;
    this.lastStatus = 'Initializing...';
    this.reconnectTimer = null;
    this.isInitializing = false;
    this.reconnectAttempts = 0;
    this.initPromise = null;
    this.authPath = path.join(process.cwd(), '.baileys_auth');
    this.defaultDialCode = String(process.env.DEFAULT_DIAL_CODE || '60').replace(/\D/g, '') || '60';
    this.debugInteractive = process.env.WA_DEBUG_INTERACTIVE === '1';
    this.pairingCode = null;
    this.isRequestingPairingCode = false;
    this.store = null;
    this.recentDeletedCaptureIds = [];
    this.recentDeletedCaptureLimit = 200;
    this.recentMessageCache = new Map();
    this.recentMessageCacheWindowMs = 5 * 60 * 1000;
    this.recentMessageCacheLimit = 5000;
    this.prayerReminderInterval = null;
  }

  makeRecentMessageCacheKey(chatId, messageId) {
    const chat = String(chatId || '').trim();
    const id = String(messageId || '').trim();
    if (!chat || !id) return '';
    return `${chat}|${id}`;
  }

  cacheRecentMessage(chatId, message) {
    const cacheKey = this.makeRecentMessageCacheKey(chatId, message?.key?.id);
    if (!cacheKey || !message?.message) return;

    this.recentMessageCache.set(cacheKey, {
      message: message.message,
      pushName: message.pushName || '',
      messageTimestamp: message.messageTimestamp,
      participant: message.key?.participant || '',
      cachedAt: Date.now(),
    });

    if (this.recentMessageCache.size > this.recentMessageCacheLimit) {
      const now = Date.now();
      for (const [storedKey, entry] of this.recentMessageCache.entries()) {
        if ((now - Number(entry?.cachedAt || 0)) > this.recentMessageCacheWindowMs) {
          this.recentMessageCache.delete(storedKey);
        }
      }
    }
  }

  getRecentMessage(chatId, messageId) {
    const cacheKey = this.makeRecentMessageCacheKey(chatId, messageId);
    if (!cacheKey) return null;

    const entry = this.recentMessageCache.get(cacheKey);
    if (!entry) return null;

    if ((Date.now() - Number(entry.cachedAt || 0)) > this.recentMessageCacheWindowMs) {
      this.recentMessageCache.delete(cacheKey);
      return null;
    }

    return entry;
  }

  logInteractiveDebug(message, details = null) {
    if (!this.debugInteractive) return;

    if (details == null) {
      console.log(`[WA][interactive] ${message}`);
      return;
    }

    try {
      console.log(`[WA][interactive] ${message}:`, JSON.stringify(details));
    } catch (error) {
      console.log(`[WA][interactive] ${message}:`, details);
    }
  }

  async init() {
    if (this.initPromise) return this.initPromise;
    if (this.isInitializing) return;

    this.isInitializing = true;
    this.lastStatus = 'Starting WhatsApp client...';

    this.initPromise = this.startSocket()
      .catch((error) => {
        this.lastStatus = `Initialization failed: ${error.message}`;
        this.ready = false;
        this.isInitializing = false;
        console.error('[WA] Initialization error:', error.message);
        this.scheduleReinitialize('initialize_error');
      })
      .finally(() => {
        this.initPromise = null;
      });

    return this.initPromise;
  }

  async startSocket() {
    fs.mkdirSync(this.authPath, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(this.authPath);

    let version;
    try {
      ({ version } = await fetchLatestBaileysVersion());
    } catch (error) {
      console.warn('[WA] Failed to fetch latest WA version, using fallback');
    }

    const socketLogger = pino({ level: 'silent' });
    if (!this.store) {
      this.store = makeInMemoryStore({ logger: socketLogger });
    }

    this.sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, socketLogger),
      },
      logger: socketLogger,
      browser: ['ScheduleBot', 'Desktop', '1.0.0'],
      printQRInTerminal: false,
      connectTimeoutMs: Number(process.env.WA_CONNECT_TIMEOUT_MS || 60000),
      keepAliveIntervalMs: 15000,
      defaultQueryTimeoutMs: Number(process.env.WA_QUERY_TIMEOUT_MS || 60000),
      version,
    });
    const currentSocket = this.sock;

    this.store.bind(currentSocket.ev);

    currentSocket.ev.on('creds.update', saveCreds);

    currentSocket.ev.on('messages.upsert', async (event) => {
      try {
        await this.handleIncomingMessages(event);
      } catch (error) {
        console.error('[WA] Failed to handle incoming message:', error.message);
      }
    });

    currentSocket.ev.on('messages.update', async (updates) => {
      try {
        await this.handleMessageUpdates(updates);
      } catch (error) {
        console.error('[WA] Failed to handle message update:', error.message);
      }
    });

    currentSocket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        this.qrCodeDataUrl = await qrcode.toDataURL(qr);
        this.lastStatus = 'Scan QR from dashboard';
        this.ready = false;
        this.isInitializing = false;
      }

      if (connection === 'connecting' && !qr) {
        this.lastStatus = 'Connecting to WhatsApp...';
      }

      if (connection === 'open') {
        this.lastStatus = 'WhatsApp connected';
        const wasReady = this.ready;
        this.ready = true;
        this.isInitializing = false;
        this.reconnectAttempts = 0;
        this.qrCodeDataUrl = null;
        this.pairingCode = null;
        this.profilePictureUrl = '';
        this.refreshProfilePicture(currentSocket).catch((error) => {
          console.warn('[WA] Unable to load profile picture:', error.message);
        });
        this.startPrayerReminderLoop();
        this.startReminderLoop();
        if (!wasReady) {
          console.log('[WA] Client ready');
        }
      }

      if (connection === 'close') {
        if (currentSocket !== this.sock) {
          return;
        }

        this.ready = false;
        this.isInitializing = false;

        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const disconnectReason = this.describeDisconnectReason(statusCode);
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401;
        const isAuthInvalid = statusCode === 405;
        const isRestartRequired = statusCode === DisconnectReason.restartRequired;
        this.lastStatus = `Disconnected: ${disconnectReason}`;
        console.error('[WA] Disconnected event:', disconnectReason);

        if (isLoggedOut || isAuthInvalid) {
          try {
            fs.rmSync(this.authPath, { recursive: true, force: true });
            fs.mkdirSync(this.authPath, { recursive: true });
          } catch (error) {
            console.error('[WA] Failed to reset auth:', error.message);
          }
          this.qrCodeDataUrl = null;
          this.pairingCode = null;
          this.scheduleReinitialize(isAuthInvalid ? 'auth_invalid' : 'logged_out');
          return;
        }

        if (isRestartRequired) {
          this.scheduleReinitialize('restart_required', 0);
          return;
        }

        this.scheduleReinitialize('disconnected');
      }
    });
  }

  describeDisconnectReason(statusCode) {
    if (statusCode === DisconnectReason.restartRequired) return 'restart_required (515)';
    if (statusCode === DisconnectReason.connectionLost) return 'connection_lost (408)';
    if (statusCode === DisconnectReason.connectionClosed) return 'connection_closed (428)';
    if (statusCode === DisconnectReason.connectionReplaced) return 'connection_replaced (440)';
    if (statusCode === DisconnectReason.loggedOut) return 'logged_out (401)';
    if (statusCode === DisconnectReason.badSession) return 'bad_session (500)';
    if (statusCode === DisconnectReason.multideviceMismatch) return 'multidevice_mismatch (411)';
    if (statusCode === DisconnectReason.forbidden) return 'forbidden (403)';
    if (statusCode === 405) return 'auth_invalid (405)';
    if (statusCode === DisconnectReason.unavailableService) return 'unavailable_service (503)';
    return statusCode ? `unknown (${statusCode})` : 'unknown';
  }

  scheduleReinitialize(trigger, delayOverrideMs) {
    if (this.reconnectTimer) return;

    this.reconnectAttempts += 1;
    const reconnectDelayMs = typeof delayOverrideMs === 'number'
      ? delayOverrideMs
      : Math.min(4000 * (2 ** (this.reconnectAttempts - 1)), 60000);

    this.lastStatus = `Reconnecting after ${trigger} in ${Math.round(reconnectDelayMs / 1000)}s...`;
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      const socketToClose = this.sock;
      this.sock = null;
      this.isInitializing = false;

      try {
        if (socketToClose) {
          socketToClose.end(new Error('reconnect'));
        }
      } catch (error) {
        console.error('[WA] End socket error:', error.message);
      }

      this.init();
    }, reconnectDelayMs);
  }

  getConnectionState() {
    const rawUser = this.sock?.user || null;
    const jid = normalizeConnectedJid(rawUser?.id || rawUser?.jid || '');
    const phoneNumber = extractPhoneFromJid(jid);
    const displayName = String(rawUser?.name || rawUser?.verifiedName || '').trim();

    return {
      ready: this.ready,
      status: this.lastStatus,
      qrCodeDataUrl: this.qrCodeDataUrl,
      pairingCode: this.pairingCode,
      connectedAccount: {
        jid,
        phoneNumber,
        displayName,
        profilePictureUrl: this.profilePictureUrl,
      },
    };
  }

  async refreshProfilePicture(socket = this.sock) {
    const userJid = normalizeConnectedJid(socket?.user?.id || socket?.user?.jid || '');
    if (!socket || !userJid || typeof socket.profilePictureUrl !== 'function') return;

    try {
      const imageUrl = await socket.profilePictureUrl(userJid, 'image');
      if (socket === this.sock && typeof imageUrl === 'string') {
        this.profilePictureUrl = imageUrl.trim();
      }
    } catch (error) {
      if (socket === this.sock) this.profilePictureUrl = '';
    }
  }

  async requestPairingCode(phoneNumber) {
    if (!this.sock) {
      throw new Error('WhatsApp client is not ready yet, please wait a moment');
    }

    if (this.ready) {
      throw new Error('WhatsApp is already connected');
    }

    if (this.sock.authState?.creds?.registered) {
      throw new Error('This session is already registered, restart the connection to re-pair');
    }

    if (this.isRequestingPairingCode) {
      throw new Error('A pairing code request is already in progress');
    }

    const normalized = this.normalizePersonalNumber(phoneNumber);
    if (!normalized || normalized.length < 8) {
      throw new Error('Invalid phone number');
    }

    this.isRequestingPairingCode = true;
    try {
      // Generate the code ourselves: the bundled baileys fork's default
      // fallback is a hardcoded, non-random string, which breaks pairing.
      const customCode = typeof bytesToCrockford === 'function'
        ? bytesToCrockford(randomBytes(5)).slice(0, 8)
        : undefined;
      const code = await this.sock.requestPairingCode(normalized, customCode);
      this.pairingCode = code;
      this.lastStatus = 'Enter the pairing code in WhatsApp > Linked Devices';
      return code;
    } finally {
      this.isRequestingPairingCode = false;
    }
  }

  buildChatId(targetType, target) {
    const rawTarget = String(target || '').trim();
    if (!rawTarget) {
      throw new Error('Target cannot be empty');
    }

    if (targetType === 'group') {
      if (rawTarget.endsWith('@g.us')) {
        return rawTarget;
      }

      const normalizedGroup = rawTarget.replace(/[^0-9-]/g, '');
      if (!normalizedGroup) {
        throw new Error('Invalid group ID');
      }

      return `${normalizedGroup}@g.us`;
    }

    if (rawTarget.includes('@')) {
      return rawTarget;
    }

    const normalizedPhone = this.normalizePersonalNumber(rawTarget);
    if (!normalizedPhone) {
      throw new Error('Invalid destination number');
    }

    return `${normalizedPhone}@s.whatsapp.net`;
  }

  normalizePersonalNumber(value) {
    const rawValue = String(value || '').trim();
    if (!rawValue) return '';

    if (rawValue.endsWith('@s.whatsapp.net')) {
      return rawValue.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '');
    }

    const digitsOnly = rawValue.replace(/\D/g, '');
    if (!digitsOnly) return '';

    if (digitsOnly.startsWith('0')) {
      return `${this.defaultDialCode}${digitsOnly.slice(1)}`;
    }

    if (digitsOnly.startsWith(this.defaultDialCode)) {
      return digitsOnly;
    }

    return digitsOnly;
  }

  async sendMessage(targetType, target, message, options = {}) {
    if (!this.sock || !this.ready) {
      throw new Error('WhatsApp client is not ready');
    }

    let chatId = this.buildChatId(targetType, target);
    if (targetType === 'personal' && chatId.endsWith('@s.whatsapp.net')) {
      const result = await this.sock.onWhatsApp(chatId);
      if (!Array.isArray(result) || !result[0] || !result[0].exists) {
        throw new Error('Destination number is not registered on WhatsApp');
      }

      chatId = result[0].jid || chatId;
    }

    console.log(`[WA] Sending message to ${chatId}`);
    const text = String(message || '').trim();
    const buttons = Array.isArray(options?.buttons)
      ? options.buttons
      : [];
    const media = options?.media && typeof options.media === 'object'
      ? options.media
      : null;

    const mediaType = String(media?.type || '').trim();
    const mediaUrl = String(media?.url || '').trim();
    const hasMedia = Boolean(mediaType && mediaUrl);

    if (hasMedia) {
      const mediaSource = { url: mediaUrl };

      if (buttons.length && !(mediaType === 'audio' && Boolean(media?.ptt))) {
        await sendInteractiveButtons(this.sock, chatId, {
          text,
          buttons,
          media: {
            type: mediaType,
            source: mediaSource,
            fileName: String(media?.fileName || 'file').trim() || 'file',
            mimetype: String(media?.mimetype || '').trim() || undefined,
          },
        });
        return;
      }

      const payload = { [mediaType]: mediaSource };

      if (text) {
        payload.caption = text;
      }

      if (mediaType === 'audio') {
        payload.mimetype = String(media?.mimetype || 'audio/mpeg').trim() || 'audio/mpeg';
        payload.ptt = Boolean(media?.ptt);
      } else if (mediaType === 'document') {
        payload.fileName = String(media?.fileName || 'file').trim() || 'file';
        payload.mimetype = String(media?.mimetype || 'application/octet-stream').trim() || 'application/octet-stream';
      }

      await this.sock.sendMessage(chatId, payload);

      // Voice-note payload cannot be mixed with interactive buttons reliably.
      // For this case we send buttons as a follow-up text message.
      if (buttons.length) {
        await sendInteractiveButtons(this.sock, chatId, { text: text || 'Choose an option:', buttons });
      }
      return;
    }

    if (buttons.length) {
      await sendInteractiveButtons(this.sock, chatId, { text, buttons });
      return;
    }

    await this.sock.sendMessage(chatId, { text });
  }

  async handleIncomingMessages(event) {
    if (!this.sock || event.type !== 'notify') return;

    for (const message of event.messages || []) {
      if (!message?.message || message.key?.fromMe) continue;

      const chatId = message.key?.remoteJid;
      if (!chatId) continue;

      if (!(await this.canRespondToMessage(chatId, message))) continue;

      const content = normalizeMessageContent(message.message) || message.message;

      if (!content?.protocolMessage) {
        this.cacheRecentMessage(chatId, message);
      }

      const revokeKey = content?.protocolMessage?.key;
      const revokeType = content?.protocolMessage?.type;

      if (revokeKey?.id && (revokeType === 0 || revokeType === 'REVOKE')) {
        const revokedChatId = revokeKey.remoteJid || chatId;
        const revokedMessageId = revokeKey.id;
        const captureParticipant = revokeKey.participant || message.key?.participant || '';
        await this.captureDeletedMessage(revokedChatId, revokedMessageId, {
          remoteJid: revokedChatId,
          participant: captureParticipant,
        });
        continue;
      }

      const interactiveSelectionId = this.extractInteractiveSelectionId(content);
      const text = this.extractMessageText(content);

      if (interactiveSelectionId) {
        this.logInteractiveDebug('incoming selection detected', {
          chatId,
          interactiveSelectionId,
          text,
        });
      }

      if (text.trim() === '.vv' || text.trim() === '!vv') {
        await this.handleViewOnceCommand(chatId, content);
        continue;
      }

      if (text.trim().startsWith('.') || text.trim().startsWith('!')) {
        const handled = await this.handleBuiltInCommand(chatId, message, content, text);
        if (handled) continue;
      }

      let matched = customCommandStore.matchCommand(text);
      if (!matched) {
        matched = this.matchInteractiveCommand(interactiveSelectionId);
      }
      if (interactiveSelectionId) {
        this.logInteractiveDebug('selection match result', {
          interactiveSelectionId,
          matchedTrigger: matched?.trigger || null,
        });
        if (!matched) {
          console.warn(`[WA] Button click received but no matching command found. Selection ID: "${interactiveSelectionId}". Enable WA_DEBUG_INTERACTIVE=1 for more details.`);
        }
      }
      if (!matched) continue;

      await this.replyWithCustomCommand(chatId, matched);
    }
  }

  async canRespondToMessage(chatId, message) {
    const mode = botPermissionStore.getSettings().mode;
    if (mode === 'everyone') return true;
    if (mode === 'off') return false;
    if (mode === 'owner') {
      const senderJid = normalizeConnectedJid(message.key?.participant || chatId);
      const ownerJid = normalizeConnectedJid(this.sock?.user?.id);
      return Boolean(ownerJid && senderJid && ownerJid === senderJid);
    }
    if (!String(chatId).endsWith('@g.us')) return true;

    try {
      const metadata = await this.sock.groupMetadata(chatId);
      const participantJid = normalizeConnectedJid(message.key?.participant || chatId);
      const participant = (metadata.participants || []).find((item) =>
        normalizeConnectedJid(item.id) === participantJid
      );
      return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch (error) {
      console.warn(`[WA] Unable to verify group admin permission: ${error.message}`);
      return false;
    }
  }

  extractMessageText(content) {
    if (!content || typeof content !== 'object') return '';

    const interactiveSelectedId = this.extractInteractiveSelectionId(content);

    const candidates = [
      content.conversation,
      content.extendedTextMessage?.text,
      content.imageMessage?.caption,
      content.videoMessage?.caption,
      content.documentMessage?.caption,
      content.buttonsResponseMessage?.selectedButtonId,
      content.buttonsResponseMessage?.selectedDisplayText,
      content.templateButtonReplyMessage?.selectedId,
      content.listResponseMessage?.singleSelectReply?.selectedRowId,
      interactiveSelectedId,
    ];

    for (const candidate of candidates) {
      const value = String(candidate || '').trim();
      if (value) return value;
    }

    return '';
  }

  extractInteractiveSelectionId(content) {
    if (!content || typeof content !== 'object') return '';

    const viewOnceMessage = content.viewOnceMessage?.message || null;

    const directCandidates = [
      content.listResponseMessage?.singleSelectReply?.selectedRowId,
      content.buttonsResponseMessage?.selectedButtonId,
      content.templateButtonReplyMessage?.selectedId,
      content.interactiveResponseMessage?.nativeFlowResponseMessage?.id,
      content.interactiveResponseMessage?.nativeFlowResponseMessage?.selectedId,
      content.interactiveResponseMessage?.nativeFlowResponseMessage?.selected_id,
      content.interactiveResponseMessage?.nativeFlowResponseMessage?.button?.id,
      content.interactiveResponseMessage?.nativeFlowResponseMessage?.buttons?.[0]?.id,
      viewOnceMessage?.listResponseMessage?.singleSelectReply?.selectedRowId,
      viewOnceMessage?.buttonsResponseMessage?.selectedButtonId,
      viewOnceMessage?.templateButtonReplyMessage?.selectedId,
      viewOnceMessage?.interactiveResponseMessage?.nativeFlowResponseMessage?.id,
      viewOnceMessage?.interactiveResponseMessage?.nativeFlowResponseMessage?.selectedId,
      viewOnceMessage?.interactiveResponseMessage?.nativeFlowResponseMessage?.selected_id,
      viewOnceMessage?.interactiveResponseMessage?.nativeFlowResponseMessage?.button?.id,
      viewOnceMessage?.interactiveResponseMessage?.nativeFlowResponseMessage?.buttons?.[0]?.id,
    ];

    for (const candidate of directCandidates) {
      const value = String(candidate || '').trim();
      if (value) return value;
    }

    const paramsJsonCandidates = [
      content.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson,
      content.interactiveResponseMessage?.nativeFlowResponseMessage?.buttonParamsJson,
      viewOnceMessage?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson,
      viewOnceMessage?.interactiveResponseMessage?.nativeFlowResponseMessage?.buttonParamsJson,
    ];

    for (const interactiveParamsJson of paramsJsonCandidates) {
      if (!(typeof interactiveParamsJson === 'string' && interactiveParamsJson.trim())) {
        continue;
      }

      try {
        const parsed = JSON.parse(interactiveParamsJson);
        if (typeof parsed === 'string') {
          const selected = parsed.trim();
          if (selected) {
            this.logInteractiveDebug('parsed paramsJson string selection', {
              selected,
              parsed: interactiveParamsJson,
            });
            return selected;
          }
        }

        if (parsed && typeof parsed === 'object') {
          const selected = pickInteractiveSelectionFromParsedParams(parsed);
          if (selected) {
            this.logInteractiveDebug('parsed paramsJson selection', {
              selected,
              parsed,
            });
            return selected;
          }
        }
      } catch (error) {
        this.logInteractiveDebug('failed to parse paramsJson', {
          error: error.message,
          interactiveParamsJson,
        });
        continue;
      }
    }

    return '';
  }

  matchInteractiveCommand(selectionId) {
    const raw = String(selectionId || '').trim();
    if (!raw) return null;

    const normalized = normalizeInteractiveTrigger(raw);

    this.logInteractiveDebug('attempt command match', {
      raw,
      normalized,
    });

    // Try direct matches first
    const directMatch = (
      customCommandStore.findCommand(raw)
      || customCommandStore.matchCommand(raw)
      || customCommandStore.findCommand(normalized)
    );
    if (directMatch) {
      this.logInteractiveDebug('matched via direct command lookup', {
        trigger: directMatch.trigger,
      });
      return directMatch;
    }

    // If no direct match, scan all commands to find one that has this button ID
    // This handles cases where button ID doesn't exactly match trigger
    const commands = customCommandStore.listCommands();
    
    // Collect all possible matching criteria to try
    const matchCandidates = [raw, normalized];
    // Also try variations: if raw is "button_123", try "button", "123"
    if (raw.includes('_')) {
      matchCandidates.push(...raw.split('_').filter(Boolean));
    }
    if (raw.includes('-')) {
      matchCandidates.push(...raw.split('-').filter(Boolean));
    }
    
    for (const command of commands) {
      if (!Array.isArray(command.buttons)) continue;

      for (const button of command.buttons) {
        if (!button || typeof button !== 'object') continue;

        try {
          const params = typeof button.buttonParamsJson === 'string'
            ? JSON.parse(button.buttonParamsJson)
            : (button.buttonParamsJson || {});

          if (!params || typeof params !== 'object') continue;

          // Check if button id/selected value matches for quick_reply, cta_copy, cta_call, cta_wa
          const buttonId = String(params.id || params.copy_code || params.phone_number || '').trim();
          const normalizedButtonId = normalizeInteractiveTrigger(buttonId);
          
          // Try all matching candidates
          for (const candidate of matchCandidates) {
            if (
              candidate === buttonId
              || candidate === normalizedButtonId
              || buttonId === candidate
              || normalizedButtonId === candidate
            ) {
              this.logInteractiveDebug('matched via button id search', {
                trigger: command.trigger,
                buttonType: button.name,
                buttonId,
                selectionId: raw,
              });
              return command;
            }
          }

          // Check if any single_select row matches
          if (button.name === 'single_select' && Array.isArray(params.sections)) {
            for (const section of params.sections) {
              if (!Array.isArray(section.rows)) continue;
              for (const row of section.rows) {
                const rowId = String(row?.id || '').trim();
                const normalizedRowId = normalizeInteractiveTrigger(rowId);
                
                for (const candidate of matchCandidates) {
                  if (
                    candidate === rowId
                    || candidate === normalizedRowId
                    || rowId === candidate
                    || normalizedRowId === candidate
                  ) {
                    this.logInteractiveDebug('matched via single_select row id', {
                      trigger: command.trigger,
                      rowId,
                      selectionId: raw,
                    });
                    return command;
                  }
                }
              }
            }
          }
        } catch (error) {
          this.logInteractiveDebug('error scanning button in command', {
            error: error.message,
            trigger: command.trigger,
          });
        }
      }
    }

    this.logInteractiveDebug('no command found for selection', { raw, normalized, matchCandidates });
    return null;
  }

  async handleBuiltInCommand(chatId, message, content, text) {
    const normalized = String(text || '').trim();
    const command = normalized.split(/\s+/)[0].toLowerCase();

    if (command === '.sticker' || command === '.s' || command === '!sticker' || command === '!s') {
      await this.handleStickerCommand(chatId, message, content, parseStickerCommandFlags(normalized));
      return true;
    }

    if (command === '.timesolat' || command === '!timesolat') {
      await this.handleTimesolatCommand(chatId, normalized);
      return true;
    }

    if (command === '.ytmp3' || command === '.play' || command === '!ytmp3' || command === '!play') {
      await this.handleYtmp3Command(chatId, message, stripCommandPrefix(normalized));
      return true;
    }

    if (command === '.ytmp4' || command === '.play2' || command === '!ytmp4' || command === '!play2') {
      await this.handleYtmp4Command(chatId, message, stripCommandPrefix(normalized));
      return true;
    }

    if (command === '.facebook' || command === '.fb' || command === '!facebook' || command === '!fb') {
      await this.handleFacebookCommand(chatId, message, stripCommandPrefix(normalized));
      return true;
    }

    if (command === '.instagram' || command === '.ig' || command === '!instagram' || command === '!ig') {
      await this.handleInstagramCommand(chatId, message, stripCommandPrefix(normalized));
      return true;
    }

    if (command === '.tiktok' || command === '.tt' || command === '!tiktok' || command === '!tt') {
      await this.handleTikTokCommand(chatId, message, stripCommandPrefix(normalized));
      return true;
    }

    if (command === '.contact' || command === '.kontak' || command === '!contact' || command === '!kontak') {
      await this.handleContactCommand(chatId, stripCommandPrefix(normalized));
      return true;
    }

    if (command === '.wslink' || command === '.wlink' || command === '!wslink' || command === '!wlink') {
      const quotedMessage = content?.extendedTextMessage?.contextInfo?.quotedMessage || null;
      const quotedText = quotedMessage ? this.extractMessageText(quotedMessage) : '';
      await this.handleWhatsAppLinkCommand(chatId, message, stripCommandPrefix(normalized), quotedText);
      return true;
    }

    return false;
  }

  async handleWhatsAppLinkCommand(chatId, message, rawText, quotedText = '') {
    if (!this.sock) return;

    const input = String(rawText || '').trim() || String(quotedText || '').trim();
    const phoneNumber = input.replace(/\D/g, '');
    if (!phoneNumber) {
      await this.sock.sendMessage(chatId, {
        text: 'Sila masukkan nombor telefon.\nContoh: .wslink 60177501997',
      }, { quoted: message });
      return;
    }

    const link = `https://wa.me/${phoneNumber}`;
    await sendInteractiveButtons(this.sock, chatId, {
      text: `Link WhatsApp:\n${link}`,
      buttons: [
        {
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({ display_text: 'Copy Link', copy_code: link }),
        },
      ],
    }, { quoted: message });
  }

  async handleContactCommand(chatId, query) {
    if (!this.sock) return;

    const matches = savedContactStore.findMatches(query);

    if (!matches.length) {
      const text = query
        ? `Tiada contact dijumpai untuk: ${query}`
        : 'Tiada saved contact lagi. Tambah dari dashboard > Contacts > Saved Contacts.';
      await this.sock.sendMessage(chatId, { text });
      return;
    }

    if (matches.length === 1) {
      const contact = matches[0];
      const note = contact.note ? contact.note : '-';
      const text = [
        'Contact 🪪',
        '',
        `Name: ${contact.name}`,
        `Category: ${contact.category}`,
        `Phone: ${contact.phone}`,
        '',
        `Note: ${note}`,
      ].join('\n');

      const buttons = [
        {
          name: 'cta_call',
          buttonParamsJson: JSON.stringify({ display_text: 'Call', phone_number: contact.phone }),
        },
        {
          name: 'cta_wa',
          buttonParamsJson: JSON.stringify({ display_text: 'WhatsApp', phone_number: contact.phone }),
        },
        {
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({ display_text: 'Copy Number', copy_code: contact.phone }),
        },
      ];

      await sendInteractiveButtons(this.sock, chatId, { text, buttons });
      return;
    }

    const limited = matches.slice(0, 15);
    const lines = limited.map((item, index) => `${index + 1}. ${item.name} (${item.category}) - ${item.phone}`);
    const extra = matches.length > limited.length ? `\n... +${matches.length - limited.length} contact lagi` : '';
    const text = [
      `Dijumpai ${matches.length} contact untuk: ${query || 'semua'}`,
      '',
      ...lines,
      extra,
      '',
      'Cari lebih spesifik untuk lihat butang Call/WhatsApp/Copy.',
    ].filter(Boolean).join('\n');

    await this.sock.sendMessage(chatId, { text });
  }

  async handleTimesolatCommand(chatId, rawText) {
    if (!this.sock) return;

    const mode = String(stripCommandPrefix(rawText) || 'status').trim().toLowerCase();
    const targetLabel = String(chatId || '').endsWith('@g.us') ? 'group ini' : 'chat ini';
    const isEnabled = prayerReminderStore.isEnabledForChat(chatId);

    if (mode === 'status') {
      const text = isEnabled
        ? `Timesolat untuk ${targetLabel}: ON`
        : `Timesolat untuk ${targetLabel}: OFF\nGuna .timesolat on untuk aktifkan.`;
      await this.sock.sendMessage(chatId, { text });
      return;
    }

    if (mode === 'on') {
      const text = isEnabled
        ? `Timesolat untuk ${targetLabel} sudah ON.`
        : (prayerReminderStore.setEnabledForChat(chatId, true)
          ? `Timesolat ON untuk ${targetLabel}. Bot akan hantar notifikasi bila masuk waktu solat.`
          : 'Gagal simpan tetapan timesolat.');
      await this.sock.sendMessage(chatId, { text });
      return;
    }

    if (mode === 'off') {
      const text = !isEnabled
        ? `Timesolat untuk ${targetLabel} sudah OFF.`
        : (prayerReminderStore.setEnabledForChat(chatId, false)
          ? `Timesolat OFF untuk ${targetLabel}.`
          : 'Gagal simpan tetapan timesolat.');
      await this.sock.sendMessage(chatId, { text });
      return;
    }

    await this.sock.sendMessage(chatId, { text: 'Guna: .timesolat on | off | status' });
  }

  startPrayerReminderLoop() {
    if (this.prayerReminderInterval) return;

    const runCheck = async () => {
      await this.checkAndSendPrayerReminders();
    };
    runCheck().catch((error) => {
      console.warn('[WA] Prayer reminder initial check failed:', error.message);
    });

    this.prayerReminderInterval = setInterval(() => {
      runCheck().catch((error) => {
        console.warn('[WA] Prayer reminder check failed:', error.message);
      });
    }, PRAYER_CHECK_INTERVAL_MS);
  }

  startReminderLoop() {
    if (this.reminderInterval) return;
    const runCheck = () => this.checkAndSendReminders().catch((error) => {
      console.warn('[WA] Reminder check failed:', error.message);
    });
    runCheck();
    this.reminderInterval = setInterval(runCheck, PRAYER_CHECK_INTERVAL_MS);
  }

  async checkAndSendReminders() {
    if (!this.sock) return;
    const today = getDateContextInTimeZone(PRAYER_TIMEZONE).dateKey;
    const now = getClockContextInTimeZone(PRAYER_TIMEZONE).timeKey;
    const todayMs = Date.parse(`${today}T00:00:00Z`);
    const nextItems = reminderStore.listReminders();
    let didChange = false;

    for (const reminder of nextItems) {
      if (now < reminder.time) continue;
      const reminderMs = Date.parse(`${reminder.date}T00:00:00Z`);
      if (!Number.isFinite(reminderMs)) continue;
      const daysLeft = Math.round((reminderMs - todayMs) / 86400000);
      const matchingOffsets = reminder.earlyDays.filter((offset) => offset === daysLeft);
      if (!matchingOffsets.length || reminder.sentOffsets.includes(daysLeft)) continue;

      const text = `${reminder.name}\n${reminder.date} tinggal ${daysLeft} hari lagi.`;
      let sentToAtLeastOneChat = false;
      for (const chatId of reminder.targetChats) {
        try {
          await this.sock.sendMessage(chatId, { text });
          sentToAtLeastOneChat = true;
        } catch (error) {
          console.warn(`[WA] Failed to send reminder to ${chatId}:`, error.message);
        }
      }
      if (!sentToAtLeastOneChat) continue;
      reminder.sentOffsets = [...reminder.sentOffsets, ...matchingOffsets];
      reminderStore.replaceReminder(reminder.id, reminder);
      didChange = true;
    }

    return didChange;
  }

  async checkAndSendPrayerReminders() {
    if (!this.sock) return;

    const prayerConfig = prayerReminderStore.getConfig();
    const enabledChats = Object.keys(prayerConfig.enabledChats || {});
    if (enabledChats.length === 0) return;

    const clockContext = getClockContextInTimeZone(PRAYER_TIMEZONE);

    let prayerTimes;
    try {
      prayerTimes = await fetchPrayerTimesForDate(clockContext);
    } catch (error) {
      console.warn('[WA] Failed to fetch prayer times:', error.message);
      return;
    }

    if (!prayerTimes) return;

    const prayerName = PRAYER_NAMES.find((name) => prayerTimes[name] === clockContext.timeKey);
    if (!prayerName) return;

    const prayerLabel = PRAYER_LABELS_MS[prayerName] || prayerName;
    const nextConfig = {
      enabledChats: { ...prayerConfig.enabledChats },
      lastSentByChat: { ...prayerConfig.lastSentByChat },
    };
    let didChange = false;

    for (const chatJid of enabledChats) {
      const status = nextConfig.lastSentByChat[chatJid];
      const prayersForDate = status?.date === clockContext.dateKey && Array.isArray(status?.prayers)
        ? status.prayers
        : [];
      if (prayersForDate.includes(prayerName)) continue;

      try {
        await this.sock.sendMessage(chatJid, {
          text: [
            `Sudah masuk waktu solat ${prayerLabel}.`,
            `Jam : ${prayerTimes[prayerName]}`,
            `Kawasan : (${PRAYER_TIMEZONE})`,
          ].join('\n'),
        });

        nextConfig.lastSentByChat[chatJid] = {
          date: clockContext.dateKey,
          prayers: [...prayersForDate, prayerName],
        };
        didChange = true;
      } catch (error) {
        console.warn(`[WA] Failed to send prayer reminder to ${chatJid}:`, error.message);
      }
    }

    if (didChange) {
      prayerReminderStore.updateConfig(nextConfig);
    }
  }

  async resolveYouTubeTarget(input) {
    const raw = String(input || '').trim();
    if (!raw) {
      throw new Error('Usage: .ytmp3 <judul atau link YouTube>');
    }

    if (isLikelyUrl(raw)) {
      const parsed = parseYouTubeInput(raw);
      if (!parsed || parsed.playlistOnly || !parsed.videoId) {
        throw new Error('Link YouTube tidak valid. Gunakan link video, bukan playlist.');
      }

      let info = null;
      try {
        info = await ytSearch({ videoId: parsed.videoId });
      } catch (error) {
        // Metadata lookup can fail even when the video URL is valid.
      }

      return {
        url: parsed.canonicalUrl,
        title: info?.title || `YouTube ${parsed.videoId}`,
        thumbnail: info?.thumbnail || '',
      };
    }

    const search = await ytSearch(raw);
    const first = Array.isArray(search?.videos) ? search.videos[0] : null;
    if (!first || !first.url) {
      throw new Error('Video tidak ditemukan, coba kata kunci lain.');
    }

    return {
      url: first.url,
      title: first.title || raw,
      thumbnail: first.thumbnail || '',
    };
  }

  async resolveDownloadFromProviders(providers) {
    for (const provider of providers) {
      try {
        const result = await provider();
        if (isHttpUrl(result?.url)) return { ...result, url: String(result.url).trim() };
      } catch (error) {
        console.log(`[WA] Provider failed: ${error.message}`);
      }
      await sleep(300);
    }

    return null;
  }

  async handleYtmp3Command(chatId, message, args) {
    if (!this.sock) return;

    try {
      const target = await this.resolveYouTubeTarget(args);
      const providers = [
        async () => {
          const data = await fetchJsonWithTimeout(
            `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(target.url)}&format=mp3`,
            40000
          );
          return { url: extractAudioDownloadUrlFromPayload(data), title: extractTitleFromPayload(data) };
        },
        async () => {
          const data = await fetchJsonWithTimeout(
            `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(target.url)}`,
            40000
          );
          return { url: extractAudioDownloadUrlFromPayload(data), title: extractTitleFromPayload(data) };
        },
        async () => {
          const data = await fetchJsonWithTimeout(
            `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(target.url)}`,
            40000
          );
          return { url: extractAudioDownloadUrlFromPayload(data), title: extractTitleFromPayload(data) };
        },
      ];

      if (target.thumbnail) {
        try {
          await this.sock.sendMessage(
            chatId,
            { image: { url: target.thumbnail }, caption: `🎵 ${target.title}\n⏳ Sedang menyiapkan audio...` },
            { quoted: message }
          );
        } catch (error) {
          console.log('[WA] Thumbnail preview skipped:', error.message);
        }
      }

      const picked = await this.resolveDownloadFromProviders(providers);
      if (!picked?.url) {
        await this.sock.sendMessage(
          chatId,
          { text: 'Gagal mengambil link audio. Coba lagi beberapa saat lagi.' },
          { quoted: message }
        );
        return;
      }

      const response = await fetchWithTimeout(picked.url, {}, 120000);
      if (!response.ok) throw new Error(`Audio download failed (HTTP ${response.status})`);

      const buffer = Buffer.from(await response.arrayBuffer());
      if (!buffer.length) {
        throw new Error('Audio kosong dari provider, coba lagi.');
      }
      const title = sanitizeFileName(picked.title || target.title, 'audio');

      try {
        await this.sock.sendMessage(
          chatId,
          {
            audio: buffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            ptt: false,
          },
          { quoted: message }
        );
      } catch (audioSendError) {
        console.log('[WA] Audio send failed, fallback to document:', audioSendError.message);
        await this.sock.sendMessage(
          chatId,
          {
            document: buffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `🎵 ${picked.title || target.title}`,
          },
          { quoted: message }
        );
      }
    } catch (error) {
      console.error('[WA] .ytmp3 error:', error.message);
      await this.sock.sendMessage(chatId, { text: `Gagal proses .ytmp3: ${error.message}` }, { quoted: message });
    }
  }

  async handleYtmp4Command(chatId, message, args) {
    if (!this.sock) return;

    try {
      const target = await this.resolveYouTubeTarget(args);
      const providers = [
        async () => {
          const data = await fetchJsonWithTimeout(
            `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(target.url)}&format=mp4`,
            40000
          );
          return { url: extractDownloadUrlFromPayload(data), title: extractTitleFromPayload(data) };
        },
        async () => {
          const data = await fetchJsonWithTimeout(
            `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(target.url)}`,
            40000
          );
          return { url: extractDownloadUrlFromPayload(data), title: extractTitleFromPayload(data) };
        },
        async () => {
          const data = await fetchJsonWithTimeout(
            `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(target.url)}`,
            40000
          );
          return { url: extractDownloadUrlFromPayload(data), title: extractTitleFromPayload(data) };
        },
      ];

      const picked = await this.resolveDownloadFromProviders(providers);
      if (!picked?.url) {
        await this.sock.sendMessage(
          chatId,
          { text: 'Gagal mengambil link video. Coba lagi nanti.' },
          { quoted: message }
        );
        return;
      }

      const response = await fetchWithTimeout(picked.url, {}, 120000);
      if (!response.ok) throw new Error(`Video download failed (HTTP ${response.status})`);

      const contentLengthHeader = response.headers.get('content-length') || '0';
      const contentLength = Number(contentLengthHeader);
      const maxBytes = 64 * 1024 * 1024;
      if (Number.isFinite(contentLength) && contentLength > maxBytes) {
        throw new Error('Ukuran video terlalu besar untuk dikirim (maks 64MB).');
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > maxBytes) {
        throw new Error('Ukuran video terlalu besar untuk dikirim (maks 64MB).');
      }

      const title = sanitizeFileName(picked.title || target.title, 'video');
      await this.sock.sendMessage(
        chatId,
        {
          video: buffer,
          mimetype: 'video/mp4',
          fileName: `${title}.mp4`,
          caption: `🎬 ${picked.title || target.title}`,
        },
        { quoted: message }
      );
    } catch (error) {
      console.error('[WA] .ytmp4 error:', error.message);
      await this.sock.sendMessage(chatId, { text: `Gagal proses .ytmp4: ${error.message}` }, { quoted: message });
    }
  }

  extractFacebookVideoUrl(data) {
    return this.extractMediaUrls(data)[0] || '';
  }

  extractMediaUrls(data) {
    const links = [];
    const seen = new Set();
    const visit = (value, key = '') => {
      if (typeof value === 'string') {
        if (/^https?:\/\//i.test(value) && !seen.has(value)) {
          seen.add(value);
          links.push({ url: value, key: key.toLowerCase() });
        }
        return;
      }
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) {
        value.forEach((item) => visit(item, key));
        return;
      }
      Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
    };
    visit(data);
    return links
      .sort((left, right) => {
        const score = (item) => /video|download|hd|sd|play|media/.test(item.key) ? 0 : 1;
        return score(left) - score(right);
      })
      .map((item) => item.url);
  }

  async downloadRemoteMedia(url, maxBytes = 64 * 1024 * 1024) {
    const response = await fetchWithTimeout(url, {}, 120000);
    if (!response.ok) throw new Error(`Media download failed (HTTP ${response.status})`);
    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength > maxBytes) throw new Error('Ukuran media terlalu besar (maks 64MB).');
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length || buffer.length > maxBytes) throw new Error('Media kosong atau terlalu besar.');
    return {
      buffer,
      contentType: String(response.headers.get('content-type') || '').toLowerCase(),
    };
  }

  async handleFacebookCommand(chatId, message, args) {
    if (!this.sock) return;

    const url = String(args || '').trim();
    if (!url || !/facebook\.com|fb\.watch/i.test(url)) {
      await this.sock.sendMessage(
        chatId,
        { text: 'Usage: .facebook <link-facebook>\nContoh: .facebook https://www.facebook.com/...' },
        { quoted: message }
      );
      return;
    }

    try {
      const providers = [
        `https://api.hanggts.xyz/download/facebook?url=${encodeURIComponent(url)}`,
        `https://api.yupra.my.id/api/downloader/facebook?url=${encodeURIComponent(url)}`,
      ];
      let data = null;
      let videoUrl = '';
      for (const endpoint of providers) {
        try {
          data = await fetchJsonWithTimeout(endpoint, 40000);
          videoUrl = this.extractFacebookVideoUrl(data);
          if (videoUrl) break;
        } catch (providerError) {
          console.log('[WA] Facebook provider failed:', providerError.message);
        }
      }
      if (!videoUrl) throw new Error('Video tidak ditemukan dari API');

      const title = data?.result?.info?.title || data?.result?.title || data?.title || 'Facebook Video';
      const media = await this.downloadRemoteMedia(videoUrl);
      await this.sock.sendMessage(
        chatId,
        { video: media.buffer, mimetype: 'video/mp4', caption: `📘 ${title}` },
        { quoted: message }
      );
    } catch (error) {
      console.error('[WA] .facebook error:', error.message);
      await this.sock.sendMessage(chatId, { text: 'Gagal download video Facebook. Coba link lain.' }, { quoted: message });
    }
  }

  extractInstagramMediaUrls(data) {
    return this.extractMediaUrls(data);
  }

  async handleInstagramCommand(chatId, message, args) {
    if (!this.sock) return;

    const url = String(args || '').trim();
    if (!url || !/instagram\.com|instagr\.am/i.test(url)) {
      await this.sock.sendMessage(
        chatId,
        { text: 'Usage: .instagram <link-instagram>\nContoh: .instagram https://www.instagram.com/reel/...' },
        { quoted: message }
      );
      return;
    }

    const endpoints = [
      `https://api.hanggts.xyz/download/instagram?url=${encodeURIComponent(url)}`,
      `https://api.yupra.my.id/api/downloader/instagram?url=${encodeURIComponent(url)}`,
    ];

    try {
      let mediaUrls = [];
      for (const endpoint of endpoints) {
        try {
          const data = await fetchJsonWithTimeout(endpoint, 40000);
          mediaUrls = this.extractInstagramMediaUrls(data);
          if (mediaUrls.length) break;
        } catch (error) {
          console.log('[WA] Instagram provider failed:', error.message);
        }
      }

      if (!mediaUrls.length) {
        throw new Error('Media tidak ditemukan');
      }

      const limited = mediaUrls.slice(0, 5);
      for (const mediaUrl of limited) {
        const media = await this.downloadRemoteMedia(mediaUrl);
        const lower = `${mediaUrl} ${media.contentType}`.toLowerCase();
        const isVideo = lower.includes('.mp4') || lower.includes('video/');
        if (isVideo) {
          await this.sock.sendMessage(chatId, { video: media.buffer, mimetype: 'video/mp4' }, { quoted: message });
        } else {
          await this.sock.sendMessage(chatId, { image: media.buffer }, { quoted: message });
        }
      }
    } catch (error) {
      console.error('[WA] .instagram error:', error.message);
      await this.sock.sendMessage(chatId, { text: 'Gagal download media Instagram. Pastikan link publik.' }, { quoted: message });
    }
  }

  async handleTikTokCommand(chatId, message, args) {
    if (!this.sock) return;

    const url = String(args || '').trim();
    if (!url || !/(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i.test(url)) {
      await this.sock.sendMessage(
        chatId,
        { text: 'Usage: .tiktok <link-tiktok>\nContoh: .tiktok https://www.tiktok.com/@user/video/...' },
        { quoted: message }
      );
      return;
    }

    const endpoints = [
      `https://api.hanggts.xyz/download/tiktok?url=${encodeURIComponent(url)}`,
      `https://api.yupra.my.id/api/downloader/tiktok?url=${encodeURIComponent(url)}`,
      `https://okatsu-rolezapiiz.vercel.app/downloader/tiktok?url=${encodeURIComponent(url)}`,
    ];

    try {
      let mediaUrl = '';
      for (const endpoint of endpoints) {
        try {
          const data = await fetchJsonWithTimeout(endpoint, 40000);
          mediaUrl = this.extractMediaUrls(data)[0] || '';
          if (mediaUrl) break;
        } catch (providerError) {
          console.log('[WA] TikTok provider failed:', providerError.message);
        }
      }

      if (!mediaUrl) throw new Error('Video tidak ditemukan dari API');
      const media = await this.downloadRemoteMedia(mediaUrl);
      await this.sock.sendMessage(
        chatId,
        { video: media.buffer, mimetype: 'video/mp4', caption: '🎵 TikTok' },
        { quoted: message }
      );
    } catch (error) {
      console.error('[WA] .tiktok error:', error.message);
      await this.sock.sendMessage(chatId, { text: 'Gagal download video TikTok. Pastikan link publik.' }, { quoted: message });
    }
  }

  resolveStickerMedia(content) {
    const quoted = content?.extendedTextMessage?.contextInfo?.quotedMessage || null;
    const sources = [quoted, content];

    for (const source of sources) {
      if (source?.stickerMessage) return { media: source.stickerMessage, type: 'sticker' };
      if (source?.imageMessage) return { media: source.imageMessage, type: 'image' };
      if (source?.videoMessage) return { media: source.videoMessage, type: 'video' };
    }

    return null;
  }

  async streamToBuffer(stream) {
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
  }

  async convertToWebp(inputBuffer, mediaType) {
    if (mediaType === 'sticker') return inputBuffer;
    if (!ffmpegPath) {
      throw new Error('ffmpeg binary tidak tersedia di server');
    }

    await fs.promises.mkdir(tempDir, { recursive: true });
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const inputExt = mediaType === 'video' ? 'mp4' : 'jpg';
    const inputPath = path.join(tempDir, `${id}.${inputExt}`);
    const outputPath = path.join(tempDir, `${id}.webp`);

    try {
      await fs.promises.writeFile(inputPath, inputBuffer);

      const filterBase = 'scale=512:512:force_original_aspect_ratio=decrease:flags=lanczos,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,setsar=1';
      const videoFilter = `fps=12,${filterBase}`;
      const args = mediaType === 'video'
        ? ['-y', '-i', inputPath, '-t', '7', '-vf', videoFilter, '-vcodec', 'libwebp', '-lossless', '0', '-q:v', '65', '-preset', 'default', '-loop', '0', '-an', '-vsync', '0', outputPath]
        : ['-y', '-i', inputPath, '-vf', filterBase, '-vcodec', 'libwebp', '-lossless', '0', '-q:v', '75', '-preset', 'default', '-loop', '0', '-an', '-vsync', '0', outputPath];

      await execFileAsync(ffmpegPath, args, { windowsHide: true, maxBuffer: 4 * 1024 * 1024 });
      return await fs.promises.readFile(outputPath);
    } finally {
      await fs.promises.unlink(inputPath).catch(() => {});
      await fs.promises.unlink(outputPath).catch(() => {});
    }
  }

  async removeBackgroundFromImage(imageBuffer) {
    const apiKey = String(process.env.REMOVE_BG_API_KEY || '').trim();
    if (!apiKey) {
      throw new Error('Mode nobg memerlukan REMOVE_BG_API_KEY di environment');
    }

    const form = new FormData();
    form.append('size', 'auto');
    form.append('format', 'png');
    form.append('image_file_b64', imageBuffer.toString('base64'));

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: form,
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const details = (await response.text()).trim();
      throw new Error(`remove.bg HTTP ${response.status}${details ? `: ${details.slice(0, 180)}` : ''}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  async handleStickerCommand(chatId, message, content, options = {}) {
    if (!this.sock) return;

    const target = this.resolveStickerMedia(content);
    if (!target) {
      await this.sock.sendMessage(
        chatId,
        { text: 'Usage: kirim/reply gambar, video, atau sticker lalu ketik .sticker' },
        { quoted: message }
      );
      return;
    }

    try {
      const stream = await downloadContentFromMessage(target.media, target.type);
      const sourceBuffer = await this.streamToBuffer(stream);
      if (options.removeBackground) {
        if (target.type !== 'image') {
          await this.sock.sendMessage(chatId, { text: 'Mode nobg hanya bisa digunakan untuk gambar.' }, { quoted: message });
          return;
        }

        const transparentBuffer = await this.removeBackgroundFromImage(sourceBuffer);
        const stickerBuffer = await this.convertToWebp(transparentBuffer, target.type);
        await this.sock.sendMessage(chatId, { sticker: stickerBuffer }, { quoted: message });
        return;
      }

      const stickerBuffer = await this.convertToWebp(sourceBuffer, target.type);
      await this.sock.sendMessage(chatId, { sticker: stickerBuffer }, { quoted: message });
    } catch (error) {
      console.error('[WA] .sticker error:', error.message);
      await this.sock.sendMessage(chatId, { text: 'Gagal membuat sticker dari media tersebut.' }, { quoted: message });
    }
  }

  async handleViewOnceCommand(chatId, content) {
    const quoted = content?.extendedTextMessage?.contextInfo?.quotedMessage;
    const quotedImage = quoted?.imageMessage;
    const quotedVideo = quoted?.videoMessage;

    try {
      if (quotedImage && quotedImage.viewOnce) {
        const stream = await downloadContentFromMessage(quotedImage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        await this.sock.sendMessage(
          chatId,
          { image: buffer, fileName: 'media.jpg', caption: quotedImage.caption || '' }
        );
      } else if (quotedVideo && quotedVideo.viewOnce) {
        const stream = await downloadContentFromMessage(quotedVideo, 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        await this.sock.sendMessage(
          chatId,
          { video: buffer, fileName: 'media.mp4', caption: quotedVideo.caption || '' }
        );
      } else {
        await this.sock.sendMessage(chatId, { text: 'Reply to a "view once" image/video message with .vv to reopen it.' });
      }
    } catch (error) {
      console.error('[WA] Failed to process .vv command:', error.message);
      await this.sock.sendMessage(chatId, { text: 'Failed to reopen that media.' });
    }
  }

  async handleMessageUpdates(updates) {
    if (!this.sock || !Array.isArray(updates)) return;

    for (const item of updates) {
      const updateMessage = item?.update?.message;
      const protocolMessage = updateMessage?.protocolMessage;
      const protocolKey = protocolMessage?.key;
      const protocolIsRevoke =
        Boolean(protocolKey?.id)
        && (protocolMessage?.type === 0 || protocolMessage?.type === 'REVOKE');

      if (protocolIsRevoke) {
        const chatId = protocolKey.remoteJid || item.key?.remoteJid;
        const messageId = protocolKey.id;
        const captureParticipant = protocolKey.participant || item.key?.participant || '';
        if (!chatId || !messageId) continue;

        await this.captureDeletedMessage(chatId, messageId, {
          remoteJid: chatId,
          participant: captureParticipant,
        });
        continue;
      }

      const isLegacyRevoke =
        item?.update?.messageStubType === baileys.WAMessageStubType?.REVOKE ||
        (item?.update && 'message' in item.update && item.update.message === null);
      if (!isLegacyRevoke) continue;

      const chatId = item.key?.remoteJid;
      const messageId = item.key?.id;
      if (!chatId || !messageId) continue;

      await this.captureDeletedMessage(chatId, messageId, item.key || {
        remoteJid: chatId,
      });
    }
  }

  hasCapturedDeletedMessage(chatId, messageId) {
    const key = `${String(chatId || '')}::${String(messageId || '')}`;
    if (!key || key === '::') return false;

    if (this.recentDeletedCaptureIds.includes(key)) {
      return true;
    }

    this.recentDeletedCaptureIds.unshift(key);
    if (this.recentDeletedCaptureIds.length > this.recentDeletedCaptureLimit) {
      this.recentDeletedCaptureIds.length = this.recentDeletedCaptureLimit;
    }

    return false;
  }

  async captureDeletedMessage(chatId, messageId, key) {
    if (isLidJid(chatId) || isLidJid(key?.participant)) return;
    if (this.hasCapturedDeletedMessage(chatId, messageId)) return;
    await this.saveDeletedMessage(chatId, messageId, key);
  }

  async saveDeletedMessage(chatId, messageId, key) {
    try {
      if (isLidJid(chatId) || isLidJid(key?.participant)) return;
      const cached = this.getRecentMessage(chatId, messageId);
      const original = cached || (await this.store?.loadMessage?.(chatId, messageId));
      const isGroup = chatId.endsWith('@g.us');
      let chatName = '';
      if (isGroup) {
        const chat = this.store?.chats?.get?.(chatId);
        chatName = chat?.name || chat?.subject || '';
      }

      const senderId = key?.participant || original?.participant || (chatId.endsWith('@g.us') ? '' : chatId);
      if (isLidJid(senderId)) return;
      if (!original?.message) {
        deletedMessageStore.addRecord({
          chatId,
          chatName,
          senderId,
          senderName: '',
          isGroup,
          type: 'text',
          text: '[Deleted message detected, but original content was not cached]',
          status: 'missing',
          mimeType: '',
          durationSeconds: null,
          fileSizeBytes: null,
          originalTimestamp: null,
        });
        console.log(`[WA] Saved deleted message placeholder from ${chatId}`);
        return;
      }

      const content = normalizeMessageContent(original.message) || original.message;
      const senderName = original.pushName || '';

      const record = {
        chatId,
        chatName,
        senderId,
        senderName,
        isGroup,
        originalTimestamp: original.messageTimestamp
          ? Number(original.messageTimestamp) * 1000
          : null,
      };

      const text =
        content.conversation ||
        content.extendedTextMessage?.text ||
        content.imageMessage?.caption ||
        content.videoMessage?.caption ||
        content.documentMessage?.caption ||
        '';

      const mediaField = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage']
        .find((key2) => content[key2]);

      if (mediaField) {
        const mediaTypeMap = {
          imageMessage: 'image',
          videoMessage: 'video',
          audioMessage: 'audio',
          documentMessage: 'document',
          stickerMessage: 'sticker',
        };
        const mediaType = mediaTypeMap[mediaField];
        const mediaMessage = content[mediaField];
        const resolvedMediaType = mediaField === 'audioMessage' && mediaMessage?.ptt
          ? 'voice'
          : mediaType;

        try {
          const downloadType = mediaType === 'sticker' ? 'sticker' : mediaType;
          const stream = await downloadContentFromMessage(mediaMessage, downloadType);
          let buffer = Buffer.from([]);
          for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

          const extMap = {
            image: '.jpg',
            video: '.mp4',
            audio: '.ogg',
            voice: '.ogg',
            document: '',
            sticker: '.webp',
          };
          const ext = extMap[resolvedMediaType] || extMap[mediaType] || '';
          const fileName = `deleted-${Date.now()}${ext}`;
          fs.mkdirSync(uploadDir, { recursive: true });
          fs.writeFileSync(path.join(uploadDir, fileName), buffer);

          record.type = resolvedMediaType;
          record.mediaUrl = `/uploads/${fileName}`;
          record.fileName = mediaMessage.fileName || fileName;
          record.mimeType = String(mediaMessage.mimetype || '').trim();
          record.durationSeconds = Number.isFinite(Number(mediaMessage.seconds))
            ? Number(mediaMessage.seconds)
            : null;
          record.fileSizeBytes = Number.isFinite(Number(mediaMessage.fileLength))
            ? Number(mediaMessage.fileLength)
            : null;
          record.text = text;
          record.status = 'recovered';
        } catch (downloadError) {
          console.error('[WA] Failed to download deleted media:', downloadError.message);
          record.type = resolvedMediaType;
          record.mimeType = String(mediaMessage.mimetype || '').trim();
          record.durationSeconds = Number.isFinite(Number(mediaMessage.seconds))
            ? Number(mediaMessage.seconds)
            : null;
          record.fileSizeBytes = Number.isFinite(Number(mediaMessage.fileLength))
            ? Number(mediaMessage.fileLength)
            : null;
          record.text = text || '[Media could not be recovered]';
          record.status = text ? 'partial' : 'missing';
        }
      } else {
        record.type = 'text';
        record.mimeType = '';
        record.durationSeconds = null;
        record.fileSizeBytes = null;
        record.text = text || '[Unsupported message type]';
        record.status = text ? 'recovered' : 'missing';
      }

      deletedMessageStore.addRecord(record);
      console.log(`[WA] Saved deleted message from ${chatId}`);
    } catch (error) {
      console.error('[WA] Failed to save deleted message:', error.message);
    }
  }

  async replyWithCustomCommand(chatId, command) {
    const caption = String(command.response || '').replace(/\\n/g, '\n');
    const options = {};
    const hasButtons = Boolean(command.buttons && command.buttons.length);

    if (command.mediaUrl && command.mediaType) {
      const media = {
        type: command.mediaType,
        source: { url: command.mediaUrl },
        fileName: command.fileName || 'file',
      };

      if (hasButtons) {
        await sendInteractiveButtons(this.sock, chatId, { caption, media, buttons: command.buttons }, options);
        return;
      }

      const payload = { [command.mediaType]: media.source, caption };
      if (command.mediaType === 'audio') {
        payload.mimetype = 'audio/mpeg';
        payload.ptt = false;
      } else if (command.mediaType === 'document') {
        payload.fileName = media.fileName;
        payload.mimetype = 'application/octet-stream';
      }

      await this.sock.sendMessage(chatId, payload, options);
      return;
    }

    if (caption || hasButtons) {
      await sendInteractiveButtons(this.sock, chatId, { text: caption, buttons: command.buttons }, options);
    }
  }

  getStoreMessagesByJid(chatId) {
    const storeMessages = this.store?.messages;
    if (!storeMessages || !chatId) return [];

    const byDirectKey = storeMessages[chatId];
    const byGetFunction = typeof storeMessages.get === 'function'
      ? storeMessages.get(chatId)
      : null;
    const collection = byDirectKey || byGetFunction;
    if (!collection) return [];

    if (Array.isArray(collection)) return collection;
    if (Array.isArray(collection.array)) return collection.array;
    if (typeof collection.all === 'function') {
      const allItems = collection.all();
      return Array.isArray(allItems) ? allItems : [];
    }

    return [];
  }

  async listInboxConversations() {
    if (!this.sock || !this.ready) {
      throw new Error('WhatsApp client is not ready');
    }

    const chats = this.store?.chats?.all?.() || [];
    const contacts = this.store?.contacts || {};
    const normalizedSelf = normalizeConnectedJid(this.sock?.user?.id || '');
    const merged = [];

    for (const chat of chats) {
      const chatId = String(chat?.id || '').trim();
      const chatType = getChatTypeFromJid(chatId);
      if (chatType === 'other') continue;
      if (chatId === normalizedSelf) continue;

      const rawMessages = this.getStoreMessagesByJid(chatId);
      const mappedMessages = rawMessages
        .map((entry) => {
          const content = normalizeMessageContent(entry?.message) || entry?.message;
          if (!content) return null;

          const summary = summarizeMessageForInbox(content);
          const ts = toMillis(entry?.messageTimestamp || entry?.key?.timestamp || chat?.conversationTimestamp);

          return {
            fromMe: Boolean(entry?.key?.fromMe),
            text: summary.text,
            type: summary.type,
            timestampMs: ts,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.timestampMs - b.timestampMs);

      const lastMessage = mappedMessages[mappedMessages.length - 1] || null;
      const chatTs = toMillis(chat?.conversationTimestamp || chat?.lastMessageRecvTimestamp || chat?.lastMsgTimestamp);
      const lastTimestampMs = Math.max(chatTs, lastMessage?.timestampMs || 0);

      const contact = contacts[chatId] || {};
      const fallbackName = chatType === 'group'
        ? 'Unnamed Group'
        : (extractPhoneFromJid(chatId) || 'Unnamed Contact');

      const name = String(
        chat?.name
        || chat?.subject
        || chat?.notify
        || chat?.pushName
        || contact?.name
        || contact?.notify
        || contact?.verifiedName
        || fallbackName
      ).trim() || fallbackName;

      merged.push({
        chatId,
        chatType,
        name,
        unreadCount: Number(chat?.unreadCount || 0),
        lastMessageText: lastMessage?.text || '',
        lastMessageType: lastMessage?.type || 'unknown',
        lastMessageFromMe: Boolean(lastMessage?.fromMe),
        lastTimestamp: lastTimestampMs ? new Date(lastTimestampMs).toISOString() : null,
      });
    }

    return merged
      .sort((a, b) => toMillis(b.lastTimestamp) - toMillis(a.lastTimestamp));
  }

  async getInboxMessages(chatId, limit = 100) {
    if (!this.sock || !this.ready) {
      throw new Error('WhatsApp client is not ready');
    }

    const cleanChatId = String(chatId || '').trim();
    if (!cleanChatId) {
      throw new Error('chatId is required');
    }

    const cappedLimit = Math.max(1, Math.min(Number(limit) || 100, 500));
    const contacts = this.store?.contacts || {};
    const rawMessages = this.getStoreMessagesByJid(cleanChatId);
    const conversation = rawMessages
      .map((entry) => {
        const content = normalizeMessageContent(entry?.message) || entry?.message;
        if (!content) return null;

        const summary = summarizeMessageForInbox(content);
        const timestampMs = toMillis(entry?.messageTimestamp || entry?.key?.timestamp);

        const participantJid = String(
          entry?.key?.participant
          || entry?.participant
          || ''
        ).trim();
        const participantContact = participantJid ? (contacts[participantJid] || {}) : {};
        const participantName = participantJid
          ? String(
            participantContact?.name
            || participantContact?.notify
            || participantContact?.verifiedName
            || extractPhoneFromJid(participantJid)
            || participantJid
          ).trim()
          : '';

        return {
          id: String(entry?.key?.id || '').trim() || `${timestampMs}-${Math.random().toString(36).slice(2, 7)}`,
          fromMe: Boolean(entry?.key?.fromMe),
          text: summary.text,
          type: summary.type,
          mediaUrl: String(summary.mediaUrl || '').trim(),
          fileName: String(summary.fileName || '').trim(),
          mimeType: String(summary.mimeType || '').trim(),
          isVoiceNote: Boolean(summary.isVoiceNote),
          durationSeconds: Number.isFinite(Number(summary.durationSeconds))
            ? Number(summary.durationSeconds)
            : null,
          timestamp: timestampMs ? new Date(timestampMs).toISOString() : null,
          participantJid,
          participantName,
        };
      })
      .filter(Boolean)
      .sort((a, b) => toMillis(a.timestamp) - toMillis(b.timestamp));

    return conversation.slice(-cappedLimit);
  }

  async listGroups() {
    if (!this.sock || !this.ready) {
      throw new Error('WhatsApp client is not ready');
    }

    const groupsMap = await this.sock.groupFetchAllParticipating();
    return Object.values(groupsMap)
      .map((group) => ({
        id: group.id || '',
        name: group.subject || 'Untitled',
      }))
      .filter((group) => group.id)
      .sort((a, b) => a.name.localeCompare(b.name, 'id'));
  }

  async listPersonalChats() {
    if (!this.sock || !this.ready) {
      throw new Error('WhatsApp client is not ready');
    }

    const normalizePersonalJid = (value) => {
      const raw = String(value || '').trim();
      if (!raw.endsWith('@s.whatsapp.net')) return '';
      const localPart = raw.split('@')[0] || '';
      const phone = localPart.split(':')[0].replace(/\D/g, '');
      if (!phone) return '';
      return `${phone}@s.whatsapp.net`;
    };

    const ownJid = normalizePersonalJid(this.sock?.user?.id || '');
    const contacts = this.store?.contacts || {};
    const chats = this.store?.chats?.all?.() || [];
    const merged = new Map();

    for (const chat of chats) {
      const jid = normalizePersonalJid(chat?.id || '');
      if (!jid || jid === ownJid) continue;

      const hasDirectInteraction = Boolean(
        chat?.conversationTimestamp
        || chat?.lastMessageRecvTimestamp
        || chat?.lastMsgTimestamp
      );
      if (!hasDirectInteraction) continue;

      const phone = this.normalizePersonalNumber(jid);
      const contact = contacts[jid] || contacts[chat?.id] || null;
      merged.set(jid, {
        id: jid,
        name: String(
          chat?.name
          || chat?.notify
          || chat?.pushName
          || contact?.name
          || contact?.notify
          || phone
          || 'Unnamed'
        ),
        phone,
      });
    }

    try {
      const groupsMap = await this.sock.groupFetchAllParticipating();
      for (const group of Object.values(groupsMap || {})) {
        const participants = Array.isArray(group?.participants) ? group.participants : [];

        for (const participant of participants) {
          const rawParticipantId = participant?.id || participant;
          const jid = normalizePersonalJid(rawParticipantId);
          if (!jid || jid === ownJid || merged.has(jid)) continue;

          const phone = this.normalizePersonalNumber(jid);
          const contact = contacts[jid] || contacts[rawParticipantId] || null;
          merged.set(jid, {
            id: jid,
            name: String(contact?.name || contact?.notify || contact?.verifiedName || phone || 'Unnamed'),
            phone,
          });
        }
      }
    } catch (error) {
      console.log('[WA] Failed to enrich personal chats from groups:', error.message);
    }

    return Array.from(merged.values())
      .sort((a, b) => a.name.localeCompare(b.name, 'id'));
  }
}

module.exports = new WhatsAppService();
