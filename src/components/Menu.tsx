import {
  Box,
  Button,
  Dialog,
  IconButton,
  Slide,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import { forwardRef, useState } from "react";

import { TransitionProps } from "@mui/material/transitions";
import { useAtom } from "jotai";
import {
  fontSizeAtom,
  intervalOfUpdate,
  randomBoundsAtom,
  resetSettingsToFactoryDefaults,
  valueRangesAtom,
  type ValueRangeConfig,
} from "../settings";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type MenuProps = {
  onReload: () => void;
};

/** Outlined TextField on dark settings background */
const SETTINGS_TEXT_FIELD_SX = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.35)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.55)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.65)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },
} as const;

export const Menu = ({ onReload }: MenuProps) => {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const [intervalMs, setIntervalMs] = useAtom(intervalOfUpdate);
  const [bounds, setBounds] = useAtom(randomBoundsAtom);
  const [ranges, setRanges] = useAtom(valueRangesAtom);

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSliderChange = (_: Event, value: number) => {
    setFontSize(value);
  };

  const handleRefreshIntervalSeconds = (raw: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      return;
    }
    const seconds = Math.max(1, Math.round(n));
    setIntervalMs(seconds * 1000);
  };

  const setBound = (key: "min" | "max", raw: string) => {
    const n = Number(raw);
    if (Number.isFinite(n)) {
      setBounds((b) => ({ ...b, [key]: Math.round(n) }));
    }
  };

  const updateRange = (
    id: string,
    patch: Partial<Pick<ValueRangeConfig, "min" | "max" | "color">>,
  ) => {
    setRanges((list) =>
      list.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  };

  const updateRangeNumber = (
    id: string,
    key: "min" | "max",
    raw: string,
  ) => {
    const n = Number(raw);
    if (Number.isFinite(n)) {
      updateRange(id, { [key]: Math.round(n) });
    }
  };

  const addRange = () => {
    setRanges((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        min: bounds.min,
        max: bounds.max,
        color: "#94a3b8",
      },
    ]);
  };

  const removeRange = (id: string) => {
    setRanges((list) => list.filter((r) => r.id !== id));
  };

  const handleFactoryReset = () => {
    resetSettingsToFactoryDefaults();
    onReload();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          position: "absolute",
          right: "10px",
          top: "10px",
        }}
      >
        <IconButton
          sx={{ color: "white", "mix-blend-mode": "difference" }}
          onClick={handleClick}
        >
          <SettingsIcon />
        </IconButton>
      </Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{
          transition: Transition,
        }}
      >
        <Box
          sx={{
            position: "relative",
            backgroundColor: "#111827",
            width: "100%",
            height: "100%",
            padding: "16px",
            overflow: "auto",
            color: "white",
          }}
        >
          <IconButton
            sx={{
              color: "white",
              "mix-blend-mode": "difference",
              position: "absolute",
              top: "16px",
              right: "16px",
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" color="info">
            Settings
          </Typography>

          <Stack spacing={3} sx={{ marginTop: "24px", maxWidth: 560 }}>
            <Box className="menu_list_item">
              <Box className="menu_list_item_description">Font Size</Box>
              <Slider
                sx={{ width: "clamp(200px, 70%, 500px)" }}
                value={fontSize}
                step={10}
                min={10}
                max={100}
                marks
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <Typography color="grey.300" sx={{ mb: 1 }}>
                Refresh Interval (s)
              </Typography>
              <TextField
                label="Seconds"
                type="number"
                size="small"
                value={intervalMs / 1000}
                onChange={(e) =>
                  handleRefreshIntervalSeconds(e.target.value)
                }
                sx={{ ...SETTINGS_TEXT_FIELD_SX, width: 140 }}
                slotProps={{
                  htmlInput: {
                    "aria-label": "Refresh interval in seconds",
                    min: 1,
                    step: 1,
                  },
                }}
              />
            </Box>

            <Box>
              <Typography color="grey.300" sx={{ mb: 1 }}>
                Random number bounds
              </Typography>
              <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                <TextField
                  label="Min"
                  type="number"
                  size="small"
                  value={bounds.min}
                  onChange={(e) => setBound("min", e.target.value)}
                  sx={SETTINGS_TEXT_FIELD_SX}
                  slotProps={{
                    htmlInput: { "aria-label": "Random minimum" },
                  }}
                />
                <TextField
                  label="Max"
                  type="number"
                  size="small"
                  value={bounds.max}
                  onChange={(e) => setBound("max", e.target.value)}
                  sx={SETTINGS_TEXT_FIELD_SX}
                  slotProps={{
                    htmlInput: { "aria-label": "Random maximum" },
                  }}
                />
              </Stack>
            </Box>

            <Box>
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography color="grey.300">Color ranges</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addRange}
                >
                  Add range
                </Button>
              </Stack>
              <Typography
                variant="caption"
                color="grey.500"
                sx={{ display: "block", mb: 1 }}
              >
                First matching range wins. Values outside all ranges use a neutral gray.
              </Typography>
              <Stack spacing={2}>
                {ranges.map((r) => (
                  <Stack
                    key={r.id}
                    direction="row"
                    spacing={1}
                    sx={{ flexWrap: "wrap", alignItems: "center" }}
                  >
                    <TextField
                      label="From"
                      type="number"
                      size="small"
                      value={r.min}
                      onChange={(e) =>
                        updateRangeNumber(r.id, "min", e.target.value)
                      }
                      sx={{ ...SETTINGS_TEXT_FIELD_SX, width: 100 }}
                    />
                    <TextField
                      label="To"
                      type="number"
                      size="small"
                      value={r.max}
                      onChange={(e) =>
                        updateRangeNumber(r.id, "max", e.target.value)
                      }
                      sx={{ ...SETTINGS_TEXT_FIELD_SX, width: 100 }}
                    />
                    <TextField
                      type="color"
                      size="small"
                      value={r.color}
                      onChange={(e) =>
                        updateRange(r.id, { color: e.target.value })
                      }
                      sx={{
                        ...SETTINGS_TEXT_FIELD_SX,
                        width: 72,
                        "& .MuiOutlinedInput-input": {
                          py: 0.5,
                          height: 28,
                          cursor: "pointer",
                        },
                      }}
                      slotProps={{
                        htmlInput: { "aria-label": "Range color" },
                      }}
                    />
                    <IconButton
                      aria-label="Remove range"
                      onClick={() => removeRange(r.id)}
                      sx={{ color: "grey.400" }}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Box sx={{ pt: 1 }}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RestoreOutlinedIcon />}
                onClick={handleFactoryReset}
              >
                Reset to factory defaults
              </Button>
            </Box>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
};
