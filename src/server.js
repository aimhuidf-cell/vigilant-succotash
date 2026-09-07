require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');

function setupNoisyLogFilter() {
  if (process.env.WA_FILTER_NOISY_LOGS === '0') return;

  const suppressedPatterns = [
    /pendingPreKey/i,
    /SessionEntry/i,
    /Closing stale open session for new outgoing prekey bundle/i,
    /Closing open session in favor of incoming prekey bundle/i,
    /Failed to decrypt message with any known session/i,
    /Bad MAC/i,
  ];

  const shouldSuppress = (args) => {
    const merged = args
      .map((value) => {
        if (typeof value === 'string') return value;
        try {
          return JSON.stringify(value);
        } catch (error) {
          return String(value);
        }
      })
      .join(' ');

    return suppressedPatterns.some((pattern) => pattern.test(merged));
  };

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args) => {
    if (shouldSuppress(args)) return;
    originalLog(...args);
  };

  console.warn = (...args) => {
    if (shouldSuppress(args)) return;
    originalWarn(...args);
  };

  console.error = (...args) => {
    if (shouldSuppress(args)) return;
    originalError(...args);
  };
}

setupNoisyLogFilter();

const whatsappService = require('./services/whatsappService');
const SchedulerService = require('./services/schedulerService');
const scheduleStore = require('./services/scheduleStore');
const createDashboardRouter = require('./routes/dashboardRoutes');

const app = express();
const port = Number(process.env.PORT || 3000);
const lockFilePath = path.join(process.cwd(), '.schedulebot.lock');
const uploadDir = path.join(process.cwd(), 'uploads');

function setupSingleInstanceLock() {
  // Nodemon restarts quickly and can overlap old/new child process briefly.
  // Skipping lock in nodemon mode avoids false "another instance" crashes during dev.
  if (process.env.NODEMON === 'true') {
    return;
  }

  let existingPid = null;

  try {
    const current = fs.readFileSync(lockFilePath, 'utf8').trim();
    existingPid = Number(current);
  } catch (error) {
    // Lock file does not exist yet.
  }

  if (existingPid && Number.isInteger(existingPid)) {
    try {
      process.kill(existingPid, 0);
      console.error(`[BOOT] Another instance is already running (PID ${existingPid}).`);
      process.exit(1);
    } catch (error) {
      // Stale lock, continue and overwrite.
    }
  }

  fs.writeFileSync(lockFilePath, String(process.pid));

  const cleanup = () => {
    try {
      const storedPid = Number(fs.readFileSync(lockFilePath, 'utf8').trim());
      if (storedPid === process.pid) {
        fs.rmSync(lockFilePath, { force: true });
      }
    } catch (error) {
      // Ignore cleanup errors.
    }
  };

  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
  });
}

setupSingleInstanceLock();
fs.mkdirSync(uploadDir, { recursive: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

app.get('/healthz', (req, res) => {
  return res.status(200).json({ ok: true, service: 'schedulebot' });
});

app.use('/', createDashboardRouter(whatsappService));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

async function bootstrap() {
  await scheduleStore.init();

  whatsappService.init();

  const scheduler = new SchedulerService(whatsappService);
  scheduler.start();

  app.listen(port, '0.0.0.0', () => {
    console.log(`[WEB] Dashboard running at http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('[BOOT] Failed to start server:', error);
  process.exit(1);
});
