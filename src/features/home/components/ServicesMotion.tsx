"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TILT_LIMIT_DEG = 4;

/**
 * Entrance card Layanan Utama lewat ScrollTrigger.batch, lalu tilt 3D dan
 * spotlight kursor hanya di perangkat dengan pointer presisi. Tidak ada
 * animasi saat pengguna memilih reduced motion.
 */
export function ServicesMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-service-card]",
        scope.current
      );

      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(cards, { opacity: 0, y: 32 });

        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });
      });

      mm.add(
        "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
        () => {
          const cleanups: Array<() => void> = [];

          cards.forEach((card) => {
            const quickRotateX = gsap.quickTo(card, "rotationX", {
              duration: 0.45,
              ease: "power2.out",
            });
            const quickRotateY = gsap.quickTo(card, "rotationY", {
              duration: 0.45,
              ease: "power2.out",
            });
            const quickLift = gsap.quickTo(card, "y", {
              duration: 0.45,
              ease: "power2.out",
            });

            gsap.set(card, {
              transformPerspective: 900,
              transformOrigin: "center center",
            });

            const handleMove = (event: MouseEvent) => {
              const rect = card.getBoundingClientRect();
              const ratioX = (event.clientX - rect.left) / rect.width;
              const ratioY = (event.clientY - rect.top) / rect.height;

              card.style.setProperty("--mx", `${ratioX * 100}%`);
              card.style.setProperty("--my", `${ratioY * 100}%`);

              quickRotateY((ratioX - 0.5) * TILT_LIMIT_DEG * 2);
              quickRotateX((0.5 - ratioY) * TILT_LIMIT_DEG * 2);
              quickLift(-6);
            };

            const handleLeave = () => {
              quickRotateX(0);
              quickRotateY(0);
              quickLift(0);
              card.style.setProperty("--mx", "50%");
              card.style.setProperty("--my", "50%");
            };

            card.addEventListener("mousemove", handleMove);
            card.addEventListener("mouseleave", handleLeave);

            cleanups.push(() => {
              card.removeEventListener("mousemove", handleMove);
              card.removeEventListener("mouseleave", handleLeave);
            });
          });

          return () => cleanups.forEach((cleanup) => cleanup());
        }
      );

      return () => mm.revert();
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}
