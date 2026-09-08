import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT, tint } from "../../tokens";

/**
 * FIG — the ONE figure-scale band (creator 2026-09-04: "the character is so big
 * … everything needs to be medium scale … not too high, not too long"). Every
 * beat picks from here; no beat hard-codes an `h`. A standing adult reads
 * clearly at ~0.28H without dominating the frame, and the dev at a desk is the
 * same size as the person watching — no more 2× mismatches.
 */
export const FIG = {
  /** Lucky / the person the beat is about — a touch taller so she's the read. */
  hero: Math.round(HEIGHT * 0.3),
  /** any other standing adult (a developer, a passer-by up close). */
  adult: Math.round(HEIGHT * 0.28),
  /** a seated figure (couch / bed / desk chair). */
  seated: Math.round(HEIGHT * 0.26),
  /** a background figure, set back for depth — smaller, never tiny. */
  far: Math.round(HEIGHT * 0.235),
};

/**
 * Figure.tsx — the v4 OverSimplified person (creator, 2026-09-03: "create a lot
 * of characters… they don't have hair, no issues… the action needs to be
 * dynamic… check the script for what the character is doing… the characters
 * don't see or address the camera").
 *
 * One rig, many skins. Thin ink stick limbs, a rounded torso in a tee tone, a
 * 3/4 head that always faces the way the figure is going — never dead-on to
 * camera. Poses map to what a beat's script says the person is DOING; "tap" /
 * "look" / "read" tilt the head down onto a phone held in both hands.
 *
 *   <Figure pose="walk" tee="#C8A97E" x={…} baseline={…} />
 *   <Figure pose="tap"  hair="ponytail" tee={COLOR.orange} facing={1} />   // Lucky
 *
 * `<Walker>` moves a walking Figure along the ground.
 */

export type Pose = "stand" | "walk" | "sit" | "tap" | "read" | "reach" | "point" | "carry" | "look";

/** a minimal expression set — two eye states, a brow, four mouths. */
export type Expr = {
  eyes?: "open" | "wide" | "squint";
  brow?: "none" | "raise" | "furrow";
  mouth?: "none" | "flat" | "open" | "frown" | "smile";
};
/** named presets a beat can drop in without spelling out the parts. */
export const EXPR: Record<string, Expr> = {
  neutral: { eyes: "open", brow: "none", mouth: "flat" },
  think: { eyes: "squint", brow: "furrow", mouth: "flat" },
  surprise: { eyes: "wide", brow: "raise", mouth: "open" },
  worry: { eyes: "wide", brow: "furrow", mouth: "frown" },
  wry: { eyes: "squint", brow: "raise", mouth: "smile" },
};

const rad = (d: number) => (d * Math.PI) / 180;

export const Figure: React.FC<{
  pose?: Pose;
  /** figure height in px (crown to sole, standing). */
  h?: number;
  /** ground x of the feet. */
  x: number;
  /** ground y of the feet. */
  baseline: number;
  facing?: 1 | -1;
  tee?: string;
  /** "ponytail" | "short" | none. */
  hair?: "ponytail" | "short";
  /** walk-cycle / idle phase driver (frames). auto if omitted. */
  phaseFrom?: number;
  /** small idle sway when standing (default on). */
  idle?: boolean;
  /** carried prop, drawn at the hands (carry pose). */
  prop?: React.ReactNode;
  opacity?: number;
  /** a beat can nudge the whole figure (a tap dip, a step). */
  dy?: number;
  /** lift the head and put the phone away — "she looks up" without standing. */
  gazeUp?: boolean;
  /** draws a TV remote in her hand instead of a phone — independent of
   *  gazeUp, so she can hold it while still looking up at the screen
   *  (creator 2026-09-05, NIF003: "why we need the cell phone... she needs
   *  to hold the remote"). Ignored while `phoneInHands` would also fire —
   *  it draws in the same hand-clasp slot as an alternative, not on top. */
  holdRemote?: boolean;
  /** a small expression — Mr-Bean-minimal (creator 2026-09-03: "sometimes she is
   *  thinking… do they have any expressions"). Pairs with a ReactionZoom. */
  expr?: Expr;
  /** "someone" — an outline-only, semi-transparent everyperson for crowds /
   *  abstractions (creator 2026-09-04: "you can create a transparent character
   *  also for everyone"). No tee fill, no face, no hair; lets Lucky stay the
   *  one figure in colour. */
  ghost?: boolean;
}> = ({
  pose = "stand",
  h = 300,
  x,
  baseline,
  facing = 1,
  tee = "#C8A97E",
  hair,
  phaseFrom = 0,
  idle = true,
  prop,
  opacity = 1,
  dy = 0,
  gazeUp = false,
  holdRemote = false,
  expr,
  ghost = false,
}) => {
  const frame = useCurrentFrame();
  const ph = ((frame - phaseFrom) / 17) % 1;
  const s = Math.sin(ph * Math.PI * 2);
  const walking = pose === "walk";
  const onPhone = (pose === "tap" || pose === "read") && !gazeUp;
  const sitting = pose === "sit";
  // sit reads as "sitting, glancing at the phone" — hands in the lap, head down
  // holdRemote is a full replacement for the phone, not an addition — it
  // never draws alongside one (creator 2026-09-05, NIF003: "why we need the
  // cell phone... she needs to hold the remote").
  const phoneInHands = (onPhone || sitting) && !gazeUp && !holdRemote;
  // motion kept small — creator: "the face is up and down… everything in small"
  const bob = walking
    ? Math.abs(s) * -h * 0.014
    : idle && (pose === "stand" || pose === "look")
      ? Math.abs(Math.sin(frame / 52)) * -h * 0.0025
      : onPhone
        ? Math.sin(frame / 46) * h * 0.0016
        : 0;

  const cx = x;
  const feetY = baseline + dy + bob;

  const legT = Math.max(7, h * 0.076) * (ghost ? 0.7 : 1);
  const armT = Math.max(5, h * 0.05) * (ghost ? 0.7 : 1);
  const OL = ghost ? COLOR.grey : COLOR.ink;
  const strokeMain = Math.max(2, h * 0.014) * (ghost ? 0.8 : 1);
  const teeFill = ghost ? "none" : tee;
  const skinFill = ghost ? "none" : tint(COLOR.tan, 0.16);
  const figOpacity = opacity * (ghost ? 0.5 : 1);

  // proportions as fractions of h, measured UP from the feet — a solid little
  // person, not a lollipop. Chunky/geometric per the Infographics-Show read
  // (creator 2026-09-04: "not too high, not too long" + "the character is
  // consistent"): ~2× thicker limbs, shorter legs, a fuller head, lower torso.
  const hipY = sitting ? 0.33 : 0.37;
  const shoulderY = sitting ? 0.58 : 0.69;
  const headCY = sitting ? 0.73 : 0.85;
  const Y = (fy: number) => feetY - fy * h;
  const X = (fx: number) => cx + fx * h * facing;

  // ── legs ─────────────────────────────────────────────────────────────────
  const hipN = { x: X(0.06), y: Y(hipY) };
  const hipF = { x: X(-0.06), y: Y(hipY) };

  const legPath = (root: { x: number; y: number }, near: boolean) => {
    if (sitting) {
      // a real seated bend: thigh forward from the hip to a knee at ~hip
      // height, shin down to a foot planted on the floor. The near leg
      // reaches further forward and its knee sits a touch lower than the far
      // leg's, so the two read as two legs instead of one dark column
      // (creator 2026-09-06: the seated legs were tangling).
      const fwd = near ? 0.30 : 0.19;
      const knee = { x: root.x + facing * h * fwd, y: root.y + h * (near ? 0.03 : -0.02) };
      const foot = { x: root.x + facing * h * (fwd + (near ? 0.05 : 0.02)), y: feetY };
      return { knee, foot };
    }
    if (walking) {
      const swing = (near ? s : -s) * 18;
      const knee = {
        x: root.x + Math.sin(rad(swing)) * h * 0.17 * facing,
        y: root.y - h * 0.185 + Math.abs(Math.sin(rad(swing))) * h * 0.016,
      };
      const lift = near ? Math.max(0, s) * h * 0.025 : Math.max(0, -s) * h * 0.025;
      const foot = { x: knee.x + Math.sin(rad(swing * 0.3)) * h * 0.12 * facing, y: feetY - lift };
      return { knee, foot };
    }
    // standing / posed — legs drop nearly straight, a hair of stance
    const out = near ? 0.02 : -0.02;
    const knee = { x: root.x + facing * h * out * 0.4, y: root.y - h * 0.165 };
    const foot = { x: root.x + facing * h * out, y: feetY };
    return { knee, foot };
  };

  const nLeg = legPath(hipN, true);
  const fLeg = legPath(hipF, false);

  // ── arms ─────────────────────────────────────────────────────────────────
  const shN = { x: X(0.11), y: Y(shoulderY) };
  const shF = { x: X(-0.11), y: Y(shoulderY) };
  const project = (p: { x: number; y: number }, deg: number, len: number) => ({
    x: p.x + Math.sin(rad(deg)) * len * facing,
    y: p.y + Math.cos(rad(deg)) * len,
  });

  // phone / hands-together anchor, in front of the chest (or the lap, seated)
  const handClasp = { x: X(0.1), y: Y(sitting ? hipY + 0.05 : onPhone ? 0.54 : pose === "carry" ? 0.46 : 0.5) };

  let nElbow: { x: number; y: number };
  let nHand: { x: number; y: number };
  let fElbow: { x: number; y: number };
  let fHand: { x: number; y: number };

  if (phoneInHands || pose === "carry") {
    nElbow = { x: X(sitting ? 0.13 : 0.11), y: Y(shoulderY - (sitting ? 0.1 : 0.13)) };
    fElbow = { x: X(sitting ? 0.0 : -0.02), y: Y(shoulderY - (sitting ? 0.1 : 0.13)) };
    nHand = handClasp;
    fHand = { x: handClasp.x - h * 0.02 * facing, y: handClasp.y + h * 0.01 };
  } else if (pose === "reach") {
    nElbow = project(shN, 66, h * 0.17);
    nHand = project(nElbow, 74, h * 0.16);
    fElbow = project(shF, 58, h * 0.17);
    fHand = project(fElbow, 66, h * 0.16);
  } else if (pose === "point") {
    nElbow = project(shN, 74, h * 0.17);
    nHand = project(nElbow, 88, h * 0.17);
    fElbow = project(shF, 24, h * 0.16);
    fHand = project(fElbow, 20, h * 0.15);
  } else if (pose === "look") {
    // one hand up near the chin, thinking / peering
    nElbow = project(shN, 40, h * 0.16);
    nHand = { x: X(0.06), y: Y(headCY - 0.05) };
    fElbow = project(shF, 14, h * 0.16);
    fHand = project(fElbow, 10, h * 0.15);
  } else if (walking) {
    nElbow = project(shN, -s * 24, h * 0.16);
    nHand = project(nElbow, -s * 24 - 6, h * 0.15);
    fElbow = project(shF, s * 24, h * 0.16);
    fHand = project(fElbow, s * 24 - 6, h * 0.15);
  } else if (sitting) {
    // sitting, hands resting on the thighs
    nElbow = project(shN, 24, h * 0.15);
    nHand = { x: X(0.16), y: Y(hipY - 0.02) };
    fElbow = project(shF, 18, h * 0.15);
    fHand = { x: X(0.04), y: Y(hipY - 0.02) };
  } else {
    // stand — arms rest just off the body
    nElbow = project(shN, 12, h * 0.16);
    nHand = project(nElbow, 10, h * 0.15);
    fElbow = project(shF, 9, h * 0.16);
    fHand = project(fElbow, 8, h * 0.15);
  }

  const headDown = phoneInHands || (holdRemote && !gazeUp);
  const headTilt = (gazeUp ? -9 : onPhone ? 22 : sitting ? 18 : pose === "look" ? -12 : 0) * facing;

  const line = (a: { x: number; y: number }, b: { x: number; y: number }, t: number, key: string) => (
    <line key={key} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={OL} strokeWidth={t} strokeLinecap="round" />
  );
  const foot = (p: { x: number; y: number }, key: string) => (
    <ellipse key={key} cx={p.x + facing * legT * 0.7} cy={p.y} rx={legT * 1.5} ry={legT * 0.72} fill={OL} />
  );

  const hr = h * 0.132;
  const hx = X(0);
  const hy = Y(headCY);
  const chin = { x: X(0), y: hy + hr * 0.9 };
  const eyeR = Math.max(2, h * 0.012);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, overflow: "visible", opacity: figOpacity }}
    >
      {/* far leg + arm (behind the torso) */}
      {line(hipF, fLeg.knee, legT * 0.92, "fl1")}
      {line(fLeg.knee, fLeg.foot, legT * 0.86, "fl2")}
      {foot(fLeg.foot, "ff")}
      {line(shF, fElbow, armT * 0.92, "fa1")}
      {line(fElbow, fHand, armT * 0.86, "fa2")}
      <circle cx={fHand.x} cy={fHand.y} r={armT * 0.95} fill={OL} />

      {/* torso — a soft rounded tee, with real width so she reads as a body */}
      <path
        d={`M ${X(-0.17)} ${Y(shoulderY)} Q ${X(0)} ${Y(shoulderY + 0.035)} ${X(0.17)} ${Y(shoulderY)}
            C ${X(0.2)} ${Y(shoulderY - 0.12)} ${X(0.185)} ${Y(hipY + 0.06)} ${X(0.16)} ${Y(hipY)}
            Q ${X(0)} ${Y(hipY - 0.04)} ${X(-0.16)} ${Y(hipY)}
            C ${X(-0.185)} ${Y(hipY + 0.06)} ${X(-0.2)} ${Y(shoulderY - 0.12)} ${X(-0.17)} ${Y(shoulderY)} Z`}
        fill={teeFill}
        stroke={OL}
        strokeWidth={strokeMain}
        strokeLinejoin="round"
      />

      {/* near leg + arm (in front) */}
      {line(hipN, nLeg.knee, legT, "nl1")}
      {line(nLeg.knee, nLeg.foot, legT * 0.94, "nl2")}
      {foot(nLeg.foot, "nf")}
      {line(shN, nElbow, armT, "na1")}
      {line(nElbow, nHand, armT * 0.92, "na2")}
      <circle cx={nHand.x} cy={nHand.y} r={armT} fill={OL} />

      {/* the phone, held in both hands, screen toward the face */}
      {phoneInHands &&
        (() => {
          const pw = h * 0.085;
          const phh = h * 0.15;
          return (
            <g transform={`rotate(${(sitting ? -18 : -30) * facing} ${handClasp.x} ${handClasp.y})`}>
              <rect x={handClasp.x - pw / 2} y={handClasp.y - phh / 2} width={pw} height={phh} rx={pw * 0.16} fill={OL} />
              <rect
                x={handClasp.x - pw / 2 + pw * 0.14}
                y={handClasp.y - phh / 2 + pw * 0.14}
                width={pw * 0.72}
                height={phh - pw * 0.28}
                rx={pw * 0.08}
                fill="#F7EECE"
              />
            </g>
          );
        })()}

      {/* a TV remote, held in the near hand — drawn at the hand's ACTUAL
          resting position (not the phone's handClasp slot), since this can
          be true while gazeUp has already moved her hands to the "resting
          on the thigh" pose. One small orange button, not a screen — this
          is a remote, not a phone. */}
      {holdRemote && !phoneInHands && (() => {
        const rw = h * 0.05;
        const rh = h * 0.155;
        return (
          <g transform={`rotate(${-20 * facing} ${nHand.x} ${nHand.y})`}>
            <rect x={nHand.x - rw / 2} y={nHand.y - rh * 0.62} width={rw} height={rh} rx={rw * 0.4} fill={OL} />
            <circle cx={nHand.x} cy={nHand.y - rh * 0.44} r={rw * 0.22} fill={COLOR.orange} />
            {[0.62, 0.78].map((f, i) => (
              <circle key={i} cx={nHand.x} cy={nHand.y - rh * 0.62 + rh * f} r={rw * 0.16} fill="#F7EECE" />
            ))}
          </g>
        );
      })()}

      {/* a carried prop between the hands */}
      {prop && pose === "carry" && (
        <foreignObject
          x={(nHand.x + fHand.x) / 2 - 60}
          y={(nHand.y + fHand.y) / 2 - 96}
          width={120}
          height={190}
          style={{ overflow: "visible" }}
        >
          <div style={{ width: 120, height: 190, position: "relative" }}>{prop}</div>
        </foreignObject>
      )}

      {/* neck */}
      {line({ x: X(0), y: Y(shoulderY + 0.01) }, chin, armT, "neck")}

      {/* head — a clean oval, turned a little toward `facing`, never square to camera */}
      <g transform={`rotate(${headTilt} ${chin.x} ${chin.y})`}>
        {/* ── HIGH PONYTAIL — a distinct tail that springs up-and-back from the
             very top of the crown, arcs over and tapers to a rounded tip, well
             clear of the head silhouette. a small tie bump at its base. it sways
             a touch. drawn BEHIND the skull. ── */}
        {hair === "ponytail" &&
          (() => {
            // a COMPACT tail — springs from the crown-back, arcs a short way and
            // taps to a tip. ~55% of the v4.1 size (creator 2026-09-04: "whatever
            // the ponytail really doing" — it read as a second head-blob).
            const rootX = hx - facing * hr * 0.3;
            const rootY = hy - hr * 0.8;
            const sway = Math.sin((frame - phaseFrom) / 34) * 4;
            return (
              <g transform={`rotate(${sway * -facing} ${rootX} ${rootY})`}>
                <path
                  d={`M ${rootX - facing * hr * 0.14} ${rootY - hr * 0.02}
                      C ${rootX - facing * hr * 0.7} ${rootY - hr * 0.34} ${rootX - facing * hr * 1.04} ${rootY + hr * 0.2} ${rootX - facing * hr * 0.98} ${rootY + hr * 0.78}
                      C ${rootX - facing * hr * 0.95} ${rootY + hr * 1.14} ${rootX - facing * hr * 0.66} ${rootY + hr * 1.28} ${rootX - facing * hr * 0.52} ${rootY + hr * 1.04}
                      C ${rootX - facing * hr * 0.62} ${rootY + hr * 0.66} ${rootX - facing * hr * 0.44} ${rootY + hr * 0.2} ${rootX + facing * hr * 0.1} ${rootY + hr * 0.22} Z`}
                  fill={COLOR.ink}
                />
                <circle cx={rootX} cy={rootY + hr * 0.14} r={hr * 0.17} fill={COLOR.ink} />
              </g>
            );
          })()}

        {/* skull */}
        <ellipse cx={hx} cy={hy} rx={hr * 0.9} ry={hr} fill={skinFill} stroke={OL} strokeWidth={strokeMain} />

        {/* hair — a smooth cap over the top of the skull, pulled back tight, with a
             clean hairline curving across the forehead (a little peak toward
             `facing`) and tucked behind the ear at the back. */}
        {hair === "ponytail" && (
          <path
            d={`M ${hx - hr * 0.92} ${hy + hr * 0.02}
                C ${hx - hr * 0.98} ${hy - hr * 0.6} ${hx - hr * 0.55} ${hy - hr * 1.02} ${hx + facing * hr * 0.2} ${hy - hr * 1.0}
                C ${hx + facing * hr * 0.78} ${hy - hr * 0.98} ${hx + facing * hr * 0.95} ${hy - hr * 0.52} ${hx + facing * hr * 0.9} ${hy - hr * 0.08}
                C ${hx + facing * hr * 0.66} ${hy - hr * 0.34} ${hx + facing * hr * 0.4} ${hy - hr * 0.22} ${hx + facing * hr * 0.26} ${hy - hr * 0.06}
                C ${hx - facing * hr * 0.1} ${hy - hr * 0.24} ${hx - facing * hr * 0.55} ${hy - hr * 0.22} ${hx - hr * 0.92} ${hy + hr * 0.02} Z`}
            fill={COLOR.ink}
          />
        )}
        {hair === "short" && (
          <path
            d={`M ${hx - hr * 0.96} ${hy + hr * 0.16}
                C ${hx - hr * 1.02} ${hy - hr * 0.5} ${hx - hr * 0.6} ${hy - hr * 1.04} ${hx} ${hy - hr * 1.02}
                C ${hx + hr * 0.6} ${hy - hr * 1.04} ${hx + hr * 1.02} ${hy - hr * 0.5} ${hx + hr * 0.96} ${hy + hr * 0.16}
                C ${hx + hr * 0.56} ${hy - hr * 0.18} ${hx + facing * hr * 0.2} ${hy - hr * 0.04} ${hx} ${hy + hr * 0.04}
                C ${hx - facing * hr * 0.2} ${hy - hr * 0.04} ${hx - hr * 0.56} ${hy - hr * 0.18} ${hx - hr * 0.96} ${hy + hr * 0.16} Z`}
            fill={COLOR.ink}
          />
        )}

        {/* face — minimal. two eyes offset toward `facing`; optional brow + mouth
             carry the expression (Mr-Bean-small). ghost figures have no face. */}
        {!ghost && (() => {
          const eyeY = hy + (headDown ? hr * 0.4 : hr * 0.12);
          const e1x = hx + facing * hr * 0.36;
          const e2x = hx - facing * hr * 0.12;
          const ex = expr?.eyes ?? "open";
          const mo = expr?.mouth ?? "none";
          const br = expr?.brow ?? "none";
          const eye = (cxE: number, scale: number) => {
            if (ex === "squint") return <line key={cxE} x1={cxE - eyeR * 1.4} y1={eyeY} x2={cxE + eyeR * 1.4} y2={eyeY} stroke={OL} strokeWidth={strokeMain} strokeLinecap="round" />;
            const r = eyeR * scale * (ex === "wide" ? 1.6 : 1);
            return <circle key={cxE} cx={cxE} cy={eyeY} r={r} fill={OL} opacity={scale < 1 ? 0.85 : 1} />;
          };
          const my = hy + (headDown ? hr * 0.78 : hr * 0.5);
          const mw = hr * 0.4;
          return (
            <>
              {br !== "none" &&
                [e1x, e2x].map((bx, i) => {
                  const dir = br === "furrow" ? (bx === e1x ? 1 : -1) * facing : (bx === e1x ? -1 : 1) * facing;
                  return <line key={i} x1={bx - eyeR * 1.5} y1={eyeY - hr * 0.34 + dir * eyeR * 1.1} x2={bx + eyeR * 1.5} y2={eyeY - hr * 0.34 - dir * eyeR * 1.1} stroke={OL} strokeWidth={strokeMain} strokeLinecap="round" />;
                })}
              {eye(e1x, 1)}
              {eye(e2x, 0.82)}
              {!headDown && mo === "none" && (
                <line x1={hx + facing * hr * 0.64} y1={hy + hr * 0.28} x2={hx + facing * hr * 0.78} y2={hy + hr * 0.46} stroke={OL} strokeWidth={strokeMain * 0.9} strokeLinecap="round" />
              )}
              {mo === "flat" && <line x1={hx - mw * 0.5} y1={my} x2={hx + mw * 0.5} y2={my} stroke={OL} strokeWidth={strokeMain} strokeLinecap="round" />}
              {mo === "open" && <ellipse cx={hx} cy={my} rx={mw * 0.42} ry={hr * 0.24} fill={OL} />}
              {mo === "frown" && <path d={`M ${hx - mw * 0.5} ${my + hr * 0.12} Q ${hx} ${my - hr * 0.14} ${hx + mw * 0.5} ${my + hr * 0.12}`} fill="none" stroke={OL} strokeWidth={strokeMain} strokeLinecap="round" />}
              {mo === "smile" && <path d={`M ${hx - mw * 0.5} ${my - hr * 0.06} Q ${hx} ${my + hr * 0.2} ${hx + mw * 0.5} ${my - hr * 0.06}`} fill="none" stroke={OL} strokeWidth={strokeMain} strokeLinecap="round" />}
            </>
          );
        })()}
      </g>
    </svg>
  );
};

/**
 * Walker — a Figure that walks from `fromX` to `toX` across `baseline` over
 * [at, at+dur], then stands. Feet stay on the ground.
 */
export const Walker: React.FC<{
  at: number;
  dur: number;
  fromX: number;
  toX: number;
  baseline: number;
  h?: number;
  tee?: string;
  hair?: "ponytail" | "short";
  ghost?: boolean;
  /** hold as "stand" before `at` and after `at+dur`? default true. */
  standEnds?: boolean;
}> = ({ at, dur, fromX, toX, baseline, h = 280, tee, hair, ghost = false, standEnds = true }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(t, [0, 1], [fromX, toX]);
  const facing: 1 | -1 = toX >= fromX ? 1 : -1;
  const walking = frame > at && frame < at + dur;
  if (!standEnds && (frame < at || frame > at + dur)) return null;
  return (
    <Figure pose={walking ? "walk" : "stand"} h={h} x={x} baseline={baseline} facing={facing} tee={tee} hair={hair} ghost={ghost} phaseFrom={at} />
  );
};

export { COLOR as FIGURE_COLOR };
