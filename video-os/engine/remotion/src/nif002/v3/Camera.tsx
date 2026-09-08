import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../parts/motion";
import { HEIGHT, WIDTH } from "../../tokens";

/**
 * CameraPush — the v3 "the camera is always moving" wrapper (Infographics Show:
 * a slow push in or pull out, never a locked frame).
 *
 * Give it `moves` as keyframes of {at, zoom, x, y}. Between the first frame and
 * the first keyframe it holds the first pose; it interpolates (ease-in-out)
 * through the rest. Default, with no `moves`: a gentle 1.0 → 1.05 push over the
 * whole beat.
 *
 * `x` / `y` are pan in px at zoom 1 (positive x = frame moves right → world
 * shifts left). Applied about the frame centre so a push feels like a dolly.
 *
 *   <CameraPush dur={dur} moves={[{ at: 0, zoom: 1.04 }, { at: F.peak, zoom: 1.14, y: -40 }]}>
 *     <Street .../>
 *     ...beat elements...
 *   </CameraPush>
 */
export type CamKey = { at: number; zoom?: number; x?: number; y?: number };

export const CameraPush: React.FC<{
  dur: number;
  moves?: CamKey[];
  children: React.ReactNode;
}> = ({ dur, moves, children }) => {
  const frame = useCurrentFrame();

  const keys: Required<CamKey>[] = (
    moves && moves.length
      ? moves
      : [
          { at: 0, zoom: 1.0 },
          { at: dur, zoom: 1.055 },
        ]
  )
    .map((k) => ({ at: k.at, zoom: k.zoom ?? 1, x: k.x ?? 0, y: k.y ?? 0 }))
    .sort((a, b) => a.at - b.at);

  const at = keys.map((k) => k.at);
  const sample = (vals: number[]) =>
    keys.length === 1
      ? vals[0]
      : interpolate(frame, at, vals, {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.inOut,
        });

  const zoom = sample(keys.map((k) => k.zoom));
  const px = sample(keys.map((k) => k.x));
  const py = sample(keys.map((k) => k.y));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: WIDTH,
        height: HEIGHT,
        transformOrigin: "50% 50%",
        transform: `scale(${zoom}) translate(${-px}px, ${-py}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

/**
 * Parallax — nudge a scene layer opposite the camera by `depth` (0 = pinned to
 * camera / far background, 1 = full foreground). Call inside <CameraPush>; it
 * reads the same keyframes so distant layers drift less.
 *
 * Simpler than the spatial/ rig — enough for a street with 3–4 depth bands.
 */
export const layerParallax = (
  frame: number,
  dur: number,
  depth: number,
  moves?: CamKey[],
): { transform: string } => {
  const keys = (moves && moves.length ? moves : [{ at: 0, zoom: 1 }, { at: dur, zoom: 1.055 }])
    .map((k) => ({ at: k.at, zoom: k.zoom ?? 1, x: k.x ?? 0, y: k.y ?? 0 }))
    .sort((a, b) => a.at - b.at);
  const at = keys.map((k) => k.at);
  const s = (vals: number[]) =>
    keys.length === 1
      ? vals[0]
      : interpolate(frame, at, vals, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const dz = s(keys.map((k) => k.zoom)) - keys[0].zoom;
  // far layers counter-zoom slightly so the push reads as depth, not a flat scale
  const counter = 1 - dz * (1 - depth) * 0.6;
  return { transform: `scale(${counter})` };
};
