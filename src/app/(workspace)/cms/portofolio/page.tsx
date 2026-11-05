import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Portofolio Klien | Next Karya Digital Solutions",
};

export default function PortofolioPage() {
  return <WorkspaceSection section="portfolios" />;
}
