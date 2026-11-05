import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Layanan | Next Karya Digital Solutions",
};

export default function LayananPage() {
  return <WorkspaceSection section="services" />;
}
