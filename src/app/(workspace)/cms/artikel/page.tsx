import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Artikel Blog | Next Karya Digital Solutions",
};

export default function ArtikelPage() {
  return <WorkspaceSection section="posts" />;
}
