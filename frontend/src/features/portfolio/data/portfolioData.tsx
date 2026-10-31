import React from "react";
import { LayersIcon, GlobeIcon, MobileIcon, DesktopIcon } from "@radix-ui/react-icons";

export interface PortfolioProject {
  id: string;
  category: string;
  categorySlug: "all" | "webapp" | "website" | "mobile";
  clientSector: string;
  title: string;
  description: string;
  tech: string[];
  impact: string;
  metric: string;
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
}

export const PORTFOLIO_CASES: PortfolioProject[] = [
  {
    id: "karsa-logistics",
    category: "Aplikasi Web Internal",
    categorySlug: "webapp",
    clientSector: "Logistik & Pergudangan",
    title: "Karsa Logistics Hub - Portal Operasional & Inventaris",
    description:
      "Sistem dasbor terpusat untuk memantau pergerakan stok multi-gudang, rekapitulasi transaksi otomatis, dan pembagian hak akses bertingkat bagi staf hingga manajemen.",
    tech: ["Next.js", "PostgreSQL", "Tailwind CSS", "Prisma"],
    impact:
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
    impact:
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
    impact:
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
    impact:
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
    impact:
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
    impact:
      "Membuka jalur penjualan langsung ke konsumen nasional dan mencatatkan kenaikan transaksi pemesanan kustom sebesar 120%.",
    metric: "Penjualan +120%",
    image: "/portfolio/aura-living.jpg",
    imageAlt:
      "Tampilan katalog e-commerce furnitur kayu kustom Aura Living Studio dengan pilihan material pada layar laptop",
    icon: <GlobeIcon className="h-5 w-5" />,
  },
];
