import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "FAQ | Next Karya Digital Solutions",
};

export default function FaqPage() {
  return <WorkspaceSection section="structured-faqs" />;
}
