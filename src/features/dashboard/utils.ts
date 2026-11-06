export function formatDurationShort(totalSeconds: number): string {
  const value = Number.isFinite(totalSeconds) ? totalSeconds : 0;
  const safe = Math.max(0, Math.round(value));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}
