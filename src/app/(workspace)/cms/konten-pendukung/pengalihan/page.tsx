import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Pengalihan Alamat | Next Karya Digital Solutions",
};

export default function PengalihanPage() {
  return <WorkspaceSection section="structured-redirects" />;
}
