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
 * Pembungkus reveal GPU-accelerated (opacity + translate3d) yang dipicu oleh
 * shared IntersectionObserver di SmoothScrollProvider.
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
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
