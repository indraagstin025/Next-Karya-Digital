import type { Metadata } from "next";
import { StaffShortcutLauncher } from "@/components/StaffShortcutLauncher";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import ScrollToTop from "@/components/layout/ScrollToTop";
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
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
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
      email: "nextkaryasolutions@gmail.com",
      telephone: "+62-838-2011-7314",
      description:
        "Software house dan mitra rekayasa perangkat lunak untuk pembuatan website bisnis, sistem web kustom, dan aplikasi mobile profesional berbasis di Bandung Barat, Indonesia.",
      sameAs: [
        "https://www.instagram.com/nextkarya",
        "https://wa.me/6283820117314",
        "https://github.com/indraagstin025",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62-838-2011-7314",
        contactType: "customer service",
        areaServed: "ID",
        availableLanguage: ["Indonesian", "English"],
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#localbusiness`,
      name: "Next Karya Digital Solutions",
      url: siteUrl,
      logo: `${siteUrl}/logo/logo-gabungan.png`,
      image: `${siteUrl}/logo/logo-gabungan.png`,
      email: "nextkaryasolutions@gmail.com",
      telephone: "+62-838-2011-7314",
      priceRange: "$$",
      sameAs: [
        "https://www.instagram.com/nextkarya",
        "https://wa.me/6283820117314",
        "https://github.com/indraagstin025",
      ],
      areaServed: [
        "Kabupaten Bandung Barat",
        "Kota Bandung",
        "Jawa Barat",
        "Jabodetabek",
        "Indonesia",
      ],
      knowsAbout: [
        "Jasa Pembuatan Website Bisnis",
        "Pengembangan Aplikasi Web Kustom",
        "Pembuatan Aplikasi Mobile (Android & iOS)",
        "Sistem Dashboard & POS Kasir Retail",
        "Rekayasa Perangkat Lunak (Software Engineering)",
        "Desain UI/UX & Prototipe Produk Digital",
        "Integrasi Sistem & Arsitektur Cloud",
      ],
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
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('nk-theme-preference')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var clean = function() {
                    var els = document.querySelectorAll('[bis_skin_checked]');
                    for (var i = 0; i < els.length; i++) {
                      els[i].removeAttribute('bis_skin_checked');
                    }
                  };
                  clean();
                  if (typeof MutationObserver !== 'undefined') {
                    var obs = new MutationObserver(clean);
                    obs.observe(document.documentElement, {
                      attributes: true,
                      subtree: true,
                      attributeFilter: ['bis_skin_checked']
                    });
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen antialiased font-sans flex flex-col"
        suppressHydrationWarning
      >
        <SmoothScrollProvider>
          <AnalyticsTracker />
          {children}
          <ScrollToTop />
          <StaffShortcutLauncher />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
