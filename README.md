# i2m2 (Indonesia Internet Metric Monitor)

**i2m2** adalah personal project dashboard untuk memonitor metrik trafik, performa, dan infrastruktur internet Indonesia menggunakan data dari **Cloudflare Radar** dan visualisasi peta **MapLibre GL**.

---

## 🛠️ Stack & Tooling

- **Framework**: [Nuxt](https://nuxt.com/) (Nuxt 4 / Vue 3)
- **Language**: TypeScript (strict mode with `vue-tsc`)
- **Linter & Formatter**: ESLint 9 + `@nuxt/eslint` (Flat Config)
- **Styling**: Tailwind CSS
- **Map Visualization**: [MapLibre GL](https://maplibre.org/) (`maplibre-gl`)
- **Backend / API Engine**: Nuxt Nitro Server Routes (`server/api/*`)
- **Testing**: [Vitest](https://vitest.dev/) + `@nuxt/test-utils` + `happy-dom`

---

## 📁 Struktur Direktori

```text
i2m2/
├── app/
│   ├── app.vue                   # Dashboard utama (Metrik, Map, & Explorer)
│   └── components/
│       └── IndonesiaMap.client.vue # Komponen peta MapLibre GL Indonesia
├── server/
│   └── api/
│       └── radar/
│           ├── indonesia.get.ts  # Endpoint metrik internet Indonesia (Live / Mock fallback)
│           └── explore.get.ts    # Playground endpoint untuk mengulik Cloudflare Radar API
├── tests/
│   ├── basic.test.ts             # Sample baseline unit test
│   └── api/
│       └── radar.test.ts         # Unit test untuk server API handler
├── .env.example                  # Template kredensial Cloudflare
├── eslint.config.mjs             # Konfigurasi ESLint Flat Config
├── nuxt.config.ts                # Konfigurasi Nuxt & Nitro runtimeConfig
└── vitest.config.ts              # Konfigurasi Vitest dengan Nuxt test environment
```

---

## 🚀 Memulai Proyek

### 1. Install Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment (Opsional untuk tahap awal)
Aplikasi sudah dilengkapi dengan *fallback mock data* Indonesia sehingga dapat langsung dijalankan tanpa token API.

Jika ingin menghubungkan langsung ke live Cloudflare Radar API:
1. Salin `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
2. Buat API Token di [Cloudflare Dashboard (API Tokens)](https://dash.cloudflare.com/profile/api-tokens) dengan izin **Radar Read**.
3. Masukkan token ke `.env`:
   ```env
   CLOUDFLARE_API_TOKEN=your_token_here
   ```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🧪 Skrip Perintah (Scripts)

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan server dev dengan HMR |
| `npm run build` | Melakukan build aplikasi untuk *production* |
| `npm run lint` | Menjalankan ESLint |
| `npm run lint:fix` | Memperbaiki masalah format kode secara otomatis |
| `npm run typecheck` | Menjalankan type checking TypeScript via `vue-tsc` |
| `npm run test` | Menjalankan unit test dengan Vitest |
| `npm run test:watch` | Menjalankan Vitest dalam mode watch |

---

## 📡 Cloudflare Radar Endpoints Reference

Beberapa endpoint Cloudflare Radar yang relevan untuk dipelajari:

- **Bot vs Human Traffic**: `/radar/http/summary/bot?location=ID&dateRange=7d`
- **Device Distribution**: `/radar/http/summary/device_type?location=ID&dateRange=7d`
- **HTTP Protocols**: `/radar/http/summary/http_version?location=ID&dateRange=7d`
- **TLS Protocols**: `/radar/http/summary/tls_version?location=ID&dateRange=7d`
- **DDoS / Layer 3 Attacks**: `/radar/attacks/layer3/summary?location=ID&dateRange=7d`
- **Network Quality & Speed**: `/radar/quality/speed/summary?location=ID&dateRange=7d`
- **Top ASNs**: `/radar/ranking/top/ases?location=ID`
