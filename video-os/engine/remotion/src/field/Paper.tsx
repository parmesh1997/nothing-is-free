import { interpolate } from "remotion";
import { COLOR, DARK_LAW } from "../tokens";

/**
 * Paper — the locked field base (§2.3).
 * "flat, unbroken, full-bleed, every frame."
 *
 * The background is locked across the entire episode. It never changes and never
 * cuts (§2.1). The only permitted change is the Dark Law crossfade to ink (§2.9),
 * driven here by `darkLawProgress` (0 = paper, 1 = full ink).
 *
 * A PLAIN <div>, deliberately not <AbsoluteFill> / <Sequence> — Remotion Studio's
 * visual timeline editor writes `from` / `durationInFrames` props back onto
 * components it can identify, and any such prop here truncated the paper mid-beat
 * (2026-09-02 bug). A bare div is invisible to that editor.
 */
export const Paper: React.FC<{ darkLawProgress?: number }> = ({
  darkLawProgress = 0,
}) => {
  const backgroundColor =
    darkLawProgress <= 0
      ? COLOR.paper
      : interpolateColor(COLOR.paper, DARK_LAW.field, darkLawProgress);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        backgroundColor,
      }}
    />
  );
};

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Linear RGB lerp — fine for the paper→ink crossfade (both are near-neutral). */
const interpolateColor = (from: string, to: string, t: number): string => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const ch = (i: number) => Math.round(interpolate(t, [0, 1], [a[i], b[i]]));
  return `rgb(${ch(0)}, ${ch(1)}, ${ch(2)})`;
};
