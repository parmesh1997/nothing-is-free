import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StandaloneField } from "../field/LockedField";
import { COLOR, FIELD, MOTION, SPACE, TYPE, WIDTH } from "../tokens";

/**
 * LockedFieldDemo — a development-only composition (Tier 1 verification).
 *
 * Shows the six-layer locked field plus one placeholder "subject" block sitting
 * on the ground rule at ~58% frame height, so the stack can be eyeballed and the
 * occupancy script has something above the floor to measure. NOT a channel asset.
 */
export const LockedFieldDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Placeholder subject: 58% of frame height, resting on the ground rule.
  const subjectHeight = Math.round(1080 * 0.58);
  const subjectWidth = Math.round(subjectHeight * 0.72);
  const groundY = FIELD.groundRule.y;

  const rise = spring({
    frame,
    fps,
    config: MOTION.springIn,
    durationInFrames: 24,
  });
  const y = groundY - subjectHeight * rise;

  return (
    <StandaloneField progress={0.33} source="Placeholder source, 2026">
      {/* Midground: a low horizontal band so there are three real planes. */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: groundY - Math.round(1080 * 0.22),
            width: WIDTH,
            height: Math.round(1080 * 0.22),
            backgroundColor: COLOR.graphite,
            opacity: 0.14,
          }}
        />
      </AbsoluteFill>

      {/* Foreground: the placeholder subject + its "offset stroke" stand-in. */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: WIDTH / 2 - subjectWidth / 2 + 14,
            top: y + 10,
            width: subjectWidth,
            height: subjectHeight,
            backgroundColor: COLOR.offsetRed,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: WIDTH / 2 - subjectWidth / 2,
            top: y,
            width: subjectWidth,
            height: subjectHeight,
            backgroundColor: COLOR.ink,
          }}
        />
      </AbsoluteFill>

      {/* Foreground: a placeholder data card in the bottom third — in the
          reference the bottom third carries the ground, the subject's mass, the
          progress rule AND the caption (§2.2). */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: SPACE.safe.x,
            bottom: SPACE.safe.y + 24,
            width: Math.round(WIDTH * 0.42),
            height: Math.round(1080 * 0.2),
            backgroundColor: COLOR.cardWhite,
            borderLeft: `6px solid ${COLOR.ink}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: SPACE.safe.x + 32,
            bottom: SPACE.safe.y + 24 + Math.round(1080 * 0.2) - 64,
            ...TYPE.caption,
            fontSize: TYPE.caption.minSize,
          }}
        >
          Tier 1 locked field — subject at 58% height
        </div>
      </AbsoluteFill>
    </StandaloneField>
  );
};
