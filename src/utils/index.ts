import type { RandomBounds, ValueRangeConfig } from "../settings";

export function getRandomValue(bounds: RandomBounds): number {
  const lo = Math.min(bounds.min, bounds.max);
  const hi = Math.max(bounds.min, bounds.max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

const FALLBACK_COLOR = "#e5e7eb";

export function getColorForValue(
  value: number,
  ranges: ValueRangeConfig[],
): string {
  for (const r of ranges) {
    const lo = Math.min(r.min, r.max);
    const hi = Math.max(r.min, r.max);
    if (value >= lo && value <= hi) {
      return r.color;
    }
  }
  return FALLBACK_COLOR;
}
