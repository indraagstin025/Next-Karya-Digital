import React from "react";
import {
  DesktopIcon,
  CodeIcon,
  LightningBoltIcon,
  TargetIcon,
  CheckCircledIcon,
  GlobeIcon,
  UpdateIcon,
  MobileIcon,
  MagnifyingGlassIcon,
  LayoutIcon,
  RocketIcon,
  LayersIcon,
  EnvelopeClosedIcon,
  ClockIcon,
  ChatBubbleIcon,
  SewingPinIcon,
} from "@radix-ui/react-icons";
import type {
  HighlightItem,
  ServiceTeaserItem,
  WorkflowStepItem,
  PortfolioTeaserItem,
  PricingPlan,
  FaqItem,
  ContactInfoItem,
} from "../types";

export const HERO_HIGHLIGHTS: HighlightItem[] = [
  {
    icon: <DesktopIcon className="h-4 w-4" />,
    label: "Solusi Digital",
  },
  {
    icon: <CodeIcon className="h-4 w-4" />,
    label: "Pengembangan Web",
  },
  {
    icon: <LightningBoltIcon className="h-4 w-4" />,
    label: "Inovasi Teknologi",
  },
];

export const ABOUT_FEATURES = [
  {
    icon: <TargetIcon className="h-5 w-5" />,
    title: "Dimulai dari Masalah Anda, Bukan dari Teknologi",
    description:
      "Kami dengarkan dulu kendala bisnis Anda, baru kami bangun solusinya. Jadi setiap fitur ada alasannya, dan setiap biaya yang Anda keluarkan terasa manfaatnya.",
  },
  {
    icon: <LightningBoltIcon className="h-5 w-5" />,
    title: "Anda Tidak Perlu Menebak-nebak Progresnya",
    description:
      "Setiap tahap kami kabari. Anda bisa melihat, mengoreksi, dan meminta penyesuaian sebelum terlambat, tanpa drama revisi di akhir proyek.",
  },
  {
    icon: <CodeIcon className="h-5 w-5" />,
    title: "Dibangun untuk Jangka Panjang, Bukan Sekadar Rilis",
    description:
      "Kode yang rapi, cepat, dan aman, sehingga website Anda siap ditambah fiturnya kapan pun bisnis Anda berkembang, tanpa harus dibangun ulang dari awal.",
  },
  {
    icon: <CheckCircledIcon className="h-5 w-5" />,
    title: "Harga Jelas di Awal, Tenang Setelah Rilis",
    description:
      "Tidak ada biaya tiba-tiba. Setelah website live, bug kami perbaiki dan tim kami tetap mendampingi Anda.",
  },
];

export const SERVICES_TEASERS: ServiceTeaserItem[] = [
  {
    id: "website",
    category: "Website",
    title: "Pembuatan Website Bisnis",
    description:
      "Website profil bisnis dan landing page berkecepatan tinggi yang dirancang untuk membangun kredibilitas, meningkatkan konversi prospek, dan ramah seluler.",
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
      "Penyegaran tampilan antarmuka dan refaktorisasi kode website lama yang lambat atau usang menjadi sistem modern berstandar Google Core Web Vitals tinggi.",
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
      "Pengembangan sistem internal berbasis web seperti dashboard analitik operasional, manajemen inventaris pergudangan, portal karyawan, dan alur data terpusat.",
    tags: ["Dashboard Analitik", "Database Relasional", "Integrasi REST API", "Hak Akses Bertingkat"],
    linkText: "Konsultasi Web App",
    linkHref: "/kontak",
    icon: <CodeIcon className="h-6 w-6" />,
  },
  {
    id: "mobile",
    category: "Mobile App",
    title: "Pengembangan Aplikasi Mobile",
    description:
      "Aplikasi Android dan iOS yang responsif, intuitif, dan terintegrasi aman dengan database server dan sistem alur kerja bisnis Anda.",
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

export const WORKFLOW_STEPS: WorkflowStepItem[] = [
  {
    stepNumber: "01 / 04",
    badge: "Tahap 01",
    title: "Brief dan Struktur",
    description:
      "Konsultasi awal, gali tujuan website, siapa targetnya, dan layanan apa yang mau ditonjolkan. Dari situ dibuat sitemap, alias daftar halamannya, plus checklist konten yang harus dikirim klien.",
    output:
      "Sitemap dan checklist konten yang sudah disetujui. Ini penting, karena konten yang telat biasanya yang bikin proyek molor.",
    milestone: "Sitemap & Checklist Disetujui",
    image: "/assets/workflow/workflow-brief.png",
    icon: <MagnifyingGlassIcon className="h-5 w-5" />,
  },
  {
    stepNumber: "02 / 04",
    badge: "Tahap 02",
    title: "Desain",
    description:
      "Dibuat mockup di Figma, biasanya untuk beranda dan satu halaman dalam. Klien bisa lihat dulu tampilannya, termasuk tombol WhatsApp-nya jelas atau tidak, sebelum masuk ke koding. Revisinya dibatasi, misalnya 2 kali, supaya tidak berlarut-larut.",
    output: "Desain yang sudah disetujui klien.",
    milestone: "Desain Disetujui Klien",
    image: "/assets/workflow/workflow-design.png",
    icon: <LayoutIcon className="h-5 w-5" />,
  },
  {
    stepNumber: "03 / 04",
    badge: "Tahap 03",
    title: "Pembangunan",
    description:
      "Desain yang disetujui dibangun jadi website, konten dimasukkan, form dan tombol WhatsApp dipasang, SEO dasar dirapikan, dan dashboard analitik dasar ikut dipasang supaya klien bisa lihat pengunjung dan klik WhatsApp.",
    output:
      "Link staging, alias website versi percobaan yang bisa dicek klien sebelum rilis.",
    milestone: "Link Staging Siap Dicek",
    image: "/assets/workflow/workflow-build.png",
    icon: <CodeIcon className="h-5 w-5" />,
  },
  {
    stepNumber: "04 / 04",
    badge: "Tahap 04",
    title: "Uji, Rilis, dan Serah Terima",
    description:
      "Website dites di HP dan laptop, dicek kecepatan, link, dan form-nya. Kalau lolos, baru dipasang ke domain dan hosting klien, lalu ada demo singkat cara membaca dashboard dan cara minta update.",
    output:
      "Website sudah live, plus panduan singkat dan garansi perbaikan bug.",
    milestone: "Website Live & Garansi Bug",
    image: "/assets/workflow/workflow-release.png",
    icon: <RocketIcon className="h-5 w-5" />,
  },
];

export const PORTFOLIO_TEASERS: PortfolioTeaserItem[] = [
  {
    id: "karsa-logistics",
    category: "Aplikasi Web Internal",
    categorySlug: "webapp",
    clientSector: "Logistik & Pergudangan",
    title: "Karsa Logistics Hub - Portal Operasional & Inventaris",
    description:
      "Sistem dasbor terpusat untuk memantau pergerakan stok multi-gudang, rekapitulasi transaksi otomatis, dan pembagian hak akses bertingkat bagi staf hingga manajemen.",
    tech: ["Next.js", "PostgreSQL", "Tailwind CSS", "Prisma"],
    businessImpact:
      "Menghilangkan pencatatan ganda antar-cabang dan mempercepat konsolidasi laporan operasional harian hingga 65%.",
    metric: "Efisiensi +65%",
    image: "/portfolio/karsa-logistics.jpg",
    imageAlt:
      "Tampilan antarmuka dasbor operasional inventaris multi-gudang Karsa Logistics Hub pada layar laptop",
    icon: <LayersIcon className="h-5 w-5" />,
  },
  {
    id: "nusa-precast",
    category: "Website Bisnis",
    categorySlug: "website",
    clientSector: "Manufaktur & Konstruksi B2B",
    title: "Nusa Mandiri Precast - Portal Bisnis & Katalog B2B",
    description:
      "Website profil usaha manufaktur beton pracetak dengan katalog produk digital terstruktur, formulir permintaan penawaran harga otomatis, serta optimasi SEO halaman spesifikasi.",
    tech: ["React", "Next.js", "SEO Engine", "Headless CMS"],
    businessImpact:
      "Mempermudah eksplorasi katalog produk bagi mitra kontraktor dan meningkatkan penerimaan penawaran harga terverifikasi hingga 3x lipat.",
    metric: "Konversi B2B 3x",
    image: "/portfolio/nusa-precast.jpg",
    imageAlt:
      "Pratinjau website bisnis dan katalog spesifikasi beton pracetak B2B Nusa Mandiri Precast pada layar monitor",
    icon: <GlobeIcon className="h-5 w-5" />,
  },
  {
    id: "medikalink-express",
    category: "Aplikasi Mobile",
    categorySlug: "mobile",
    clientSector: "Layanan Kesehatan & Farmasi",
    title: "MedikaLink Express - Aplikasi Pelacakan Pengantaran Resep",
    description:
      "Aplikasi mobile bagi armada pengiriman obat yang dilengkapi konfirmasi tanda tangan digital penerima, pelacakan rute kurir real-time, dan notifikasi jadwal pengantaran pasien.",
    tech: ["React Native", "REST API", "E-Signature", "Mapbox"],
    businessImpact:
      "Memastikan bukti serah terima terdokumentasi akurat dan memangkas waktu verifikasi lapangan tanpa sengketa pengantaran.",
    metric: "Akurasi 99.8%",
    image: "/portfolio/medikalink-express.jpg",
    imageAlt:
      "Mockup dua smartphone menampilkan rute GPS kurir dan tanda tangan serah terima digital MedikaLink Express",
    icon: <MobileIcon className="h-5 w-5" />,
  },
  {
    id: "finops-dashboard",
    category: "Aplikasi Web Internal",
    categorySlug: "webapp",
    clientSector: "Finansial & Akuntansi Multi-Cabang",
    title: "FinOps Enterprise - Dasbor Konsolidasi Keuangan & Pajak",
    description:
      "Platform analisis keuangan real-time untuk memantau cash flow 12 kantor cabang, rekonsiliasi bank otomatis, dan ekspor laporan perpajakan compliant.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    businessImpact:
      "Memangkas waktu tutup buku bulanan dari 7 hari kerja menjadi hanya 1.5 hari berkat rekonsiliasi otomatis terpadu.",
    metric: "Tutup Buku 4x Cepat",
    image: "/portfolio/finops-dashboard.jpg",
    imageAlt:
      "Tampilan dasbor analisis cash flow dan rekonsiliasi bank otomatis FinOps Enterprise pada laptop",
    icon: <LayersIcon className="h-5 w-5" />,
  },
  {
    id: "artha-retail-pos",
    category: "Sistem Web & PWA",
    categorySlug: "webapp",
    clientSector: "Ritel & Waralaba",
    title: "Artha POS Cloud - Sistem Kasir & Manajemen Stok Multi-Outlet",
    description:
      "Sistem kasir cloud point-of-sale berbasis PWA yang tetap dapat beroperasi saat koneksi internet terputus, dilengkapi sinkronisasi stok otomatis saat online.",
    tech: ["PWA", "React", "PostgreSQL", "IndexedDB"],
    businessImpact:
      "Mencegah kebocoran stok ritel hingga 0% dan memastikan antrean kasir tetap berjalan lancar tanpa terganggu kendala sinyal.",
    metric: "Uptime 99.9%",
    image: "/portfolio/artha-retail-pos.jpg",
    imageAlt:
      "Tampilan tablet kasir ritel Artha POS Cloud dengan katalog produk dan sinkronisasi transaksi online",
    icon: <DesktopIcon className="h-5 w-5" />,
  },
  {
    id: "aura-living",
    category: "Website & E-Commerce",
    categorySlug: "website",
    clientSector: "Home Decor & Furnitur Ekspor",
    title: "Aura Living Studio - E-Commerce Furnitur Kustom B2C & B2B",
    description:
      "Platform e-commerce katalog furnitur desainer dengan kalkulator ongkos kirim kargo otomatis, integrasi payment gateway multi-metode, dan fitur request custom order.",
    tech: ["Next.js", "Midtrans", "Tailwind CSS", "PostgreSQL"],
    businessImpact:
      "Membuka jalur penjualan langsung ke konsumen nasional dan mencatatkan kenaikan transaksi pemesanan kustom sebesar 120%.",
    metric: "Penjualan +120%",
    image: "/portfolio/aura-living.jpg",
    imageAlt:
      "Tampilan katalog e-commerce furnitur kayu kustom Aura Living Studio dengan pilihan material pada layar laptop",
    icon: <GlobeIcon className="h-5 w-5" />,
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "landing-page",
    name: "Website Landing Page",
    badge: "Cepat & Efektif",
    isRecommended: false,
    priceLabel: "Mulai dari",
    price: "Rp 750.000",
    description:
      "Pembuatan landing page untuk mempromosikan produk, layanan, acara, atau kampanye promosi dengan alur konten yang fokus pada konversi.",
    features: [
      "Layout landing page responsif terstruktur sesuai alur konten",
      "Desain visual responsif mobile & desktop sesuai identitas brand",
      "Integrasi tombol WhatsApp resmi & formulir kontak langsung",
      "Optimasi dasar judul halaman & metadata SEO Google",
      "Termasuk Dashboard Analitik Tingkat Dasar buatan Next Karya",
      "Lacak klik tombol WhatsApp & grafik kunjungan 30 hari",
      "Garansi teknis 14 hingga 30 hari & pendampingan penyesuaian konten",
    ],
    ctaText: "Pilih Landing Page",
    ctaHref: "/kontak",
  },
  {
    id: "company-profile",
    name: "Website Company Profile",
    badge: "Paling Populer",
    isRecommended: true,
    priceLabel: "Mulai dari",
    price: "Rp 1.750.000",
    description:
      "Pembuatan website profil resmi untuk memperkenalkan bisnis, UMKM, atau penyedia jasa melalui profil, layanan, dan portofolio.",
    features: [
      "Struktur halaman lengkap (Beranda, Profil Usaha, Layanan, Kontak, Galeri)",
      "Desain responsif mobile-first & integrasi peta lokasi Google Maps",
      "Integrasi tombol WhatsApp, formulir pesan, & media sosial",
      "Optimasi struktur SEO Google & Google Search Console",
      "Termasuk Dashboard Analitik Tingkat Dasar (Pantau layanan terpopuler)",
      "Fleksibel di-upgrade langsung ke modul CMS Next Karya kapan saja",
      "Garansi teknis 30 hari & pendampingan penyesuaian konten",
    ],
    ctaText: "Pilih Company Profile",
    ctaHref: "/kontak",
  },
  {
    id: "portofolio-personal",
    name: "Website Portofolio Personal",
    badge: "Personal Branding",
    isRecommended: false,
    priceLabel: "Mulai dari",
    price: "Rp 1.000.000",
    description:
      "Website personal untuk menampilkan profil profesional, keahlian, riwayat pendidikan/pengalaman, sertifikasi, dan katalog karya.",
    features: [
      "Showcase profil profesional, katalog karya, & pencapaian proyek",
      "Bagian keahlian, pengalaman, sertifikasi, & riwayat kerja terstruktur",
      "Integrasi tautan profesional (LinkedIn, GitHub, Resume/CV, Kontak)",
      "Desain visual elegan & responsif sesuai identitas personal",
      "Termasuk Dashboard Analitik Tingkat Dasar (Pantau karya paling diminati)",
      "Optimasi metadata SEO agar profil mudah ditemukan di pencarian",
      "Garansi teknis 30 hari & pendampingan penyesuaian konten",
    ],
    ctaText: "Pilih Portofolio Personal",
    ctaHref: "/kontak",
  },
  {
    id: "sekolah",
    name: "Website Sekolah & Institusi",
    badge: "Edukasi Terpusat",
    isRecommended: false,
    priceLabel: "Mulai dari",
    price: "Rp 2.500.000",
    description:
      "Website informasi resmi untuk sekolah atau lembaga pendidikan guna menyampaikan profil, fasilitas, agenda, dan pengumuman.",
    features: [
      "Halaman informasi terpadu (Profil sekolah, visi-misi, fasilitas, & guru)",
      "Publikasi berita berkala, agenda kegiatan, galeri, & pengumuman",
      "Navigasi ramah & mudah diakses orang tua, siswa, & masyarakat",
      "Integrasi media sosial resmi & peta lokasi Google Maps",
      "Termasuk Dashboard Analitik Tingkat Dasar (Upgrade Menengah jika ada CMS)",
      "Panduan penggunaan & pelatihan pengelolaan bagi admin sekolah",
      "Garansi teknis 30 hingga 45 hari & dukungan pemeliharaan awal",
    ],
    ctaText: "Konsultasi Web Sekolah",
    ctaHref: "/kontak",
  },
  {
    id: "komunitas-organisasi",
    name: "Website Komunitas & Organisasi",
    badge: "Publikasi Terstruktur",
    isRecommended: false,
    priceLabel: "Mulai dari",
    price: "Rp 2.000.000",
    description:
      "Website untuk organisasi mahasiswa, komunitas sosial/hobi, lembaga kepemudaan, atau asosiasi profesi.",
    features: [
      "Profil organisasi, visi-misi, struktur pengurus, & kontak resmi",
      "Informasi program kerja, agenda kegiatan, & dokumentasi galeri",
      "Pusat informasi berita & pengumuman resmi lintas periode",
      "Desain responsif & terhubung ke kanal media sosial komunitas",
      "Termasuk Dashboard Analitik Tingkat Dasar (Upgrade Menengah jika ada CMS)",
      "Panduan operasional dasar bagi tim pengurus organisasi",
      "Garansi teknis 30 hingga 45 hari & dukungan penyesuaian konten",
    ],
    ctaText: "Konsultasi Web Komunitas",
    ctaHref: "/kontak",
  },
  {
    id: "portal-berita-cms",
    name: "Website Portal Berita (CMS)",
    badge: "CMS & Analitik Lengkap",
    isRecommended: false,
    priceLabel: "Mulai dari",
    price: "Rp 5.500.000",
    description:
      "Website dengan Content Management System (CMS) mandiri untuk menerbitkan dan mengelola berita, artikel, dan pengumuman secara dinamis.",
    features: [
      "Dashboard Admin CMS mandiri (Kelola artikel, kategori, & gambar)",
      "Halaman daftar & detail artikel dinamis dengan fitur pencarian cepat",
      "Manajemen status publikasi terstruktur & profil penulis",
      "Termasuk Dashboard Analitik Tingkat Menengah (Satu panel dengan CMS)",
      "Statistik real-time, artikel terpopuler, durasi baca, & ekspor data CSV",
      "Optimasi SEO On-Page dinamis untuk setiap publikasi artikel",
      "Panduan penggunaan sistem & garansi teknis 30 hingga 45 hari",
    ],
    ctaText: "Pilih Portal Berita CMS",
    ctaHref: "/kontak",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "durasi-pengerjaan",
    question: "Berapa lama estimasi waktu pengerjaan proyek di Next Karya?",
    answer:
      "Waktu pengerjaan bergantung pada skala proyek. Untuk paket Website Landing Page atau Portofolio Personal, pengerjaan biasanya berkisar antara 3 hingga 5 hari kerja. Untuk Website Company Profile, Komunitas, atau Sekolah berkisar 5 hingga 10 hari kerja. Sementara untuk Portal Berita CMS atau aplikasi kustom, jadwal disesuaikan dengan ruang lingkup yang disepakati bersama tim kami sejak awal.",
  },
  {
    id: "garansi-teknis",
    question: "Apakah ada garansi setelah website atau aplikasi selesai diluncurkan?",
    answer:
      "Ya, setiap proyek Next Karya dilindungi garansi teknis resmi mulai dari 14 hingga 45 hari pasca-peluncuran sesuai paket layanan. Jika ditemukan kendala, bug, atau error dari kode yang tim kami bangun, kami akan memperbaikinya secara cepat tanpa biaya tambahan.",
  },
  {
    id: "materi-klien",
    question: "Apa saja materi yang perlu disiapkan oleh pihak klien?",
    answer:
      "Secara umum, materi awal mencakup logo usaha, profil singkat bisnis, daftar layanan/produk, dan kontak resmi. Namun jika Anda belum memiliki konten yang tersusun rapi, tim kami siap membantu menyusun arsitektur informasi dan memberikan template materi yang mudah diisi.",
  },
  {
    id: "mobile-dan-seo",
    question: "Apakah website yang dibangun sudah mobile-friendly dan ramah SEO?",
    answer:
      "Tentu. Seluruh website yang tim kami rancang menggunakan pendekatan Mobile-First yang responsif di semua perangkat (smartphone, tablet, monitor lebar). Kode kami juga terstruktur dengan tag semantik SEO, open graph social media, dan Core Web Vitals berkecepatan tinggi agar mudah terindeks mesin pencari Google.",
  },
  {
    id: "skema-pembayaran",
    question: "Bagaimana skema pembayaran dan tahapan pengerjaan di Next Karya?",
    answer:
      "Tim kami menerapkan skema pembayaran bertahap yang transparan dan aman bagi kedua pihak: Uang Muka (Down Payment) sebesar 40 hingga 50% saat proyek dimulai, dan pelunasan dilakukan setelah proses revisi disetujui serta website siap ditayangkan (Go-Live).",
  },
  {
    id: "kelola-mandiri",
    question: "Apakah saya bisa mengelola atau mengubah isi konten website sendiri?",
    answer:
      "Bisa. Pada paket Website Portal Berita (CMS) maupun paket website yang ditambahkan modul CMS Next Karya, kami menyediakan panel admin intuitif sehingga Anda dapat mengubah teks, menambah galeri gambar, maupun menerbitkan artikel baru tanpa perlu memahami koding.",
  },
];

export const CONTACT_INFO_ITEMS: ContactInfoItem[] = [
  {
    icon: <SewingPinIcon className="h-5 w-5" />,
    title: "Alamat Studio & Kantor",
    content: "Jl. Karyawangi No. 116, Kec. Parongpong, Kabupaten Bandung Barat, Jawa Barat 40559",
    isLink: true,
    linkHref: "https://maps.google.com/?q=Jl.+Karyawangi+No.+116,+Kec.+Parongpong,+Kabupaten+Bandung+Barat,+Jawa+Barat",
  },
  {
    icon: <EnvelopeClosedIcon className="h-5 w-5" />,
    title: "Email Resmi Konsultasi",
    content: "nextkarya@gmail.com",
    isLink: true,
    linkHref: "mailto:nextkarya@gmail.com",
  },
  {
    icon: <ClockIcon className="h-5 w-5" />,
    title: "Jam Kerja Operasional",
    content: "Senin - Jumat, 09.00 - 18.00 WIB",
  },
  {
    icon: <ChatBubbleIcon className="h-5 w-5" />,
    title: "Komitmen Respons",
    content: "Tinjauan spesifikasi & estimasi dalam 1x24 jam kerja",
  },
];
