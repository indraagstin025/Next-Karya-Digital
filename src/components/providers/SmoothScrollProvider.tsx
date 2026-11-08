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

/**
 * Mendeteksi apakah event wheel berasal dari Touchpad (Precision Trackpad / macOS)
 * atau dari roda mouse bertakik (Stepped Mouse Wheel).
 * Touchpad dibiarkan berjalan native di GPU Compositor Thread browser (0ms lag, 120Hz inertia).
 */
function isTouchpadEvent(event: WheelEvent, dtMs: number, wasTouchpad: boolean): boolean {
  if (event.deltaMode !== 0) return false;
  if (Math.abs(event.deltaX) > 0) return true;
  if (!Number.isInteger(event.deltaY)) return true;

  const legacyWheelDeltaY = (
    event as WheelEvent & { wheelDeltaY?: number }
  ).wheelDeltaY;

  if (
    typeof legacyWheelDeltaY === "number" &&
    legacyWheelDeltaY !== 0 &&
    Math.abs(legacyWheelDeltaY) % 120 !== 0
  ) {
    return true;
  }

  if (Math.abs(event.deltaY) < 48) return true;
  if (wasTouchpad && dtMs < 55) return true;

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
    lastWheelTime: 0,
    lastFrameTime: 0,
    lastInternalWriteTime: 0,
    wasTouchpad: false,
    rafId: 0,
    reducedMotion: false,
    tween: null as ProgrammaticTween | null,
  });

  const getMaxScroll = useCallback(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return 0;
    }
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }, []);

  const stopLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.rafId) {
      window.cancelAnimationFrame(s.rafId);
      s.rafId = 0;
    }
    s.lastFrameTime = 0;
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("nk-smooth-scroll");
    }
  }, []);

  const startLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.rafId || typeof window === "undefined") return;

    document.documentElement.classList.add("nk-smooth-scroll");
    s.lastFrameTime = performance.now();

    const step = (now: number) => {
      const dt = clamp((now - s.lastFrameTime) / 1000, 0.001, 0.064);
      s.lastFrameTime = now;

      if (s.tween) {
        s.tween.elapsed += dt;
        const progress = clamp(s.tween.elapsed / s.tween.duration, 0, 1);
        const eased = easeOutExpo(progress);
        s.currentScroll =
          s.tween.startScroll +
          (s.tween.endScroll - s.tween.startScroll) * eased;
        s.targetScroll = s.tween.endScroll;

        s.lastInternalWriteTime = now;
        window.scrollTo(0, s.currentScroll);

        if (progress >= 1) {
          s.tween = null;
          s.rafId = 0;
          document.documentElement.classList.remove("nk-smooth-scroll");
          return;
        }

        s.rafId = window.requestAnimationFrame(step);
        return;
      }

      const diff = s.targetScroll - s.currentScroll;
      if (Math.abs(diff) > 0.4) {
        // Frame-rate independent exponential LERP khusus untuk memperhalus roda mouse
        const alpha = 1 - Math.exp(-0.14 * 60 * dt);
        s.currentScroll += diff * alpha;

        s.lastInternalWriteTime = now;
        window.scrollTo(0, s.currentScroll);
        s.rafId = window.requestAnimationFrame(step);
      } else {
        s.currentScroll = s.targetScroll;
        s.lastInternalWriteTime = now;
        window.scrollTo(0, s.currentScroll);
        s.rafId = 0;
        document.documentElement.classList.remove("nk-smooth-scroll");
      }
    };

    s.rafId = window.requestAnimationFrame(step);
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
        stopLoop();
        s.tween = null;
        s.currentScroll = clampedDest;
        s.targetScroll = clampedDest;
        s.lastInternalWriteTime = performance.now();
        window.scrollTo(0, clampedDest);
        return;
      }

      s.currentScroll = window.scrollY;
      s.targetScroll = clampedDest;
      s.tween = {
        startScroll: s.currentScroll,
        endScroll: clampedDest,
        elapsed: 0,
        duration: options?.duration ?? 0.9,
      };
      startLoop();
    },
    [getMaxScroll, isPublicPage, startLoop, stopLoop]
  );

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    const maxScroll = getMaxScroll();
    const s = stateRef.current;
    s.targetScroll = clamp(s.targetScroll, 0, maxScroll);
    s.currentScroll = clamp(window.scrollY, 0, maxScroll);
  }, [getMaxScroll]);

  useEffect(() => {
    if (typeof window === "undefined" || !isPublicPage) {
      stopLoop();
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchDeviceQuery = window.matchMedia("(pointer: coarse)");
    const s = stateRef.current;
    s.reducedMotion = mediaQuery.matches;
    s.currentScroll = window.scrollY;
    s.targetScroll = window.scrollY;

    const syncMode = () => {
      s.reducedMotion = mediaQuery.matches;
      if (s.reducedMotion || touchDeviceQuery.matches) {
        stopLoop();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (s.reducedMotion || touchDeviceQuery.matches) return;
      if (event.defaultPrevented || event.ctrlKey || event.metaKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const now = performance.now();
      const dtWheel = now - s.lastWheelTime;
      s.lastWheelTime = now;

      const touchpad = isTouchpadEvent(event, dtWheel, s.wasTouchpad);
      s.wasTouchpad = touchpad;

      // Jika pengguna memakai Touchpad, biarkan GPU Compositor Thread browser
      // menanganinya secara native (0ms lag, 120Hz inersia hardware asli)
      if (touchpad) {
        if (s.rafId) {
          stopLoop();
          s.tween = null;
        }
        s.currentScroll = window.scrollY;
        s.targetScroll = window.scrollY;
        return;
      }

      if (canElementScrollInternally(event.target, event.deltaY)) return;

      // Hanya intervensi untuk Stepped Mouse Wheel agar tidak patah-patah
      event.preventDefault();

      let deltaY = event.deltaY;
      if (event.deltaMode === 1) {
        deltaY *= 40;
      } else if (event.deltaMode === 2) {
        deltaY *= window.innerHeight;
      }

      if (!s.rafId) {
        s.currentScroll = window.scrollY;
        s.targetScroll = window.scrollY;
      }

      s.tween = null;
      const maxScroll = getMaxScroll();
      const scaledDelta = clamp(deltaY * 0.95, -240, 240);
      s.targetScroll = clamp(s.targetScroll + scaledDelta, 0, maxScroll);
      startLoop();
    };

    const onNativeScroll = () => {
      const now = performance.now();
      // Abaikan event scroll asinkron yang dipicu oleh window.scrollTo di dalam loop rAF kita
      if (s.rafId && now - s.lastInternalWriteTime < 48) {
        return;
      }
      s.currentScroll = window.scrollY;
      s.targetScroll = window.scrollY;
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
        duration: 0.9,
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    document.addEventListener("click", onDocumentClick);
    mediaQuery.addEventListener("change", syncMode);
    touchDeviceQuery.addEventListener("change", syncMode);

    return () => {
      stopLoop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
      document.removeEventListener("click", onDocumentClick);
      mediaQuery.removeEventListener("change", syncMode);
      touchDeviceQuery.removeEventListener("change", syncMode);
    };
  }, [getMaxScroll, isPublicPage, scrollTo, startLoop, stopLoop]);

  useEffect(() => {
    if (typeof window === "undefined" || !isPublicPage) return;

    const timer = window.setTimeout(() => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) {
          scrollTo(el, { offset: -getHeaderOffset(), duration: 0.85 });
          return;
        }
      }
      const s = stateRef.current;
      s.currentScroll = window.scrollY;
      s.targetScroll = window.scrollY;
    }, 50);

    return () => window.clearTimeout(timer);
  }, [pathname, isPublicPage, scrollTo]);

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
