"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TILT_LIMIT_DEG = 4;

type FloatConfig = {
  y: number;
  rotation: number;
  duration: number;
  delay?: number;
  origin: string;
};

/**
 * Amplitudo memakai satuan user space SVG, bukan piksel layar. Nilai origin
 * mengikuti titik tengah tiap ikon agar rotasi tidak mengayun dari pojok.
 */
const FLOAT_ICONS: Record<string, FloatConfig> = {
  "mobile-android": { y: -5, rotation: -2, duration: 2.8, origin: "28 120" },
  "mobile-apple": { y: -6, rotation: 2, duration: 3.2, delay: 0.35, origin: "212 190" },
  "website-plus": { y: -4, rotation: -3, duration: 3.0, origin: "12 115" },
  "website-arrow": { y: -5, rotation: 2, duration: 3.4, origin: "282 156" },
  "website-window": { y: -4, rotation: 0, duration: 2.6, origin: "279 59" },
  "website-chart": { y: -3, rotation: 0, duration: 3.1, origin: "40 190" },
};

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

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const icons = gsap.utils.toArray<SVGGElement>(
          "[data-service-float]",
          scope.current
        );
        const tweens: gsap.core.Tween[] = [];
        const triggers: ScrollTrigger[] = [];

        icons.forEach((icon) => {
          const config = FLOAT_ICONS[icon.dataset.serviceFloat ?? ""];
          if (!config) return;

          const tween = gsap.to(icon, {
            y: config.y,
            rotation: config.rotation,
            duration: config.duration,
            delay: config.delay ?? 0,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            svgOrigin: config.origin,
            paused: true,
          });

          const trigger = ScrollTrigger.create({
            trigger: icon,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
          });

          if (trigger.isActive) tween.play();

          tweens.push(tween);
          triggers.push(trigger);
        });

        return () => {
          triggers.forEach((trigger) => trigger.kill());
          tweens.forEach((tween) => tween.kill());
        };
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
