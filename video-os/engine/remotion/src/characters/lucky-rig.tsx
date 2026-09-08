import { COLOR } from "../tokens";
import { FigureShape } from "../print/figure";

/**
 * lucky-rig.tsx — TIER 5 (§5.1). Lucky, the recurring character.
 *
 * CHUNKY FLAT-FILL style — the Infographics Show reference (creator, 2026-09-02):
 * ~5 heads tall, generous head, a BARREL torso in a short-sleeve tee (never an
 * A-line triangle), limbs are thick filled capsules with rounded ends and a thin
 * ink outline (never thin strokes), legs ≈ 45% of the figure height.
 *
 * `luckyShape()` → a FigureShape. "edge" mode draws nothing (use `noEdge`).
 * Limb angles are in screen space and multiply by `facing`.
 *
 * When `channels/nif/rigs/lucky.riv` lands this is superseded by <LuckyRive>;
 * `Lucky.tsx` dispatches. Prop surface stays identical.
 */

export type LuckyPose =
  | "stand"
  | "walk"
  | "reach"
  | "point"
  | "sit"
  | "shrug"
  | "armsCrossed"
  | "handsOnHips"
  | "thumbsUp"
  | "showPhone"
  | "typing";
export type LuckyExpression = "neutral" | "happy" | "curious" | "worried" | "surprised" | "flat";

/** Proportion sheet — fractions of total figure height (feet = 0, head crown at ~1). */
const P = {
  /** head radius — big. diameter ≈ 0.21 h → ~5 heads tall. */
  headR: 0.104,
  headCY: 0.885,
  neckY: 0.79,
  shoulderY: 0.76,
  /** barrel torso */
  torsoTopHalfW: 0.13,
  torsoBotHalfW: 0.125,
  hipY: 0.44,
  shoulderJointHalfW: 0.115,
  hipJointHalfW: 0.072,
  upperArm: 0.17,
  foreArm: 0.16,
  /** legs ≈ 45% of height */
  thigh: 0.235,
  shin: 0.225,
  sleeveEnd: 0.1,
} as const;

const TAN = "#F0D3B0"; // skin — light, clearly distinct from the tee
const HAIR = "#171313";
const TEE = "#D99A5B"; // the short-sleeve tee — a warm terracotta tan
const TROU = COLOR.ink; // trousers
const SHOE = COLOR.cardWhite;
const OL = COLOR.outline;

type Pt = { x: number; y: number };
const rad = (d: number) => (d * Math.PI) / 180;
const project = (p: Pt, deg: number, len: number): Pt => ({
  x: p.x + Math.sin(rad(deg)) * len,
  y: p.y + Math.cos(rad(deg)) * len,
});

type Opts = {
  pose?: LuckyPose;
  expression?: LuckyExpression;
  facing?: 1 | -1;
  phase?: number;
  faceless?: boolean;
  screenColor?: string;
  /** OverSimplified read (creator, 2026-09-03): arms, hands, legs, feet are
   *  solid ink with no rendering detail; head + face + tee keep their colour. */
  flatLimbs?: boolean;
  /** Where she's looking. "down" = at her phone / a surface, NOT the camera
   *  (creator, 2026-09-03: "characters don't see or address the camera"). */
  gaze?: "forward" | "down" | "side";
};

export const luckyShape =
  ({ pose = "stand", expression = "neutral", facing = 1, phase = 0, faceless = false, screenColor = "#F4EFE2", flatLimbs = false, gaze = "forward" }: Opts = {}): FigureShape =>
  ({ paint, mode, w, h }) => {
    if (mode === "edge") return null;
    const cx = w / 2;
    const feetY = h;
    const X = (fx: number) => cx + fx * h * facing;
    const Y = (fy: number) => feetY - fy * h;

    const OLW = h * 0.014; // outline weight
    // flatLimbs = OverSimplified: chunky ink strokes (not spidery, not capsules)
    const armThick = flatLimbs ? h * 0.03 : h * 0.052;
    const legThick = flatLimbs ? h * 0.038 : h * 0.064;

    const swing = Math.sin(phase * Math.PI * 2);
    const tap = Math.abs(Math.sin(phase * Math.PI * 4));

    // ── sit: hips at the seat, thighs horizontal, shins vertical to the floor ──
    const sitting = pose === "sit";
    const hipY = sitting ? P.hipY + 0.02 : P.hipY;
    const shoulderY = sitting ? P.shoulderY - 0.05 : P.shoulderY;
    const neckY = sitting ? P.neckY - 0.05 : P.neckY;
    const headCY = sitting ? P.headCY - 0.05 : P.headCY;

    const armPose = (): [number, number, number, number] => {
      switch (pose) {
        case "point":
          return [78, 88, 22, 26];
        case "reach":
          return [60, 66, 24, 28];
        case "thumbsUp":
          return [20, 150, -18, -20];
        case "shrug":
          // shoulders up, upper arms raised out, forearms level → open palms out
          return [58, 100, -58, -100];
        case "armsCrossed":
          return [26, -80, -30, 72];
        case "handsOnHips":
          return [40, -40, -40, 40];
        case "walk":
          return [-swing * 24 + 8, -swing * 24 - 4, swing * 24 + 8, swing * 24 + 12];
        case "showPhone":
          return [30, 70, 34, 74];
        case "typing":
          return [34 - tap * 3, 66 + tap * 6, 38 + tap * 3, 70 + tap * 6];
        case "sit":
          return [24, 34, -22, 32];
        default:
          return [12, 14, -12, -14];
      }
    };
    const legPose = (): { th: [number, number]; kneeAbs?: [Pt, Pt] } => {
      if (sitting) {
        // knees forward at hip height, shins straight down to the floor
        return { th: [0, 0] };
      }
      switch (pose) {
        case "walk":
          return { th: [swing * 20, -swing * 20] };
        default:
          return { th: [5, -5] };
      }
    };

    const [nSh, nEl, fSh, fEl] = armPose().map((a) => a * facing) as [number, number, number, number];
    const lp = legPose();

    // arm roots sit INSIDE the torso silhouette so the shoulder joint is hidden
    const shN: Pt = { x: X(P.shoulderJointHalfW * 0.7), y: Y(shoulderY - 0.015) };
    const shF: Pt = { x: X(-P.shoulderJointHalfW * 0.7), y: Y(shoulderY - 0.015) };
    const hipN: Pt = { x: X(P.hipJointHalfW), y: Y(hipY + 0.01) };
    const hipF: Pt = { x: X(-P.hipJointHalfW), y: Y(hipY + 0.01) };

    const nElP = project(shN, nSh, P.upperArm * h);
    let nHand = project(nElP, nEl, P.foreArm * h);
    const fElP = project(shF, fSh, P.upperArm * h);
    let fHand = project(fElP, fEl, P.foreArm * h);

    // showPhone / typing: force both hands together in front, holding the device
    if (pose === "showPhone" || pose === "typing") {
      const hy = Y(pose === "showPhone" ? 0.56 : 0.5);
      nHand = { x: X(0.07 * facing), y: hy + (pose === "typing" ? tap * h * 0.006 : 0) };
      fHand = { x: X(-0.05 * facing), y: hy + h * 0.01 };
    }

    let nKnee: Pt;
    let nFoot: Pt;
    let fKnee: Pt;
    let fFoot: Pt;
    if (sitting) {
      nKnee = { x: hipN.x + facing * P.thigh * h, y: hipN.y + 0.01 * h };
      fKnee = { x: hipF.x + facing * P.thigh * h * 0.92, y: hipF.y + 0.02 * h };
      nFoot = { x: nKnee.x - facing * 0.02 * h, y: feetY };
      fFoot = { x: fKnee.x - facing * 0.05 * h, y: feetY };
    } else {
      nKnee = project(hipN, lp.th[0] * facing, P.thigh * h);
      nFoot = project(nKnee, lp.th[0] * facing * 0.4, P.shin * h);
      nFoot = { x: nFoot.x, y: feetY };
      fKnee = project(hipF, lp.th[1] * facing, P.thigh * h);
      fFoot = project(fKnee, lp.th[1] * facing * 0.4, P.shin * h);
      fFoot = { x: fFoot.x, y: feetY };
    }

    /** a filled capsule limb. detailed = fill + a thin ink outline; a solid-ink
     *  stick (fill === OL) draws as ONE clean round-capped line. */
    const capsule = (a: Pt, b: Pt, thick: number, fill: string, key: string) =>
      fill === OL ? (
        <line key={key} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={paint(OL)} strokeWidth={thick} strokeLinecap="round" />
      ) : (
        <g key={key}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={paint(OL)} strokeWidth={thick + OLW * 2} strokeLinecap="round" />
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={paint(fill)} strokeWidth={thick} strokeLinecap="round" />
        </g>
      );

    // OverSimplified: limbs collapse to solid ink, no rendering detail.
    const LIMB = flatLimbs ? OL : TAN;
    const SHOE_C = flatLimbs ? OL : SHOE;

    const shoe = (foot: Pt, dir: number, key: string) =>
      flatLimbs ? (
        // OverSimplified foot — a short forward ink nub, round-capped
        <line
          key={key}
          x1={foot.x - dir * legThick * 0.6}
          y1={foot.y}
          x2={foot.x + dir * legThick * 3}
          y2={foot.y}
          stroke={paint(OL)}
          strokeWidth={legThick * 1.5}
          strokeLinecap="round"
        />
      ) : (
        <path
          key={key}
          d={`M ${foot.x - dir * legThick * 0.4} ${foot.y - legThick * 0.5}
              L ${foot.x + dir * legThick * 1.7} ${foot.y - legThick * 0.3}
              Q ${foot.x + dir * legThick * 2.2} ${foot.y - legThick * 0.05} ${foot.x + dir * legThick * 2.05} ${foot.y + legThick * 0.35}
              L ${foot.x - dir * legThick * 0.55} ${foot.y + legThick * 0.35} Z`}
          fill={paint(SHOE_C)}
          stroke={paint(OL)}
          strokeWidth={OLW}
          strokeLinejoin="round"
        />
      );

    const hand = (p: Pt, key: string) => (
      <circle
        key={key}
        cx={p.x}
        cy={p.y}
        r={flatLimbs ? armThick * 0.9 : armThick * 0.62}
        fill={paint(flatLimbs ? OL : TAN)}
        stroke={paint(OL)}
        strokeWidth={flatLimbs ? 0 : OLW}
      />
    );

    /** an arm: shoulder→elbow→hand. Detailed = skin + a tee sleeve; flat = solid ink. */
    const arm = (sh: Pt, elb: Pt, hnd: Pt, thick: number, key: string) => {
      if (flatLimbs) {
        return (
          <g key={key}>
            {capsule(sh, elb, thick, LIMB, key + "u")}
            {capsule(elb, hnd, thick * 0.9, LIMB, key + "f")}
            {hand(hnd, key + "h")}
          </g>
        );
      }
      const sleeveEnd = { x: sh.x + (elb.x - sh.x) * 0.52, y: sh.y + (elb.y - sh.y) * 0.52 };
      return (
        <g key={key}>
          {capsule(sh, elb, thick, TAN, key + "u")}
          {capsule(elb, hnd, thick * 0.88, TAN, key + "f")}
          {capsule(sh, sleeveEnd, thick * 1.12, TEE, key + "s")}
          {hand(hnd, key + "h")}
        </g>
      );
    };

    return (
      <>
        {/* ── PONYTAIL — a fat teardrop off the back of the head ── */}
        {(() => {
          const bx = X(-P.headR * 1.15 * facing);
          const by = Y(headCY + P.headR * 0.2);
          return (
            <path
              d={`M ${bx} ${by}
                  Q ${bx - facing * P.headR * h * 0.9} ${by - P.headR * h * 0.3} ${bx - facing * P.headR * h * 0.7} ${by + P.headR * h * 0.9}
                  Q ${bx - facing * P.headR * h * 0.5} ${by + P.headR * h * 1.5} ${bx + facing * P.headR * h * 0.1} ${by + P.headR * h * 0.7}
                  Q ${bx + facing * P.headR * h * 0.35} ${by + P.headR * h * 0.1} ${bx} ${by} Z`}
              fill={paint(HAIR)}
              stroke={paint(OL)}
              strokeWidth={OLW}
              strokeLinejoin="round"
            />
          );
        })()}

        {/* ── FAR leg + shoe ── */}
        {capsule(hipF, fKnee, legThick, TROU, "fthigh")}
        {capsule(fKnee, fFoot, legThick * 0.9, TROU, "fshin")}
        {shoe(fFoot, -facing, "fshoe")}

        {/* ── FAR arm ── */}
        {arm(shF, fElP, fHand, armThick * 0.94, "farm")}

        {/* ── BARREL TORSO — a soft rounded barrel, tee ── */}
        <path
          d={`M ${X(-P.torsoTopHalfW)} ${Y(shoulderY)}
              Q ${X(0)} ${Y(shoulderY + 0.03)} ${X(P.torsoTopHalfW)} ${Y(shoulderY)}
              C ${X(P.torsoTopHalfW + 0.02)} ${Y(shoulderY - 0.1)} ${X(P.torsoBotHalfW + 0.01)} ${Y(hipY + 0.08)} ${X(P.torsoBotHalfW)} ${Y(hipY)}
              Q ${X(0)} ${Y(hipY - 0.03)} ${X(-P.torsoBotHalfW)} ${Y(hipY)}
              C ${X(-P.torsoBotHalfW - 0.01)} ${Y(hipY + 0.08)} ${X(-P.torsoTopHalfW - 0.02)} ${Y(shoulderY - 0.1)} ${X(-P.torsoTopHalfW)} ${Y(shoulderY)} Z`}
          fill={paint(TEE)}
          stroke={paint(OL)}
          strokeWidth={OLW * 1.4}
          strokeLinejoin="round"
        />

        {/* ── NEAR leg + shoe ── */}
        {capsule(hipN, nKnee, legThick * 1.05, TROU, "nthigh")}
        {capsule(nKnee, nFoot, legThick * 0.95, TROU, "nshin")}
        {shoe(nFoot, facing, "nshoe")}

        {/* ── NEAR arm ── */}
        {arm(shN, nElP, nHand, armThick, "narm")}

        {/* ── phone in-hand (showPhone / typing) ── */}
        {(pose === "showPhone" || pose === "typing") &&
          (() => {
            const mx = (nHand.x + fHand.x) / 2;
            const my = (nHand.y + fHand.y) / 2 - h * 0.012;
            const pw = h * 0.15;
            const ph = h * (pose === "showPhone" ? 0.24 : 0.17);
            const rot = pose === "showPhone" ? -16 * facing : -50 * facing;
            return (
              <g transform={`rotate(${rot} ${mx} ${my})`} key="phone">
                <rect x={mx - pw / 2} y={my - ph / 2} width={pw} height={ph} rx={pw * 0.16} fill={paint(OL)} />
                <rect x={mx - pw / 2 + OLW * 1.4} y={my - ph / 2 + OLW * 1.4} width={pw - OLW * 2.8} height={ph - OLW * 2.8} rx={pw * 0.1} fill={paint(screenColor)} />
              </g>
            );
          })()}

        {/* ── neck ── */}
        {capsule({ x: X(0), y: Y(neckY) }, { x: X(0), y: Y(shoulderY + 0.01) }, armThick * 0.9, TAN, "neck")}

        {/* ── head group — tilts for gaze (down = looking at her phone, not us) ── */}
        <g
          transform={
            gaze === "down"
              ? `rotate(${13 * facing} ${X(0)} ${Y(neckY)})`
              : gaze === "side"
                ? `rotate(${-5 * facing} ${X(0)} ${Y(neckY)})`
                : undefined
          }
        >
        {/* ── head ── */}
        <circle cx={X(0)} cy={Y(headCY)} r={P.headR * h} fill={paint(TAN)} stroke={paint(OL)} strokeWidth={OLW * 1.3} />

        {/* ── hair: a clean rounded bob — cap over the crown, short curtains,
            a fringe line sitting above the eyes ── */}
        <path
          d={`M ${X(-P.headR * 1.02)} ${Y(headCY + P.headR * 0.05)}
              C ${X(-P.headR * 1.06)} ${Y(headCY + P.headR * 0.75)} ${X(-P.headR * 0.55)} ${Y(headCY + P.headR * 1.14)} ${X(0)} ${Y(headCY + P.headR * 1.12)}
              C ${X(P.headR * 0.55)} ${Y(headCY + P.headR * 1.14)} ${X(P.headR * 1.06)} ${Y(headCY + P.headR * 0.75)} ${X(P.headR * 1.02)} ${Y(headCY + P.headR * 0.05)}
              C ${X(P.headR * 1.0)} ${Y(headCY - P.headR * 0.5)} ${X(P.headR * 0.55)} ${Y(headCY - P.headR * 0.55)} ${X(P.headR * 0.55)} ${Y(headCY + P.headR * 0.1)}
              C ${X(P.headR * 0.5)} ${Y(headCY + P.headR * 0.5)} ${X(P.headR * 0.2)} ${Y(headCY + P.headR * 0.62)} ${X(0)} ${Y(headCY + P.headR * 0.6)}
              C ${X(-P.headR * 0.2)} ${Y(headCY + P.headR * 0.62)} ${X(-P.headR * 0.5)} ${Y(headCY + P.headR * 0.5)} ${X(-P.headR * 0.55)} ${Y(headCY + P.headR * 0.1)}
              C ${X(-P.headR * 0.55)} ${Y(headCY - P.headR * 0.55)} ${X(-P.headR * 1.0)} ${Y(headCY - P.headR * 0.5)} ${X(-P.headR * 1.02)} ${Y(headCY + P.headR * 0.05)} Z`}
          fill={paint(HAIR)}
          stroke={paint(OL)}
          strokeWidth={OLW}
          strokeLinejoin="round"
        />

        {!faceless && <Face paint={paint} X={X} Y={Y} h={h} headCY={headCY} headR={P.headR} lw={OLW} expression={expression} gaze={gaze} />}
        </g>
      </>
    );
  };

const Face: React.FC<{
  paint: (c: string) => string;
  X: (fx: number) => number;
  Y: (fy: number) => number;
  h: number;
  headCY: number;
  headR: number;
  lw: number;
  expression: LuckyExpression;
  gaze?: "forward" | "down" | "side";
}> = ({ paint, X, Y, h, headCY, headR, lw, expression, gaze = "forward" }) => {
  // gaze "down": drop the eyes low in the face so she reads as looking at her phone
  const eyeY = headCY - headR * (gaze === "down" ? 0.34 : 0.05);
  const ex = headR * 0.36;
  const mY = headCY - headR * (gaze === "down" ? 0.62 : 0.5);
  const dot = headR * h * 0.11;

  const brows =
    expression === "worried"
      ? [-0.006, 0.006]
      : expression === "curious" || expression === "surprised"
        ? [0.006, -0.006]
        : null;

  return (
    <>
      {brows && (
        <>
          <path d={`M ${X(-ex - headR * 0.2)} ${Y(eyeY + headR * 0.42 + brows[0])} Q ${X(-ex)} ${Y(eyeY + headR * 0.52 + brows[0])} ${X(-ex + headR * 0.2)} ${Y(eyeY + headR * 0.42 - brows[0])}`} fill="none" stroke={paint(COLOR.outline)} strokeWidth={lw} strokeLinecap="round" />
          <path d={`M ${X(ex - headR * 0.2)} ${Y(eyeY + headR * 0.42 - brows[1])} Q ${X(ex)} ${Y(eyeY + headR * 0.52 + brows[1])} ${X(ex + headR * 0.2)} ${Y(eyeY + headR * 0.42 + brows[1])}`} fill="none" stroke={paint(COLOR.outline)} strokeWidth={lw} strokeLinecap="round" />
        </>
      )}

      <circle cx={X(-ex)} cy={Y(eyeY)} r={dot} fill={paint(COLOR.outline)} />
      <circle cx={X(ex)} cy={Y(eyeY)} r={dot} fill={paint(COLOR.outline)} />

      {expression === "surprised" ? (
        <ellipse cx={X(0)} cy={Y(mY)} rx={headR * h * 0.13} ry={headR * h * 0.17} fill={paint(COLOR.outline)} />
      ) : expression === "flat" ? (
        <line x1={X(-headR * 0.22)} y1={Y(mY)} x2={X(headR * 0.22)} y2={Y(mY)} stroke={paint(COLOR.outline)} strokeWidth={lw} strokeLinecap="round" />
      ) : expression === "worried" ? (
        <path d={`M ${X(-headR * 0.22)} ${Y(mY - 0.004)} Q ${X(0)} ${Y(mY + 0.007)} ${X(headR * 0.22)} ${Y(mY - 0.004)}`} fill="none" stroke={paint(COLOR.outline)} strokeWidth={lw} strokeLinecap="round" />
      ) : (
        <path
          d={`M ${X(-headR * (expression === "happy" ? 0.28 : 0.22))} ${Y(mY + 0.003)} Q ${X(0)} ${Y(mY - (expression === "happy" ? 0.013 : 0.008))} ${X(headR * (expression === "happy" ? 0.28 : 0.22))} ${Y(mY + 0.003)}`}
          fill="none"
          stroke={paint(COLOR.outline)}
          strokeWidth={lw}
          strokeLinecap="round"
        />
      )}
    </>
  );
};
