export const JAKARTA_TIME_ZONE = "Asia/Jakarta";
export const MAX_CUSTOM_RANGE_DAYS = 366;
export const RAW_EVENT_RETENTION_DAYS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type PeriodFilter = "today" | "7d" | "30d" | "custom";

export interface AnalyticsDateRange {
  from: string;
  to: string;
}

const jakartaDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: JAKARTA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const rangeLabelFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

/**
 * Returns the Jakarta calendar date (YYYY-MM-DD) for a timestamp.
 */
export function formatDateInJakarta(date: Date): string {
  const parts = jakartaDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return date.toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

export function getJakartaToday(now: Date = new Date()): string {
  return formatDateInJakarta(now);
}

function parseDateKey(value: string): number | null {
  if (!DATE_KEY_PATTERN.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return timestamp;
}

export function countRangeDays(from: string, to: string): number | null {
  const fromTime = parseDateKey(from);
  const toTime = parseDateKey(to);

  if (fromTime === null || toTime === null || fromTime > toTime) {
    return null;
  }

  return Math.round((toTime - fromTime) / DAY_MS) + 1;
}

export function validateCustomRange(
  range: AnalyticsDateRange,
  todayKey: string = getJakartaToday()
): string | null {
  const fromTime = parseDateKey(range.from);
  const toTime = parseDateKey(range.to);

  if (fromTime === null || toTime === null) {
    return "Tanggal awal dan akhir wajib diisi.";
  }

  if (fromTime > toTime) {
    return "Tanggal awal tidak boleh melewati tanggal akhir.";
  }

  const todayTime = parseDateKey(todayKey);
  if (todayTime !== null && toTime > todayTime) {
    return "Tanggal akhir tidak boleh melewati hari ini.";
  }

  const days = countRangeDays(range.from, range.to);
  if (days !== null && days > MAX_CUSTOM_RANGE_DAYS) {
    return `Rentang maksimal ${MAX_CUSTOM_RANGE_DAYS} hari.`;
  }

  return null;
}

export function resolvePresetDateRange(
  period: Exclude<PeriodFilter, "custom">,
  now: Date = new Date()
): AnalyticsDateRange {
  const daysBack = period === "today" ? 0 : period === "7d" ? 6 : 29;

  return {
    from: formatDateInJakarta(new Date(now.getTime() - daysBack * DAY_MS)),
    to: formatDateInJakarta(now),
  };
}

export function defaultCustomRange(now: Date = new Date()): AnalyticsDateRange {
  return resolvePresetDateRange("30d", now);
}

export function resolveDateRange(
  period: PeriodFilter,
  customRange?: AnalyticsDateRange | null,
  now: Date = new Date()
): AnalyticsDateRange {
  if (
    period === "custom" &&
    customRange &&
    validateCustomRange(customRange, getJakartaToday(now)) === null
  ) {
    return customRange;
  }

  return resolvePresetDateRange(period === "custom" ? "30d" : period, now);
}

function dateKeyToLocalDate(value: string): Date | null {
  if (!DATE_KEY_PATTERN.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function formatRangeLabel(range: AnalyticsDateRange): string {
  const from = dateKeyToLocalDate(range.from);
  const to = dateKeyToLocalDate(range.to);

  if (!from || !to) return "Kustom";
  if (range.from === range.to) return rangeLabelFormatter.format(to);

  const sameYear = from.getFullYear() === to.getFullYear();
  const fromLabel = sameYear
    ? rangeLabelFormatter.format(from)
    : `${rangeLabelFormatter.format(from)} ${from.getFullYear()}`;
  const toLabel = sameYear
    ? rangeLabelFormatter.format(to)
    : `${rangeLabelFormatter.format(to)} ${to.getFullYear()}`;

  return `${fromLabel} - ${toLabel}`;
}
