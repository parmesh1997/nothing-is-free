import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLOR, HEIGHT, WIDTH, shade, tint } from "../../tokens";

/**
 * Stage3D.tsx — real Three.js (creator, 2026-09-06: "push further into real
 * Three.js/WebGL", after reviewing a B01 still and calling the flat
 * GreyFloor + a single bordered card "the mass repetitive content" across
 * too many beats). Replaces `GreyFloor` in a curated set of beats (see
 * Nothing Is Free — Master Runbook v1.0.md §21 for the standing rule this
 * codifies): the ground plane is real lit geometry (this IS the bottom-third
 * occupancy mass now, not a flat CSS rect), and 1-3 real 3D props sit on it,
 * each continuously idling, popping in on its own word-synced frame, and
 * optionally glow-pulsing — matching @remotion/three's already-proven usage
 * in `src/dev/Episode3StyleDemo.tsx` (same ThreeCanvas/orthographic/camera
 * shape, same simple-primitive-composition approach rather than SVG-to-
 * texture, which would add async texture-loading risk this pipeline hasn't
 * needed anywhere else).
 *
 * Scope, per the approved plan: cards/icons only, never Figure or a
 * location — same boundary DimCard already draws for its own cheap-CSS-3D
 * treatment. `Stage3D` is the step up from DimCard when a beat needs real
 * rotation/occlusion/depth instead of a static tilt.
 *
 *   <Stage3D reveal groundStrength props={[{kind:"coinStack", x:-2, at:120, spin:true}]} />
 */

export type Prop3DKind = "coinStack" | "receipt" | "lockBody" | "cardBlock" | "box" | "shelf";

export type Prop3DSpec = {
  kind: Prop3DKind;
  /** world X, roughly -3.2..3.2 (canvas is framed to show about that span). */
  x: number;
  /** world Z (depth toward/away from camera), default 0. */
  z?: number;
  color?: string;
  /** frame (LOCAL to the beat) this prop pops in. */
  at: number;
  scale?: number;
  /** continuous slow idle Y-axis rotation for as long as it's on screen. */
  spin?: boolean;
  /** frame to glow-pulse at (an emissive flash), e.g. a word-sync land. */
  glowAt?: number;
};

const STAGE_H = HEIGHT - (HEIGHT * 2) / 3; // the same bottom-third GreyFloor covered

// Thin/flat slab props (a receipt, a card) have almost no depth along one
// axis. A full 360° idle spin inevitably swings them edge-on to the camera —
// under the orthographic projection here that's not a perspective shrink,
// it's the real projected width collapsing toward zero (width*cos(angle)),
// so the prop goes from "readable card" to "pale near-invisible sliver" and
// back, every ~4.3s (260 frames) for as long as it's on screen. That was the
// B06 receipt bug: it wasn't the added stripe/text-line geometry failing to
// render, it was the whole slab (stripe and lines included) caught edge-on.
// Fix: these kinds rock within a bounded arc (never past ~±29°, cos>=0.87)
// instead of spinning through 360° — still visibly alive, never vanishes.
// Also includes lockBody: not literally flat, but its shackle (a HALF torus,
// one specific orientation) goes edge-on/invisible partway through a full
// 360° spin the same way a flat face does — bounding its rotation the same
// way keeps the shackle detail visible for the whole time it's on screen.
const FLAT_KINDS = new Set<Prop3DKind>(["receipt", "cardBlock", "lockBody"]);

// The camera sits at [9,7,9] looking at the origin — in the ground (X-Z)
// plane that's exactly 45° off the Z axis. A flat prop's face is built
// facing +Z (rotation 0), so with NO offset it already meets the camera at
// ~45-54° oblique before any idle motion is added — that "off by 45°" was
// the real B06 receipt bug: the ±29° rock (safe if 0° were face-on) was
// actually swinging the card between ~16° and ~74° off-camera, and at the
// steep end almost the whole face foreshortens away to a sliver. Rotating
// flat props by this base yaw first points the face AT the camera; the rock
// then genuinely stays within ±29° of face-on.
const FLAT_BASE_YAW = Math.PI / 4;

const PropMesh: React.FC<{ spec: Prop3DSpec; frame: number; fps: number }> = ({ spec, frame, fps }) => {
  const pop = spring({ frame: frame - spec.at, fps, config: { damping: 13, mass: 0.7 }, durationInFrames: 40 });
  const isFlat = FLAT_KINDS.has(spec.kind);
  // `shelf` is a wide BASE other props visually rest on — it must stay
  // level (the same wide-assembly rotation problem `scaleBeam` had, worse:
  // 6 units wide vs. scaleBeam's 1.9), so it never rocks or spins.
  const isStatic = spec.kind === "shelf";
  const t = spec.spin && frame >= spec.at ? (frame - spec.at) / 260 : 0;
  const rock = spec.spin && frame >= spec.at ? (Math.PI / 6.2) * Math.sin(t * Math.PI * 2) : 0; // ±~29°, never edge-on
  const idleSpin = isStatic
    ? 0
    : isFlat
      ? FLAT_BASE_YAW + rock // face the camera, then gently rock — never spins past that
      : spec.spin && frame >= spec.at
        ? t * Math.PI * 2 // full continuous spin — safe for compact volumetric props (coinStack/lockBody/box)
        : 0;
  const glow = spec.glowAt !== undefined ? Math.max(0, 1 - Math.abs(frame - spec.glowAt) / 10) : 0;
  const color = spec.color ?? COLOR.orange;
  const s = Math.max(0.001, (spec.scale ?? 1) * pop);
  const mat = (c: string, emissive = false) => (
    <meshLambertMaterial color={c} emissive={emissive ? COLOR.orange : "#000000"} emissiveIntensity={emissive ? glow * 0.9 : 0} />
  );

  let geo: React.ReactNode;
  switch (spec.kind) {
    case "coinStack":
      geo = (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <group key={i}>
              <mesh position={[0, 0.08 + i * 0.17, 0]}>
                <cylinderGeometry args={[0.52, 0.52, 0.14, 28]} />
                {mat(color, true)}
              </mesh>
              <mesh position={[0, 0.08 + i * 0.17, 0]}>
                <cylinderGeometry args={[0.53, 0.53, 0.03, 28]} />
                <meshLambertMaterial color={shadeHex(color)} />
              </mesh>
            </group>
          ))}
        </>
      );
      break;
    case "receipt": {
      // Shorter than the original 1.5-tall design (was clipping against the
      // Stage3D viewport's vertical budget regardless of rotation — a real,
      // separate bug from the yaw one above). ~1.0 tall now sits comfortably
      // inside the same vertical window the coinStack already fits.
      // `spec.color` sets the FACE (defaults to the paper-white card look);
      // the two "text line" meshes flip to a contrasting tone automatically
      // (B19's dark "advertiser invoice" receipt vs. the usual pale one —
      // same two-variant convention `NodeCard` already uses in 2D).
      const face = spec.color ?? COLOR.cardWhite;
      const isDarkFace = face === COLOR.ink || face === "#111111" || face === "#111";
      const lineColor = isDarkFace ? COLOR.cardWhite : COLOR.ink;
      geo = (
        <>
          {/* ink backing, slightly larger + set back — a visible border so the
              card face reads as a defined shape against the ground at any
              rock angle, the same job DimCard's ink border does in 2D */}
          <mesh position={[0, 0.52, -0.035]}>
            <boxGeometry args={[0.97, 1.1, 0.05]} />
            <meshLambertMaterial color={isDarkFace ? shadeHex(face) : COLOR.ink} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <boxGeometry args={[0.85, 1.0, 0.08]} />
            <meshLambertMaterial color={face} emissive={COLOR.orange} emissiveIntensity={glow * 0.6} />
          </mesh>
          {/* one line is the orange accent (this is the "text line" position
              already confirmed to sit correctly inside the card at every
              scale — a separate element positioned nearer the card's own
              top edge was clipping/floating above the visible card at
              larger scale instead of reading as a stripe, so the accent
              lives here instead), the other stays ink for contrast. */}
          <mesh position={[0, 0.65, 0.05]}>
            <boxGeometry args={[0.6, 0.09, 0.02]} />
            <meshLambertMaterial color={COLOR.orange} />
          </mesh>
          <mesh position={[0, 0.45, 0.05]}>
            <boxGeometry args={[0.45, 0.09, 0.02]} />
            <meshLambertMaterial color={lineColor} />
          </mesh>
        </>
      );
      break;
    }
    case "lockBody":
      geo = (
        <>
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[0.95, 0.85, 0.55]} />
            {mat(color, true)}
          </mesh>
          <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.09, 12, 28, Math.PI]} />
            <meshLambertMaterial color={COLOR.ink} />
          </mesh>
        </>
      );
      break;
    case "cardBlock":
      geo = (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.55, 1.0, 0.16]} />
          {mat(color, true)}
        </mesh>
      );
      break;
    case "shelf":
      // A WIDE, BOUNDED 3D object — a real counter/ledge, not a floor: it
      // has visible cream on both sides (default width 6 of ~19 visible
      // world units), a start and an end, and other props sit ON it, the
      // same way B32's proven "one wide bounded prop" 2D ticker carried
      // real occupancy mass without reading as a colour band. Sunk so its
      // TOP surface sits exactly at y=0 — any other prop specified at this
      // same x (its own y starts from 0) automatically appears to rest on
      // top of the shelf with no extra positioning math.
      geo = (
        <>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[6, 0.3, 1.3]} />
            <meshLambertMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.001, 0]}>
            <boxGeometry args={[5.92, 0.02, 1.22]} />
            <meshLambertMaterial color={shadeHex(color)} />
          </mesh>
        </>
      );
      break;
    case "box":
    default:
      geo = (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          {mat(color, true)}
        </mesh>
      );
  }

  // A localized grounding shadow under each prop — the same job a warm
  // `groundShadow` does for a 2D figure/prop, done in real 3D instead of a
  // CSS ellipse. Deliberately NOT a full-width plane: it's sized to this
  // one prop's own actual footprint (a fraction of it, so it reads as
  // contact shading rather than a halo), so it reads as "this object sits
  // on the ground" rather than as a floor band (2026-09-06: no floor
  // treatment of any kind, anywhere — a per-prop contact shadow is not a
  // floor, it's the same grounding cue every 2D prop in this show carries).
  const FOOTPRINT_R: Record<Prop3DKind, number> = {
    coinStack: 0.55,
    receipt: 0.5,
    lockBody: 0.55,
    cardBlock: 0.85,
    box: 0.5,
    shelf: 0,
  };
  // shelf IS the ground-contact surface — it doesn't need its own shadow
  // disc under it (that would just double-darken and look like a smudge).
  const shadowR = spec.kind === "shelf" ? 0 : FOOTPRINT_R[spec.kind] * 0.8 * (spec.scale ?? 1) * pop;

  return (
    <group position={[spec.x, 0, spec.z ?? 0]}>
      {shadowR > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <circleGeometry args={[Math.max(0.001, shadowR), 24]} />
          <meshBasicMaterial color="#2A1B0F" transparent opacity={0.22 * pop} />
        </mesh>
      )}
      <group rotation={[0, idleSpin, 0]} scale={[s, s, s]}>{geo}</group>
    </group>
  );
};

// 2026-09-06: this used to be a locally-duplicated darken function ("avoids
// importing tokens' shade()") — it had the EXACT SAME silent-black bug
// tokens.ts's shade()/tint() had (parseInt on an already-`rgb(...)` string
// returns NaN, which coerces to 0 per channel), just never noticed because
// nothing had passed it an rgb-string color until the `shelf` kind did.
// Two copies of the same fragile logic is how a fixed bug reappears one
// file over — use the one, now-fixed, shared implementation instead.
function shadeHex(hex: string): string {
  return shade(hex, 0.13);
}

export const Stage3D: React.FC<{
  reveal?: number;
  /** 0 = full COLOR.grey, 1 = paper-white — same convention as GreyFloor.
   *  Ignored (no ground mesh at all) when `noGround` is set. */
  groundStrength?: number;
  /** 2026-09-06: no floor treatment of any kind, anywhere — this is now the
   *  default for every real per-beat retrofit. Occupancy mass comes from the
   *  props themselves (sized/positioned as real hero content) plus each
   *  prop's own localized grounding shadow, never a filled or tinted plane. */
  noGround?: boolean;
  props?: Prop3DSpec[];
}> = ({ reveal = 1, groundStrength = 0.38, noGround = true, props = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const groundColor = tint(COLOR.grey, groundStrength);

  return (
    <div style={{ position: "absolute", left: 0, top: (HEIGHT * 2) / 3, width: WIDTH, height: STAGE_H, opacity: reveal, overflow: "hidden" }}>
      <ThreeCanvas width={WIDTH} height={STAGE_H} orthographic camera={{ zoom: 100, position: [9, 7, 9] }}>
        <ambientLight intensity={1.15} />
        <directionalLight position={[5, 9, 4]} intensity={0.4} />
        {!noGround && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[26, 10]} />
            <meshLambertMaterial color={groundColor} />
          </mesh>
        )}
        {props.map((p, i) => (
          <PropMesh key={i} spec={p} frame={frame} fps={fps} />
        ))}
      </ThreeCanvas>
    </div>
  );
};
