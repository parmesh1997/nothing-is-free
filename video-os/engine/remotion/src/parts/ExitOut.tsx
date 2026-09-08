import { useCurrentFrame } from "remotion";
import { exitOut } from "./motion";

/**
 * ExitOut — TIER 3. "Anything leaving" (§4.1): interpolate + Easing.in(cubic).
 * Fade + a small drift in the leaving direction. Do not destroy elements when
 * moving to the next beat unless they truly exit the world (§3.6) — often the
 * camera should just move on instead.
 */
export const ExitOut: React.FC<{
  start: number;
  end: number;
  /** px of drift as it leaves. */
  drift?: { x?: number; y?: number };
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ start, end, drift = { y: -24 }, style, children }) => {
  const frame = useCurrentFrame();
  const p = exitOut(frame, start, end); // 1 → 0

  return (
    <div
      style={{
        opacity: p,
        translate: `${(drift.x ?? 0) * (1 - p)}px ${(drift.y ?? 0) * (1 - p)}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
