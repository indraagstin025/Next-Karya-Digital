import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Halaman Statis | Next Karya Digital Solutions",
};

export default function HalamanPage() {
  return <WorkspaceSection section="structured-pages" />;
}
