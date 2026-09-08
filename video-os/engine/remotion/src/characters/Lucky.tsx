import { useCurrentFrame, useVideoConfig } from "remotion";
import { FIELD, HEIGHT, OCCUPANCY } from "../tokens";
import { FigureBlock } from "../print/FigureBlock";
import { LuckyExpression, LuckyPose, luckyShape } from "./lucky-rig";
import { LuckyRive, RigBoundary } from "./LuckyRive";
import { RIG_READY } from "./rive-rig";

/**
 * Lucky — TIER 5 (§5.1). The character every beat calls.
 *
 * Dispatches: when `rive-rig.RIG_READY` (a real `public/rigs/lucky.riv` is in
 * place), renders <LuckyRive> behind an error boundary that falls back to the
 * SVG rig. Otherwise renders the SVG rig directly. The prop surface is identical
 * either way (creator 2026-09-02 — "same props surface"), so swapping in the
 * `.riv` needs no beat edits.
 *
 * Line-art character (creator's reference): clean dark outline, NOT the
 * torn-paper edge (props get that). She may enter from any edge and interact
 * with objects (§5.1); the subject-height guard is opt-in via `subject`.
 */
type LuckyProps = {
  pose?: LuckyPose;
  expression?: LuckyExpression;
  facing?: 1 | -1;
  /** Figure height in px. Defaults to ~40% of frame height (a presenter figure). */
  height?: number;
  /** Horizontal centre. */
  centerX?: number;
  /** Feet position: a Y in px or "ground". */
  baseline?: number | "ground";
  entry?: "L" | "R" | "up" | "none";
  entryFrame?: number;
  /** Is Lucky the subject of this frame? Enables the subject-height guard. */
  subject?: boolean;
  /** Animate a walk / gesture cycle at this many seconds per cycle. */
  cycleSeconds?: number;
  label?: string;
  /** Render with no facial features (a clean silhouette head). */
  faceless?: boolean;
  /** OverSimplified read: arms/hands/legs/feet are solid ink (creator, 2026-09-03). */
  flatLimbs?: boolean;
  /** Where she looks — "down" at a phone/surface, never the camera. */
  gaze?: "forward" | "down" | "side";
  /** Keep a small idle motion going while she's on screen (weight shift / sway) —
   *  "put Lucky on a loop" (creator, 2026-09-02). Default on. */
  idle?: boolean;
  /** Screen colour of the phone she holds (showPhone / typing). */
  phoneScreen?: string;
};

/** The character every beat calls — dispatches Rive rig ↔ SVG fallback. */
export const Lucky: React.FC<LuckyProps> = (props) => {
  if (RIG_READY) {
    return (
      <RigBoundary fallback={<LuckySvg {...props} />}>
        <LuckyRive
          pose={props.pose ?? "stand"}
          expression={props.expression ?? "neutral"}
          facing={props.facing ?? 1}
          height={props.height ?? Math.round(HEIGHT * 0.4)}
          centerX={props.centerX ?? 960}
          baseline={props.baseline ?? "ground"}
          entry={props.entry ?? "none"}
          entryFrame={props.entryFrame ?? 0}
        />
      </RigBoundary>
    );
  }
  return <LuckySvg {...props} />;
};

/** The SVG rig — the guaranteed fallback until `public/rigs/lucky.riv` lands. */
const LuckySvg: React.FC<LuckyProps> = ({
  pose = "stand",
  expression = "neutral",
  facing = 1,
  height,
  centerX,
  baseline = "ground",
  entry = "none",
  entryFrame = 0,
  subject = false,
  cycleSeconds = 1,
  label,
  faceless = false,
  flatLimbs = false,
  gaze = "forward",
  idle = true,
  phoneScreen,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const h = height ?? Math.round(HEIGHT * 0.4);
  const phase = ((frame - entryFrame) / (cycleSeconds * fps)) % 1;
  const s2 = Math.sin(phase * Math.PI * 2);

  const walking = pose === "walk";
  const leaning = pose === "showPhone" || pose === "typing";
  // walk: forward lean + bob. showPhone/typing: lean IN toward the phone.
  const lean = walking ? 3 * facing : leaning ? 8 * facing : 0;
  const bob =
    walking
      ? Math.abs(s2) * -6
      : leaning
        ? s2 * 2
        : idle
          ? Math.abs(s2) * -2
          : 0;

  if (process.env.NODE_ENV === "development" && subject) {
    const frac = h / HEIGHT;
    const [lo, hi] = OCCUPANCY.subjectHeightRange;
    if (frac < lo || frac > hi) {
      console.warn(
        `[Lucky] subject height ${(frac * 100).toFixed(0)}% — §5.1 says never shrink her; §2.2 wants 45–70%.`,
      );
    }
  }

  return (
    <FigureBlock
      shape={luckyShape({ pose, expression, facing, phase, faceless, flatLimbs, gaze, screenColor: phoneScreen })}
      width={Math.round(h * 0.55)}
      height={h}
      centerX={centerX}
      baseline={baseline}
      entry={entry}
      entryFrame={entryFrame}
      subject={subject}
      label={label}
      tiltDeg={lean}
      liftY={bob}
      noEdge
    />
  );
};

/** Ground-rule Y, re-exported so scenes can place props at Lucky's feet. */
export const groundY = FIELD.groundRule.y;
