import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, HEIGHT, SUPPORT, WIDTH, shade, softShadow, tint } from "../../tokens";
import { Bloom } from "../../parts/Bloom";

import { V4Beat } from "../../nif002/v4/V4Beat";
import { BeatSfx } from "./audio";
import { useBeatTiming } from "../timing";
import { LOC_GROUND } from "../../nif002/v4/locations";
import { EXPR, FIG, Figure } from "../../nif002/v4/Figure";
import { Spark } from "../../nif002/v4/spark";
import { SANS } from "../../nif002/v4/fonts4";
import { TV, PaymentGlyphs } from "./TV";
import { DimCard } from "./DimCard";
import {
  IconAntenna,
  IconFootball,
  IconJersey,
  IconMegaphone,
  IconNewsDesk,
  IconRatingStar,
  IconSatelliteDish,
  IconSports,
  IconStationBuilding,
  IconStreamPlay,
  IconTower,
  IconTVSet,
  IconVillainMustache,
} from "./icons";

/**
 * beats.tsx — NIF003 ("You don't pay for TV") in the v4 language, reusing the
 * shared NIF002 v4 kit (Figure, KineticText/Lane, locations, spark, language)
 * rather than duplicating it. Two NIF003-specific additions:
 *
 *   - `./timing` (NOT nif002's) — see that file's own note on why: V4Beat's
 *     `useVO` re-export is hard-wired to nif002/timing.json, so beats here
 *     call `useBeatTiming` from the local shim directly instead.
 *   - `./TV.tsx` / `./DimCard.tsx` — this episode's own cold-open prop and
 *     the "premium card depth" treatment (creator, 2026-09-05: cards/icons
 *     get real dimensional depth; characters and locations stay flat).
 *
 * Every beat passes `audioDir="nif003" noTransition` to V4Beat (see that component's own
 * note — it defaults to "nif002" for backward compat, so this is required,
 * not optional, for every NIF003 beat).
 */

const useVO = (beat: string) => useBeatTiming(beat.replace(/v4$/i, ""));
type VO = ReturnType<typeof useVO>;

// ═══════════════════════════════════════════════════════════════════════════
// B00 — the cold open + signature: Lucky turns on a "free" channel; four
// payments leave before the show has properly started.
// ═══════════════════════════════════════════════════════════════════════════
export const B00v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B00");
  return (
    <V4Beat props={props} beat="B00" audioDir="nif003" noTransition sfx={<BeatSfx beat="B00" />} bareRoom push={[1, 1.03]}>
      <B00Content vo={vo} />
    </V4Beat>
  );
};

const B00Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  const clickAt = vo.at("turned", 125) - 14; // she clicks the remote just before "turned on"
  const four = vo.at("four", 199);
  const companies = vo.at("companies", 212);

  //  progressive build (local frames) — SFX in NIF003-sfx-cues.md:
  //    f2  room in (whoosh)  ·  f18 Lucky settles (tap)  ·  clickAt remote
  //    click (switch) → TV on  ·  f199 four coins fire (coin ×4) + Lucky
  //    startles  ·  f199 the four company marks stamp in at the top edge
  const tvX = WIDTH * 0.57;
  const tvBaseY = 706;
  const screenX = tvX;
  const screenY = 388;
  const tvOn = interpolate(frame, [clickAt + 4, clickAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const luckyT = spring({ frame: frame - 18, fps: 30, config: { damping: 14 }, durationInFrames: 24 });
  const startled = frame > companies - 6;

  // the four companies — marks that stamp in along the top as the coins hit
  // them ("four companies, before your show even started"). Sets up B01.
  const marks: { Icon: React.FC<{ size?: number }>; x: number; ang: number }[] = [
    { Icon: IconTower, x: 700, ang: -52 },
    { Icon: IconStationBuilding, x: 990, ang: -24 },
    { Icon: IconRatingStar, x: 1280, ang: 6 },
    { Icon: IconMegaphone, x: 1560, ang: 34 },
  ];
  const markY = 150;

  return (
    <>
      <LivingRoom credAt={2} clockAt={16} />

      {/* Lucky — centre-left on a floor cushion, remote in hand, watching the
          TV. Startles when the payments fire. */}
      {luckyT > 0.01 && (
        <>
          <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: Math.min(1, luckyT) }}>
            <ellipse cx={WIDTH * 0.28} cy={LOC_GROUND + 12} rx={132} ry={24} fill={tint(SUPPORT.clay, 0.3)} stroke={COLOR.ink} strokeWidth={3} />
          </svg>
          <Figure
            pose="sit"
            gazeUp
            holdRemote
            h={Math.round(FIG.seated * 1.5)}
            x={WIDTH * 0.28}
            baseline={LOC_GROUND}
            facing={1}
            tee={COLOR.orange}
            idle
            opacity={Math.min(1, luckyT)}
            dy={(1 - luckyT) * 26}
            expr={startled ? EXPR.surprise : EXPR.neutral}
          />
          {/* startle mark above her head */}
          {startled && (
            <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <text
                x={WIDTH * 0.28 + 120}
                y={370 - interpolate(frame, [companies - 6, companies + 6], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                fontFamily={SANS}
                fontWeight={800}
                fontSize={interpolate(frame, [companies - 6, companies + 8], [0, 96], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                fill={COLOR.orange}
                stroke={COLOR.ink}
                strokeWidth={4}
                textAnchor="middle"
              >!</text>
            </svg>
          )}
        </>
      )}

      {/* the TV — set on the credenza; screen clicks on when she presses the
          remote */}
      {frame >= clickAt - 20 && (
        <TV
          x={tvX}
          y={tvBaseY}
          w={420}
          reveal={interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          on={tvOn}
        />
      )}

      {/* four coins fire out of the screen the instant it lights */}
      <PaymentGlyphs
        originX={screenX}
        originY={screenY}
        specs={marks.map((m, i) => ({ at: four + i * 5, angle: m.ang, label: ["NET", "STA", "RTG", "ADV"][i] }))}
      />

      {/* quick lines from the TV up to each company mark as it lands — the
          "four companies" made a connected fan, not scattered icons */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {marks.map((m, i) => {
          const at = four + i * 5 + 10;
          const d = interpolate(frame, [at, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (d <= 0) return null;
          const len = Math.hypot(m.x - screenX, markY + 60 - screenY);
          return (
            <line key={i} x1={screenX} y1={screenY} x2={m.x} y2={markY + 62}
              stroke={COLOR.orange} strokeWidth={3} strokeLinecap="round" strokeDasharray={`${len}`} strokeDashoffset={len * (1 - d)} opacity={0.7} />
          );
        })}
      </svg>

      {/* the four company marks stamp in along the top as the coins land */}
      {marks.map((m, i) => {
        const at = four + i * 5 + 14;
        const t = spring({ frame: frame - at, fps: 30, config: { damping: 12, mass: 0.6 }, durationInFrames: 22 });
        if (t <= 0.01) return null;
        return (
          <div key={i} style={{
            position: "absolute", left: m.x - 64, top: markY - 64, width: 128, textAlign: "center",
            opacity: Math.min(1, t), transform: `translateY(${(1 - t) * -20}px) scale(${0.7 + t * 0.3})`,
            filter: softShadow(0.9, 0.22),
          }}>
            <div style={{ width: 120, height: 120, margin: "0 auto", borderRadius: 22, background: COLOR.orange, border: `4px solid ${COLOR.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <m.Icon size={72} />
            </div>
          </div>
        );
      })}
      {frame >= four && frame < four + 40 && <Spark at={four} x={WIDTH * 0.5} y={markY} r={220} intensity={0.5} />}

      {companies > 0 && (
        <Bloom window={[companies - 4, companies + 8, companies + 50, companies + 80]} radius={300} x="50%" y="18%" intensity={0.4} />
      )}

      {/* TEXT STRIPPED 2026-09-06 (§22.7). The channel signature "Nothing is
          free." + the "FOUR COMPANIES" punch are added in Resolve — full
          specs in 08_conform/NIF003-text-timing.md under B00 / SIGNATURE. */}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B01 — the promise. Same living room as B00/B02 (grey credenza, wall clock).
// Lucky watches the TV; the instant it's on, money sprays out of the screen
// and lands on four drawn companies in turn — tower, station, ratings star,
// billboard — each on its own "paid" word. The bill on the credenza climbs;
// on "millions quit", viewers walk out the right edge.
// TEXT STRIPPED 2026-09-06 (§22.7) — subtitles/punch go in Resolve; see
// 08_conform/NIF003-text-timing.md. Everything on screen here is artwork.
// ═══════════════════════════════════════════════════════════════════════════
export const B01v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B01");
  return (
    <V4Beat props={props} beat="B01" audioDir="nif003" noTransition sfx={<BeatSfx beat="B01" />} bareRoom push={[1, 1.02]}>
      <B01Content vo={vo} />
    </V4Beat>
  );
};

type ChainNode = { name: string; payAt: number; wordAt: number; Icon: React.FC<{ size?: number }>; pos: [number, number]; ang: number };

// the shared NIF003 room — grey credenza across the bottom third + the wall
// clock (same vocabulary as B00/B02). No rug, no colour wash — cream is the
// floor. `build` schedules the pieces in one at a time (creator 2026-09-06:
// "first the grey bar, then the TV, then Lucky… every one or two seconds we
// add it and animate it", §22.7).
const LivingRoom: React.FC<{ credAt: number; clockAt: number }> = ({ credAt, clockAt }) => {
  const frame = useCurrentFrame();
  const cx = WIDTH * 0.5;
  const topY = (HEIGHT * 2) / 3;
  const w = WIDTH * 0.92;
  const h = 178;
  const clkX = 176;
  const clkY = 168;
  const led = Math.sin(frame / 9) > 0.3 ? 1 : 0.25;
  const cred = spring({ frame: frame - credAt, fps: 30, config: { damping: 15, mass: 0.9 }, durationInFrames: 30 });
  const clk = spring({ frame: frame - clockAt, fps: 30, config: { damping: 14 }, durationInFrames: 26 });
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {cred > 0.01 && (
        <g opacity={cred} transform={`translate(0 ${(1 - cred) * 90})`} style={{ filter: softShadow(0.9, 0.2) }}>
          {[-1, 1].map((s) => (
            <rect key={s} x={cx + s * (w / 2 - 26) - 8} y={topY + h} width={16} height={36} fill={COLOR.ink} />
          ))}
          <rect x={cx - w / 2} y={topY} width={w} height={h} rx={6} fill={tint(COLOR.grey, 0.62)} stroke={COLOR.ink} strokeWidth={4} />
          <rect x={cx - w / 2 + 8} y={topY + 6} width={w - 16} height={6} rx={3} fill={tint(COLOR.grey, 0.78)} />
          {[-0.32, -0.08, 0.16, 0.4].map((f, i) => (
            <line key={i} x1={cx + w * f} y1={topY + 14} x2={cx + w * f} y2={topY + h - 10} stroke={shade(COLOR.grey, 0.1)} strokeWidth={3} />
          ))}
          {/* cable box + blinking LED, far right of the credenza */}
          <rect x={cx + w * 0.3} y={topY - 22} width={104} height={24} rx={4} fill={COLOR.ink} />
          <circle cx={cx + w * 0.3 + 82} cy={topY - 10} r={4} fill={COLOR.orange} opacity={led} />
          {/* a couple of leaning books at the left end */}
          <rect x={cx - w / 2 + 40} y={topY - 46} width={16} height={46} fill={shade(SUPPORT.teal, 0.05)} stroke={COLOR.ink} strokeWidth={2.5} />
          <rect x={cx - w / 2 + 60} y={topY - 52} width={16} height={52} fill={SUPPORT.clay} stroke={COLOR.ink} strokeWidth={2.5} />
          <rect x={cx - w / 2 + 80} y={topY - 40} width={16} height={40} fill={tint(COLOR.grey, 0.3)} stroke={COLOR.ink} strokeWidth={2.5} transform={`rotate(9 ${cx - w / 2 + 88} ${topY})`} />
          {/* a potted plant at the right end, gently swaying */}
          <g transform={`translate(${cx + w / 2 - 90} ${topY})`}>
            <path d={`M -22 0 L 22 0 L 15 -40 L -15 -40 Z`} fill={SUPPORT.clay} stroke={COLOR.ink} strokeWidth={3} />
            {[-1, 0, 1].map((k) => (
              <path key={k} d={`M 0 -36 Q ${k * 26 + Math.sin(frame / 40 + k) * 5} -78 ${k * 34} -104`} fill="none" stroke={SUPPORT.forest} strokeWidth={7} strokeLinecap="round" />
            ))}
          </g>
        </g>
      )}
      {clk > 0.01 && (
        <g opacity={clk} style={{ filter: softShadow(0.7, 0.14) }} transform={`translate(${clkX} ${clkY}) scale(${0.6 + clk * 0.4})`}>
          <circle r={62} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={5} />
          {[0, 90, 180, 270].map((d) => (
            <line key={d} x1={Math.sin((d * Math.PI) / 180) * 44} y1={-Math.cos((d * Math.PI) / 180) * 44} x2={Math.sin((d * Math.PI) / 180) * 54} y2={-Math.cos((d * Math.PI) / 180) * 54} stroke={COLOR.ink} strokeWidth={4} strokeLinecap="round" />
          ))}
          <line x1={0} y1={0} x2={Math.sin(frame / 900) * 22} y2={-Math.cos(frame / 900) * 22} stroke={COLOR.ink} strokeWidth={5} strokeLinecap="round" />
          <line x1={0} y1={0} x2={Math.sin(frame / 150) * 36} y2={-Math.cos(frame / 150) * 36} stroke={COLOR.orange} strokeWidth={3} strokeLinecap="round" />
          <circle r={5} fill={COLOR.ink} />
        </g>
      )}
    </svg>
  );
};

// one company — a drawn icon in a soft badge with a name label; enters on its
// own word, fills orange with a ✓ on its "paid" word.
const CompanyMark: React.FC<{
  x: number; y: number; label: string; Icon: React.FC<{ size?: number }>;
  appearAt: number; payAt: number;
}> = ({ x, y, label, Icon, appearAt, payAt }) => {
  const frame = useCurrentFrame();
  const t = spring({ frame: frame - appearAt, fps: 30, config: { damping: 13, mass: 0.7 }, durationInFrames: 30 });
  if (t <= 0.01) return null;
  const paid = frame >= payAt;
  const pop = interpolate(frame, [payAt - 2, payAt + 6, payAt + 30], [1, 1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wob = Math.sin((frame + x) / 46) * 3;
  return (
    <div style={{
      position: "absolute", left: x - 110, top: y - 110, width: 220, textAlign: "center",
      opacity: Math.min(1, t), transform: `translateY(${(1 - t) * 24}px) perspective(800px) rotateY(${wob}deg) scale(${(0.7 + t * 0.3) * pop})`,
      filter: softShadow(1, 0.22),
    }}>
      <div style={{
        width: 148, height: 148, margin: "0 auto", borderRadius: 26,
        background: paid ? COLOR.orange : COLOR.cardWhite, border: `4px solid ${COLOR.ink}`,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        transition: "background 0.2s",
      }}>
        <Icon size={90} />
        {paid && (
          <div style={{ position: "absolute", right: -13, top: -13, width: 42, height: 42, borderRadius: "50%", background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 24, color: COLOR.orange }}>✓</div>
        )}
      </div>
      <div style={{ marginTop: 12, fontFamily: SANS, fontWeight: 800, fontSize: 25, letterSpacing: "0.02em", color: COLOR.ink }}>{label}</div>
    </div>
  );
};

const B01Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();

  // ── progressive build schedule (local frames) ────────────────────────────
  //  SFX cues (see 08_conform/NIF003-sfx-cues.md):
  //    f6   credenza slides in    → whoosh (soft)
  //    f60  TV set down + clicks on → thunk + switch
  //    f110 Lucky settles          → tap (soft)
  //    f230 bill drops on credenza → thunk
  //    each NETWORK/STATION/RATINGS/ADVERTISER enter → plip ; on "paid" → coin
  //    f706 full-chain glow        → chime-bright
  //    f936+ bill climbing         → rising plips
  //    f979+ each viewer leaves    → tick
  const CRED_AT = 6;
  const CLOCK_AT = 26;
  const TV_AT = 58;
  const LUCKY_AT = 108;
  const BILL_AT = 230;

  const tvX = 452;
  const tvBaseY = 704;
  const screenX = tvX;
  const screenY = 452;

  const nodes: ChainNode[] = [
    { name: "NETWORK", wordAt: vo.at("network", 305), payAt: vo.at("paid", 326), Icon: IconTower, pos: [770, 246], ang: 40 },
    { name: "STATION", wordAt: vo.at("station", 359), payAt: vo.at("paid", 384, 1), Icon: IconStationBuilding, pos: [1030, 202], ang: 26 },
    { name: "RATINGS", wordAt: vo.at("ratings", 439), payAt: vo.at("paid", 487, 2), Icon: IconRatingStar, pos: [1292, 202], ang: 14 },
    { name: "ADVERTISER", wordAt: vo.at("advertis", 540), payAt: vo.at("pays", 578), Icon: IconMegaphone, pos: [1552, 258], ang: 4 },
  ];
  const paidCount = nodes.filter((n) => frame >= n.payAt).length;

  const chainPts: [number, number][] = [[screenX, screenY], ...nodes.map((n) => n.pos)];
  const drawnSegs = nodes.filter((n) => frame >= n.wordAt - 4).length;
  const chainD = chainPts.slice(0, drawnSegs + 1).map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  const linkLine = vo.at("link", 706);
  const chainGlow = interpolate(frame, [linkLine - 4, linkLine + 14, linkLine + 96], [0, 1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const climbAt = vo.at("climbing", 936);
  const bill = 83 + paidCount * 3 + interpolate(frame, [climbAt, 1064], [0, 21], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const climbing = frame >= climbAt - 6;
  const quitAt = vo.at("millions", 979);
  const quitShare = interpolate(frame, [quitAt, 1060], [0.12, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const luckyT = spring({ frame: frame - LUCKY_AT, fps: 30, config: { damping: 14 }, durationInFrames: 26 });
  const billT = spring({ frame: frame - BILL_AT, fps: 30, config: { damping: 14 }, durationInFrames: 24 });

  return (
    <>
      <LivingRoom credAt={CRED_AT} clockAt={CLOCK_AT} />

      {/* a framed picture on the wall, upper-left — fills the corner, sways a
          hair. Enters with the clock. */}
      {frame >= CLOCK_AT + 8 && (
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [CLOCK_AT + 8, CLOCK_AT + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <g transform={`translate(372 250) rotate(${Math.sin(frame / 120) * 0.7})`} style={{ filter: softShadow(0.7, 0.16) }}>
            <rect x={-96} y={-72} width={192} height={144} rx={4} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={5} />
            <rect x={-80} y={-56} width={160} height={112} fill={tint(SUPPORT.sky, 0.35)} />
            <path d="M -80 40 L -30 -10 L 6 26 L 44 -20 L 80 24 L 80 56 L -80 56 Z" fill={tint(SUPPORT.forest, 0.2)} stroke={COLOR.ink} strokeWidth={3} />
            <circle cx={44} cy={-34} r={12} fill={tint(COLOR.orange, 0.4)} stroke={COLOR.ink} strokeWidth={3} />
          </g>
        </svg>
      )}

      {/* the TV on the credenza — set down at f58, screen powers on right after */}
      {frame >= TV_AT - 2 && (
        <TV
          x={tvX}
          y={tvBaseY}
          w={306}
          reveal={interpolate(frame, [TV_AT - 2, TV_AT + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          on={interpolate(frame, [TV_AT + 12, TV_AT + 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      )}

      {/* Lucky — far left, on a floor cushion, watching the TV. Enters at
          f108 ("your living room"). */}
      {luckyT > 0.01 && (
        <>
          <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: Math.min(1, luckyT) }}>
            <ellipse cx={188} cy={LOC_GROUND + 12} rx={122} ry={22} fill={tint(SUPPORT.clay, 0.3)} stroke={COLOR.ink} strokeWidth={3} />
          </svg>
          <Figure pose="sit" x={176} baseline={LOC_GROUND} h={Math.round(FIG.seated * 1.35)} facing={1} tee={COLOR.orange} idle opacity={Math.min(1, luckyT)} dy={(1 - luckyT) * 28} />
        </>
      )}

      {/* money sprays out of the screen as each company is paid */}
      <PaymentGlyphs
        originX={screenX}
        originY={screenY}
        specs={nodes.map((n) => ({ at: n.payAt - 8, angle: n.ang, label: n.name.slice(0, 3) }))}
      />

      {/* the chain line + full-chain glow */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {chainGlow > 0.02 && drawnSegs > 0 && (
          <path d={chainPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ")} fill="none" stroke={COLOR.orange} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={0.16 * chainGlow} />
        )}
        {drawnSegs > 0 && (
          <path d={chainD} fill="none" stroke={COLOR.orange} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 12" opacity={0.9} />
        )}
      </svg>

      {/* the four companies */}
      {nodes.map((n, i) => (
        <React.Fragment key={i}>
          <CompanyMark x={n.pos[0]} y={n.pos[1]} label={n.name} Icon={n.Icon} appearAt={n.wordAt - 6} payAt={n.payAt} />
          {frame >= n.payAt && frame < n.payAt + 26 && <Spark at={n.payAt} x={n.pos[0]} y={n.pos[1]} r={140} intensity={0.7} />}
        </React.Fragment>
      ))}

      {/* the bill — a receipt propped on the credenza, centre. drops in at
          f230, climbs with each payment, ramps on "keeps climbing". */}
      {billT > 0.01 && (
        <div style={{ position: "absolute", left: 726, top: 536, width: 452, opacity: Math.min(1, billT), transform: `translateY(${(1 - billT) * 26}px)` }}>
          <DimCard x={226} y={100} w={452} h={196} fill={COLOR.cardWhite} tilt={6}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.grey }}>Your TV bill</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 68, lineHeight: 1, color: climbing ? COLOR.orange : COLOR.ink, marginTop: 4 }}>
              ${bill.toFixed(0)}<span style={{ fontSize: 22, color: COLOR.grey }}> /mo</span>
              {climbing && <span style={{ marginLeft: 12 }}>▲</span>}
            </div>
            <div style={{ marginTop: 14, width: 390, height: 14, background: COLOR.paper, border: `2px solid ${COLOR.ink}`, borderRadius: 7, overflow: "hidden" }}>
              <div style={{ width: `${quitShare * 100}%`, height: "100%", background: COLOR.grey }} />
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: COLOR.grey, marginTop: 6 }}>
              {Math.round(quitShare * 100)}% have quit paying
            </div>
          </DimCard>
        </div>
      )}

      {/* viewers walking out on "millions quit" */}
      {frame >= quitAt - 20 && (
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {[0, 1, 2, 3].map((i) => {
            const go = interpolate(frame, [quitAt + i * 18, quitAt + i * 18 + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const gx = 1150 + i * 60 + go * 780;
            const step = Math.sin((frame + i * 20) / 5) * 7;
            if (go >= 1) return null;
            return (
              <g key={i} transform={`translate(${gx} ${LOC_GROUND - 8})`} opacity={1 - go * 0.3}>
                <circle cx={0} cy={-64} r={13} fill={COLOR.grey} stroke={COLOR.ink} strokeWidth={3} />
                <path d={`M -14 0 q 0 -44 14 -44 q 14 0 14 44`} fill={COLOR.grey} stroke={COLOR.ink} strokeWidth={3} />
                <line x1={-6} y1={0} x2={-6 - step} y2={22} stroke={COLOR.ink} strokeWidth={5} strokeLinecap="round" />
                <line x1={6} y1={0} x2={6 + step} y2={22} stroke={COLOR.ink} strokeWidth={5} strokeLinecap="round" />
              </g>
            );
          })}
        </svg>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B02 — the honest part / save-the-cat. Lucky relaxed on the couch; the
// things that genuinely cost money appear beside her one at a time (sports $,
// a newsroom, a small town that goes dark), then the villain that ISN'T
// twirling a mustache, the 1992 rule (seeds B04), and her own football
// bundle. Warm, calm, one object at a time. Text → Resolve (§22.7).
// ═══════════════════════════════════════════════════════════════════════════
export const B02v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B02");
  return (
    <V4Beat props={props} beat="B02" audioDir="nif003" noTransition sfx={<BeatSfx beat="B02" />} bareRoom push={[1, 1.02]}>
      <B02Content vo={vo} />
    </V4Beat>
  );
};

// a concept object that fades in on `at`, holds, fades out at `out` — the
// object-level equivalent of the one-at-a-time caption lane.
const showHold = (frame: number, at: number, out: number) =>
  interpolate(frame, [at - 8, at + 14, out - 20, out], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const ConceptObj: React.FC<{
  at: number; out: number; x: number; y: number; label?: string; tag?: string; children: React.ReactNode;
}> = ({ at, out, x, y, label, tag, children }) => {
  const frame = useCurrentFrame();
  const t = showHold(frame, at, out);
  if (t <= 0.01) return null;
  const wob = Math.sin(frame / 52) * 4;
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: 340, textAlign: "center",
      opacity: t, transform: `translateY(${(1 - t) * 22}px) perspective(760px) rotateY(${wob}deg)`,
      filter: softShadow(0.9, 0.22),
    }}>
      {label && <div style={{ marginBottom: 12, fontFamily: SANS, fontWeight: 700, fontSize: 21, letterSpacing: "0.04em", textTransform: "uppercase", color: COLOR.grey }}>{label}</div>}
      {children}
      {tag && <div style={{ marginTop: 10, display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 22, color: "#fff", background: COLOR.orange, border: `3px solid ${COLOR.ink}`, borderRadius: 999, padding: "3px 16px" }}>{tag}</div>}
    </div>
  );
};

// ── shared beat vocabulary (B08+ chip grammar, data-beat hero numbers) ─────
/** a rotated boxed label that punches in on `at`. */
const Stamp: React.FC<{ at: number; x: string | number; y: number; text: string; kind?: "ink" | "orange"; size?: number; rot?: number }> = ({ at, x, y, text, kind = "ink", size = 44, rot = -3 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - 6, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  const pop = interpolate(frame, [at - 6, at + 8], [1.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: typeof x === "number" ? x : undefined, right: undefined, top: y, ...(typeof x === "string" ? { left: 0, right: 0, textAlign: "center" } : {}), opacity: t }}>
      <span style={{
        display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: "0.02em",
        color: kind === "orange" ? "#fff" : "#fff", background: kind === "orange" ? COLOR.orange : COLOR.ink,
        border: `${Math.round(size / 12)}px solid ${kind === "orange" ? COLOR.ink : COLOR.orange}`, borderRadius: 14, padding: `${size * 0.24}px ${size * 0.7}px`,
        transform: `rotate(${rot}deg) scale(${pop})`,
      }}>{text}</span>
    </div>
  );
};

/** a company / channel chip. `dark` greys it out. */
const Chip: React.FC<{ label: string; at: number; x: number; y: number; w?: number; dark?: boolean; solid?: boolean; lit?: boolean; big?: boolean }> = ({ label, at, x, y, w = 260, dark, solid, lit, big }) => {
  const frame = useCurrentFrame();
  const t = spring({ frame: frame - at, fps: 30, config: { damping: 13 }, durationInFrames: 22 });
  if (t <= 0.01) return null;
  const bg = lit ? COLOR.orange : dark ? COLOR.ink : solid ? COLOR.ink : COLOR.cardWhite;
  const fg = lit ? "#fff" : dark ? "#555" : solid ? "#fff" : COLOR.ink;
  return (
    <div style={{
      position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center",
      opacity: Math.min(1, t), transform: `scale(${(0.7 + t * 0.3).toFixed(3)})`,
      fontFamily: SANS, fontWeight: 800, fontSize: big ? 56 : 32, color: fg,
      background: bg, border: `${big ? 5 : 4}px solid ${COLOR.ink}`, borderRadius: 14, padding: big ? "18px 8px" : "12px 8px",
      filter: lit ? "drop-shadow(0 0 20px rgba(226,77,40,0.6))" : softShadow(0.9, 0.2),
    }}>{label}</div>
  );
};

/** the episode throughline — a low strip along the bottom third showing the
 *  payment chain, with the current beat's link lit. Persists across every
 *  non-domestic beat (house style: "throughline elements persist and
 *  transform across beats"), which also keeps the bottom third alive. */
const ChainStrip: React.FC<{ active?: number; at?: number }> = ({ active = -1, at = 8 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  const links = ["NETWORK", "STATION", "CABLE / STREAM", "YOU"];
  const y = 972; // a compact footer in the very bottom band, clear of beat content
  const chipW = 300, gap = 74;
  const totW = links.length * chipW + (links.length - 1) * gap;
  void totW;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap, opacity: t }}>
      {links.map((l, i) => {
        const on = i === active;
        return (
          <div key={i} style={{ position: "relative", width: chipW, textAlign: "center" }}>
            <div style={{
              fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.02em",
              color: on ? "#fff" : COLOR.grey, background: on ? COLOR.orange : COLOR.cardWhite,
              border: `3px solid ${on ? COLOR.ink : tint(COLOR.grey, 0.4)}`, borderRadius: 10, padding: "10px 4px",
              transform: on ? `scale(${1 + Math.sin(frame / 14) * 0.03})` : undefined,
            }}>{l}</div>
            {i < links.length - 1 && (
              <span style={{ position: "absolute", right: -gap / 2 - 8, top: 12, fontFamily: SANS, fontWeight: 800, fontSize: 26, color: tint(COLOR.grey, 0.2) }}>›</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** a huge held hero number, top-right by default. */
const HeroNum: React.FC<{ at: number; value: string; label: string; x?: number | string; y?: number; align?: "left" | "right" | "center"; size?: number }> = ({ at, value, label, x = 90, y = 80, align = "right", size = 190 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - 8, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  const pos = align === "right" ? { right: x as number, textAlign: "right" as const } : align === "center" ? { left: 0, right: 0, textAlign: "center" as const } : { left: x as number, textAlign: "left" as const };
  return (
    <div style={{ position: "absolute", top: y, ...pos, opacity: t }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.08em", textTransform: "uppercase", color: COLOR.grey }}>{label}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 0.95, color: COLOR.orange, transform: `scale(${0.9 + t * 0.1})`, transformOrigin: align }}>{value}</div>
    </div>
  );
};

const B02Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();

  //  progressive build — SFX in NIF003-sfx-cues.md. Room f2, Lucky f18,
  //  then one concept object per line, each held while its line is spoken.
  const sportsAt = vo.at("sports", 216);
  const newsAt = vo.at("news", 351);
  const townAt = vo.at("town", 517);
  const disappearAt = vo.at("disappear", 765);
  const villAt = vo.at("cartoon", 897);
  const mustAt = vo.at("mustache", 947);
  const ruleAt = vo.at("congress", 1073);
  const ballAt = vo.at("football", 1251);

  const luckyT = spring({ frame: frame - 18, fps: 30, config: { damping: 14 }, durationInFrames: 24 });
  const villCrossed = interpolate(frame, [mustAt + 18, mustAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shrug = interpolate(frame, [ballAt + 20, ballAt + 40, ballAt + 120, ballAt + 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // big central object slot; finished cost-items shrink into a row on the
  // credenza ("the honest tab so far") instead of vanishing (§ house-style
  // "PARK, don't delete").
  const CX = 1060;
  const CY = 300;
  const parkY = (HEIGHT * 2) / 3 - 92;

  const costItems = [
    { at: sportsAt, parkX: 760, Icon: IconSports, label: "SPORTS" },
    { at: newsAt, parkX: 1080, Icon: IconNewsDesk, label: "NEWSROOM" },
    { at: townAt, parkX: 1400, Icon: IconStationBuilding, label: "LOCAL NEWS" },
  ];

  return (
    <>
      <LivingRoom credAt={2} clockAt={16} />

      {/* wall picture, upper-left, + a floor lamp — fill the left wall */}
      {frame >= 22 && (
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [22, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <g transform={`translate(392 244) rotate(${Math.sin(frame / 130) * 0.6})`} style={{ filter: softShadow(0.7, 0.16) }}>
            <rect x={-92} y={-70} width={184} height={140} rx={4} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={5} />
            <rect x={-77} y={-55} width={154} height={110} fill={tint(SUPPORT.sky, 0.35)} />
            <path d="M -77 40 L -28 -10 L 6 24 L 42 -18 L 77 22 L 77 55 L -77 55 Z" fill={tint(SUPPORT.forest, 0.2)} stroke={COLOR.ink} strokeWidth={3} />
          </g>
          {/* floor lamp behind the chair */}
          <g transform="translate(150 0)" style={{ filter: softShadow(0.8, 0.18) }}>
            <line x1={0} y1={LOC_GROUND} x2={0} y2={430} stroke={COLOR.ink} strokeWidth={7} />
            <path d="M -46 430 L 46 430 L 30 350 L -30 350 Z" fill={tint(COLOR.orange, 0.35)} stroke={COLOR.ink} strokeWidth={4} />
            <ellipse cx={0} cy={LOC_GROUND + 6} rx={40} ry={9} fill={COLOR.ink} />
          </g>
        </svg>
      )}

      {/* Lucky — in a simple armchair, centre-left, relaxed, remote in hand */}
      {luckyT > 0.01 && (
        <>
          <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: Math.min(1, luckyT) }}>
            <g style={{ filter: softShadow(1, 0.2) }}>
              <ellipse cx={360} cy={LOC_GROUND + 16} rx={210} ry={26} fill={tint(SUPPORT.clay, 0.28)} />
              <rect x={214} y={LOC_GROUND - 150} width={300} height={166} rx={20} fill={shade(SUPPORT.teal, 0.04)} stroke={COLOR.ink} strokeWidth={4} />
              <rect x={196} y={LOC_GROUND - 220} width={70} height={236} rx={18} fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={4} />
              <rect x={462} y={LOC_GROUND - 220} width={70} height={236} rx={18} fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={4} />
              <rect x={266} y={LOC_GROUND - 210} width={196} height={70} rx={16} fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={4} />
            </g>
          </svg>
          <Figure
            pose="sit"
            holdRemote
            x={356}
            baseline={LOC_GROUND + 2}
            h={Math.round(FIG.seated * 1.55)}
            facing={1}
            tee={COLOR.orange}
            idle
            opacity={Math.min(1, luckyT)}
            dy={(1 - luckyT) * 26 - shrug * 8}
          />
        </>
      )}

      {/* the honest-tab row on the credenza — each cost-item, once its line is
          done, shrinks here and stays */}
      {costItems.map((c, i) => {
        const parked = frame > c.at + 150;
        const t = spring({ frame: frame - c.at, fps: 30, config: { damping: 13 }, durationInFrames: 26 });
        if (t <= 0.01) return null;
        const bigX = CX, bigY = CY, big = 380;
        const px = c.parkX, py = parkY, small = 150;
        const p = interpolate(frame, [c.at + 130, c.at + 155], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const x = bigX + (px - bigX) * p;
        const y = bigY + (py - bigY) * p;
        const s = (big + (small - big) * p) / big;
        return (
          <div key={i} style={{
            position: "absolute", left: x - big / 2, top: y - big / 2, width: big, textAlign: "center",
            opacity: Math.min(1, t), transform: `scale(${(s * (0.8 + t * 0.2)).toFixed(3)})`, transformOrigin: "center",
            filter: softShadow(1, 0.22),
          }}>
            <div style={{ width: big, height: big, margin: "0 auto", borderRadius: 28, background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <c.Icon size={big * 0.6} />
            </div>
            {!parked && p < 0.3 && <div style={{ marginTop: 12, display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#fff", background: COLOR.orange, border: `3px solid ${COLOR.ink}`, borderRadius: 999, padding: "5px 20px" }}>costs real money</div>}
            {p > 0.6 && <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: "0.04em", color: COLOR.ink }}>{c.label}</div>}
          </div>
        );
      })}
      {/* a small "town goes dark" note under LOCAL NEWS as it parks */}
      {frame > disappearAt - 10 && frame < villAt && (
        <div style={{ position: "absolute", left: costItems[2].parkX - 130, top: parkY + 96, width: 260, textAlign: "center", opacity: showHold(frame, disappearAt, villAt - 10) }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, color: COLOR.orange, textTransform: "uppercase", letterSpacing: "0.06em" }}>…goes dark with it</div>
        </div>
      )}

      {/* nobody is a cartoon villain — struck through on "not a villain" */}
      <ConceptObj at={villAt} out={ruleAt - 12} x={CX - 170} y={CY - 150} label="Nobody here is the villain">
        <div style={{ width: 300, height: 280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconVillainMustache size={260} crossed={villCrossed} />
        </div>
      </ConceptObj>

      {/* a rule from 1992 (seeds B04) */}
      <ConceptObj at={ruleAt} out={ballAt - 12} x={CX - 140} y={CY - 130} label="Just a rule from 1992">
        <svg width="300" height="240" viewBox="0 0 300 240" style={{ overflow: "visible" }}>
          <rect x="46" y="150" width="208" height="18" fill={tint(COLOR.grey, 0.4)} stroke={COLOR.ink} strokeWidth={4} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={64 + k * 46} y={86} width={16} height={64} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={3} />
          ))}
          <path d="M56 86 Q150 8 244 86 Z" fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={4} />
          <circle cx="150" cy="26" r="8" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={3} />
          <rect x="86" y="176" width="128" height="48" rx="7" fill={COLOR.ink} />
          <text x="150" y="209" textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={COLOR.cardWhite}>1992</text>
        </svg>
      </ConceptObj>

      {/* I watch football too */}
      <ConceptObj at={ballAt} out={1549} x={CX - 110} y={CY - 120} label="Same as you, probably">
        <div style={{ width: 260, height: 230, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconFootball size={190} />
        </div>
      </ConceptObj>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B03 — the real question: OTA is genuinely free; antenna → signal → TV;
// "how does channel four make anyone a dollar?"
// ═══════════════════════════════════════════════════════════════════════════
export const B03v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B03");
  return (
    <V4Beat props={props} beat="B03" audioDir="nif003" noTransition sfx={<BeatSfx beat="B03" />} bareRoom dots push={[1, 1.02]}>
      <B03Content vo={vo} />
    </V4Beat>
  );
};
const B03Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character. antenna → signal → TV, "free to receive", then the
  // episode's real question ($0 at the antenna, so where's the dollar?).
  const antAt = vo.at("over", 108);
  const tvAt = vo.at("television", 173);
  const freeAt = vo.at("free", 234);
  const priceAt = vo.at("antenna", 308, 1);
  const netAt = vo.at("abc", 460);
  const qAt = vo.at("so", 826);

  const antT = spring({ frame: frame - antAt, fps: 30, config: { damping: 13 }, durationInFrames: 28 });
  const tvT = spring({ frame: frame - tvAt, fps: 30, config: { damping: 13 }, durationInFrames: 28 });
  const dim = interpolate(frame, [qAt - 10, qAt + 24], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qT = spring({ frame: frame - qAt, fps: 30, config: { damping: 14 }, durationInFrames: 30 });

  const antX = 430, tvX = 1150, midY = 470;
  const wavePhase = (k: number) => (((frame - freeAt) / 70 - k / 3) % 1 + 1) % 1;

  return (
    <>
      <ChainStrip active={1} />
      {/* antenna, left — rises from the ground */}
      {antT > 0.01 && (
        <div style={{ position: "absolute", left: antX - 150, top: midY - 150 + (1 - antT) * 60, width: 300, textAlign: "center", opacity: Math.min(1, antT) * dim, filter: softShadow(0.9, 0.22) }}>
          <IconAntenna size={260} />
          <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: COLOR.ink }}>YOUR ANTENNA</div>
          {frame > priceAt && (
            <div style={{ marginTop: 8, display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", background: COLOR.ink, borderRadius: 10, padding: "4px 18px" }}>
              ${" "}20 · ONCE
            </div>
          )}
        </div>
      )}

      {/* TV, right */}
      {tvT > 0.01 && (
        <div style={{ position: "absolute", left: tvX - 190, top: midY - 170, width: 380, textAlign: "center", opacity: Math.min(1, tvT) * dim, filter: softShadow(0.9, 0.22) }}>
          <IconTVSet size={320} />
          <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: COLOR.ink }}>CHANNEL 4</div>
        </div>
      )}

      {/* signal waves antenna → TV, continuous */}
      {frame > freeAt && (
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: dim }}>
          {[0, 1, 2].map((k) => {
            const p = wavePhase(k);
            return <circle key={k} cx={antX + 60} cy={midY - 60} r={40 + p * 320} fill="none" stroke={COLOR.orange} strokeWidth={6} opacity={(1 - p) * 0.8} />;
          })}
        </svg>
      )}

      {/* FREE TO RECEIVE stamp */}
      {frame > freeAt + 10 && frame < qAt - 20 && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 760, textAlign: "center",
          opacity: interpolate(frame, [freeAt + 10, freeAt + 26, qAt - 40, qAt - 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <span style={{
            display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 74, letterSpacing: "0.02em",
            color: "#fff", background: COLOR.orange, border: `6px solid ${COLOR.ink}`, borderRadius: 16, padding: "10px 40px",
            transform: `rotate(-3deg) scale(${interpolate(frame, [freeAt + 10, freeAt + 22], [1.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          }}>FREE TO RECEIVE</span>
        </div>
      )}

      {/* network chips flying into the TV */}
      {["ABC", "CBS", "FOX"].map((n, i) => {
        const at = netAt + i * 14;
        const t = interpolate(frame, [at, at + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (t <= 0 || frame > qAt - 20) return null;
        const sx = 720 + i * 20, sy = 300;
        const x = sx + (tvX - 120 - sx) * t;
        const y = sy + (midY - 120 - sy) * t;
        return (
          <div key={n} style={{ position: "absolute", left: x, top: y, opacity: (1 - t) * dim + 0.0, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", background: COLOR.grey, border: `3px solid ${COLOR.ink}`, borderRadius: 10, padding: "6px 16px" }}>{n}</div>
        );
      })}

      {/* THE QUESTION — antenna ($0) → big ? → a dollar somewhere. Held the
          rest of the beat (L2 opens). The payoff: big, high-contrast, clean. */}
      {qT > 0.01 && (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, qT) }}>
          <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={470} y1={560} x2={800} y2={560} stroke={COLOR.ink} strokeWidth={7} strokeDasharray="3 16" strokeLinecap="round" />
            <line x1={1120} y1={560} x2={1450} y2={560} stroke={COLOR.ink} strokeWidth={7} strokeDasharray="3 16" strokeLinecap="round" />
            <path d="M 1400 546 l 34 14 l -34 14" fill="none" stroke={COLOR.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* left — antenna + $0 */}
          <div style={{ position: "absolute", left: 130, top: 340, width: 360, textAlign: "center" }}>
            <IconAntenna size={150} />
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 130, lineHeight: 1, color: COLOR.ink }}>$0</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.04em", color: COLOR.grey, textTransform: "uppercase" }}>at your antenna</div>
          </div>
          {/* centre — the ? */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
            <div style={{ display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 300, lineHeight: 1, color: COLOR.orange, transform: `scale(${1 + Math.sin(frame / 20) * 0.04})` }}>?</div>
          </div>
          {/* right — a dollar, somewhere */}
          <div style={{ position: "absolute", left: 1420, top: 360, width: 380, textAlign: "center" }}>
            <IconTVSet size={140} />
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 130, lineHeight: 1, color: COLOR.ink }}>$&nbsp;?</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.04em", color: COLOR.grey, textTransform: "uppercase" }}>made somewhere</div>
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B04 — the 1992 Cable Act: must-carry vs retransmission consent, the fork
// almost every station took.
// ═══════════════════════════════════════════════════════════════════════════
export const B04v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B04");
  return (
    <V4Beat props={props} beat="B04" audioDir="nif003" noTransition sfx={<BeatSfx beat="B04" />} bareRoom dots push={[1, 1.02]}>
      <B04Content vo={vo} />
    </V4Beat>
  );
};
const B04Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character. before/after 1992, then the Cable Act, then the fork:
  // MUST CARRY (no $) vs RETRANS CONSENT ($ + blackout). Path 2 glows.
  const beforeAt = vo.at("before", 131);
  const resoldAt = vo.at("resold", 331);
  const actAt = vo.at("cable", 623, 1);
  const forkAt = vo.at("two", 822);
  const p1At = vo.at("must", 884);
  const p2At = vo.at("2", 1101, 1);
  const almostAt = vo.at("almost", 1554);

  const s = (at: number, d = 26) => spring({ frame: frame - at, fps: 30, config: { damping: 14 }, durationInFrames: d });
  const beforeOut = interpolate(frame, [actAt - 30, actAt - 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2Glow = interpolate(frame, [almostAt - 6, almostAt + 20, 1679], [0, 1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const chipBox = (label: string, sub: string, bg: string): React.ReactNode => (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: bg === COLOR.ink ? "#fff" : COLOR.ink, background: bg, border: `4px solid ${COLOR.ink}`, borderRadius: 14, padding: "12px 26px", display: "inline-block" }}>{label}</div>
      <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 700, fontSize: 20, textTransform: "uppercase", letterSpacing: "0.06em", color: COLOR.grey }}>{sub}</div>
    </div>
  );

  return (
    <>
      {/* BEFORE 1992 — cable took the signal for free, broadcaster got $0 */}
      {frame < actAt && s(beforeAt) > 0.01 && (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, s(beforeAt)) * beforeOut }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: "0.08em", color: COLOR.grey }}>BEFORE 1992</div>
          <div style={{ position: "absolute", left: 260, top: 420, width: 300 }}>{chipBox("BROADCASTER", "makes the show", COLOR.cardWhite)}</div>
          <div style={{ position: "absolute", left: 1080, top: 420, width: 320 }}>{chipBox("CABLE CO.", "resold it for profit", COLOR.cardWhite)}</div>
          <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={600} y1={470} x2={1060} y2={470} stroke={COLOR.ink} strokeWidth={6} strokeLinecap="round" />
            <path d="M 1010 456 l 34 14 l -34 14" fill="none" stroke={COLOR.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <text x={830} y={444} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={COLOR.grey}>signal, for free</text>
            {frame > resoldAt && <text x={720} y={640} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={64} fill={COLOR.ink}>broadcaster got $0</text>}
          </svg>
        </div>
      )}

      {/* THE CABLE ACT 1992 — stamps down */}
      {frame >= actAt - 6 && frame < forkAt && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 380, textAlign: "center",
          opacity: interpolate(frame, [actAt - 6, actAt + 12, forkAt - 20, forkAt - 2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{
            display: "inline-block", background: COLOR.ink, color: "#fff", border: `6px solid ${COLOR.orange}`, borderRadius: 18, padding: "26px 56px",
            transform: `rotate(-2deg) scale(${interpolate(frame, [actAt - 6, actAt + 10], [1.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 88, lineHeight: 1 }}>THE CABLE ACT</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: COLOR.orange, marginTop: 6 }}>1992</div>
          </div>
        </div>
      )}

      {/* THE FORK — one station, two paths */}
      {frame >= forkAt - 4 && (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, s(forkAt)) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}>
            {chipBox("EACH STATION", "picks one, every 3 years", COLOR.cardWhite)}
          </div>
          <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d="M 960 220 C 960 330 520 320 520 430" fill="none" stroke={COLOR.ink} strokeWidth={6} strokeLinecap="round" />
            <path d="M 960 220 C 960 330 1400 320 1400 430" fill="none" stroke={p2Glow > 0.1 ? COLOR.orange : COLOR.ink} strokeWidth={p2Glow > 0.1 ? 10 : 6} strokeLinecap="round" />
          </svg>

          {/* path 1 — must carry */}
          {s(p1At) > 0.01 && (
            <div style={{ position: "absolute", left: 300, top: 470, width: 440, textAlign: "center", opacity: Math.min(1, s(p1At)) * (frame > almostAt ? 0.5 : 1), filter: softShadow(1, 0.2) }}>
              <div style={{ background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 18, padding: "22px 18px" }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink }}>MUST&nbsp;CARRY</div>
                <div style={{ marginTop: 12, display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", background: COLOR.grey, borderRadius: 999, padding: "4px 20px" }}>$0 — can't charge</div>
                <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 600, fontSize: 20, color: COLOR.grey }}>carried, but not a cent</div>
              </div>
            </div>
          )}

          {/* path 2 — retrans consent (glows) */}
          {s(p2At) > 0.01 && (
            <div style={{ position: "absolute", left: 1180, top: 450, width: 460, textAlign: "center", opacity: Math.min(1, s(p2At)), filter: `drop-shadow(0 0 ${28 * p2Glow}px rgba(226,77,40,${0.6 * p2Glow}))` }}>
              <div style={{ background: p2Glow > 0.3 ? tint(COLOR.orange, 0.3) : COLOR.cardWhite, border: `5px solid ${COLOR.orange}`, borderRadius: 18, padding: "22px 18px" }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: COLOR.ink }}>RETRANS&nbsp;CONSENT</div>
                <div style={{ marginTop: 12, display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", background: COLOR.orange, borderRadius: 999, padding: "4px 20px" }}>$ — charge anything</div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: SANS, fontWeight: 700, fontSize: 20, color: COLOR.ink }}>
                  <span style={{ display: "inline-block", width: 34, height: 26, background: COLOR.ink, borderRadius: 4 }} /> or go dark
                </div>
              </div>
            </div>
          )}

          {/* ALMOST EVERY STATION picked path 2 */}
          {frame > almostAt && (
            <div style={{
              position: "absolute", left: 1180, top: 830, width: 460, textAlign: "center",
              opacity: interpolate(frame, [almostAt, almostAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <span style={{ display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#fff", background: COLOR.ink, borderRadius: 12, padding: "8px 24px", transform: "rotate(-2deg)" }}>ALMOST EVERY STATION</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B05 — under $1B (2010) to $15B (2025): the industry-wide retrans fee
// explosion, plus the $4.83/mo +7% rate card.
// ═══════════════════════════════════════════════════════════════════════════
export const B05v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B05");
  return (
    <V4Beat props={props} beat="B05" audioDir="nif003" noTransition sfx={<BeatSfx beat="B05" />} bareRoom dots push={[1, 1.02]}>
      <B05Content vo={vo} />
    </V4Beat>
  );
};
const B05Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a bar chart. 2010 (<$1B) → 2025 ($15B+), hero number
  // counts up, then a per-subscriber rate card with a +7% badge.
  const y2010At = vo.at("2010", 107);
  const fifteenAt = vo.at("15", 441);
  const rateAt = vo.at("average", 989);
  const riseAt = vo.at("7", 1307);

  const bars = [
    { yr: "'10", v: 0.9, at: y2010At },
    { yr: "'13", v: 2.4, at: y2010At + 120 },
    { yr: "'16", v: 5.1, at: y2010At + 200 },
    { yr: "'19", v: 8.6, at: y2010At + 280 },
    { yr: "'22", v: 12.4, at: fifteenAt - 40 },
    { yr: "'25", v: 15.3, at: fifteenAt },
  ];
  const maxV = 16;
  const baseY = 900;
  const chartH = 470;
  const x0 = 150;
  const bw = 150;
  const gap = 34;

  const hero = interpolate(frame, [fifteenAt - 6, fifteenAt + 60], [0.9, 15.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rateT = spring({ frame: frame - rateAt, fps: 30, config: { damping: 14 }, durationInFrames: 26 });

  return (
    <>
      {/* axis */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={x0 - 30} y1={baseY} x2={x0 + bars.length * (bw + gap)} y2={baseY} stroke={COLOR.ink} strokeWidth={5} />
        {bars.map((b, i) => {
          const t = interpolate(frame, [b.at, b.at + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (t <= 0) return null;
          const h = (b.v / maxV) * chartH * t;
          const x = x0 + i * (bw + gap);
          const last = i === bars.length - 1;
          return (
            <g key={i}>
              <rect x={x} y={baseY - h} width={bw} height={h} fill={last ? COLOR.orange : tint(COLOR.grey, 0.35)} stroke={COLOR.ink} strokeWidth={4} />
              <text x={x + bw / 2} y={baseY + 44} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={COLOR.ink}>{b.yr}</text>
              {t > 0.9 && <text x={x + bw / 2} y={baseY - h - 18} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={last ? COLOR.orange : COLOR.grey}>${b.v}B</text>}
            </g>
          );
        })}
      </svg>

      {/* hero number — the $15B, huge, top-right, held. sits clear above the
          chart's right edge (chart now ends ~x1250). */}
      {frame > fifteenAt - 10 && (
        <div style={{
          position: "absolute", right: 90, top: 70, textAlign: "right",
          opacity: interpolate(frame, [fifteenAt - 10, fifteenAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: "0.1em", textTransform: "uppercase", color: COLOR.grey }}>Retrans fees, this year</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 150, lineHeight: 0.95, color: COLOR.orange }}>${hero.toFixed(1)}B</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: COLOR.ink }}>from under $1B in 2010</div>
        </div>
      )}

      {/* per-subscriber rate card, bottom-right */}
      {rateT > 0.01 && (
        <div style={{ position: "absolute", right: 110, top: 430, width: 520, opacity: Math.min(1, rateT), transform: `translateY(${(1 - rateT) * 24}px)`, filter: softShadow(1.1, 0.2) }}>
          <div style={{ background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 18, padding: "24px 28px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.08em", textTransform: "uppercase", color: COLOR.grey }}>Cable pays, per subscriber</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 88, lineHeight: 1, color: COLOR.ink, marginTop: 4 }}>$4.83<span style={{ fontSize: 30, color: COLOR.grey }}> /mo</span></div>
            {frame > riseAt && (
              <div style={{ marginTop: 12, display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#fff", background: COLOR.orange, borderRadius: 999, padding: "4px 22px" }}>▲ +7% in one year</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B06 — the line on your bill you never named: the broadcast TV fee builds
// like a real receipt, spikes to $48 in some Comcast markets.
// ═══════════════════════════════════════════════════════════════════════════
export const B06v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B06");
  return (
    <V4Beat props={props} beat="B06" audioDir="nif003" noTransition sfx={<BeatSfx beat="B06" />} bareRoom dots push={[1, 1.02]}>
      <B06Content vo={vo} />
    </V4Beat>
  );
};
const B06Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a cable bill card, centre, builds line by line. The
  // BROADCAST TV FEE row is the payoff; $48 Comcast flash; equipment row.
  const feeAt = vo.at("broadcast", 263);
  const comcastAt = vo.at("48", 597);
  const notTaxAt = vo.at("tax", 750);
  const equipAt = vo.at("equipment", 1373);

  const s = (at: number, d = 22) => spring({ frame: frame - at, fps: 30, config: { damping: 15 }, durationInFrames: d });
  const feeVal = frame < comcastAt ? "$10–$30" : frame < comcastAt + 60 ? "$48" : "$10–$48";
  const comcastFlash = frame > comcastAt && frame < comcastAt + 60;
  const total = 79.99 + (frame > feeAt ? (frame < comcastAt ? 22 : 48) : 0) + (frame > equipAt ? 14 : 0);

  const Row: React.FC<{ label: string; val: string; at: number; accent?: boolean; big?: boolean; tag?: string }> = ({ label, val, at, accent, big, tag }) => {
    const t = s(at);
    if (t <= 0.01) return null;
    return (
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: big ? "20px 30px" : "14px 30px", borderTop: `2px solid ${tint(COLOR.grey, 0.5)}`,
        background: accent ? tint(COLOR.orange, comcastFlash ? 0.15 : 0.4) : "transparent",
        opacity: Math.min(1, t), transform: `translateX(${(1 - t) * -16}px)`,
      }}>
        <div style={{ fontFamily: SANS, fontWeight: accent ? 800 : 600, fontSize: big ? 34 : 26, color: COLOR.ink }}>
          {label}
          {tag && <span style={{ marginLeft: 12, fontFamily: SANS, fontWeight: 800, fontSize: 18, color: "#fff", background: COLOR.ink, borderRadius: 6, padding: "2px 10px" }}>{tag}</span>}
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: big ? 44 : 30, color: accent ? COLOR.orange : COLOR.ink }}>{val}</div>
      </div>
    );
  };

  return (
    <>
      <div style={{ position: "absolute", left: 460, top: 90, width: 1000, filter: softShadow(1.3, 0.22) }}>
        <div style={{ background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ background: COLOR.ink, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.1em", padding: "18px 30px" }}>YOUR MONTHLY CABLE BILL</div>
          <Row label="TV Package" val="$79.99" at={40} />
          <Row label="BROADCAST TV FEE" val={feeVal} at={feeAt} accent big tag={comcastFlash ? "COMCAST MARKETS" : undefined} />
          {frame > notTaxAt && (
            <div style={{ padding: "10px 30px", opacity: interpolate(frame, [notTaxAt, notTaxAt + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, color: "#fff", background: COLOR.orange, borderRadius: 8, padding: "4px 16px" }}>NOT A TAX · NOT OPTIONAL</span>
              <span style={{ marginLeft: 14, fontFamily: SANS, fontWeight: 600, fontSize: 20, color: COLOR.grey }}>your station's charge, passed straight through</span>
            </div>
          )}
          <Row label="Equipment rental" val="$12–$15" at={equipAt} tag="PER BOX" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 30px", borderTop: `4px solid ${COLOR.ink}`, background: tint(COLOR.grey, 0.6) }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: COLOR.ink }}>WHAT YOU ACTUALLY PAY</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, color: COLOR.orange }}>${total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* the "store price" vs actual, lower-left — the advertised number is smaller */}
      {frame > vo.at("advertised", 1166) && (
        <div style={{
          position: "absolute", left: 200, top: 780, textAlign: "center",
          opacity: interpolate(frame, [vo.at("advertised", 1166), vo.at("advertised", 1166) + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.06em", color: COLOR.grey }}>Advertised in the store</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, color: COLOR.grey, textDecoration: "line-through" }}>$79.99</div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B07 — the weapon: retrans consent's leverage. A real cut-to-black, not a
// graphic standing in for one.
// ═══════════════════════════════════════════════════════════════════════════
export const B07v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B07");
  return (
    <V4Beat props={props} beat="B07" audioDir="nif003" noTransition sfx={<BeatSfx beat="B07" />} bareRoom dots push={[1, 1.02]}>
      <B07Content vo={vo} />
    </V4Beat>
  );
};
const B07Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character. a big TV; the station holds a switch; on "go dark" the
  // screen cuts hard to black and holds; "NEGOTIATING TACTIC" stamps.
  const darkAt = vo.at("dark", 382);
  const tacticAt = vo.at("negotiation", 984);

  const tvW = 820, tvX = 960, tvY = 300;
  const screenOn = frame < darkAt;
  const bandX = ((frame * 3) % (tvW - 80));
  const switchThrow = interpolate(frame, [darkAt - 14, darkAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const partyCard = (label: string, sub: string, Icon: React.FC<{ size?: number }>): React.ReactNode => (
    <div style={{ width: 300, textAlign: "center", filter: softShadow(1, 0.2) }}>
      <div style={{ background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 16, padding: "22px 10px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Icon size={110} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: COLOR.ink }}>{label}</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 19, letterSpacing: "0.04em", textTransform: "uppercase", color: COLOR.grey }}>{sub}</div>
      </div>
    </div>
  );

  return (
    <>
      <ChainStrip active={1} />
      {/* cable co, left — "won't pay" */}
      <div style={{ position: "absolute", left: 90, top: 380 }}>{partyCard("CABLE CO.", "won't pay the ask", IconTVSet)}</div>

      {/* the station, right — "throws the switch" */}
      <div style={{ position: "absolute", right: 90, top: 340 }}>
        {partyCard("THE STATION", "sets the price", IconStationBuilding)}
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 150, height: 96, background: COLOR.ink, borderRadius: 14, position: "relative" }}>
            <div style={{ position: "absolute", left: 51, top: switchThrow > 0.5 ? 44 : 8, width: 48, height: 48, borderRadius: "50%", background: COLOR.orange, border: `5px solid ${COLOR.cardWhite}` }} />
          </div>
          <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 800, fontSize: 26, color: switchThrow > 0.5 ? COLOR.orange : COLOR.grey }}>{switchThrow > 0.5 ? "SWITCHED OFF" : "ON"}</div>
        </div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* the TV */}
        <g style={{ filter: softShadow(1.2, 0.24) }}>
          <rect x={tvX - tvW / 2} y={tvY} width={tvW} height={tvW * 0.6} rx={26} fill={shade(SUPPORT.clay, 0.08)} stroke={COLOR.ink} strokeWidth={7} />
          <rect x={tvX - tvW / 2 + 30} y={tvY + 30} width={tvW - 60} height={tvW * 0.6 - 60} rx={10} fill={COLOR.ink} />
          {screenOn ? (
            <g clipPath="url(#b07s)">
              <defs><clipPath id="b07s"><rect x={tvX - tvW / 2 + 40} y={tvY + 40} width={tvW - 80} height={tvW * 0.6 - 80} rx={6} /></clipPath></defs>
              <rect x={tvX - tvW / 2 + 40} y={tvY + 40} width={tvW - 80} height={tvW * 0.6 - 80} fill={tint(SUPPORT.sky, 0.2)} />
              <rect x={tvX - tvW / 2 + 40 + bandX} y={tvY + 40} width={160} height={tvW * 0.6 - 80} fill={tint(SUPPORT.mustard, 0.2)} opacity={0.5} />
              <rect x={tvX - tvW / 2 + 40} y={tvY + tvW * 0.6 - 160} width={tvW - 80} height={70} fill={shade(SUPPORT.sky, 0.1)} opacity={0.6} />
            </g>
          ) : (
            <>
              <rect x={tvX - tvW / 2 + 40} y={tvY + 40} width={tvW - 80} height={tvW * 0.6 - 80} rx={6} fill="#000000" />
              {frame > darkAt + 14 && (
                <text x={tvX} y={tvY + tvW * 0.3 + 14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={46} letterSpacing="6" fill="#8a8a8a" opacity={0.55 + 0.45 * Math.sin(frame / 12)}>NO SIGNAL</text>
              )}
            </>
          )}
          <rect x={tvX - 90} y={tvY + tvW * 0.6} width={180} height={26} rx={6} fill={COLOR.ink} />
        </g>
      </svg>

      {/* NEGOTIATING TACTIC stamp over the black screen */}
      {frame > tacticAt - 6 && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: tvY + 200, textAlign: "center",
          opacity: interpolate(frame, [tacticAt - 6, tacticAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <span style={{
            display: "inline-block", fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontWeight: 700, fontSize: 58, letterSpacing: "0.06em",
            color: "#fff", background: COLOR.ink, border: `5px solid ${COLOR.orange}`, borderRadius: 12, padding: "14px 40px",
            transform: `rotate(-3deg) scale(${interpolate(frame, [tacticAt - 6, tacticAt + 8], [1.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          }}>"NEGOTIATING TACTIC"</span>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B08 — case 1 of 3: Disney vs Charter, September 2023. 12 days, 15M
// households, ends hours before the exact channel it darkened relights.
// ═══════════════════════════════════════════════════════════════════════════
export const B08v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B08");
  return (
    <V4Beat props={props} beat="B08" audioDir="nif003" noTransition sfx={<BeatSfx beat="B08" />} bareRoom dots push={[1, 1.02]}>
      <B08Content vo={vo} />
    </V4Beat>
  );
};
const B08Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character (faceless household grid). SEP 2023 · DISNEY vs CHARTER ·
  // channels go dark · 15M households · 12-day tally · MNF lights back up.
  const sepAt = vo.at("se", 124);
  const faceAt = vo.at("charter", 204);
  const pulledAt = vo.at("pulled", 333);
  const householdsAt = vo.at("15", 470);
  const daysAt = vo.at("12", 796);
  const mnfAt = vo.at("m", 878);

  const s = (at: number, d = 24) => spring({ frame: frame - at, fps: 30, config: { damping: 14 }, durationInFrames: d });
  const chans = ["ABC", "ESPN", "FX", "+10"];
  const households = interpolate(frame, [householdsAt - 4, householdsAt + 50], [0, 15_000_000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dayN = Math.round(interpolate(frame, [daysAt - 4, daysAt + 40], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const mnfLit = frame > mnfAt + 10;

  return (
    <>
      {/* calendar, top-centre */}
      {s(sepAt) > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", opacity: Math.min(1, s(sepAt)), transform: `scale(${0.8 + Math.min(1, s(sepAt)) * 0.2})` }}>
          <div style={{ display: "inline-block", background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 14, overflow: "hidden", filter: softShadow(1, 0.2) }}>
            <div style={{ background: COLOR.orange, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 34, padding: "8px 40px", letterSpacing: "0.1em" }}>SEP 2023</div>
            <div style={{ padding: "10px 40px", fontFamily: SANS, fontWeight: 700, fontSize: 22, color: COLOR.grey }}>the first real one</div>
          </div>
        </div>
      )}

      {/* DISNEY vs CHARTER face-off */}
      {s(faceAt) > 0.01 && (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, s(faceAt)) }}>
          <div style={{ position: "absolute", left: 150, top: 330, width: 420, textAlign: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: "#fff", background: COLOR.ink, border: `5px solid ${COLOR.ink}`, borderRadius: 16, padding: "18px 10px" }}>DISNEY</div>
          </div>
          <div style={{ position: "absolute", right: 150, top: 330, width: 420, textAlign: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: COLOR.ink, background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 16, padding: "18px 10px" }}>CHARTER</div>
          </div>
          <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d={`M 920 300 l 40 60 l -30 30 l 50 70 l -40 -30 l 30 -40 l -50 -60 z`} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />
            <text x={960} y={280} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={COLOR.grey}>couldn't agree on a price</text>
          </svg>
        </div>
      )}

      {/* channel chips going dark, centre row */}
      {frame > pulledAt - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 22 }}>
          {chans.map((c, i) => {
            const at = pulledAt + i * 16;
            const dark = interpolate(frame, [at, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const relit = c === "ESPN" && mnfLit;
            return (
              <div key={c} style={{
                fontFamily: SANS, fontWeight: 800, fontSize: 34, borderRadius: 12, padding: "12px 26px", border: `4px solid ${COLOR.ink}`,
                background: relit ? COLOR.orange : dark > 0.5 ? COLOR.ink : COLOR.cardWhite,
                color: relit ? "#fff" : dark > 0.5 ? "#555" : COLOR.ink,
              }}>{c}</div>
            );
          })}
        </div>
      )}

      {/* 15,000,000 households — huge, held */}
      {frame > householdsAt - 8 && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 700, textAlign: "center",
          opacity: interpolate(frame, [householdsAt - 8, householdsAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 128, lineHeight: 1, color: COLOR.orange }}>{Math.round(households).toLocaleString()}</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: "0.1em", textTransform: "uppercase", color: COLOR.ink }}>Spectrum households · no vote</div>
        </div>
      )}

      {/* 12-day tally, top-right */}
      {frame > daysAt - 8 && (
        <div style={{
          position: "absolute", right: 120, top: 90, textAlign: "center",
          opacity: interpolate(frame, [daysAt - 8, daysAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 160, lineHeight: 1, color: COLOR.ink }}>{dayN}</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.orange }}>DAYS DARK</div>
        </div>
      )}

      {/* MNF lit back up, bottom-right */}
      {mnfLit && (
        <div style={{
          position: "absolute", right: 130, bottom: 70,
          opacity: interpolate(frame, [mnfAt + 10, mnfAt + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#fff", background: COLOR.orange, border: `4px solid ${COLOR.ink}`, borderRadius: 12, padding: "12px 26px", filter: `drop-shadow(0 0 20px rgba(226,77,40,0.7))` }}>
            ▶ ENDED hours before Monday Night Football
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B09 — case 2 of 3: Disney vs DirecTV, September 2024. Satellite this time.
// 13 days, 11M+ subscribers, an anticlimactic $20 credit.
// ═══════════════════════════════════════════════════════════════════════════
export const B09v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B09");
  return (
    <V4Beat props={props} beat="B09" audioDir="nif003" noTransition sfx={<BeatSfx beat="B09" />} bareRoom dots push={[1, 1.02]}>
      <B09Content vo={vo} />
    </V4Beat>
  );
};
const B09Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // case 2 of 3 — same chip grammar as B08, satellite this time. The payoff
  // is anticlimactic: a $20 credit for 3 weeks they were already paying for.
  const sepAt = vo.at("september", 137);
  // (blackout timing handled by event chips)
  const eventsAt = vo.at("us", 570);
  const daysAt = vo.at("13", 901);
  const creditAt = vo.at("20", 1082);

  const events = ["US OPEN", "COLLEGE FOOTBALL", "MONDAY NIGHT FOOTBALL"];
  const dayN = Math.round(interpolate(frame, [daysAt - 4, daysAt + 40], [0, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <>
      <Stamp at={sepAt} x="c" y={70} text="SEP 2024" kind="orange" size={40} rot={-2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", opacity: interpolate(frame, [sepAt + 10, sepAt + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <IconSatelliteDish size={130} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: COLOR.grey, letterSpacing: "0.06em" }}>SATELLITE · A DIFFERENT PIPE</div>
      </div>

      <Chip label="DISNEY" at={vo.at("disney", 223)} x={370} y={420} w={420} solid big />
      <Chip label="DIRECTV" at={vo.at("dire", 256)} x={1550} y={420} w={420} big />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {frame > vo.at("missed", 283) && <path d={`M 936 430 l 40 50 l -30 22 l 44 56 l -40 -26 l 30 -30 l -44 -50 z`} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />}
      </svg>

      {/* 11M subscribers */}
      {frame > vo.at("11", 407) && (
        <HeroNum at={vo.at("11", 407)} value="11,000,000+" label="DirecTV subscribers, dark" align="center" y={630} size={120} />
      )}

      {/* three event chips stamp in then grey out on the blackout */}
      {events.map((e, i) => {
        const at = eventsAt + i * 18;
        const gone = interpolate(frame, [at + 40, at + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <Chip key={e} label={e} at={at} x={480 + i * 480} y={800} w={440} dark={gone > 0.5} />;
      })}

      {frame > daysAt - 8 && (
        <div style={{ position: "absolute", right: 120, top: 90, textAlign: "center", opacity: interpolate(frame, [daysAt - 8, daysAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 160, lineHeight: 1, color: COLOR.ink }}>{dayN}</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.orange }}>DAYS DARK</div>
        </div>
      )}

      {/* the deliberately unimpressive $20 credit */}
      {frame > creditAt && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center",
          opacity: interpolate(frame, [creditAt, creditAt + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ display: "inline-block", background: COLOR.cardWhite, border: `4px solid ${COLOR.grey}`, borderRadius: 12, padding: "12px 30px" }}>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.grey }}>$20 credit</span>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: COLOR.grey, marginLeft: 16 }}>for 3 weeks of channels they already paid for</span>
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B10 — case 3 of 3: Disney vs YouTube TV, October 2025. Streaming this
// time — the pattern named explicitly, all three calendars line up.
// ═══════════════════════════════════════════════════════════════════════════
export const B10v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B10");
  return (
    <V4Beat props={props} beat="B10" audioDir="nif003" noTransition sfx={<BeatSfx beat="B10" />} bareRoom dots push={[1, 1.02]}>
      <B10Content vo={vo} />
    </V4Beat>
  );
};
const B10Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // case 3 of 3 — streaming. $4.3M/day counter during the hold. Then the
  // payoff: all three calendars (2023/2024/2025) line up = a schedule.
  const octAt = vo.at("october", 131);
  const chansAt = vo.at("channels", 387);
  const lossAt = vo.at("4", 723);
  const patternAt = vo.at("cable", 1058, 1);
  const scheduleAt = vo.at("schedule", 1649);

  const loss = interpolate(frame, [lossAt - 4, lossAt + 50], [0, 4_300_000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const reveal = interpolate(frame, [patternAt - 10, patternAt + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cals = [
    { m: "SEP 2023", tech: "CABLE", Icon: IconTVSet },
    { m: "SEP 2024", tech: "SATELLITE", Icon: IconSatelliteDish },
    { m: "OCT 2025", tech: "STREAMING", Icon: IconStreamPlay },
  ];

  return (
    <>
      <ChainStrip active={2} />
      {reveal < 0.5 ? (
        <>
          <Stamp at={octAt} x="c" y={80} text="OCT 2025" kind="orange" size={40} rot={-2} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", opacity: interpolate(frame, [octAt + 10, octAt + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <IconStreamPlay size={130} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: COLOR.grey, letterSpacing: "0.06em" }}>STREAMING · A THIRD PIPE</div>
          </div>
          <Chip label="DISNEY" at={vo.at("disney", 203)} x={380} y={410} w={420} solid big />
          <Chip label="YOUTUBE TV" at={vo.at("youtube", 230)} x={1520} y={410} w={480} big />

          {/* ~20 channel chips going dark in a grid */}
          {Array.from({ length: 20 }).map((_, i) => {
            const at = chansAt + i * 4;
            const col = i % 10, row = Math.floor(i / 10);
            const d = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            if (d <= 0) return null;
            return <div key={i} style={{ position: "absolute", left: 300 + col * 132, top: 620 + row * 90, width: 116, height: 70, borderRadius: 10, border: `3px solid ${COLOR.ink}`, background: d > 0.5 ? COLOR.ink : COLOR.cardWhite, opacity: d, fontFamily: SANS, fontWeight: 800, fontSize: i < 2 ? 22 : 0, color: "#555", display: "flex", alignItems: "center", justifyContent: "center" }}>{i === 0 ? "ABC" : i === 1 ? "ESPN" : ""}</div>;
          })}

          {frame > lossAt && (
            <HeroNum at={lossAt} value={`$${(loss / 1e6).toFixed(1)}M`} label="Disney's ad loss · per day · own channels dark" align="right" y={90} size={150} />
          )}
        </>
      ) : (
        /* THE PATTERN — three calendars in a row */
        <div style={{ position: "absolute", inset: 0, opacity: reveal }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: "0.06em", color: COLOR.ink }}>THREE FIGHTS · THREE PIPES · THREE YEARS IN A ROW</div>
          {cals.map((c, i) => (
            <div key={i} style={{ position: "absolute", left: 200 + i * 560, top: 320, width: 480, textAlign: "center", transform: `translateY(${(1 - interpolate(frame, [patternAt + i * 10, patternAt + i * 10 + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) * 40}px)` }}>
              <div style={{ background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 16, overflow: "hidden", filter: softShadow(1, 0.2) }}>
                <div style={{ background: COLOR.orange, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 40, padding: "14px 0" }}>{c.m}</div>
                <div style={{ padding: "26px 0 20px" }}><c.Icon size={110} /></div>
              </div>
              <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.06em", color: COLOR.ink }}>{c.tech}</div>
            </div>
          ))}
          {frame > scheduleAt && (
            <Stamp at={scheduleAt} x="c" y={780} text="A STRATEGY DISNEY RUNS ON A SCHEDULE" kind="ink" size={40} rot={-2} />
          )}
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B11 — switching pipes doesn't exit the chain: a streaming app UI, the same
// fee shape, relabeled; Fubo's RSN fee shows it openly.
// ═══════════════════════════════════════════════════════════════════════════
export const B11v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B11");
  return (
    <V4Beat props={props} beat="B11" audioDir="nif003" noTransition sfx={<BeatSfx beat="B11" />} bareRoom dots push={[1, 1.02]}>
      <B11Content vo={vo} />
    </V4Beat>
  );
};
const B11Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — two price cards side by side. CANCEL CABLE (left, a
  // broadcast-fee line) → the same fee reappears in the STREAMING app
  // (right), relabeled "RSN FEE". You changed who mails the bill, not the bill.
  const appAt = vo.at("streaming", 235);
  const foldedAt = vo.at("folded", 650);
  const fuboAt = vo.at("f", 800);
  const closeAt = vo.at("mails", 1258);

  const cardCSS: React.CSSProperties = { background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 18, padding: "0", overflow: "hidden", filter: softShadow(1.1, 0.2) };
  const rowCSS: React.CSSProperties = { display: "flex", justifyContent: "space-between", padding: "16px 26px", fontFamily: SANS, fontWeight: 600, fontSize: 26, borderTop: `2px solid ${tint(COLOR.grey, 0.5)}` };

  return (
    <>
      {/* LEFT — the cable bill, crossed out */}
      <div style={{ position: "absolute", left: 120, top: 200, width: 720, ...cardCSS, opacity: interpolate(frame, [10, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ background: COLOR.ink, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 28, padding: "16px 26px" }}>CABLE — cancelled</div>
        <div style={rowCSS}><span>Package</span><span>$79.99</span></div>
        <div style={{ ...rowCSS, background: tint(COLOR.orange, 0.4), fontWeight: 800 }}><span>BROADCAST TV FEE</span><span style={{ color: COLOR.orange }}>$22</span></div>
        {frame > vo.at("count", 175) && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(240,240,235,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 60, color: COLOR.grey, transform: "rotate(-8deg)" }}>CANCELLED</div>
        )}
      </div>

      {/* arrow → */}
      {frame > appAt && (
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [appAt, appAt + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <line x1={870} y1={430} x2={1050} y2={430} stroke={COLOR.ink} strokeWidth={8} strokeLinecap="round" />
          <path d="M 1010 410 l 44 20 l -44 20" fill="none" stroke={COLOR.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          <text x={960} y={400} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill={COLOR.grey}>switch to streaming</text>
        </svg>
      )}

      {/* RIGHT — the streaming app, same fee, relabeled */}
      {frame > appAt && (
        <div style={{ position: "absolute", right: 120, top: 190, width: 720, ...cardCSS, opacity: interpolate(frame, [appAt, appAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ background: COLOR.orange, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 28, padding: "16px 26px" }}>STREAMING APP</div>
          <div style={rowCSS}><span>Base subscription</span><span>$82.99</span></div>
          {frame > foldedAt && <div style={{ ...rowCSS, fontStyle: "italic", color: COLOR.grey, fontSize: 22 }}><span>…retrans + sports, folded into the base price</span><span>▲</span></div>}
          {frame > fuboAt && (
            <div style={{ ...rowCSS, background: tint(COLOR.orange, 0.4), fontWeight: 800 }}><span>RSN FEE <span style={{ fontSize: 18, background: COLOR.ink, color: "#fff", borderRadius: 6, padding: "2px 8px" }}>FUBO SHOWS IT</span></span><span style={{ color: COLOR.orange }}>$3–$17</span></div>
          )}
        </div>
      )}

      {frame > closeAt && (
        <Stamp at={closeAt} x="c" y={800} text="YOU JUST CHANGED WHO MAILS YOU THE BILL" kind="ink" size={38} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B12 — mid-roll CTA: a brief, deliberate break from the visual system.
// ═══════════════════════════════════════════════════════════════════════════
export const B12v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B12");
  return (
    <V4Beat props={props} beat="B12" audioDir="nif003" noTransition sfx={<BeatSfx beat="B12" />} bareRoom push={[1, 1.01]}>
      <B12Content vo={vo} />
    </V4Beat>
  );
};
const B12Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // mid-roll — a plain SUBSCRIBE card, held. Deliberately a break in the
  // system. On "back to the chain" a chain-link motif slides in.
  const backAt = vo.at("back", 471);
  const t = spring({ frame: frame - 8, fps: 30, config: { damping: 15 }, durationInFrames: 24 });
  const back = interpolate(frame, [backAt - 6, backAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <div style={{
        position: "absolute", left: 0, right: 0, top: 300, textAlign: "center",
        opacity: Math.min(1, t) * (1 - back * 0.4), transform: `translateX(${-back * 120}px) scale(${0.9 + Math.min(1, t) * 0.1})`,
      }}>
        <div style={{ display: "inline-block", background: COLOR.cardWhite, border: `6px solid ${COLOR.ink}`, borderRadius: 24, padding: "50px 90px", filter: softShadow(1.4, 0.24) }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: "0.14em", color: COLOR.grey }}>NOTHING IS FREE</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 120, lineHeight: 1, color: COLOR.orange, margin: "10px 0" }}>SUBSCRIBE</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: COLOR.ink }}>we price the number on your bill, every episode</div>
        </div>
      </div>

      {/* the chain motif sliding back in */}
      {back > 0 && (
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: back, transform: `translateX(${(1 - back) * 300}px)` }}>
          {[0, 1, 2, 3].map((i) => (
            <ellipse key={i} cx={760 + i * 130} cy={540} rx={70} ry={44} fill="none" stroke={COLOR.orange} strokeWidth={12} />
          ))}
        </svg>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B13 — not comedy, not drama: sports takes 60-90% of every affiliate fee.
// ═══════════════════════════════════════════════════════════════════════════
export const B13v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B13");
  return (
    <V4Beat props={props} beat="B13" audioDir="nif003" noTransition sfx={<BeatSfx beat="B13" />} bareRoom dots push={[1, 1.02]}>
      <B13Content vo={vo} />
    </V4Beat>
  );
};
const B13Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a stacked bar of "everything cable pays broadcasters".
  // SPORTS fills 60–90%; comedy/drama/news stay thin and grey out on [dry].
  const sportsAt = vo.at("60", 571);
  const comedyAt = vo.at("comedy", 794);
  const dramaAt = vo.at("drama", 827);
  const newsAt = vo.at("news", 886);

  const sportsFill = interpolate(frame, [sportsAt - 4, sportsAt + 40], [0, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const segs = [
    { label: "SPORTS", frac: 0.75, color: COLOR.orange, at: sportsAt, grey: 99999 },
    { label: "COMEDY", frac: 0.09, color: tint(COLOR.grey, 0.2), at: 20, grey: comedyAt },
    { label: "DRAMA", frac: 0.09, color: tint(COLOR.grey, 0.3), at: 20, grey: dramaAt },
    { label: "LOCAL NEWS", frac: 0.07, color: tint(COLOR.grey, 0.4), at: 20, grey: newsAt },
  ];
  const barX = 260, barW = 1400, barY = 360, barH = 300;

  return (
    <>
      <ChainStrip active={0} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Every dollar cable pays broadcasters
      </div>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <rect x={barX} y={barY} width={barW} height={barH} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={5} />
        {(() => {
          let acc = 0;
          return segs.map((s, i) => {
            const w = (i === 0 ? sportsFill : s.frac) * barW;
            const x = barX + acc * barW;
            acc += i === 0 ? sportsFill : s.frac;
            const greyed = frame > s.grey;
            return (
              <g key={i} opacity={interpolate(frame, [s.at, s.at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                <rect x={x} y={barY} width={Math.max(0, w)} height={barH} fill={greyed ? tint(COLOR.grey, 0.6) : s.color} stroke={COLOR.ink} strokeWidth={4} />
                {w > 90 && <text x={x + w / 2} y={barY + barH / 2 + 12} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={i === 0 ? 44 : 22} fill={greyed ? COLOR.grey : i === 0 ? "#fff" : COLOR.ink}>{s.label}</text>}
                {i !== 0 && w <= 90 && <text x={x + w / 2} y={barY - 20} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} fill={greyed ? tint(COLOR.grey, 0.3) : COLOR.grey}>{s.label}</text>}
              </g>
            );
          });
        })()}
      </svg>
      {frame > sportsAt + 10 && (
        <HeroNum at={sportsAt + 10} value="60–90%" label="of it is live sports" align="center" y={720} size={150} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B14 — ESPN's rate: the highest carriage rate on the dial, ~7x FS1, billed
// whether you watch or not.
// ═══════════════════════════════════════════════════════════════════════════
export const B14v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B14");
  return (
    <V4Beat props={props} beat="B14" audioDir="nif003" noTransition sfx={<BeatSfx beat="B14" />} bareRoom dots push={[1, 1.02]}>
      <B14Content vo={vo} />
    </V4Beat>
  );
};
const B14Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — ESPN vs FS1 carriage rate. $9.50 counts up next to ESPN;
  // FS1 dwarfed at ~$1.35 with a "7×" marker. Billed whether watched or not.
  const espnAt = vo.at("espn", 125);
  const rateAt = vo.at("9", 286);
  const fs1At = vo.at("fs", 756);
  const billedAt = vo.at("billed", 889);

  const rate = interpolate(frame, [rateAt - 4, rateAt + 46], [0, 9.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barMax = 560;

  return (
    <>
      <ChainStrip active={0} />
      {/* ESPN */}
      <Chip label="ESPN" at={espnAt} x={520} y={180} w={360} solid big />
      {frame > rateAt - 6 && (
        <div style={{ position: "absolute", left: 340, top: 340, textAlign: "center", opacity: interpolate(frame, [rateAt - 6, rateAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 200, lineHeight: 1, color: COLOR.orange }}>${rate.toFixed(2)}</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: "0.06em", textTransform: "uppercase", color: COLOR.ink }}>per subscriber · every month</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: COLOR.grey }}>highest carriage rate of any channel in the US</div>
        </div>
      )}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {frame > rateAt && <rect x={360} y={640} width={interpolate(frame, [rateAt, rateAt + 30], [0, barMax], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} height={70} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />}
        {frame > fs1At && <rect x={1220} y={640} width={barMax / 7} height={70} fill={tint(COLOR.grey, 0.3)} stroke={COLOR.ink} strokeWidth={4} />}
      </svg>

      {/* FS1, dwarfed */}
      {frame > fs1At && (
        <>
          <Chip label="FS1" at={fs1At} x={1400} y={180} w={280} />
          <div style={{ position: "absolute", left: 1230, top: 380, opacity: interpolate(frame, [fs1At, fs1At + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, color: COLOR.grey }}>$1.35</div>
          </div>
          <Stamp at={fs1At + 20} x={1150} y={520} text="7× MORE" kind="orange" size={40} rot={-4} />
        </>
      )}

      {frame > billedAt && (
        <Stamp at={billedAt} x="c" y={840} text="BILLED WHETHER YOU WATCH A GAME OR NOT" kind="ink" size={38} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B15 — $7.5B a year, before one ad runs: ESPN's annual subscriber-fee total.
// ═══════════════════════════════════════════════════════════════════════════
export const B15v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B15");
  return (
    <V4Beat props={props} beat="B15" audioDir="nif003" noTransition sfx={<BeatSfx beat="B15" />} bareRoom dots push={[1, 1.02]}>
      <B15Content vo={vo} />
    </V4Beat>
  );
};
const B15Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — $9.50 × everyone = $7.5B/YEAR hero. A grey unlit row of
  // ticket / jersey / bar-tab icons beside it: all the money NOT counted yet.
  const totalAt = vo.at("7", 247);
  const beforeAt = vo.at("before", 446);
  // "on the dial" beat has no distinct visual gate

  const total = interpolate(frame, [totalAt - 4, totalAt + 55], [0, 7.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const notYet = [
    { Icon: IconRatingStar, label: "one ad" },
    { Icon: IconJersey, label: "one jersey" },
    { Icon: IconSports, label: "one ticket" },
  ];

  return (
    <>
      <ChainStrip active={0} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: "0.06em", textTransform: "uppercase", color: COLOR.grey, opacity: interpolate(frame, [6, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        ESPN's main network · subscriber fees alone
      </div>

      {frame > totalAt - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", opacity: interpolate(frame, [totalAt - 8, totalAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 300, lineHeight: 0.9, color: COLOR.orange }}>${total.toFixed(1)}B</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: COLOR.ink }}>A YEAR · just for being on the dial</div>
        </div>
      )}
      {frame > totalAt + 20 && <Bloom window={[totalAt + 20, totalAt + 32, totalAt + 90, totalAt + 120]} radius={420} x="50%" y="42%" intensity={0.4} />}

      {/* the grey "not counted yet" row */}
      {frame > beforeAt && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", gap: 90, opacity: interpolate(frame, [beforeAt, beforeAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {notYet.map((n, i) => (
            <div key={i} style={{ textAlign: "center", filter: "grayscale(1)", opacity: 0.4 }}>
              <n.Icon size={90} />
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: COLOR.grey }}>before {n.label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B16 — no opt-out: bundling means no à la carte; unbundled sports costs
// more alone.
// ═══════════════════════════════════════════════════════════════════════════
export const B16v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B16");
  return (
    <V4Beat props={props} beat="B16" audioDir="nif003" noTransition sfx={<BeatSfx beat="B16" />} bareRoom dots push={[1, 1.02]}>
      <B16Content vo={vo} />
    </V4Beat>
  );
};
const B16Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a package checklist. The cursor tries to uncheck SPORTS
  // TIER; it's disabled. A ghost à-la-carte price appears, then bursts,
  // replaced by a bigger bundle price. The fee is baked in on purpose.
  const tryAt = vo.at("uncheck", 200);
  const alacarteAt = vo.at("pull", 465);
  const bakedAt = vo.at("baked", 776);

  const rows = [
    { label: "Local Channels", locked: false },
    { label: "Movies & Shows", locked: false },
    { label: "Sports Tier", locked: true },
  ];
  const cursorX = interpolate(frame, [tryAt - 20, tryAt], [900, 690], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = frame > tryAt && frame < tryAt + 30 ? Math.sin(frame * 1.4) * 5 : 0;
  const alacarteBurst = interpolate(frame, [alacarteAt + 40, alacarteAt + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <ChainStrip active={3} />
      <div style={{ position: "absolute", left: 300, top: 200, width: 900, filter: softShadow(1.2, 0.22), opacity: interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ background: COLOR.ink, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 28, padding: "16px 28px" }}>BUILD YOUR PACKAGE</div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 28px", borderTop: `2px solid ${tint(COLOR.grey, 0.5)}`, background: r.locked ? tint(COLOR.grey, 0.7) : "transparent", transform: r.locked ? `translateX(${shake}px)` : undefined }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, border: `4px solid ${COLOR.ink}`, background: r.locked ? tint(COLOR.grey, 0.3) : COLOR.orange, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff" }}>{r.locked ? "🔒" : "✓"}</div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: r.locked ? COLOR.grey : COLOR.ink }}>{r.label}</div>
              {r.locked && frame > tryAt + 6 && <div style={{ marginLeft: "auto", fontFamily: SANS, fontWeight: 800, fontSize: 20, color: "#fff", background: COLOR.ink, borderRadius: 8, padding: "4px 14px" }}>CAN'T REMOVE</div>}
            </div>
          ))}
        </div>
      </div>

      {/* cursor */}
      {frame > tryAt - 24 && frame < alacarteAt && (
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={`M ${cursorX} 620 l 0 34 l 9 -8 l 7 15 l 7 -3 l -7 -15 l 12 0 z`} fill={COLOR.ink} stroke="#fff" strokeWidth={2} />
        </svg>
      )}

      {/* the à-la-carte bubble that bursts, then the bigger bundle price */}
      {frame > alacarteAt && frame < bakedAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", opacity: 1 - alacarteBurst }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: COLOR.grey }}>sports alone: $30+</span>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: COLOR.grey }}>more than the whole bundle used to cost</div>
        </div>
      )}
      {frame > bakedAt && (
        <Stamp at={bakedAt} x="c" y={740} text="THE FEE IS BAKED IN ON PURPOSE" kind="orange" size={46} rot={-2} />
      )}
      {frame > bakedAt + 40 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 850, textAlign: "center", opacity: interpolate(frame, [bakedAt + 40, bakedAt + 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontFamily: SANS, fontWeight: 700, fontSize: 30, color: COLOR.ink }}>
          A household that never turns on a game still funds it — every month.
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B17 — the fee that broke its own network: Diamond Sports / Bally Sports,
// $9.6B bought on debt, collapses under $8.67B.
// ═══════════════════════════════════════════════════════════════════════════
export const B17v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B17");
  return (
    <V4Beat props={props} beat="B17" audioDir="nif003" noTransition sfx={<BeatSfx beat="B17" />} bareRoom dots push={[1, 1.03]}>
      <B17Content vo={vo} />
    </V4Beat>
  );
};
const B17Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a tower of team logos labelled BALLY SPORTS, bought for
  // $9.6B on debt, then it collapses when cord-cutting wins.
  const boughtAt = vo.at("9", 870);
  const wonAt = vo.at("won", 1350);
  const debtAt = vo.at("8", 1570);
  const outrunAt = vo.at("out", 1763);

  const collapse = interpolate(frame, [wonAt + 10, wonAt + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wob = collapse < 1 ? Math.sin(frame / (12 - collapse * 8)) * (2 + collapse * 20) : 0;
  const blocks = 9;

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Sports fees can break the company charging them
      </div>

      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`translate(700 ${940 - blocks * 82}) rotate(${wob} 0 ${blocks * 82})`} style={{ opacity: 1 - collapse * 0.1 }}>
          {Array.from({ length: blocks }).map((_, i) => {
            const at = 40 + i * 20;
            const t = interpolate(frame, [at, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const fall = collapse > 0 ? interpolate(collapse, [(i / blocks) * 0.5, (i / blocks) * 0.5 + 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
            return (
              <g key={i} transform={`translate(${fall * (i % 2 ? 520 : -480)} ${(1 - t) * -30 + fall * (260 + i * 44)}) rotate(${fall * (i % 2 ? 78 : -66)})`} opacity={t}>
                <rect x={-210} y={i * 82} width={420} height={72} rx={10} fill={tint(SUPPORT.teal, 0.05 + i * 0.05)} stroke={COLOR.ink} strokeWidth={5} />
                <text x={0} y={i * 82 + 48} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill="#fff">team #{i * 5 + 3}</text>
              </g>
            );
          })}
          <rect x={-250} y={blocks * 82 + 10} width={500} height={86} rx={12} fill={COLOR.ink} />
          <text x={0} y={blocks * 82 + 64} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill="#fff">BALLY SPORTS RSNs</text>
        </g>
      </svg>

      {frame > boughtAt && <HeroNum at={boughtAt} value="$9.6B" label="bought 2021 · mostly borrowed" align="right" y={220} size={130} />}
      {frame > debtAt && <HeroNum at={debtAt} value="$8.7B" label="in debt · collapsed 2023" align="right" y={470} size={130} />}
      {frame > vo.at("140", 1426) && frame < debtAt && (
        <Stamp at={vo.at("140", 1426)} x={1180} y={640} text="missed a $140M payment" kind="ink" size={34} rot={-3} />
      )}
      {frame > outrunAt && (
        <Stamp at={outrunAt} x="c" y={880} text="THE MODEL OUTRAN ITS OWN AUDIENCE" kind="orange" size={40} rot={-2} />
      )}
    </>
  );
};

// ── a small "house" glyph + a shared field of them — B20/B21/B22's cord-
//    cutting motif, continuity across all three (beats.md: "keeps shrinking
//    behind it, low contrast — both motions visible in one frame"). ────────
// ═══════════════════════════════════════════════════════════════════════════
// B18 — counted a second time: a Nielsen sample household lights up; the
// formula that sets the advertiser's price.
// ═══════════════════════════════════════════════════════════════════════════
export const B18v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B18");
  return (
    <V4Beat props={props} beat="B18" audioDir="nif003" noTransition sfx={<BeatSfx beat="B18" />} bareRoom dots push={[1, 1.02]}>
      <B18Content vo={vo} />
    </V4Beat>
  );
};
const B18Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a grid of dim households; one lights (Nielsen's sample);
  // a pricing formula assembles: rate per 1,000 × rating = ad price.
  const nielsenAt = vo.at("nielsen", 142);
  const formulaAt = vo.at("price", 519);
  const biggerAt = vo.at("bigger", 695);

  const rows = 5, cols = 12;
  const lit = 17;
  return (
    <>
      <ChainStrip active={3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Nielsen estimates who's watching — every night
      </div>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const on = i === lit && frame > nielsenAt;
          const t = interpolate(frame, [30 + i * 2, 44 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g key={i} transform={`translate(${360 + c * 100} ${200 + r * 90})`} opacity={t}>
              <rect x={-28} y={-24} width={56} height={44} fill={on ? COLOR.orange : COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={on ? 4 : 2.5} opacity={on ? 1 : 0.4} />
              <path d="M -32 -24 l 32 -22 l 32 22" fill="none" stroke={COLOR.ink} strokeWidth={on ? 4 : 2.5} opacity={on ? 1 : 0.4} />
              {on && <text x={0} y={44} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={18} fill={COLOR.orange}>SAMPLE</text>}
            </g>
          );
        })}
      </svg>
      {frame > formulaAt && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 700, textAlign: "center",
          opacity: interpolate(frame, [formulaAt, formulaAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontFamily: SANS, fontWeight: 800, fontSize: 46, color: COLOR.ink,
        }}>
          <span style={{ background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 12, padding: "10px 22px" }}>$ per 1,000 viewers</span>
          <span style={{ margin: "0 20px", color: COLOR.grey }}>×</span>
          <span style={{ background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 12, padding: "10px 22px" }}>the rating</span>
          {frame > biggerAt && <><span style={{ margin: "0 20px", color: COLOR.grey }}>=</span><span style={{ color: "#fff", background: COLOR.orange, border: `4px solid ${COLOR.ink}`, borderRadius: 12, padding: "10px 22px" }}>the ad price</span></>}
        </div>
      )}
      {frame > biggerAt && (
        <Stamp at={biggerAt} x="c" y={840} text="SAME 30 SECONDS · HIGHER PRICE" kind="ink" size={34} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B19 — two invoices, same half hour: the subscriber bill mails home; the
// advertiser invoice — for you — never does.
// ═══════════════════════════════════════════════════════════════════════════
export const B19v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B19");
  return (
    <V4Beat props={props} beat="B19" audioDir="nif003" noTransition sfx={<BeatSfx beat="B19" />} bareRoom dots push={[1, 1.02]}>
      <B19Content vo={vo} />
    </V4Beat>
  );
};
const B19Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — two invoices for the same half hour. You see one.
  const inv1At = vo.at("bill", 156);
  const inv2At = vo.at("advertis", 488);
  const soldAt = vo.at("sold", 795);
  const seeAt = vo.at("only", 1115);

  const Invoice: React.FC<{ at: number; tag: string; who: string; line: string; amt: string; seen: boolean }> = ({ at, tag, who, line, amt, seen }) => {
    const t = spring({ frame: frame - at, fps: 30, config: { damping: 14 }, durationInFrames: 24 });
    if (t <= 0.01) return null;
    return (
      <div style={{ width: 640, opacity: Math.min(1, t), transform: `translateY(${(1 - t) * 24}px)`, filter: softShadow(1.2, 0.22) }}>
        <div style={{ background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: seen ? COLOR.orange : COLOR.ink, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 26, padding: "14px 24px", display: "flex", justifyContent: "space-between" }}>
            <span>{tag}</span><span style={{ fontSize: 18, opacity: 0.85 }}>{seen ? "YOU SEE THIS" : "YOU NEVER SEE THIS"}</span>
          </div>
          <div style={{ padding: "22px 24px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.ink }}>{who}</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: COLOR.grey, marginTop: 6 }}>{line}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: COLOR.orange, marginTop: 14 }}>{amt}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        One half hour of TV · two separate invoices
      </div>
      <div style={{ position: "absolute", left: 130, top: 240 }}>
        <Invoice at={inv1At} tag="INVOICE 1" who="You, the subscriber" line="your cable bill paid the channel to exist on your dial" amt="paid ✓" seen />
      </div>
      <div style={{ position: "absolute", right: 130, top: 240 }}>
        <Invoice at={inv2At} tag="INVOICE 2" who="You, the audience" line="an advertiser paid again — specifically for you watching" amt="paid ✓" seen={false} />
      </div>
      {frame > soldAt && (
        <Stamp at={soldAt} x="c" y={760} text="BILLED AS A SUBSCRIBER · SOLD AS AN AUDIENCE" kind="ink" size={38} rot={-2} />
      )}
      {frame > seeAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", opacity: interpolate(frame, [seeAt, seeAt + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontFamily: SANS, fontWeight: 800, fontSize: 34, color: COLOR.orange }}>
          You only ever see the first one.
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B20 — 77 million and counting: households peel off the field, accelerating,
// until fewer than half remain lit.
// ═══════════════════════════════════════════════════════════════════════════
export const B20v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B20");
  return (
    <V4Beat props={props} beat="B20" audioDir="nif003" noTransition sfx={<BeatSfx beat="B20" />} bareRoom dots push={[1, 1.03]}>
      <B20Content vo={vo} />
    </V4Beat>
  );
};
const B20Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a field of household icons; a big chunk peels off;
  // "77,000,000" hero; the "fewer than half" line crossed.
  const numAt = vo.at("77", 313);
  const halfAt = vo.at("fewer", 572);
  const rows = 6, cols = 16, total = rows * cols;
  const cut = Math.round(interpolate(frame, [numAt - 10, numAt + 50], [0, total * 0.52], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const num = Math.round(interpolate(frame, [numAt - 6, numAt + 45], [0, 77_000_000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {Array.from({ length: total }).map((_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const t = interpolate(frame, [10 + i, 22 + i], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const gone = i >= total - cut;
          const drop = gone ? interpolate(frame, [numAt + (total - i) * 1.5, numAt + (total - i) * 1.5 + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          return (
            <g key={i} transform={`translate(${360 + c * 78} ${240 + r * 82 + drop * 500})`} opacity={t * (1 - drop * 0.9)}>
              <rect x={-22} y={-18} width={44} height={34} fill={gone ? tint(COLOR.grey, 0.6) : COLOR.orange} stroke={COLOR.ink} strokeWidth={2.5} />
              <path d="M -26 -18 l 26 -18 l 26 18" fill="none" stroke={COLOR.ink} strokeWidth={2.5} />
            </g>
          );
        })}
        {/* the 50% line */}
        {frame > halfAt && (
          <>
            <line x1={340} y1={760} x2={1600} y2={760} stroke={COLOR.ink} strokeWidth={5} strokeDasharray="10 8" />
            <text x={1560} y={745} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={28} fill={COLOR.ink}>50% OF HOUSEHOLDS</text>
          </>
        )}
      </svg>
      {frame > numAt - 8 && (
        <HeroNum at={numAt} value={num.toLocaleString()} label="US households cut cable entirely" align="center" y={800} size={110} />
      )}
      {frame > halfAt && (
        <Stamp at={halfAt} x="c" y={110} text="FEWER THAN HALF STILL PAY FOR TV — A FIRST" kind="orange" size={38} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B21 — rates rose anyway: the paradox stated. The shrinking field from B20
// continues low-contrast behind the rate card ticking up.
// ═══════════════════════════════════════════════════════════════════════════
export const B21v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B21");
  return (
    <V4Beat props={props} beat="B21" audioDir="nif003" noTransition sfx={<BeatSfx beat="B21" />} bareRoom dots push={[1, 1.02]}>
      <B21Content vo={vo} />
    </V4Beat>
  );
};
const B21Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — you'd expect prices to drop. They rose. A shrinking
  // field of households, each carrying a bigger slice of the bill.
  const oppositeAt = vo.at("opposite", 139);
  const roseAt = vo.at("7", 311);
  const fewerAt = vo.at("few", 569);

  const expect = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flip = interpolate(frame, [oppositeAt, oppositeAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shrink = interpolate(frame, [fewerAt - 10, fewerAt + 50], [1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        You'd expect prices to drop. They rose.
      </div>
      <ChainStrip active={2} />

      {/* left: EXPECTED ▼ */}
      <div style={{ position: "absolute", left: 200, top: 260, width: 480, textAlign: "center", opacity: expect * (1 - flip * 0.55), filter: "grayscale(1)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: COLOR.grey }}>expected</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 200, lineHeight: 0.9, color: COLOR.grey }}>▼</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: COLOR.grey }}>prices drop</div>
      </div>
      {/* right: ▲ 7% */}
      {frame > roseAt - 14 && (
        <div style={{ position: "absolute", right: 180, top: 240, width: 560, textAlign: "center", opacity: interpolate(frame, [roseAt - 14, roseAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: COLOR.orange }}>what happened</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 180, lineHeight: 0.9, color: COLOR.orange }}>▲ 7%</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: COLOR.ink }}>the per-subscriber rate, this year</div>
        </div>
      )}

      {/* households — always present, shrinking on "fewer people", each with a
          growing $ stack */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const gone = i >= 5 * shrink;
          const t = interpolate(frame, [40 + i * 8, 56 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const stack = frame > fewerAt ? 20 + i * 26 : 20;
          return (
            <g key={i} transform={`translate(${520 + i * 190} 740)`} opacity={t * (gone ? 0.15 : 1)}>
              <rect x={-42} y={-32} width={84} height={64} fill={gone ? tint(COLOR.grey, 0.6) : COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />
              <path d="M -48 -32 l 48 -34 l 48 34" fill="none" stroke={COLOR.ink} strokeWidth={4} />
              {!gone && <rect x={-34} y={44} width={68} height={stack} fill={COLOR.ink} />}
            </g>
          );
        })}
      </svg>
      {frame > fewerAt && (
        <Stamp at={fewerAt} x="c" y={864} text="FEWER PEOPLE · EACH HOLDING MORE OF THE BILL" kind="ink" size={36} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B22 — who's left, and why they can't leave: three captive subtypes,
// highlighted in turn on the remaining lit households.
// ═══════════════════════════════════════════════════════════════════════════
export const B22v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B22");
  return (
    <V4Beat props={props} beat="B22" audioDir="nif003" noTransition sfx={<BeatSfx beat="B22" />} bareRoom dots push={[1, 1.02]}>
      <B22Content vo={vo} />
    </V4Beat>
  );
};
const B22Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — the ones still paying are the ones who can't leave.
  // three "captive" badges land on a small cluster of lit households.
  const fanAt = vo.at("fans", 307);
  const bundleAt = vo.at("locked", 511);
  const providerAt = vo.at("whole", 650);
  const leverageAt = vo.at("leverage", 1166);

  const badges = [
    { at: fanAt, label: "SPORTS FAN", sub: "needs one regional channel" },
    { at: bundleAt, label: "BUNDLED W/ INTERNET", sub: "locked into the contract" },
    { at: providerAt, label: "ONLY ONE PROVIDER", sub: "no real alternative" },
  ];

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Who's left paying — and why they can't leave
      </div>
      {badges.map((b, i) => {
        const t = spring({ frame: frame - b.at, fps: 30, config: { damping: 13 }, durationInFrames: 24 });
        if (t <= 0.01) return null;
        return (
          <div key={i} style={{
            position: "absolute", left: 200 + i * 540, top: 300, width: 480, textAlign: "center",
            opacity: Math.min(1, t), transform: `translateY(${(1 - t) * 24}px) scale(${0.8 + t * 0.2})`, filter: softShadow(1.1, 0.22),
          }}>
            <div style={{ width: 150, height: 150, margin: "0 auto", borderRadius: "50%", background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70 }}>🔒</div>
            <div style={{ marginTop: 16, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.ink }}>{b.label}</div>
            <div style={{ marginTop: 6, fontFamily: SANS, fontWeight: 600, fontSize: 20, color: COLOR.grey }}>{b.sub}</div>
          </div>
        );
      })}
      {frame > leverageAt && (
        <Stamp at={leverageAt} x="c" y={760} text="THE LEAST LEVERAGE TO SAY NO" kind="orange" size={48} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B23 — the company you've never heard of: a call-sign card flips to
// reveal NEXSTAR; 200+ dots fill a US-shaped scatter.
// ═══════════════════════════════════════════════════════════════════════════
export const B23v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B23");
  return (
    <V4Beat props={props} beat="B23" audioDir="nif003" noTransition sfx={<BeatSfx beat="B23" />} bareRoom dots push={[1, 1.02]}>
      <B23Content vo={vo} />
    </V4Beat>
  );
};
const B23Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — "YOUR HOMETOWN STATION" card flips to reveal NEXSTAR.
  const nexAt = vo.at("nex", 182);
  const twoHundredAt = vo.at("200", 437);
  // ("very often" — the flip is on the card itself)

  const flip = interpolate(frame, [nexAt, nexAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const face = flip < 0.5;

  return (
    <>
      <ChainStrip active={1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        The company behind it you've never heard of
      </div>
      <div style={{
        position: "absolute", left: 0, right: 0, top: 300, textAlign: "center",
        perspective: 1400,
      }}>
        <div style={{
          display: "inline-block", width: 760, transformStyle: "preserve-3d",
          transform: `rotateY(${flip * 180}deg)`, filter: softShadow(1.4, 0.24),
        }}>
          {face ? (
            <div style={{ background: COLOR.cardWhite, border: `6px solid ${COLOR.ink}`, borderRadius: 20, padding: "60px 20px" }}>
              <IconNewsDesk size={140} />
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: COLOR.ink, marginTop: 20 }}>YOUR HOMETOWN STATION</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: COLOR.grey }}>run by hometown people, you assume</div>
            </div>
          ) : (
            <div style={{ background: COLOR.ink, border: `6px solid ${COLOR.orange}`, borderRadius: 20, padding: "70px 20px", transform: "rotateY(180deg)" }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 100, color: "#fff", letterSpacing: "0.02em" }}>NEXSTAR</div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: COLOR.orange }}>who you're actually watching</div>
            </div>
          )}
        </div>
      </div>
      {frame > twoHundredAt && (
        <HeroNum at={twoHundredAt} value="200+" label="local stations · more than any company in US history" align="center" y={760} size={150} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B24 — $700 million in one quarter: Nexstar's revenue split, mostly
// distribution fees, not ads.
// ═══════════════════════════════════════════════════════════════════════════
export const B24v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B24");
  return (
    <V4Beat props={props} beat="B24" audioDir="nif003" noTransition sfx={<BeatSfx beat="B24" />} bareRoom dots push={[1, 1.02]}>
      <B24Content vo={vo} />
    </V4Beat>
  );
};
const B24Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a revenue donut: ~60% "DISTRIBUTION FEES", not ads.
  // $700M in one quarter, for signals free with a $20 antenna.
  const splitAt = vo.at("60", 206);
  const qAt = vo.at("700", 616);
  const antAt = vo.at("antenna", 907);

  const fill = interpolate(frame, [splitAt - 4, splitAt + 40], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = 620, cy = 500, r = 240;
  const arc = (frac: number) => {
    const a = frac * Math.PI * 2 - Math.PI / 2;
    return `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
  };

  return (
    <>
      <ChainStrip active={1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Nexstar's revenue — mostly not ads
      </div>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={cx} cy={cy} r={r} fill={tint(COLOR.grey, 0.4)} stroke={COLOR.ink} strokeWidth={5} />
        {fill > 0.01 && (
          <path d={`M ${cx} ${cy} L ${arc(0)} A ${r} ${r} 0 ${fill > 0.5 ? 1 : 0} 1 ${arc(fill)} Z`} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={5} />
        )}
        <circle cx={cx} cy={cy} r={110} fill={COLOR.paper} stroke={COLOR.ink} strokeWidth={4} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={64} fill={COLOR.orange}>60%</text>
        <text x={cx} y={cy + 44} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={20} fill={COLOR.ink}>DISTRIBUTION</text>
      </svg>
      <div style={{ position: "absolute", left: 900, top: 300 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.orange }}>▮ DISTRIBUTION FEES</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: COLOR.grey, marginLeft: 4 }}>the retrans payments this whole episode traced</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.grey, marginTop: 20 }}>▮ everything else (ads, etc.)</div>
      </div>
      {frame > qAt && (
        <HeroNum at={qAt} value="$700M+" label="one company · one quarter" align="right" y={470} size={140} />
      )}
      {frame > antAt && (
        <Stamp at={antAt} x="c" y={860} text="FOR SIGNALS FREE WITH A $20 ANTENNA" kind="ink" size={38} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B25 — the one customer who gets a fair price: a rate card locks one row
// for federal candidates; "YOU" finds no row at all.
// ═══════════════════════════════════════════════════════════════════════════
export const B25v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B25");
  return (
    <V4Beat props={props} beat="B25" audioDir="nif003" noTransition sfx={<BeatSfx beat="B25" />} bareRoom dots push={[1, 1.02]}>
      <B25Content vo={vo} />
    </V4Beat>
  );
};
const B25Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a price ladder. Every buyer negotiates UP, except one
  // row: political candidates get the lowest rate, by law. Never you.
  const ladderAt = vo.at("federal", 191);
  const politicalAt = vo.at("political", 562);
  const youAt = vo.at("belonged", 1483);

  // a clean price table: every buyer negotiates UP, one row is locked LOW.
  const rows = [
    { label: "PREMIUM ADVERTISER", price: "negotiates ▲", w: 900 },
    { label: "STANDARD ADVERTISER", price: "negotiates ▲", w: 740 },
    { label: "SMALL LOCAL BUYER", price: "pays rack rate", w: 580 },
  ];
  const rowH = 90, gap = 20, x0 = 460, y0 = 280;

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        One buyer gets a fair price — guaranteed by law
      </div>
      <ChainStrip active={1} />
      {rows.map((r, i) => {
        const at = ladderAt + i * 22;
        const t = spring({ frame: frame - at, fps: 30, config: { damping: 14 }, durationInFrames: 20 });
        if (t <= 0.01) return null;
        return (
          <div key={i} style={{
            position: "absolute", left: x0, top: y0 + i * (rowH + gap), width: r.w * Math.min(1, t), height: rowH,
            background: tint(COLOR.grey, 0.3 + i * 0.12), border: `4px solid ${COLOR.ink}`, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", overflow: "hidden",
            opacity: Math.min(1, t),
          }}>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: COLOR.ink, whiteSpace: "nowrap" }}>{r.label}</span>
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: COLOR.grey, whiteSpace: "nowrap" }}>{r.price}</span>
          </div>
        );
      })}
      {/* the political row — locked, orange, shortest */}
      {frame > politicalAt && (
        <div style={{
          position: "absolute", left: x0, top: y0 + 3 * (rowH + gap) + 10, width: 460, height: rowH,
          background: COLOR.orange, border: `5px solid ${COLOR.ink}`, borderRadius: 10,
          display: "flex", alignItems: "center", gap: 14, padding: "0 24px",
          opacity: interpolate(frame, [politicalAt, politicalAt + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          filter: "drop-shadow(0 0 20px rgba(226,77,40,0.4))",
        }}>
          <span style={{ fontSize: 28 }}>🔒</span>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#fff", lineHeight: 1.1 }}>POLITICAL CANDIDATE<br /><span style={{ fontSize: 18, fontWeight: 700 }}>lowest rate, by law · no negotiating up</span></span>
        </div>
      )}
      {frame > youAt && (
        <Stamp at={youAt} x="c" y={760} text="A PROTECTED BEST PRICE — NEVER ONCE YOURS" kind="orange" size={42} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B26 — not a scam: the newsroom desk relights fully, staffed — the honest
// counter-argument.
// ═══════════════════════════════════════════════════════════════════════════
export const B26v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B26");
  return (
    <V4Beat props={props} beat="B26" audioDir="nif003" noTransition sfx={<BeatSfx beat="B26" />} bareRoom dots push={[1, 1.02]}>
      <B26Content vo={vo} />
    </V4Beat>
  );
};
const B26Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — the counter-argument. A dark newsroom relights, staffed;
  // this fee is probably why your station still has real reporters.
  const newsroomAt = vo.at("newsroom", 202);

  const light = interpolate(frame, [newsroomAt, newsroomAt + 40], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const onAir = light > 0.7;
  // the three real costs this fee covers, appearing as it relights
  const costs = [
    { at: vo.at("advertising", 278), label: "a real newsroom" },
    { at: vo.at("sports", 511), label: "live sports rights" },
    { at: vo.at("reporters", 840), label: "actual reporters — not reruns" },
  ];

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Before this sounds like a scam — it isn't
      </div>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* the studio — walls + a big anchor screen + desk + 3 anchors + a
            camera. The whole thing brightens as `light` rises. */}
        <g style={{ filter: softShadow(1.1, 0.22) }}>
          <rect x={360} y={200} width={1200} height={560} rx={20} fill={`rgb(${Math.round(20 + light * 226)},${Math.round(20 + light * 222)},${Math.round(20 + light * 215)})`} stroke={COLOR.ink} strokeWidth={7} />
          {/* the big screen behind the desk */}
          <rect x={470} y={250} width={620} height={280} rx={10} fill={COLOR.ink} />
          <rect x={488} y={268} width={584} height={244} rx={6} fill={onAir ? tint(SUPPORT.sky, 0.2) : "#222"} />
          {onAir && <><rect x={488} y={430} width={584} height={50} fill={COLOR.orange} opacity={0.85} /><text x={780} y={465} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill="#fff">LOCAL NEWS AT SIX</text></>}
          {/* the anchor desk */}
          <rect x={420} y={600} width={1080} height={120} rx={14} fill={onAir ? tint(COLOR.grey, 0.3) : "#333"} stroke={COLOR.ink} strokeWidth={5} />
          {/* 3 anchors */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${560 + i * 400} 560)`} opacity={light}>
              <circle cx={0} cy={0} r={44} fill={tint(COLOR.tan, 0.16)} stroke={COLOR.ink} strokeWidth={5} />
              <path d="M -64 90 q 0 -78 64 -78 q 64 0 64 78 z" fill={i === 1 ? COLOR.orange : tint(COLOR.grey, 0.25)} stroke={COLOR.ink} strokeWidth={5} />
            </g>
          ))}
          {/* ON AIR sign */}
          <rect x={1360} y={240} width={140} height={54} rx={8} fill={onAir ? COLOR.orange : "#555"} stroke={COLOR.ink} strokeWidth={4} />
          <text x={1430} y={277} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill="#fff">ON AIR</text>
        </g>
      </svg>
      {/* the costs, listed on the right as it lights */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", gap: 30 }}>
        {costs.map((c, i) => {
          const t = interpolate(frame, [c.at, c.at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (t <= 0) return null;
          return (
            <div key={i} style={{ opacity: t, transform: `translateY(${(1 - t) * 16}px)`, fontFamily: SANS, fontWeight: 800, fontSize: 24, color: COLOR.ink, background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 999, padding: "10px 26px" }}>✓ {c.label}</div>
          );
        })}
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B27 — you never got a menu: a MENU card ghosts in, replaced by BUNDLE +
// BILL — the real problem, typed on.
// ═══════════════════════════════════════════════════════════════════════════
export const B27v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B27");
  return (
    <V4Beat props={props} beat="B27" audioDir="nif003" noTransition sfx={<BeatSfx beat="B27" />} bareRoom dots push={[1, 1.02]}>
      <B27Content vo={vo} />
    </V4Beat>
  );
};
const B27Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — a "MENU" you never got, replaced by what you actually
  // got: a bundle, a bill, a line that looks like a tax.
  const menuAt = vo.at("menu", 232);
  const gotAt = vo.at("got", 290, 1);
  const roomAt = vo.at("room", 756);

  const menuGone = interpolate(frame, [gotAt, gotAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const got = ["A BUNDLE", "A MONTHLY BILL", "A LINE THAT LOOKS LIKE A TAX"];

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        You never got handed a menu
      </div>
      {/* the ghost MENU */}
      {frame > menuAt && menuGone < 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 300, textAlign: "center",
          opacity: interpolate(frame, [menuAt, menuAt + 14], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - menuGone),
          transform: `scale(${1 - menuGone * 0.2})`,
        }}>
          <div style={{ display: "inline-block", background: COLOR.cardWhite, border: `5px dashed ${COLOR.grey}`, borderRadius: 18, padding: "50px 80px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, color: COLOR.grey }}>MENU</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: COLOR.grey }}>pick what you want, see each price</div>
          </div>
        </div>
      )}
      {/* what you actually got */}
      {frame > gotAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {got.map((g, i) => {
            const t = spring({ frame: frame - (gotAt + 10 + i * 14), fps: 30, config: { damping: 14 }, durationInFrames: 20 });
            if (t <= 0.01) return null;
            return (
              <div key={i} style={{
                opacity: Math.min(1, t), transform: `translateX(${(1 - t) * -30}px)`,
                fontFamily: SANS, fontWeight: 800, fontSize: 42, color: i === 2 ? COLOR.orange : COLOR.ink,
                background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 12, padding: "16px 40px",
              }}>{g}</div>
            );
          })}
        </div>
      )}
      {frame > roomAt && (
        <Stamp at={roomAt} x="c" y={820} text="YOU WERE NEVER IN THE ROOM WHERE THE PRICE GOT DECIDED" kind="orange" size={34} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B28 — hundreds of dollars, never a choice: a receipt stacks every fee into
// one annual total.
// ═══════════════════════════════════════════════════════════════════════════
export const B28v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B28");
  return (
    <V4Beat props={props} beat="B28" audioDir="nif003" noTransition sfx={<BeatSfx beat="B28" />} bareRoom dots push={[1, 1.02]}>
      <B28Content vo={vo} />
    </V4Beat>
  );
};
const B28Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // no character — the whole bill, stacked on one receipt card, line by
  // line, to a total that was "never your choice".
  const rows = [
    { at: vo.at("average", 92), label: "Average TV bill", val: "$100+/mo", note: "$1,800+/yr with internet-bundled pricing" },
    { at: vo.at("broadcast", 427), label: "Broadcast fee", val: "$100+/yr", note: "you cannot remove it", flag: true },
    { at: vo.at("sports", 672), label: "Sports fee", val: "baked in", note: "you cannot decline it", flag: true },
    { at: vo.at("rises", 929), label: "The rate itself", val: "▲ every year", note: "no matter what you watch", flag: true },
  ];
  const totalAt = vo.at("hundreds", 1120);

  return (
    <>
      <div style={{ position: "absolute", left: 480, top: 90, width: 960, filter: softShadow(1.3, 0.24) }}>
        <div style={{ background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ background: COLOR.ink, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 28, padding: "16px 28px", letterSpacing: "0.06em" }}>EVERY PIECE ON THE TABLE</div>
          {rows.map((r, i) => {
            const t = spring({ frame: frame - r.at, fps: 30, config: { damping: 15 }, durationInFrames: 20 });
            if (t <= 0.01) return null;
            return (
              <div key={i} style={{ padding: "18px 28px", borderTop: `2px solid ${tint(COLOR.grey, 0.5)}`, opacity: Math.min(1, t), transform: `translateX(${(1 - t) * -16}px)`, background: r.flag ? tint(COLOR.orange, 0.5) : "transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.ink }}>{r.label}</span>
                  <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: r.flag ? COLOR.orange : COLOR.ink }}>{r.val}</span>
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, color: COLOR.grey }}>{r.note}</div>
              </div>
            );
          })}
          {frame > totalAt && (
            <div style={{ background: tint(COLOR.grey, 0.6), borderTop: `4px solid ${COLOR.ink}`, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: interpolate(frame, [totalAt, totalAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: COLOR.ink }}>NEVER ACTUALLY YOUR CHOICE</span>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: COLOR.orange }}>$100s / yr</span>
            </div>
          )}
        </div>
      </div>
      <ChainStrip active={3} />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B29 — THE REVERSAL. The full chain from B01 reappears, fully lit; a final
// unfilled "YOU" node lands right as the Dark Law crossfade begins.
// ═══════════════════════════════════════════════════════════════════════════
export const B29v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B29");
  const seatAt = vo.at("you", 1335, 3);
  return (
    <V4Beat props={props} beat="B29" audioDir="nif003" noTransition sfx={<BeatSfx beat="B29" />} bareRoom push={[1, 1.02]} darkLawAt={props.globalStartFrame + seatAt}>
      <B29Content vo={vo} seatAt={seatAt} />
    </V4Beat>
  );
};
const B29Content: React.FC<{ vo: VO; seatAt: number }> = ({ vo, seatAt }) => {
  const frame = useCurrentFrame();
  // THE REVERSAL. The full chain, each link lights PAID as it's named; the
  // YOU node lands EMPTY on "seat at the table" as the Dark Law crossfade
  // begins (wrapper handles paper→ink). On ink the chain glows, YOU stays
  // a dashed empty box.
  const dark = frame >= seatAt; // matches the wrapper's darkLawAt
  const links = [
    { label: "THE NETWORK", at: vo.at("network", 690), Icon: IconTower },
    { label: "LOCAL STATION", at: vo.at("station", 745), Icon: IconStationBuilding },
    { label: "RATINGS CO.", at: vo.at("ratings", 797), Icon: IconRatingStar },
    { label: "ADVERTISER", at: vo.at("advertis", 868), Icon: IconMegaphone },
    { label: "THE OPERATOR", at: vo.at("operator", 922), Icon: IconTVSet },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: dark ? "#F6F2E7" : COLOR.ink, opacity: interpolate(frame, [6, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Every link got paid. Every link but one.
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {links.map((l, i) => {
          const t = spring({ frame: frame - l.at, fps: 30, config: { damping: 14 }, durationInFrames: 20 });
          if (t <= 0.01) return null;
          const paid = frame >= l.at + 8;
          return (
            <div key={i} style={{
              width: 780, display: "flex", alignItems: "center", gap: 20, padding: "14px 26px",
              background: dark ? "#1e1e1e" : COLOR.cardWhite, border: `4px solid ${dark ? COLOR.orange : COLOR.ink}`, borderRadius: 14,
              opacity: Math.min(1, t), transform: `translateX(${(1 - t) * -24}px)`,
              boxShadow: dark ? `0 0 24px rgba(226,77,40,0.4)` : undefined,
            }}>
              <div style={{ width: 60, height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><l.Icon size={54} /></div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: dark ? "#F6F2E7" : COLOR.ink, flex: 1 }}>{l.label}</div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, color: "#fff", background: COLOR.orange, borderRadius: 999, padding: "4px 18px", opacity: paid ? 1 : 0.2 }}>PAID</div>
            </div>
          );
        })}
        {/* the YOU node — lands empty */}
        {frame >= seatAt - 20 && (
          <div style={{
            width: 780, display: "flex", alignItems: "center", gap: 20, padding: "18px 26px", marginTop: 10,
            background: "transparent", border: `5px dashed ${dark ? COLOR.orange : COLOR.grey}`, borderRadius: 14,
            opacity: interpolate(frame, [seatAt - 20, seatAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <div style={{ width: 60, height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>👤</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: dark ? "#F6F2E7" : COLOR.ink, flex: 1 }}>YOU</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, color: dark ? "#F6F2E7" : COLOR.grey, border: `3px solid ${dark ? COLOR.orange : COLOR.grey}`, borderRadius: 999, padding: "4px 18px" }}>NO SEAT</div>
          </div>
        )}
      </div>

      {dark && frame > seatAt + 20 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", opacity: interpolate(frame, [seatAt + 20, seatAt + 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: "0.04em", color: "#F6F2E7" }}>
          Never once got a seat at the table.
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B30 — same shape, different company: the reversal's ink field continues.
// An auction-ring echo (Ep2's motif) fades into a station-tower silhouette.
// ═══════════════════════════════════════════════════════════════════════════
export const B30v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B30");
  return (
    <V4Beat props={props} beat="B30" audioDir="nif003" noTransition sfx={<BeatSfx beat="B30" />} bareRoom darkLawAt={props.globalStartFrame - 30}>
      <B30Content vo={vo} />
    </V4Beat>
  );
};
const B30Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // implication — the unfilled YOU node lingers; a ghost of Ep2's auction
  // ring fades into a station-tower silhouette. "same shape."
  const companyAt = vo.at("company", 283);
  const auctionAt = vo.at("auction", 570);
  const stationAt = vo.at("station", 851);

  const ringOut = interpolate(frame, [stationAt - 20, stationAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tower = interpolate(frame, [stationAt - 10, stationAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // B30 continues on the ink field (wrapper darkLawAt = before start).
  const LIGHT = "#F6F2E7";
  const DIM = "#8a857c";
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 42, color: LIGHT, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        The same shape as everything on this channel
      </div>

      {/* YOU › a company you've never heard of › the simple thing */}
      {frame > companyAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", alignItems: "center", gap: 36, opacity: interpolate(frame, [companyAt, companyAt + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: LIGHT, border: `4px solid ${LIGHT}`, borderRadius: 12, padding: "18px 30px" }}>YOU</div>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: DIM }}>›</span>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", background: COLOR.orange, border: `4px solid ${LIGHT}`, borderRadius: 12, padding: "18px 30px", textAlign: "center", filter: "drop-shadow(0 0 22px rgba(226,77,40,0.5))" }}>a company you've<br />never heard of</div>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: DIM }}>›</span>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: DIM, border: `4px dashed ${DIM}`, borderRadius: 12, padding: "18px 30px" }}>the simple thing</div>
        </div>
      )}

      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* Ep2 auction-ring ghost */}
        {frame > auctionAt && ringOut > 0.02 && (
          <g opacity={ringOut * 0.7}>
            {[0, 1, 2].map((k) => <circle key={k} cx={960} cy={700} r={110 + k * 55} fill="none" stroke={DIM} strokeWidth={6} />)}
            <text x={960} y={470} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={24} fill={DIM}>Ep2 — an auction behind your phone</text>
          </g>
        )}
        {/* station tower silhouette */}
        {tower > 0.02 && (
          <g opacity={tower} transform="translate(960 800)">
            <path d="M -60 0 L -20 -240 L 20 -240 L 60 0 Z" fill={LIGHT} />
            <line x1={-42} y1={-120} x2={42} y2={-120} stroke={LIGHT} strokeWidth={10} />
            {[0, 1, 2].map((k) => <path key={k} d={`M 20 -262 q ${44 + k * 26} 0 ${44 + k * 26} ${44 + k * 22}`} fill="none" stroke={COLOR.orange} strokeWidth={6} />)}
            <text x={0} y={52} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={28} fill={LIGHT}>this time — your local news station</text>
          </g>
        )}
      </svg>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B31 — the bridge: "next time," the map on your phone, then the black +
// orange NEXT TIME card naming Episode 4 (Google Maps) — scoped to just
// this beat's own ending (creator 2026-09-05).
// ═══════════════════════════════════════════════════════════════════════════
export const B31v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B31");
  return (
    <V4Beat props={props} beat="B31" audioDir="nif003" noTransition sfx={<BeatSfx beat="B31" />} bareRoom dots push={[1, 1.02]}>
      <B31Content vo={vo} />
    </V4Beat>
  );
};

const B31Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // bridge to Ep4 — a phone, a map, a pin draws on in outline and pulses.
  const mapAt = vo.at("map", 378);
  const payingAt = vo.at("paying", 518);
  const pinAt = vo.at("pin", 623);

  const draw = interpolate(frame, [pinAt - 20, pinAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = frame > pinAt ? 1 + Math.sin((frame - pinAt) / 12) * 0.06 : 1;
  const phoneT = spring({ frame: frame - vo.at("map", 378) + 40, fps: 30, config: { damping: 15 }, durationInFrames: 26 });

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Next time: the map on your phone
      </div>
      {phoneT > 0.01 && (
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: Math.min(1, phoneT), transform: `translateY(${(1 - phoneT) * 30}px)` }}>
          {/* phone */}
          <rect x={740} y={230} width={440} height={620} rx={48} fill={COLOR.ink} />
          <rect x={764} y={272} width={392} height={536} rx={22} fill={frame > mapAt ? tint(SUPPORT.forest, 0.72) : COLOR.cardWhite} />
          {frame > mapAt && [0, 1, 2, 3].map((k) => (
            <line key={k} x1={764} y1={320 + k * 130} x2={1156} y2={320 + k * 130 + (k % 2 ? 40 : -20)} stroke={tint(COLOR.grey, 0.35)} strokeWidth={7} />
          ))}
          {/* the pin — big */}
          <g transform={`translate(960 520) scale(${pulse * 2.4})`}>
            <path d="M 0 40 C -46 -20 -46 -74 0 -74 C 46 -74 46 -20 0 40 Z" fill={draw > 0.99 ? COLOR.orange : "none"} stroke={COLOR.ink} strokeWidth={6} strokeDasharray={280} strokeDashoffset={280 * (1 - draw)} />
            {draw > 0.99 && <circle cx={0} cy={-42} r={17} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={5} />}
          </g>
        </svg>
      )}
      {frame > payingAt && (
        <Stamp at={payingAt} x="c" y={900} text="SOMEBODY ALREADY PAYS FOR EVERY PIN" kind="ink" size={38} rot={-2} />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// B32 — the close: back on the same couch, the same TV, the CTA, then the
// remote-asks-if-you're-still-watching callback that closes the cold open.
// ═══════════════════════════════════════════════════════════════════════════
export const B32v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B32");
  return (
    <V4Beat props={props} beat="B32" audioDir="nif003" noTransition sfx={<BeatSfx beat="B32" />} bareRoom dots push={[1, 1.02]}>
      <B32Content vo={vo} />
    </V4Beat>
  );
};

const B32Content: React.FC<{ vo: VO }> = ({ vo }) => {
  const frame = useCurrentFrame();
  // close — paper returns from ink; a SUBSCRIBE card; the "still watching?"
  // remote callback. Signature + closing line → Resolve (§22.7).
  const subAt = vo.at("subscribe", 125);
  const remoteAt = vo.at("remote", 350);
  const answeredAt = vo.at("answered", 495);

  // the field returns from ink over the first ~24f
  const fromInk = interpolate(frame, [0, 24], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subT = spring({ frame: frame - subAt, fps: 30, config: { damping: 15 }, durationInFrames: 24 });
  const promptShow = interpolate(frame, [remoteAt, remoteAt + 16, answeredAt + 90, answeredAt + 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {fromInk > 0.01 && <div style={{ position: "absolute", inset: 0, background: "#141414", opacity: fromInk, pointerEvents: "none" }} />}

      {subT > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", opacity: Math.min(1, subT), transform: `scale(${0.9 + Math.min(1, subT) * 0.1})` }}>
          <div style={{ display: "inline-block", background: COLOR.cardWhite, border: `6px solid ${COLOR.ink}`, borderRadius: 24, padding: "48px 88px", filter: softShadow(1.4, 0.24) }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: "0.14em", color: COLOR.grey }}>NOTHING IS FREE</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 110, lineHeight: 1, color: COLOR.orange, margin: "10px 0" }}>SUBSCRIBE</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: COLOR.ink }}>it's free — and this time we mean it</div>
          </div>
        </div>
      )}

      {/* the remote's "still watching?" prompt — closes the cold open */}
      {promptShow > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", opacity: promptShow }}>
          <div style={{ display: "inline-block", background: COLOR.ink, color: "#fff", borderRadius: 16, padding: "26px 44px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32 }}>Are you still watching?</div>
            <div style={{ marginTop: 16, display: "flex", gap: 16, justifyContent: "center" }}>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, background: "#fff", color: COLOR.ink, borderRadius: 8, padding: "8px 24px" }}>Yes</span>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, border: "2px solid #fff", borderRadius: 8, padding: "8px 24px", opacity: 0.6 }}>Exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const V4_BEATS_NIF003 = {
  B00v4, B01v4, B02v4, B03v4, B04v4, B05v4, B06v4, B07v4, B08v4, B09v4, B10v4,
  B11v4, B12v4, B13v4, B14v4, B15v4, B16v4, B17v4, B18v4, B19v4, B20v4, B21v4, B22v4,
  B23v4, B24v4, B25v4, B26v4, B27v4, B28v4, B29v4, B30v4,
  B31v4, B32v4,
} as const;
