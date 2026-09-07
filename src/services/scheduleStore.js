const dayjs = require('dayjs');
const postgres = require('../lib/postgres');

const schedules = [];
let idCounter = 1;
let initialized = false;

function toSchedule(row) {
  const parsedButtons = Array.isArray(row.buttons_json)
    ? row.buttons_json
    : [];

  return {
    id: Number(row.id),
    targetType: row.target_type,
    targetValue: row.target_value,
    message: row.message,
    buttons: parsedButtons,
    scheduleAt: row.schedule_at,
    status: row.status,
    createdAt: row.created_at,
    sentAt: row.sent_at,
    error: row.error,
  };
}

async function init() {
  if (initialized) return;

  if (postgres.hasDatabase()) {
    await postgres.query(
      `CREATE TABLE IF NOT EXISTS schedules (
        id BIGSERIAL PRIMARY KEY,
        target_type TEXT NOT NULL,
        target_value TEXT NOT NULL,
        message TEXT NOT NULL,
        buttons_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        schedule_at TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        sent_at TIMESTAMPTZ,
        error TEXT
      )`
    );

    await postgres.query(
      `ALTER TABLE schedules
       ADD COLUMN IF NOT EXISTS buttons_json JSONB NOT NULL DEFAULT '[]'::jsonb`
    );

    console.log('[ScheduleStore] PostgreSQL storage is enabled');
  } else {
    console.log('[ScheduleStore] DATABASE_URL not set, using in-memory schedule storage');
  }

  initialized = true;
}

async function createSchedule({ targetType, targetValue, message, buttons, scheduleAt }) {
  await init();

  const normalizedButtons = Array.isArray(buttons)
    ? buttons
      .filter((item) => item && typeof item === 'object' && item.name)
      .map((item) => ({
        name: String(item.name || '').trim(),
        buttonParamsJson: typeof item.buttonParamsJson === 'string'
          ? item.buttonParamsJson
          : JSON.stringify(item.buttonParamsJson || {}),
      }))
      .filter((item) => item.name)
    : [];

  if (postgres.hasDatabase()) {
    const result = await postgres.query(
      `INSERT INTO schedules (target_type, target_value, message, buttons_json, schedule_at, status)
       VALUES ($1, $2, $3, $4::jsonb, $5, 'pending')
       RETURNING id, target_type, target_value, message, buttons_json,
                 schedule_at::text AS schedule_at,
                 status,
                 created_at::text AS created_at,
                 sent_at::text AS sent_at,
                 error`,
      [targetType, targetValue, message, JSON.stringify(normalizedButtons), scheduleAt]
    );
    return toSchedule(result.rows[0]);
  }

  const newItem = {
    id: idCounter++,
    targetType,
    targetValue,
    message,
    buttons: normalizedButtons,
    scheduleAt,
    status: 'pending',
    createdAt: new Date().toISOString(),
    sentAt: null,
    error: null,
  };

  schedules.push(newItem);
  return newItem;
}

async function listSchedules() {
  await init();

  if (postgres.hasDatabase()) {
    const result = await postgres.query(
      `SELECT id, target_type, target_value, message,
              buttons_json,
              schedule_at::text AS schedule_at,
              status,
              created_at::text AS created_at,
              sent_at::text AS sent_at,
              error
       FROM schedules
       ORDER BY schedule_at ASC`
    );
    return result.rows.map(toSchedule);
  }

  return [...schedules].sort((a, b) => {
    const aTime = dayjs(a.scheduleAt).valueOf();
    const bTime = dayjs(b.scheduleAt).valueOf();
    return aTime - bTime;
  });
}

async function getPendingSchedules(now = new Date()) {
  await init();

  if (postgres.hasDatabase()) {
    const nowIso = dayjs(now).toISOString();
    const result = await postgres.query(
      `SELECT id, target_type, target_value, message,
              buttons_json,
              schedule_at::text AS schedule_at,
              status,
              created_at::text AS created_at,
              sent_at::text AS sent_at,
              error
       FROM schedules
       WHERE status = 'pending' AND schedule_at <= $1
       ORDER BY schedule_at ASC`,
      [nowIso]
    );
    return result.rows.map(toSchedule);
  }

  const nowMs = dayjs(now).valueOf();
  return schedules.filter((item) => {
    if (item.status !== 'pending') return false;
    return dayjs(item.scheduleAt).valueOf() <= nowMs;
  });
}

async function markSent(id) {
  await init();

  if (postgres.hasDatabase()) {
    const result = await postgres.query(
      `UPDATE schedules
       SET status = 'sent', sent_at = NOW(), error = NULL
       WHERE id = $1
       RETURNING id, target_type, target_value, message, buttons_json,
                 schedule_at::text AS schedule_at,
                 status,
                 created_at::text AS created_at,
                 sent_at::text AS sent_at,
                 error`,
      [id]
    );
    return result.rowCount ? toSchedule(result.rows[0]) : null;
  }

  const target = schedules.find((item) => item.id === id);
  if (!target) return null;

  target.status = 'sent';
  target.sentAt = new Date().toISOString();
  target.error = null;
  return target;
}

async function markFailed(id, errorMessage) {
  await init();

  if (postgres.hasDatabase()) {
    const result = await postgres.query(
      `UPDATE schedules
       SET status = 'failed', error = $2
       WHERE id = $1
       RETURNING id, target_type, target_value, message, buttons_json,
                 schedule_at::text AS schedule_at,
                 status,
                 created_at::text AS created_at,
                 sent_at::text AS sent_at,
                 error`,
      [id, errorMessage]
    );
    return result.rowCount ? toSchedule(result.rows[0]) : null;
  }

  const target = schedules.find((item) => item.id === id);
  if (!target) return null;

  target.status = 'failed';
  target.error = errorMessage;
  return target;
}

async function removeSchedule(id) {
  await init();

  if (postgres.hasDatabase()) {
    const result = await postgres.query('DELETE FROM schedules WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  const index = schedules.findIndex((item) => item.id === id);
  if (index === -1) return false;

  schedules.splice(index, 1);
  return true;
}

module.exports = {
  init,
  createSchedule,
  listSchedules,
  getPendingSchedules,
  markSent,
  markFailed,
  removeSchedule,
};
