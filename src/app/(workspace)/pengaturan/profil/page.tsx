import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Profil Saya | Next Karya Digital Solutions",
};

export default function ProfilPage() {
  return <WorkspaceSection section="profile" />;
}
