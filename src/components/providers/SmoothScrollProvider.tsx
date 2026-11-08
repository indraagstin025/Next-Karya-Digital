"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ScrollToOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

export interface SmoothScrollContextValue {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: ScrollToOptions
  ) => void;
  refresh: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: (target, options) => {
    if (typeof window === "undefined") return;
    const offset = options?.offset ?? 0;
    if (typeof target === "number") {
      window.scrollTo({
        top: Math.max(0, target + offset),
        behavior: options?.immediate ? "auto" : "smooth",
      });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: options?.immediate ? "auto" : "smooth",
        });
      }
    } else if (target instanceof HTMLElement) {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: options?.immediate ? "auto" : "smooth",
      });
    }
  },
  refresh: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

const WORKSPACE_PREFIXES = ["/cms", "/crm", "/dashboard", "/pengaturan"];

function isWorkspaceRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return WORKSPACE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function getHeaderOffset(): number {
  if (typeof window === "undefined") return 84;
  return window.innerWidth >= 1024 ? 92 : 84;
}

function canElementScrollInternally(
  target: EventTarget | null,
  deltaY: number
): boolean {
  if (!(target instanceof HTMLElement)) return false;

  let el: HTMLElement | null = target;
  while (el && el !== document.body && el !== document.documentElement) {
    if (
      el.hasAttribute("data-smooth-prevent") ||
      el.hasAttribute("data-lenis-prevent") ||
      el.getAttribute("role") === "dialog" ||
      el.getAttribute("role") === "listbox" ||
      el.getAttribute("role") === "menu"
    ) {
      return true;
    }

    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const isScrollableY =
      overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";

    if (isScrollableY && el.scrollHeight > el.clientHeight + 1) {
      const atTop = el.scrollTop <= 0;
      const atBottom =
        Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
        return true;
      }
    }

    el = el.parentElement;
  }

  return false;
}

interface ProgrammaticTween {
  startScroll: number;
  endScroll: number;
  elapsed: number;
  duration: number;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicPage = !isWorkspaceRoute(pathname);

  const stateRef = useRef({
    currentScroll: 0,
    targetScroll: 0,
    velocity: 0,
    damping: 0.14,
    lastWheelTime: 0,
    isInternalScrollWrite: false,
    isAnimating: false,
    reducedMotion: false,
    tween: null as ProgrammaticTween | null,
  });

  const parallaxNodesRef = useRef<HTMLElement[]>([]);

  const collectParallaxNodes = useCallback(() => {
    if (typeof document === "undefined") return;
    parallaxNodesRef.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nk-parallax]")
    );
  }, []);

  const updateParallax = useCallback((scrollY: number) => {
    const nodes = parallaxNodesRef.current;
    if (nodes.length === 0 || typeof window === "undefined") return;

    const viewportH = window.innerHeight || 1;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node.isConnected) continue;

      const speedAttr = node.getAttribute("data-nk-parallax");
      const speed = speedAttr ? parseFloat(speedAttr) : 0.08;
      if (Number.isNaN(speed) || speed === 0) continue;

      const rect = node.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > viewportH + 200) continue;

      const centerOffset = rect.top + rect.height * 0.5 - viewportH * 0.5;
      const translateY = clamp(-centerOffset * speed, -36, 36);
      node.style.setProperty("--nk-parallax-y", `${translateY.toFixed(2)}px`);
    }
    void scrollY;
  }, []);

  const getMaxScroll = useCallback(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return 0;
    }
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }, []);

  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: ScrollToOptions
    ): void => {
      if (typeof window === "undefined") return;

      const s = stateRef.current;
      const offset = options?.offset ?? 0;
      let destination = 0;

      if (typeof target === "number") {
        destination = target + offset;
      } else if (typeof target === "string") {
        const selector = target.startsWith("#") ? target : `#${target}`;
        const el =
          document.getElementById(selector.slice(1)) ??
          document.querySelector<HTMLElement>(target);
        if (!el) return;
        destination = el.getBoundingClientRect().top + window.scrollY + offset;
      } else if (target instanceof HTMLElement) {
        destination =
          target.getBoundingClientRect().top + window.scrollY + offset;
      }

      const maxScroll = getMaxScroll();
      const clampedDest = clamp(destination, 0, maxScroll);

      if (
        !isPublicPage ||
        s.reducedMotion ||
        options?.immediate ||
        Math.abs(clampedDest - window.scrollY) < 2
      ) {
        s.tween = null;
        s.currentScroll = clampedDest;
        s.targetScroll = clampedDest;
        s.isInternalScrollWrite = true;
        window.scrollTo(0, clampedDest);
        s.isInternalScrollWrite = false;
        return;
      }

      s.targetScroll = clampedDest;
      s.tween = {
        startScroll: s.currentScroll,
        endScroll: clampedDest,
        elapsed: 0,
        duration: options?.duration ?? 1.05,
      };
      s.isAnimating = true;
    },
    [getMaxScroll, isPublicPage]
  );

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    collectParallaxNodes();
    const maxScroll = getMaxScroll();
    const s = stateRef.current;
    s.targetScroll = clamp(s.targetScroll, 0, maxScroll);
    s.currentScroll = clamp(window.scrollY, 0, maxScroll);
    ScrollTrigger.refresh();
  }, [collectParallaxNodes, getMaxScroll]);

  useEffect(() => {
    if (typeof window === "undefined" || !isPublicPage) {
      document.documentElement.classList.remove("nk-smooth-scroll");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchDeviceQuery = window.matchMedia("(pointer: coarse)");
    const s = stateRef.current;
    s.reducedMotion = mediaQuery.matches;

    const syncMode = () => {
      s.reducedMotion = mediaQuery.matches;
      if (s.reducedMotion || touchDeviceQuery.matches) {
        document.documentElement.classList.remove("nk-smooth-scroll");
      } else {
        document.documentElement.classList.add("nk-smooth-scroll");
      }
    };

    syncMode();
    s.currentScroll = window.scrollY;
    s.targetScroll = window.scrollY;
    collectParallaxNodes();

    const onWheel = (event: WheelEvent) => {
      if (s.reducedMotion || touchDeviceQuery.matches) return;
      if (event.defaultPrevented || event.ctrlKey || event.metaKey) return;

      // Jangan intervensi swipe horizontal di touchpad
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      if (canElementScrollInternally(event.target, event.deltaY)) return;

      event.preventDefault();

      let deltaY = event.deltaY;
      if (event.deltaMode === 1) {
        deltaY *= 40;
      } else if (event.deltaMode === 2) {
        deltaY *= window.innerHeight;
      }

      const now = performance.now();
      const dtWheel = now - s.lastWheelTime;
      s.lastWheelTime = now;

      // Deteksi karakteristik Touchpad vs Roda Mouse
      // Touchpad: mengirim event frekuensi tinggi (< 32ms), sub-pixel, atau deltaY kecil (< 52px)
      const isTouchpadGesture =
        event.deltaMode === 0 &&
        (dtWheel < 32 ||
          !Number.isInteger(event.deltaY) ||
          Math.abs(deltaY) < 52 ||
          Math.abs(event.deltaX) > 0);

      // Touchpad menggunakan damping tinggi (0.22) agar menempel presisi mengikuti jari
      // Roda mouse menggunakan damping lebih lembut (0.115) agar luncuran antar-takik halus
      s.damping = isTouchpadGesture ? 0.22 : 0.115;

      // Batasi lonjakan ekstrem dari roda mouse berkecepatan tinggi
      const scaledDelta = isTouchpadGesture
        ? deltaY
        : clamp(deltaY * 0.95, -260, 260);

      s.tween = null;
      const maxScroll = getMaxScroll();
      s.targetScroll = clamp(s.targetScroll + scaledDelta, 0, maxScroll);
      s.isAnimating = true;
    };

    const onNativeScroll = () => {
      if (s.isInternalScrollWrite) return;
      // Pengguna menggeser scrollbar manual, swipe layar sentuh, atau navigasi keyboard
      const nativeY = window.scrollY;
      if (!s.tween && Math.abs(nativeY - s.currentScroll) > 1.5) {
        s.currentScroll = nativeY;
        s.targetScroll = nativeY;
      }
      updateParallax(nativeY);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        (active instanceof HTMLElement && active.isContentEditable);

      if (isInput) return;

      const maxScroll = getMaxScroll();
      const pageStep = window.innerHeight * 0.82;
      const lineStep = 96;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          s.tween = null;
          s.damping = 0.14;
          s.targetScroll = clamp(s.targetScroll + lineStep, 0, maxScroll);
          s.isAnimating = true;
          break;
        case "ArrowUp":
          event.preventDefault();
          s.tween = null;
          s.damping = 0.14;
          s.targetScroll = clamp(s.targetScroll - lineStep, 0, maxScroll);
          s.isAnimating = true;
          break;
        case "PageDown":
          event.preventDefault();
          scrollTo(s.targetScroll + pageStep, { duration: 0.75 });
          break;
        case "PageUp":
          event.preventDefault();
          scrollTo(s.targetScroll - pageStep, { duration: 0.75 });
          break;
        case "Home":
          event.preventDefault();
          scrollTo(0, { duration: 0.9 });
          break;
        case "End":
          event.preventDefault();
          scrollTo(maxScroll, { duration: 0.9 });
          break;
        default:
          break;
      }
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref || rawHref === "#") return;

      let hash = "";
      if (rawHref.startsWith("#")) {
        hash = rawHref;
      } else {
        try {
          const url = new URL(anchor.href, window.location.origin);
          if (
            url.origin === window.location.origin &&
            url.pathname === window.location.pathname &&
            url.hash
          ) {
            hash = url.hash;
          }
        } catch {
          return;
        }
      }

      if (!hash || hash.length < 2) return;

      const targetElement = document.getElementById(
        decodeURIComponent(hash.slice(1))
      );
      if (!targetElement) return;

      event.preventDefault();
      window.history.pushState(null, "", hash);
      scrollTo(targetElement, {
        offset: -getHeaderOffset(),
        duration: 1.05,
      });
    };

    const tick = (
      _time: number,
      deltaTimeMs: number
    ) => {
      if (s.reducedMotion) return;

      const dt = clamp((deltaTimeMs || 16.67) / 1000, 0.001, 0.1);

      if (s.tween) {
        s.tween.elapsed += dt;
        const progress = clamp(s.tween.elapsed / s.tween.duration, 0, 1);
        const eased = easeOutExpo(progress);
        const nextY =
          s.tween.startScroll +
          (s.tween.endScroll - s.tween.startScroll) * eased;

        s.velocity = (nextY - s.currentScroll) / dt;
        s.currentScroll = nextY;
        s.targetScroll = s.tween.endScroll;

        s.isInternalScrollWrite = true;
        window.scrollTo(0, s.currentScroll);
        s.isInternalScrollWrite = false;

        ScrollTrigger.update();
        updateParallax(s.currentScroll);

        if (progress >= 1) {
          s.tween = null;
          s.velocity = 0;
          s.isAnimating = false;
        }
        return;
      }

      const diff = s.targetScroll - s.currentScroll;
      if (Math.abs(diff) > 0.08) {
        // Frame-rate independent exponential interpolation (konsisten di 60Hz, 120Hz, 144Hz)
        const alpha = 1 - Math.exp(-s.damping * 60 * dt);
        const nextY = s.currentScroll + diff * alpha;

        s.velocity = (nextY - s.currentScroll) / dt;
        s.currentScroll = nextY;

        s.isInternalScrollWrite = true;
        window.scrollTo(0, s.currentScroll);
        s.isInternalScrollWrite = false;

        document.documentElement.style.setProperty(
          "--nk-scroll-velocity",
          clamp(s.velocity * 0.012, -40, 40).toFixed(3)
        );

        ScrollTrigger.update();
        updateParallax(s.currentScroll);
      } else if (s.isAnimating) {
        s.currentScroll = s.targetScroll;
        s.velocity = 0;
        s.isAnimating = false;

        s.isInternalScrollWrite = true;
        window.scrollTo(0, s.currentScroll);
        s.isInternalScrollWrite = false;

        document.documentElement.style.setProperty(
          "--nk-scroll-velocity",
          "0"
        );
        ScrollTrigger.update();
        updateParallax(s.currentScroll);
      }
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);
    mediaQuery.addEventListener("change", syncMode);
    touchDeviceQuery.addEventListener("change", syncMode);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        const maxScroll = getMaxScroll();
        if (s.targetScroll > maxScroll) {
          s.targetScroll = maxScroll;
        }
        collectParallaxNodes();
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
      mediaQuery.removeEventListener("change", syncMode);
      touchDeviceQuery.removeEventListener("change", syncMode);
      if (resizeObserver) resizeObserver.disconnect();
      document.documentElement.classList.remove("nk-smooth-scroll");
    };
  }, [collectParallaxNodes, getMaxScroll, isPublicPage, scrollTo, updateParallax]);

  // Sinkronisasi saat berpindah rute halaman publik atau menuju hash (#paket-layanan, dll.)
  useEffect(() => {
    if (typeof window === "undefined" || !isPublicPage) return;

    const timer = window.setTimeout(() => {
      collectParallaxNodes();
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) {
          scrollTo(el, { offset: -getHeaderOffset(), duration: 0.95 });
          return;
        }
      }
      const s = stateRef.current;
      s.currentScroll = window.scrollY;
      s.targetScroll = window.scrollY;
      updateParallax(window.scrollY);
      ScrollTrigger.refresh();
    }, 60);

    return () => window.clearTimeout(timer);
  }, [pathname, isPublicPage, collectParallaxNodes, scrollTo, updateParallax]);

  const contextValue = useMemo<SmoothScrollContextValue>(
    () => ({
      scrollTo,
      refresh,
    }),
    [scrollTo, refresh]
  );

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
