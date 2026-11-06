import { describe, expect, it } from "vitest";
import { formatDurationShort, formatHourLabel } from "./utils";

describe("formatDurationShort", () => {
  it("formats sub-minute durations in seconds", () => {
    expect(formatDurationShort(0)).toBe("0s");
    expect(formatDurationShort(45)).toBe("45s");
  });

  it("formats longer durations in minutes and seconds", () => {
    expect(formatDurationShort(125)).toBe("2m 5s");
    expect(formatDurationShort(3600)).toBe("60m 0s");
  });

  it("never renders negative or invalid values", () => {
    expect(formatDurationShort(-10)).toBe("0s");
    expect(formatDurationShort(Number.NaN)).toBe("0s");
  });
});

describe("formatHourLabel", () => {
  it("formats every hour as a 24-hour label", () => {
    expect(formatHourLabel(0)).toBe("00:00");
    expect(formatHourLabel(9)).toBe("09:00");
    expect(formatHourLabel(23)).toBe("23:00");
  });

  it("clamps invalid values instead of rendering a broken axis", () => {
    expect(formatHourLabel(-1)).toBe("00:00");
    expect(formatHourLabel(24)).toBe("23:00");
    expect(formatHourLabel(Number.NaN)).toBe("00:00");
  });
});
