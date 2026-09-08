/** TIER 4 — the selective 2.5D layer (§3, §11.1). */
export {
  SpatialScene,
  useScene,
  useCamera,
  focusOn,
  moveTo,
  reveal,
  pullToFit,
  boundsOf,
} from "./SpatialScene";
export type {
  Rect,
  SceneObjects,
  SceneGroups,
  CameraTarget,
  SceneCameraKey,
} from "./SpatialScene";
export { Layer, relativeParallax } from "./Layer";
export { SpatialObject } from "./SpatialObject";
export { Group } from "./Group";
export { Connection } from "./Connection";
export { DebugOverlay } from "./DebugOverlay";
export * from "./camera";
