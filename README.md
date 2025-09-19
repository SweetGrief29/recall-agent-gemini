<pre>
  
   /$$$$$$                                      /$$            /$$$$$$            /$$            /$$$$$$ 
 /$$__  $$                                    | $$           /$$__  $$          |__/           /$$__  $$
| $$  \__/ /$$  /$$  /$$  /$$$$$$   /$$$$$$  /$$$$$$        | $$  \__/  /$$$$$$  /$$  /$$$$$$ | $$  \__/
|  $$$$$$ | $$ | $$ | $$ /$$__  $$ /$$__  $$|_  $$_/        | $$ /$$$$ /$$__  $$| $$ /$$__  $$| $$$$    
 \____  $$| $$ | $$ | $$| $$$$$$$$| $$$$$$$$  | $$          | $$|_  $$| $$  \__/| $$| $$$$$$$$| $$_/    
 /$$  \ $$| $$ | $$ | $$| $$_____/| $$_____/  | $$ /$$      | $$  \ $$| $$      | $$| $$_____/| $$      
|  $$$$$$/|  $$$$$/$$$$/|  $$$$$$$|  $$$$$$$  |  $$$$/      |  $$$$$$/| $$      | $$|  $$$$$$$| $$      
 \______/  \_____/\___/  \_______/ \_______/   \___/         \______/ |__/      |__/ \_______/|__/      
                                                                                                        

</pre>
# Recall + Mastra (Gemini)

Agen trading kompetisi **Recall** menggunakan **Mastra**, mengikuti alur tutorial web resmi (tanpa tambahan fitur), hanya mengganti LLM ke **Google Gemini** via `@ai-sdk/google`.

Repo ini siap dijalankan dari **Mastra Dashboard** dan memanggil tool `recall-trade` ke sandbox Recall.

---

## 1) Setelah Clone

```bash
git clone https://github.com/SweetGrief29/recall-mastra-gemini.git
cd recall-mastra-gemini
```

### Node & NPM

* Wajib: **Node.js 20+** (cek dengan `node -v`)
* Gunakan **npm** bawaan Node (cek `npm -v`)

---

## 2) Install Dependencies

```bash
npm install
```

> Jika kamu ingin instalasi yang deterministik di CI/mesin baru, gunakan:
>
> ```bash
> npm ci
> ```

---

## 3) Siapkan Environment

Salin template env lalu isi:

```bash
cp .env.example .env
```

Edit `.env` (tanpa tanda kutip):

```env
# Gemini (Google AI Studio)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here

# Recall Competition API
RECALL_API_KEY=your_recall_key_here
RECALL_API_URL=https://api.sandbox.competitions.recall.network
```

**Catatan:**

* Gunakan **Google AI Studio API key** (format biasanya mulai `AIza...`).
* Default `RECALL_API_URL` adalah **sandbox**; ganti jika pakai env lain.

---

## 4) Jalankan Dev Server

```bash
npm run dev
```

* Mastra Dashboard: **[http://localhost:4111](http://localhost:4111)**
* Jika dashboard tidak auto-open, buka manual URL di atas.

> Di Windows PowerShell, pastikan terminal memiliki akses ke file `.env`. Repo ini sudah mengaktifkan `dotenv` via script `npm run dev`. Tidak perlu set env manual.

---

## 5) Uji di Dashboard (Tanpa Kode)

1. Buka **Agents → Recall Agent → Chat**
2. Kirim prompt contoh:

   ```
   Buy 500 USD of WETH using USDC on Ethereum
   ```
3. Agent akan mengeluarkan **tool call** ke `recall-trade` dengan parameter:

   * `fromToken` (alamat USDC), `toToken` (alamat WETH), `amount` (`"500"`), `reason`
4. Hasil eksekusi tool (trade sandbox) akan muncul di log/response.

> Jika arenamu memakai chain lain, sertakan **alamat token yang benar** dalam prompt.

---

## 6) Struktur Proyek

```
src/
  mastra/
    agents/
      recall-agent.ts        # Agent Mastra: model Gemini + panggil recall-trade
    tools/
      recall-trade.ts        # Tool: POST {RECALL_API_URL}/api/trade/execute
  index.ts                   # Bootstrap Mastra (dashboard, route, agent)
.env.example                 # Template env
README.md
```

* `recall-trade.ts`:

  * `POST {RECALL_API_URL}/api/trade/execute`
  * Header: `Authorization: Bearer ${RECALL_API_KEY}`
  * Body: `{ fromToken, toToken, amount, reason }`

---

## 7) Yang **Tidak** Ikut Ter-commit

Folder berikut **sengaja** tidak di-upload (ada di `.gitignore`):

```
node_modules/
.mastra/
.env
dist/
```

Ini normal. Setelah clone:

* Jalankan `npm install` → membuat `node_modules/`
* Jalankan `npm run dev` → Mastra membuat `.mastra/` runtime

---

## 8) Troubleshooting Cepat

**A. 403 / PERMISSION\_DENIED (Gemini)**

* `.env` belum terbaca atau key salah.
* Pastikan `GOOGLE_GENERATIVE_AI_API_KEY` terisi dan `npm run dev` dijalankan dari root repo (script sudah memuat `dotenv`).
* Pastikan model yang digunakan tersedia untuk key kamu (mis. `gemini-1.5-flash` / `gemini-2.5-flash`).

**B. 401 / 403 (Recall API)**

* Cek `RECALL_API_KEY` valid.
* Cek `RECALL_API_URL` benar (sandbox vs prod).
* Lihat log server saat tool dipanggil.

**C. Tool tidak “jalan” (muncul `tool-calls` tapi tanpa hasil)**

* Pastikan kamu menjalankan branch/commit terbaru repo ini (route server sudah mengeksekusi tool).
* Cek log terminal untuk error dari endpoint Recall.

**D. Alamat Token**

* Gunakan **alamat kontrak yang benar** sesuai chain arenamu.
* Jika ragu, sertakan alamat eksplisit di prompt (agent akan memakai itu).

---

## 9) Skrip NPM

* `npm run dev` — Jalankan Mastra dalam mode dev (dengan dashboard)
* `npm run build` — Build (opsional, jika disiapkan)
* `npm run start` — Menjalankan hasil build (opsional)
