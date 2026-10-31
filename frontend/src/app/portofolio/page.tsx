import type { Metadata } from "next";
import { PortfolioPage } from "@/features/portfolio";
import { getPublicPortfolios } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Portofolio & Studi Kasus | Next Karya Digital Solutions",
  description:
    "Studi kasus dan konsep solusi implementasi teknologi web serta mobile Next Karya Digital Solutions.",
};

export default async function Page() {
  const portfolios = await getPublicPortfolios();
  return <PortfolioPage portfolios={portfolios} />;
}
