import React from "react";
import { SectionHeaderTypewriter } from "@/components/ui/ScrollTypewriter";
import { SdlcInteractiveGrid } from "@/features/home/components/WorkflowSection";

export function ServiceWorkflow() {
  return (
    <div className="mt-20 pt-16 border-t border-[#E2E8F0] dark:border-slate-800">
      <SectionHeaderTypewriter
        eyebrow="PROSES KERJA"
        line1="Alur Kerja Kami"
        line2Accent="Berbasis Metode SDLC"
        description="Dari ide hingga implementasi, kami mengikuti tahapan pengembangan yang terstruktur dan efisien."
        charsPerSecond={68}
        blockAccent
      />

      <SdlcInteractiveGrid />
    </div>
  );
}

