import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding canonical database for Next Karya Digital Solutions...");

  // 1. Site Master
  const site = await prisma.site.upsert({
    where: { id: "nextkarya-main" },
    update: {
      name: "Next Karya Digital Solutions",
      domain: "nextkarya.web.id",
      isActive: true,
      isFormLocked: false,
      isAlertActive: false,
    },
    create: {
      id: "nextkarya-main",
      name: "Next Karya Digital Solutions",
      domain: "nextkarya.web.id",
      isActive: true,
      isFormLocked: false,
      isAlertActive: false,
    },
  });
  console.log("Site master seeded:", site.id);

  // 2. Three Internal Staff Accounts
  const defaultPassword = await bcrypt.hash("NextKarya2026!", 10);

  const staffMembers = [
    {
      email: "programmer@nextkarya.web.id",
      name: "Staf A (Programmer)",
      jobTitle: "Full-Stack Developer",
      role: UserRole.STAFF,
    },
    {
      email: "designer@nextkarya.web.id",
      name: "Staf B (Desainer)",
      jobTitle: "UI/UX & Visual Designer",
      role: UserRole.STAFF,
    },
    {
      email: "lead@nextkarya.web.id",
      name: "Staf C (Project Lead)",
      jobTitle: "Project Lead & Client Relations",
      role: UserRole.STAFF,
    },
  ];

  for (const staff of staffMembers) {
    const user = await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        name: staff.name,
        jobTitle: staff.jobTitle,
        role: staff.role,
        isActive: true,
      },
      create: {
        email: staff.email,
        name: staff.name,
        jobTitle: staff.jobTitle,
        role: staff.role,
        passwordHash: defaultPassword,
        isActive: true,
        tokenVersion: 1,
      },
    });
    console.log("Staff account seeded:", user.email, `(${user.jobTitle})`);
  }

  // 3. Default Categories
  const categories = [
    {
      slug: "web-development",
      name: "Web Development",
      description: "Pengembangan website modern, portal berita, dan CMS",
      order: 1,
    },
    {
      slug: "aplikasi-kustom",
      name: "Aplikasi Kustom",
      description: "Dashboard analitik, portal internal, dan sistem otomatisasi",
      order: 2,
    },
    {
      slug: "mobile-apps",
      name: "Aplikasi Mobile",
      description: "Aplikasi Android dan iOS berbasis Flutter",
      order: 3,
    },
    {
      slug: "edukasi-teknologi",
      name: "Edukasi & Wawasan",
      description: "Artikel tutorial, panduan bisnis, dan tren teknologi",
      order: 4,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: {
        site_id_slug: {
          site_id: "nextkarya-main",
          slug: cat.slug,
        },
      },
      update: {
        name: cat.name,
        description: cat.description,
        order: cat.order,
      },
      create: {
        site_id: "nextkarya-main",
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        order: cat.order,
      },
    });
  }
  console.log("Categories seeded successfully.");

  // 4. Default Services
  const services = [
    {
      slug: "pembuatan-website-bisnis",
      title: "Pembuatan Website Bisnis",
      shortDesc:
        "Website profil bisnis, company profile, dan landing page yang berfokus pada kredibilitas, konversi, dan pengalaman pengguna.",
      priceEstimate: "Mulai dari Rp 1.500.000",
      features: [
        "Company Profile",
        "Landing Page",
        "Optimasi SEO On-Page",
        "Panel Admin / CMS Mandiri",
      ],
      order: 1,
    },
    {
      slug: "redesign-optimalisasi-website",
      title: "Redesign & Optimalisasi Website",
      shortDesc:
        "Memodernisasi tampilan dan kode website lama yang lambat, tidak responsif, atau usang menjadi antarmuka modern berkecepatan tinggi.",
      priceEstimate: "Mulai dari Rp 1.200.000",
      features: [
        "Penyegaran UI/UX",
        "Kecepatan Loading Tinggi",
        "Mobile-First Responsive",
        "Migrasi Konten Aman",
      ],
      order: 2,
    },
    {
      slug: "aplikasi-web-dashboard-kustom",
      title: "Aplikasi Web & Dashboard Kustom",
      shortDesc:
        "Pengembangan sistem internal berbasis web seperti dashboard operasional, inventaris pergudangan, portal karyawan, dan otomatisasi administrasi.",
      priceEstimate: "Mulai dari Rp 5.000.000",
      features: [
        "Dashboard Analitik",
        "Database Relasional PostgreSQL",
        "Integrasi REST API",
        "Manajemen Hak Akses",
      ],
      order: 3,
    },
    {
      slug: "pengembangan-aplikasi-mobile",
      title: "Pengembangan Aplikasi Mobile",
      shortDesc:
        "Pembuatan aplikasi Android dan iOS yang responsif, intuitif, dan terintegrasi dengan sistem alur kerja dan API server bisnis Anda.",
      priceEstimate: "Mulai dari Rp 7.500.000",
      features: [
        "Android & iOS (Flutter)",
        "Push Notification Real-Time",
        "Integrasi Payment Gateway",
        "Sinkronisasi Cloud Cepat",
      ],
      order: 4,
    },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: {
        site_id_slug: {
          site_id: "nextkarya-main",
          slug: svc.slug,
        },
      },
      update: {
        title: svc.title,
        shortDesc: svc.shortDesc,
        priceEstimate: svc.priceEstimate,
        features: svc.features,
        order: svc.order,
      },
      create: {
        site_id: "nextkarya-main",
        slug: svc.slug,
        title: svc.title,
        shortDesc: svc.shortDesc,
        priceEstimate: svc.priceEstimate,
        features: svc.features,
        order: svc.order,
      },
    });
  }
  console.log("Services seeded successfully.");

  console.log("Canonical database seeding completed 100%!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
