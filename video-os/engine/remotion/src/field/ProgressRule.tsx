import { AbsoluteFill } from "remotion";
import { PROGRESS_RULE, WIDTH } from "../tokens";

/**
 * ProgressRule — "a 10px orange bar along the bottom of the frame, growing left
 * to right across the WHOLE episode, 0% at 0:00 to 100% at the end" (§2.8).
 *
 * Always present. Never resets. Never segmented per beat. Because pieces render
 * separately (§11.3) it is driven by globalStartFrame / episodeTotalFrames,
 * never by local frame.
 *
 * Stays orange through the Dark Law (§2.9).
 *
 * It is the one orange element that does NOT count against "one orange element
 * per frame" (§2.4) — it is always there.
 */
export const ProgressRule: React.FC<{
  /** 0 → 1 across the whole episode. Pass episodeProgress(frame, props). */
  progress: number;
}> = ({ progress }) => {
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <AbsoluteFill showInTimeline={false}>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: clamped * WIDTH,
          height: PROGRESS_RULE.height,
          backgroundColor: PROGRESS_RULE.color,
        }}
      />
    </AbsoluteFill>
  );
};
