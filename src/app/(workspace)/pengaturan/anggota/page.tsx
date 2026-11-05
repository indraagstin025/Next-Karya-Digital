import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Anggota Tim | Next Karya Digital Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnggotaTimPage() {
  return <WorkspaceSection section="team" />;
}
