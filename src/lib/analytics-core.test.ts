import { describe, expect, it } from "vitest";
import {
  ANALYTICS_SESSION_TIMEOUT_MS,
  classifyContentClick,
  detectBrowser,
  detectOs,
  isAllowedAnalyticsOrigin,
  isSessionExpired,
  resolveAnalyticsSession,
} from "./analytics-core";

describe("analytics session lifecycle", () => {
  const startedAt = Date.parse("2026-11-06T08:00:00.000Z");
  const session = { id: "nk_existing_session_1234", lastActiveAt: startedAt };

  it("keeps the session alive after 29 minutes of inactivity", () => {
    expect(
      isSessionExpired(startedAt, startedAt + 29 * 60 * 1000)
    ).toBe(false);
  });

  it("rotates the session after more than 30 minutes of inactivity", () => {
    expect(
      isSessionExpired(startedAt, startedAt + 31 * 60 * 1000)
    ).toBe(true);
    expect(ANALYTICS_SESSION_TIMEOUT_MS).toBe(30 * 60 * 1000);
  });

  it("keeps the same ID and refreshes the activity timestamp", () => {
    const next = resolveAnalyticsSession(
      session,
      startedAt + 10 * 60 * 1000,
      () => "nk_unused_session_1234"
    );

    expect(next).toEqual({
      id: session.id,
      lastActiveAt: startedAt + 10 * 60 * 1000,
    });
  });

  it("issues a new ID when the idle timeout has passed", () => {
    const next = resolveAnalyticsSession(
      session,
      startedAt + 31 * 60 * 1000,
      () => "nk_rotated_session_1234"
    );

    expect(next.id).toBe("nk_rotated_session_1234");
  });
});

describe("detectBrowser", () => {
  it.each([
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      "Safari",
    ],
    [
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
      "Chrome",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
      "Edge",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Chrome",
    ],
    [
      "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
      "Firefox",
    ],
    [
      "Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36",
      "Samsung Internet",
    ],
  ])("recognizes %s", (userAgent, expected) => {
    expect(detectBrowser(userAgent)).toBe(expected);
  });
});

describe("detectOs", () => {
  it.each([
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      "iOS",
    ],
    [
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
      "Android",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
      "Windows",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "macOS",
    ],
    [
      "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
      "Linux",
    ],
    [
      "Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36",
      "Android",
    ],
  ])("recognizes %s", (userAgent, expected) => {
    expect(detectOs(userAgent)).toBe(expected);
  });
});

describe("classifyContentClick", () => {
  const origin = "https://nextkarya.web.id";

  it("marks service links as service clicks", () => {
    expect(classifyContentClick("/layanan/web-development", origin)).toEqual({
      eventName: "service_click",
      targetPath: "/layanan/web-development",
    });
    expect(classifyContentClick("/layanan#paket-layanan", origin)).toEqual({
      eventName: "service_click",
      targetPath: "/layanan#paket-layanan",
    });
  });

  it("marks portfolio links as portfolio clicks", () => {
    expect(
      classifyContentClick(
        "https://nextkarya.web.id/portofolio/aplikasi-kasir#galeri",
        origin
      )
    ).toEqual({
      eventName: "portfolio_click",
      targetPath: "/portofolio/aplikasi-kasir#galeri",
    });
  });

  it("ignores external, unrelated, and unsafe links", () => {
    expect(
      classifyContentClick("https://evil.example/layanan/web-development", origin)
    ).toBeNull();
    expect(classifyContentClick("/blog/artikel", origin)).toBeNull();
    expect(classifyContentClick("/layanan-lain", origin)).toBeNull();
    expect(classifyContentClick("javascript:alert(1)", origin)).toBeNull();
    expect(classifyContentClick("", origin)).toBeNull();
  });
});

describe("isAllowedAnalyticsOrigin", () => {
  const allowedOrigins = ["https://nextkarya.web.id"];

  it("accepts the configured origin", () => {
    expect(
      isAllowedAnalyticsOrigin({
        origin: "https://nextkarya.web.id",
        host: "nextkarya.web.id",
        allowedOrigins,
      })
    ).toBe(true);
  });

  it("rejects an unregistered origin", () => {
    expect(
      isAllowedAnalyticsOrigin({
        origin: "https://evil.example",
        host: "nextkarya.web.id",
        allowedOrigins,
      })
    ).toBe(false);
  });

  it("validates the referer when origin is missing", () => {
    expect(
      isAllowedAnalyticsOrigin({
        referer: "https://nextkarya.web.id/portofolio",
        host: "nextkarya.web.id",
        allowedOrigins,
      })
    ).toBe(true);
  });

  it("allows mobile webviews that send neither header", () => {
    expect(
      isAllowedAnalyticsOrigin({
        host: "nextkarya.web.id",
        allowedOrigins,
      })
    ).toBe(true);
  });
});
