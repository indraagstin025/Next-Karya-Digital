import type { Metadata } from "next";
import { WorkspaceSection } from "@/features/cms/WorkspaceSection";

export const metadata: Metadata = {
  title: "Testimoni Klien | Next Karya Digital Solutions",
};

export default function TestimoniPage() {
  return <WorkspaceSection section="structured-testimonials" />;
}
