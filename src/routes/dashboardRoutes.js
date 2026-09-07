const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const multer = require('multer');
const scheduleStore = require('../services/scheduleStore');
const customCommandStore = require('../services/customCommandStore');
const deletedMessageStore = require('../services/deletedMessageStore');
const botPermissionStore = require('../services/botPermissionStore');
const dashboardPasswordStore = require('../services/dashboardPasswordStore');
const savedContactStore = require('../services/savedContactStore');
const reminderStore = require('../services/reminderStore');

const BUILT_IN_COMMANDS = [
  { trigger: '.sticker nobg', description: 'Reply gambar untuk membuat sticker tanpa background.', category: 'Media' },
  { trigger: '.wslink <phone>', description: 'Buat link WhatsApp dengan tombol copy.', category: 'Utility' },
  { trigger: '.wlink <phone>', description: 'Alias untuk .wslink.', category: 'Utility' },
  { trigger: '.tiktok <url>', description: 'Download video TikTok publik.', category: 'Media' },
];

const uploadDir = path.join(process.cwd(), 'uploads');
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const baseName = path
      .basename(file.originalname || 'media', ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-');
    cb(null, `${Date.now()}-${baseName || 'media'}${ext}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

const SESSION_COOKIE_NAME = 'schedulebot_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

function readCookie(req, name) {
  const cookies = String(req.headers.cookie || '').split(';');
  const prefix = `${name}=`;
  const cookie = cookies.map((item) => item.trim()).find((item) => item.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
}

function createSessionToken(sessionSecret) {
  const payload = Buffer.from(JSON.stringify({ expiresAt: Date.now() + SESSION_DURATION_MS })).toString('base64url');
  const signature = crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function hasValidSession(req, sessionSecret) {
  const [payload, receivedSignature] = readCookie(req, SESSION_COOKIE_NAME).split('.');
  if (!payload || !receivedSignature) return false;

  const expectedSignature = crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return false;

  try {
    return Number(JSON.parse(Buffer.from(payload, 'base64url').toString()).expiresAt) > Date.now();
  } catch (error) {
    return false;
  }
}

function parseClientLocalDateTime(scheduleAt, timezoneOffsetMinutes) {
  const raw = String(scheduleAt || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const offset = Number.isFinite(Number(timezoneOffsetMinutes))
    ? Number(timezoneOffsetMinutes)
    : 0;

  const utcMs = Date.UTC(year, month - 1, day, hour, minute) + (offset * 60 * 1000);
  const parsed = dayjs(utcMs);

  if (!parsed.isValid()) return null;
  return parsed;
}

function normalizeButtonsPayload(buttons) {
  if (buttons == null || buttons === '') return [];

  let parsed = buttons;
  if (typeof parsed === 'string') {
    const raw = parsed.trim();
    if (!raw) return [];
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error('buttons must be valid JSON');
    }
  }

  if (!Array.isArray(parsed)) {
    throw new Error('buttons must be an array');
  }

  return parsed
    .filter((item) => item && typeof item === 'object' && item.name)
    .map((item) => ({
      name: String(item.name || '').trim(),
      buttonParamsJson: typeof item.buttonParamsJson === 'string'
        ? item.buttonParamsJson
        : JSON.stringify(item.buttonParamsJson || {}),
    }))
    .filter((item) => item.name);
}

function normalizeSendMediaType(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw || raw === 'none') return '';
  if (raw === 'voice') return 'audio';
  return raw;
}

function createDashboardRouter(whatsappService) {
  const router = express.Router();
  const dashboardPassword = process.env.DASHBOARD_PASSWORD || 'Acun97';
  const sessionSecret = process.env.DASHBOARD_SESSION_SECRET || `${dashboardPassword}:schedulebot`;

  function setSessionCookie(req, res) {
    const isSecure = req.secure || req.get('x-forwarded-proto') === 'https';
    res.cookie(SESSION_COOKIE_NAME, createSessionToken(sessionSecret), {
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecure,
      maxAge: SESSION_DURATION_MS,
    });
  }

  function requireDashboardSession(req, res, next) {
    if (hasValidSession(req, sessionSecret)) return next();
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Sign in required' });
    }
    return res.redirect('/sign-in');
  }

  async function getDashboardViewData(req) {
    const schedules = await scheduleStore.listSchedules();
    const waState = whatsappService.getConnectionState();
    const scheduleStats = schedules.reduce(
      (acc, item) => {
        acc.total += 1;
        if (item.status === 'pending') acc.pending += 1;
        if (item.status === 'sent') acc.sent += 1;
        if (item.status === 'failed') acc.failed += 1;
        return acc;
      },
      { total: 0, pending: 0, sent: 0, failed: 0 }
    );

    const customCommands = customCommandStore.listCommands();
    const deletedMessages = deletedMessageStore.listRecords();
    const savedContacts = savedContactStore.listContacts();

    return {
      schedules,
      waState,
      scheduleStats,
      dayjs,
      customCommands,
      commandCategories: customCommandStore.ALLOWED_CATEGORIES,
      mediaTypes: customCommandStore.ALLOWED_MEDIA_TYPES,
      deletedMessages,
      savedContacts,
      reminders: reminderStore.listReminders(),
      builtInCommands: BUILT_IN_COMMANDS,
      contactCategories: savedContactStore.ALLOWED_CATEGORIES,
      botPermission: botPermissionStore.getSettings(),
      passwordFeedback: req.query.passwordUpdated
        ? { type: 'success', message: 'Password changed successfully.' }
        : req.query.passwordError === 'too-short'
          ? { type: 'error', message: 'New password must be at least 8 characters.' }
          : req.query.passwordError === 'mismatch'
            ? { type: 'error', message: 'New password and confirmation do not match.' }
            : req.query.passwordError === 'incorrect'
              ? { type: 'error', message: 'Current password is incorrect.' }
              : null,
    };
  }

  router.get('/sign-in', (req, res) => {
    if (hasValidSession(req, sessionSecret)) return res.redirect('/');
    return res.render('sign-in', { invalidPassword: req.query.error === 'invalid-password' });
  });

  router.post('/sign-in', (req, res) => {
    return dashboardPasswordStore.verifyPassword(req.body?.password, dashboardPassword)
      .then((isValid) => {
        if (!isValid) return res.redirect('/sign-in?error=invalid-password');
        setSessionCookie(req, res);
        return res.redirect('/');
      })
      .catch((error) => {
        return res.status(500).send(error.message);
      });
  });

  router.post('/sign-out', requireDashboardSession, (req, res) => {
    res.clearCookie(SESSION_COOKIE_NAME);
    return res.redirect('/sign-in');
  });

  router.post('/change-password', requireDashboardSession, async (req, res, next) => {
    const currentPassword = String(req.body?.currentPassword || '');
    const newPassword = String(req.body?.newPassword || '');
    const confirmPassword = String(req.body?.confirmPassword || '');

    try {
      if (!newPassword || newPassword.length < 8) {
        return res.redirect('/?passwordError=too-short#settings');
      }
      if (newPassword !== confirmPassword) {
        return res.redirect('/?passwordError=mismatch#settings');
      }
      if (!await dashboardPasswordStore.verifyPassword(currentPassword, dashboardPassword)) {
        return res.redirect('/?passwordError=incorrect#settings');
      }

      await dashboardPasswordStore.updatePassword(newPassword);
      return res.redirect('/?passwordUpdated=1#settings');
    } catch (error) {
      return next(error);
    }
  });

  router.use(requireDashboardSession);

  router.get('/', async (req, res, next) => {
    try {
      const viewData = await getDashboardViewData(req);
      res.render('dashboard', viewData);
    } catch (error) {
      next(error);
    }
  });

  router.get('/api/custom-commands', (req, res) => {
    return res.json({ commands: customCommandStore.listCommands() });
  });

  router.get('/api/bot-permissions', (req, res) => {
    return res.json(botPermissionStore.getSettings());
  });

  router.get('/api/reminders', (req, res) => {
    return res.json({ reminders: reminderStore.listReminders() });
  });

  router.post('/api/reminders', (req, res) => {
    try {
      return res.status(201).json(reminderStore.createReminder(req.body || {}));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  router.put('/api/reminders/:id', (req, res) => {
    try {
      return res.json(reminderStore.updateReminder(req.params.id, req.body || {}));
    } catch (error) {
      return res.status(error.message === 'Reminder not found' ? 404 : 400).json({ error: error.message });
    }
  });

  router.delete('/api/reminders/:id', (req, res) => {
    if (!reminderStore.removeReminder(req.params.id)) return res.status(404).json({ error: 'Reminder not found' });
    return res.status(204).send();
  });

  router.put('/api/bot-permissions', (req, res) => {
    try {
      return res.json(botPermissionStore.updateSettings(req.body || {}));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  router.post('/api/custom-commands', (req, res) => {
    try {
      const created = customCommandStore.createCommand(req.body || {});
      return res.status(201).json(created);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  router.post('/api/custom-commands/upload-media', upload.single('mediaFile'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const mediaType = String(req.body?.mediaType || '').trim();
      const allowedMedia = new Set(customCommandStore.ALLOWED_MEDIA_TYPES);
      if (!allowedMedia.has(mediaType)) {
        return res.status(400).json({ error: 'Invalid media type for upload' });
      }

      const host = req.get('host');
      const protocol = req.protocol || 'http';
      const mediaUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

      return res.status(201).json({
        mediaUrl,
        fileName: req.file.originalname || req.file.filename,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Failed to upload media file' });
    }
  });

  router.post('/api/messages/upload-media', upload.single('mediaFile'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const mediaType = normalizeSendMediaType(req.body?.mediaType);
      const allowedMedia = new Set(['image', 'video', 'audio', 'document']);
      if (!allowedMedia.has(mediaType)) {
        return res.status(400).json({ error: 'Invalid media type for upload' });
      }

      const host = req.get('host');
      const protocol = req.protocol || 'http';
      const mediaUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

      return res.status(201).json({
        mediaUrl,
        fileName: req.file.originalname || req.file.filename,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Failed to upload media file' });
    }
  });

  router.put('/api/custom-commands/:trigger', (req, res) => {
    try {
      const updated = customCommandStore.updateCommand(req.params.trigger, req.body || {});
      return res.json(updated);
    } catch (error) {
      const status = error.message === 'Command not found' ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  });

  router.delete('/api/custom-commands/:trigger', (req, res) => {
    const removed = customCommandStore.removeCommand(req.params.trigger);
    if (!removed) {
      return res.status(404).json({ error: 'Command not found' });
    }
    return res.status(204).send();
  });

  router.get('/api/contacts', (req, res) => {
    return res.json({ contacts: savedContactStore.listContacts() });
  });

  router.post('/api/contacts', (req, res) => {
    try {
      const created = savedContactStore.createContact(req.body || {});
      return res.status(201).json(created);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  router.put('/api/contacts/:id', (req, res) => {
    try {
      const updated = savedContactStore.updateContact(req.params.id, req.body || {});
      return res.json(updated);
    } catch (error) {
      const status = error.message === 'Contact not found' ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  });

  router.delete('/api/contacts/:id', (req, res) => {
    const removed = savedContactStore.removeContact(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    return res.status(204).send();
  });

  router.post('/api/schedules', async (req, res, next) => {
    try {
      const {
        targetType,
        targetValue,
        message,
        buttons,
        scheduleAt,
        timezoneOffsetMinutes,
      } = req.body;
      const normalizedTargetType =
        targetType === 'personal-manual' || targetType === 'personal-chat' ? 'personal' : targetType;
      let normalizedButtons = [];
      try {
        normalizedButtons = normalizeButtonsPayload(buttons);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

      if (!normalizedTargetType || !targetValue || !message || !scheduleAt) {
        return res.status(400).json({
          error: 'targetType, targetValue, message, and scheduleAt are required',
        });
      }

      if (!['personal', 'group'].includes(normalizedTargetType)) {
        return res.status(400).json({ error: 'targetType must be personal or group' });
      }

      const parsed = parseClientLocalDateTime(scheduleAt, timezoneOffsetMinutes);
      if (!parsed.isValid()) {
        return res.status(400).json({
          error: 'Invalid scheduleAt format',
        });
      }

      const created = await scheduleStore.createSchedule({
        targetType: normalizedTargetType,
        targetValue,
        message,
        buttons: normalizedButtons,
        scheduleAt: parsed.toISOString(),
      });

      return res.status(201).json(created);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/api/messages/send', async (req, res) => {
    try {
      const {
        targetType,
        targetValue,
        message,
        buttons,
        mediaType,
        mediaUrl,
        fileName,
        voiceNote,
      } = req.body || {};
      const normalizedTargetType =
        targetType === 'personal-manual' || targetType === 'personal-chat' ? 'personal' : targetType;
      const normalizedButtons = normalizeButtonsPayload(buttons);
      const cleanMessage = String(message || '').trim();
      const cleanMediaType = normalizeSendMediaType(mediaType);
      const cleanMediaUrl = String(mediaUrl || '').trim();
      const cleanFileName = String(fileName || '').trim();
      const mediaPayload = cleanMediaType && cleanMediaUrl
        ? {
          type: cleanMediaType,
          url: cleanMediaUrl,
          fileName: cleanFileName,
          ptt: cleanMediaType === 'audio' && (voiceNote === true || voiceNote === 'true'),
        }
        : null;

      if (!normalizedTargetType || !targetValue || (!cleanMessage && !normalizedButtons.length && !mediaPayload)) {
        return res.status(400).json({
          error: 'targetType, targetValue, and at least message, buttons, or media are required',
        });
      }

      if (cleanMediaType && !cleanMediaUrl) {
        return res.status(400).json({ error: 'mediaUrl is required when mediaType is set' });
      }

      if (cleanMediaType && !['image', 'video', 'audio', 'document'].includes(cleanMediaType)) {
        return res.status(400).json({ error: 'Invalid mediaType' });
      }

      if (!['personal', 'group'].includes(normalizedTargetType)) {
        return res.status(400).json({ error: 'targetType must be personal or group' });
      }

      await whatsappService.sendMessage(
        normalizedTargetType,
        String(targetValue).trim(),
        cleanMessage,
        {
          buttons: normalizedButtons,
          media: mediaPayload,
        }
      );

      return res.status(200).json({ ok: true });
    } catch (error) {
      const status = error.message === 'WhatsApp client is not ready' ? 409 : 400;
      return res.status(status).json({ error: error.message || 'Failed to send message' });
    }
  });

  router.delete('/api/schedules/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const deleted = await scheduleStore.removeSchedule(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  router.get('/api/deleted-messages', (req, res) => {
    return res.json({ messages: deletedMessageStore.listRecords() });
  });

  router.delete('/api/deleted-messages/:id', (req, res) => {
    const removed = deletedMessageStore.removeRecord(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Record not found' });
    }
    return res.status(204).send();
  });

  router.delete('/api/deleted-messages/chat/:chatId', (req, res) => {
    const removedCount = deletedMessageStore.removeRecordsByChatId(req.params.chatId);
    if (!removedCount) {
      return res.status(404).json({ error: 'Conversation records not found' });
    }
    return res.status(204).send();
  });

  router.delete('/api/deleted-messages', (req, res) => {
    deletedMessageStore.clearRecords();
    return res.status(204).send();
  });

  router.get('/api/whatsapp/groups', async (req, res, next) => {
    try {
      const groups = await whatsappService.listGroups();
      return res.json({ groups });
    } catch (error) {
      if (error.message === 'WhatsApp client is not ready') {
        return res.status(409).json({ error: error.message });
      }
      return next(error);
    }
  });

  router.get('/api/whatsapp/personal-chats', async (req, res, next) => {
    try {
      const chats = await whatsappService.listPersonalChats();
      return res.json({ chats });
    } catch (error) {
      if (error.message === 'WhatsApp client is not ready') {
        return res.status(409).json({ error: error.message });
      }
      return next(error);
    }
  });

  router.get('/api/whatsapp/state', (req, res) => {
    const waState = whatsappService.getConnectionState();
    return res.json(waState);
  });

  router.get('/api/inbox/conversations', async (req, res, next) => {
    try {
      const conversations = await whatsappService.listInboxConversations();
      return res.json({ conversations });
    } catch (error) {
      if (error.message === 'WhatsApp client is not ready') {
        return res.status(409).json({ error: error.message });
      }
      return next(error);
    }
  });

  router.get('/api/inbox/conversations/:chatId/messages', async (req, res, next) => {
    try {
      const chatId = String(req.params.chatId || '').trim();
      const limit = Number(req.query?.limit || 120);
      const messages = await whatsappService.getInboxMessages(chatId, limit);
      return res.json({ messages });
    } catch (error) {
      if (error.message === 'WhatsApp client is not ready') {
        return res.status(409).json({ error: error.message });
      }
      return next(error);
    }
  });

  router.post('/api/whatsapp/pairing-code', async (req, res) => {
    try {
      const { phoneNumber } = req.body || {};
      const code = await whatsappService.requestPairingCode(phoneNumber);
      return res.json({ code });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createDashboardRouter;
