import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, FONT, HEIGHT, SUPPORT, WIDTH, shade, softShadow, tint } from "../../tokens";
import { Bloom } from "../../parts/Bloom";

import { LOC_GROUND } from "./locations";
import { EXPR, FIG, Figure, Pose, Walker } from "./Figure";
import { V4Beat, useVO } from "./V4Beat";
import { ContactShadow, ReactionZoom } from "./Depth";
import { Lane, Typewriter } from "./KineticText";
import { PhoneTap } from "./PhoneTap";
import { DrawPath, EndpointTag, LabelPill } from "./Reveal";
import { Bar, Chain, Chips, HeroNumber, Ledger, PinPath } from "./panels";
import { Connector, NodeCard } from "./nodegraph";
import { HoldScan, LivePip, Spark } from "./spark";
import { SANS } from "./fonts4";
import { EASE } from "../../parts/motion";
import { DUR, OUT, arc, breathe, driftIdle, enterT, exitT, landPop, lifeT, rise, slideIn } from "./language";
import { dropShadow } from "./light";


/**
 * beats.tsx — NIF002 rebuilt in the v4 language (creator, 2026-09-03: "create a
 * full video with all beats"). One <V4Beat> per beat: the perspective room, the
 * whisper-timed captions, the beat's hero visual, a Playfair punch on the peak.
 *
 * Grounded in episodes/NIF002/04_plan/visual_plan.md (planes / states / peak).
 * Every caption frame comes from timing.json via `useVO(beat).at(word, fb)`.
 */

type VO = ReturnType<typeof useVO>;

/** the OverSimplified Lucky — ponytail, orange tee, a beat-driven pose. `pose2`/
 *  `poseAt` switch what she's doing partway through; `stepTo` slides her a short
 *  distance (a real step, not a teleport) so she is never frozen. Scale comes
 *  from FIG — one medium band for every figure in the episode. */
const LUCKY_H = FIG.hero;
const LuckyAt: React.FC<{
  pose: Parameters<typeof Figure>[0]["pose"];
  pose2?: Parameters<typeof Figure>[0]["pose"];
  poseAt?: number;
  gazeUpAt?: number;
  at?: number;
  x?: number;
  stepTo?: number;
  baseline?: number;
  facing?: 1 | -1;
  h?: number;
  dy?: number;
  /** an expression, optionally only from `exprAt` onward. */
  expr?: Parameters<typeof Figure>[0]["expr"];
  exprAt?: number;
}> = ({ pose, pose2, poseAt, gazeUpAt, at = 0, x = WIDTH * 0.36, stepTo, baseline = LOC_GROUND, facing = 1, h = LUCKY_H, dy = 0, expr, exprAt }) => {
  const frame = useCurrentFrame();
  const t = enterT(frame, at, DUR.enter);
  const cur = pose2 && poseAt !== undefined && frame >= poseAt ? pose2 : pose;
  const stepping = stepTo !== undefined && poseAt !== undefined && frame >= poseAt - 14 && frame < poseAt + 14;
  const px = stepTo === undefined ? x : interpolate(frame, [(poseAt ?? at) - 14, (poseAt ?? at) + 14], [x, stepTo], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const gazeUp = gazeUpAt !== undefined && frame >= gazeUpAt;
  const showExpr = expr && (exprAt === undefined || frame >= exprAt) ? expr : undefined;
  return (
    <>
      <ContactShadow x={px} y={baseline + 2} w={h * 0.5} opacity={0.26} blur={8} squash={1.2} />
      <div style={{ opacity: t }}>
        <Figure pose={stepping ? "walk" : cur} h={h} x={px} baseline={baseline} facing={facing} tee={COLOR.orange} hair="ponytail" phaseFrom={at} dy={dy} gazeUp={gazeUp} expr={showExpr} />
      </div>
    </>
  );
};

/** a background pass-by — an outline-only "someone", so the one figure in
 *  colour is always Lucky (creator 2026-09-04: "a transparent character for
 *  everyone"). */
const Bystander: React.FC<{ at: number; dur: number; fromX: number; toX: number; baseline?: number; tee?: string; h?: number }> = ({ at, dur, fromX, toX, baseline = LOC_GROUND - 4, h = FIG.far }) => (
  <Walker at={at} dur={dur} fromX={fromX} toX={toX} baseline={baseline} h={h} ghost standEnds={false} />
);

/** a developer at the desk who is visibly WORKING — cycles point → reach →
 *  carry every ~2.3 s so the studio never looks like two frozen mannequins
 *  (creator 2026-09-04: "a lot of animation which is not doing anything …
 *  make sure we are doing something"). */
const DeskWorker: React.FC<{ x: number; facing: 1 | -1; tee: string; seed?: number; expr?: Parameters<typeof Figure>[0]["expr"] }> = ({ x, facing, tee, seed = 0, expr }) => {
  const frame = useCurrentFrame();
  const cycle: Pose[] = ["point", "reach", "carry", "reach"];
  const cur = cycle[Math.floor((frame + seed * 37) / 70) % cycle.length];
  return <Figure pose={cur} h={FIG.adult} x={x} baseline={LOC_GROUND} facing={facing} tee={tee} phaseFrom={seed * 13} expr={expr} />;
};

/** a small description packet flying from A to B along an arc. */
const PacketFly: React.FC<{ at: number; fromX: number; fromY: number; toX: number; toY: number; dur?: number }> = ({ at, fromX, fromY, toX, toY, dur = 60 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  if (t <= 0 || t >= 1) return null;
  const x = interpolate(t, [0, 1], [fromX, toX]);
  const y = interpolate(t, [0, 1], [fromY, toY]) - Math.sin(t * Math.PI) * 90;
  return (
    <div style={{ position: "absolute", left: x - 26, top: y - 18, width: 52, height: 36, background: COLOR.cardWhite, border: `2px solid ${COLOR.ink}`, borderRadius: 4, filter: dropShadow("raised", 0.7, 0.2), rotate: `${interpolate(t, [0, 1], [-8, 10])}deg` }}>
      <div style={{ position: "absolute", left: 3, top: 3, right: 3, height: 12, borderBottom: `2px solid ${COLOR.grey}` }} />
      <div style={{ position: "absolute", right: 5, bottom: 4, width: 8, height: 8, borderRadius: "50%", background: COLOR.orange }} />
    </div>
  );
};

/** a stopwatch that is visibly WORKING — the second hand sweeps the whole time
 *  it is on screen (creator 2026-09-03: "the clock is working"). Rises in. */
const Stopwatch: React.FC<{ x: number; y: number; r?: number; at: number; out?: number; spinFrom?: number; label?: string }> = ({ x, y, r = 96, at, out, spinFrom, label }) => {
  const frame = useCurrentFrame();
  const t = lifeT(frame, at, out, DUR.big, DUR.enter);
  if (t <= 0.01) return null;
  const { y: dy } = rise(frame, at, 46, DUR.big);
  const s0 = spinFrom ?? at;
  // one full sweep every ~1s while present — a real mechanism
  const hand = frame >= s0 ? ((frame - s0) / 30) * 300 : 0;
  const b = breathe(frame, 3, 0.01);
  return (
    <div style={{ position: "absolute", left: x, top: y + dy, opacity: t, translate: "-50% -50%", scale: `${b}` }}>
      <svg width={r * 2.4} height={r * 2.7} viewBox={`${-r * 1.2} ${-r * 1.35} ${r * 2.4} ${r * 2.7}`} style={{ overflow: "visible", filter: softShadow(r / 90, 0.22) }}>
        {/* crown + button */}
        <rect x={-r * 0.14} y={-r * 1.28} width={r * 0.28} height={r * 0.2} rx={4} fill={SUPPORT.mustard} stroke={COLOR.ink} strokeWidth={3} />
        <rect x={-r * 0.1} y={-r * 1.4} width={r * 0.2} height={r * 0.14} rx={4} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={3} />
        {/* case + dial */}
        <circle r={r} fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={5} />
        <circle r={r * 0.86} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={3} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const r1 = r * (i % 3 === 0 ? 0.66 : 0.74);
          return <line key={i} x1={Math.sin(a) * r1} y1={-Math.cos(a) * r1} x2={Math.sin(a) * r * 0.8} y2={-Math.cos(a) * r * 0.8} stroke={COLOR.ink} strokeWidth={i % 3 === 0 ? 4 : 2} />;
        })}
        {/* the sweeping wedge — shows time elapsing */}
        <path
          d={`M 0 0 L 0 ${-r * 0.8} A ${r * 0.8} ${r * 0.8} 0 ${((hand % 360) > 180) ? 1 : 0} 1 ${Math.sin((hand % 360) * Math.PI / 180) * r * 0.8} ${-Math.cos((hand % 360) * Math.PI / 180) * r * 0.8} Z`}
          fill={COLOR.orange}
          opacity={0.16}
        />
        {/* the hand */}
        <line x1={0} y1={r * 0.14} x2={Math.sin((hand % 360) * Math.PI / 180) * r * 0.78} y2={-Math.cos((hand % 360) * Math.PI / 180) * r * 0.78} stroke={COLOR.orange} strokeWidth={4} strokeLinecap="round" />
        <circle r={r * 0.07} fill={COLOR.ink} />
        {label && <text x={0} y={r * 0.44} textAnchor="middle" fontFamily={FONT.mono} fontSize={r * 0.16} letterSpacing="0.08em" fill={COLOR.grey}>{label}</text>}
      </svg>
    </div>
  );
};

/** a coin that arcs A→B, spinning (scaleX flip fakes the turn), lands with a
 *  small settle. Value shows on the face. */
const Coin: React.FC<{ at: number; fromX: number; fromY: number; toX: number; toY: number; dur?: number; face?: string }> = ({ at, fromX, fromY, toX, toY, dur = 44, face = "1¢" }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = arc(frame, at, dur);
  const x = interpolate(p, [0, 1], [fromX, toX]);
  const y = interpolate(p, [0, 1], [fromY, toY]) - Math.sin(p * Math.PI) * 120;
  const flip = Math.abs(Math.cos((frame - at) / 3));
  const land = frame > at + dur ? interpolate(frame, [at + dur, at + dur + 8, at + dur + 16], [1, 1.12, 1], { extrapolateRight: "clamp", easing: OUT }) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: `${Math.max(0.12, flip)} 1`, opacity: p < 1 || frame < at + dur + 40 ? 1 : interpolate(frame, [at + dur + 40, at + dur + 70], [1, 0], { extrapolateRight: "clamp" }) }}>
      <div style={{ width: 60 * land, height: 60 * land, borderRadius: "50%", background: `radial-gradient(circle at 34% 32%, ${tint(SUPPORT.mustard, 0.5)}, ${SUPPORT.mustard} 62%, ${shade(SUPPORT.mustard, 0.2)})`, border: `3px solid ${COLOR.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22, color: COLOR.ink, filter: softShadow(0.7, 0.22) }}>
        {flip > 0.5 ? face : ""}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// B00 — signature + the claim
// ═══════════════════════════════════════════════════════════════════════════
export const B00v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B00");
  return (
    <V4Beat props={props} beat="B00" location="street" push={[1, 1.03]} zooms={[{ at: 196, hold: 30, x: "30%", y: "52%", scale: 1.4 }]}>
      <B00Content vo={vo} />
    </V4Beat>
  );
};
const B00Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const ran = vo.at("ran", 180);
  const auction = vo.at("auction", 204);
  const walkEnd = 150;
  const tapAt = 164;
  const heroOut = 148;
  const heroVeil = frame < heroOut ? enterT(frame, 2, DUR.big) : exitT(frame, heroOut, 20);
  return (
    <>
      {/* street life — one figure crosses the whole beat */}
      <Bystander at={0} dur={250} fromX={-160} toX={WIDTH * 1.15} />

      {/* Lucky walks in under the title, then stops and taps */}
      {frame < walkEnd ? (
        <Walker at={14} dur={walkEnd - 14} fromX={-WIDTH * 0.06} toX={WIDTH * 0.3} baseline={LOC_GROUND} h={LUCKY_H} tee={COLOR.orange} hair="ponytail" />
      ) : (
        <LuckyAt
          pose="tap"
          pose2="look"
          poseAt={auction}
          gazeUpAt={auction}
          at={walkEnd}
          x={WIDTH * 0.3}
          baseline={LOC_GROUND}
          expr={EXPR.surprise}
          exprAt={auction + 4}
          dy={frame > tapAt && frame < tapAt + 8 ? 6 : frame > auction && frame < auction + 12 ? -5 : 0}
        />
      )}

      {/* channel signature — a title card over a soft cream veil, then it lifts */}
      {heroVeil > 0.01 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: COLOR.paper, opacity: heroVeil * 0.62, pointerEvents: "none" }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: HEIGHT * 0.3,
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 150,
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: COLOR.ink,
              opacity: frame < heroOut ? 1 : exitT(frame, heroOut, 20),
              translate: `0px ${frame < heroOut ? 0 : (1 - exitT(frame, heroOut, 20)) * -34}px`,
              filter: dropShadow("floating", 1.7, 0.2),
            }}
          >
            {["Nothing", "is", "free."].map((w, i) => {
              const t = enterT(frame, 6 + i * 16, DUR.enter);
              return (
                <span key={i} style={{ display: i === 1 ? "inline" : "block", opacity: t, translate: `0px ${(1 - t) * 24}px`, marginRight: i === 1 ? 22 : 0, color: i === 2 ? COLOR.orange : COLOR.ink }}>
                  {w}
                </span>
              );
            })}
          </div>
        </>
      )}

      {frame >= ran - 6 && (
        <Bloom window={[auction - 4, auction + 10, auction + 60, auction + 100]} radius={340} x="30%" y="54%" intensity={0.4} />
      )}

      <Lane
        tail={16}
        items={[
          { text: "The app that just charged you nothing…", at: vo.at("and", 62), size: 40 },
          { punch: "AUCTION", kicker: "Ran an", sub: "— the second you opened it.", at: auction, size: 176 },
        ]}
      />
    </>
  );
};
// ═══════════════════════════════════════════════════════════════════════════
// B01 — the half-second, priced
// ═══════════════════════════════════════════════════════════════════════════
export const B01v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B01");
  return (
    <V4Beat props={props} beat="B01" bareRoom dots source="OpenRTB spec">
      <B01Content vo={vo} />
    </V4Beat>
  );
};
/**
 * B01 — the choreographed reference beat (creator 2026-09-03: "the background is
 * coming in for the first two seconds, then Lucky, then the phone, the clock is
 * working, the card comes in… documentary storytelling"). A layered build:
 *   field/grid settle → Lucky walks in → phone in + tap → stopwatch sweeping →
 *   the description packet arcs to an AD EXCHANGE card → companies fan out and
 *   count up → one pays, a 1¢ coin arcs back → the closing list.
 * Every element has a real entrance and does something while it is on screen.
 */
const B01_LUCKY_H = FIG.hero;
const B01Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const half = vo.at("half", 35);
  const tapWord = vo.at("tap", 139);
  const sends = vo.at("sends", 266);
  const few = vo.at("few", 364);
  const cent = vo.at("cent", 514);
  const notice = vo.at("notice", 600, 0) || 600;
  const prices = vo.at("prices", 761, 0) || 761;
  const every = vo.at("every", 845);

  const phoneIn = tapWord - 20;
  const tapAt = tapWord + 16;
  const swAt = tapAt + 14;
  const netOut = every - 30;

  // LEFT anchor — Lucky + her phone. RIGHT — the exchange stack, then a company
  // field further right. Each owns its own column; nothing overlaps.
  const luckyX = WIDTH * 0.2;
  const phoneX = WIDTH * 0.32;
  const phoneY = HEIGHT * 0.44;
  const exchX = WIDTH * 0.46;
  const exchY = HEIGHT * 0.1;
  const fieldX = WIDTH * 0.78;
  const fieldY = HEIGHT * 0.36;

  const visuals = (
    <>
      {/* 1 — Lucky walks in, taps, watches, then a dry look when the penny lands */}
      {frame < phoneIn - 4 ? (
        <Walker at={8} dur={phoneIn - 16} fromX={-WIDTH * 0.05} toX={luckyX} baseline={LOC_GROUND} h={B01_LUCKY_H} tee={COLOR.orange} hair="ponytail" />
      ) : (
        <LuckyAt
          pose="tap"
          pose2="look"
          poseAt={notice}
          gazeUpAt={notice}
          at={phoneIn - 6}
          x={luckyX}
          h={B01_LUCKY_H}
          baseline={LOC_GROUND}
          expr={EXPR.wry}
          exprAt={cent + 24}
          dy={frame > tapAt && frame < tapAt + 8 ? 6 : 0}
        />
      )}

      {/* 2 — the phone, close beside her; thumb presses; a quick push in + back */}
      <PhoneTap at={phoneIn} tapAt={tapAt} screen="app" x={phoneX} y={phoneY} w={166} out={netOut + 30} />

      {/* 3 — a stopwatch, top-right, visibly running the whole middle of the beat */}
      <Stopwatch x={WIDTH * 0.9} y={HEIGHT * 0.17} r={96} at={swAt} out={notice + 30} label="0.5 s" />

      {/* 4 — the description packet peels off the phone and arcs to the exchange */}
      {frame >= sends - 4 && frame < few + 30 && (
        <PacketFly at={sends} fromX={phoneX + 80} fromY={phoneY - 30} toX={exchX + 120} toY={exchY + 150} dur={52} />
      )}

      {/* 5 — the AD EXCHANGE node + a connector from the phone to it */}
      {frame >= sends + 28 && frame < netOut && (
        <>
          <Connector
            a={[phoneX + 95, phoneY - 40]}
            b={[exchX + 30, exchY + 160]}
            at={sends + 28}
            out={netOut}
            label="your description"
            token={1}
            bow={110}
          />
          <NodeCard x={exchX} y={exchY} w={330} at={sends + 32} out={netOut} variant="black" from="t" eyebrow="receives" title="Ad exchange" />
        </>
      )}

      {/* 6 — companies read it: a scattered field on the right + a clean count
             directly under the exchange card (own columns, no overlap) */}
      {frame >= few - 4 && frame < netOut + 6 && (
        <>
          <Chips cx={fieldX} cy={fieldY} count={70} at={few} spread={190} tone={COLOR.cardWhite} chip={22} />
          <div style={{ position: "absolute", left: exchX, top: exchY + 170, width: 330, textAlign: "center", scale: `${breathe(frame, 1, 0.016)}` }}>
            <HeroInline at={vo.at("hundred", 405)} to={287} size={104} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.grey, marginTop: 2 }}>companies read it</div>
          </div>
        </>
      )}

      {/* 7 — one pays: a 1¢ coin arcs back down into Lucky's hand */}
      {frame >= cent - 2 && frame < notice + 30 && (
        <Coin at={cent + 6} fromX={fieldX} fromY={fieldY} toX={luckyX + 46} toY={LOC_GROUND - B01_LUCKY_H * 0.42} dur={40} face="1¢" />
      )}

      {/* 8 — the tail: three ledger cards, fixed width, motif only (text is in the lane) */}
      {frame >= prices - 4 && (
        <div style={{ position: "absolute", left: WIDTH * 0.36, top: HEIGHT * 0.14, display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { tag: "01", motif: "chain", at: every },
            { tag: "02", motif: "price", at: vo.at("attention", 987, 1) },
            { tag: "03", motif: "who", at: vo.at("who", 1090) },
          ].map((r, i) => {
            const e = slideIn(frame, r.at, 80, DUR.big);
            const d = driftIdle(frame, i * 2);
            const hero = i === 2;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  width: 468,
                  padding: "16px 22px",
                  background: hero ? COLOR.orange : COLOR.cardWhite,
                  border: `2px solid ${COLOR.ink}`,
                  borderRadius: 14,
                  opacity: e.opacity,
                  translate: `${e.x + d.x}px ${d.y}px`,
                  rotate: `${d.rot}deg`,
                  filter: softShadow(1, 0.18),
                }}
              >
                <span style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.12em", color: hero ? COLOR.cardWhite : COLOR.grey }}>{r.tag}</span>
                <TailMotif kind={r.motif} at={r.at + 8} hero={hero} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* the scene, with a reaction push toward Lucky the moment the penny lands */}
      <ReactionZoom at={cent + 20} hold={26} x="19%" y="52%" zoom={1.5}>
        {visuals}
      </ReactionZoom>

      <Lane
        items={[
          { punch: "HALF SECOND", kicker: "Here is the", at: half, size: 140 },
          { text: "You tap a free app.", at: tapWord, size: 42 },
          { text: "Before the first screen finishes drawing, it sends a small description of you — to an ad exchange.", at: sends, size: 34 },
          { text: "A few hundred companies read it.", at: few, size: 38 },
          { punch: "≈ 1¢", kicker: "One of them pays", sub: "to put an ad on your screen", at: cent + 4, size: 160 },
          { text: "All of it finishes before you notice.", at: notice, size: 40 },
          { text: "This episode prices that half second: every company that gets paid, in order.", at: prices, size: 34 },
          { text: "What your attention actually costs — and who set that price.", at: vo.at("attention", 987, 1), size: 36 },
        ]}
      />
    </>
  );
};

/** a tiny motif for a tail card — a picture of the point, not words. */
const TailMotif: React.FC<{ kind: string; at: number; hero?: boolean }> = ({ kind, at, hero }) => {
  const frame = useCurrentFrame();
  const t = enterT(frame, at, DUR.enter);
  const ink = hero ? COLOR.cardWhite : COLOR.ink;
  const acc = hero ? COLOR.cardWhite : COLOR.orange;
  return (
    <svg width={190} height={40} viewBox="0 0 190 40" style={{ overflow: "visible", opacity: t }}>
      {kind === "chain" &&
        [0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={16 + i * 34} cy={20} r={13} fill="none" stroke={i === 2 ? acc : ink} strokeWidth={4} opacity={interpolate(frame, [at + i * 4, at + i * 4 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        ))}
      {kind === "price" && (
        <g>
          <path d="M 8 8 L 44 8 L 60 24 L 32 40 L 8 24 Z" fill="none" stroke={ink} strokeWidth={4} />
          <circle cx={20} cy={18} r={4} fill={acc} />
          <line x1={78} y1={14} x2={180} y2={14} stroke={ink} strokeWidth={4} strokeDasharray="3 6" />
          <line x1={78} y1={28} x2={140} y2={28} stroke={acc} strokeWidth={6} />
        </g>
      )}
      {kind === "who" && (
        <g>
          <circle cx={20} cy={14} r={9} fill="none" stroke={ink} strokeWidth={4} />
          <path d="M 6 40 Q 20 24 34 40" fill="none" stroke={ink} strokeWidth={4} />
          <text x={54} y={30} fontFamily={FONT.mono} fontSize={22} fontWeight={700} fill={acc}>?</text>
          <line x1={78} y1={20} x2={180} y2={20} stroke={ink} strokeWidth={4} strokeDasharray="3 6" />
        </g>
      )}
    </svg>
  );
};
const HeroInline: React.FC<{ at: number; to: number; suffix?: string; prefix?: string; size?: number }> = ({ at, to, suffix = "", prefix = "", size = 64 }) => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [at, at + 50], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, color: COLOR.orange, letterSpacing: "-0.02em" }}>{prefix}{Math.round(n).toLocaleString("en-US")}{suffix}</div>;
};

// ═══════════════════════════════════════════════════════════════════════════
// B02 — the honest part: 97% free, not the villain
// ═══════════════════════════════════════════════════════════════════════════
export const B02v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B02");
  return (
    <V4Beat props={props} beat="B02" location="office" source="Statista / Google Play, 2024" zooms={[{ at: 616, hold: 40, x: "42%", y: "56%", scale: 1.3 }]}>
      <B02Content vo={vo} />
    </V4Beat>
  );
};
const B02Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const ninetySeven = vo.at("97", 199);
  const villain = vo.at("villain", 620);
  const model = vo.at("model", 709);
  const used = vo.at("used", 863);
  const every = vo.at("every", 1032);
  const me = vo.at("me", 1136);
  return (
    <>
      {/* the studio: two devs WORKING at the desk; Lucky, the user, a step
          away — same size as them (creator 2026-09-04: medium, no gaps) */}
      <DeskWorker x={WIDTH * 0.2} facing={1} tee={SUPPORT.teal} seed={0} expr={frame > villain ? EXPR.neutral : undefined} />
      <DeskWorker x={WIDTH * 0.31} facing={-1} tee={SUPPORT.mustard} seed={1} />

      <LuckyAt pose="tap" pose2="look" poseAt={villain} gazeUpAt={villain} at={6} x={WIDTH * 0.66} baseline={LOC_GROUND} facing={-1} />
      <PhoneTap at={vo.at("first", 6)} tapAt={vo.at("app", 102, 0)} screen="app" x={WIDTH * 0.78} y={HEIGHT * 0.52} w={148} out={ninetySeven - 16} />

      {/* 97% — ONE compact unit, high in the frame, clear of the figures: a
          100-dot square (dark = free, orange = the 3% who pay) beside the big
          number. (creator screenshots 4–5: the old grid buried the number.) */}
      {frame >= ninetySeven - 6 && frame < villain - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.05, display: "flex", justifyContent: "center", alignItems: "center", gap: 44, opacity: lifeT(frame, ninetySeven, villain - 12, DUR.big, DUR.enter) }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 19px)", gap: 5 }}>
            {Array.from({ length: 100 }).map((_, i) => {
              const on = interpolate(frame, [ninetySeven + 8, ninetySeven + 52], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const pays = i >= 97;
              const lit = i < on;
              return <div key={i} style={{ width: 19, height: 19, borderRadius: 3, background: pays ? COLOR.orange : lit ? COLOR.ink : COLOR.grid, opacity: pays || lit ? 1 : 0.3 }} />;
            })}
          </div>
          <div>
            <HeroInline at={ninetySeven + 6} to={97} suffix="%" size={116} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: COLOR.grey, marginTop: -4 }}>cost nothing upfront</div>
          </div>
        </div>
      )}
      <Spark at={ninetySeven + 54} x="34%" y="16%" r={240} intensity={0.4} />
      {frame >= ninetySeven + 90 && frame < villain - 10 && <LivePip x={WIDTH * 0.5 - 40} y={HEIGHT * 0.34} at={ninetySeven + 90} label="≈ 3% EVER PAY" />}

      {/* the close — Lucky used the apps, never clicked; a coin still trickles
          from her to the studio for each one */}
      {frame >= every - 4 && frame < me + 20 && (
        <>
          <Coin at={every + 4} fromX={WIDTH * 0.52} fromY={LOC_GROUND - 120} toX={WIDTH * 0.3} toY={LOC_GROUND - 90} dur={44} face="¢" />
          <Coin at={every + 34} fromX={WIDTH * 0.54} fromY={LOC_GROUND - 110} toX={WIDTH * 0.24} toY={LOC_GROUND - 80} dur={44} face="¢" />
        </>
      )}

      <Lane
        items={[
          { text: "First, the honest part. A free app is usually a good deal for you.", at: vo.at("first", 4), size: 38 },
          { text: "97% of the apps you can install cost nothing upfront — almost nobody pays for apps.", at: ninetySeven, size: 34 },
          { punch: "NOT THE VILLAIN", kicker: "The developer is", at: villain, size: 112 },
          { text: "They picked the only model that pays the rent — this auction.", at: model, size: 36 },
          { text: "I used these apps all day and never clicked an ad. Every one still made money off me.", at: used, size: 34 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B03 — the rent: $390B, 80¢, a rounding error
// ═══════════════════════════════════════════════════════════════════════════
export const B03v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B03");
  return (
    <V4Beat props={props} beat="B03" bareRoom dots source="In-app ad spend — industry estimate, 2025" push={[1, 1.04]}>
      <B03Content vo={vo} />
    </V4Beat>
  );
};
const B03Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const spend = vo.at("390", 147);
  const eighty = vo.at("80", 390);
  const running = vo.at("running", 794);
  const rounding = vo.at("rounding", 1010);
  const io = frame < rounding - 12 ? 1 : exitT(frame, rounding - 12, 18);
  // the auctions/hour churn — a real ticking mechanism
  const churn = 3_100_000_000 + Math.floor(((frame - running) / 3) % 900) * 1_000_000;
  return (
    <>
      <div style={{ opacity: io }}>
        <HeroNumber at={spend} to={390} prefix="$" suffix="B" sub="A YEAR, ON ADS INSIDE PHONE APPS" size={230} y={HEIGHT * 0.2} />
        <Spark at={spend + 82} x="50%" y="30%" r={340} intensity={0.42} />
        {frame >= eighty - 6 && (
          <div style={{ position: "absolute", left: WIDTH * 0.16, right: WIDTH * 0.16, top: HEIGHT * 0.52 }}>
            <Bar x={0} y={0} w={WIDTH * 0.68} h={70} at={eighty} frac={0.82} labelText="of every phone-ad dollar now moves through this auction" />
          </div>
        )}
        {frame >= running - 6 && frame < rounding - 12 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.66, textAlign: "center", opacity: enterT(frame, running, DUR.big) }}>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 88, color: COLOR.ink, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
              {churn.toLocaleString("en-US")}
            </span>
            <div style={{ fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.14em", textTransform: "uppercase", color: COLOR.grey, marginTop: 6 }}>auctions / hour · fractions of a cent each</div>
            <LivePip x={WIDTH * 0.5 - 40} y={HEIGHT * 0.72} at={running + 10} label="RIGHT NOW" />
          </div>
        )}
      </div>

      {/* the reversal — a full-width bar with a microscopic orange sliver = you */}
      {frame >= rounding - 8 && (
        <>
          <div style={{ position: "absolute", left: WIDTH * 0.1, right: WIDTH * 0.1, top: HEIGHT * 0.3, height: 46, background: COLOR.cardWhite, border: `2px solid ${COLOR.ink}`, borderRadius: 8, opacity: enterT(frame, rounding, DUR.big), overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: COLOR.orange }} />
          </div>
          <div style={{ position: "absolute", left: WIDTH * 0.1, top: HEIGHT * 0.3 + 56, fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.1em", color: COLOR.orange, opacity: enterT(frame, rounding + 10, DUR.enter) }}>↑ YOU, ONE AUCTION</div>
        </>
      )}

      <Lane
        items={[
          { text: "And it is a big rent.", at: vo.at("rent", 8), size: 44 },
          { text: "Around $390 billion a year — on ads inside phone apps.", at: spend, size: 36 },
          { text: "Eighty cents of every phone-ad dollar now moves through this kind of auction.", at: eighty, size: 34 },
          { text: "Billions of them an hour, each worth a fraction of a cent.", at: running, size: 34 },
          { punch: "ROUNDING ERROR", kicker: "You are a", sub: "that happens, constantly.", at: rounding + 6, size: 124 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B04 — the packet is you
// ═══════════════════════════════════════════════════════════════════════════
export const B04v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B04");
  return (
    <V4Beat props={props} beat="B04" bareRoom dots source="US Senate (Wyden) 2021; FTC data-broker filings" zooms={[{ at: 1284, hold: 30, x: "50%", y: "40%", scale: 1.3 }]}>
      <B04Content vo={vo} />
    </V4Beat>
  );
};
const B04Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const tapW = vo.at("tap", 24);
  const sends = vo.at("sends", 205);
  const exch = vo.at("exchange", 346);
  const describes = vo.at("describes", 432);
  const agreed = vo.at("agreed", 945);
  const packet = vo.at("packet", 1108);
  const you = vo.atLast("you", 1286); // "you" is said 8× in B04 — take the last
  const cardOut = packet - 6;

  const cardX = WIDTH * 0.42;
  const cardY = HEIGHT * 0.1;

  return (
    <>
      {/* Lucky taps (left); the phone shows it; a quick push in on the tap */}
      <LuckyAt pose="tap" pose2="look" poseAt={packet} gazeUpAt={packet} at={4} x={WIDTH * 0.16} baseline={LOC_GROUND}
        expr={EXPR.worry} exprAt={packet + 8}
        dy={frame > tapW + 14 && frame < tapW + 22 ? 5 : 0} />
      <PhoneTap at={vo.at("start", 4)} tapAt={tapW + 16} screen="app" x={WIDTH * 0.3} y={HEIGHT * 0.52} w={150} out={cardOut} />

      {/* the request skips its own company and goes to an exchange */}
      {frame >= sends + 10 && frame < cardOut && (
        <>
          <Connector a={[WIDTH * 0.26, HEIGHT * 0.5]} b={[cardX + 10, cardY + 170]} at={sends + 10} out={cardOut} label="not its own company" token={1} bow={40} />
          <NodeCard x={cardX} y={cardY} w={470} at={describes - 8} out={cardOut} variant="white" from="t" eyebrow="the request — what it says about you"
            title="" body={"advertising ID    a4f2-…-91\nrough location    24.9°N, 67.1°E\nphone model       iPhone 14\ncarrier           —\napp opened        word game\ntime of day       21:47\n+ what the ad code already knows"} />
          <HoldScan x={cardX} y={cardY} w={470} h={HEIGHT * 0.34} from={describes + 20} to={cardOut} period={140} />
          <LivePip x={cardX + 20} y={cardY + HEIGHT * 0.36} at={describes + 30} label="READING YOU" />
        </>
      )}
      <Spark at={sends + 48} x={`${((cardX + 20) / WIDTH) * 100}%`} y={`${((cardY + 170) / HEIGHT) * 100}%`} r={200} intensity={0.4} />

      {/* the consent screen you tapped past — the box ticks itself as it lands */}
      {frame >= agreed - 6 && frame < packet && (() => {
        const tick = interpolate(frame, [agreed + 16, agreed + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });
        return (
          <div style={{ position: "absolute", left: WIDTH * 0.12, top: HEIGHT * 0.34, width: 300, padding: "18px 20px", background: COLOR.cardWhite, border: `2px solid ${COLOR.grid}`, borderRadius: 12, opacity: enterT(frame, agreed, DUR.big), rotate: "-3deg", filter: softShadow(1, 0.16) }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, color: COLOR.grey }}>Personalised ads</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: tick > 0.5 ? COLOR.orange : COLOR.cardWhite, border: `2px solid ${COLOR.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={14} height={14} viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" fill="none" stroke={COLOR.cardWhite} strokeWidth={2.4} strokeDasharray={16} strokeDashoffset={16 * (1 - tick)} /></svg>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 15, color: COLOR.grey }}>you agreed on a setup screen you tapped past</span>
            </div>
          </div>
        );
      })()}

      {/* the card compresses to a packet — and the packet is you */}
      {frame >= packet - 6 && frame < packet + 46 && (
        <PacketFly at={packet} fromX={cardX + 120} fromY={cardY + 150} toX={WIDTH * 0.5} toY={HEIGHT * 0.42} dur={40} />
      )}

      <Lane
        tail={14}
        items={[
          { text: "Start with the tap. Before it shows you anything, the app builds a request and sends it out.", at: vo.at("start", 4), size: 34 },
          { text: "Not to its own company — to an ad exchange. The request is tiny, and it describes you.", at: exch, size: 34 },
          { text: "You agreed to this — on a setup screen you tapped past.", at: agreed, size: 36 },
          { text: "That whole description compresses to one small packet.", at: packet, size: 36 },
          { punch: "YOU", kicker: "What's sold is not the screen — it's", at: you, size: 240 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B05 — the kits
// ═══════════════════════════════════════════════════════════════════════════
export const B05v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B05");
  return (
    <V4Beat props={props} beat="B05" bareRoom dots source="Third-party tracking research (Binns et al. 2018; Exodus Privacy)">
      <B05Content vo={vo} />
    </V4Beat>
  );
};
const B05Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const borrow = vo.at("borrow", 212);
  const kit = vo.at("kit", 503);
  const ten = vo.at("10", 697);
  const dozen = vo.at("dozen", 873);
  const monday = vo.at("monday", 1130);
  const thursday = vo.at("thursday", 1240);
  const installed = vo.at("installed", 1294);
  return (
    <>
      {/* the app icon, centre; kits drop into a slow-turning ring around it */}
      {frame >= borrow - 6 && frame < monday - 30 && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 - 120, top: HEIGHT * 0.3, width: 240, height: 240, borderRadius: 52, background: COLOR.orange, border: `4px solid ${COLOR.ink}`, opacity: lifeT(frame, borrow, monday - 30, DUR.big, DUR.enter), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 120, color: COLOR.cardWhite, filter: softShadow(1.3, 0.22), scale: `${breathe(frame, 0, 0.012)}` }}>A</div>
      )}
      {frame >= kit - 4 && frame < monday - 30 && (
        <>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = kit + i * 16;
            const t = enterT(frame, a, DUR.big);
            const ring = 230;
            const spin = (frame - kit) / 200;
            const ang = (i / 10) * Math.PI * 2 + spin;
            return (
              <div key={i} style={{ position: "absolute", left: WIDTH * 0.5 + Math.cos(ang) * ring * t - 28, top: HEIGHT * 0.3 + 120 + Math.sin(ang) * ring * 0.62 * t - 18, width: 56, height: 36, borderRadius: 7, background: COLOR.cardWhite, border: `2.5px solid ${COLOR.ink}`, opacity: t, filter: softShadow(0.6, 0.14) }} />
            );
          })}
          {Array.from({ length: 10 }).map((_, i) => <Spark key={i} at={kit + i * 16 + 6} x="50%" y="47%" r={130} intensity={0.35} />)}
          <LabelPill at={ten + 14} x={WIDTH * 0.5} y={HEIGHT * 0.63} size={30}>≈ 10 KITS IN A TYPICAL FREE APP</LabelPill>
          {frame >= dozen - 4 && <LabelPill at={dozen} x={WIDTH * 0.5} y={HEIGHT * 0.7} size={24}>NEWS / WEATHER APPS: 2–3 DOZEN</LabelPill>}
        </>
      )}

      {/* Monday's shopping app → Thursday's word game: a kit carries you across */}
      {frame >= monday - 6 && frame < installed - 10 && (
        <>
          <NodeCard x={WIDTH * 0.12} y={HEIGHT * 0.22} w={280} at={monday - 4} out={installed - 12} variant="white" from="l" eyebrow="monday" title="Shopping app" />
          <NodeCard x={WIDTH * 0.6} y={HEIGHT * 0.22} w={280} at={monday + 10} out={installed - 12} variant="white" from="r" eyebrow="thursday" title="Word game" />
          <Connector a={[WIDTH * 0.12 + 280, HEIGHT * 0.28]} b={[WIDTH * 0.6, HEIGHT * 0.28]} at={thursday - 20} out={installed - 12} label="same kit, same you" token="K" bow={70} />
        </>
      )}

      {/* the reveal — one app, ten companies */}
      {frame >= installed - 6 && (
        <Chips cx={WIDTH * 0.5} cy={HEIGHT * 0.34} count={10} at={installed} spread={230} tone={COLOR.cardWhite} chip={38} />
      )}

      <Lane
        tail={12}
        items={[
          { text: "How does a word game know your age? Usually it doesn't firsthand — it borrows.", at: vo.at("how", 5), size: 38 },
          { text: "Small pieces of ad-company code — call each one a kit.", at: kit, size: 38 },
          { text: "What a kit learned about you on Monday, it uses in the word game on Thursday.", at: monday, size: 34 },
          { text: "The same kit, the same you — carried from one app to the next.", at: thursday, size: 34 },
          { punch: "10 COMPANIES", kicker: "You installed one app — you also installed", at: vo.atLast("companies", 1468) - 10, size: 128 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B06 — one number, your name
// ═══════════════════════════════════════════════════════════════════════════
export const B06v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B06");
  return (
    <V4Beat props={props} beat="B06" bareRoom dots source="Advertising identifier — platform documentation">
      <B06Content vo={vo} />
    </V4Beat>
  );
};
const B06Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const number = vo.at("number", 46);
  const every = vo.at("every", 262);
  const monday = vo.at("monday", 413);
  const person = vo.at("person", 574);
  const reset = vo.at("reset", 611);
  const nobody = vo.atLast("nobody", 750);
  const idX = WIDTH * 0.5;
  const idY = HEIGHT * 0.34;
  return (
    <>
      {/* the ID token — centre, always present, gently pulsing */}
      {frame >= number - 6 && (
        <div style={{ position: "absolute", left: idX - 280, top: idY - 62, width: 560, padding: "22px 30px", background: COLOR.ink, borderRadius: 16, opacity: enterT(frame, number, DUR.big), scale: `${breathe(frame, 0, 0.015)}`, filter: softShadow(1.4, 0.28), textAlign: "center" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.16em", textTransform: "uppercase", color: COLOR.orange }}>your advertising ID</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 40, color: COLOR.cardWhite, marginTop: 8, letterSpacing: "0.06em" }}>a4f2‑9c1e‑…‑7b</div>
          <div style={{ fontFamily: SANS, fontSize: 15, color: "rgba(246,242,231,0.6)", marginTop: 6 }}>treated as your name</div>
        </div>
      )}

      {/* every kit reports IN — lines converge, each pulses a packet toward the ID */}
      {frame >= every - 4 && frame < reset - 10 && (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const a = -Math.PI * 0.9 + (Math.PI * 1.8 * i) / 6;
            const sx = idX + Math.cos(a) * 460;
            const sy = idY + 250 + Math.sin(a) * 160;
            const t = interpolate(frame, [every + i * 8, every + i * 8 + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
            const ex = idX + (sx - idX) * (1 - t);
            const ey = idY + 40 + (sy - idY - 40) * (1 - t);
            // a packet pulses down the finished line on a loop
            const pulse = t > 0.98 ? ((frame - every - i * 8) % 60) / 60 : -1;
            return (
              <g key={i}>
                <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={t > 0.98 ? COLOR.orange : COLOR.grid} strokeWidth={t > 0.98 ? 3 : 2.5} opacity={t > 0.98 ? 0.4 : 1} />
                <rect x={sx - 22} y={sy - 15} width={44} height={30} rx={6} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={2.5} opacity={enterT(frame, every + i * 8, DUR.enter)} />
                {pulse >= 0 && pulse < 1 && <circle cx={sx + (idX - sx) * pulse} cy={sy + (idY + 40 - sy) * pulse} r={5} fill={COLOR.orange} />}
              </g>
            );
          })}
        </svg>
      )}

      {/* the two apps → same ID = one person */}
      {frame >= monday - 4 && frame < reset - 10 && (
        <>
          <NodeCard x={WIDTH * 0.08} y={HEIGHT * 0.56} w={260} at={monday} out={reset - 12} variant="white" from="l" eyebrow="monday" title="Shopping app" />
          <NodeCard x={WIDTH * 0.66} y={HEIGHT * 0.56} w={260} at={monday + 12} out={reset - 12} variant="white" from="r" eyebrow="thursday" title="Word game" />
          {frame >= person - 10 && <LabelPill at={person} x={idX} y={HEIGHT * 0.5} size={26}>= ONE PERSON</LabelPill>}
        </>
      )}

      {/* you can reset it — a button below the ID card — almost nobody does */}
      {frame >= reset - 6 && (
        <>
          <div style={{ position: "absolute", left: idX - 130, top: idY + 140, width: 260, padding: "16px 0", textAlign: "center", background: COLOR.cardWhite, border: `2.5px solid ${COLOR.ink}`, borderRadius: 12, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: COLOR.ink, opacity: enterT(frame, reset, DUR.big), filter: softShadow(1, 0.16) }}>
            Reset advertising ID
          </div>
          <Bar x={WIDTH * 0.28} y={HEIGHT * 0.62} w={WIDTH * 0.44} at={nobody} frac={0.03} labelText="people who ever reset it" />
        </>
      )}

      <Lane
        items={[
          { text: "All those kits write to one number.", at: vo.at("all", 4), size: 42 },
          { text: "Every kit reports to the same ID — so Monday's shopping app and Thursday's word game are known to be one person.", at: every, size: 32 },
          { text: "You can reset this number whenever you want — it's in your phone's settings.", at: reset, size: 34 },
          { punch: "ALMOST NOBODY DOES", kicker: "You can reset it tonight —", at: nobody + 6, size: 92 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B07 — the exchange, 100 ms, remember the losers
// ═══════════════════════════════════════════════════════════════════════════
export const B07v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B07");
  return (
    <V4Beat props={props} beat="B07" bareRoom dots source="IAB OpenRTB; RTB request volume — industry est." push={[1.04, 1]}
      zooms={[{ at: 860, hold: 40, x: "50%", y: "30%", scale: 1.42 }]}>
      <B07Content vo={vo} />
    </V4Beat>
  );
};
const B07Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const buyers = vo.at("buyers", 178);
  const software = vo.at("software", 427);
  const losers = vo.atLast("losers", 1182);
  const thrown = vo.atLast("thrown", 1108);
  return (
    <>
      {/* a field of buyers, up top, out of the lane */}
      {frame < losers - 20 && (
        <>
          <Chips cx={WIDTH * 0.5} cy={HEIGHT * 0.3} count={72} at={buyers} spread={300} tone={COLOR.cardWhite} chip={22} />
          <LabelPill at={buyers + 24} x={WIDTH * 0.5} y={HEIGHT * 0.08} size={26}>140+ BUYERS · EACH ONE IS SOFTWARE</LabelPill>
        </>
      )}

      {/* one buyer, examined — reads / checks / decides, each step ticking in,
          with a running clock */}
      {frame >= software - 6 && frame < losers - 20 && (() => {
        const steps = ["reads you", "checks you against every campaign", "decides what you are worth right now"];
        return (
          <>
            <div style={{ position: "absolute", left: WIDTH * 0.12, top: HEIGHT * 0.44, width: 420, background: COLOR.ink, border: `2px solid ${COLOR.ink}`, borderRadius: 16, padding: "20px 24px", opacity: lifeT(frame, software, losers - 24, DUR.big, DUR.enter), translate: `${(1 - enterT(frame, software, DUR.big)) * -24}px 0px`, filter: softShadow(1.2, 0.26) }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLOR.orange, marginBottom: 12 }}>one buyer · 100 ms</div>
              {steps.map((s, i) => {
                const sa = software + 20 + i * 70;
                const on = interpolate(frame, [sa, sa + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0", opacity: 0.25 + on * 0.75 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${COLOR.orange}`, background: on > 0.9 ? COLOR.orange : "transparent", flexShrink: 0 }} />
                    <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: "rgba(246,242,231,0.92)" }}>{s}</span>
                  </div>
                );
              })}
            </div>
            <HoldScan x={WIDTH * 0.12} y={HEIGHT * 0.44} w={420} h={200} from={software + 210} to={losers - 20} period={130} />
            <Spark at={software + 176} x="26%" y="52%" r={220} intensity={0.4} />
            <Stopwatch x={WIDTH * 0.78} y={HEIGHT * 0.5} r={110} at={software + 24} out={losers - 10} label="100 ms" />
          </>
        );
      })()}

      {/* remember the losers — the greyed tiles pulse */}
      {frame >= losers - 8 && (
        <Bloom window={[losers - 4, losers + 10, losers + 44, losers + 80]} radius={360} x="50%" y="36%" intensity={0.4} />
      )}

      <Lane
        items={[
          { text: "The exchange makes your description a lot, and sends it to buyers — dozens, sometimes hundreds, at the same instant.", at: vo.at("exchange", 6), size: 32 },
          { text: "One request — a hundred buyers reading it at the same instant.", at: buyers, size: 34 },
          { text: "Each one reads you, checks you against every campaign, and decides what you are worth — in a tenth of a second.", at: software, size: 32 },
          { punch: "THROWN OUT", kicker: "Answer any slower and the bid is", at: thrown, size: 100 },
          { punch: "REMEMBER THE LOSERS", kicker: "They matter later —", at: losers, size: 104 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B08 — you, priced
// ═══════════════════════════════════════════════════════════════════════════
export const B08v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B08");
  return (
    <V4Beat props={props} beat="B08" bareRoom dots source="Mobile eCPM benchmarks, US, 2025 (Appodeal / Playio)"
      zooms={[{ at: 1076, hold: 34, x: "50%", y: "34%", scale: 1.32 }]}>
      <B08Content vo={vo} />
    </V4Beat>
  );
};
const B08Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const divide = vo.at("divide", 623);
  const view = vo.at("view", 707);
  const priced = vo.at("priced", 1090);
  const cards = [
    { k: "Plain banner", v: "$1.20", at: vo.at("banner", 127) },
    { k: "Full-screen ad", v: "$10", at: vo.at("screen", 282) },
    { k: "Rewarded video", v: "$20", at: vo.at("video", 383) },
  ];
  const priceOut = priced - 30;
  return (
    <>
      {/* the 3 price cards — after the divide they SHRINK and park up top as
          reference, they don't vanish (creator's "hero replaces context" note) */}
      {frame < priceOut && (() => {
        const shrunk = interpolate(frame, [divide - 4, divide + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });
        const cy = interpolate(shrunk, [0, 1], [HEIGHT * 0.24, HEIGHT * 0.09]);
        const cw = interpolate(shrunk, [0, 1], [300, 170]);
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: cy, display: "flex", justifyContent: "center", gap: interpolate(shrunk, [0, 1], [40, 20]) }}>
            {cards.map((c, i) => {
              const e = rise(frame, c.at, 26, DUR.big);
              const d = driftIdle(frame, i * 3);
              const hero = i === 2;
              return (
                <div key={i} style={{ width: cw, padding: interpolate(shrunk, [0, 1], [26, 14]) + "px " + interpolate(shrunk, [0, 1], [28, 16]) + "px", background: hero ? COLOR.orange : COLOR.cardWhite, border: `2.5px solid ${COLOR.ink}`, borderRadius: 16, opacity: e.opacity, translate: `${d.x * (1 - shrunk)}px ${e.y + d.y * (1 - shrunk)}px`, rotate: `${d.rot * (1 - shrunk)}deg`, filter: softShadow(1.1, 0.18) }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: interpolate(shrunk, [0, 1], [15, 11]), letterSpacing: "0.1em", textTransform: "uppercase", color: hero ? COLOR.cardWhite : COLOR.grey }}>{c.k}</div>
                  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: interpolate(shrunk, [0, 1], [78, 40]), color: hero ? COLOR.cardWhite : COLOR.ink, marginTop: 6 }}>{c.v}</div>
                  {shrunk < 0.5 && <div style={{ fontFamily: SANS, fontSize: 15, color: hero ? "rgba(255,255,255,0.8)" : COLOR.grey }}>/ 1,000 views</div>}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* ÷ 1,000 → one view of you — big, centred */}
      {frame >= divide - 6 && frame < priceOut && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.34, textAlign: "center", opacity: lifeT(frame, divide, priceOut - 10, DUR.big, DUR.enter) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: COLOR.grey }}>÷ 1,000 views</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 176, color: COLOR.orange, letterSpacing: "-0.02em", marginTop: 14, scale: `${breathe(frame, 0, 0.014)}` }}>
            0.1¢ – 2¢
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: COLOR.grey, marginTop: 10, opacity: enterT(frame, vo.at("outside", 949), DUR.enter) }}>less if you live outside the richest countries</div>
        </div>
      )}
      <Spark at={divide + 26} x="50%" y="42%" r={280} intensity={0.4} />
      {frame >= divide + 30 && frame < priceOut && <LivePip x={WIDTH * 0.5 - 60} y={HEIGHT * 0.56} at={divide + 30} label="ONE VIEW OF YOU" />}

      <Lane
        tail={14}
        items={[
          { text: "The bids come back as a price for a thousand views.", at: vo.at("bids", 8), size: 40 },
          { text: "A plain banner, a full-screen ad, a video you watch for a reward — each one worth more than the last.", at: cards[0].at, size: 32 },
          { text: "Now divide by a thousand. One view of you is worth between a tenth of a cent and two cents.", at: view, size: 32 },
          { punch: "YOU, PRICED", kicker: "That is", at: priced, size: 140 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B09 — the gap: vague vs rich
// ═══════════════════════════════════════════════════════════════════════════
export const B09v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B09");
  return (
    <V4Beat props={props} beat="B09" bareRoom dots source="Programmatic targeting — buyer documentation"
      zooms={[{ at: 932, hold: 34, x: "50%", y: "40%", scale: 1.3 }]}>
      <B09Content vo={vo} />
    </V4Beat>
  );
};
const B09Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const rich = vo.at("richer", 296);
  const somewhere = vo.at("somewhere", 581);
  const vague = vo.at("vague", 817);
  const better = vo.atLast("better", 946);
  const richRows = ["woman, 30s", "near a pharmacy", "opened a baby-care app", "last week"];
  const mult = interpolate(frame, [rich + 30, somewhere], [1, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      {frame < vague - 10 && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.2, display: "flex", justifyContent: "center", gap: 100 }}>
            <ProfileCol title="Someone, somewhere" rows={["—", "—"]} at={rich} meter={0.1} />
            <ProfileCol title="A described person" rows={richRows} at={rich + 10} meter={interpolate(frame, [rich, rich + 240], [0.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} accent />
          </div>
          {frame >= rich + 30 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.62, textAlign: "center", opacity: enterT(frame, rich + 30, DUR.big) }}>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 128, color: COLOR.orange, letterSpacing: "-0.03em", scale: `${breathe(frame, 1, 0.014)}` }}>× {Math.round(mult)}</span>
              <div style={{ fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.grey, marginTop: 2 }}>what a described you is worth</div>
            </div>
          )}
          <Spark at={somewhere - 30} x="50%" y="66%" r={260} intensity={0.4} />
        </>
      )}
      <Lane
        items={[
          { text: "Why the gap? Targeting. An advertiser pays more when the description is richer.", at: vo.at("why", 2), size: 38 },
          { text: "A woman in her 30s, near a pharmacy, who opened a baby-care app last week — worth many times more than someone, somewhere.", at: rich + 20, size: 30 },
          { text: "That is why they want your location exact and your history long.", at: vague, size: 36 },
          { punch: "AND BETTER FOR YOU", kicker: "A vague you is cheaper for them —", at: better, size: 104 },
        ]}
      />
    </>
  );
};
const ProfileCol: React.FC<{ title: string; rows: string[]; at: number; meter: number; accent?: boolean }> = ({ title, rows, at, meter, accent }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: 420, opacity: enterT(frame, at, DUR.big) }}>
      <div style={{ padding: "24px 28px", background: COLOR.cardWhite, border: `2.5px solid ${COLOR.ink}`, borderRadius: 14, minHeight: 300, filter: dropShadow("raised", 1.8, 0.16) }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 19, letterSpacing: "0.08em", textTransform: "uppercase", color: COLOR.grey, marginBottom: 16 }}>{title}</div>
        {rows.map((r, i) => {
          const t = enterT(frame, at + 30 + i * 24, DUR.enter);
          return <div key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: COLOR.ink, opacity: t, translate: `${(1 - t) * -12}px 0px`, borderBottom: `1px solid ${COLOR.grid}`, padding: "11px 0" }}>{r}</div>;
        })}
      </div>
      <div style={{ marginTop: 16, height: 28, border: `2.5px solid ${COLOR.ink}`, borderRadius: 6, position: "relative", background: COLOR.cardWhite }}>
        <div style={{ position: "absolute", inset: 0, width: `${meter * 100}%`, background: accent ? COLOR.orange : COLOR.grey, borderRadius: 4 }} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B10 — not a rare event: 14 trillion / day
// ═══════════════════════════════════════════════════════════════════════════
export const B10v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B10");
  return (
    <V4Beat props={props} beat="B10" location="street" source="RTB request volume + DSP throughput — industry est., 2026">
      <B10Content vo={vo} />
    </V4Beat>
  );
};
const B10Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const trillion = vo.at("trillion", 280);
  const special = vo.at("special", 635);
  const shipped = vo.at("shipped", 1018);
  const churn = 14_000_000_000_000 + Math.floor((((frame - trillion) / 8) % 400) * 100_000_000);
  const walkFrom = 40;
  const walkDur = shipped - 160;
  const walkT = interpolate(frame, [walkFrom, walkFrom + walkDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const luckyPx = interpolate(walkT, [0, 1], [WIDTH * 0.12, WIDTH * 0.82]);
  return (
    <>
      <Walker at={walkFrom} dur={walkDur} fromX={WIDTH * 0.12} toX={WIDTH * 0.82} baseline={LOC_GROUND} h={LUCKY_H} tee={COLOR.orange} hair="ponytail" />
      <Bystander at={20} dur={340} fromX={WIDTH * 1.15} toX={-160} />

      {/* an auction ping drops from her feet every ~14 frames as she walks */}
      {frame > walkFrom + 20 && frame < shipped - 40 &&
        Array.from({ length: 5 }).map((_, i) => {
          const age = (frame - (walkFrom + 24) - i * 5) % 26;
          if (age < 0 || age > 22) return null;
          const px = luckyPx - 20 + i * 8;
          return (
            <div key={i} style={{ position: "absolute", left: px, top: LOC_GROUND - 10 - age * 5, width: 10 + age, height: 10 + age, borderRadius: "50%", border: `2px solid ${COLOR.orange}`, opacity: (1 - age / 22) * 0.7 }} />
          );
        })}

      {/* the big number lives in the visual zone, not the lane */}
      {frame >= trillion - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.16, textAlign: "center", opacity: enterT(frame, trillion, DUR.big) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, color: COLOR.ink, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
            {frame < trillion + 20 ? "14,000,000,000,000" : churn.toLocaleString("en-US")}
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 16, letterSpacing: "0.14em", textTransform: "uppercase", color: COLOR.grey, marginTop: 4 }}>auctions every day · a million per machine per second</div>
        </div>
      )}

      {frame >= special - 6 && frame < shipped - 10 && (
        <LabelPill at={special} x={WIDTH * 0.5} y={HEIGHT * 0.34} size={28}>YOU · ≈ 3,000 AUCTIONS A DAY, 3½ HOURS OF APP TIME</LabelPill>
      )}

      <Lane
        items={[
          { text: "This is not a rare event.", at: vo.at("rare", 32), size: 44 },
          { text: "Across all the exchanges — near 14 trillion of these auctions every day.", at: trillion, size: 34 },
          { text: "You are not special traffic. You personally set off a few thousand auctions today.", at: special, size: 34 },
          { punch: "SHIPPED YOUR LOCATION", kicker: "And every one", at: shipped, size: 92 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B11 — the money flows back down the chain
// ═══════════════════════════════════════════════════════════════════════════
export const B11v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B11");
  return (
    <V4Beat props={props} beat="B11" bareRoom dots source="Programmatic supply chain — industry documentation"
      zooms={[{ at: 936, hold: 34, x: "50%", y: "40%", scale: 1.3 }]}>
      <B11Content vo={vo} />
    </V4Beat>
  );
};
const B11Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const charged = vo.at("charged", 350);
  const flows = vo.at("flows", 448);
  const slice = vo.at("slice", 944);
  return (
    <>
      {/* the money flows back DOWN the chain it came up */}
      <Chain y={HEIGHT * 0.44} at={charged} gates={["Advertiser", "Buying software", "Exchange", "Selling software", "The app"]} coinAt={flows + 10} coinDur={280} />

      {/* each stage keeps a slice — a mustard coin drops below each gate */}
      {frame >= flows + 40 && frame < slice + 40 &&
        [0, 1, 2, 3].map((i) => {
          const gx = interpolate(i, [0, 3], [WIDTH * 0.24, WIDTH * 0.62]);
          const t = enterT(frame, flows + 60 + i * 40, DUR.big);
          return (
            <div key={i} style={{ position: "absolute", left: gx - 22, top: HEIGHT * 0.44 + 96 + (1 - t) * -24, width: 44, height: 44, borderRadius: "50%", background: `radial-gradient(circle at 35% 32%, ${tint(SUPPORT.mustard, 0.5)}, ${SUPPORT.mustard} 62%, ${shade(SUPPORT.mustard, 0.2)})`, border: `3px solid ${COLOR.ink}`, opacity: t, filter: dropShadow("raised", 0.7, 0.2) }} />
          );
        })}

      <Lane
        items={[
          { text: "The highest bid wins. The ad is drawn on your screen before you noticed, and the advertiser gets charged.", at: vo.at("highest", 9), size: 34 },
          { text: "But the money does not go straight to the app — it flows back down the chain it came up.", at: flows, size: 34 },
          { punch: "A SLICE", kicker: "And each one keeps", at: slice, size: 148 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B12 — walk one ad down the chain: 0.05¢
// ═══════════════════════════════════════════════════════════════════════════
export const B12v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B12");
  return (
    <V4Beat props={props} beat="B12" bareRoom dots source="Programmatic fee ranges: ISBA/PwC; The Trade Desk filings" push={[1, 1.03]}
      zooms={[{ at: 1096, hold: 36, x: "50%", y: "36%", scale: 1.3 }]}>
      <B12Content vo={vo} />
    </V4Beat>
  );
};
const B12Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const agrees = vo.at("agrees", 144);
  const cut = vo.at("cut", 300);
  const lands = vo.at("lands", 728);
  const half = vo.atLast("half", 1102);
  const ledgerY = HEIGHT * 0.13;
  const barShrink = interpolate(frame, [agrees + 150, agrees + 200], [1, 1.04 / 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });
  return (
    <>
      {/* a soft card behind the ledger so it reads as a document, not floating text */}
      <div style={{ position: "absolute", left: WIDTH * 0.24, top: ledgerY - 26, width: WIDTH * 0.52, height: HEIGHT * 0.52, background: COLOR.cardWhite, border: `2.5px solid ${COLOR.ink}`, borderRadius: 18, opacity: enterT(frame, agrees - 6, DUR.big), filter: softShadow(1.4, 0.18) }} />
      <Ledger
        x={WIDTH * 0.28}
        y={ledgerY}
        w={WIDTH * 0.44}
        at={agrees}
        start={{ label: "Advertiser pays", value: 2.0 }}
        rows={[
          { label: "buying software", deltaPct: 0.2 },
          { label: "the exchange", deltaPct: 0.15 },
          { label: "selling software", deltaPct: 0.15 },
          { label: "a data company", deltaPct: 0.1 },
        ]}
        final={{ label: "Reaches the app", value: 1.04 }}
      />
      {/* the $2 → $1.04 shrink, as a bar under the ledger, + a scan sweep so
          the held ledger reads as being audited */}
      {frame >= agrees + 140 && frame < lands - 10 && (
        <div style={{ position: "absolute", left: WIDTH * 0.28, top: HEIGHT * 0.68, width: WIDTH * 0.44 }}>
          <div style={{ height: 40, borderRadius: 10, border: `2.5px solid ${COLOR.ink}`, background: COLOR.cardWhite, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, width: `${barShrink * 100}%`, background: COLOR.orange }} />
            <div style={{ position: "absolute", left: "52%", top: 0, bottom: 0, width: 2, background: COLOR.ink, opacity: 0.4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: 14, letterSpacing: "0.08em", color: COLOR.grey, marginTop: 8 }}><span>REACHES THE APP</span><span>WAS $2 · NOW ≈ $1.04</span></div>
        </div>
      )}
      <HoldScan x={WIDTH * 0.28} y={ledgerY} w={WIDTH * 0.44} h={HEIGHT * 0.46} from={agrees + 150} to={lands - 10} period={150} />
      <Spark at={agrees + 190} x="50%" y="58%" r={240} intensity={0.4} />

      <Lane
        items={[
          { text: "Walk one real ad down that chain. An advertiser agrees to pay $2 for a thousand views.", at: vo.at("walk", 3), size: 34 },
          { text: "The buying software, the exchange, the seller's software, a data company — each takes a cut on the way down.", at: cut, size: 32 },
          { text: "What lands with the app that actually showed you the ad is closer to $1 than $2.", at: lands, size: 34 },
          { punch: "HALF OF THAT", kicker: "You were worth 0.1¢ — the app kept", at: half, size: 128 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B13 — the correction: 36¢ reaches a person
// ═══════════════════════════════════════════════════════════════════════════
export const B13v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B13");
  return (
    <V4Beat props={props} beat="B13" bareRoom dots source="ISBA/PwC 2020 & 2022; ANA Programmatic Transparency, Dec 2023"
      zooms={[{ at: 1198, hold: 40, x: "50%", y: "34%", scale: 1.34 }]}>
      <B13Content vo={vo} />
    </V4Beat>
  );
};
const B13Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const thirtySix = vo.at("36", 1202);
  const junk = vo.at("junk", 1053);
  const giant = vo.at("giant", 1434);
  // three empty card slots appear up front; each fills as the VO reaches it
  const slots = [
    { yr: "2020 · UK", fig: "15p", note: "unaccounted for", fillAt: vo.at("2020", 236) },
    { yr: "2022 · UK", fig: "65p", note: "reached the publisher", fillAt: vo.at("2022", 525) },
    { yr: "2023 · US", fig: "36¢", note: "reached a real person", fillAt: thirtySix - 30, hero: true },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.24, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 46 }}>
        {slots.map((c, i) => {
          const e = rise(frame, vo.at("repeat", 52) + i * 12, 20, DUR.big);
          const d = driftIdle(frame, i * 2);
          const filled = frame >= c.fillAt;
          const waiting = !filled && frame > vo.at("repeat", 52) + 40;
          const pop = c.hero && frame > thirtySix + 20 ? 1.06 : 1;
          const cw = c.hero ? 440 : 340;
          return (
            <div key={i} style={{ position: "relative", width: cw, minHeight: 270, padding: "30px 34px", background: c.hero && filled ? COLOR.orange : COLOR.cardWhite, border: `2.5px solid ${filled ? COLOR.ink : COLOR.grid}`, borderRadius: 16, opacity: e.opacity, translate: `${d.x}px ${e.y + d.y}px`, rotate: `${d.rot}deg`, scale: `${pop * (waiting ? 1 + Math.sin(frame / 12) * 0.006 : 1)}`, filter: softShadow(1.2, filled ? 0.2 : 0.08) }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", color: c.hero && filled ? COLOR.cardWhite : COLOR.grey }}>{c.yr}</div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: c.hero ? 128 : 84, color: c.hero && filled ? COLOR.cardWhite : COLOR.ink, marginTop: 8, opacity: filled ? enterT(frame, c.fillAt, DUR.enter) : 0.12 }}>{filled ? c.fig : "—"}</div>
              <div style={{ fontFamily: SANS, fontSize: 21, color: c.hero && filled ? "rgba(255,255,255,0.85)" : COLOR.grey, opacity: filled ? 1 : 0.4, marginTop: 4 }}>{c.note}</div>
              {filled && !c.hero && <HoldScan x={0} y={0} w={cw} h={270} from={c.fillAt} to={junk - 10} period={170} />}
            </div>
          );
        })}
      </div>
      {slots.map((c, i) => <Spark key={i} at={c.fillAt + 4} x={`${26 + i * 24}%`} y="38%" r={220} intensity={0.42} />)}
      <Lane
        items={[
          { text: "The number people repeat: half of every ad dollar disappears in the middle.", at: vo.at("number", 22), size: 34 },
          { text: "In 2020 a UK study couldn't even trace 15p of every pound.", at: vo.at("2020", 236), size: 34 },
          { text: "By 2022 a cleaner supply chain got 65p through to the publisher. For a while that looked like the whole story.", at: vo.at("2022", 525), size: 32 },
          { text: "Then a 2023 US study went the other way: once you counted junk sites, only 36¢ of the dollar reached a real person.", at: junk, size: 32 },
          { punch: "A DOZEN SMALL TOLLS", kicker: "Not one giant taking half —", sub: "plus a lot of waste.", at: giant, size: 100 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B14 — the waste: made-for-advertising sites
// ═══════════════════════════════════════════════════════════════════════════
export const B14v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B14");
  return (
    <V4Beat props={props} beat="B14" bareRoom dots source="ANA Programmatic Transparency, Dec 2023"
      zooms={[{ at: 964, hold: 34, x: "50%", y: "36%", scale: 1.3 }]}>
      <B14Content vo={vo} />
    </V4Beat>
  );
};
const B14Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const page = vo.at("page", 341);
  const slots = vo.at("slots", 419);
  const five = vo.at("five", 551);
  const fake = vo.at("fake", 836);
  const burning = vo.at("burning", 970);
  const fill = interpolate(frame, [slots, slots + 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // once a slot is filled it keeps *refreshing* — a made-for-ads page reloads
  // its inventory forever, each reload another charge for nothing.
  const slotOpacity = (i: number) => {
    if (fill <= i / 12) return 0.1;
    if (i === 4) return 1;
    const ph = (frame - slots - i * 13) / 44;
    return 0.72 + 0.28 * Math.abs(Math.sin(ph)); // a filled ad slot — always visible, refreshing
  };
  const served = fill >= 1 ? Math.floor((frame - slots - 130) / 26) : -1; // impressions since fill
  // the advertiser's money draining into the junk page — climbs the whole beat
  const wasteFrom = slots + 40;
  const wasted = Math.max(0, Math.floor(interpolate(frame, [wasteFrom, burning + 24], [0, 4820], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <>
      {/* a junk page — all ad slots, no content. muted blocks; one is "your ad" */}
      <div style={{ position: "absolute", left: WIDTH * 0.36, top: HEIGHT * 0.1, width: WIDTH * 0.28, height: HEIGHT * 0.58, background: COLOR.cardWhite, border: `2px solid ${COLOR.ink}`, borderRadius: 10, overflow: "hidden", opacity: enterT(frame, page, DUR.big), filter: softShadow(1.1, 0.18), scale: `${breathe(frame, 0, 0.008)}` }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${(i % 3) * 33 + 3}%`, top: `${Math.floor(i / 3) * 24 + 4}%`, width: "28%", height: "19%", background: i === 4 ? COLOR.orange : COLOR.grey, opacity: slotOpacity(i), borderRadius: 4, border: `1.5px solid ${i === 4 ? COLOR.ink : "transparent"}`, transition: "none" }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, textAlign: "center", fontFamily: FONT.mono, fontWeight: 700, fontSize: 15, letterSpacing: "0.12em", color: COLOR.grey }}>
          {served >= 0 ? `${served.toLocaleString()} ADS SERVED · 0 READERS` : "0 READERS · 0 ARTICLES"}
        </div>
      </div>
      {/* the orange slot re-serves on a loop — a spark each reload */}
      {fill >= 1 && Array.from({ length: 6 }).map((_, k) => (
        <Spark key={k} at={slots + 150 + k * 90} x={WIDTH * 0.36 + WIDTH * 0.28 * 0.5} y={HEIGHT * 0.1 + HEIGHT * 0.58 * 0.33} r={90} intensity={0.5} />
      ))}
      {frame >= page + 20 && (
        <div style={{ position: "absolute", left: WIDTH * 0.36, top: HEIGHT * 0.1 - 34, width: WIDTH * 0.28, opacity: enterT(frame, page + 20, DUR.big) }}>
          <LivePip x={0} y={0} label="SERVING ADS" at={page + 20} />
        </div>
      )}

      {/* the advertiser's spend pouring into this page — a live counter */}
      {frame >= wasteFrom - 4 && (
        <div style={{ position: "absolute", left: WIDTH * 0.36, top: HEIGHT * 0.1 + HEIGHT * 0.58 + 20, width: WIDTH * 0.28, textAlign: "center", opacity: enterT(frame, wasteFrom - 4, DUR.big) }}>
          <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 46, color: COLOR.orange, letterSpacing: "0.02em" }}>${wasted.toLocaleString()}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", color: COLOR.grey, marginTop: 4 }}>SPENT HERE · NOBODY SAW IT</div>
        </div>
      )}

      {frame >= five - 6 && frame < burning - 10 && (
        <div style={{ position: "absolute", left: WIDTH * 0.08, top: HEIGHT * 0.4 }}>
          <Bar x={0} y={0} w={WIDTH * 0.2} at={five} frac={0.2} labelText="about 1 ad in 5 runs on a site like this" />
        </div>
      )}
      <Lane
        items={[
          { text: "Where does the wasted part go?", at: vo.at("where", 5), size: 36 },
          { text: "Some of it goes to pages built for one thing only — carrying ads. No readers. No articles.", at: page + 24, size: 34 },
          { text: "The buying software chased the cheapest views — and the cheapest views are the fake ones.", at: fake - 40, size: 34 },
          { punch: "BURNING QUIETLY", kicker: "The advertiser's own money —", at: burning, size: 112 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B15 — one toll, a real name: The Trade Desk, ~20%
// ═══════════════════════════════════════════════════════════════════════════
export const B15v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B15");
  return (
    <V4Beat props={props} beat="B15" bareRoom dots source="The Trade Desk investor filings (revenue ≈ 20% of gross spend)"
      zooms={[{ at: 654, hold: 34, x: "50%", y: "38%", scale: 1.3 }]}>
      <B15Content vo={vo} />
    </V4Beat>
  );
};
const B15Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const charges = vo.at("charges", 279);
  const fifth = vo.at("fifth", 660);
  const several = vo.at("several", 759);
  const barShown = frame >= charges - 6 && frame < several - 10;
  const flow = charges + 24;
  // spend flows through the platform continuously; a fifth of every unit is
  // bitten off into the toll pile. a live counter climbs the whole time.
  const pills = Array.from({ length: 7 }).map((_, k) => {
    if (frame <= flow) return null;
    const p = (((frame - flow) / 74 - k * (1 / 7)) % 1 + 1) % 1;
    return p;
  });
  const toll = Math.max(0, Math.floor(interpolate(frame, [flow, several - 10], [0, 3_940_000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <>
      <NodeCard x={WIDTH * 0.3} y={HEIGHT * 0.12} w={WIDTH * 0.4} at={vo.at("Trade", 126)} out={several - 10} variant="black" from="t"
        eyebrow="the biggest independent buying platform" title="The Trade Desk" />

      {/* 20% slice of the spend — a bar with a fifth carved out orange, spend
          pills running through it, a fifth of each bitten off */}
      {barShown && (
        <div style={{ position: "absolute", left: WIDTH * 0.22, top: HEIGHT * 0.4, width: WIDTH * 0.56, opacity: enterT(frame, charges, DUR.big) }}>
          <div style={{ height: 72, borderRadius: 10, border: `2px solid ${COLOR.ink}`, background: COLOR.cardWhite, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, width: `${interpolate(frame, [charges, charges + 30], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`, background: COLOR.orange }} />
            <div style={{ position: "absolute", left: "20%", top: 0, bottom: 0, width: 2, background: COLOR.ink, opacity: 0.5 }} />
            {pills.map((p, k) => {
              if (p == null) return null;
              const past = p > 0.2;
              return (
                <div key={k} style={{ position: "absolute", left: `${p * 100}%`, top: past ? "22%" : "14%", height: past ? "56%" : "72%", width: 26, marginLeft: -13, borderRadius: 5, background: past ? COLOR.ink : shade(COLOR.ink, 0.15), opacity: 0.9 }} />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 14, letterSpacing: "0.1em", color: COLOR.grey }}>≈ 20% — JUST TO RUN THE SOFTWARE</div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, color: COLOR.orange }}>${toll.toLocaleString()} <span style={{ fontSize: 12, color: COLOR.grey }}>TOLL · THIS MINUTE</span></div>
          </div>
        </div>
      )}
      <Lane
        items={[
          { text: "One toll, with a real name and a real number.", at: vo.at("toll", 8), size: 42 },
          { text: "The Trade Desk charges advertisers about 20% of everything they spend through it — just the fee to run the bidding software.", at: charges, size: 30 },
          { punch: "ONE FIFTH OF THE MONEY", kicker: "One company, one step —", sub: "and only one of the several steps.", at: fifth, size: 92 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B16 — the app grows a seat for the auction
// ═══════════════════════════════════════════════════════════════════════════
export const B16v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B16");
  return (
    <V4Beat props={props} beat="B16" location="living" source="Rewarded-video ARPDAU uplift — 2025"
      zooms={[{ at: 692, hold: 34, x: "32%", y: "50%", scale: 1.34 }]}>
      <B16Content vo={vo} />
    </V4Beat>
  );
};
const B16Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const video = vo.at("video", 145);
  const jumps = vo.at("jumps", 302);
  const slot = vo.at("slot", 419);
  const favor = vo.at("favor", 611);
  const seat = vo.atLast("seat", 698);
  return (
    <>
      {/* Lucky on the couch, playing a phone game — then a dry look when the
          "favour" turns out not to be one */}
      <LuckyAt pose="sit" pose2="look" poseAt={favor} gazeUpAt={favor} at={6} x={WIDTH * 0.36} baseline={LOC_GROUND} expr={EXPR.wry} exprAt={seat} />
      <PhoneTap at={video - 20} tapAt={vo.at("watch", 194)} screen="ad" x={WIDTH * 0.5} y={HEIGHT * 0.5} w={172} out={seat - 20} />
      {/* the rewarded-video countdown — the actual mechanic, on a loop */}
      {frame >= vo.at("watch", 194) && frame < seat - 20 && (() => {
        const w0 = vo.at("watch", 194);
        const cyc = (frame - w0) % 210;
        const secs = Math.max(0, Math.ceil(30 * (1 - cyc / 190)));
        const cycEnd = w0 + Math.floor((frame - w0) / 210) * 210 + 190;
        return (
          <>
            <div style={{ position: "absolute", left: WIDTH * 0.5 + 4, top: HEIGHT * 0.5 - 200, transform: "translateX(-50%)", textAlign: "center" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: "0.12em", color: COLOR.grey }}>KEEP PLAYING IN</div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: secs === 0 ? COLOR.orange : COLOR.ink, lineHeight: 1 }}>{secs}s</div>
            </div>
            <Spark at={cycEnd} x={WIDTH * 0.5} y={HEIGHT * 0.5 - 60} r={90} intensity={0.32} />
          </>
        );
      })()}

      {/* the new slot grows into the game; revenue per user jumps */}
      {frame >= slot - 6 && frame < seat - 10 && (
        <>
          <NodeCard x={WIDTH * 0.14} y={HEIGHT * 0.12} w={360} at={slot} out={seat - 12} variant="white" from="l" eyebrow="the new slot in the game" title="Watch 30s to keep playing" />
          <div style={{ position: "absolute", left: WIDTH * 0.14, top: HEIGHT * 0.4, width: 400 }}>
            <Bar x={0} y={0} w={400} at={jumps} frac={0.5} labelText="revenue per user · +30–60%" fill={COLOR.orange} showPct={false} />
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, color: COLOR.orange, marginTop: 10 }}>
              +${(Math.floor((frame - slot) / 12) * 3).toLocaleString()} <span style={{ fontSize: 12, color: COLOR.grey }}>/ 1,000 PLAYERS TODAY</span>
            </div>
          </div>
        </>
      )}

      <Lane
        items={[
          { text: "Once a developer sees the auction pay, the app changes shape around it.", at: vo.at("once", 3), size: 36 },
          { text: "Add one rewarded video, and average revenue per user jumps 30 to 60 percent.", at: video, size: 34 },
          { punch: "A BETTER SEAT FOR THE AUCTION", kicker: "Not the game doing you a favour —", sub: "with you in it.", at: seat, size: 78 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B17 — one more group. only reading.
// ═══════════════════════════════════════════════════════════════════════════
export const B17v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B17");
  return (
    <V4Beat props={props} beat="B17" bareRoom dots source="Bidstream data brokers — regulatory filings" push={[1, 1.04]}
      zooms={[{ at: 428, hold: 34, x: "74%", y: "22%", scale: 1.36 }]}>
      <B17Content vo={vo} />
    </V4Beat>
  );
};
const B17Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const something = vo.at("something", 102);
  const reading = vo.at("reading", 434);
  const blame = vo.at("blame", 530);
  const gates = ["Buys", "Sells", "Routes"];
  const railY = HEIGHT * 0.44;
  const cx = [WIDTH * 0.347, WIDTH * 0.5, WIDTH * 0.653]; // box centres
  const railX0 = WIDTH * 0.26, railX1 = WIDTH * 0.74;
  const eyeX = WIDTH * 0.78, eyeY = HEIGHT * 0.16;
  // your data crosses the rail on a loop, one packet every ~1.4s — every
  // company here is *doing* something to it, and the fourth just watches.
  const flowStart = something + 40;
  const packets = [0, 1, 2, 3].map((k) => {
    if (frame <= flowStart) return null;
    const p = (((frame - flowStart) / 132 - k * 0.25) % 1 + 1) % 1;
    return { p, x: railX0 + (railX1 - railX0) * p };
  });
  const boxHot = (i: number) => packets.reduce((h, pk) => (pk && Math.abs(pk.x - cx[i]) < 46 ? Math.max(h, 1 - Math.abs(pk.x - cx[i]) / 46) : h), 0);
  return (
    <>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* the money rail through all three */}
        <line x1={railX0} y1={railY} x2={railX1} y2={railY} stroke={COLOR.grid} strokeWidth={5} strokeLinecap="round" opacity={enterT(frame, something, DUR.big)} />
        {/* the watch-line from the eye down to the rail — dotted, always there */}
        {frame >= flowStart && (
          <line x1={eyeX} y1={eyeY + 60} x2={WIDTH * 0.5} y2={railY} stroke={COLOR.grey} strokeWidth={2.5} strokeDasharray="3 10" strokeLinecap="round" opacity={frame < reading - 6 ? 0.4 : 0.85} />
        )}
        {/* packets + the scan pulse the eye drops on each as it passes centre */}
        {packets.map((pk, k) => {
          if (!pk) return null;
          const mid = Math.abs(pk.x - WIDTH * 0.5) < 40;
          return (
            <g key={k}>
              {mid && <line x1={pk.x} y1={railY} x2={eyeX} y2={eyeY + 60} stroke={COLOR.orange} strokeWidth={2} opacity={0.5} />}
              <circle cx={pk.x} cy={railY} r={mid ? 11 : 8} fill={COLOR.orange} opacity={0.9} />
              {mid && <circle cx={pk.x} cy={railY} r={17} fill="none" stroke={COLOR.orange} strokeWidth={2} opacity={0.6} />}
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: 0, right: 0, top: railY - 57, display: "flex", gap: 44, justifyContent: "center" }}>
        {gates.map((g, i) => {
          const e = rise(frame, something + i * 22, 22, DUR.big);
          const hot = boxHot(i);
          return (
            <div key={i} style={{ width: 250, padding: "34px 0", textAlign: "center", background: hot > 0.05 ? tint(COLOR.orange, 0.86) : COLOR.cardWhite, border: `3px solid ${COLOR.ink}`, borderRadius: 16, opacity: e.opacity, translate: `0px ${e.y - hot * 4}px`, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: COLOR.ink, filter: softShadow(1.1, 0.18 + hot * 0.2) }}>{g}</div>
          );
        })}
      </div>

      {/* the fourth — off the money line, watching. reads every packet. */}
      {frame >= flowStart && (
        <div style={{ position: "absolute", left: eyeX - 150, top: eyeY, width: 300, padding: "26px 0", textAlign: "center", background: COLOR.ink, borderRadius: 18, opacity: enterT(frame, flowStart, DUR.big) * (frame < reading - 6 ? 0.6 : 1), scale: `${breathe(frame, 2, 0.02)}`, filter: softShadow(1.3, 0.28) }}>
          <svg width={88} height={56} viewBox="0 0 88 56" style={{ overflow: "visible" }}>
            <path d="M 6 28 Q 44 -6 82 28 Q 44 62 6 28 Z" fill="none" stroke={COLOR.cardWhite} strokeWidth={4} />
            <circle cx={44} cy={28} r={12} fill={COLOR.orange} />
          </svg>
          <div style={{ fontFamily: FONT.mono, fontSize: 16, letterSpacing: "0.14em", color: COLOR.cardWhite, marginTop: 10 }}>ONLY READING</div>
          <LivePip x={112} y={2} at={flowStart} label={frame < reading - 6 ? "WATCHING" : "LOGGING"} />
        </div>
      )}
      <Spark at={reading + 4} x="78%" y="12%" r={200} intensity={0.42} />
      <Lane
        tail={4}
        items={[
          { text: "So far, every company in this chain at least does something — it buys, it sells, it routes.", at: vo.at("far", 5), size: 36 },
          { text: "There is one more group in the auction that is not buying an ad at all. It is only reading.", at: reading, size: 34 },
          { punch: "NOT WHO YOU'D THINK TO BLAME", kicker: "And it is", at: blame, size: 72 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B18 — engagement beat: how many ads?
// ═══════════════════════════════════════════════════════════════════════════
export const B18v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B18");
  return (
    <V4Beat props={props} beat="B18" location="living" zooms={[{ at: 620, hold: 30, x: "50%", y: "34%", scale: 1.3 }]}>
      <B18Content vo={vo} />
    </V4Beat>
  );
};
const B18Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const opened = vo.at("opened", 128);
  const hold = vo.at("hold", 443);
  const comments = vo.at("comments", 520);
  const low = vo.at("low", 632);
  // the phone keeps showing ads while she scrolls — a counter climbs, then
  // freezes on the number she'd "guess"
  const adCount = frame < opened ? 0 : frame > hold - 30 ? Math.floor((hold - 30 - opened) / 46) : Math.floor((frame - opened) / 46);
  return (
    <>
      {/* Lucky on the couch, thinking about the question */}
      <LuckyAt pose="sit" pose2="look" poseAt={hold} gazeUpAt={hold} at={4} x={WIDTH * 0.36} baseline={LOC_GROUND}
        expr={EXPR.think} exprAt={hold} />
      <PhoneTap at={vo.at("quick", 4)} tapAt={opened} screen="ad" x={WIDTH * 0.5} y={HEIGHT * 0.5} w={168} out={hold - 12} />
      {frame >= opened && frame < hold - 12 && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 + 110, top: HEIGHT * 0.5 - 44, opacity: lifeT(frame, opened, hold - 12, DUR.big, DUR.enter) }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", color: COLOR.grey }}>ADS SO FAR</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, color: COLOR.orange, lineHeight: 1 }}>{adCount}</div>
          <Spark at={opened + 46} x={0} y={0} r={70} intensity={0.3} />
        </div>
      )}

      {/* a big guess box with a blinking cursor */}
      {frame >= hold - 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.16, textAlign: "center", opacity: enterT(frame, hold, DUR.big) }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.16em", textTransform: "uppercase", color: COLOR.grey }}>your guess</div>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 12, padding: "18px 60px", border: `4px solid ${COLOR.ink}`, borderRadius: 20, background: COLOR.cardWhite, filter: softShadow(1.3, 0.2) }}>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 220, lineHeight: 1, color: COLOR.ink }}>?</span>
            <span style={{ fontSize: 200, opacity: Math.floor(frame / 15) % 2 ? 1 : 0, color: COLOR.orange, marginLeft: 10 }}>|</span>
          </div>
          {frame >= comments - 4 && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: COLOR.grey, marginTop: 14, opacity: enterT(frame, comments, DUR.enter) }}>hold that number — put it in the comments</div>}
        </div>
      )}

      <Lane
        items={[
          { text: "Quick question. The last free app you opened today — how many ads did it show you before you put the phone down?", at: vo.at("quick", 3), size: 32 },
          { text: "Hold that number — put it in the comments.", at: comments, size: 36 },
          { punch: "MOST PEOPLE ARE LOW BY HALF", kicker: "Whatever you guessed —", at: low, size: 80 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B19 — the losers keep the file
// ═══════════════════════════════════════════════════════════════════════════
export const B19v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B19");
  return (
    <V4Beat props={props} beat="B19" bareRoom dots source="US Senate (Wyden–Cassidy) 2021; FTC v. Mobilewalla order, Dec 2024" push={[1.03, 1]}
      zooms={[{ at: 1450, hold: 40, x: "50%", y: "34%", scale: 1.3 }]}>
      <B19Content vo={vo} />
    </V4Beat>
  );
};
const B19Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const losers = vo.at("losers", 86);
  const received = vo.at("received", 311);
  const wins = vo.at("wins", 230);
  const keep = vo.at("keep", 673);
  const senators = vo.at("Senators", 982);
  const ordered = vo.at("ordered", 1257);
  const kind = vo.at("kind", 1510);
  const filesOut = senators - 20;
  return (
    <>
      {/* 24 file-cards = the buyers' copies of you. each lands with a "you"
          glyph; the winner peels off orange when the auction closes; the
          losers each get a padlock when the VO says they KEEP it. (creator
          screenshot 3: the old 96-card grid mostly never did anything.) */}
      {frame < filesOut + 20 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.26, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 112px)", gap: 22 }}>
            {Array.from({ length: 24 }).map((_, i) => {
              const appear = i < 8 ? losers + i * 6 : received + ((i - 8) % 16) * 5;
              const t = enterT(frame, appear, DUR.enter);
              const o = frame < filesOut ? 1 : exitT(frame, filesOut, DUR.enter);
              const won = i === 3;
              const slid = won && frame > wins ? Math.min(1, (frame - wins) / 26) : 0;
              const locked = !won && frame > keep;
              const glyph = won ? COLOR.cardWhite : COLOR.grey;
              // each losing file keeps getting opened — a staggered access blink
              // that never stops (they keep it, they keep using it)
              const settled = frame > appear + 30 && !won;
              const acc = settled ? Math.pow(Math.max(0, Math.sin((frame - appear - i * 9) / 15)), 8) : 0;
              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    width: 112,
                    height: 78,
                    borderRadius: 8,
                    background: won ? COLOR.orange : acc > 0.1 ? tint(COLOR.orange, 0.9) : COLOR.cardWhite,
                    border: `2.5px solid ${acc > 0.3 ? COLOR.orange : COLOR.ink}`,
                    opacity: t * o * (won ? 1 - slid * 0.7 : 1),
                    transform: `translateY(${won ? -slid * 200 : 0}px) scale(${(0.9 + t * 0.1) * (won ? 1 - slid * 0.3 : 1) + acc * 0.03})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: softShadow(0.8, 0.15 + acc * 0.25),
                  }}
                >
                  <svg width={42} height={30} viewBox="0 0 42 30" style={{ opacity: t }}>
                    <circle cx={21} cy={9} r={7} fill={glyph} />
                    <path d="M4 30 Q21 13 38 30" fill="none" stroke={glyph} strokeWidth={4} />
                  </svg>
                  {locked && (
                    <div style={{ position: "absolute", right: 6, top: 6, opacity: enterT(frame, keep + (i % 8) * 3, DUR.enter) }}>
                      <svg width={17} height={20} viewBox="0 0 17 20">
                        <rect x={1} y={8} width={15} height={10} rx={2} fill={COLOR.ink} />
                        <path d="M4 8 V5.5 a4.5 4.5 0 0 1 9 0 V8" fill="none" stroke={COLOR.ink} strokeWidth={2.2} />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* the whole grid keeps getting swept + a re-read tally climbs */}
      {frame >= received + 40 && frame < filesOut && (
        <>
          <HoldScan x={WIDTH * 0.5 - 545} y={HEIGHT * 0.26 - 8} w={1090} h={294} from={received + 40} to={filesOut} period={120} radius={16} />
          <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.26 + 300, textAlign: "center", fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.12em", color: COLOR.grey }}>
            YOUR FILE · RE-READ {Math.floor((frame - received - 40) / 7).toLocaleString()} TIMES
          </div>
        </>
      )}
      {frame >= keep - 6 && frame < filesOut && <LabelPill at={keep} x={WIDTH * 0.5} y={HEIGHT * 0.14} size={28}>~140 LOSERS · ALL KEEP THE FILE · THEY PAID NOTHING</LabelPill>}

      {/* two rulings, as document cards */}
      {frame >= senators - 6 && frame < kind - 20 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.2, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {[
            { tag: "US SENATE · 2021", t: "investigate this exact practice", at: senators },
            { tag: "REGULATOR · Dec 2024", t: "one company ordered to stop keeping losing data", at: ordered },
          ].map((r, i) => {
            const e = slideIn(frame, r.at, -70, DUR.big);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, width: 680, padding: "18px 24px", background: COLOR.cardWhite, border: `2px solid ${COLOR.ink}`, borderRadius: 12, opacity: e.opacity, translate: `${e.x}px 0px`, filter: softShadow(1, 0.18) }}>
                <span style={{ fontFamily: FONT.mono, fontSize: 14, letterSpacing: "0.1em", color: COLOR.orange, whiteSpace: "nowrap" }}>{r.tag}</span>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, color: COLOR.ink }}>{r.t}</span>
              </div>
            );
          })}
        </div>
      )}

      <Lane
        tail={6}
        items={[
          { text: "Back to the auction, and the losers. Your description went to a few hundred buyers — one wins, the rest still received it.", at: vo.at("back", 3), size: 32 },
          { text: "They bid, they lost, they paid nothing — and they keep the file anyway.", at: keep, size: 32 },
          { text: "In 2021 two US senators asked the government to investigate. In December 2024 a regulator ordered one company to stop.", at: senators, size: 30 },
          { punch: "THE FIRST ORDER OF ITS KIND", kicker: "It was", at: kind, size: 92 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B20 — dots become a life  (§14.4 — plain, sourced)
// ═══════════════════════════════════════════════════════════════════════════
export const B20v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B20");
  return (
    <V4Beat props={props} beat="B20" bareRoom dots source="FTC v. Kochava; FTC Gravy/Venntel actions, 2024–2026" push={[1.04, 1]}
      zooms={[{ at: 1210, hold: 40, x: "50%", y: "34%", scale: 1.32 }]}>
      <B20Content vo={vo} />
    </V4Beat>
  );
};
const B20Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const bulk = vo.at("bulk", 498);
  const government = vo.at("government", 677);
  const address = vo.at("address", 1239);
  const stops = [
    { x: WIDTH * 0.16, y: HEIGHT * 0.18, label: "where you sleep" },
    { x: WIDTH * 0.34, y: HEIGHT * 0.5, label: "where you work" },
    { x: WIDTH * 0.56, y: HEIGHT * 0.24, label: "a clinic" },
    { x: WIDTH * 0.76, y: HEIGHT * 0.56, label: "how long you stayed" },
  ];
  // a dot retraces the route on a ~5s loop — the phone moving through its day;
  // each stop flares as it passes (creator 2026-09-04: "animate here and there,
  // add a glow when something happens").
  const traceStart = vo.at("dots", 113) + 70;
  const segs = stops.length - 1;
  const trace = frame > traceStart ? (((frame - traceStart) / 150) % 1) * segs : -1;
  const ti = Math.floor(trace);
  const tf = trace - ti;
  const tPos = trace >= 0 && ti < segs ? [stops[ti].x + (stops[ti + 1].x - stops[ti].x) * tf, stops[ti].y + (stops[ti + 1].y - stops[ti].y) * tf] : null;
  const nearStop = trace >= 0 ? stops.reduce((best, s, i) => (Math.hypot((tPos?.[0] ?? 0) - s.x, (tPos?.[1] ?? 0) - s.y) < 26 ? i : best), -1) : -1;
  return (
    <>
      <PinPath at={vo.at("dots", 113)} stops={stops} />
      {tPos && frame < address - 20 && (
        <>
          {nearStop >= 0 && (
            <div style={{ position: "absolute", left: stops[nearStop].x - 72, top: stops[nearStop].y - 72, width: 144, height: 144, borderRadius: "50%", background: `radial-gradient(circle, rgba(226,77,40,0.5), rgba(226,77,40,0) 70%)`, pointerEvents: "none" }} />
          )}
          <div style={{ position: "absolute", left: tPos[0] - 24, top: tPos[1] - 24, width: 48, height: 48, borderRadius: "50%", background: `radial-gradient(circle, rgba(226,77,40,0.4), rgba(226,77,40,0) 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: tPos[0] - 11, top: tPos[1] - 11, width: 22, height: 22, borderRadius: "50%", background: COLOR.orange, border: `3px solid ${COLOR.cardWhite}`, boxShadow: `0 0 20px ${COLOR.orange}`, pointerEvents: "none" }} />
        </>
      )}

      {frame >= bulk - 6 && frame < address - 20 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.62, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <LabelPill at={bulk} x={WIDTH * 0.32} y={0} size={24}>SOLD IN BULK · HUNDREDS OF MILLIONS OF DEVICES</LabelPill>
          {frame >= government - 4 && <LabelPill at={government} x={WIDTH * 0.68} y={0} size={22}>SOME PASSED TO GOVERNMENT · NO WARRANT</LabelPill>}
        </div>
      )}
      {frame >= address - 6 && (
        <>
          {/* a megaphone motif for the public-address idea */}
          <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: enterT(frame, address, DUR.big) }}>
            <g transform={`translate(${WIDTH * 0.5} ${HEIGHT * 0.32})`}>
              <path d="M -70 -26 L 30 -46 L 30 46 L -70 26 Z" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />
              <rect x={-96} y={-16} width={26} height={32} fill={COLOR.ink} />
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M ${48 + i * 22} ${-30 - i * 8} Q ${64 + i * 26} 0 ${48 + i * 22} ${30 + i * 8}`} fill="none" stroke={COLOR.ink} strokeWidth={4} opacity={0.4 + 0.2 * i} />
              ))}
            </g>
          </svg>
        </>
      )}

      <Lane
        items={[
          { text: "Stitched together, one phone's locations stop being dots and start being a life.", at: vo.at("Stitched", 4), size: 36 },
          { text: "Regulators found this data sold in bulk — and in some cases passed to government agencies that skipped asking a court.", at: bulk, size: 30 },
          { punch: "A PUBLIC ADDRESS SYSTEM", kicker: "The app opened an auction — and an auction is", at: address, size: 78 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B21 — the walled few
// ═══════════════════════════════════════════════════════════════════════════
export const B21v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B21");
  return (
    <V4Beat props={props} beat="B21" bareRoom dots source="Alphabet, Meta, Amazon 10-K filings (2025)" push={[1.04, 1]}
      zooms={[{ at: 1372, hold: 36, x: "50%", y: "34%", scale: 1.3 }]}>
      <B21Content vo={vo} />
    </V4Beat>
  );
};
const B21Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const quarters = vo.at("quarters", 242);
  const nothing = vo.atLast("quarter", 1384) - 6;
  const vals = [
    { k: "Google ads", v: "≈ $200B / yr", name: vo.at("Google", 526), at: vo.at("200", 976) - 30 },
    { k: "Meta ads", v: "≈ $190B / yr", name: vo.at("Meta", 551), at: vo.at("190", 1120) - 30 },
    { k: "Amazon ads", v: "> $20B / qtr", name: vo.at("Amazon", 561), at: vo.at("Amazon", 1173, 1) },
  ];
  const barShown = frame >= quarters - 6 && frame < nothing - 20;
  const cardsFrom = quarters + 44;
  // spend keeps pouring in from the OPEN side and getting pulled behind the wall
  const units = Array.from({ length: 6 }).map((_, k) => {
    if (frame <= quarters + 30) return null;
    const p = (((frame - quarters - 30) / 88 - k / 6) % 1 + 1) % 1;
    return p;
  });
  return (
    <>
      {/* three-quarters bar: open vs walled — money still flowing into the wall */}
      {barShown && (
        <div style={{ position: "absolute", left: WIDTH * 0.12, right: WIDTH * 0.12, top: HEIGHT * 0.14 }}>
          <div style={{ height: 76, borderRadius: 12, border: `2.5px solid ${COLOR.ink}`, overflow: "hidden", position: "relative", background: COLOR.cardWhite, opacity: enterT(frame, quarters, DUR.big) }}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${interpolate(frame, [quarters, quarters + 36], [0, 75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`, background: COLOR.ink }} />
            {units.map((p, k) => {
              if (p == null) return null;
              const intoWall = p > 0.25;
              return <div key={k} style={{ position: "absolute", left: `${p * 100}%`, top: "50%", width: 12, height: 12, marginTop: -6, marginLeft: -6, borderRadius: "50%", background: intoWall ? COLOR.grey : COLOR.orange, opacity: intoWall ? 0.5 : 0.95 }} />;
            })}
            <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: FONT.mono, fontSize: 16, letterSpacing: "0.1em", color: COLOR.grey }}>OPEN</div>
            <div style={{ position: "absolute", right: 22, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: FONT.mono, fontSize: 16, letterSpacing: "0.1em", color: COLOR.cardWhite }}>~75% INSIDE 4–5 PRIVATE AUCTIONS</div>
          </div>
        </div>
      )}
      {/* three walled slots — appear locked right after the bar, shimmer while
          walled, slam their number in when the VO reaches it */}
      {frame >= cardsFrom - 6 && frame < nothing - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.36, display: "flex", justifyContent: "center", gap: 40 }}>
          {vals.map((v, i) => {
            const e = rise(frame, cardsFrom + i * 16, 20, DUR.big);
            const d = driftIdle(frame, i * 2);
            const named = frame >= v.name;
            const filled = frame >= v.at;
            const shimmer = !filled ? 0.12 + 0.06 * Math.sin((frame - cardsFrom) / 22 + i) : 0;
            return (
              <div key={i} style={{ width: 380, minHeight: 190, padding: "30px 34px", background: i === 0 && filled ? COLOR.orange : COLOR.cardWhite, border: `2.5px solid ${filled ? COLOR.ink : COLOR.grid}`, borderRadius: 16, opacity: e.opacity, translate: `${d.x}px ${e.y + d.y}px`, rotate: `${d.rot}deg`, filter: softShadow(1.2, filled ? 0.2 : 0.08 + shimmer) }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", color: i === 0 && filled ? COLOR.cardWhite : COLOR.grey }}>{named ? v.k : "PRIVATE AUCTION"}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                  {!filled && (
                    <svg width={22} height={26} viewBox="0 0 17 20"><rect x={1} y={8} width={15} height={10} rx={2} fill={COLOR.grey} /><path d="M4 8 V5.5 a4.5 4.5 0 0 1 9 0 V8" fill="none" stroke={COLOR.grey} strokeWidth={2.2} /></svg>
                  )}
                  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: filled ? 56 : 34, color: i === 0 && filled ? COLOR.cardWhite : filled ? COLOR.ink : COLOR.grey, opacity: filled ? enterT(frame, v.at, DUR.enter) : 0.5 + shimmer * 2 }}>{filled ? v.v : "walled"}</div>
                </div>
                {filled && <Spark at={v.at + 4} x={`${28 + i * 22}%`} y="48%" r={180} intensity={0.4} />}
              </div>
            );
          })}
        </div>
      )}
      <Lane
        tail={14}
        items={[
          { text: "Everything so far is the open auction — the one anyone can enter. Most of the money is not there.", at: vo.at("Everything", 4), size: 36 },
          { text: "Around three-quarters of this ad spending happens inside four or five companies that run their own private auctions.", at: quarters, size: 32 },
          { punch: "NOTHING", kicker: "Mostly from ads shown to people who paid", at: nothing, size: 168 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B22 — the referee opens its own window
// ═══════════════════════════════════════════════════════════════════════════
export const B22v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B22");
  return (
    <V4Beat props={props} beat="B22" bareRoom dots source="Apple ATT (2021); App Store ads expansion (2022)"
      zooms={[{ at: 870, hold: 34, x: "50%", y: "36%", scale: 1.32 }]}>
      <B22Content vo={vo} />
    </V4Beat>
  );
};
const B22Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const no = vo.at("no", 246);
  const vaguer = vo.at("vaguer", 393);
  const window_ = vo.atLast("window", 972);
  return (
    <>
      {/* the ATT dialog — a thumb slides in and taps "Ask App Not to Track" */}
      {frame < window_ - 20 && (() => {
        const press = interpolate(frame, [no - 16, no - 2, no + 6, no + 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });
        const chosen = frame > no;
        return (
          <>
            <div style={{ position: "absolute", left: WIDTH * 0.5 - 280, top: HEIGHT * 0.18, width: 560, padding: "36px 40px", background: COLOR.cardWhite, border: `2.5px solid ${COLOR.ink}`, borderRadius: 28, opacity: enterT(frame, vo.at("pop", 123), DUR.big), textAlign: "center", filter: softShadow(1.5, 0.24), scale: `${breathe(frame, 0, 0.01) * (1 - press * 0.012)}` }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: COLOR.ink }}>Allow “App” to track you?</div>
              <div style={{ marginTop: 24, padding: "18px 0", background: COLOR.orange, borderRadius: 16, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: COLOR.cardWhite, opacity: chosen ? 1 : 0.55, outline: chosen ? `4px solid ${shade(COLOR.orange, 0.25)}` : "none", outlineOffset: 3 }}>Ask App Not to Track</div>
              <div style={{ marginTop: 12, padding: "18px 0", border: `2.5px solid ${COLOR.grid}`, borderRadius: 16, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: COLOR.grey }}>Allow</div>
            </div>
            {press > 0.02 && (
              <div style={{ position: "absolute", left: WIDTH * 0.5 + 60, top: HEIGHT * 0.18 + 150 + (1 - press) * 50, width: 62, height: 62, borderRadius: "50%", background: "rgba(17,17,17,0.5)", border: `3px solid ${COLOR.ink}`, pointerEvents: "none" }} />
            )}
            <Spark at={no + 2} x="50%" y="32%" r={220} intensity={0.45} />
          </>
        );
      })()}
      {/* the tap tally — more people answer, one per beat, ~3 in 4 say no */}
      {frame >= no + 10 && frame < window_ - 20 && (() => {
        const rows = Math.min(9, Math.floor((frame - no - 10) / 20));
        const noCount = Array.from({ length: rows }).filter((_, r) => r % 4 !== 2).length;
        return (
          <div style={{ position: "absolute", left: WIDTH * 0.5 + 320, top: HEIGHT * 0.18, width: 380, opacity: lifeT(frame, no + 10, window_ - 26, DUR.big, DUR.enter) }}>
            {Array.from({ length: rows }).map((_, r) => {
              const saysNo = r % 4 !== 2;
              return (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, opacity: enterT(frame, no + 10 + r * 20, DUR.enter) }}>
                  <svg width={16} height={16} viewBox="0 0 16 16">
                    {saysNo
                      ? <path d="M4 4 L12 12 M12 4 L4 12" stroke={COLOR.grey} strokeWidth={2.4} strokeLinecap="round" />
                      : <path d="M3 8 L7 12 L13 4" fill="none" stroke={COLOR.orange} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                  <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 17, color: saysNo ? COLOR.grey : COLOR.ink }}>{saysNo ? "Ask App Not to Track" : "Allow"}</span>
                </div>
              );
            })}
            {rows >= 8 && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.ink, marginTop: 10, opacity: enterT(frame, no + 10 + 8 * 20, DUR.big) }}>≈ {noCount} in {rows} say no</div>}
          </div>
        );
      })()}

      {/* everyone else's description of you goes vaguer + cheaper — steps down */}
      {frame >= vaguer - 6 && frame < window_ - 20 && (() => {
        const steps = [0.66, 0.5, 0.38, 0.3];
        const si = Math.max(0, Math.min(steps.length - 1, Math.floor((frame - vaguer) / 70)));
        const w = interpolate(frame, [vaguer + si * 70, vaguer + si * 70 + 24], [steps[Math.max(0, si - 1)], steps[si]], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div style={{ position: "absolute", left: WIDTH * 0.16, top: HEIGHT * 0.66, width: WIDTH * 0.68 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 14, letterSpacing: "0.1em", color: COLOR.grey, marginBottom: 10 }}>EVERYONE ELSE'S PICTURE OF YOU — VAGUER, CHEAPER</div>
            <div style={{ height: 46, borderRadius: 10, border: `2px solid ${COLOR.ink}`, background: COLOR.cardWhite, overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w * 100}%`, background: COLOR.grey }} />
            </div>
            {si > 0 && <Spark at={vaguer + si * 70} x="30%" y="72%" r={140} intensity={0.3} />}
          </div>
        );
      })()}
      <Lane
        items={[
          { text: "Apple plays this cleverly. In 2021 it added the pop-up that asks whether an app can track you.", at: vo.at("Apple", 4), size: 34 },
          { text: "Most people tap “Ask App Not to Track.”", at: no, size: 34 },
          { text: "That made everyone else's picture of you vaguer — and cheaper.", at: vaguer, size: 32 },
          { text: "The next year, Apple expanded its own ad business inside the App Store.", at: vo.at("expanded", 720), size: 32 },
          { punch: "THE REFEREE OPENED ITS OWN WINDOW", kicker: "Apple didn't need the auction to know you —", at: window_, size: 66 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B23 — the ruling
// ═══════════════════════════════════════════════════════════════════════════
export const B23v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B23");
  return (
    <V4Beat props={props} beat="B23" bareRoom dots source="US v. Google, EDVA — liability ruling, 17 Apr 2025"
      zooms={[{ at: 900, hold: 34, x: "50%", y: "36%", scale: 1.32 }]}>
      <B23Content vo={vo} />
    </V4Beat>
  );
};
const B23Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const monopoly = vo.at("monopoly", 344);
  const marketplace = vo.at("marketplace", 711);
  const law = vo.at("law", 924);
  return (
    <>
      <LabelPill at={vo.at("April", 123)} x={WIDTH * 0.5} y={HEIGHT * 0.12} size={32}>APRIL 2025 · US FEDERAL RULING</LabelPill>

      {/* the two parts Google was found to have monopolised — the MONOPOLY stamp
          lands when the VO says it */}
      {frame >= vo.at("sued", 80) + 6 && frame < marketplace - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.3, display: "flex", justifyContent: "center", gap: 56 }}>
          {["Software publishers use to sell ad space", "The exchange the auction runs through"].map((b, i) => {
            const e = slideIn(frame, vo.at("sued", 80) + 10 + i * 20, i === 0 ? -80 : 80, DUR.big);
            const stamped = frame >= monopoly + i * 20;
            return (
              <div key={i} style={{ width: 440, minHeight: 170, padding: "36px 34px", display: "flex", alignItems: "center", justifyContent: "center", background: COLOR.cardWhite, border: `2.5px solid ${COLOR.ink}`, borderRadius: 16, opacity: e.opacity, translate: `${e.x}px 0px`, textAlign: "center", position: "relative", filter: softShadow(1.2, 0.18) }}>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: COLOR.ink }}>{b}</div>
                {stamped && <div style={{ position: "absolute", right: -20, top: -18, background: COLOR.orange, color: COLOR.cardWhite, fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: "0.1em", padding: "8px 16px", borderRadius: 8, rotate: "-8deg", opacity: enterT(frame, monopoly + i * 20, DUR.enter), scale: `${landPop(frame, monopoly + i * 20)}` }}>MONOPOLY</div>}
              </div>
            );
          })}
        </div>
      )}
      {/* one owner pulling the strings on both — control pulses up both lines,
          continuously, until the roles reveal */}
      {frame >= monopoly + 26 && frame < marketplace - 10 && (() => {
        const gx = WIDTH * 0.5, gy = HEIGHT * 0.62, bx = [WIDTH * 0.37, WIDTH * 0.63], by = HEIGHT * 0.3 + 170;
        const op = lifeT(frame, monopoly + 26, marketplace - 20, DUR.big, DUR.enter);
        return (
          <>
            <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: op }}>
              {bx.map((x, i) => {
                const ph = (((frame - monopoly - 26) / 40 + i * 0.5) % 1 + 1) % 1;
                return (
                  <g key={i}>
                    <line x1={gx} y1={gy} x2={x} y2={by} stroke={COLOR.ink} strokeWidth={2.5} strokeDasharray="2 8" opacity={0.5} />
                    <circle cx={gx + (x - gx) * (1 - ph)} cy={gy + (by - gy) * (1 - ph)} r={6} fill={COLOR.orange} />
                  </g>
                );
              })}
            </svg>
            <div style={{ position: "absolute", left: gx - 90, top: gy - 34, width: 180, textAlign: "center", padding: "16px 0", background: COLOR.ink, color: COLOR.cardWhite, borderRadius: 12, fontFamily: SANS, fontWeight: 800, fontSize: 30, opacity: op, filter: softShadow(1.2, 0.24) }}>Google</div>
          </>
        );
      })()}
      {/* three roles, one company */}
      {frame >= marketplace - 6 && frame < law - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.34, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {["THE MARKETPLACE", "THE BIGGEST SELLER", "THE BIGGEST BUYER"].map((r, i) => {
            const e = rise(frame, marketplace + i * 20, 20, DUR.big);
            return <div key={i} style={{ padding: "22px 44px", background: COLOR.ink, color: COLOR.cardWhite, borderRadius: 12, fontFamily: SANS, fontWeight: 800, fontSize: 32, opacity: e.opacity, translate: `0px ${e.y}px`, filter: softShadow(1, 0.2) }}>{r}</div>;
          })}
        </div>
      )}
      <Lane
        items={[
          { text: "Owning every step is also how you get sued.", at: vo.at("Owning", 4), size: 42 },
          { text: "A federal judge ruled Google had illegally built a monopoly over two parts of this machine at once.", at: monopoly, size: 32 },
          { punch: "AGAINST THE LAW", kicker: "All three at the same time —", at: law, size: 140 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B24 — invasive and pointless at the same time
// ═══════════════════════════════════════════════════════════════════════════
export const B24v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B24");
  return (
    <V4Beat props={props} beat="B24" location="office" source="Google Play 2024; display CTR benchmarks"
      zooms={[{ at: 1200, hold: 46, x: "50%", y: "36%", scale: 1.34 }]}>
      <B24Content vo={vo} />
    </V4Beat>
  );
};
const B24Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const studio = vo.at("studio", 455);
  const wastes = vo.at("wastes", 636);
  const shown = vo.at("shown", 853);
  const invasive = vo.atLast("invasive", 1208); // said at 787 & 1208 — want the last
  const tilt = Math.sin(frame / 20) * 4;
  return (
    <>
      {/* the two-person studio WORKING at the desk; Lucky watches from a step
          away — same size as them */}
      <DeskWorker x={WIDTH * 0.26} facing={1} tee={SUPPORT.teal} seed={2} />
      <DeskWorker x={WIDTH * 0.4} facing={-1} tee={SUPPORT.mustard} seed={3} />
      <LuckyAt pose="look" at={studio} x={WIDTH * 0.6} baseline={LOC_GROUND} facing={-1} expr={EXPR.think} exprAt={invasive} />

      {/* click-through: 1 in 1,000 — a 1000-dot grid on a floating panel ABOVE
          the studio (creator 2026-09-04: grid was only 400 + it was drawing
          over the characters' heads) */}
      {frame >= shown - 30 && frame < invasive - 20 && (
        <div style={{ position: "absolute", left: WIDTH * 0.27, top: HEIGHT * 0.055, width: WIDTH * 0.46, padding: "18px 20px 14px", background: COLOR.cardWhite, border: `2px solid ${COLOR.ink}`, borderRadius: 12, opacity: enterT(frame, shown - 30, DUR.big), filter: softShadow(1.2, 0.2) }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(50, 1fr)", gap: 2 }}>
            {Array.from({ length: 1000 }).map((_, i) => {
              const wave = interpolate(frame, [shown - 20, shown + 60], [0, 1000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const on = i < wave;
              const sweep = frame > shown + 70 ? (((frame - shown - 70) / 120) % 1) * 1000 : -1;
              const swept = sweep >= 0 && i > sweep - 60 && i < sweep;
              const isClick = i === 500;
              const pulse = isClick && frame > shown + 60 ? 0.5 + 0.5 * Math.abs(Math.sin((frame - shown) / 16)) : 1;
              return <div key={i} style={{ aspectRatio: "1", borderRadius: 1, background: isClick ? COLOR.orange : COLOR.grey, opacity: on ? (isClick ? pulse : swept ? 0.9 : 0.42) : 0.12 }} />;
            })}
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.1em", color: COLOR.grey, marginTop: 12, textAlign: "center" }}>THE AVERAGE BANNER IS CLICKED ≈ 1 TIME IN 1,000</div>
        </div>
      )}
      {frame >= shown + 40 && frame < invasive - 20 && <Spark at={shown + 50} x="50%" y="20%" r={200} intensity={0.32} />}
      {frame >= shown + 120 && frame < invasive - 20 && <Spark at={shown + 120 + Math.floor((frame - shown - 120) / 150) * 150} x="50%" y="18%" r={110} intensity={0.24} />}

      {/* the seesaw — both ends heavy */}
      {frame >= invasive - 6 && (
        <>
          <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: enterT(frame, invasive, DUR.big) }}>
            <g transform={`translate(${WIDTH * 0.5}, ${HEIGHT * 0.32}) rotate(${tilt}) scale(1.35)`}>
              <line x1={-300} y1={0} x2={300} y2={0} stroke={COLOR.ink} strokeWidth={8} strokeLinecap="round" />
              <path d="M 0 0 L -26 60 L 26 60 Z" fill={COLOR.ink} />
              <circle cx={-300} cy={-30} r={40} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />
              <circle cx={300} cy={-30} r={40} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />
              <text x={-300} y={-88} fontFamily={SANS} fontWeight={800} fontSize={30} fill={COLOR.ink} textAnchor="middle">INVASIVE</text>
              <text x={300} y={-88} fontFamily={SANS} fontWeight={800} fontSize={30} fill={COLOR.ink} textAnchor="middle">POINTLESS</text>
            </g>
          </svg>
        </>
      )}

      <Lane
        tail={14}
        items={[
          { text: "It would be clean to call the auction a scam — it is not that simple. It lets a two-person studio give a game away and still eat.", at: vo.at("clean", 25), size: 30 },
          { text: "And the advertiser mostly wastes the money — so you are sold for a tenth of a cent to someone who gets nothing back.", at: wastes, size: 30 },
          { punch: "AT THE SAME TIME", kicker: "Invasive and pointless —", at: invasive, size: 128 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B25 — the reversal · Dark Law
// ═══════════════════════════════════════════════════════════════════════════
export const B25v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B25");
  // B25 is THE reversal — black from the cut and staying there (creator
  // 2026-09-04: the closing title must land and HOLD on black). The B24→B25
  // cross-dissolve carries the cream→ink transition.
  const darkAt = props.globalStartFrame - 30;
  return (
    <V4Beat props={props} beat="B25" bareRoom darkLawAt={darkAt}>
      <B25Content vo={vo} />
    </V4Beat>
  );
};
const B25Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const forward = vo.at("forward", 235);
  const notYou = vo.at("you", 502, 3); // "you" ×9 in B25 — the 4th is the one on "not you"
  const job = vo.at("job", 581);
  const inventory = vo.at("inventory", 1019);
  const sell = vo.at("sell", 1166);
  const light = "#F4EFE2";
  // the beat runs +180f past its VO now, to let the title land and HOLD on
  // black (creator 2026-09-04: "it only shows 'nothing' … make sure it's
  // written"). type it out fast, then hold ~4.5 s with a slow breath.
  const typeAt = sell + 64;
  const typeEnd = typeAt + 40;
  const revealOut = typeAt - 18;
  return (
    <>
      {/* who pays for the app — app ← money ← advertiser, NOT you. the payment
          line draws in and flares. */}
      {frame >= forward - 6 && frame < job - 20 && (() => {
        const drawL = interpolate(frame, [forward + 16, forward + 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });
        const x0 = WIDTH * 0.1 + 280, x1 = WIDTH * 0.62;
        return (
          <>
            <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: lifeT(frame, forward, job - 24, DUR.big, DUR.enter) }}>
              <g fontFamily={SANS} fontWeight={800} textAnchor="middle">
                <rect x={WIDTH * 0.1} y={HEIGHT * 0.28} width={280} height={110} rx={14} fill="none" stroke={light} strokeWidth={3} />
                <text x={WIDTH * 0.1 + 140} y={HEIGHT * 0.28 + 66} fontSize={32} fill={light}>The app</text>
                <rect x={WIDTH * 0.62} y={HEIGHT * 0.28} width={320} height={110} rx={14} fill="none" stroke={light} strokeWidth={3} />
                <text x={WIDTH * 0.62 + 160} y={HEIGHT * 0.28 + 66} fontSize={32} fill={light}>An advertiser</text>
                <line x1={x1} y1={HEIGHT * 0.335} x2={x1 + (x0 - x1) * drawL} y2={HEIGHT * 0.335} stroke={COLOR.orange} strokeWidth={5} strokeLinecap="round" />
                {drawL > 0.98 && <path d={`M ${x0} ${HEIGHT * 0.335} l 14 -8 l 0 16 Z`} fill={COLOR.orange} />}
                {/* money keeps pumping advertiser → app while this holds */}
                {drawL > 0.98 && [0, 1, 2].map((k) => {
                  const p = (((frame - forward - 44) / 66 - k / 3) % 1 + 1) % 1;
                  return <circle key={k} cx={x1 + (x0 - x1) * p} cy={HEIGHT * 0.335} r={5} fill={light} opacity={0.8} />;
                })}
                <text x={WIDTH * 0.475} y={HEIGHT * 0.3} fontSize={18} fontFamily={FONT.mono} fill={COLOR.orange} opacity={drawL}>PAYS FOR IT</text>
                <text x={WIDTH * 0.475} y={HEIGHT * 0.44} fontSize={24} fill={COLOR.grey} opacity={interpolate(frame, [forward + 40, forward + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>— not you —</text>
              </g>
            </svg>
            <Spark at={forward + 46} x="47%" y="33%" r={220} intensity={0.4} />
          </>
        );
      })()}

      {/* the app's real job — types out over two lines, underlines, holds */}
      {frame >= job - 6 && frame < inventory - 20 && (() => {
        const jt = job + 8;
        const jt2 = jt + 46;
        const uW = interpolate(frame, [jt2 + 74, jt2 + 106], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.24, textAlign: "center", opacity: lifeT(frame, job, inventory - 24, DUR.big, DUR.enter) }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.16em", textTransform: "uppercase", color: COLOR.orange, opacity: enterT(frame, job, DUR.enter) }}>the app's real job</div>
            <div style={{ position: "relative", display: "inline-block", marginTop: 22 }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58, color: light, lineHeight: 1.2, whiteSpace: "nowrap" }}>
                <Typewriter text="describe you well enough" at={jt} cps={24} size={58} mono={false} color={light} caret={false} />
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58, color: light, lineHeight: 1.2, whiteSpace: "nowrap", minHeight: 70 }}>
                {frame >= jt2 && <Typewriter text="that a stranger will place a bid" at={jt2} cps={24} size={58} mono={false} color={light} caret={frame < jt2 + 90} />}
              </div>
              <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: -12, height: 4, width: `${uW * 80}%`, maxWidth: 700, background: COLOR.orange, borderRadius: 2 }} />
            </div>
            {frame >= jt2 + 110 && <LivePip x={WIDTH * 0.5 - 46} y={HEIGHT * 0.52} at={jt2 + 110} label="ALWAYS ON" />}
            <Spark at={jt2 + 96} x="50%" y="34%" r={260} intensity={0.4} />
          </div>
        );
      })()}

      {/* the reversal — holds, then lifts as the title types in its place */}
      {frame >= inventory - 6 && frame < typeAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.28, textAlign: "center", opacity: frame < revealOut ? 1 : exitT(frame, revealOut, 16) }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, color: COLOR.grey, opacity: enterT(frame, inventory, DUR.enter) }}>You were never the user.</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 120, color: COLOR.orange, letterSpacing: "-0.02em", marginTop: 12, opacity: enterT(frame, inventory + 14, DUR.big), scale: `${breathe(frame, 0, 0.014)}` }}>
            YOU ARE THE INVENTORY
          </div>
          {frame >= sell - 4 && <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: light, marginTop: 18, opacity: enterT(frame, sell, DUR.enter) }}>and the app is free because you sell.</div>}
        </div>
      )}

      {/* the title — types out fully, then HOLDS on black with a slow breath */}
      {frame >= typeAt - 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.44, textAlign: "center", opacity: enterT(frame, typeAt - 6, DUR.enter), scale: `${breathe(frame, 0, 0.008)}` }}>
          <Typewriter text="NOTHING IS FREE." at={typeAt} cps={15} size={84} color={light} />
          <div style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.3em", textTransform: "uppercase", color: COLOR.grey, marginTop: 22, opacity: enterT(frame, typeEnd + 14, DUR.big) }}>nothing is free · episode 2</div>
        </div>
      )}

      <Lane
        endAt={job - 12}
        items={[
          { text: "So change how you look at it. You think of the free app as a thing you use — run it forward instead.", at: vo.at("change", 5), size: 36, color: light },
          { text: "The app cannot survive unless someone pays for it. That someone is not you.", at: notYou - 40, size: 34, color: light },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B26 — you will feel it now
// ═══════════════════════════════════════════════════════════════════════════
export const B26v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B26");
  return (
    <V4Beat props={props} beat="B26" location="bedroom" zooms={[{ at: 996, hold: 34, x: "32%", y: "50%", scale: 1.32 }]}>
      <B26Content vo={vo} />
    </V4Beat>
  );
};
const B26Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const note = vo.at("note", 512);
  const track = vo.at("track", 770);
  const price = vo.atLast("price", 902);
  const seven = vo.atLast("seven", 984);
  // the "stutter" — a tiny stall in the phone's screen animation, on a loop:
  // every free-app open, the same micro-pause while the auction runs
  const stStart = vo.at("stutter", 78);
  const inCycle = frame > stStart && frame < note - 16 ? (frame - stStart) % 96 : -1;
  const stuttering = inCycle >= 0 && inCycle < 22;
  const stutter = stuttering ? Math.sin(frame * 0.9) * 2.4 : 0;
  return (
    <>
      <LuckyAt pose="sit" pose2="look" poseAt={track} gazeUpAt={track} at={6} x={WIDTH * 0.36} baseline={LOC_GROUND} expr={EXPR.wry} exprAt={seven + 10} />
      <div style={{ translate: `${stutter}px 0px` }}>
        <PhoneTap at={vo.at("feel", 20)} tapAt={vo.at("stutter", 78)} screen="ad" x={WIDTH * 0.5} y={HEIGHT * 0.46} w={168} out={note - 16} />
      </div>
      {/* the auction that lives inside that pause — flickers on each stutter */}
      {frame > stStart + 10 && frame < note - 16 && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 + 108, top: HEIGHT * 0.46 - 20, display: "flex", alignItems: "center", gap: 8, opacity: stuttering ? 0.9 : 0.18 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: COLOR.orange, boxShadow: stuttering ? `0 0 12px ${COLOR.orange}` : "none" }} />
          <span style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", color: COLOR.grey }}>AUCTION</span>
        </div>
      )}

      {/* a few hundred companies got a note about where you are */}
      {frame >= note - 6 && frame < track - 12 && (
        <>
          <Chips cx={WIDTH * 0.55} cy={HEIGHT * 0.24} count={60} at={note} spread={240} tone={COLOR.cardWhite} chip={22} />
          <div style={{ position: "absolute", left: WIDTH * 0.5 - 180, top: HEIGHT * 0.46, width: 360, padding: "22px 28px", background: COLOR.cardWhite, border: `2.5px solid ${COLOR.ink}`, borderRadius: 14, opacity: lifeT(frame, note + 14, track - 20, DUR.big, DUR.enter), rotate: "-3deg", filter: softShadow(1.2, 0.22) }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.1em", color: COLOR.orange }}>NOTE · ≈ 300 COMPANIES</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: COLOR.ink, marginTop: 6 }}>where you are, right now</div>
          </div>
          <Spark at={note + 18} x="55%" y="26%" r={240} intensity={0.38} />
        </>
      )}
      {/* the ATT toggle lowers your price */}
      {frame >= track - 6 && frame < seven - 10 && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 - 190, top: HEIGHT * 0.2, width: 380, padding: "20px 24px", background: COLOR.cardWhite, border: `2px solid ${COLOR.ink}`, borderRadius: 14, opacity: lifeT(frame, track, seven - 18, DUR.big, DUR.enter), filter: softShadow(1.1, 0.2) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, color: COLOR.ink }}>Ask App Not to Track</span>
            <div style={{ width: 52, height: 30, borderRadius: 15, background: frame > price ? COLOR.orange : COLOR.grid, position: "relative" }}>
              <div style={{ position: "absolute", top: 3, left: 3 + interpolate(frame, [price, price + 8], [0, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), width: 24, height: 24, borderRadius: "50%", background: COLOR.cardWhite }} />
            </div>
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 13, color: COLOR.grey, marginTop: 10 }}>doesn't stop the auction — just lowers your price</div>
        </div>
      )}
      <Lane
        items={[
          { text: "You will feel it now — that small stutter when a free app opens. That pause is the auction.", at: vo.at("feel", 26), size: 34 },
          { text: "Every time an app is free and shows you an ad, a few hundred companies just got a note about where you are.", at: note, size: 32 },
          { text: "There is a switch — Ask App Not to Track. It doesn't stop the auction. It just lowers your price.", at: track, size: 32 },
          { punch: "2¢ → 0.4¢", kicker: "The switch just lowers your price —", at: price, size: 148 },
          { punch: "ABOUT 1 PERSON IN 7 DOES", kicker: "Turn it on —", at: seven, size: 80 },
        ]}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B27 — bridge + CTA
// ═══════════════════════════════════════════════════════════════════════════
export const B27v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B27");
  return (
    <V4Beat props={props} beat="B27" bareRoom dots source="Prev: “56% of every movie ticket doesn't go to the theater”" push={[1, 1.04]}>
      <B27Content vo={vo} />
    </V4Beat>
  );
};
const B27Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const directions = vo.at("directions", 221);
  const maps = vo.at("Maps", 628);
  const ticket = vo.at("ticket", 784);
  const subscribe = vo.at("subscribe", 1042);
  const P0 = [WIDTH * 0.14, HEIGHT * 0.36], P1 = [WIDTH * 0.42, HEIGHT * 0.08], P2 = [WIDTH * 0.72, HEIGHT * 0.26];
  const path = `M ${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`;
  // a pin retraces the route on a loop — "the next one finds you"
  const trace = frame > directions + 50 ? (((frame - directions - 50) / 78) % 1) : -1;
  const bez = (t: number, a: number[], b: number[], c: number[]) => (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0];
  const bezY = (t: number, a: number[], b: number[], c: number[]) => (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1];
  const tx = trace >= 0 ? bez(trace, P0, P1, P2) : 0;
  const ty = trace >= 0 ? bezY(trace, P0, P1, P2) : 0;
  return (
    <>
      {/* a route drawing across a hint of a map */}
      {frame < subscribe - 30 && (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <DrawPath d={path} at={directions} dur={44} length={760} stroke={COLOR.orange} width={7} />
          {trace >= 0 && (
            <>
              {trace > 0.9 && <circle cx={P2[0]} cy={P2[1]} r={interpolate(trace, [0.9, 1], [10, 34])} fill="none" stroke={COLOR.orange} strokeWidth={2} opacity={interpolate(trace, [0.9, 1], [0.6, 0])} />}
              <circle cx={tx} cy={ty} r={10} fill={COLOR.orange} stroke={COLOR.cardWhite} strokeWidth={2.5} />
              <circle cx={tx} cy={ty} r={20} fill={COLOR.orange} opacity={0.18} />
            </>
          )}
          {frame >= maps - 6 && (
            <g transform={`translate(${WIDTH * 0.72} ${HEIGHT * 0.26})`} opacity={enterT(frame, maps, DUR.big)}>
              <path d="M 0 -44 C 28 -44 38 -18 0 30 C -38 -18 -28 -44 0 -44 Z" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />
              <circle cx={0} cy={-18} r={12} fill={COLOR.cardWhite} />
            </g>
          )}
        </svg>
      )}
      {frame >= maps - 6 && frame < subscribe - 30 && <EndpointTag x={WIDTH * 0.72} y={HEIGHT * 0.36} at={maps} label="NEXT — GOOGLE MAPS" />}

      {frame >= ticket - 6 && frame < subscribe - 20 && (
        <NodeCard x={WIDTH * 0.12} y={HEIGHT * 0.42} w={WIDTH * 0.42} at={ticket} out={subscribe - 24} variant="white" from="l"
          eyebrow="last episode" title="56% of every movie ticket never reaches the theatre" />
      )}
      <Lane
        tail={22}
        items={[
          { text: "Next time — an app most people don't think of as advertising at all. It gives you directions, and looks like a public service.", at: vo.at("Next", 2), size: 34 },
          { text: "It runs one of the most valuable versions of this auction on earth: Google Maps.", at: maps, size: 34 },
          { punch: "SUBSCRIBE", kicker: "The things you were sure were free —", sub: "and the next one finds you.", at: subscribe, size: 168 },
        ]}
      />
    </>
  );
};

export const V4_BEATS = {
  B00v4, B01v4, B02v4, B03v4, B04v4, B05v4, B06v4, B07v4, B08v4, B09v4,
  B10v4, B11v4, B12v4, B13v4, B14v4, B15v4, B16v4, B17v4, B18v4, B19v4,
  B20v4, B21v4, B22v4, B23v4, B24v4, B25v4, B26v4, B27v4,
} as const;
