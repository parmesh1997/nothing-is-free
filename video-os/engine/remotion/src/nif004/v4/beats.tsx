import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, HEIGHT, SUPPORT, WIDTH, shade, softShadow, tint } from "../../tokens";
import { Bloom } from "../../parts/Bloom";
import { V4Beat } from "../../nif002/v4/V4Beat";
import { SANS } from "../../nif002/v4/fonts4";
import { useBeatTiming } from "../timing";
import { BeatSfx } from "./audio";
import { MapField, DrivePOV } from "./MapField";
import { Meter, ThreeMeters, MeterRack } from "./Meter";
import {
  Head, Stamp, HeroNum, PinAuction, AppTileWall, RankedList, ContenderPlates,
  DevDesk, IconWarrant, IconTimeline, IconBadge, IconPin,
} from "./kit";
import { Figure, FIG, Walker, EXPR } from "../../nif002/v4/Figure";
import { GlideScene, GlideIn, Layer } from "../../motion/glide";

/**
 * beats.tsx — NIF004 ("Google Maps — the hidden economics of the free map"),
 * pattern "The Meter". 34 beats B00–B33.
 *
 * DISCIPLINE (from the 2026-09-09 by-eye audit):
 *  · the primary visual of a beat builds on a FIXED fraction of the beat's own
 *    length (`s(frac)`), never on a late VO word — eleven_v3's pauses push key
 *    nouns into the back third, so word-gated builds leave the frame empty then
 *    cram. `hit(word, frac, cap)` is for accents only and is clamped so nothing
 *    lands in the last ~18% of a beat.
 *  · most beats sit on a faint <MapField> bed (roads only) — full-frame,
 *    on-theme, and it carries the bottom third (§13.5). Beats with their own
 *    full background (drive / desk / road / dark) pass `bed={false}`.
 *  · Head lives at y≈52; content stays clear of it; one Stamp max, low.
 *  · elements that state a fact PERSIST — they do not fade back out.
 *  · Lucky (orange tee, ponytail, OverSimplified) carries the "you" beats —
 *    B02 searches / B16 taps Book / B18 walks + parks / B24 feeds both meters /
 *    B25 stands on the road → one reading. She acts the script out, never faces
 *    camera. Generic figures (SUPPORT tee, no hair) for companies: B09 leavers,
 *    B27 the developer.
 *
 * Motion register (runbook §22.10): Glide on B00 + B30; Punch elsewhere.
 * Every beat: audioDir="nif004" noTransition. Transitions / subtitles / kinetic
 * deep text / music are Resolve's (§22.7); only SFX is baked, per beat.
 * Dark Law engages inside B30 and holds through B31/B32; field returns to paper
 * on B33's last line.
 */

const useVO = (b: string) => useBeatTiming(b.replace(/v4$/i, ""));
type VO = ReturnType<typeof useVO>;

const grow = (f: number, a: number, dd = 18) =>
  interpolate(f, [a, a + dd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ramp = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** the uniform NIF004 beat wrapper. */
const Beat: React.FC<{
  id: string;
  props: BeatProps;
  dots?: boolean;
  bed?: boolean;
  push?: [number, number];
  darkLawAt?: number;
  children: React.ReactNode;
}> = ({ id, props, dots, bed = true, push, darkLawAt, children }) => (
  <V4Beat props={props} beat={id} audioDir="nif004" noTransition sfx={<BeatSfx beat={id} />} bareRoom dots={dots && !bed} push={push} darkLawAt={darkLawAt}>
    {bed && <MapField at={0} dim={0.42} />}
    {children}
  </V4Beat>
);

type CProps = { vo: VO; d: number };
/** fixed-schedule + clamped-word-accent helpers, bound to this beat's length. */
const sched = (d: number) => (frac: number) => Math.round(d * frac);
const hitter = (vo: VO, d: number) => (word: string, frac: number, cap = 0.82) =>
  Math.min(vo.at(word, Math.round(d * frac)), Math.round(d * cap));

/** a compact phone frame carrying a line-art map. */
const PhoneMap: React.FC<{ at: number; x?: number; y?: number; w?: number; children?: React.ReactNode }> = ({ at, x = WIDTH / 2, y = 128, w = 430, children }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f - at, fps: 30, config: { damping: 15 }, durationInFrames: 24 });
  if (t <= 0.01) return null;
  const h = w * 1.7;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h, opacity: Math.min(1, t), transform: `translateY(${(1 - t) * 24}px)`, filter: softShadow(1.3, 0.22) }}>
      <div style={{ background: COLOR.ink, borderRadius: 40, padding: 16, height: "100%" }}>
        <div style={{ background: tint(SUPPORT.forest, 0.74), borderRadius: 26, height: "100%", position: "relative", overflow: "hidden" }}>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <div key={k} style={{ position: "absolute", left: -30, right: -30, top: 40 + k * 108, height: 5, background: COLOR.grey, opacity: 0.4, transform: `rotate(${k % 2 ? 2.5 : -1.5}deg)` }} />
          ))}
          {[0, 1, 2].map((k) => (
            <div key={`v${k}`} style={{ position: "absolute", top: -30, bottom: -30, left: 55 + k * 125, width: 5, background: COLOR.grey, opacity: 0.34 }} />
          ))}
          {children}
        </div>
      </div>
    </div>
  );
};

const Toggle: React.FC<{ on: boolean }> = ({ on }) => (
  <div style={{ width: 96, height: 50, borderRadius: 25, background: on ? COLOR.orange : tint(COLOR.grey, 0.3), position: "relative" }}>
    <div style={{ position: "absolute", top: 5, left: on ? 50 : 5, width: 40, height: 40, borderRadius: "50%", background: "#fff", border: `3px solid ${COLOR.ink}` }} />
  </div>
);

/** a small connector from a source point to a card (ties floating UI together). */
const Wire: React.FC<{ x1: number; y1: number; x2: number; y2: number; on: number; dark?: boolean }> = ({ x1, y1, x2, y2, on, dark }) => {
  const f = useCurrentFrame();
  const t = grow(f, on);
  if (t <= 0) return null;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * t} y2={y1 + (y2 - y1) * t} stroke={dark ? "#F6F2E7" : COLOR.orange} strokeWidth={3} strokeDasharray="2 9" strokeDashoffset={-(f * 1.4) % 120} />
    </svg>
  );
};

// ═══ B00 — cold open · signature · GLIDE ════════════════════════════════════
export const B00v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B00");
  return (
    <Beat id="B00" props={props} bed={false} push={[1, 1]}>
      <B00Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B00Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const hit = hitter(vo, d);
  const recalcAt = hit("standing", 0.5, 0.7);
  const flipAt = hit("eleven", 0.32, 0.6);
  const meter = ramp(f, 20, d - 24, 0, 4.4);
  const flipped = f > flipAt;
  return (
    <>
      <GlideScene push="in" spanFrames={Math.round(d * 0.92)} drift={1}>
        <Layer plane="deepMid"><DrivePOV recalcAt={recalcAt} pinAt={recalcAt - 26} /></Layer>
      </GlideScene>
      {/* HUD — a true overlay, drawn after the scene so the sky/road never covers it */}
      <GlideIn at={16} style={{ position: "absolute", right: 120, top: 64, textAlign: "right", zIndex: 50 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.14em", color: COLOR.grey }}>METER</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 82, lineHeight: 1, color: COLOR.orange }}>${meter.toFixed(2)}</div>
      </GlideIn>
      <GlideIn at={flipAt} style={{ position: "absolute", left: 120, top: 66, zIndex: 50 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.05em", color: COLOR.grey, textDecoration: flipped ? "line-through" : "none" }}>FREE TO YOU</div>
        {flipped && (
          <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 800, fontSize: 62, lineHeight: 1, color: COLOR.ink, transform: `scale(${0.8 + grow(f, flipAt) * 0.2})`, transformOrigin: "left" }}>
            $11B<span style={{ fontSize: 26, color: COLOR.grey }}> / YEAR</span>
          </div>
        )}
      </GlideIn>
    </>
  );
};

// ═══ B01 — the promise · dry humour + three meters ═════════════════════════
export const B01v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B01");
  return (
    <Beat id="B01" props={props}>
      <B01Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B01Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const hit = hitter(vo, d);
  const metersAt = s(0.14);
  const youAt = hit("third", 0.55, 0.78);
  const machineAt = hit("machine", 0.86, 0.9);
  const active = f > youAt ? 2 : -1;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: grow(f, 8) }}>
        Turning it on starts three meters running.
      </div>
      <ThreeMeters at={metersAt} mode="full" active={active} />
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: grow(f, metersAt + 6) }}>
        {[430, 960, 1490].map((x, i) => (
          <line key={i} x1={WIDTH / 2} y1={190} x2={x} y2={372} stroke={COLOR.orange} strokeWidth={3} strokeDasharray="2 10" opacity={i === 2 && f > youAt ? 0.95 : 0.55} strokeDashoffset={-(f * 1.4) % 120} />
        ))}
        {f > machineAt && <line x1={430} y1={640} x2={1490} y2={640} stroke={COLOR.ink} strokeWidth={5} opacity={grow(f, machineAt)} />}
      </svg>
      <IconPinAt x={WIDTH / 2} y={150} at={8} />
      {f > machineAt && <Stamp at={machineAt} y={690} text="THE SAME MACHINE" kind="ink" size={34} />}
      {f > machineAt + 6 && <Bloom window={[machineAt + 6, machineAt + 18, machineAt + 60, machineAt + 92]} radius={420} x="50%" y="46%" intensity={0.32} />}
    </>
  );
};
/** a small standalone pin marker (for "the map" source point). */
const IconPinAt: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f - at, fps: 30, config: { damping: 13 }, durationInFrames: 20 });
  if (t <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x - 22, top: y, transform: `scale(${Math.min(1, t)})`, transformOrigin: "bottom center" }}>
      <IconPin size={44} />
    </div>
  );
};

// ═══ B02 — compressed save-the-cat + the coffee-pin proof ══════════════════
export const B02v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B02");
  return (
    <Beat id="B02" props={props}>
      <B02Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B02Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const hit = hitter(vo, d);
  const pinsAt = s(0.16);
  const paidAt = s(0.5);
  const smallestAt = hit("smallest", 0.86, 0.9);
  const pins = [
    { x: 0.62, y: 0.24, top: true }, { x: 0.4, y: 0.52, near: true }, { x: 0.3, y: 0.34 }, { x: 0.68, y: 0.6 },
  ];
  return (
    <>
      <Head text="One of the hardest things ever built. The question is who pays." />
      {/* Lucky opens the map and searches — the one meter you can see right now */}
      <Figure pose="tap" hair="ponytail" tee={COLOR.orange} h={FIG.hero} x={296} baseline={806} facing={1} />
      {/* her screen, magnified beside her */}
      <PhoneMap at={pinsAt - 20} x={598} y={158} w={346}>
        {pins.map((p, i) => {
          const t = grow(f, pinsAt + i * 6);
          if (t <= 0) return null;
          return (
            <div key={i} style={{ position: "absolute", left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: `translate(-50%,-100%) scale(${t})` }}>
              <IconPin size={p.top ? 52 : p.near ? 40 : 34} filled={!!p.top} />
              {p.near && f > pinsAt + 24 && (
                <div style={{ position: "absolute", left: "50%", top: "50%", width: 70, height: 70, border: `3px solid ${SUPPORT.sky}`, borderRadius: "50%", transform: `translate(-50%,-50%) scale(${1 + Math.sin(f / 8) * 0.1})` }} />
              )}
              {p.near && f > pinsAt + 24 && <div style={{ position: "absolute", left: "50%", top: "118%", transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 800, fontSize: 15, color: "#fff", background: COLOR.ink, borderRadius: 5, padding: "2px 7px", whiteSpace: "nowrap" }}>the closest</div>}
              {p.top && f > pinsAt + 24 && <div style={{ position: "absolute", left: "50%", top: "-40%", transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 800, fontSize: 15, color: "#fff", background: COLOR.orange, borderRadius: 6, padding: "3px 8px", whiteSpace: "nowrap" }}>#1 RESULT</div>}
            </div>
          );
        })}
      </PhoneMap>
      <Wire x1={775} y1={320} x2={1180} y2={392} on={paidAt} />
      {f > paidAt && (
        <div style={{ position: "absolute", left: 1180, top: 312, width: 620, opacity: grow(f, paidAt) }}>
          <div style={{ background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 16, padding: "20px 26px", filter: softShadow(1.1, 0.22) }}>
            <div style={{ fontFamily: SANS, fontSize: 20, color: COLOR.grey, fontWeight: 800, letterSpacing: "0.06em", transform: `scale(${1 + ramp(f, paidAt + 18, paidAt + 44, 0, 0.8)})`, transformOrigin: "left" }}>SPONSORED</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 42, color: COLOR.ink, marginTop: 4 }}>Bru's Coffee &amp; Co.</div>
            <div style={{ fontFamily: SANS, fontSize: 23, color: COLOR.grey }}>1.4 mi away &nbsp;·&nbsp; not the closest one</div>
            <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 800, fontSize: 22, color: COLOR.orange }}>somebody paid to put it there</div>
          </div>
        </div>
      )}
      {f > smallestAt && <Stamp at={smallestAt} y={904} text="AND THIS IS THE SMALLEST OF THE THREE" kind="ink" size={32} />}
    </>
  );
};

// ═══ B03 — the question ═══════════════════════════════════════════════════
export const B03v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B03");
  return (
    <Beat id="B03" props={props}>
      <B03Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B03Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const qAt = s(0.46);
  const bills = [
    { e: "EP1 · concessions", v: "$14" }, { e: "EP2 · your phone", v: "$9" }, { e: "EP3 · your TV", v: "$83" },
  ];
  return (
    <>
      <Head text="Every episode so far started with a bill you could see." />
      {/* the three prior bills — they stay; the 4th slot is blank */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", gap: 34 }}>
        {bills.map((b, i) => {
          const t = grow(f, s(0.06) + i * 8);
          if (t <= 0) return null;
          return (
            <div key={i} style={{ width: 300, opacity: Math.min(1, t) * (f > qAt ? 0.7 : 1), transform: `translateY(${(1 - Math.min(1, t)) * 20}px)` }}>
              <div style={{ background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 12, padding: "22px 16px", textAlign: "center", filter: softShadow(0.9, 0.18) }}>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, color: COLOR.grey }}>{b.e}</div>
                <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: COLOR.ink, textDecoration: "line-through", textDecorationColor: COLOR.orange }}>{b.v}</div>
              </div>
            </div>
          );
        })}
        <div style={{ width: 300, opacity: grow(f, s(0.24)) }}>
          <div style={{ background: "transparent", border: `4px dashed ${COLOR.grey}`, borderRadius: 12, padding: "22px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, color: COLOR.grey }}>EP4 · the map</div>
            <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: COLOR.grey }}>$0</div>
          </div>
        </div>
      </div>
      {f > qAt && (
        <div style={{ position: "absolute", inset: 0, opacity: grow(f, qAt) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 400, lineHeight: 1, color: COLOR.orange, transform: `scale(${1 + Math.sin(f / 20) * 0.03})` }}>?</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 48, color: COLOR.ink }}>if the map never charges you — who is it charging?</div>
        </div>
      )}
    </>
  );
};

// ═══ B04 — meter 1: every app pays per look ═══════════════════════════════
export const B04v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B04");
  return (
    <Beat id="B04" props={props} bed={false} dots>
      <B04Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B04Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  return (
    <>
      <Head text="You are not the only one looking at a map right now" />
      <AppTileWall at={s(0.05)} tiles={["RIDE", "DELIVERY", "LISTINGS", "“FIND US”", "RESERVE", "WEATHER"]} boxLabel="THE PLATFORM — GOOGLE MAPS" />
      {f > s(0.6) && <Stamp at={s(0.6)} y={992} text="EVERY LOAD IS A CHARGE ON THEIR BILL" kind="orange" size={30} />}
    </>
  );
};

// ═══ B05 — July 16, 2018 ═════════════════════════════════════════════════
export const B05v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B05");
  return (
    <Beat id="B05" props={props} dots>
      <B05Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B05Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const foldAt = s(0.1);
  const creditAt = s(0.4);
  const cardAt = s(0.72);
  const fold = ramp(f, foldAt, foldAt + s(0.14));
  const survivors = ["MAPS", "ROUTES", "PLACES"];
  return (
    <>
      <Stamp at={s(0.02)} y={80} text="JULY 16, 2018" kind="orange" size={44} />
      {/* 18 tool tiles → 3 named APIs, up top */}
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const col = i % 9, row = Math.floor(i / 9);
          const homeX = 360 + col * 140, homeY = 210 + row * 96;
          const keep = i % 9 === 0;
          const x = interpolate(fold, [0, 1], [homeX, keep ? 560 + Math.floor(i / 9) * 400 : homeX]);
          const y = interpolate(fold, [0, 1], [homeY, 240]);
          const o = keep ? 1 : 1 - fold;
          if (o < 0.02) return null;
          return <rect key={i} x={x - 30} y={y - 30} width={60} height={60} rx={10} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={4} opacity={Math.min(o, grow(f, 16 + i * 3))} />;
        })}
        {fold > 0.4 && survivors.map((nm, i) => (
          <g key={nm} opacity={grow(f, foldAt + s(0.1) + i * 6)}>
            <rect x={560 + i * 400 - 130} y={196} width={260} height={88} rx={12} fill={tint(COLOR.orange, 0.34)} stroke={COLOR.orange} strokeWidth={4} />
            <text x={560 + i * 400} y={252} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={32} fill={COLOR.ink}>{nm}</text>
          </g>
        ))}
      </svg>
      {/* the meter is on now — a pip runs through the three APIs, counting */}
      {fold > 0.92 && (
        <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {survivors.map((_, i) => {
            const active = Math.floor((f - foldAt - s(0.12)) / 20) % 3 === i;
            return <circle key={i} cx={560 + i * 400 + 96} cy={214} r={7} fill={active ? COLOR.orange : "none"} stroke={COLOR.orange} strokeWidth={2.5} opacity={0.9} />;
          })}
        </svg>
      )}
      {/* before → after */}
      {f > creditAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", opacity: grow(f, creditAt) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: COLOR.grey, textDecoration: "line-through" }}>25,000 map loads a day — at no cost</div>
          <div style={{ marginTop: 12, fontFamily: SANS, fontWeight: 800, fontSize: 46, lineHeight: 1.1, color: COLOR.orange }}>$200 / month credit — then the meter charges</div>
        </div>
      )}
      {/* the meter itself — turns on with the date, free bar draining */}
      {f > creditAt + 12 && (
        <Meter at={creditAt + 12} x={960} y={632} r={104} label="the meter" active drain={ramp(f, creditAt + 24, cardAt, 0.06, 0.97)} value={`$${(Math.max(0, f - creditAt - 24) * 0.021).toFixed(2)}`} />
      )}
      {f > cardAt && <Stamp at={cardAt} y={892} text="AND A VALID CARD ON FILE — NOW REQUIRED" kind="ink" size={34} />}
    </>
  );
};

// ═══ B06 — the bills arrived ═════════════════════════════════════════════
export const B06v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B06");
  return (
    <Beat id="B06" props={props} bed={false}>
      <B06Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B06Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const billAt = s(0.24);
  const shockAt = s(0.42);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 52, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: grow(f, 8) }}>
        The bills arrived the next month.
      </div>
      <DevDesk reveal={grow(f, 8)} shock={grow(f, shockAt, 16)} />
      {[0, 1, 2].map((i) => {
        const at = billAt + i * s(0.1);
        const t = spring({ frame: f - at, fps: 30, config: { damping: 14 }, durationInFrames: 22 });
        if (t <= 0.01) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 150 + i * 66, top: 120 + i * 46, width: 380 + i * 96, opacity: Math.min(1, t), transform: `translateY(${(1 - t) * -28}px) rotate(${-3 + i * 2.6}deg)`, filter: softShadow(1.1, 0.24) }}>
            <div style={{ background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 10, padding: "14px 22px" }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15, color: COLOR.grey, letterSpacing: "0.06em" }}>GOOGLE MAPS PLATFORM · INVOICE</div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50 + i * 18, color: i === 2 ? COLOR.orange : COLOR.ink }}>{["$0", "$1,240", "$12,900"][i]}</div>
            </div>
          </div>
        );
      })}
      {f > shockAt && <Stamp at={shockAt} x={1180} y={150} text="+1,000% OVERNIGHT" kind="orange" size={40} rot={-4} />}
    </>
  );
};

// ═══ B07 — what a look costs ═════════════════════════════════════════════
export const B07v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B07");
  return (
    <Beat id="B07" props={props} dots>
      <B07Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B07Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const tapAt = s(0.34);
  const receiptAt = s(0.82);
  const taps = Math.max(0, Math.floor((f - tapAt) / 20));
  return (
    <>
      <Head text="Here is what a single look costs today" />
      <HeroNum at={s(0.08)} value="$7" label="per 1,000 map loads" align="left" x={150} y={210} size={200} />
      <HeroNum at={s(0.2)} value="~$17" label="per 1,000 pin cards" align="left" x={150} y={470} size={150} />
      <PhoneMap at={s(0.1)} x={1330} y={132} w={410}>
        <div style={{ position: "absolute", left: "48%", top: "38%", transform: "translate(-50%,-100%)" }}><IconPin size={54} /></div>
        {f > tapAt && (
          <div style={{ position: "absolute", left: "7%", right: "7%", bottom: "7%", background: COLOR.cardWhite, border: `3px solid ${COLOR.ink}`, borderRadius: 12, padding: "12px 14px", fontFamily: SANS, fontWeight: 700, fontSize: 18 }}>
            Bru's Coffee · open till 8
            <div style={{ color: COLOR.orange, fontWeight: 800, marginTop: 4 }}>+ $0.017 · this tap</div>
          </div>
        )}
      </PhoneMap>
      {f > tapAt + 14 && (
        <div style={{ position: "absolute", left: 150, top: 720, fontFamily: SANS, fontWeight: 800, fontSize: 52, color: COLOR.ink }}>
          {taps} {taps === 1 ? "pin" : "pins"} tapped &nbsp;=&nbsp; <span style={{ color: COLOR.orange }}>${(taps * 0.017).toFixed(2)}</span> on someone's bill
        </div>
      )}
      {f > receiptAt && <Stamp at={receiptAt} y={904} text="YOU NEVER SEE THE RECEIPT" kind="orange" size={34} />}
    </>
  );
};

// ═══ B08 — Uber's filing ════════════════════════════════════════════════
export const B08v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B08");
  return (
    <Beat id="B08" props={props} dots>
      <B08Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B08Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const rows = [
    { at: s(0.14), text: "Google Maps is CRITICAL to the app" },
    { at: s(0.34), text: "no alternative can do the same job worldwide" },
    { at: s(0.56), text: "$58,000,000 paid to Google · 2016–2018", big: true },
  ];
  return (
    <>
      <Head text="One company put the dependency in writing" />
      <div style={{ position: "absolute", left: 360, top: 180, width: 1200, filter: softShadow(1.3, 0.24) }}>
        <div style={{ background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ background: COLOR.ink, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 26, padding: "18px 30px", letterSpacing: "0.08em" }}>UBER · FORM S-1 · RISK FACTORS</div>
          {rows.map((r, i) => {
            const t = grow(f, r.at);
            return (
              <div key={i} style={{ padding: "30px 30px", borderTop: `2px solid ${tint(COLOR.grey, 0.5)}`, opacity: Math.min(1, t) }}>
                <span style={{ fontFamily: SANS, fontWeight: r.big ? 800 : 600, fontSize: r.big ? 46 : 34, color: r.big ? COLOR.orange : COLOR.ink, background: `linear-gradient(90deg, ${tint(COLOR.orange, 0.72)} ${t * 100}%, transparent ${t * 100}%)` }}>{r.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      {f > s(0.76) && <Stamp at={s(0.76)} y={900} text="A COMPANY THAT SIZE — OVER A BARREL" kind="ink" size={34} />}
    </>
  );
};

// ═══ B09 — the ones who tried to leave ══════════════════════════════════
export const B09v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B09");
  return (
    <Beat id="B09" props={props} bed={false} dots>
      <B09Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B09Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const BASE = 812, fromX = 286;
  const leavers = [
    { at: s(0.06), sign: "UBER — $500M building its own", cost: "expensive", toX: 1560, tee: SUPPORT.clay, labelY: 244 },
    { at: s(0.24), sign: "FOURSQUARE + SNAP — moved to a rival", cost: "a migration", toX: 1080, tee: SUPPORT.teal, labelY: 340 },
    { at: s(0.42), sign: "SMALLER SHOPS — OpenStreetMap", cost: "slower, patchier", toX: 660, tee: SUPPORT.mustard, labelY: 436 },
  ];
  const walkDur = s(0.44);
  const powerAt = s(0.82);
  return (
    <>
      <Head text="So people tried to leave" />
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: grow(f, 10) }}>
        {/* the platform — a doorway on the left they walk out of */}
        <rect x={88} y={244} width={218} height={578} rx={6} fill={COLOR.ink} />
        <rect x={108} y={264} width={178} height={538} rx={4} fill={shade(SUPPORT.clay, 0.2)} />
        <rect x={100} y={528} width={196} height={30} fill={COLOR.paper} />
        <text x={197} y={222} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} fill={COLOR.ink}>THE PLATFORM</text>
        <line x1={0} y1={BASE + 6} x2={WIDTH} y2={BASE + 6} stroke={tint(COLOR.grey, 0.4)} strokeWidth={4} />
      </svg>
      {leavers.map((l, i) => {
        const go = ramp(f, l.at, l.at + s(0.16));
        if (go <= 0) return null;
        const t = ramp(f, l.at, l.at + walkDur);
        const x = fromX + t * (l.toX - fromX);
        const arrived = f > l.at + walkDur;
        return (
          <React.Fragment key={i}>
            <Walker at={l.at} dur={walkDur} fromX={fromX} toX={l.toX} baseline={BASE} h={252} tee={l.tee} />
            <div style={{ position: "absolute", left: Math.max(288, Math.min(x - 168, 1392)), top: l.labelY, width: 336, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22, color: COLOR.ink, background: COLOR.cardWhite, border: `3px solid ${COLOR.ink}`, borderRadius: 8, padding: "8px 12px", opacity: go, filter: softShadow(0.7, 0.16) }}>{l.sign}</div>
            {arrived && (
              <div style={{ position: "absolute", left: Math.max(300, Math.min(x - 90, 1520)), top: BASE - 250, width: 180, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 20, color: "#fff", background: COLOR.orange, borderRadius: 8, padding: "5px 8px", opacity: grow(f, l.at + walkDur) }}>{l.cost}</div>
            )}
          </React.Fragment>
        );
      })}
      {f > powerAt && <Stamp at={powerAt} y={912} text="LEAVING IS POSSIBLE — EXPENSIVE, SLOWER, OR A DOWNGRADE" kind="ink" size={26} />}
    </>
  );
};

// ═══ B10 — Overture ════════════════════════════════════════════════════
export const B10v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B10");
  return (
    <Beat id="B10" props={props} dots>
      <B10Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B10Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const names = ["AMAZON", "META", "MICROSOFT", "TOMTOM"];
  const joinAt = s(0.44);
  const join = ramp(f, joinAt, joinAt + s(0.1));
  const boxAt = joinAt + s(0.12);
  return (
    <>
      <Head text="Then the biggest companies stopped competing on maps" />
      {/* 4 names build in a clean 2×2, HOLD, then slide up into one row */}
      {names.map((n, i) => {
        const at = s(0.1) + i * 12;
        const gridX = [560, 1060, 560, 1060][i], gridY = [230, 230, 400, 400][i];
        const rowX = 340 + i * 320;
        const x = interpolate(join, [0, 1], [gridX, rowX]);
        const y = interpolate(join, [0, 1], [gridY, 210]);
        const t = spring({ frame: f - at, fps: 30, config: { damping: 13 }, durationInFrames: 22 });
        if (t <= 0.01) return null;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 300, textAlign: "center", opacity: Math.min(1, t) * (join > 0.6 ? 0.55 : 1), fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", background: COLOR.ink, borderRadius: 12, padding: "16px 8px" }}>{n}</div>;
      })}
      {f > boxAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: grow(f, boxAt) }}>
          <div style={{ display: "inline-block", background: tint(COLOR.orange, 0.3), border: `5px solid ${COLOR.orange}`, borderRadius: 18, padding: "40px 60px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: COLOR.ink }}>OVERTURE MAPS FOUNDATION</div>
            <div style={{ marginTop: 12, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: COLOR.grey }}>~60,000,000 places · 700,000,000+ building outlines · open</div>
          </div>
        </div>
      )}
      {f > s(0.78) && <Stamp at={s(0.78)} y={860} text="RIVALS TEAM UP TO ESCAPE YOUR METER — THE METER IS THE STORY" kind="ink" size={26} />}
    </>
  );
};

// ═══ B11 — the meter got precise, not gone ═════════════════════════════
export const B11v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B11");
  return (
    <Beat id="B11" props={props} bed={false} dots>
      <B11Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B11Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  return (
    <>
      <Head text="March 2025 — the meter got more precise, not gone" />
      <MeterRack at={s(0.08)} />
      {f > s(0.7) && <Stamp at={s(0.7)} y={806} text="IT LEARNED TO CHARGE FOR EVERY KIND OF LOOK, BY NAME" kind="orange" size={30} />}
    </>
  );
};

// ═══ B12 — mid-roll + L1→L2 handoff ═══════════════════════════════════
export const B12v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B12");
  return (
    <Beat id="B12" props={props} bed={false}>
      <B12Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B12Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const backAt = s(0.52);
  const t = spring({ frame: f - 8, fps: 30, config: { damping: 15 }, durationInFrames: 24 });
  const back = grow(f, backAt);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", opacity: Math.min(1, t) * (1 - back), transform: `scale(${0.9 + Math.min(1, t) * 0.1}) translateY(${-back * 160}px)` }}>
        <div style={{ display: "inline-block", background: COLOR.cardWhite, border: `6px solid ${COLOR.ink}`, borderRadius: 24, padding: "48px 90px", filter: softShadow(1.4, 0.24) }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.14em", color: COLOR.grey }}>NOTHING IS FREE</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 118, lineHeight: 1, color: COLOR.orange, margin: "10px 0" }}>SUBSCRIBE</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: COLOR.ink }}>we read you the meter on things that look free</div>
        </div>
      </div>
      {back > 0 && (
        <>
          <div style={{ position: "absolute", left: 340, top: 320, opacity: back * 0.45 }}>
            <Meter at={backAt} x={0} y={0} label="METER ONE" r={92} tone="paper" />
          </div>
          <Meter at={backAt} x={WIDTH / 2 + 140} y={460} label="METER TWO" r={150} active drain={0.45} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", opacity: back, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: COLOR.ink }}>
            The first meter was the apps, and it was the cheap one.
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 828, textAlign: "center", opacity: back, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: COLOR.orange }}>
            The second is the map as an ad — and it is bigger.
          </div>
        </>
      )}
    </>
  );
};

// ═══ B13 — the map is an ad · [dry] "sponsored" ═══════════════════════
export const B13v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B13");
  return (
    <Beat id="B13" props={props} dots>
      <B13Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B13Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const wordAt = s(0.68);
  return (
    <>
      <Head text="The pin on top is not the closest. It paid to be there." />
      <PhoneMap at={s(0.05)} x={520} y={150} w={410}>
        <div style={{ position: "absolute", left: "42%", top: "26%", transform: "translate(-50%,-100%)" }}><IconPin size={64} /></div>
        <div style={{ position: "absolute", left: "6%", right: "6%", top: "20%", height: 3, background: COLOR.orange, opacity: 0.5 }} />
      </PhoneMap>
      <Wire x1={725} y1={300} x2={1120} y2={430} on={s(0.3)} />
      <PinAuction at={s(0.32)} x={1400} y={440} slotLabel="THE PIN ON TOP" bids={[3, 9, 5]} />
      {f > wordAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", opacity: grow(f, wordAt) }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: ramp(f, wordAt, wordAt + 26, 30, 96), color: COLOR.grey, letterSpacing: "0.04em" }}>one small grey word: “Sponsored”</span>
        </div>
      )}
    </>
  );
};

// ═══ B14 — what the map earns ════════════════════════════════════════
export const B14v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B14");
  return (
    <Beat id="B14" props={props} dots>
      <B14Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B14Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const numAt = s(0.34);
  const v = ramp(f, numAt, numAt + 48, 0, 11);
  return (
    <>
      <Head text="Google does not publish what the map earns" />
      {f < numAt ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center" }}>
          <div style={{ display: "inline-block", background: COLOR.ink, borderRadius: 14, padding: "40px 130px", letterSpacing: "0.35em", fontFamily: SANS, fontWeight: 800, fontSize: 88, color: COLOR.ink }}>█████</div>
          <div style={{ marginTop: 20, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: COLOR.grey }}>so we have to use an outside estimate</div>
        </div>
      ) : (
        <>
          <Stamp at={numAt} y={230} text="MORGAN STANLEY ESTIMATE" kind="ink" size={28} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 320, lineHeight: 0.9, color: COLOR.orange }}>${v.toFixed(1)}B</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink }}>A YEAR IN MAP ADS · MOSTLY FROM PHONES</div>
          </div>
          {f > numAt + 26 && <Bloom window={[numAt + 26, numAt + 40, numAt + 96, numAt + 128]} radius={460} x="50%" y="46%" intensity={0.4} />}
        </>
      )}
    </>
  );
};

// ═══ B15 — the badge you pay for ════════════════════════════════════
export const B15v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B15");
  return (
    <Beat id="B15" props={props} dots>
      <B15Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B15Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const leadAt = s(0.4);
  return (
    <>
      <Head text="Plumber, locksmith, electrician — the green check is sold" />
      <div style={{ position: "absolute", left: 210, top: 210, width: 800 }}>
        {["A-1 Emergency Plumbing", "RapidFix Plumbers", "CityWide Drain Co."].map((r, i) => {
          const at = s(0.08) + i * 20;
          const t = grow(f, at);
          if (t <= 0) return null;
          const coinP = ((f - at) % 52) / 52;
          return (
            <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "22px 24px", marginBottom: 18, background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 12, opacity: t }}>
              <div style={{ width: 44 }}><IconBadge size={44} /></div>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.ink, flex: 1 }}>{r}</span>
              {f > leadAt && <div style={{ position: "absolute", right: -48, top: 20 + coinP * 28, width: 20, height: 20, borderRadius: "50%", background: COLOR.orange, opacity: 1 - coinP }} />}
            </div>
          );
        })}
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: COLOR.grey, marginTop: 6 }}>a phone call from you = a charge on their account</div>
      </div>
      <PinAuction at={s(0.44)} x={1430} y={430} slotLabel="POSITION ONE" bids={[8, 4, 12]} />
      {f > s(0.78) && <Stamp at={s(0.78)} y={904} text="THE ORDER IS AN AUCTION FOR YOUR EMERGENCY" kind="orange" size={32} />}
    </>
  );
};

// ═══ B16 — the booking button auction ══════════════════════════════
export const B16v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B16");
  return (
    <Beat id="B16" props={props} dots>
      <B16Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B16Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const tapAt = s(0.32);
  const press = f >= tapAt && f < tapAt + 9 ? 0.93 : 1;
  return (
    <>
      <Head text="Tap a hotel. The button that says “Book” is an auction too." />
      {/* Lucky, about to book */}
      <Figure pose="tap" hair="ponytail" tee={COLOR.orange} h={FIG.hero} x={296} baseline={806} facing={1} />
      <PhoneMap at={s(0.05)} x={598} y={158} w={346}>
        <div style={{ position: "absolute", left: "50%", top: "30%", transform: "translate(-50%,-100%)" }}><IconPin size={54} /></div>
        <div style={{ position: "absolute", left: "8%", right: "8%", bottom: "8%", background: COLOR.orange, color: "#fff", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22, borderRadius: 10, padding: "12px 0", transform: `scale(${press})` }}>BOOK</div>
        {f >= tapAt && f < tapAt + 18 && (
          <div style={{ position: "absolute", left: "50%", bottom: "6%", width: 110, height: 110, border: `4px solid ${COLOR.ink}`, borderRadius: "50%", transform: `translate(-50%,35%) scale(${ramp(f, tapAt, tapAt + 18, 0.25, 1.5)})`, opacity: ramp(f, tapAt, tapAt + 18, 0.85, 0) }} />
        )}
      </PhoneMap>
      <Wire x1={775} y1={560} x2={1150} y2={440} on={s(0.46)} />
      <PinAuction at={s(0.48)} x={1430} y={442} slotLabel="THE DEFAULT “BOOK”" bids={[6, 11, 9]} />
      {f > s(0.8) && <Stamp at={s(0.8)} y={904} text="NOT THE CHEAPEST ROOM — WHOEVER PAID MOST FOR THE SLOT" kind="ink" size={28} />}
    </>
  );
};

// ═══ B17 — a ranked list wearing a map ════════════════════════════
export const B17v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B17");
  return (
    <Beat id="B17" props={props} bed={false} dots>
      <B17Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B17Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const peelAt = s(0.22);
  const peeled = ramp(f, peelAt, peelAt + s(0.12), 0, 1);
  return (
    <>
      <Head text="It looks like a neutral picture. It is a ranked list." />
      {/* the list is underneath the whole time */}
      <RankedList at={peelAt + Math.round(d * 0.06)} rows={[{ label: "Bru's Coffee & Co.", paid: true }, { label: "Corner Roasters", paid: true }, { label: "The nearest one, actually" }, { label: "Bean There" }]} />
      {/* the map sticker peels up off the top to reveal it */}
      {peeled < 0.999 && (
        <div style={{ position: "absolute", left: 460, top: 300, width: 1000, height: 560, borderRadius: 20, overflow: "hidden", border: `5px solid ${COLOR.ink}`, transform: `perspective(1700px) rotateX(${peeled * -88}deg)`, transformOrigin: "top", filter: softShadow(1.4, 0.26) }}>
          <div style={{ position: "absolute", inset: 0, background: tint(SUPPORT.forest, 0.7) }} />
          {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: -20, right: -20, top: 70 + k * 120, height: 6, background: COLOR.grey, opacity: 0.4, transform: `rotate(${k % 2 ? 3 : -2}deg)` }} />)}
          <div style={{ position: "absolute", left: "44%", top: "44%", transform: "translate(-50%,-100%)" }}><IconPin size={56} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 24, color: COLOR.ink }}>a picture of where things are</div>
        </div>
      )}
      {f > s(0.78) && <Stamp at={s(0.78)} y={912} text="A DIRECTORY WOULD MAKE YOU SUSPICIOUS. A MAP DOES NOT." kind="ink" size={28} />}
    </>
  );
};

// ═══ B18 — the third meter is you · L2→L3 handoff ════════════════
export const B18v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B18");
  return (
    <Beat id="B18" props={props} bed={false}>
      <B18Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B18Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const walkAt = s(0.12);
  const parkAt = s(0.5);
  const BASE = 812, START = 240, PARK = 1150;
  const lx = interpolate(f, [walkAt, parkAt], [START, PARK], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const parked = f > parkAt;
  const chestY = BASE - 150;
  const node: [number, number] = [1560, 210];
  const fill = ramp(f, walkAt + 20, d - 40, 0, 1);
  return (
    <>
      <Head text="The third meter is you" />
      <MapField at={6} dim={0.4} />
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* the trail she leaves behind her as she moves */}
        {f > walkAt && <line x1={START} y1={BASE + 4} x2={lx} y2={BASE + 4} stroke={COLOR.orange} strokeWidth={6} strokeLinecap="round" strokeDasharray="3 14" strokeDashoffset={-(f * 1.2) % 120} />}
        {/* the pipe carrying her signal up to Google — dots stream non-stop */}
        {f > walkAt + 10 && (
          <>
            <path d={`M ${lx} ${chestY} C ${lx + 120} ${chestY - 180} ${node[0] - 220} ${node[1] + 220} ${node[0]} ${node[1] + 70}`} fill="none" stroke={tint(COLOR.grey, 0.35)} strokeWidth={10} strokeLinecap="round" />
            {Array.from({ length: 9 }).map((_, k) => {
              const p = (((f - walkAt) / 34 - k / 9) % 1 + 1) % 1;
              const bx = lx + (node[0] - lx) * p;
              const by = chestY + (node[1] + 70 - chestY) * p - Math.sin(p * Math.PI) * 150;
              return <circle key={k} cx={bx} cy={by} r={7} fill={SUPPORT.sky} opacity={0.9 - p * 0.5} />;
            })}
          </>
        )}
        {/* the Google receiver, filling */}
        {f > walkAt + 10 && (
          <g transform={`translate(${node[0]} ${node[1]})`}>
            <rect x={-150} y={-64} width={300} height={128} rx={14} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={5} />
            <rect x={-150} y={64 - 128 * fill} width={300} height={128 * fill} rx={0} fill={tint(COLOR.orange, 0.5)} />
            <text x={0} y={-4} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={COLOR.ink}>GOOGLE</text>
            <text x={0} y={34} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={18} fill={COLOR.grey}>the pooled live feed</text>
          </g>
        )}
        {/* parked — the pulse keeps going */}
        {parked && [0, 1, 2].map((k) => {
          const p = (((f - parkAt) - k * 14) % 42) / 42;
          if (p < 0) return null;
          return <circle key={`r${k}`} cx={lx} cy={chestY} r={20 + p * 74} fill="none" stroke={SUPPORT.sky} strokeWidth={3} opacity={(1 - p) * 0.7} />;
        })}
        <circle cx={lx} cy={chestY} r={9} fill={SUPPORT.sky} stroke={COLOR.ink} strokeWidth={3} opacity={f > walkAt ? 1 : 0} />
      </svg>
      <Walker at={walkAt} dur={parkAt - walkAt} fromX={START} toX={PARK} baseline={BASE} h={FIG.hero} tee={COLOR.orange} hair="ponytail" />
      {parked && <Stamp at={parkAt} y={906} text="THE SIGNAL DOES NOT STOP WHEN YOU PARK" kind="orange" size={32} />}
    </>
  );
};

// ═══ B19 — what the trail becomes ══════════════════════════════════
export const B19v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B19");
  return (
    <Beat id="B19" props={props} dots>
      <B19Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B19Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const chartAt = s(0.36);
  const bars = [0.28, 0.46, 0.64, 0.98, 0.6, 0.82]; // peak at the "6" column
  return (
    <>
      <Head text="The trail becomes a timeline — and everyone's little facts" />
      <div style={{ position: "absolute", left: 150, top: 280 }}><IconTimeline size={320} /></div>
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={600} y1={762} x2={1560} y2={762} stroke={COLOR.ink} strokeWidth={4} opacity={grow(f, chartAt)} />
        {bars.map((b, i) => {
          const h = b * 380 * grow(f, chartAt + i * 6);
          return <rect key={i} x={632 + i * 150} y={760 - h} width={110} height={h} fill={i === 3 ? COLOR.orange : tint(COLOR.grey, 0.35)} stroke={COLOR.ink} strokeWidth={4} />;
        })}
        {["12", "2", "4", "6", "8", "10"].map((lbl, i) => (
          <text key={i} x={687 + i * 150} y={796} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={22} fill={COLOR.grey} opacity={grow(f, chartAt + 20)}>{lbl}</text>
        ))}
        {f > chartAt && Array.from({ length: 22 }).map((_, i) => {
          const p = ((f - chartAt + i * 8) % 66) / 66;
          return <circle key={i} cx={1560 - p * 720} cy={340 + (i % 5) * 46} r={5} fill={SUPPORT.sky} opacity={1 - p} />;
        })}
      </svg>
      {f > chartAt + 30 && <Stamp at={chartAt + 30} x={620} y={806} text="“usually busy at 6” · “~20 min wait”" kind="ink" size={26} />}
      {f > s(0.8) && <Stamp at={s(0.8)} y={906} text="YOU ARE ONE OF THE SENSORS IT IS BUILT FROM" kind="orange" size={30} />}
    </>
  );
};

// ═══ B20 — the switch that did not switch it off ══════════════════
export const B20v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B20");
  return (
    <Beat id="B20" props={props} bed={false}>
      <B20Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B20Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const offAt = s(0.3);
  const secondAt = s(0.52);
  const on1 = f < offAt;
  return (
    <>
      <Head text="The Associated Press checked whether the off switch worked" />
      <MapField at={6} routeAt={20} routeDur={Math.round(d * 0.5)} progress={ramp(f, 20, d * 0.9, 0, 0.9)} trail dim={0.42} />
      <div style={{ position: "absolute", left: 220, top: 250, width: 900, background: COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 16, padding: "28px 34px", filter: softShadow(1.2, 0.22) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0" }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30 }}>Location History</span>
          <Toggle on={on1} />
        </div>
        <div style={{ fontFamily: SANS, fontSize: 20, color: COLOR.grey }}>{on1 ? "drawing your timeline" : "off — timeline stopped, tracking did not"}</div>
        {f > secondAt && (
          <div style={{ marginTop: 12, paddingTop: 18, borderTop: `2px solid ${tint(COLOR.grey, 0.5)}`, opacity: grow(f, secondAt) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26 }}>Web &amp; App Activity</span>
              <Toggle on />
            </div>
            <div style={{ fontFamily: SANS, fontSize: 20, color: COLOR.orange, fontWeight: 700 }}>still logging location · on by default</div>
          </div>
        )}
      </div>
      {f > s(0.78) && <Stamp at={s(0.78)} y={906} text="MOST PEOPLE HAD NO IDEA THE SECOND SWITCH EXISTED" kind="orange" size={30} />}
    </>
  );
};

// ═══ B21 — forty states ══════════════════════════════════════════
export const B21v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B21");
  return (
    <Beat id="B21" props={props} dots>
      <B21Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B21Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const numAt = s(0.34);
  const adsAt = s(0.62);
  const n = ramp(f, numAt, numAt + 48, 0, 391_500_000);
  return (
    <>
      <Head text="November 2022 · forty state attorneys general" />
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const t = grow(f, s(0.06) + i * 3);
          const x = 440 + (i % 10) * 110, y = 200 + Math.floor(i / 10) * 88;
          return <g key={i} opacity={t} transform={`translate(${x} ${y}) scale(${t})`}><path d="M 0 18 C -15 0 -15 -19 0 -19 C 15 -19 15 0 0 18 Z" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={3} /></g>;
        })}
      </svg>
      {f > numAt - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", opacity: grow(f, numAt - 8) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 150, lineHeight: 1, color: COLOR.orange }}>${Math.round(n).toLocaleString()}</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: COLOR.grey }}>the largest privacy settlement of its kind in U.S. history</div>
        </div>
      )}
      {f > adsAt && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: COLOR.ink, opacity: grow(f, adsAt) }}>
          said it would stop &nbsp;→&nbsp; kept tracking &nbsp;→&nbsp; to sell ads
        </div>
      )}
    </>
  );
};

// ═══ B22 — then California, again ═════════════════════════════════
export const B22v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B22");
  return (
    <Beat id="B22" props={props} dots>
      <B22Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B22Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const numAt = s(0.24);
  const gainAt = s(0.56);
  const n = ramp(f, numAt, numAt + 40, 0, 93_000_000);
  const total = 391_500_000 + Math.round(n);
  return (
    <>
      <Head text="September 2023 · then California settled the same case, alone" />
      {/* the first settlement, parked as reference so "again" is visible */}
      <div style={{ position: "absolute", left: 150, top: 210, width: 470, opacity: grow(f, 10) }}>
        <div style={{ background: COLOR.cardWhite, border: `3px solid ${COLOR.grey}`, borderRadius: 12, padding: "16px 22px", filter: softShadow(0.8, 0.16) }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: "0.04em", color: COLOR.grey }}>NOV 2022 · 40 STATES</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 42, color: COLOR.grey }}>$391,500,000</div>
        </div>
      </div>
      <HeroNum at={numAt} value={`$${Math.round(n).toLocaleString()}`} label="California — on its own" align="center" y={250} size={138} />
      {f > numAt + 4 && <Stamp at={numAt + 4} x={1500} y={196} text="STRIKE TWO" kind="orange" size={38} rot={-5} />}
      {f > gainAt && (
        <div style={{ position: "absolute", left: 240, right: 240, top: 536, background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 14, padding: "28px 36px", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: COLOR.ink, opacity: grow(f, gainAt), filter: softShadow(1, 0.2), overflow: "hidden" }}>
          “…telling users it would not track their location once they opted out, and doing the opposite, for its own <span style={{ color: COLOR.orange, fontWeight: 800 }}>commercial gain</span>.”
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 130, background: `linear-gradient(90deg, transparent, ${tint(COLOR.orange, 0.7)}, transparent)`, left: `${ramp((f - gainAt) % 108, 0, 108, -14, 110)}%`, opacity: 0.45 }} />
        </div>
      )}
      {f > gainAt + 28 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 754, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: COLOR.ink, opacity: grow(f, gainAt + 28) }}>
          two settlements, one finding &nbsp;·&nbsp; <span style={{ color: COLOR.orange }}>${total.toLocaleString()}</span>
        </div>
      )}
    </>
  );
};

// ═══ B23 — the party that asks a judge ═══════════════════════════
export const B23v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B23");
  return (
    <Beat id="B23" props={props} bed={false} dots>
      <B23Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B23Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const boxAt = s(0.12);
  const sweepAt = s(0.32);
  const climbAt = s(0.5);
  const oneAt = s(0.7);
  const moveAt = s(0.84);
  const yr = interpolate(f, [climbAt, climbAt + 18, climbAt + 42], [982, 982, 11554], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // once the count starts, the geofence box shrinks + parks top-left
  const bx = f > climbAt ? ramp(f, climbAt, climbAt + 20, 0, -486) : 0;
  const by = f > climbAt ? ramp(f, climbAt, climbAt + 20, 0, -232) : 0;
  const bs = f > climbAt ? ramp(f, climbAt, climbAt + 20, 1, 0.42) : 1;
  return (
    <>
      <Head text="One more party wants your trail. It asks a judge." />
      <MapField at={6} routeAt={20} routeDur={40} progress={0.85} trail dim={0.5} />
      {/* 1 — the geofence box drawn over the map */}
      {f > boxAt && (
        <div style={{ position: "absolute", left: 700, top: 316, width: 540, height: 300, border: `5px dashed ${COLOR.orange}`, borderRadius: 8, background: "rgba(226,77,40,0.08)", opacity: grow(f, boxAt), transform: `translate(${bx}px, ${by}px) scale(${bs})`, transformOrigin: "top left" }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const swept = f > sweepAt && ((f - sweepAt) % 66) / 66 > i / 10;
            return <div key={i} style={{ position: "absolute", left: 42 + (i % 5) * 100, top: 82 + Math.floor(i / 5) * 132, width: 14, height: 14, borderRadius: "50%", background: swept ? COLOR.ink : COLOR.orange, transform: `scale(${swept ? 1.4 : 1})` }} />;
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: -36, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 21, color: COLOR.orange, letterSpacing: "0.05em" }}>GEOFENCE WARRANT · “Sensorvault”</div>
        </div>
      )}
      {/* 2 — the warrant asks for everyone in the box */}
      {f > sweepAt && f < climbAt + 46 && <div style={{ position: "absolute", left: 1290, top: 348, opacity: grow(f, sweepAt) }}><IconWarrant size={150} /></div>}
      {/* 3 — the climb (box has parked) */}
      {f > climbAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 312, textAlign: "center", opacity: grow(f, climbAt) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 148, lineHeight: 1, color: COLOR.orange }}>{Math.round(yr).toLocaleString()}</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: COLOR.grey }}>geofence warrants a year &nbsp;·&nbsp; 2018 → 2020</div>
        </div>
      )}
      {/* 4 — one in four */}
      {f > oneAt && <Stamp at={oneAt} y={568} text="1 IN 4 LAW-ENFORCEMENT WARRANTS GOOGLE RECEIVED" kind="ink" size={26} />}
      {/* 5 — moved onto your phone, kept the feed */}
      {f > moveAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 672, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.ink, opacity: grow(f, moveAt) }}>
          2023 — moved onto your phone <span style={{ color: COLOR.grey, fontWeight: 700 }}>(can’t hand it over)</span> &nbsp;·&nbsp; <span style={{ color: COLOR.orange }}>kept the pooled feed</span>
        </div>
      )}
    </>
  );
};

// ═══ B24 — the loop that pays for itself ═════════════════════════
export const B24v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B24");
  return (
    <Beat id="B24" props={props} dots>
      <B24Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B24Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const flowAt = s(0.32);
  const workAt = s(0.66);
  const src: [number, number] = [960, 632];
  const mApps: [number, number] = [430, 306];
  const mBiz: [number, number] = [1490, 306];
  const N = 4;
  const stream = (to: [number, number], base: number) =>
    Array.from({ length: N }).map((_, k) => {
      if (f < flowAt) return null;
      const p = (((f - flowAt) / 44 - k / N) % 1 + 1) % 1;
      return { x: src[0] + (to[0] - src[0]) * p, y: src[1] + (to[1] - src[1]) * p, o: Math.sin(p * Math.PI), key: base + k };
    });
  return (
    <>
      <Head text="Here is where the three meters meet" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 26, color: COLOR.grey, opacity: grow(f, 12) }}>
        the free thing you do &nbsp;→&nbsp; powers the meter on the apps <span style={{ color: COLOR.ink }}>and</span> the meter on the businesses
      </div>
      <Meter at={s(0.08)} x={mApps[0]} y={mApps[1]} r={104} label="APPS" active drain={0.5} value={`$${((Math.max(0, f - s(0.08))) * 0.014).toFixed(2)}`} />
      <Meter at={s(0.16)} x={mBiz[0]} y={mBiz[1]} r={104} label="BUSINESSES" active drain={0.5} value={`$${((Math.max(0, f - s(0.16))) * 0.011).toFixed(2)}`} />
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`M ${src[0]} ${src[1]} L ${mApps[0]} ${mApps[1]} M ${src[0]} ${src[1]} L ${mBiz[0]} ${mBiz[1]}`} stroke={COLOR.grey} strokeWidth={3} strokeDasharray="2 12" fill="none" opacity={grow(f, s(0.04))} />
        {[...stream(mApps, 0), ...stream(mBiz, 100)].map((t) => t && <circle key={t.key} cx={t.x} cy={t.y} r={8} fill={COLOR.orange} opacity={t.o} />)}
        {f > workAt && <circle cx={src[0]} cy={src[1] - 30} r={ramp(f, workAt, workAt + 22, 0, 520)} fill="none" stroke={COLOR.orange} strokeWidth={6} opacity={ramp(f, workAt, workAt + 46, 0.6, 0)} />}
      </svg>
      {/* YOU — Lucky, walking around with the map open, for free */}
      <Figure pose="tap" hair="ponytail" tee={COLOR.orange} h={FIG.hero} x={src[0]} baseline={800} facing={1} expr={f > workAt ? EXPR.neutral : undefined} />
      <div style={{ position: "absolute", left: src[0] - 180, top: 810, width: 360, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#fff", background: COLOR.orange, borderRadius: 12, padding: "9px 8px", opacity: grow(f, s(0.04)) }}>YOU — walking around, free</div>
      {f > workAt && <Stamp at={workAt} y={904} text="YOU ARE THE REASON BOTH OF THEM WORK" kind="orange" size={34} />}
    </>
  );
};

// ═══ B25 — you became the measurement · Road → grid · L3→reversal ══
export const B25v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B25");
  return (
    <Beat id="B25" props={props} bed={false}>
      <B25Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B25Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const pullAt = s(0.3);
  const questionAt = s(0.76);
  // start close on ONE cell (zoom ~5.5), pull OUT to see the whole vast field (zoom 1)
  const zoom = ramp(f, pullAt, pullAt + s(0.4), 5.5, 1);
  const roadFade = ramp(f, pullAt, pullAt + 40, 1, 0);
  const COLS = 34, ROWS = 19, CW = 60, CH = 42, LIT = 11 * COLS + 17;
  return (
    <>
      {roadFade > 0.01 && (
        <div style={{ opacity: roadFade, position: "absolute", inset: 0 }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {/* a flat road strip she stands on */}
            <rect x={0} y={806} width={WIDTH} height={92} fill={shade(SUPPORT.clay, 0.42)} />
            <line x1={0} y1={852} x2={WIDTH} y2={852} stroke={COLOR.cardWhite} strokeWidth={5} strokeDasharray="52 44" strokeDashoffset={-(f * 5) % 96} opacity={0.7} />
            {/* the route she wants — dotted, toward home */}
            <line x1={880} y1={720} x2={1560} y2={720} stroke={SUPPORT.sky} strokeWidth={5} strokeDasharray="3 12" strokeDashoffset={-(f * 1.6) % 90} />
            <g transform="translate(1636 720)">
              <rect x={-32} y={-26} width={64} height={52} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={5} />
              <path d="M -42 -26 L 0 -64 L 42 -26 Z" fill={tint(COLOR.orange, 0.3)} stroke={COLOR.ink} strokeWidth={5} />
            </g>
            <text x={1636} y={772} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={22} fill={COLOR.grey}>home</text>
          </svg>
          <Figure pose="stand" hair="ponytail" tee={COLOR.orange} h={FIG.hero} x={760} baseline={804} facing={1} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 42, color: COLOR.ink }}>All you wanted was the fast way home.</div>
        </div>
      )}
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: 1 - roadFade }}>
        <g transform={`translate(${WIDTH / 2} 470) scale(${zoom}) translate(${-((LIT % COLS) * CW + CW / 2)} ${-(Math.floor(LIT / COLS) * CH + CH / 2)})`}>
          {Array.from({ length: COLS * ROWS }).map((_, i) => {
            const gx = (i % COLS) * CW, gy = Math.floor(i / COLS) * CH;
            const lit = i === LIT;
            return (
              <g key={i}>
                <rect x={gx + 3} y={gy + 3} width={CW - 6} height={CH - 6} rx={3} fill={lit ? tint(COLOR.orange, 0.22) : COLOR.cardWhite} stroke={lit ? COLOR.orange : tint(COLOR.grey, 0.5)} strokeWidth={lit ? 3 : 1} />
                <line x1={gx + 9} y1={gy + CH / 2} x2={gx + CW - 14} y2={gy + CH / 2} stroke={lit ? COLOR.orange : tint(COLOR.grey, 0.55)} strokeWidth={1.5} />
              </g>
            );
          })}
        </g>
      </svg>
      {f > pullAt + s(0.24) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink, opacity: grow(f, pullAt + s(0.24)) }}>
          one reading, among 2,000,000,000 &nbsp;·&nbsp; in a chart other people pay to see
        </div>
      )}
      {f > questionAt && <Stamp at={questionAt} y={912} text="IF YOU ARE THE ONE PAYING — WHY DOESN'T IT FEEL LIKE IT?" kind="orange" size={26} />}
    </>
  );
};

// ═══ B26 — the map you can't refuse ═════════════════════════════
export const B26v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B26");
  return (
    <Beat id="B26" props={props} dots>
      <B26Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B26Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const milesAt = s(0.32);
  const drive = grow(f, milesAt, 90);
  // a road that winds back and forth, filling the frame — the "10M miles" pile
  const rows = 7;
  const lanePath = (() => {
    let dd = "M 120 300 ";
    for (let r = 0; r < rows; r++) {
      const y = 300 + r * 68;
      if (r % 2 === 0) dd += `L 1800 ${y} Q 1860 ${y + 34} 1800 ${y + 68} `;
      else dd += `L 120 ${y} Q 60 ${y + 34} 120 ${y + 68} `;
    }
    return dd;
  })();
  const LEN = 14000;
  return (
    <>
      <HeroNum at={s(0.06)} value="2,000,000,000" label="people open this map every month" align="center" y={120} size={120} />
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={lanePath} fill="none" stroke={tint(COLOR.grey, 0.3)} strokeWidth={26} strokeLinecap="round" opacity={drive} />
        <path d={lanePath} fill="none" stroke={COLOR.orange} strokeWidth={26} strokeLinecap="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - drive)} />
        <path d={lanePath} fill="none" stroke={COLOR.paper} strokeWidth={3} strokeDasharray="16 18" strokeDashoffset={-(f * 6) % 68} opacity={drive * 0.7} />
      </svg>
      {f > milesAt + 14 && <Stamp at={milesAt + 14} y={846} text="10,000,000+ MILES OF STREET VIEW ALREADY DRIVEN" kind="ink" size={32} />}
      {f > s(0.8) && <Stamp at={s(0.8)} y={926} text="EVERYWHERE ELSE ALREADY RUNS ON THIS ONE" kind="orange" size={30} />}
    </>
  );
};

// ═══ B27 — the alternatives, honestly ══════════════════════════
export const B27v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B27");
  return (
    <Beat id="B27" props={props}>
      <B27Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B27Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const reflexAt = s(0.56);
  const draw = ramp(f, reflexAt, reflexAt + 22);
  return (
    <>
      <Head text="The alternatives are real. Reflex still points one way." />
      <ContenderPlates at={s(0.08)} pickAt={reflexAt} />
      {/* an app developer — the same size as the viewer — weighs them, and reflex pulls to Google */}
      {f > reflexAt - 26 && (
        <Figure pose="look" tee={SUPPORT.teal} h={FIG.adult} x={880} baseline={884} facing={1} />
      )}
      {f > reflexAt && (
        <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d="M 936 600 C 1110 486 1360 452 1548 452" fill="none" stroke={COLOR.orange} strokeWidth={5} strokeDasharray={900} strokeDashoffset={900 * (1 - draw)} />
          {draw > 0.9 && <path d="M 1548 452 l -34 -12 M 1548 452 l -28 18" fill="none" stroke={COLOR.orange} strokeWidth={5} strokeLinecap="round" />}
        </svg>
      )}
      {f > s(0.82) && <Stamp at={s(0.82)} y={912} text="REFLEX IS WHAT A STANDARD IS MADE OF" kind="ink" size={30} />}
    </>
  );
};

// ═══ B28 — when a map becomes the standard ═════════════════════
export const B28v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B28");
  return (
    <Beat id="B28" props={props} dots>
      <B28Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B28Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const layers = ["DIRECTIONS", "LISTINGS", "SITES", "APPS"];
  const dialAt = s(0.4);
  const moatAt = s(0.72);
  const turn = ((f - dialAt) * 3) % 360;
  const shift = f > dialAt ? Math.sin((f - dialAt) / 18) * 30 : 0;
  return (
    <>
      <Head text="One company's map becomes the layer everyone builds on" />
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {layers.map((l, i) => {
          const t = grow(f, s(0.06) + (layers.length - i) * 16);
          return (
            <g key={i} opacity={t} transform={`translate(${960 + shift * (i + 1) * 0.55} ${566 - i * 118})`}>
              <rect x={-340} y={-48} width={680} height={96} rx={10} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={4} />
              <text x={0} y={12} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={32} fill={COLOR.ink}>{l}</text>
            </g>
          );
        })}
        <g transform="translate(960 690)">
          <rect x={-380} y={-52} width={760} height={104} rx={10} fill={COLOR.ink} />
          <text x={-110} y={12} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={32} fill="#fff">GOOGLE MAP</text>
          <g transform={`translate(250 0) rotate(${turn})`}>
            <circle r={34} fill="none" stroke={COLOR.orange} strokeWidth={5} />
            <line x1={0} y1={0} x2={0} y2={-32} stroke={COLOR.orange} strokeWidth={5} />
          </g>
        </g>
      </svg>
      {f > moatAt && <Stamp at={moatAt} y={906} text="GIVING THE MAP AWAY FOR FREE IS HOW THE MOAT GOT DUG" kind="orange" size={30} />}
    </>
  );
};

// ═══ B29 — not a scam (counter-argument) ══════════════════════
export const B29v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B29");
  return (
    <Beat id="B29" props={props}>
      <B29Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B29Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const items = [
    { at: s(0.08), label: "the Street View fleet" },
    { at: s(0.22), label: "the correction pipeline" },
    { at: s(0.38), label: "live traffic, everywhere" },
  ];
  const narrowerAt = s(0.62);
  return (
    <>
      <Head text="This is not a scam. It is a genuine feat of engineering." />
      <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {items.map((it, i) => {
          const t = grow(f, it.at);
          if (t <= 0) return null;
          return (
            <div key={i} style={{ opacity: t, transform: `translateX(${(1 - t) * -30}px)`, background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 999, padding: "20px 46px", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: COLOR.ink }}>
              <span style={{ color: SUPPORT.forest }}>✓</span> {it.label}
            </div>
          );
        })}
      </div>
      {f > narrowerAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 42, color: COLOR.ink, opacity: grow(f, narrowerAt) }}>
          you would pay for it gladly. <span style={{ color: COLOR.orange, borderBottom: `5px solid ${COLOR.orange}` }}>you just never got to see any of it.</span>
        </div>
      )}
    </>
  );
};

// ═══ B30 — THE REVERSAL · GLIDE · Dark Law ════════════════════
export const B30v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B30");
  const d = props.durationInFrames;
  const darkAt = Math.min(vo.at("reading", Math.round(d * 0.52)), Math.round(d * 0.56));
  return (
    <Beat id="B30" props={props} bed={false} push={[1, 1]} darkLawAt={props.globalStartFrame + darkAt}>
      <B30Content vo={vo} d={d} darkAt={darkAt} />
    </Beat>
  );
};
const B30Content: React.FC<CProps & { darkAt: number }> = ({ vo, d, darkAt }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const dark = f >= darkAt;
  const showedAt = darkAt + Math.round(d * 0.24);
  const priced = Math.max(0, Math.floor((f - darkAt) / 7));
  const L = "#F6F2E7";
  return (
    <GlideScene push="in" spanFrames={Math.round(d * 0.9)} drift={1} tone={dark ? "ink" : "paper"} atmosphere={false}>
      <Layer plane="foreground">
        {!dark && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 78, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: COLOR.ink, opacity: grow(f, 8) }}>
              You were told the map was free. Three meters run behind it.
            </div>
            <ThreeMeters at={s(0.06)} mode="full" active={f > s(0.4) ? 2 : f > s(0.26) ? 1 : 0} />
            {f > s(0.42) && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: COLOR.grey, opacity: grow(f, s(0.42)) }}>
                not <span style={{ textDecoration: "line-through" }}>the customer</span> &nbsp;·&nbsp; not quite <span style={{ textDecoration: "line-through" }}>the product</span>
              </div>
            )}
          </>
        )}
        {dark && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 92, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: "0.16em", color: "#8a857c", opacity: grow(f, darkAt + 8) }}>YOU ARE THE READING ON THE METER</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: grow(f, darkAt + 14) }}>
              <div style={{ display: "inline-block", border: `7px solid ${L}`, borderRadius: 18, padding: "36px 96px", fontFamily: SANS, fontWeight: 800, fontSize: 220, lineHeight: 1, color: COLOR.orange, letterSpacing: "0.06em" }}>
                {(priced % 1000).toString().padStart(3, "0")}
              </div>
              <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#8a857c" }}>the number in the window</div>
            </div>
            <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: grow(f, darkAt + 34) }}>
              <line x1={700} y1={470} x2={430} y2={680} stroke={L} strokeWidth={3} strokeDasharray="2 10" strokeDashoffset={-(f * 1.4) % 120} />
              <line x1={1220} y1={470} x2={1490} y2={680} stroke={L} strokeWidth={3} strokeDasharray="2 10" strokeDashoffset={-(f * 1.4) % 120} />
            </svg>
            {([["what the APP is charged", 430], ["what the ADVERTISER pays", 1490]] as [string, number][]).map(([l, x], i) => (
              <div key={i} style={{ position: "absolute", left: x - 190, top: 680, width: 380, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: L, border: `3px solid ${L}`, borderRadius: 12, padding: "18px 8px", opacity: grow(f, darkAt + 40) }}>
                {l}<div style={{ color: COLOR.orange, fontSize: 38, marginTop: 6 }}>${(((priced % 1000) * (i ? 0.9 : 0.6)) / 100).toFixed(2)}</div>
              </div>
            ))}
            {f > showedAt && (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: L, opacity: grow(f, showedAt) }}>
                and nobody ever showed you the window.
              </div>
            )}
          </>
        )}
      </Layer>
    </GlideScene>
  );
};

// ═══ B31 — same shape, different company (dark) ═══════════════
export const B31v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B31");
  return (
    <Beat id="B31" props={props} bed={false} darkLawAt={props.globalStartFrame - 30}>
      <B31Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B31Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const bothAt = s(0.62);
  const L = "#F6F2E7";
  const rows = [
    { d: "M 0 -46 A 46 46 0 1 0 0 46 A 46 46 0 1 0 0 -46", label: "an auction — Ep 2", y: 280, past: true },
    { d: "M -40 46 L -14 -56 L 14 -56 L 40 46 Z", label: "a broadcast tower — Ep 3", y: 500, past: true },
    { d: "M 0 54 C -40 0 -40 -54 0 -54 C 40 -54 40 0 0 54 Z", label: "a map pin — this one", y: 720, past: false },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: L, opacity: grow(f, 8) }}>The same shape as the last two times</div>
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {rows.map((g, i) => {
          const t = grow(f, s(0.1) + i * 16);
          const dim = g.past ? ramp(f, bothAt, bothAt + 30, 1, 0.28) : 1;
          const fire = !g.past && f > bothAt ? 0.4 + 0.6 * Math.abs(Math.sin((f - bothAt) / 8)) : 0.55;
          const arrowCol = g.past ? "#8a857c" : COLOR.orange;
          return (
            <g key={i} opacity={t * dim} transform={`translate(960 ${g.y})`}>
              <path d={g.d} fill={g.past ? "none" : COLOR.orange} stroke={L} strokeWidth={6} />
              <path d="M -360 0 L -110 0 M -140 -18 L -110 0 L -140 18" fill="none" stroke={arrowCol} strokeWidth={4} opacity={g.past ? 1 : fire} />
              <path d="M 360 0 L 110 0 M 140 -18 L 110 0 L 140 18" fill="none" stroke={arrowCol} strokeWidth={4} opacity={g.past ? 1 : fire} />
              <text x={-390} y={7} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={26} fill={g.past ? "#8a857c" : L}>YOU</text>
              <text x={390} y={7} fontFamily={SANS} fontWeight={800} fontSize={26} fill={g.past ? "#8a857c" : L}>the simple thing</text>
              <text x={0} y={104} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={22} fill={g.past ? "#8a857c" : L}>{g.label}</text>
            </g>
          );
        })}
      </svg>
      {f > bothAt && <Stamp at={bothAt} y={936} text="IT CHARGES BOTH SIDES OF THE GLASS AT ONCE" kind="orange" size={30} />}
    </>
  );
};

// ═══ B32 — the bridge to Ep5 (dark) ═════════════════════════════
export const B32v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B32");
  return (
    <Beat id="B32" props={props} bed={false} darkLawAt={props.globalStartFrame - 30}>
      <B32Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B32Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const drawAt = s(0.34);
  const meterAt = s(0.7);
  const draw = ramp(f, drawAt, drawAt + 28);
  const pulse = f > drawAt + 28 ? 1 + Math.sin((f - drawAt) / 11) * 0.06 : 1;
  const L = "#F6F2E7";
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 42, color: L, opacity: grow(f, 8) }}>Next time — the game on your phone</div>
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <rect x={740} y={260} width={440} height={540} rx={48} fill="none" stroke={L} strokeWidth={6} opacity={grow(f, s(0.14))} />
        <g transform={`translate(960 470) scale(${pulse * 2.4})`}>
          <path
            d="M -60 -14 Q -82 -14 -86 18 Q -90 46 -64 46 Q -46 46 -38 28 L 38 28 Q 46 46 64 46 Q 90 46 86 18 Q 82 -14 60 -14 Z"
            fill={draw > 0.99 ? COLOR.orange : "none"} stroke={L} strokeWidth={4}
            strokeDasharray={430} strokeDashoffset={430 * (1 - draw)}
          />
          {draw > 0.99 && <><circle cx={-52} cy={12} r={5} fill={COLOR.ink} /><circle cx={-34} cy={0} r={5} fill={COLOR.ink} /><rect x={36} y={-4} width={11} height={11} fill={COLOR.ink} /><rect x={52} y={12} width={11} height={11} fill={COLOR.ink} /></>}
        </g>
      </svg>
      {f > meterAt && <Stamp at={meterAt} y={880} text="SAME CHANNEL, SAME QUESTION — WE READ THAT METER TOO" kind="ink" size={28} />}
    </>
  );
};

// ═══ B33 — the signature returns + CTA (dark → paper on the last line) ═══
export const B33v4: React.FC<BeatProps> = (props) => {
  const vo = useVO("B33");
  return (
    <Beat id="B33" props={props} bed={false} darkLawAt={props.globalStartFrame - 30}>
      <B33Content vo={vo} d={props.durationInFrames} />
    </Beat>
  );
};
const B33Content: React.FC<CProps> = ({ vo, d }) => {
  const f = useCurrentFrame();
  const s = sched(d);
  const backAt = s(0.6);
  const toPaper = ramp(f, backAt, backAt + 30);
  const onPaper = toPaper > 0.5;
  const ink = "#111111";
  const cream = "#F6F2E7";
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: cream, opacity: toPaper, pointerEvents: "none" }} />
      {f > s(0.04) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", opacity: grow(f, s(0.04)) }}>
          <div style={{ display: "inline-block", border: `5px solid ${onPaper ? ink : cream}`, borderRadius: 20, padding: "40px 72px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: "0.2em", color: onPaper ? COLOR.grey : "#8a857c" }}>NOTHING IS FREE</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.12, color: onPaper ? ink : cream, marginTop: 16 }}>
              you paid in a currency<br />you can't see on a statement
            </div>
          </div>
        </div>
      )}
      {onPaper && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 32, color: ink, opacity: grow(f, backAt + 22) }}>
          open your own Timeline. scroll back.<br />tell me in the comments where it starts.
        </div>
      )}
    </>
  );
};

export const V4_BEATS_NIF004 = {
  B00v4, B01v4, B02v4, B03v4, B04v4, B05v4, B06v4, B07v4, B08v4, B09v4, B10v4,
  B11v4, B12v4, B13v4, B14v4, B15v4, B16v4, B17v4, B18v4, B19v4, B20v4, B21v4,
  B22v4, B23v4, B24v4, B25v4, B26v4, B27v4, B28v4, B29v4, B30v4, B31v4, B32v4, B33v4,
} as const;
