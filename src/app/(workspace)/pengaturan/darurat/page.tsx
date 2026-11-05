import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Penanganan Darurat | Next Karya Digital Solutions",
};

export default function DaruratPage() {
  return <WorkspaceSection section="emergency" />;
}
