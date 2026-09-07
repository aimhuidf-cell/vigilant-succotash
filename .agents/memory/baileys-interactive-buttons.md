---
name: Baileys interactive (native flow) buttons
description: How to send WhatsApp quick-reply/URL/call buttons with @whiskeysockets/baileys, with fallback.
---

Native flow buttons (quick_reply, cta_url, cta_call, cta_copy) are sent by building a
`proto.Message.InteractiveMessage` (with `nativeFlowMessage.buttons`) via
`generateWAMessageFromContent`, wrapped in a `viewOnceMessage`, then delivered with
`sock.relayMessage(jid, msg.message, { messageId: msg.key.id })` — not `sock.sendMessage`.

**Why:** Modern WhatsApp deprecated the old template/button message types for most accounts;
native flow interactive messages are the current supported mechanism, but they can still fail
on some baileys/WA versions or account states.

**How to apply:** Always wrap the relayMessage call in try/catch and fall back to the legacy
`sock.sendMessage(jid, { text, footer, buttons: [...], headerType: 1, viewOnce: true })` form
(max 3 buttons, `buttonId`/`buttonText.displayText`/`type: 1`) if the native flow send throws.
Dedup buttons by type+params before sending to avoid WhatsApp rejecting duplicate button ids.
