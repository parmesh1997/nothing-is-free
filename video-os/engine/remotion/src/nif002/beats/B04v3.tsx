import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Lucky } from "../../characters";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { useBeatTiming } from "../timing";
import { V3Beat } from "../v3/V3Beat";
import { Room, Desk, Plant, ROOM_FLOOR_Y } from "../v3/sets";
import { useStage3, bump } from "../v3/stage3";
import { V3, dk } from "../v3/palette";

/**
 * NIF002 B04 — v3. Lucky at her desk opens the app. A REQUEST card rises out of
 * the phone and assembles itself, one field per VO clause (device ID, rough
 * location, phone model, carrier, app, time of day, + what the ad code knows).
 * A ghost setup screen shows the box already ticked. "The packet is the thing
 * being sold. Not the screen. You." Peak: "You."
 */
export const B04v3: React.FC<BeatProps> = (props) => {
  const dur = props.durationInFrames;
  const vo = useBeatTiming("B04");
  const F = {
    open: vo.at("tap", 20),
    build: vo.at("builds", 150),
    route: vo.at("exchange", 300),
    id: vo.at("advertising", 470),
    loc: vo.at("location", 560),
    model: vo.at("model", 620),
    carrier: vo.at("carrier", 665),
    app: vo.at("opened", 720),
    time: vo.at("time", 810),
    knows: vo.at("knows", 880),
    ghost: vo.at("agreed", 945),
    check: vo.at("setup", 1039),
    peak: vo.at("packet", 1108),
    you: vo.at("sold", 1186) + 100,
  };
  return (
    <V3Beat
      props={props}
      beat="B04"
      source="Bidstream contents — US Senate (Wyden) 2021; FTC data-broker complaints"
      set={<Room tone="#96835f" floorTone="#7a6a52" decor="window" />}
      cam={[
        { at: 0, zoom: 1.0, y: 6 },
        { at: F.build, zoom: 1.05, y: 0 },
        { at: F.peak, zoom: 1.12, y: -4 },
        { at: dur, zoom: 1.16, y: -6 },
      ]}
    >
      <Content dur={dur} F={F} />
    </V3Beat>
  );
};

type Row = { k: keyof B04F; label: string; value: string };
type B04F = { id: number; loc: number; model: number; carrier: number; app: number; time: number; knows: number };
const ROWS: Row[] = [
  { k: "id", label: "DEVICE ADVERTISING ID", value: "a1f9-4e02-b1c8-c2b7" },
  { k: "loc", label: "ROUGH LOCATION", value: "37.77, -122.41" },
  { k: "model", label: "PHONE MODEL", value: "iPhone · iOS 17" },
  { k: "carrier", label: "CARRIER", value: "major US network" },
  { k: "app", label: "APP JUST OPENED", value: "the word game" },
  { k: "time", label: "TIME OF DAY", value: "08:41 local" },
  { k: "knows", label: "+ WHAT THE AD CODE ALREADY KNOWS", value: "……………………" },
];

const Content: React.FC<{ dur: number; F: Record<string, number> }> = ({ dur, F }) => {
  const frame = useCurrentFrame();
  const s = useStage3(dur, { disperseFrames: 30, holdFrames: 14 });

  const floorY = ROOM_FLOOR_Y;
  const deskY = floorY + 210;
  const luckyH = Math.round(HEIGHT * 0.42);
  const luckyX = WIDTH * 0.16;
  const luckyBaseline = HEIGHT * 0.94;
  const phoneX = luckyX + luckyH * 0.24;
  const phoneY = luckyBaseline - luckyH * 0.55;

  const cardX = WIDTH * 0.42;
  const cardY = HEIGHT * 0.1;
  const cardW = 780;
  const cardH = 560;
  const cardUp = springIn({ frame, fps: 30, delay: F.build, durationInFrames: 20 });
  const rise = interpolate(Math.min(1, cardUp), [0, 1], [phoneY - cardY - 40, 0]);

  const dim = interpolate(frame, [F.peak, F.peak + 26], [1, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  return (
    <>
      {/* desk + plant (behind Lucky) */}
      <Desk x={WIDTH * 0.34} y={deskY} w={520} tone="#5c4f3d" />
      <Plant x={WIDTH * 0.92} y={floorY + 250} s={1.3} />

      {/* Lucky standing on the floor, holding her phone */}
      <Lucky pose="showPhone" expression={frame >= F.peak ? "worried" : "curious"} facing={1} height={luckyH} centerX={luckyX} baseline={luckyBaseline} cycleSeconds={3} phoneScreen={V3.accent} />

      {/* connector: phone → card */}
      {cardUp > 0.05 && frame < F.peak && (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={`M ${phoneX} ${phoneY} C ${phoneX} ${phoneY - 120}, ${cardX - 40} ${cardY + rise + cardH * 0.5}, ${cardX} ${cardY + rise + cardH * 0.5}`} fill="none" stroke={V3.accent} strokeWidth={2.5} strokeDasharray="6 8" opacity={0.55} />
        </svg>
      )}

      {/* ── ghost setup screen behind the card ── */}
      {frame >= F.ghost - 8 && frame < F.peak && (
        <div style={{ position: "absolute", left: cardX + cardW - 150, top: cardY + rise + 40, width: 360, background: dk("#8b7a63", 0.12), border: `2px dashed ${V3.muted}`, padding: 20, fontFamily: FONT.mono, fontSize: 15, color: V3.paperLight, opacity: interpolate(frame, [F.ghost, F.ghost + 16], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          SETUP · STEP 3 / 3
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 22, height: 22, border: `2px solid ${COLOR.cardWhite}`, background: frame >= F.check ? V3.accent : "transparent", color: COLOR.cardWhite, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>{frame >= F.check ? "✓" : ""}</div>
            <span>Allow personalised ads</span>
          </div>
          {frame >= F.check + 10 && <div style={{ marginTop: 12, color: V3.muted }}>— you tapped past this</div>}
        </div>
      )}

      {/* ── the REQUEST card ── */}
      {cardUp > 0.02 && frame < s.disperseAt + 6 && (
        <div style={{ position: "absolute", left: cardX, top: cardY + rise, width: cardW, height: cardH, background: COLOR.cardWhite, border: `3px solid ${V3.ink}`, opacity: Math.min(1, cardUp) * s.body(frame), scale: String(bump(frame, F.peak + 4, 0.03, 24)), boxShadow: "0 18px 50px rgba(0,0,0,0.4)" }}>
          <div style={{ height: 58, background: V3.ink, color: COLOR.cardWhite, fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.1em", display: "flex", alignItems: "center", padding: "0 26px" }}>
            BID REQUEST → AD EXCHANGE
          </div>
          {frame < F.id && (
            <div style={{ padding: "24px 26px", fontFamily: FONT.mono, fontSize: 20, color: V3.muted }}>compiling a description of you…</div>
          )}
          <div style={{ opacity: dim }}>
            {ROWS.map((r, i) => {
              const at = F[r.k];
              const on = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
              if (on <= 0.01) return null;
              const chars = Math.max(0, Math.floor(((frame - at - 4) / 26) * 34));
              return (
                <div key={i} style={{ position: "absolute", left: 26, top: 58 + 26 + i * ((cardH - 58 - 44) / ROWS.length), opacity: Math.min(1, on), translate: `${(1 - Math.min(1, on)) * -14}px 0px` }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.08em", color: V3.muted }}>{r.label}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 25, fontWeight: 500, color: V3.ink, marginTop: 2 }}>
                    {r.value.slice(0, Math.min(r.value.length, chars))}
                    {chars < r.value.length && <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }}>▍</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Bloom window={[F.you - 4, F.you + 10, F.you + 46, F.you + 74]} radius={280} x="52%" y="46%" intensity={0.8} />

      {/* ── peak line ── */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.78, textAlign: "center", opacity: interpolate(frame, [F.peak, F.peak + 12, dur - 20, dur - 5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: FONT.hero, fontSize: 56, color: COLOR.cardWhite, letterSpacing: "0.02em", textShadow: "0 5px 20px rgba(0,0,0,0.6)" }}>THE PACKET IS THE THING BEING SOLD. NOT THE SCREEN. </span>
          <span style={{ fontFamily: FONT.hero, fontSize: 56, color: V3.accent, letterSpacing: "0.02em", display: "inline-block", scale: String(bump(frame, F.you, 0.16, 20)) }}>YOU.</span>
        </div>
      )}
    </>
  );
};
