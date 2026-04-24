import { useEffect, useRef, useState } from "react";
import { getColorForValue, getRandomValue } from "../utils";
import { Box } from "@mui/material";
import { getDefaultStore, useAtomValue } from "jotai";
import {
  fontSizeAtom,
  intervalOfUpdate,
  MIN_REFRESH_INTERVAL_MS,
  randomBoundsAtom,
  valueRangesAtom,
} from "../settings";

function initialDisplay() {
  const store = getDefaultStore();
  const bounds = store.get(randomBoundsAtom);
  const ranges = store.get(valueRangesAtom);
  const v = getRandomValue(bounds);
  return { value: v, color: getColorForValue(v, ranges) };
}

type Props = {
  onReload: () => void;
};

export const Content = ({ onReload }: Props) => {
  const [{ value, color }, setDisplay] = useState(initialDisplay);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fontSize = useAtomValue(fontSizeAtom);
  const bounds = useAtomValue(randomBoundsAtom);
  const ranges = useAtomValue(valueRangesAtom);
  const tickMs = useAtomValue(intervalOfUpdate);
  const intervalMs = Math.max(MIN_REFRESH_INTERVAL_MS, tickMs);

  useEffect(() => {
    timer.current = setInterval(() => {
      const newValue = getRandomValue(bounds);
      setDisplay({
        value: newValue,
        color: getColorForValue(newValue, ranges),
      });
    }, intervalMs);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [bounds, ranges, intervalMs]);

  return (
    <Box
      sx={{
        fontSize: `clamp(10dvh, min(${fontSize}vw, ${fontSize}dvh), 100dvh)`,
        color,
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onClick={onReload}
      className="value"
    >
      {value}
    </Box>
  );
};
