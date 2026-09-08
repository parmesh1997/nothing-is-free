import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../parts/motion";
import { contactShadowStyle, hazeStyle } from "./light";

/**
 * Depth.tsx — the v4 staging primitives (creator, 2026-09-03).
 *
 *   <ContactShadow>  a soft warm ellipse under a grounded object
 *   <Plane>          one parallax layer; `depth` 0 (subject) → 1 (far)
 *   <Push>           ONE slow continuous camera push per scene (never a
 *                    per-beat zoom; the creator called that a "camera roll").
 *                    Frame furniture must sit OUTSIDE this.
 */

export const ContactShadow: React.FC<{
  /** centre x of the object's ground contact. */
  x: number;
  /** the ground y (feet / base of the object). */
  y: number;
  /** object visual width at the ground. */
  w: number;
  opacity?: number;
  squash?: number;
  blur?: number;
}> = ({ x, y, w, opacity, squash, blur }) => {
  const s = contactShadowStyle(w, { opacity, squash, blur });
  return <div style={{ ...s, left: x - (s.width as number) / 2, top: y - (s.height as number) / 2 }} />;
};

/**
 * A parallax plane. Under a <Push>, planes with higher `depth` counter-translate
 * so they appear to move less — the 2.5D read. `depth` 0 keeps pace with the
 * subject; 1 is the far backdrop. Adds a faint haze at higher depth.
 */
export const Plane: React.FC<{
  depth: number;
  /** the push progress 0..1 (from usePush), so the plane knows how much to lag. */
  push: number;
  /** max px the subject plane drifts on the push (planes scale this by 1-depth). */
  drift?: number;
  haze?: boolean;
  children?: React.ReactNode;
}> = ({ depth, push, drift = 26, haze = true, children }) => {
  const dx = -drift * push * (1 - depth * 0.72);
  const dy = -drift * 0.3 * push * (1 - depth * 0.72);
  return (
    <AbsoluteFill style={{ translate: `${dx.toFixed(2)}px ${dy.toFixed(2)}px` }}>
      {children}
      {haze && depth > 0.05 ? <div style={hazeStyle(depth)} /> : null}
    </AbsoluteFill>
  );
};

/**
 * usePush — the scene camera. Returns { push, zoom }.
 *   push  0 → 1 across [from, to], cubic-in-out (feed to <Plane push=…>)
 *   zoom  1 → `to`  (feed to <Push>)
 * Default: a barely-there 1.0 → 1.045 over the whole clip. Give it a reason.
 */
export const usePush = (
  opts: { from?: number; to?: number; zoom?: number; dur?: number } = {},
) => {
  const frame = useCurrentFrame();
  const from = opts.from ?? 0;
  const to = opts.to ?? opts.dur ?? 600;
  const zoomTo = opts.zoom ?? 1.045;
  const push = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  return { push, zoom: 1 + (zoomTo - 1) * push };
};

/**
 * <Push zoom={…}> — wraps the scene planes and applies the camera scale about
 * frame centre. Everything spatial goes inside; Grain / ProgressRule / SourceTag
 * stay outside (they are not in the world).
 */
export const Push: React.FC<{ zoom: number; children?: React.ReactNode }> = ({ zoom, children }) => (
  <AbsoluteFill style={{ scale: String(zoom), transformOrigin: "50% 52%" }}>{children}</AbsoluteFill>
);

/**
 * <ReactionZoom> — a deliberate push IN to a point (Lucky's face / a body 3/4),
 * hold, then push back (creator 2026-09-03: "straight zoom in to the face…
 * we will zoom back into that"). Use for an expression beat, or the phone tap
 * ("we go into that and we come back"). Cuts nothing — one continuous move.
 *
 *   <ReactionZoom at={f} hold={24} x="26%" y="34%" zoom={1.8}>{scene}</ReactionZoom>
 *
 * `x`/`y` are the focal point as % of frame (the transform origin). The move is
 * ~10f in, `hold` frames held, ~14f back. Keep zoom ≤ ~2.2 for a face.
 */
export const ReactionZoom: React.FC<{
  at: number;
  hold?: number;
  x?: string;
  y?: string;
  zoom?: number;
  inF?: number;
  outF?: number;
  children?: React.ReactNode;
}> = ({ at, hold = 22, x = "50%", y = "40%", zoom = 1.7, inF = 10, outF = 14, children }) => {
  const frame = useCurrentFrame();
  const z = interpolate(
    frame,
    [at, at + inF, at + inF + hold, at + inF + hold + outF],
    [1, zoom, zoom, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut },
  );
  return <AbsoluteFill style={{ scale: z.toFixed(3), transformOrigin: `${x} ${y}` }}>{children}</AbsoluteFill>;
};
