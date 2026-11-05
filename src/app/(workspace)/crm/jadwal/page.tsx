import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Jadwal & Agenda | Next Karya Digital Solutions",
};

export default function JadwalPage() {
  return <WorkspaceSection section="crm-schedules" />;
}
