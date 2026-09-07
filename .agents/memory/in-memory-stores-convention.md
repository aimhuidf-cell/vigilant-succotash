---
name: In-memory vs persisted data store convention (ScheduleBot project)
description: Which feature stores are in-memory-only vs JSON-file-persisted, and why.
---

`customCommandStore.js` persists to `.data/custom-commands.json` (load on startup, write on
create/update/delete). `scheduleStore.js` remains a plain in-memory array (not yet persisted, by
user's explicit choice).

**Why:** Workflow restarts (common during CSS/UI iteration) wiped custom commands entirely,
which surfaced as "bot tak respond" bug reports — commands the user created earlier were gone
because nothing wrote them to disk. Custom commands were switched to file-based persistence to
fix that. Schedules were left in-memory because the user declined that follow-up fix when asked.

**How to apply:** When adding new bot features with CRUD state, ask whether restart-durability
matters before defaulting to in-memory; if the user wants it to survive restarts, use a simple
JSON file (same pattern as `customCommandStore.js`) rather than assuming in-memory is fine.
