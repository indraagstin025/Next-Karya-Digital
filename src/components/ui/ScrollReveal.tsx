import React from "react";

type RevealDirection = "up" | "left" | "right" | "scale" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: RevealDirection;
}

/**
 * Pembungkus reveal tanpa JavaScript. Animasi dijalankan browser lewat
 * scroll-driven animation; bila browser tidak mendukung, konten tampil biasa.
 */
export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
}: ScrollRevealProps) {
  return (
    <div
      data-nk-reveal={direction}
      style={delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
