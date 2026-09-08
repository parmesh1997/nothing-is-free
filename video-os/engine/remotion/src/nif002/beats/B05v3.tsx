import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Lucky } from "../../characters";
import { Bloom } from "../../parts/Bloom";
import { springIn } from "../../parts/motion";
import { useBeatTiming } from "../timing";
import { V3Beat } from "../v3/V3Beat";
import { Room, Desk, Shelf, Plant, ROOM_FLOOR_Y } from "../v3/sets";
import { useStage3, bump } from "../v3/stage3";
import { V3, dk, lt } from "../v3/palette";

/**
 * NIF002 B05 — v3. The kits, in the studio. The word-game on the monitor; the
 * developer drops ~10 ad-company "kits" into it; they ride into a wall of other
 * apps; what a kit learns Monday it uses Thursday. "You installed one app — and
 * a piece of 10 advertising companies." Peak: "ten advertising companies".
 */
const TAGS = ["AX", "MB", "PN", "VG", "IK", "Q2", "LM", "RS", "TD", "WZ"];

export const B05v3: React.FC<BeatProps> = (props) => {
  const dur = props.durationInFrames;
  const vo = useBeatTiming("B05");
  const F = {
    q: vo.at("age", 89),
    borrow: vo.at("borrow", 230),
    drop: vo.at("drop", 332),
    ten: vo.at("ten", 650),
    dozen: vo.at("dozen", 817),
    rides: vo.at("thousands", 1012),
    monthu: vo.at("monday", 1121),
    oneapp: vo.at("installed", 1294),
    peak: vo.at("companies", 1419),
  };
  return (
    <V3Beat
      props={props}
      beat="B05"
      source="Third-party tracking research — Binns et al. 2018; Exodus Privacy"
      set={<Room tone="#6E7C85" floorTone="#6b5f4d" decor="screens" />}
      cam={[
        { at: 0, zoom: 1.02, y: 6 },
        { at: F.drop, zoom: 1.0, y: -2 },
        { at: F.rides, zoom: 1.06, y: 4 },
        { at: F.oneapp, zoom: 1.12, y: 10 },
        { at: dur, zoom: 1.16, y: 12 },
      ]}
    >
      <Content dur={dur} F={F} />
    </V3Beat>
  );
};

const Content: React.FC<{ dur: number; F: Record<string, number> }> = ({ dur, F }) => {
  const frame = useCurrentFrame();
  const s = useStage3(dur, { disperseFrames: 32, holdFrames: 14 });

  const floorY = ROOM_FLOOR_Y;
  const deskY = floorY + 250;
  const devH = Math.round(HEIGHT * 0.4);
  const devX = WIDTH * 0.13;

  // the word-game app — a big icon floating in the room
  const appX = WIDTH * 0.34;
  const appY = HEIGHT * 0.44;
  const appR = 84;

  const kitCount = Math.max(0, Math.min(10, Math.floor((frame - F.drop) / 26) + 1));
  const extra = Math.max(0, Math.min(14, Math.floor((frame - F.dozen) / 12)));

  return (
    <>
      {/* studio (behind Lucky) */}
      <Shelf x={WIDTH * 0.92} y={floorY + 30} w={220} h={340} tone="#5a5043" />
      <Plant x={WIDTH * 0.05} y={floorY + 250} s={1.4} />
      <Lucky pose="typing" expression="neutral" faceless facing={1} height={devH} centerX={devX} baseline={deskY + 90} cycleSeconds={0.7} />
      <Desk x={devX + 60} y={deskY} w={520} tone="#5c4f3d" />

      {/* the word-game app — a big icon in the room */}
      <div style={{ position: "absolute", left: appX - appR, top: appY - appR, width: appR * 2, height: appR * 2, background: V3.accent, borderRadius: 28, border: `4px solid ${V3.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.hero, fontSize: 90, color: COLOR.cardWhite, boxShadow: "0 16px 44px rgba(0,0,0,0.4)", scale: String(frame >= F.peak - 6 ? bump(frame, F.peak, 0.06, 20) : 1) }}>A</div>
      <div style={{ position: "absolute", left: appX - 90, top: appY + appR + 12, width: 180, textAlign: "center", fontFamily: FONT.mono, fontSize: 16, color: V3.paperLight }}>a free word game</div>

      {/* the "?" — how does it know your age */}
      {frame >= F.q && frame < F.borrow + 20 && (
        <div style={{ position: "absolute", left: appX - 26, top: appY - appR - 110, fontFamily: FONT.hero, fontSize: 92, color: COLOR.cardWhite, opacity: interpolate(frame, [F.q, F.q + 12, F.borrow, F.borrow + 18], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>?</div>
      )}
      {frame >= F.borrow - 4 && frame < F.drop + 60 && (
        <div style={{ position: "absolute", left: WIDTH * 0.5, top: HEIGHT * 0.14, width: WIDTH * 0.44, fontFamily: FONT.sans, fontWeight: 600, fontSize: 34, color: COLOR.cardWhite, textShadow: "0 3px 14px rgba(0,0,0,0.5)", opacity: interpolate(frame, [F.borrow, F.borrow + 12, F.drop + 40, F.drop + 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          it doesn&apos;t know your age. it <span style={{ color: V3.accent }}>borrows</span> it.
        </div>
      )}

      {/* ── kits fly in and dock around the app ── */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {Array.from({ length: kitCount + extra }).map((_, i) => {
          const ex = i >= kitCount;
          const at = ex ? F.dozen + (i - kitCount) * 12 : F.drop + i * 26;
          const inn = springIn({ frame, fps: 30, delay: at, durationInFrames: 16 });
          if (inn <= 0.02) return null;
          const t = Math.min(1, inn);
          const total = kitCount + extra;
          const ang = -104 + (i / Math.max(1, total - 1)) * 208;
          const rad = (ang * Math.PI) / 180;
          const restR = ex ? appR + 130 : appR + 62;
          const rx = appX + Math.cos(rad) * restR;
          const ry = appY + Math.sin(rad) * restR;
          const x = interpolate(t, [0, 1], [WIDTH + 140, rx]);
          const cw = ex ? 46 : 76;
          return (
            <g key={i} transform={`translate(${x} ${ry})`} opacity={s.body(frame) * (ex ? 0.85 : 1)}>
              <rect x={-cw / 2} y={-cw * 0.34} width={cw} height={cw * 0.68} rx={6} fill={[V3.accentDim, V3.ink, dk(V3.bldgC, 0.05)][i % 3]} stroke={V3.ink} strokeWidth={2.5} />
              {!ex && <text x={0} y={5} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={COLOR.cardWhite}>{TAGS[i]}</text>}
            </g>
          );
        })}
      </svg>

      {frame >= F.drop && frame < F.rides && (
        <div style={{ position: "absolute", left: WIDTH * 0.6, top: HEIGHT * 0.34, width: WIDTH * 0.32, fontFamily: FONT.mono, fontSize: 22, color: COLOR.cardWhite, opacity: interpolate(frame, [F.drop, F.drop + 12, F.rides - 16, F.rides], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          AD KITS IN THIS APP:{" "}
          <span style={{ color: V3.accent, fontFamily: FONT.hero, fontSize: 48 }}>{kitCount}{extra ? `+${extra}` : ""}</span>
          {frame >= F.ten && frame < F.dozen && <div style={{ fontSize: 16, color: V3.muted, marginTop: 4 }}>≈ the typical free app</div>}
          {frame >= F.dozen && <div style={{ fontSize: 16, color: V3.muted, marginTop: 4 }}>a news / weather app: two or three dozen</div>}
        </div>
      )}

      {/* ── the wall of other apps + MON→THU ── */}
      {frame >= F.rides - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.52, top: HEIGHT * 0.3, opacity: interpolate(frame, [F.rides, F.rides + 16, F.oneapp - 20, F.oneapp], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ display: "flex", gap: 16 }}>
            {["shopping", "map", "news", "game"].map((a, i) => (
              <div key={i} style={{ width: 110, height: 110, background: lt(V3.bldgB, 0.06), border: `3px solid ${V3.ink}`, borderRadius: 12, position: "relative" }}>
                {frame >= F.rides + 20 + i * 8 && <div style={{ position: "absolute", right: -12, top: 40, width: 34, height: 22, background: V3.accentDim, border: `2px solid ${V3.ink}` }} />}
                <div style={{ position: "absolute", left: 0, right: 0, bottom: -22, textAlign: "center", fontFamily: FONT.mono, fontSize: 13, color: V3.paperLight }}>{a}</div>
              </div>
            ))}
          </div>
          {frame >= F.monthu && (
            <div style={{ marginTop: 40, fontFamily: FONT.mono, fontSize: 20, color: COLOR.cardWhite }}>
              learned <span style={{ color: V3.accent }}>Monday</span> · used <span style={{ color: V3.accent }}>Thursday</span>
            </div>
          )}
        </div>
      )}

      <Bloom window={[F.peak + 6, F.peak + 20, dur - 30, dur - 12]} radius={240} x="50%" y="20%" intensity={0.6} />

      {/* ── peak ── */}
      {frame >= F.oneapp - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.12, textAlign: "center", opacity: interpolate(frame, [F.oneapp, F.oneapp + 12, dur - 20, dur - 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 68, color: COLOR.cardWhite, letterSpacing: "0.02em", textShadow: "0 5px 20px rgba(0,0,0,0.6)", scale: String(bump(frame, F.oneapp + 4, 0.05, 18)) }}>YOU INSTALLED ONE APP.</div>
          {frame >= F.peak - 6 && (
            <div style={{ fontFamily: FONT.hero, fontSize: 68, color: V3.accent, letterSpacing: "0.02em", opacity: interpolate(frame, [F.peak - 6, F.peak + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: String(bump(frame, F.peak, 0.06, 20)) }}>
              AND A PIECE OF TEN AD COMPANIES.
            </div>
          )}
        </div>
      )}
    </>
  );
};
