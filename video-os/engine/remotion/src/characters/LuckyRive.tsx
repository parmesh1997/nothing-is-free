import { Component, type ReactNode } from "react";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RemotionRiveCanvas } from "@remotion/rive";
import { FIELD, HEIGHT, WIDTH } from "../tokens";
import { springIn } from "../parts/motion";
import { LuckyExpression, LuckyPose } from "./lucky-rig";
import { LUCKY_ARTBOARD, LUCKY_RIV, luckyClip } from "./rive-rig";

/**
 * LuckyRive — the Rive-backed rig (v2.0 §5.1, creator 2026-09-02).
 *
 * Same placement contract as <FigureBlock>: a 0.55-aspect figure standing on a
 * baseline, optional edge-slide entry, `facing` mirror. The pose is chosen as a
 * looping linear-animation clip (`@remotion/rive` has no state-machine inputs —
 * see rive-rig.ts). Idle motion is baked into each clip.
 *
 * Wrapped by <Lucky> behind an error boundary → the SVG rig covers any load
 * failure, so a missing / broken `.riv` never breaks a render.
 */
export const LuckyRive: React.FC<{
  pose: LuckyPose;
  expression: LuckyExpression;
  facing: 1 | -1;
  height: number;
  centerX: number;
  baseline: number | "ground";
  entry: "L" | "R" | "up" | "none";
  entryFrame: number;
}> = ({ pose, expression, facing, height, centerX, baseline, entry, entryFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const w = Math.round(height * 0.55);
  const footY = baseline === "ground" ? FIELD.groundRule.y : baseline;
  const boxTop = footY - height;
  const boxLeft = centerX - w / 2;

  const p = springIn({ frame, fps, delay: entryFrame, durationInFrames: 20 });
  const slideFrom =
    entry === "L" ? -(boxLeft + w + 120) : entry === "R" ? WIDTH - boxLeft + 120 : 0;
  const riseFrom = entry === "up" ? 140 : 0;
  const tx = slideFrom * (1 - p);
  const ty = riseFrom * (1 - p);

  return (
    <div
      style={{
        position: "absolute",
        left: boxLeft,
        top: boxTop,
        width: w,
        height,
        translate: `${tx}px ${ty}px`,
        opacity: entry === "none" ? p : 1,
      }}
    >
      <div style={{ width: "100%", height: "100%", transform: facing === -1 ? "scaleX(-1)" : undefined }}>
        <RemotionRiveCanvas
          src={staticFile(LUCKY_RIV)}
          artboard={LUCKY_ARTBOARD}
          animation={luckyClip(pose, expression)}
          fit="contain"
          alignment="bottom-center"
        />
      </div>
    </div>
  );
};

// ── error boundary ───────────────────────────────────────────────────────────

/**
 * RigBoundary — if the `.riv` fails to load / decode (missing file, bad export,
 * runtime error), fall back to `fallback` (the SVG rig). Character rendering
 * must never hard-fail a beat.
 */
export class RigBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[LuckyRive] rig failed to load — using the SVG fallback.", err);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Kept so a future subject-height check has the frame constant. */
export const RIG_FRAME_H = HEIGHT;
