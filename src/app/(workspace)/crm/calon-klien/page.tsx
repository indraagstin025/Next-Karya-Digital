import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Calon Klien | Next Karya Digital Solutions",
};

export default function CalonKlienPage() {
  return <WorkspaceSection section="crm-leads" />;
}
