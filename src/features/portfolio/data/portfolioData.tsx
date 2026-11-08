export interface PortfolioProject {
  id: string;
  slug?: string;
  categorySlug: "all" | "webapp" | "website" | "mobile";
  clientSector: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const PORTFOLIO_CASES: PortfolioProject[] = [
  {
    id: "karsa-logistics",
    categorySlug: "webapp",
    clientSector: "Nama Disamarkan",
    title: "Karsa Logistics Hub",
    description:
      "Sistem dasbor terpusat untuk memantau pergerakan stok multi-gudang, rekapitulasi transaksi otomatis, dan pembagian hak akses bertingkat bagi staf hingga manajemen.",
    image: "/portfolio/karsa-logistics.jpg",
    imageAlt:
      "Tampilan antarmuka dasbor operasional inventaris multi-gudang Karsa Logistics Hub pada layar laptop",
  },
  {
    id: "nusa-precast",
    categorySlug: "website",
    clientSector: "Nama Disamarkan",
    title: "Nusa Mandiri Precast",
    description:
      "Website profil usaha manufaktur beton pracetak dengan katalog produk digital terstruktur, formulir permintaan penawaran harga otomatis, serta optimasi SEO halaman spesifikasi.",
    image: "/portfolio/nusa-precast.jpg",
    imageAlt:
      "Pratinjau website bisnis dan katalog spesifikasi beton pracetak B2B Nusa Mandiri Precast pada layar monitor",
  },
  {
    id: "medikalink-express",
    categorySlug: "mobile",
    clientSector: "Nama Disamarkan",
    title: "MedikaLink Express",
    description:
      "Aplikasi mobile bagi armada pengiriman obat yang dilengkapi konfirmasi tanda tangan digital penerima, pelacakan rute kurir real-time, dan notifikasi jadwal pengantaran pasien.",
    image: "/portfolio/medikalink-express.jpg",
    imageAlt:
      "Mockup dua smartphone menampilkan rute GPS kurir dan tanda tangan serah terima digital MedikaLink Express",
  },
  {
    id: "finops-dashboard",
    categorySlug: "webapp",
    clientSector: "Nama Disamarkan",
    title: "FinOps Enterprise",
    description:
      "Platform analisis keuangan real-time untuk memantau cash flow 12 kantor cabang, rekonsiliasi bank otomatis, dan ekspor laporan perpajakan compliant.",
    image: "/portfolio/finops-dashboard.jpg",
    imageAlt:
      "Tampilan dasbor analisis cash flow dan rekonsiliasi bank otomatis FinOps Enterprise pada laptop",
  },
  {
    id: "artha-retail-pos",
    categorySlug: "webapp",
    clientSector: "Nama Disamarkan",
    title: "Artha POS Cloud",
    description:
      "Sistem kasir cloud point-of-sale berbasis PWA yang tetap dapat beroperasi saat koneksi internet terputus, dilengkapi sinkronisasi stok otomatis saat online.",
    image: "/portfolio/artha-retail-pos.jpg",
    imageAlt:
      "Tampilan tablet kasir ritel Artha POS Cloud dengan katalog produk dan sinkronisasi transaksi online",
  },
  {
    id: "aura-living",
    categorySlug: "website",
    clientSector: "Nama Disamarkan",
    title: "Aura Living Studio",
    description:
      "Platform e-commerce katalog furnitur desainer dengan kalkulator ongkos kirim kargo otomatis, integrasi payment gateway multi-metode, dan fitur request custom order.",
    image: "/portfolio/aura-living.jpg",
    imageAlt:
      "Tampilan katalog e-commerce furnitur kayu kustom Aura Living Studio dengan pilihan material pada layar laptop",
  },
];
