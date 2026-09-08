import { useCurrentFrame } from "remotion";
import { COLOR, TYPE } from "../tokens";
import { countUp } from "./motion";

type Format = (n: number) => string;

/**
 * CountUp — TIER 3 (§4.1). "A number counting": interpolate + Easing.out(cubic).
 * Renders in the big-number type (Inter 700) — the "$12" / "$9.00" read.
 */
export const CountUp: React.FC<{
  from?: number;
  to: number;
  start: number;
  /** Frame the number finishes on — line this up with the beat's peak. */
  end: number;
  format?: Format;
  /** Size in px. */
  size?: number;
  /** Highlight this value in orange — the one accent per frame (§2.4). */
  accent?: boolean;
  style?: React.CSSProperties;
}> = ({
  from = 0,
  to,
  start,
  end,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  size = 140,
  accent = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const value = countUp(frame, from, to, start, end);

  return (
    <span
      style={{
        ...TYPE.number,
        fontSize: size,
        color: accent ? COLOR.orange : TYPE.number.color,
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {format(value)}
    </span>
  );
};

/** Common formatters. */
export const fmt = {
  usd: (n: number) => `$${(Math.round(n) / 1_000_000).toFixed(1)}M`,
  usdFull: (n: number) => `$${Math.round(n).toLocaleString("en-US")}`,
  pct: (n: number) => `${Math.round(n)}%`,
  inr: (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`,
  x: (n: number) => `${n.toFixed(1)}×`,
} satisfies Record<string, Format>;
