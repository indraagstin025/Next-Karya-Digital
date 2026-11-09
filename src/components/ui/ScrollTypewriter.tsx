"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons";

interface ScrollTypewriterProps {
  text: string;
  as?: "h2" | "h3" | "p" | "span";
  className?: string;
  charsPerSecond?: number;
  startDelayMs?: number;
  cursorClassName?: string;
}

export function ScrollTypewriter({
  text,
  as: Tag = "p",
  className = "",
  charsPerSecond = 38,
  startDelayMs = 0,
  cursorClassName = "bg-[#005090] dark:bg-[#38BDF8]",
}: ScrollTypewriterProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [charCount, setCharCount] = useState<number>(text.length);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let rafId = 0;
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    let cursorHideTimer: ReturnType<typeof setTimeout> | null = null;
    let hasStarted = false;
    let startTime = 0;

    const totalChars = text.length;

    const stopAnimations = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
      if (cursorHideTimer) {
        clearTimeout(cursorHideTimer);
        cursorHideTimer = null;
      }
    };

    const startTyping = () => {
      if (hasStarted) return;
      hasStarted = true;
      setCharCount(0);

      delayTimer = setTimeout(() => {
        setIsTyping(true);
        startTime = performance.now();

        const step = (now: number) => {
          const elapsedSec = (now - startTime) / 1000;
          const nextCount = Math.min(
            totalChars,
            Math.floor(elapsedSec * charsPerSecond)
          );

          setCharCount(nextCount);

          if (nextCount < totalChars) {
            rafId = window.requestAnimationFrame(step);
          } else {
            rafId = 0;
            cursorHideTimer = setTimeout(() => {
              setIsTyping(false);
            }, 400);
          }
        };

        rafId = window.requestAnimationFrame(step);
      }, startDelayMs);
    };

    const initialRect = el.getBoundingClientRect();
    if (initialRect.top > window.innerHeight * 0.92) {
      setCharCount(0);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startTyping();
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.95) {
            stopAnimations();
            hasStarted = false;
            setIsTyping(false);
            setCharCount(0);
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    observer.observe(el);

    return () => {
      stopAnimations();
      observer.disconnect();
    };
  }, [text, charsPerSecond, startDelayMs]);

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement & HTMLParagraphElement>}
      className={`relative ${className}`}
      aria-label={text}
    >
      <span aria-hidden="true" className="invisible select-none block">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 block">
        {text.slice(0, charCount)}
        {isTyping && (
          <span
            className={`inline-block w-[2px] h-[0.92em] align-[-0.1em] ml-[2px] rounded-full animate-pulse ${cursorClassName}`}
          />
        )}
      </span>
    </Tag>
  );
}

interface HeroIntroTypewriterProps {
  line1: string;
  line2Prefix: string;
  line2Accent: string;
  description: string;
  /** Kecepatan ketik judul hero dalam karakter per detik (default: 62 — cepat & responsif) */
  charsPerSecond?: number;
}

/**
 * Komponen animasi khusus Hero Section:
 * 1. Mengetik judul utama ("Bangun Website Profesional untuk Bisnis Anda yang Lebih Dipercaya.")
 *    dengan tempo lebih cepat dan tetap mempertahankan warna aksen biru pada "Lebih Dipercaya.".
 * 2. Begitu ketikan judul selesai, paragraf deskripsi di bawahnya langsung muncul secara mulus.
 */
export function HeroIntroTypewriter({
  line1,
  line2Prefix,
  line2Accent,
  description,
  charsPerSecond = 62,
}: HeroIntroTypewriterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fullLine1 = line1;
  const fullLine2 = `${line2Prefix}${line2Accent}`;
  const totalChars = fullLine1.length + fullLine2.length;

  const [charCount, setCharCount] = useState<number>(totalChars);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let rafId = 0;
    let cursorHideTimer: ReturnType<typeof setTimeout> | null = null;
    let hasStarted = false;

    const stopAnimation = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (cursorHideTimer) {
        clearTimeout(cursorHideTimer);
        cursorHideTimer = null;
      }
    };

    const startHeroSequence = () => {
      if (hasStarted) return;
      hasStarted = true;
      stopAnimation();
      setCharCount(0);
      setIsTyping(true);
      setShowDescription(false);

      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsedSec = (now - startTime) / 1000;
        const nextCount = Math.min(
          totalChars,
          Math.max(1, Math.floor(elapsedSec * charsPerSecond))
        );

        setCharCount(nextCount);

        if (nextCount < totalChars) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          rafId = 0;
          // Begitu judul selesai diketik, langsung munculkan paragraf deskripsi
          setShowDescription(true);
          cursorHideTimer = setTimeout(() => {
            setIsTyping(false);
          }, 220);
        }
      };

      rafId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startHeroSequence();
          } else if (entry.boundingClientRect.bottom < 0) {
            // Reset jika user scroll jauh ke bawah melewati Hero agar saat kembali ke atas tetap hidup
            stopAnimation();
            hasStarted = false;
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      stopAnimation();
      observer.disconnect();
    };
  }, [totalChars, charsPerSecond]);

  const typedLine1 = fullLine1.slice(0, Math.min(charCount, fullLine1.length));
  const line2Chars = Math.max(0, charCount - fullLine1.length);
  const typedLine2Prefix = line2Prefix.slice(
    0,
    Math.min(line2Chars, line2Prefix.length)
  );
  const accentChars = Math.max(0, line2Chars - line2Prefix.length);
  const typedLine2Accent = line2Accent.slice(0, accentChars);

  const cursorOnLine1 = isTyping && charCount <= fullLine1.length;
  const cursorOnLine2 = isTyping && charCount > fullLine1.length;

  return (
    <div ref={containerRef}>
      <h1
        className="relative text-[31px] sm:text-[38px] lg:text-[44px] xl:text-[48px] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#041E42] dark:text-[#f4f8ff]"
        aria-label={`${fullLine1} ${fullLine2}`}
      >
        {/* Ghost Layout pengunci tinggi & baris (0 CLS) */}
        <span aria-hidden="true" className="invisible select-none block">
          <span className="block pb-[0.08em]">{fullLine1}</span>
          <span className="block pb-[0.08em]">
            {line2Prefix}
            <span className="text-[#005090] dark:text-[#0986C8]">
              {line2Accent}
            </span>
          </span>
        </span>

        {/* Lapisan teks judul yang diketik cepat */}
        <span aria-hidden="true" className="absolute inset-0 block">
          <span className="block pb-[0.08em]">
            {typedLine1}
            {cursorOnLine1 && (
              <span className="inline-block w-[2.5px] h-[0.88em] align-[-0.08em] ml-[2px] bg-[#005090] dark:bg-[#0986C8] animate-pulse" />
            )}
          </span>
          <span className="block pb-[0.08em]">
            {typedLine2Prefix}
            <span className="text-[#005090] dark:text-[#0986C8]">
              {typedLine2Accent}
            </span>
            {cursorOnLine2 && (
              <span className="inline-block w-[2.5px] h-[0.88em] align-[-0.08em] ml-[2px] bg-[#005090] dark:bg-[#0986C8] animate-pulse" />
            )}
          </span>
        </span>
      </h1>

      <p
        className={`mt-4 max-w-[490px] text-[14px] sm:text-[15px] leading-[1.68] text-[#4A5D78] dark:text-[#b5c5dd] font-normal transition-all duration-500 ease-out ${
          showDescription
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2.5 pointer-events-none select-none"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

interface SectionHeaderTypewriterProps {
  eyebrow: string;
  line1: string;
  line2Accent: string;
  description: string;
  charsPerSecond?: number;
  blockAccent?: boolean;
}

/**
 * Komponen animasi untuk Header Section (contoh: LAYANAN UTAMA):
 * 1. Mengetik cepat Eyebrow ("LAYANAN UTAMA") lalu Judul ("Spesialisasi rekayasa web dan mobile untuk pertumbuhan bisnis").
 * 2. Begitu judul selesai diketik, paragraf deskripsi di bawahnya langsung muncul secara halus.
 */
export function SectionHeaderTypewriter({
  eyebrow,
  line1,
  line2Accent,
  description,
  charsPerSecond = 68,
  blockAccent = false,
}: SectionHeaderTypewriterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lenEyebrow = eyebrow.length;
  const lenLine1 = line1.length;
  const lenLine2 = line2Accent.length;
  const totalChars = lenEyebrow + lenLine1 + lenLine2;

  const [charCount, setCharCount] = useState<number>(totalChars);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let rafId = 0;
    let cursorHideTimer: ReturnType<typeof setTimeout> | null = null;
    let hasStarted = false;

    const stopAnimation = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (cursorHideTimer) {
        clearTimeout(cursorHideTimer);
        cursorHideTimer = null;
      }
    };

    const startSequence = () => {
      if (hasStarted) return;
      hasStarted = true;
      stopAnimation();
      setCharCount(0);
      setIsTyping(true);
      setShowDescription(false);

      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsedSec = (now - startTime) / 1000;
        const nextCount = Math.min(
          totalChars,
          Math.max(1, Math.floor(elapsedSec * charsPerSecond))
        );

        setCharCount(nextCount);

        if (nextCount < totalChars) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          rafId = 0;
          setShowDescription(true);
          cursorHideTimer = setTimeout(() => {
            setIsTyping(false);
          }, 220);
        }
      };

      rafId = window.requestAnimationFrame(tick);
    };

    const initialRect = el.getBoundingClientRect();
    if (initialRect.top > window.innerHeight * 0.9) {
      setCharCount(0);
      setShowDescription(false);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startSequence();
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.95) {
            stopAnimation();
            hasStarted = false;
            setIsTyping(false);
            setCharCount(0);
            setShowDescription(false);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);

    return () => {
      stopAnimation();
      observer.disconnect();
    };
  }, [totalChars, charsPerSecond]);

  const typedEyebrow = eyebrow.slice(0, Math.min(charCount, lenEyebrow));
  const afterEyebrow = Math.max(0, charCount - lenEyebrow);
  const typedLine1 = line1.slice(0, Math.min(afterEyebrow, lenLine1));
  const afterLine1 = Math.max(0, afterEyebrow - lenLine1);
  const typedLine2 = line2Accent.slice(0, Math.min(afterLine1, lenLine2));

  const cursorOnEyebrow = isTyping && charCount <= lenEyebrow;
  const cursorOnLine1 =
    isTyping && charCount > lenEyebrow && charCount <= lenEyebrow + lenLine1;
  const cursorOnLine2 = isTyping && charCount > lenEyebrow + lenLine1;

  return (
    <div ref={containerRef} className="text-center max-w-[760px] mx-auto">
      {/* Eyebrow ("LAYANAN UTAMA") */}
      <p
        className="relative text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] text-[#005090] dark:text-[#0986C8]"
        aria-label={eyebrow}
      >
        <span aria-hidden="true" className="invisible select-none block">
          {eyebrow}
        </span>
        <span aria-hidden="true" className="absolute inset-0 block">
          {typedEyebrow}
          {cursorOnEyebrow && (
            <span className="inline-block w-[2px] h-[0.95em] align-[-0.1em] ml-[2px] bg-[#005090] dark:bg-[#0986C8] animate-pulse" />
          )}
        </span>
      </p>

      {/* Judul Section */}
      <h2
        className="relative mt-3 text-[26px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em] text-[#041E42] dark:text-white"
        aria-label={`${line1} ${line2Accent}`}
      >
        <span aria-hidden="true" className="invisible select-none block">
          <span className={blockAccent ? "block" : "inline"}>
            {line1}
            {!blockAccent && " "}
          </span>
          <span
            className={`${
              blockAccent ? "block" : "inline"
            } text-[#005090] dark:text-[#0986C8]`}
          >
            {line2Accent}
          </span>
        </span>

        <span aria-hidden="true" className="absolute inset-0 block">
          <span className={blockAccent ? "block" : "inline"}>
            {typedLine1}
            {!blockAccent && afterEyebrow >= lenLine1 && " "}
            {cursorOnLine1 && (
              <span className="inline-block w-[2.5px] h-[0.88em] align-[-0.08em] ml-[2px] bg-[#005090] dark:bg-[#0986C8] animate-pulse" />
            )}
          </span>
          <span
            className={`${
              blockAccent ? "block" : "inline"
            } text-[#005090] dark:text-[#0986C8]`}
          >
            {typedLine2}
            {cursorOnLine2 && (
              <span className="inline-block w-[2.5px] h-[0.88em] align-[-0.08em] ml-[2px] bg-[#005090] dark:bg-[#0986C8] animate-pulse" />
            )}
          </span>
        </span>
      </h2>

      {/* Paragraf Deskripsi — Langsung muncul mulus begitu judul selesai diketik */}
      <p
        className={`mx-auto mt-3.5 max-w-[660px] text-[13.5px] sm:text-[14.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300 transition-all duration-500 ease-out ${
          showDescription
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2.5 pointer-events-none select-none"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

interface ServiceCardSlideProps {
  side: "left" | "right";
  delayMs?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Komponen pembungkus Card Layanan Utama & Portofolio dengan efek Slide-In
 * yang jelas dari sisi Kiri atau Kanan saat masuk ke viewport (baik saat
 * scroll dari atas, scroll dari bawah, reload di posisi section, maupun ganti tab filter).
 */
export function ServiceCardSlide({
  side,
  delayMs = 0,
  className = "",
  children,
}: ServiceCardSlideProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const reducedTimer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(reducedTimer);
    }

    let revealTimer: ReturnType<typeof setTimeout> | null = null;

    const clearRevealTimer = () => {
      if (revealTimer !== null) {
        clearTimeout(revealTimer);
        revealTimer = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            clearRevealTimer();
            revealTimer = setTimeout(() => {
              setIsVisible(true);
            }, 55 + delayMs);
          } else {
            clearRevealTimer();
            setIsVisible(false);
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);
    return () => {
      clearRevealTimer();
      observer.disconnect();
    };
  }, [delayMs]);

  const hiddenTransform =
    side === "left"
      ? "-translate-x-20 sm:-translate-x-28 lg:-translate-x-36 scale-[0.96] opacity-0"
      : "translate-x-20 sm:translate-x-28 lg:translate-x-36 scale-[0.96] opacity-0";

  return (
    <div
      ref={ref}
      data-slide-visible={isVisible ? "true" : "false"}
      className={`group/slide ${className} transition-[transform,opacity] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity] ${
        isVisible ? "translate-x-0 scale-100 opacity-100" : hiddenTransform
      }`}
    >
      {children}
    </div>
  );
}

interface ServiceNarrativeTypewriterProps {
  stepNumber: string;
  categoryLabel: string;
  title: string;
  description: string;
  tags: string[];
  linkText: string;
  linkHref: string;
  isAnchor?: boolean;
  headingLevel?: "h2" | "h3";
}

interface NarrativeSegment {
  id: string;
  text: string;
  charsPerSec: number;
  pauseAfterMs: number;
}

/**
 * Komponen Naratif Layanan Interaktif dengan Efek Ketik Berurutan (Sequential Typewriter)
 * dari atas ke bawah:
 *   1. Label Kategori ("01 / LAYANAN WEBSITE")
 *   2. Judul Layanan ("Pembuatan Website Bisnis")
 *   3. Paragraf Deskripsi
 *   4. Keempat Poin Fitur Cakupan (satu per satu beserta ikon centang interaktif)
 *   5. Tautan CTA ("Lihat detail & paket ->")
 */
export function ServiceNarrativeTypewriter({
  stepNumber,
  categoryLabel,
  title,
  description,
  tags,
  linkText,
  linkHref,
  isAnchor = false,
  headingLevel: HeadingTag = "h3",
}: ServiceNarrativeTypewriterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const eyebrowText = `${stepNumber} / ${categoryLabel}`;

  const segments = useMemo<NarrativeSegment[]>(() => {
    const list: NarrativeSegment[] = [
      {
        id: "eyebrow",
        text: eyebrowText,
        charsPerSec: 28,
        pauseAfterMs: 140,
      },
      {
        id: "title",
        text: title,
        charsPerSec: 26,
        pauseAfterMs: 180,
      },
      {
        id: "description",
        text: description,
        charsPerSec: 44,
        pauseAfterMs: 160,
      },
    ];

    tags.forEach((tag, idx) => {
      list.push({
        id: `tag-${idx}`,
        text: tag,
        charsPerSec: 36,
        pauseAfterMs: 90,
      });
    });

    list.push({
      id: "cta",
      text: linkText,
      charsPerSec: 32,
      pauseAfterMs: 0,
    });

    return list;
  }, [eyebrowText, title, description, tags, linkText]);

  const timeline = useMemo(() => {
    let cursorMs = 0;
    return segments.map((seg) => {
      const durationMs = (seg.text.length / seg.charsPerSec) * 1000;
      const startMs = cursorMs;
      const endMs = startMs + durationMs;
      cursorMs = endMs + seg.pauseAfterMs;
      return {
        ...seg,
        startMs,
        endMs,
        durationMs,
      };
    });
  }, [segments]);

  const totalDurationMs =
    timeline.length > 0 ? timeline[timeline.length - 1].endMs : 0;

  // Default awal sebelum hydrasi / untuk SSR: tampil penuh
  const [elapsedMs, setElapsedMs] = useState<number>(totalDurationMs + 1000);
  const [isSequenceActive, setIsSequenceActive] = useState<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let rafId = 0;
    let finishTimer: ReturnType<typeof setTimeout> | null = null;
    let hasStarted = false;
    let startTime = 0;

    const stopSequence = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (finishTimer) {
        clearTimeout(finishTimer);
        finishTimer = null;
      }
    };

    const startSequence = () => {
      if (hasStarted) return;
      hasStarted = true;
      setIsSequenceActive(true);
      setElapsedMs(0);
      startTime = performance.now();

      const tick = (now: number) => {
        const currentElapsed = now - startTime;
        setElapsedMs(currentElapsed);

        if (currentElapsed < totalDurationMs) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          rafId = 0;
          finishTimer = setTimeout(() => {
            setIsSequenceActive(false);
          }, 450);
        }
      };

      rafId = window.requestAnimationFrame(tick);
    };

    const initialRect = el.getBoundingClientRect();
    if (initialRect.top > window.innerHeight * 0.88) {
      setElapsedMs(0);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startSequence();
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.95) {
            stopSequence();
            hasStarted = false;
            setIsSequenceActive(false);
            setElapsedMs(0);
          }
        }
      },
      {
        threshold: 0.22,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(el);

    return () => {
      stopSequence();
      observer.disconnect();
    };
  }, [totalDurationMs]);

  const getSegmentRender = (index: number) => {
    const seg = timeline[index];
    if (!seg) {
      return { visibleText: "", showCursor: false, isStarted: false, isDone: true };
    }

    if (elapsedMs <= seg.startMs) {
      return {
        visibleText: "",
        showCursor: index === 0 && isSequenceActive && elapsedMs >= 0,
        isStarted: false,
        isDone: false,
      };
    }

    if (elapsedMs >= seg.endMs) {
      const nextSeg = timeline[index + 1];
      const inPauseWindow =
        isSequenceActive &&
        (nextSeg ? elapsedMs < nextSeg.startMs : elapsedMs <= totalDurationMs + 400);

      return {
        visibleText: seg.text,
        showCursor: inPauseWindow,
        isStarted: true,
        isDone: true,
      };
    }

    const segElapsedSec = (elapsedMs - seg.startMs) / 1000;
    const count = Math.min(
      seg.text.length,
      Math.max(1, Math.floor(segElapsedSec * seg.charsPerSec))
    );

    return {
      visibleText: seg.text.slice(0, count),
      showCursor: isSequenceActive,
      isStarted: true,
      isDone: false,
    };
  };

  const eyebrowState = getSegmentRender(0);
  const titleState = getSegmentRender(1);
  const descState = getSegmentRender(2);
  const ctaState = getSegmentRender(3 + tags.length);

  return (
    <div ref={containerRef} className="select-text">
      {/* 1. Eyebrow Interaktif ("01 / LAYANAN WEBSITE") */}
      <div className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1 -ml-2.5 transition-colors duration-200 hover:bg-[#005090]/8 dark:hover:bg-sky-500/10 group/eyebrow cursor-default">
        <span
          className={`h-2 w-2 rounded-full bg-[#14B8A6] transition-transform duration-300 group-hover/eyebrow:scale-125 ${
            eyebrowState.isStarted ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        />
        <p
          className="relative text-[11.5px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#005090] dark:text-[#38BDF8]"
          aria-label={eyebrowText}
        >
          <span aria-hidden="true" className="invisible select-none block">
            {eyebrowText}
          </span>
          <span aria-hidden="true" className="absolute inset-0 block">
            {eyebrowState.visibleText}
            {eyebrowState.showCursor && (
              <span className="inline-block w-[2px] h-[0.95em] align-[-0.1em] ml-[2px] bg-[#005090] dark:bg-[#38BDF8] animate-pulse" />
            )}
          </span>
        </p>
      </div>

      {/* 2. Judul Layanan Interaktif */}
      <HeadingTag
        className="relative mt-2 text-[23px] sm:text-[28px] lg:text-[31px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#041E42] dark:text-white transition-colors duration-200 hover:text-[#005090] dark:hover:text-[#38BDF8] cursor-default"
        aria-label={title}
      >
        <span aria-hidden="true" className="invisible select-none block">
          {title}
        </span>
        <span aria-hidden="true" className="absolute inset-0 block">
          {titleState.visibleText}
          {titleState.showCursor && (
            <span className="inline-block w-[2.5px] h-[0.9em] align-[-0.08em] ml-[2px] bg-[#005090] dark:bg-[#38BDF8] animate-pulse" />
          )}
        </span>
      </HeadingTag>

      {/* 3. Paragraf Deskripsi Layanan */}
      <p
        className="relative mt-3.5 text-[14px] sm:text-[15.5px] leading-[1.72] text-[#4A5D78] dark:text-slate-300"
        aria-label={description}
      >
        <span aria-hidden="true" className="invisible select-none block">
          {description}
        </span>
        <span aria-hidden="true" className="absolute inset-0 block">
          {descState.visibleText}
          {descState.showCursor && (
            <span className="inline-block w-[2px] h-[0.95em] align-[-0.1em] ml-[2px] bg-[#14B8A6] dark:bg-[#2DD4BF] animate-pulse" />
          )}
        </span>
      </p>

      {/* 4. Daftar Poin Cakupan Layanan Interaktif (Diketik Berurutan) */}
      <ul
        className={`mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 pt-5 border-t transition-colors duration-500 ${
          descState.isDone
            ? "border-[#E2E8F0] dark:border-slate-800/90"
            : "border-transparent"
        }`}
      >
        {tags.map((tag, idx) => {
          const tagState = getSegmentRender(3 + idx);

          return (
            <li
              key={tag}
              className="group/item flex items-center gap-2.5 rounded-xl px-3 py-2 -mx-3 text-[13.5px] sm:text-[14px] font-semibold text-[#072146] dark:text-slate-200 transition-all duration-200 hover:translate-x-1.5 hover:bg-white/90 dark:hover:bg-slate-800/70 hover:text-[#005090] dark:hover:text-[#38BDF8] hover:shadow-[0_6px_18px_-6px_rgba(0,80,144,0.14)] cursor-default"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#14B8A6]/12 dark:bg-[#2DD4BF]/15 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-[#14B8A6] ${
                  tagState.isStarted
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-50"
                }`}
              >
                <CheckIcon className="h-3.5 w-3.5 text-[#14B8A6] dark:text-[#2DD4BF] group-hover/item:text-white transition-colors" />
              </span>

              <span className="relative flex-1" aria-label={tag}>
                <span aria-hidden="true" className="invisible select-none block">
                  {tag}
                </span>
                <span aria-hidden="true" className="absolute inset-0 block">
                  {tagState.visibleText}
                  {tagState.showCursor && (
                    <span className="inline-block w-[2px] h-[0.9em] align-[-0.08em] ml-[2px] bg-[#14B8A6] dark:bg-[#2DD4BF] animate-pulse" />
                  )}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      {/* 5. Tautan CTA Interaktif ("Lihat detail & paket ->") */}
      <div className="mt-6">
        {isAnchor ? (
          <a
            href={linkHref}
            className={`group/link inline-flex min-h-11 items-center gap-2.5 rounded-full px-4 py-2 -ml-4 text-[14px] font-bold text-[#005090] dark:text-[#38BDF8] transition-all duration-200 hover:bg-[#005090]/8 dark:hover:bg-sky-500/10 hover:text-[#003E70] ${
              ctaState.isStarted ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="relative" aria-label={linkText}>
              <span aria-hidden="true" className="invisible select-none block">
                {linkText}
              </span>
              <span aria-hidden="true" className="absolute inset-0 block">
                {ctaState.visibleText}
                {ctaState.showCursor && (
                  <span className="inline-block w-[2px] h-[0.9em] align-[-0.08em] ml-[2px] bg-[#005090] dark:bg-[#38BDF8] animate-pulse" />
                )}
              </span>
            </span>
            <ArrowRightIcon
              className={`h-4 w-4 transition-all duration-300 group-hover/link:translate-x-1.5 ${
                ctaState.isDone
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
              }`}
            />
          </a>
        ) : (
          <Link
            href={linkHref}
            className={`group/link inline-flex min-h-11 items-center gap-2.5 rounded-full px-4 py-2 -ml-4 text-[14px] font-bold text-[#005090] dark:text-[#38BDF8] transition-all duration-200 hover:bg-[#005090]/8 dark:hover:bg-sky-500/10 hover:text-[#003E70] ${
              ctaState.isStarted ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="relative" aria-label={linkText}>
              <span aria-hidden="true" className="invisible select-none block">
                {linkText}
              </span>
              <span aria-hidden="true" className="absolute inset-0 block">
                {ctaState.visibleText}
                {ctaState.showCursor && (
                  <span className="inline-block w-[2px] h-[0.9em] align-[-0.08em] ml-[2px] bg-[#005090] dark:bg-[#38BDF8] animate-pulse" />
                )}
              </span>
            </span>
            <ArrowRightIcon
              className={`h-4 w-4 transition-all duration-300 group-hover/link:translate-x-1.5 ${
                ctaState.isDone
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
              }`}
            />
          </Link>
        )}
      </div>
    </div>
  );
}
