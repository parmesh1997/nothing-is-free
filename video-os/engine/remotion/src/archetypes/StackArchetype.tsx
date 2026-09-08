import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, FIELD, FONT, TYPE, WIDTH } from "../tokens";
import { EASE, springIn, velocityBlur } from "../parts/motion";
import { CountUp } from "../parts/CountUp";

type Segment = { label: string; weight: number; kept?: boolean };

/**
 * StackArchetype — TIER 6. The §11.2 B07 choreography, generalised:
 *
 *   stack builds bottom-up, N segments, staggered (§11.2: 8f stagger)
 *   → the non-kept portion detaches, accelerates away with motion blur
 *   → the remainder SETTLES down onto the ground rule
 *   → a figure counts to the kept value
 *
 * "The counter keeps four fifths" — cost stacks, revenue splits, who-gets-what.
 * Segments marked `kept` stay; the rest leave.
 */
export const StackArchetype: React.FC<{
  segments: Segment[];
  durationInFrames: number;
  /** The value the counter lands on (already computed, e.g. 44_300_000). */
  keptValue: number;
  format?: (n: number) => string;
  caption?: string;
  stackHeight?: number;
  stackWidth?: number;
}> = ({
  segments,
  durationInFrames,
  keptValue,
  format = (n) => `$${(Math.round(n) / 1_000_000).toFixed(1)}M`,
  caption,
  stackHeight = 600,
  stackWidth = 380,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const groundY = FIELD.groundRule.y;

  const cF = (f: number) => Math.min(durationInFrames - 1, Math.max(0, Math.round(f)));
  const buildFrom = cF(durationInFrames * 0.08);
  const detachAt = cF(durationInFrames * 0.42);
  const settleEnd = cF(durationInFrames * 0.6);
  const countAt = cF(durationInFrames * 0.62);
  const countEnd = cF(durationInFrames * 0.86);

  const totalWeight = segments.reduce((s, seg) => s + seg.weight, 0);
  const stackX = WIDTH * 0.14;

  // Lay out bottom-up.
  let acc = 0;
  const laid = segments.map((seg, i) => {
    const h = (seg.weight / totalWeight) * stackHeight;
    const yBottom = groundY - acc;
    acc += h;
    return { ...seg, i, h, yTop: yBottom - h };
  });

  // How far each kept segment must drop once the non-kept below it leaves.
  const nonKeptHeightBelow = (yTop: number) =>
    laid.filter((s) => !s.kept && s.yTop > yTop).reduce((s, x) => s + x.h, 0);

  const detachP = interpolate(frame, [detachAt, settleEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.exitIn,
  });
  const detachPrev = interpolate(frame - 1, [detachAt, settleEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.exitIn,
  });
  const detachX = detachP * (WIDTH * 0.95);
  const detachBlur = velocityBlur((detachP - detachPrev) * WIDTH * 0.95);

  const settleP = interpolate(frame, [detachAt + 4, settleEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });

  const keptBlockTop =
    Math.min(...laid.filter((s) => s.kept).map((s) => s.yTop)) +
    nonKeptHeightBelow(Math.min(...laid.filter((s) => s.kept).map((s) => s.yTop))) * settleP;

  return (
    <AbsoluteFill>
      {laid.map((seg) => {
        const appear = springIn({
          frame,
          fps,
          delay: buildFrom + seg.i * 8,
          durationInFrames: 16,
        });
        const drop = seg.kept ? nonKeptHeightBelow(seg.yTop) * settleP : 0;
        const gone = !seg.kept ? detachP : 0;
        return (
          <div
            key={seg.i}
            style={{
              position: "absolute",
              left: stackX,
              top: seg.yTop,
              width: stackWidth,
              height: seg.h - 3,
              backgroundColor: seg.kept ? COLOR.ink : COLOR.graphite,
              opacity: appear * (1 - gone),
              translate: `${!seg.kept ? detachX : 0}px ${(1 - appear) * 24 + drop}px`,
              filter: !seg.kept && detachBlur > 0.5 ? `blur(${detachBlur}px)` : undefined,
              display: "flex",
              alignItems: "center",
              paddingLeft: 22,
              fontFamily: FONT.mono,
              fontSize: 22,
              color: COLOR.cardWhite,
              letterSpacing: "0.03em",
            }}
          >
            {seg.label}
          </div>
        );
      })}

      {frame >= countAt - 8 ? (
        <div
          style={{
            position: "absolute",
            left: stackX + stackWidth + 140,
            top: keptBlockTop - 40,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: WIDTH - (stackX + stackWidth + 140) - 140,
          }}
        >
          <CountUp
            from={0}
            to={keptValue}
            start={countAt}
            end={countEnd}
            format={format}
            size={240}
            accent
          />
          {caption ? (
            <div style={{ ...TYPE.caption, fontSize: TYPE.caption.minSize }}>{caption}</div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
