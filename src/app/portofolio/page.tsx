import type { Metadata } from "next";
import { PortfolioPage } from "@/features/portfolio";
import { getPublicPortfolios } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Portofolio & Studi Kasus",
  description:
    "Studi kasus dan konsep solusi implementasi teknologi web serta mobile Next Karya Digital Solutions.",
  alternates: { canonical: "/portofolio" },
};

export default async function Page() {
  const portfolios = await getPublicPortfolios();
  return <PortfolioPage portfolios={portfolios} />;
}
