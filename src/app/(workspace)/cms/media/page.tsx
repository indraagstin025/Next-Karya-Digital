import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Gambar & Berkas | Next Karya Digital Solutions",
};

export default function MediaPage() {
  return <WorkspaceSection section="media" />;
}
