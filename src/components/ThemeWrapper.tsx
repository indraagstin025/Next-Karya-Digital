"use client";

import React, { useSyncExternalStore } from "react";

const THEME_KEY = "nk-theme-preference";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

const getSnapshot = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(THEME_KEY) === "dark";
};

const getServerSnapshot = () => false;

export function ThemeWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      id="nk-site"
      className={`site-wrap ${isDark ? "theme-dark" : ""} ${className}`}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
