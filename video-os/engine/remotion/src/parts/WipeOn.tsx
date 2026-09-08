import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "./motion";

/**
 * WipeOn — motion #2 from the sheet. A directional clip-reveal, like a brush
 * stroke uncovering the element. Pair with a subtle slide for weight.
 */
export const WipeOn: React.FC<{
  start: number;
  durationInFrames?: number;
  from?: "left" | "right" | "up" | "down";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ start, durationInFrames = 16, from = "left", style, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const hidden = (1 - t) * 100;
  const clip =
    from === "left"
      ? `inset(0 ${hidden}% 0 0)`
      : from === "right"
        ? `inset(0 0 0 ${hidden}%)`
        : from === "up"
          ? `inset(0 0 ${hidden}% 0)`
          : `inset(${hidden}% 0 0 0)`;
  const slide = 12 * (1 - t);
  const tx = from === "left" ? -slide : from === "right" ? slide : 0;
  const ty = from === "up" ? -slide : from === "down" ? slide : 0;

  return (
    <div style={{ clipPath: clip, translate: `${tx}px ${ty}px`, ...style }}>
      {children}
    </div>
  );
};

/**
 * ScaleUp — motion #4. Grows from a smaller scale into place with a soft spring
 * feel (perceptual scale). Good for a value or an object arriving with emphasis.
 */
export const ScaleUp: React.FC<{
  start: number;
  durationInFrames?: number;
  from?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ start, durationInFrames = 18, from = 0.7, style, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  // slight overshoot
  const s = from + (1 - from) * t + Math.sin(t * Math.PI) * 0.04;
  return <div style={{ scale: s, opacity: Math.min(1, t * 2), ...style }}>{children}</div>;
};
