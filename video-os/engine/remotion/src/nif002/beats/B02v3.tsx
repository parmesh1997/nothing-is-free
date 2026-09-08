import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Lucky } from "../../characters";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { useBeatTiming } from "../timing";
import { V3Beat } from "../v3/V3Beat";
import { Room, Desk, Monitor, Plant, Shelf, ROOM_FLOOR_Y } from "../v3/sets";
import { useStage3 } from "../v3/stage3";
import { V3 } from "../v3/palette";

/**
 * NIF002 B02 — v3. The honest part, in a two-person game studio. The 97% grid
 * fills a board on the wall; the developer at the desk isn't the villain — they
 * picked the only model that pays the rent. "I used these apps all day, didn't
 * click one ad, every one still made money off me."
 */
export const B02v3: React.FC<BeatProps> = (props) => {
  const dur = props.durationInFrames;
  const vo = useBeatTiming("B02");
  const F = {
    honest: vo.at("honest", 8),
    grid: vo.at("97", 175),
    nopay: vo.at("nobody", 340),
    villain: vo.at("villain", 500),
    rent: vo.at("rent", 640),
    used: vo.at("used", 770),
    money: vo.at("money", 1078),
  };
  return (
    <V3Beat
      props={props}
      beat="B02"
      source="Statista / Google Play app distribution, 2024"
      set={<Room tone="#7C8B7A" floorTone="#6b5f4d" decor="blinds" />}
      cam={[
        { at: 0, zoom: 1.03, y: 6 },
        { at: F.grid, zoom: 1.0, y: -6 },
        { at: F.villain, zoom: 1.08, y: 4 },
        { at: dur, zoom: 1.14, y: 8 },
      ]}
    >
      <Content dur={dur} F={F} />
    </V3Beat>
  );
};

const Content: React.FC<{ dur: number; F: Record<string, number> }> = ({ dur, F }) => {
  const frame = useCurrentFrame();
  const s = useStage3(dur, { disperseFrames: 30, holdFrames: 14 });

  const floorY = ROOM_FLOOR_Y;
  const deskY = floorY + 250;
  const devH = Math.round(HEIGHT * 0.4);
  const devX = WIDTH * 0.17;

  // the 97% grid on a board on the back wall
  const cols = 12;
  const rows = 6;
  const bx = WIDTH * 0.34;
  const by = HEIGHT * 0.06;
  const bw = WIDTH * 0.58;
  const bh = HEIGHT * 0.42;
  const shown = Math.min(cols * rows, Math.floor(interpolate(frame, [F.grid, F.grid + 120], [0, cols * rows], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut })));

  return (
    <>
      {/* studio furniture (back) */}
      <Shelf x={WIDTH * 0.92} y={floorY + 30} w={220} h={340} tone="#5a5043" />
      <Plant x={WIDTH * 0.06} y={floorY + 250} s={1.4} />

      {/* the developer, standing at the desk — the desk (drawn next) occludes her legs */}
      <Lucky pose="stand" expression={frame >= F.villain && frame < F.rent ? "worried" : "neutral"} faceless facing={1} height={devH} centerX={devX} baseline={deskY + 90} cycleSeconds={4} />

      {/* desk + monitor in front */}
      <Desk x={devX + 60} y={deskY} w={520} tone="#5c4f3d" />
      <Monitor x={devX + 140} y={deskY - 2} w={160} screen={frame >= F.grid ? V3.accentDim : "#2f6b6a"} />

      {/* ── the 97% board ── */}
      {frame >= F.grid - 10 && (
        <div style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, background: "rgba(20,18,16,0.5)", border: `3px solid ${V3.ink}`, padding: 18, opacity: interpolate(frame, [F.grid - 10, F.grid + 6, s.disperseAt, s.disperseAt + 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, height: "100%" }}>
            {Array.from({ length: cols * rows }).map((_, i) => {
              if (i >= shown) return null;
              const paid = i === 41;
              return <div key={i} style={{ background: paid ? V3.accent : V3.window, opacity: paid ? 1 : 0.85, borderRadius: 4 }} />;
            })}
          </div>
        </div>
      )}
      {frame >= F.grid && frame < F.villain && (
        <div style={{ position: "absolute", left: bx, top: by + bh + 14, fontFamily: FONT.hero, fontSize: 40, color: COLOR.cardWhite, letterSpacing: "0.02em", textShadow: "0 3px 14px rgba(0,0,0,0.5)" }}>
          {frame >= F.nopay ? "97% COST NOTHING — MOST COULD NEVER CHARGE YOU" : "97% OF THE APPS YOU CAN INSTALL"}
        </div>
      )}

      {/* ── NOT THE VILLAIN ── */}
      {frame >= F.villain - 6 && frame < F.used && (
        <div style={{ position: "absolute", left: WIDTH * 0.06, top: HEIGHT * 0.66, width: WIDTH * 0.4, padding: "20px 26px", background: "rgba(20,18,16,0.8)", opacity: interpolate(frame, [F.villain, F.villain + 12, F.used - 16, F.used], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), translate: `${(1 - Math.min(1, springIn({ frame, fps: 30, delay: F.villain, durationInFrames: 16 }))) * -40}px 0px` }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 44, color: COLOR.cardWhite }}>NOT THE VILLAIN.</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 24, color: "#D8D2C4", marginTop: 8 }}>
            {frame >= F.rent ? "they picked the only model that pays the rent — this auction." : "they picked the only model that pays…"}
          </div>
        </div>
      )}

      <Bloom window={[F.money - 6, F.money + 10, F.money + 50, F.money + 80]} radius={260} x="50%" y="60%" intensity={0.6} />

      {/* ── the closer ── */}
      {frame >= F.used - 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.76, textAlign: "center", opacity: interpolate(frame, [F.used, F.used + 12, dur - 20, dur - 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 46, color: COLOR.cardWhite, letterSpacing: "0.02em", textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}>
            {frame >= F.money ? "NO CLICKS. EVERY ONE STILL MADE MONEY OFF ME." : "I USED THESE APPS ALL DAY. DIDN'T CLICK ONE AD."}
          </div>
        </div>
      )}
    </>
  );
};
