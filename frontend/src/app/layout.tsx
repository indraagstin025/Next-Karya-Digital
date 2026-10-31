import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://nextkarya.web.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Next Karya Digital Solutions - Jasa Pembuatan Website & Aplikasi Web / Mobile",
    template: "%s | Next Karya Digital Solutions",
  },
  description:
    "Software house dan mitra rekayasa perangkat lunak untuk pembuatan website bisnis, sistem web kustom, dan aplikasi mobile profesional berbasis di Bandung Barat, Indonesia.",
  keywords: [
    "Jasa Pembuatan Website",
    "Software House Indonesia",
    "Jasa Pembuatan Aplikasi Mobile",
    "Next Karya Digital Solutions",
    "Jasa Web Bandung",
    "Web Developer Bandung Barat",
    "Aplikasi Web Dashboard Kustom",
  ],
  authors: [{ name: "Next Karya Digital Solutions", url: siteUrl }],
  creator: "Next Karya Digital Solutions",
  publisher: "Next Karya Digital Solutions",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Next Karya Digital Solutions",
    title:
      "Next Karya Digital Solutions - Jasa Pembuatan Website & Aplikasi Web / Mobile",
    description:
      "Mitra rekayasa perangkat lunak untuk pembuatan website bisnis, dashboard kustom, dan aplikasi mobile modern yang andal, cepat, dan terpercaya.",
    images: [
      {
        url: "/logo/logo-gabungan.png",
        width: 960,
        height: 304,
        alt: "Next Karya Digital Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Next Karya Digital Solutions",
    description:
      "Mitra rekayasa perangkat lunak untuk pembuatan website bisnis dan aplikasi modern.",
    images: ["/logo/logo-gabungan.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Next Karya Digital Solutions",
      url: siteUrl,
      logo: `${siteUrl}/logo/logo-gabungan.png`,
      email: "nextkarya@gmail.com",
      description:
        "Mitra rekayasa perangkat lunak untuk pembuatan website bisnis, sistem kustom, dan aplikasi mobile di Indonesia.",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#localbusiness`,
      name: "Next Karya Digital Solutions",
      url: siteUrl,
      logo: `${siteUrl}/logo/logo-gabungan.png`,
      image: `${siteUrl}/logo/logo-gabungan.png`,
      email: "nextkarya@gmail.com",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Karyawangi No. 116, Kec. Parongpong",
        addressLocality: "Kabupaten Bandung Barat",
        addressRegion: "Jawa Barat",
        postalCode: "40559",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -6.8291,
        longitude: 107.5756,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Next Karya Digital Solutions",
      inLanguage: "id-ID",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
