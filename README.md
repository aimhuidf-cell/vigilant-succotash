# ScheduleBot

Bot WhatsApp untuk menjadwalkan pengiriman pesan melalui web dashboard.

## Fitur

- Koneksi WhatsApp Web dengan QR code
- Buat schedule pesan untuk chat personal dan group dari dashboard
- Dukungan tombol interaktif (quick reply / URL / call / copy / single select) untuk `Send Message` dan `Schedule`
- Menu `Inbox` untuk lihat daftar conversation dan isi chat (pesan masuk + pesan terkirim), termasuk preview media bila tersedia
- `Send Message` support media: image, video, audio/voice note, dan file document (URL atau upload)
- Auto-list group WhatsApp di dashboard untuk isi ID group otomatis
- Scheduler otomatis cek pesan jatuh tempo setiap 5 detik
- Daftar schedule dengan status: `pending`, `sent`, `failed`
- Hapus schedule dari dashboard

## Tech Stack

- Node.js + Express
- whatsapp-web.js
- EJS (server-side rendering)
- Schedule storage: PostgreSQL (via `DATABASE_URL`) atau in-memory fallback

## Cara Menjalankan

1. Install dependency:

	```bash
	npm install
	```

2. Buat file environment:

	```bash
	cp .env.example .env
	```

	Set timezone sesuai lokasi anda dalam file `.env`.
	Contoh Malaysia:

	```env
	TZ=Asia/Kuala_Lumpur
	```

	Jika mahu simpan schedule ke PostgreSQL (contoh Neon), set juga:

	```env
	DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
	```

	Untuk nombor personal, anda boleh set `DEFAULT_DIAL_CODE=60` supaya nombor lokal seperti `017xxxxxxx` akan ditukar automatik kepada format antarabangsa.

	Untuk debug masalah button/quick reply, set `WA_DEBUG_INTERACTIVE=1` supaya log payload interaktif dipaparkan di terminal.

	Dashboard mempunyai halaman `Reminders` untuk membuat pengingat tanggal. Isi nama, tanggal, jam, hari awal (contoh `10, 3, 1, 0`), dan JID chat sasaran. Bot akan mengirim pesan pada jam tersebut dan menyimpan status setiap offset supaya tidak mengirim duplikat.

	Untuk reminder waktu solat, gunakan `.timesolat on`, `.timesolat off`, atau `.timesolat status` dalam chat WhatsApp. Tetapan lokasi menggunakan `BOT_PRAYER_CITY`, `BOT_PRAYER_COUNTRY`, `BOT_PRAYER_METHOD`, dan `BOT_PRAYER_TIMEZONE`.

	Untuk membuat sticker tanpa background, isi `REMOVE_BG_API_KEY` dengan API key dari remove.bg. Balas gambar dengan `.sticker nobg` (alias `.s no-bg` atau `.sticker transparent`). Mode ini hanya menyokong gambar.

3. Jalankan mode development:

	```bash
	npm run dev
	```

	atau mode production:

	```bash
	npm start
	```

4. Buka dashboard di:

	```
	http://localhost:3000
	```

5. Scan QR code di dashboard menggunakan WhatsApp pada ponsel Anda.

## Format Data

- Tipe tujuan:
	- `group`: id group WhatsApp, contoh `1203630xxxx@g.us` (atau tanpa suffix `@g.us`)
- Waktu kirim: isi lewat input `datetime-local` pada form dashboard

### Interactive Buttons (Dashboard)

Untuk `Send Message` dan `Schedule`, sekarang tersedia field builder tombol:

1. Klik `Add Button`
2. Pilih tipe (`Quick Reply`, `Open Link`, `Call`, `WhatsApp`, `Copy Code`, `Single Select`)
3. Isi label dan value sesuai tipe

Anda tidak perlu menulis JSON manual dari dashboard.

Jika perlu kirim lewat API, format array yang diterima tetap seperti berikut:

```json
[
	{
		"name": "quick_reply",
		"buttonParamsJson": "{\"display_text\":\"Check\",\"id\":\".alive\"}"
	}
]
```

Contoh `single_select`:

```json
[
	{
		"name": "single_select",
		"buttonParamsJson": "{\"title\":\"Pilih Menu\",\"sections\":[{\"title\":\"Options\",\"rows\":[{\"id\":\".menu1\",\"title\":\"Menu 1\"}]}]}"
	}
]
```

## Catatan

- Jika `DATABASE_URL` diset, data schedule disimpan ke PostgreSQL.
- Jika `DATABASE_URL` tidak diset, schedule fallback ke in-memory (hilang jika server restart).
- Session WhatsApp disimpan lokal di folder `.baileys_auth`.

## Deploy ke Railway

Project ini sudah disediakan konfigurasi Railway dalam file `railway.json`.

1. Push repository ke GitHub.
2. Di Railway, pilih `New Project` -> `Deploy from GitHub Repo`.
3. Pilih repository ini.
4. Set environment variables berikut di Railway:

	- `TZ=Asia/Kuala_Lumpur`
	- `DEFAULT_DIAL_CODE=60`
	- `DATABASE_URL=postgresql://...`
	- `NIXPACKS_NODE_VERSION=20` (fallback jika Railway masih detect Node 18)
	- `REMOVE_BG_API_KEY=...` (diperlukan untuk command sticker tanpa background)

	`PORT` tidak perlu diset manual kerana Railway akan inject otomatis.

5. Deploy.

## Troubleshooting

### Buttons tidak berfungsi / tidak bertindak balas

**Punca Utama:** Button ID tidak sepadan dengan command trigger.

**Penyelesaian:**

1. **Pastikan button ID sepadan dengan trigger yang ada**
   - Jika command trigger ialah `.hello`, button ID MESTI `.hello` juga
   - Jika button ID `.hello` tetapi trigger `.hi`, ia tidak akan berfungsi
   - Semua huruf dan simbol mesti sama persis

2. **Test dengan demo commands**
   - Cuba trigger `.demobutton` - ini sudah ada button yang berfungsi
   - Cuba trigger `.testbutton` - ini lebih ringkas untuk test
   - Jika demo commands berfungsi, berarti sistem button working

3. **Lihat debug log**
   - Dalam file `.env`, set `WA_DEBUG_INTERACTIVE=1`
   - Restart bot: `npm run dev`
   - Klik button dan lihat log di terminal
   - Cari baris yang menyebut "no command found for selection" atau "matched via button id search"

4. **Contoh yang betul:**
   - Command trigger: `.hello`
   - Quick Reply button dengan Value: `.hello`
   - Response: "Salam! Anda tekan button hello"
   - Apabila user klik button, bot balas dengan "Salam! Anda tekan button hello"

5. **Single Select Menu:**
   - Setiap row ID mesti match command trigger
   - Contoh JSON: `[{"id":".menu1","title":"Menu 1"},{"id":".info","title":"Maklumat"}]`
   - Pastikan `.menu1` dan `.info` commands sudah wujud

6. **Jika masih tidak berfungsi:**
   - Periksa browser console (F12) untuk error
   - Periksa terminal bot untuk error message
   - Pastikan button sudah disimpan (reload page untuk confirm)
   - Cuba buat command baru dengan button baru (jangan edit command lama)

Healthcheck endpoint tersedia di `GET /healthz`.

## API Inbox

- `GET /api/inbox/conversations` -> list conversation dari store WhatsApp
- `GET /api/inbox/conversations/:chatId/messages?limit=150` -> isi pesan untuk satu conversation

## API Send Message Media

- `POST /api/messages/upload-media` -> upload file media (multipart form)
- `POST /api/messages/send` -> kirim pesan dengan opsi `mediaType`, `mediaUrl`, `fileName`, `voiceNote`