"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Animasi masuk untuk blok teks hero. Markup tetap dirender server; GSAP hanya
 * mengubah posisi setelah hydration. Pengguna dengan reduced motion langsung
 * melihat posisi akhir tanpa animasi.
 */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-line]", {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        });

        gsap.from("[data-hero-fade]", {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.07,
          delay: 0.18,
        });

        gsap.from("[data-hero-visual]", {
          y: 16,
          scale: 0.97,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.22,
        });
      });

      return () => mm.revert();
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}
