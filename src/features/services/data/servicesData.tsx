import React from "react";
import {
  GlobeIcon,
  UpdateIcon,
  CodeIcon,
  MobileIcon,
  MagnifyingGlassIcon,
  LayoutIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

export const SERVICES_LIST = [
  {
    id: "website",
    category: "Website",
    title: "Pembuatan Website Bisnis",
    description:
      "Website profil bisnis, company profile, dan landing page yang berfokus pada kredibilitas, konversi, dan pengalaman pengguna.",
    tags: ["Company Profile", "Landing Page", "Optimasi SEO", "Panel Admin / CMS"],
    linkText: "Konsultasi Pembuatan Web",
    linkHref: "/kontak",
    icon: <GlobeIcon className="h-6 w-6" />,
  },
  {
    id: "redesign",
    category: "Penyegaran",
    title: "Redesign & Optimalisasi Website",
    description:
      "Memodernisasi tampilan dan kode website lama yang lambat, tidak responsif, atau usang menjadi antarmuka modern dengan skor kecepatan Google PageSpeed tinggi.",
    tags: ["Penyegaran UI/UX", "Kecepatan Loading", "Mobile-First", "Migrasi Konten Aman"],
    linkText: "Konsultasi Redesign",
    linkHref: "/kontak",
    icon: <UpdateIcon className="h-6 w-6" />,
  },
  {
    id: "webapp",
    category: "Sistem Web",
    title: "Aplikasi Web & Dashboard Kustom",
    description:
      "Pengembangan sistem internal berbasis web seperti dashboard operasional, inventaris pergudangan, portal karyawan, dan otomatisasi administrasi multi-cabang.",
    tags: ["Dashboard Analitik", "Database Relasional", "Integrasi REST API", "Hak Akses"],
    linkText: "Konsultasi Web App",
    linkHref: "/kontak",
    icon: <CodeIcon className="h-6 w-6" />,
  },
  {
    id: "mobile",
    category: "Mobile App",
    title: "Pengembangan Aplikasi Mobile",
    description:
      "Pembuatan aplikasi Android dan iOS yang responsif, intuitif, dan terintegrasi dengan sistem alur kerja dan API server bisnis Anda.",
    tags: [
      "Android & iOS",
      "Push Notification",
      "Integrasi Payment Gateway",
      "Sinkronisasi Real-Time",
    ],
    linkText: "Konsultasi Mobile App",
    linkHref: "/kontak",
    icon: <MobileIcon className="h-6 w-6" />,
  },
];

export const SERVICE_WORKFLOW_STEPS = [
  {
    step: "Tahap 01",
    stepNumber: "01 / 04",
    title: "Brief dan Struktur",
    desc: "Konsultasi awal, gali tujuan website, siapa targetnya, dan layanan apa yang mau ditonjolkan. Dari situ dibuat sitemap, alias daftar halamannya, plus checklist konten yang harus dikirim klien.",
    output:
      "Sitemap dan checklist konten yang sudah disetujui. Ini penting, karena konten yang telat biasanya yang bikin proyek molor.",
    image: "/assets/workflow/workflow-brief.png",
    icon: <MagnifyingGlassIcon className="h-5 w-5" />,
  },
  {
    step: "Tahap 02",
    stepNumber: "02 / 04",
    title: "Desain",
    desc: "Dibuat mockup di Figma, biasanya untuk beranda dan satu halaman dalam. Klien bisa lihat dulu tampilannya, termasuk tombol WhatsApp-nya jelas atau tidak, sebelum masuk ke koding. Revisinya dibatasi, misalnya 2 kali, supaya tidak berlarut-larut.",
    output: "Desain yang sudah disetujui klien.",
    image: "/assets/workflow/workflow-design.png",
    icon: <LayoutIcon className="h-5 w-5" />,
  },
  {
    step: "Tahap 03",
    stepNumber: "03 / 04",
    title: "Pembangunan",
    desc: "Desain yang disetujui dibangun jadi website, konten dimasukkan, form dan tombol WhatsApp dipasang, SEO dasar dirapikan, dan dashboard analitik dasar ikut dipasang supaya klien bisa lihat pengunjung dan klik WhatsApp.",
    output:
      "Link staging, alias website versi percobaan yang bisa dicek klien sebelum rilis.",
    image: "/assets/workflow/workflow-build.png",
    icon: <CodeIcon className="h-5 w-5" />,
  },
  {
    step: "Tahap 04",
    stepNumber: "04 / 04",
    title: "Uji, Rilis, dan Serah Terima",
    desc: "Website dites di HP dan laptop, dicek kecepatan, link, dan form-nya. Kalau lolos, baru dipasang ke domain dan hosting klien, lalu ada demo singkat cara membaca dashboard dan cara minta update.",
    output:
      "Website sudah live, plus panduan singkat dan garansi perbaikan bug.",
    image: "/assets/workflow/workflow-release.png",
    icon: <RocketIcon className="h-5 w-5" />,
  },
];
