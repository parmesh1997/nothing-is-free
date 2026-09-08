import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT, TYPE, WIDTH } from "../tokens";

/**
 * SourceTag — the citation for the figure on screen.
 *
 * Creator (2026-09-03): "make sure that is there for [a moment] and remove that
 * — we don't need that." Plus the overlap note (4 screenshots): it was sitting
 * on top of the caption. So now it: (a) flashes for ~2s only — in and gone
 * before a caption grows to two lines; (b) sits at the TOP of the reserved text
 * lane (~85% down), clear of the caption which sits on the floor; (c) is small
 * and quiet. Never in the top 80%.
 * (Deviation from runbook §2.7 "persistent, every frame" — logged.)
 */
export const SourceTag: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  if (!children) return null;

  const op = interpolate(frame, [6, 16, 66, 84], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0.01) return null;
  const rise = interpolate(frame, [6, 16], [6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", left: 132, right: 132, bottom: HEIGHT * 0.15, display: "flex", translate: `0px ${rise}px` }}>
        <span
          style={{
            fontFamily: TYPE.sourceTag.fontFamily,
            fontSize: 15,
            letterSpacing: "0.03em",
            color: COLOR.graphite,
            opacity: 0.72,
            maxWidth: WIDTH * 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {children}
        </span>
      </div>
    </AbsoluteFill>
  );
};
