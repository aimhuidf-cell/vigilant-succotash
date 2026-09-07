---
name: Baileys pairing-code login
description: How to add phone-number + pairing-code connection as an alternative to QR login with @whiskeysockets/baileys
---

To offer "connect via phone number" alongside QR scanning, call `await sock.requestPairingCode(phoneNumber)` on the already-created socket, guarded by:
- `sock` exists and is not yet `ready`/connected
- `!sock.authState.creds.registered` (already-registered sessions can't request a new pairing code — they must log out / clear auth first)
- not already mid-request (a request-in-flight flag prevents duplicate calls)

The phone number must be digits-only with country code (no `+`), matching the same normalization used for building WhatsApp JIDs.

**Why:** requesting a pairing code on a registered/connected session throws; the dashboard needs a clear error instead of a crash when the user clicks "Get Pairing Code" after already being connected.

**How to apply:** Expose a `requestPairingCode(phoneNumber)` service method returning the code string, store it on connection state (reset it whenever a new QR arrives, connection opens, or logout happens — same lifecycle as the QR data URL), and surface it via a small dashboard API route + polling on the existing WhatsApp-state endpoint.
