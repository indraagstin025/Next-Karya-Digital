import { describe, expect, it } from "vitest";
import {
  cleanText,
  parsePublicSlug,
  sanitizeInternalHref,
  validateRedirectTarget,
} from "./public-validators";

describe("parsePublicSlug", () => {
  it("normalizes a readable slug", () => {
    expect(parsePublicSlug("Beranda-Kita")).toBe("beranda-kita");
  });

  it("rejects path traversal and unsafe characters", () => {
    expect(parsePublicSlug("../admin")).toBeNull();
    expect(parsePublicSlug("hello%2Fworld")).toBeNull();
    expect(parsePublicSlug(42)).toBeNull();
  });
});

describe("validateRedirectTarget", () => {
  it("accepts same-site public paths", () => {
    expect(validateRedirectTarget("/layanan", 301)).toEqual({
      to: "/layanan",
      status: 301,
    });
  });

  it("rejects external URLs, protocol-relative paths, and private areas", () => {
    expect(validateRedirectTarget("https://evil.example", 301)).toBeNull();
    expect(validateRedirectTarget("//evil.example", 301)).toBeNull();
    expect(validateRedirectTarget("/admin", 301)).toBeNull();
    expect(validateRedirectTarget("/api/v1/health", 302)).toBeNull();
    expect(validateRedirectTarget("/aman", 200)).toBeNull();
  });
});

describe("sanitizeInternalHref", () => {
  it("keeps safe anchors and falls back on unsafe input", () => {
    expect(sanitizeInternalHref("/layanan#paket-layanan")).toBe("/layanan#paket-layanan");
    expect(sanitizeInternalHref("/admin")).toBe("/kontak");
    expect(sanitizeInternalHref("https://evil.example")).toBe("/kontak");
  });
});

describe("cleanText", () => {
  it("strips control characters and enforces the maximum length", () => {
    expect(cleanText("  halo\u0000 dunia  ", 20)).toBe("halo  dunia");
    expect(cleanText("abcdef", 3)).toBe("abc");
    expect(cleanText(null, 10)).toBe("");
  });
});
