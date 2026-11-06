export function formatDurationShort(totalSeconds: number): string {
  const value = Number.isFinite(totalSeconds) ? totalSeconds : 0;
  const safe = Math.max(0, Math.round(value));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

export function formatHourLabel(hour: number): string {
  const value = Number.isFinite(hour) ? hour : 0;
  const safe = Math.min(Math.max(Math.trunc(value), 0), 23);

  return `${String(safe).padStart(2, "0")}:00`;
}
