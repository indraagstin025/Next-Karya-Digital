import type { Metadata } from "next";
import { TermsPage } from "@/features/legal/pages/TermsPage";
import { getPublicPage } from "@/lib/public-content";

const SLUG = "syarat-ketentuan";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPage(SLUG);
  return {
    title: page?.seoTitle || "Syarat & Ketentuan | Next Karya Digital Solutions",
    description:
      page?.seoDescription ||
      "Ketentuan layanan Next Karya Digital Solutions: ruang lingkup pekerjaan, pembayaran, revisi, hak kekayaan intelektual, dan batasan tanggung jawab.",
    alternates: { canonical: `/${SLUG}` },
  };
}

export default async function Page() {
  const page = await getPublicPage(SLUG);
  return <TermsPage page={page} />;
}
