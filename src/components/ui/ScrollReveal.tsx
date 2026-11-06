import React from "react";

type RevealDirection = "up" | "left" | "right" | "scale" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: RevealDirection;
  priority?: boolean;
}

/**
 * Pembungkus reveal tanpa JavaScript. Animasi dijalankan browser lewat
 * scroll-driven animation; bila browser tidak mendukung, konten tampil biasa.
 * `priority` menandai header section agar tetap beranimasi di layar kecil.
 */
export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
  priority = false,
}: ScrollRevealProps) {
  return (
    <div
      data-nk-reveal={direction}
      data-nk-reveal-priority={priority ? "true" : undefined}
      style={delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
