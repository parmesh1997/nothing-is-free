import { AbsoluteFill } from "remotion";
import { FIELD } from "../tokens";

/**
 * Vignette — a soft corner darkening on the locked paper field (§2.3).
 *
 * Concentrated in the CORNERS (creator note 2026-09-02): clear through the middle,
 * darkening toward each corner so the frame has weight at the edges. Part of the
 * locked background plane, static.
 */
export const Vignette: React.FC = () => {
  const { color, opacity, outerFraction } = FIELD.vignette;
  const innerStop = Math.round((1 - outerFraction) * 100);
  const mid = Math.round(innerStop + (100 - innerStop) * 0.55);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse ${Math.round(outerFraction * 130)}% ${Math.round(
          outerFraction * 130,
        )}% at 50% 50%, rgba(0,0,0,0) ${innerStop}%, ${hexA(color, opacity * 0.4)} ${mid}%, ${hexA(
          color,
          opacity,
        )} 100%)`,
      }}
    />
  );
};

const hexA = (hex: string, alpha: number): string => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};
