---
name: Baileys "Decrypted message with closed session" errors
description: Root cause and fix for incoming WhatsApp messages silently failing to decrypt.
---

Symptom: bot connects fine (`connection === 'open'`, QR/pairing succeeds) but never responds to
any incoming message/trigger. Workflow logs show `Decrypted message with closed session.` with
no other stack trace — `messages.upsert` either doesn't fire with usable content or the message
handler never sees valid text.

**Why:** `makeWASocket({ auth: state, ... })` passing the raw `useMultiFileAuthState` state
directly (instead of wrapping `state.keys` in `makeCacheableSignalKeyStore`) makes the Signal
protocol session/key lookups uncached and prone to desyncing — especially after repeated
socket restarts (e.g. many workflow restarts during unrelated UI iteration in the same session).
Once a session desyncs, incoming messages fail Signal decryption entirely and are dropped before
reaching any application-level handler.

**How to apply:** Always construct the baileys auth option as
`{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) }`, never
`auth: state` directly. If this error still appears after adding the cacheable key store, the
existing `.baileys_auth` session is likely already corrupted — clear it and re-pair (QR or
pairing code) to get fresh session keys.
