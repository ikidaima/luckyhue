import { getDefaultStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

const storageKey = (name: string) => `luckyhue.v1.${name}`;

/** Initial values shared by `atomWithStorage` defaults and factory reset */
export const MIN_REFRESH_INTERVAL_MS = 1000;
export const FACTORY_INTERVAL_MS = 30000;
export const FACTORY_FONT_SIZE = 60;

export const intervalOfUpdate = atomWithStorage(
  storageKey("intervalOfUpdate"),
  FACTORY_INTERVAL_MS,
);

export const fontSizeAtom = atomWithStorage(
  storageKey("fontSize"),
  FACTORY_FONT_SIZE,
);

export type RandomBounds = { min: number; max: number };

export type ValueRangeConfig = {
  id: string;
  min: number;
  max: number;
  /** CSS color, e.g. #rrggbb */
  color: string;
};

export const DEFAULT_RANDOM_BOUNDS: RandomBounds = { min: 1, max: 100 };

export const DEFAULT_VALUE_RANGES: ValueRangeConfig[] = [
  { id: "range-blue", min: 1, max: 25, color: "#60a5fa" },
  { id: "range-yellow", min: 26, max: 75, color: "#facc15" },
  { id: "range-pink", min: 76, max: 100, color: "#f472b6" },
];

export const randomBoundsAtom = atomWithStorage<RandomBounds>(
  storageKey("randomBounds"),
  { ...DEFAULT_RANDOM_BOUNDS },
);

export const valueRangesAtom = atomWithStorage<ValueRangeConfig[]>(
  storageKey("valueRanges"),
  DEFAULT_VALUE_RANGES.map((r) => ({ ...r })),
);

export function resetSettingsToFactoryDefaults(): void {
  const store = getDefaultStore();
  store.set(intervalOfUpdate, FACTORY_INTERVAL_MS);
  store.set(fontSizeAtom, FACTORY_FONT_SIZE);
  store.set(randomBoundsAtom, { ...DEFAULT_RANDOM_BOUNDS });
  store.set(
    valueRangesAtom,
    DEFAULT_VALUE_RANGES.map((r) => ({ ...r })),
  );
}
