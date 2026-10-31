# Next Karya Digital Solutions - Frontend Web Application

Aplikasi web dan antarmuka resmi Next Karya Digital Solutions, dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, dan **Tailwind CSS v4**.

Aplikasi ini berfungsi khusus sebagai lapisan presentasi publik dan portal antarmuka yang mengonsumsi layanan backend REST API Express.js.

## 1. Fitur Utama
- **Landing Page Interaktif:** Katalog Layanan, Portofolio Studi Kasus, Kalkulator/Pricing, FAQ Interaktif, dan Formulir Konsultasi Prospek.
- **Optimasi Mesin Pencari (SEO):** Metadata kanonik, OpenGraph lengkap, robots.txt, sitemap.xml otomatis, dan Schema.org JSON-LD (Organization, ProfessionalService, WebSite, FAQPage).
- **Arsitektur Konsumsi API:** Terhubung ke Backend API Express.js melalui modul terpusat `src/lib/api-client.ts`, dengan proteksi data fallback mandiri.

## 2. Kebutuhan Sistem & Pemasangan

1. Pasang dependensi:
```bash
npm install
```

2. Konfigurasi Variabel Lingkungan:
Salin berkas `.env.example` menjadi `.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

3. Menjalankan Server Pengembangan:
```bash
npm run dev
```
Akses aplikasi melalui peramban di `http://localhost:3000`.

4. Membangun Distribusi Produksi:
```bash
npm run build
npm start
```
