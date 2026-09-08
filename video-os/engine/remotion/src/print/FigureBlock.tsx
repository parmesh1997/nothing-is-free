import { useCurrentFrame, useVideoConfig } from "remotion";
import { FIELD, HEIGHT, OCCUPANCY, TYPE, WIDTH } from "../tokens";
import { springIn } from "../parts/motion";
import { FigureShape } from "./figure";
import { FlatFigure } from "./FlatFigure";
import { PaperEdge } from "./PaperEdge";

/**
 * FigureBlock — TIER 2. A foreground figure/object, cutout-complete and placed:
 *   torn paper edge (behind, prints on, soft shadow) + flat-colour figure
 *   + optional unit label, positioned to sit on a baseline with an optional entry.
 *
 * Baseline contact (§2.2). Subject-height guard (§2.2): when `subject` is set,
 * dev warns if the figure is outside 45–70% of frame height.
 */
export const FigureBlock: React.FC<{
  shape: FigureShape;
  width: number;
  height: number;
  centerX?: number;
  baseline?: number | "ground";
  label?: string;
  entry?: "L" | "R" | "up" | "none";
  entryFrame?: number;
  entryDurationInFrames?: number;
  subject?: boolean;
  /** Small body tilt in degrees (e.g. a walk lean). Rotates about the feet. */
  tiltDeg?: number;
  /** Vertical lift in px (e.g. a walk bob). Negative = up. */
  liftY?: number;
  /** Drop the torn-paper edge (a clean-vector object). */
  noEdge?: boolean;
}> = ({
  shape,
  width,
  height,
  centerX = WIDTH / 2,
  baseline = "ground",
  label,
  entry = "none",
  entryFrame = 0,
  entryDurationInFrames = 20,
  subject = false,
  tiltDeg = 0,
  liftY = 0,
  noEdge = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = springIn({
    frame,
    fps,
    delay: entryFrame,
    durationInFrames: entryDurationInFrames,
  });

  const footY = baseline === "ground" ? FIELD.groundRule.y : baseline;
  const boxTop = footY - height;
  const boxLeft = centerX - width / 2;

  const slideFrom =
    entry === "L" ? -(boxLeft + width + 120) : entry === "R" ? WIDTH - boxLeft + 120 : 0;
  const riseFrom = entry === "up" ? 140 : 0;
  const tx = slideFrom * (1 - p);
  const ty = riseFrom * (1 - p);

  if (process.env.NODE_ENV === "development" && subject) {
    const frac = height / HEIGHT;
    const [lo, hi] = OCCUPANCY.subjectHeightRange;
    if (frac < lo || frac > hi) {
      console.warn(
        `[FigureBlock] subject height ${(frac * 100).toFixed(0)}% of frame — §2.2 wants 45–70%.`,
      );
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: boxLeft,
        top: boxTop,
        width,
        height,
        translate: `${tx}px ${ty + liftY}px`,
        rotate: tiltDeg ? `${tiltDeg}deg` : undefined,
        transformOrigin: "50% 100%",
        opacity: entry === "none" ? p : 1,
      }}
    >
      {!noEdge ? <PaperEdge shape={shape} w={width} h={height} entryFrame={entryFrame} /> : null}
      <FlatFigure shape={shape} w={width} h={height} />

      {label ? (
        <div
          style={{
            position: "absolute",
            left: -40,
            top: height + 16,
            width: width + 80,
            textAlign: "center",
            ...TYPE.unit,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
