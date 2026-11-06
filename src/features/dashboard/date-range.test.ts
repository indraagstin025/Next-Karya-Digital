import { describe, expect, it } from "vitest";
import {
  MAX_CUSTOM_RANGE_DAYS,
  countRangeDays,
  formatDateInJakarta,
  formatRangeLabel,
  resolveDateRange,
  resolvePresetDateRange,
  validateCustomRange,
} from "./date-range";

const NOW = new Date("2026-11-06T05:00:00.000Z");

describe("formatDateInJakarta", () => {
  it("uses the Jakarta calendar day instead of UTC", () => {
    expect(formatDateInJakarta(new Date("2026-11-06T17:30:00.000Z"))).toBe(
      "2026-11-07"
    );
  });
});

describe("resolvePresetDateRange", () => {
  it("returns the current Jakarta day for today", () => {
    expect(resolvePresetDateRange("today", NOW)).toEqual({
      from: "2026-11-06",
      to: "2026-11-06",
    });
  });

  it("includes today in the 7-day and 30-day windows", () => {
    expect(resolvePresetDateRange("7d", NOW)).toEqual({
      from: "2026-10-31",
      to: "2026-11-06",
    });
    expect(resolvePresetDateRange("30d", NOW)).toEqual({
      from: "2026-10-08",
      to: "2026-11-06",
    });
  });
});

describe("countRangeDays", () => {
  it("counts both endpoints", () => {
    expect(countRangeDays("2026-11-01", "2026-11-06")).toBe(6);
    expect(countRangeDays("2026-11-06", "2026-11-06")).toBe(1);
  });

  it("rejects reversed or invalid ranges", () => {
    expect(countRangeDays("2026-11-07", "2026-11-06")).toBeNull();
    expect(countRangeDays("2026-02-30", "2026-03-01")).toBeNull();
  });
});

describe("validateCustomRange", () => {
  it("accepts a normal range", () => {
    expect(
      validateCustomRange(
        { from: "2026-10-01", to: "2026-10-31" },
        "2026-11-06"
      )
    ).toBeNull();
  });

  it("rejects reversed dates", () => {
    expect(
      validateCustomRange(
        { from: "2026-11-07", to: "2026-11-06" },
        "2026-11-06"
      )
    ).toBe("Tanggal awal tidak boleh melewati tanggal akhir.");
  });

  it("rejects a future end date", () => {
    expect(
      validateCustomRange(
        { from: "2026-11-01", to: "2026-11-07" },
        "2026-11-06"
      )
    ).toBe("Tanggal akhir tidak boleh melewati hari ini.");
  });

  it("rejects a range longer than the maximum", () => {
    const from = "2024-01-01";
    const to = "2026-01-02";
    expect(countRangeDays(from, to)).toBeGreaterThan(MAX_CUSTOM_RANGE_DAYS);
    expect(validateCustomRange({ from, to }, "2026-11-06")).toBe(
      `Rentang maksimal ${MAX_CUSTOM_RANGE_DAYS} hari.`
    );
  });

  it("rejects incomplete or impossible dates", () => {
    expect(
      validateCustomRange({ from: "", to: "2026-11-06" }, "2026-11-06")
    ).toBe("Tanggal awal dan akhir wajib diisi.");
    expect(
      validateCustomRange(
        { from: "2026-02-30", to: "2026-03-01" },
        "2026-11-06"
      )
    ).toBe("Tanggal awal dan akhir wajib diisi.");
  });
});

describe("resolveDateRange", () => {
  it("keeps a valid custom range", () => {
    expect(
      resolveDateRange(
        "custom",
        { from: "2026-09-01", to: "2026-09-30" },
        NOW
      )
    ).toEqual({ from: "2026-09-01", to: "2026-09-30" });
  });

  it("falls back to 30 days when the custom range is invalid", () => {
    expect(
      resolveDateRange(
        "custom",
        { from: "2026-11-07", to: "2026-11-06" },
        NOW
      )
    ).toEqual({ from: "2026-10-08", to: "2026-11-06" });
  });
});

describe("formatRangeLabel", () => {
  it("shows a compact same-year label", () => {
    expect(
      formatRangeLabel({ from: "2026-11-06", to: "2026-11-08" })
    ).toContain("Nov");
  });

  it("includes years when the range crosses a year boundary", () => {
    const label = formatRangeLabel({
      from: "2025-12-20",
      to: "2026-01-05",
    });

    expect(label).toContain("2025");
    expect(label).toContain("2026");
  });
});
