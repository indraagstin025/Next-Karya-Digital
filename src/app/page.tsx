import type { Metadata } from "next";
import { HomePage } from "@/features/home";
import {
  getPublicFaqs,
  getPublicPortfolios,
  getPublicPricing,
  getPublicServices,
} from "@/lib/public-content";
import { toFaqItems } from "@/lib/live-content-adapters";

export const metadata: Metadata = {
  title:
    "Next Karya Digital Solutions - Jasa Pembuatan Website, Aplikasi Web & Mobile",
  description:
    "Mitra rekayasa perangkat lunak untuk pembuatan website bisnis, sistem web kustom, dan aplikasi mobile profesional berbasis di Bandung Barat. Konsultasikan kebutuhan proyek digital Anda.",
  alternates: {
    canonical: "https://nextkarya.web.id",
  },
  openGraph: {
    title:
      "Next Karya Digital Solutions - Jasa Pembuatan Website, Aplikasi Web & Mobile",
    description:
      "Tim rekayasa perangkat lunak untuk website bisnis, dashboard kustom, dan aplikasi mobile. Lihat layanan, paket harga, dan portofolio Next Karya Digital Solutions.",
    url: "https://nextkarya.web.id",
  },
};

export default async function Page() {
  const [services, portfolios, pricing, faqs] = await Promise.all([
    getPublicServices(),
    getPublicPortfolios(),
    getPublicPricing(),
    getPublicFaqs(),
  ]);

  const faqList = toFaqItems(faqs);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePage
        services={services}
        portfolios={portfolios}
        pricing={pricing}
        faqs={faqs}
      />
    </>
  );
}
