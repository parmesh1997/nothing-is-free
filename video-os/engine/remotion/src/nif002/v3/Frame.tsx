import { AbsoluteFill } from "remotion";
import { HEIGHT, PROGRESS_RULE, SPACE, TYPE, WIDTH, COLOR } from "../../tokens";
import { V3 } from "./palette";

/**
 * V3Frame — replaces LockedField for v3 beats (2026-09-03 pivot).
 *
 * The cream paper is gone as a ground; the SET fills the frame. This wrapper is
 * the Vox "cut-out" furniture that sits on top of everything:
 *   · a hand-torn paper edge along the TOP and BOTTOM (a strip of warm paper with
 *     a ragged inner edge and a soft inward shadow)
 *   · film-sprocket strips down the LEFT and RIGHT
 *   · an edge vignette + corner grain so the middle stays clean
 *   · the episode progress rule + the source tag (unchanged furniture)
 *
 * A beat renders <V3Frame source=…> { set + elements }.
 */

const tornPath = (side: "top" | "bottom", w: number, band: number, seed: number) => {
  // a ragged horizontal edge; `band` px of solid paper from the frame edge
  const step = 46;
  const n = Math.ceil(w / step) + 2;
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >>> 8) / 0x7fffff;
  };
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = i * step;
    const jag = band * (0.42 + rnd() * 0.6);
    const y = side === "top" ? jag : band - jag;
    pts.push(`${x} ${y.toFixed(1)}`);
  }
  if (side === "top") {
    return `M -10 -10 L ${w + 10} -10 L ${w + 10} ${pts[pts.length - 1].split(" ")[1]} ` +
      pts.slice().reverse().map((p, i) => (i === 0 ? "" : `L ${p}`)).join(" ") +
      ` L -10 ${pts[0].split(" ")[1]} Z`;
  }
  return `M -10 ${band + 10} L ${w + 10} ${band + 10} L ${w + 10} ${pts[pts.length - 1].split(" ")[1]} ` +
    pts.slice().reverse().map((p, i) => (i === 0 ? "" : `L ${p}`)).join(" ") +
    ` L -10 ${pts[0].split(" ")[1]} Z`;
};

export const V3Frame: React.FC<{
  source?: React.ReactNode;
  progress: number;
  /** Skip the torn edges + sprockets (e.g. a full-bleed hero moment). */
  bare?: boolean;
  children?: React.ReactNode;
}> = ({ source, progress, bare = false, children }) => {
  const band = 74;
  const spr = 30; // sprocket column width

  return (
    <AbsoluteFill
      style={{
        backgroundColor: V3.base,
        overflow: "hidden",
        scale: 1.001,
      }}
    >
      {/* the set + the beat */}
      <AbsoluteFill>{children}</AbsoluteFill>

      {!bare && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <filter id="v3-edge-sh" x="-20%" y="-40%" width="140%" height="200%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.22" />
              </filter>
              <radialGradient id="v3-vig" cx="50%" cy="50%" r="72%">
                <stop offset="0%" stopColor="#000" stopOpacity="0" />
                <stop offset="62%" stopColor="#000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.32" />
              </radialGradient>
            </defs>

            {/* torn paper — top */}
            <g filter="url(#v3-edge-sh)">
              <path d={tornPath("top", WIDTH, band, 7)} fill={COLOR.stickerEdge} />
            </g>
            {/* torn paper — bottom */}
            <g transform={`translate(0 ${HEIGHT - band})`} filter="url(#v3-edge-sh)">
              <path d={tornPath("bottom", WIDTH, band, 41)} fill={COLOR.stickerEdge} />
            </g>

            {/* film-sprocket strips */}
            {([0, WIDTH - spr] as const).map((x, ci) => (
              <g key={ci}>
                <rect x={x} y={0} width={spr} height={HEIGHT} fill={V3.ink} />
                {Array.from({ length: Math.ceil(HEIGHT / 54) }).map((_, i) => (
                  <rect key={i} x={x + spr * 0.28} y={i * 54 + 16} width={spr * 0.44} height={26} rx={4} fill={V3.paperLight} opacity={0.9} />
                ))}
              </g>
            ))}

            {/* edge vignette */}
            <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="url(#v3-vig)" />

            {/* film-strip grain: fine speckle concentrated near the edges */}
            <g opacity={0.5} style={{ mixBlendMode: "overlay" }}>
              {Array.from({ length: 220 }).map((_, i) => {
                let s = (i * 2654435761) & 0x7fffffff;
                const r = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) >>> 8) / 0x7fffff;
                const edge = r();
                // bias toward the frame edges
                const gx = edge < 0.5 ? r() * WIDTH * 0.14 + (r() < 0.5 ? 0 : WIDTH * 0.86) : r() * WIDTH;
                const gy = edge < 0.5 ? r() * HEIGHT : r() * HEIGHT * 0.14 + (r() < 0.5 ? 0 : HEIGHT * 0.86);
                return <rect key={i} x={gx} y={gy} width={1.5 + r() * 2} height={1.5 + r() * 2} fill={r() < 0.5 ? "#000" : "#fff"} opacity={0.15 + r() * 0.25} />;
              })}
            </g>
          </svg>
        </AbsoluteFill>
      )}

      {/* progress rule */}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: Math.min(1, Math.max(0, progress)) * WIDTH, height: PROGRESS_RULE.height, backgroundColor: PROGRESS_RULE.color, zIndex: 5 }} />

      {/* source tag */}
      {source && (
        <div style={{ position: "absolute", left: SPACE.safe.x, bottom: SPACE.safe.y, zIndex: 5 }}>
          <span style={{ fontFamily: TYPE.sourceTag.fontFamily, fontSize: TYPE.sourceTag.fontSize, letterSpacing: "0.02em", color: "#2b2822", backgroundColor: "rgba(241, 235, 220, 0.86)", padding: "3px 9px" }}>
            {source}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Wrapper matching BeatFrame's signature for v3 beats. */
export const V3BeatFrame: React.FC<{
  progress: number;
  source?: React.ReactNode;
  bare?: boolean;
  children?: React.ReactNode;
}> = (p) => <V3Frame {...p} />;
