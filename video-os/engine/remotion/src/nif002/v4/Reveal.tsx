import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR } from "../../tokens";
import { EASE, springIn } from "../../parts/motion";
import { SANS } from "./fonts4";
import { dropShadow } from "./light";

/**
 * Reveal.tsx — the v4 "bit by bit" builders (creator, 2026-09-03, from the
 * insiderforce clone + the Danny Why kinetic reference: "whatever the tech it
 * is getting, bit by bit — that is good").
 *
 *   <DrawPath>     an SVG path that draws on left→right (stroke-dashoffset)
 *   <StaggerList>  list rows that fall in one at a time with a bullet
 *   <EndpointTag>  a glowing dot + a chunky label pill that pops (draw-on data)
 *   <LabelPill>    the standalone Bebas-caps-on-solid pill ("4-6 DAYS TO EDIT")
 */

export const DrawPath: React.FC<{
  d: string;
  at: number;
  dur?: number;
  stroke?: string;
  width?: number;
  dash?: boolean;
  /** total path length; measured if omitted is not possible in SSR, so pass it. */
  length: number;
  style?: React.CSSProperties;
}> = ({ d, at, dur = 24, stroke = COLOR.ink, width = 4, dash = false, length, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash ? `${width * 2} ${width * 3}` : length}
      strokeDashoffset={dash ? 0 : length * (1 - t)}
      style={style}
    />
  );
};

export const StaggerList: React.FC<{
  items: React.ReactNode[];
  at: number;
  gap?: number;
  rowGap?: number;
  size?: number;
  color?: string;
  bullet?: string;
  x?: number;
  y?: number;
}> = ({ items, at, gap = 6, rowGap = 22, size = 34, color = COLOR.ink, bullet = "◆", x = 0, y = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: "column", gap: rowGap }}>
      {items.map((it, i) => {
        const rowAt = at + i * gap;
        const p = Math.min(1, springIn({ frame, fps, delay: rowAt, durationInFrames: 16 }));
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              fontFamily: SANS,
              fontSize: size,
              letterSpacing: "0.01em",
              color,
              opacity: p,
              translate: `${(1 - p) * -18}px 0px`,
              filter: dropShadow("floating", size / 130, 0.14),
            }}
          >
            <span style={{ color: COLOR.orange, fontSize: size * 0.6 }}>{bullet}</span>
            <span>{it}</span>
          </div>
        );
      })}
    </div>
  );
};

export const LabelPill: React.FC<{
  children: React.ReactNode;
  at: number;
  x: number;
  y: number;
  bg?: string;
  fg?: string;
  size?: number;
  rotate?: number;
}> = ({ children, at, x, y, bg = COLOR.ink, fg = COLOR.cardWhite, size = 40, rotate = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn({ frame, fps, delay: at, durationInFrames: 18 });
  const c = Math.min(1, p);
  const pop = interpolate(frame, [at, at + 7, at + 18], [0.8, 1.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${pop})`,
        opacity: c,
        fontFamily: SANS,
        fontSize: size,
        letterSpacing: "0.04em",
        color: fg,
        background: bg,
        padding: `${size * 0.28}px ${size * 0.6}px ${size * 0.16}px`,
        borderRadius: size * 0.34,
        whiteSpace: "nowrap",
        filter: dropShadow("raised", size / 40, 0.28),
      }}
    >
      {children}
    </div>
  );
};

export const EndpointTag: React.FC<{
  x: number;
  y: number;
  at: number;
  label: string;
  dotColor?: string;
  bg?: string;
  fg?: string;
  size?: number;
}> = ({ x, y, at, label, dotColor = COLOR.orange, bg = COLOR.orange, fg = COLOR.cardWhite, size = 34 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dotP = Math.min(1, springIn({ frame, fps, delay: at, durationInFrames: 12 }));
  const tagP = Math.min(1, springIn({ frame, fps, delay: at + 4, durationInFrames: 16 }));
  const glow = interpolate(frame, [at, at + 10, at + 30], [0, 1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {/* glow halo */}
      <div
        style={{
          position: "absolute",
          left: -26,
          top: -26,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: `radial-gradient(50% 50% at 50% 50%, ${dotColor} 0%, rgba(226,77,40,0) 70%)`,
          opacity: 0.5 * glow,
        }}
      />
      <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: "50%", background: dotColor, scale: String(dotP), filter: dropShadow("raised", 0.5, 0.3) }} />
      <div
        style={{
          position: "absolute",
          left: 18,
          top: -size * 0.9,
          fontFamily: SANS,
          fontSize: size,
          letterSpacing: "0.04em",
          color: fg,
          background: bg,
          padding: `${size * 0.24}px ${size * 0.5}px ${size * 0.12}px`,
          borderRadius: size * 0.3,
          whiteSpace: "nowrap",
          opacity: tagP,
          translate: `${(1 - tagP) * -14}px 0px`,
          filter: dropShadow("raised", size / 36, 0.26),
        }}
      >
        {label}
      </div>
    </div>
  );
};
