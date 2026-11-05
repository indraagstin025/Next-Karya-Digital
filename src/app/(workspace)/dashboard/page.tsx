import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Dashboard Analitik | Next Karya Digital Solutions",
};

export default function DashboardPage() {
  return <WorkspaceSection section="dashboard" />;
}
