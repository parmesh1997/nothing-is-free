import { useCurrentFrame, useVideoConfig } from "remotion";
import { EDGE } from "../tokens";
import { springIn } from "../parts/motion";
import { FigureShape } from "./figure";

/**
 * PaperEdge — TIER 2 (§2.5 successor). The hand-torn magazine-cutout edge:
 * a slightly-enlarged silhouette of the figure in warm near-white, sitting
 * BEHIND it, with a soft drop shadow. Replaces the red print offset.
 *
 * On entry it "prints" on over 6 frames. Foreground figures & props only.
 */
export const PaperEdge: React.FC<{
  shape: FigureShape;
  w: number;
  h: number;
  entryFrame?: number;
  /** Skip the drop shadow (e.g. for a midground element). */
  noShadow?: boolean;
}> = ({ shape: Shape, w, h, entryFrame = 0, noShadow = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const printed = springIn({
    frame,
    fps,
    delay: entryFrame,
    durationInFrames: EDGE.printOnFrames,
  });

  const edgePx = clamp(h * EDGE.widthFractionOfHeight, EDGE.minWidth, EDGE.maxWidth);
  const grow = 1 + (edgePx / Math.max(w, h)) * 2 * printed;
  const filterId = `nif-edge-${Math.round(w)}-${Math.round(h)}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          {!noShadow && (
            <feDropShadow
              dx="0"
              dy={EDGE.shadow.y}
              stdDeviation={EDGE.shadow.blur / 2}
              floodColor="#1C1A17"
              floodOpacity={EDGE.shadow.opacity * printed}
            />
          )}
          {EDGE.roughness > 0 && (
            <>
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={EDGE.roughness * 2} />
            </>
          )}
        </filter>
      </defs>
      <g
        style={{ transformOrigin: "center", scale: String(grow) }}
        opacity={printed}
        filter={`url(#${filterId})`}
      >
        <Shape paint={() => EDGE.color} mode="edge" w={w} h={h} ox={0} oy={0} />
      </g>
    </svg>
  );
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
