import { createContext, useContext, useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HEIGHT, PlaneName, WIDTH, Z } from "../tokens";
import {
  CameraKeyframe,
  CameraState,
  CAMERA_HOME,
  resolvedZoom,
  sampleCamera,
} from "./camera";
import { DebugOverlay } from "./DebugOverlay";

/**
 * SpatialScene — TIER 4 (§3.5). The scene abstraction.
 *
 *   SpatialScene { background, layers[], objects[], groups[], connections[],
 *                  camera { position, target, zoom, fov }, transitions }
 *
 * Declarative: objects and groups are declared with their world rects, so
 * semantic camera targeting (§3.5: focusOn / reveal / pullToFit) is deterministic
 * and needs no runtime measurement.
 *
 * DO NOT make everything 2.5D (§3.1). Most frames stay flat. Reach for this only
 * when depth carries meaning — parent→child, cause→effect, flows, pulling back to
 * reveal context.
 */

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Which parallax plane the object lives on. Default "subject". */
  plane?: PlaneName;
};

export type SceneObjects = Record<string, Rect>;
export type SceneGroups = Record<string, string[]>;

export type CameraTarget =
  | { focus: string; fill?: number }
  | { fit: string | string[]; padding?: number }
  | Partial<CameraState>;

export type SceneCameraKey = {
  frame: number;
  target: CameraTarget;
  easing?: (t: number) => number;
};

type SceneCtx = {
  camera: CameraState;
  objects: SceneObjects;
  groups: SceneGroups;
  debug: boolean;
};

const Ctx = createContext<SceneCtx | null>(null);

export const useScene = (): SceneCtx => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useScene must be used inside <SpatialScene>");
  return c;
};

const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

/** Union of the rects named by an id (object or group). */
export const boundsOf = (
  id: string | string[],
  objects: SceneObjects,
  groups: SceneGroups,
): Rect => {
  const ids = Array.isArray(id) ? id : groups[id] ? groups[id] : [id];
  const rects = ids.map((k) => objects[k]).filter(Boolean);
  if (rects.length === 0) return { x: CENTER.x, y: CENTER.y, w: 0, h: 0 };
  const minX = Math.min(...rects.map((r) => r.x));
  const minY = Math.min(...rects.map((r) => r.y));
  const maxX = Math.max(...rects.map((r) => r.x + r.w));
  const maxY = Math.max(...rects.map((r) => r.y + r.h));
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
};

const resolveTarget = (
  t: CameraTarget,
  objects: SceneObjects,
  groups: SceneGroups,
): Partial<CameraState> => {
  if ("focus" in t) {
    const r = boundsOf(t.focus, objects, groups);
    const fill = t.fill ?? 0.6; // subject ≈ 60% of frame height (§2.2)
    return {
      x: r.x + r.w / 2 - CENTER.x,
      y: r.y + r.h / 2 - CENTER.y,
      zoom: r.h > 0 ? clamp((fill * HEIGHT) / r.h, 0.4, 3) : 1,
      z: Z.subject.z,
    };
  }
  if ("fit" in t) {
    const r = boundsOf(t.fit, objects, groups);
    const pad = t.padding ?? 160;
    const zoom = clamp(
      Math.min(
        WIDTH / (r.w + pad * 2),
        HEIGHT / (r.h + pad * 2),
      ),
      0.3,
      2,
    );
    return {
      x: r.x + r.w / 2 - CENTER.x,
      y: r.y + r.h / 2 - CENTER.y,
      zoom,
      z: Z.subject.z,
    };
  }
  return t;
};

export const SpatialScene: React.FC<{
  objects?: SceneObjects;
  groups?: SceneGroups;
  camera?: SceneCameraKey[];
  /** Debug overlay — development only, OFF in every render (§3.8). */
  debug?: boolean;
  children?: React.ReactNode;
}> = ({ objects = {}, groups = {}, camera = [], debug = false, children }) => {
  const frame = useCurrentFrame();

  const camState = useMemo<CameraState>(() => {
    if (camera.length === 0) return { ...CAMERA_HOME };
    const kf: CameraKeyframe[] = camera.map((k) => ({
      frame: k.frame,
      pose: resolveTarget(k.target, objects, groups),
      easing: k.easing,
    }));
    return sampleCamera(frame, kf);
  }, [frame, camera, objects, groups]);

  const value: SceneCtx = { camera: camState, objects, groups, debug };

  return (
    <Ctx.Provider value={value}>
      <AbsoluteFill style={{ scale: resolvedZoom(camState) }}>
        {children}
        {debug && process.env.NODE_ENV === "development" ? <DebugOverlay /> : null}
      </AbsoluteFill>
    </Ctx.Provider>
  );
};

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

// ── Semantic camera targeting (§3.5) ─────────────────────────────────────────

/** Frame one object or group tight. `fill` = fraction of frame height (§2.2). */
export const focusOn = (id: string, fill?: number): CameraTarget => ({
  focus: id,
  fill,
});
/** A new object becomes important — move the camera to it (§3.4 Reframe). */
export const moveTo = (id: string, fill?: number): CameraTarget => ({
  focus: id,
  fill,
});
/** Open out to hold a set of related things (§3.4 Reveal / Pull). */
export const reveal = (ids: string[], padding?: number): CameraTarget => ({
  fit: ids,
  padding,
});
/** Pull back until the whole thing fits (§3.6 step 5). */
export const pullToFit = (id: string | string[], padding?: number): CameraTarget => ({
  fit: id,
  padding,
});

/** Current interpolated camera — for elements that must react to it. */
export const useCamera = () => useScene().camera;
