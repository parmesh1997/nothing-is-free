import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { appTile, sdkChip } from "../shapes";
import { Floor } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B05 — the kits. MEDIUM · 1477 f (49.2 s) — the longest body beat.
 * Empty → a word-game app with a "?" → ~10 ad-company "kits" plug into it →
 * a row of other apps carries the same kits → one kit joins "MON · shopping"
 * to "THU · word game" → the kits pulse → empty.
 * Peak: "a piece of ten advertising companies" — whisper "companies" (2nd) @ f1468.
 */
export const B05: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Third-party tracking research — Binns et al. 2018; Exodus Privacy">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const KIT_TONES = [COLOR.orange, COLOR.grey, COLOR.ink, COLOR.grey, COLOR.orange, COLOR.ink, COLOR.grey, COLOR.orange, COLOR.grey, COLOR.ink];
const KIT_TAGS = ["AX", "MB", "PN", "VG", "IK", "Q2", "LM", "RS", "TD", "WZ"];

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 40, holdFrames: 16 });
  const vo = useBeatTiming("B05");

  const F = {
    q: vo.at("age", 89),
    borrow: vo.at("borrow", 212),
    chips: vo.at("drop", 341),
    ten: vo.at("ten", 697),
    dozen: vo.at("dozen", 873),
    row: vo.at("thousands", 961),
    link: vo.at("monday", 1130),
    linkThu: vo.at("thursday", 1240, 1),
    oneapp: vo.at("installed", 1294),
    piece: vo.at("piece", 1419),
    peak: vo.at("companies", 1468, 1),
  };
  // after the first 10 land, more keep creeping in for "two or three dozen"
  const extraKits = Math.max(0, Math.min(16, Math.floor((frame - F.dozen) / 10)));

  const floorTop = HEIGHT * 0.8;
  const appSize = 250;
  const appX = WIDTH * 0.11;
  const appY = floorTop - appSize - 40;
  const appCx = appX + appSize / 2;
  const appCy = appY + appSize / 2;

  const kitCount = Math.min(10, Math.max(0, Math.floor((frame - F.chips) / 22) + 1));

  // row of other apps
  const rowSize = 132;
  const rowY = floorTop - rowSize - 8;
  const rowN = 5;
  const rowGap = 46;
  const rowW = rowN * rowSize + (rowN - 1) * rowGap;
  const rowLeft = WIDTH - rowW - 90;

  const chipsPulse = pulse(frame, F.peak, 0.09, 24);

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.2} kind="floor" />

      {/* ── the focus app ── */}
      <div
        style={{
          position: "absolute",
          left: appX,
          top: appY,
          width: appSize,
          height: appSize,
          opacity: stage.present(frame, F.q - 26, 16),
          translate: `${stage.fly(frame, -1, 500)}px 0px`,
          scale: String(frame >= F.peak - 6 ? chipsPulse : 1),
        }}
      >
        <FlatFigure shape={appTile({ glyph: "letter", color: COLOR.orange })} w={appSize} h={appSize} />
      </div>
      <div style={{ position: "absolute", left: appX - 20, top: appY + appSize + 12, width: appSize + 40, textAlign: "center", fontFamily: FONT.mono, fontSize: 19, color: COLOR.grey, opacity: stage.present(frame, F.q - 12, 14) }}>
        a free word game
      </div>

      {/* the "?" — how does it know your age */}
      {frame >= F.q && frame < F.borrow + 24 && (
        <div style={{ position: "absolute", left: appCx, top: appY - 96, translate: "-50% 0", fontFamily: FONT.hero, fontSize: 96, color: COLOR.ink, opacity: interpolate(frame, [F.q, F.q + 12, F.borrow + 4, F.borrow + 22], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          ?
        </div>
      )}
      {frame >= F.borrow - 4 && frame < F.row && (
        <div style={{ position: "absolute", left: WIDTH * 0.34, top: HEIGHT * 0.2, fontFamily: FONT.sans, fontWeight: 600, fontSize: 34, color: COLOR.ink, opacity: interpolate(frame, [F.borrow, F.borrow + 12, F.row - 30, F.row - 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          it doesn&apos;t know your age. it <span style={{ color: COLOR.orange }}>borrows</span> it.
        </div>
      )}

      {/* ── the kits, arced around the app's right edge; +more on "two or three dozen" ── */}
      {Array.from({ length: KIT_TONES.length + extraKits }).map((_, i) => {
        const extra = i >= KIT_TONES.length;
        const tone = extra ? [COLOR.grey, COLOR.ink, COLOR.orange][i % 3] : KIT_TONES[i];
        const at = extra ? F.dozen + (i - KIT_TONES.length) * 10 : F.chips + i * 22;
        const inn = springIn({ frame, fps: 30, delay: at, durationInFrames: 18 });
        if (inn <= 0.01) return null;
        const total = KIT_TONES.length + extraKits;
        const ang = -78 + (i / Math.max(1, total - 1)) * 168;
        const wob = Math.sin(frame * 0.03 + i) * 3; // gentle continuous drift
        const rad = ((ang + wob) * Math.PI) / 180;
        const restR = appSize * (extra ? 0.9 : 0.62);
        const restX = appCx + Math.cos(rad) * restR;
        const restY = appCy + Math.sin(rad) * restR;
        const t = Math.min(1, inn);
        const x = interpolate(t, [0, 1], [WIDTH + 100, restX]);
        const cw = extra ? 66 : 96;
        const ch = extra ? 42 : 60;
        return (
          <div key={i} style={{ position: "absolute", left: x - cw / 2, top: restY - ch / 2, width: cw, height: ch, opacity: stage.exit(frame) * (extra ? 0.8 : 1), scale: String((0.85 + 0.15 * t) * (frame >= F.peak - 6 ? chipsPulse : 1)) }}>
            <FlatFigure shape={sdkChip({ tone, tag: extra ? undefined : KIT_TAGS[i] })} w={cw} h={ch} />
          </div>
        );
      })}

      {/* kit counter */}
      {frame >= F.chips && frame < F.peak && (
        <div style={{ position: "absolute", left: appX, top: appY - 150, fontFamily: FONT.mono, fontSize: 24, color: COLOR.ink, opacity: stage.present(frame, F.chips, 14) }}>
          AD KITS IN THIS ONE APP: <span style={{ color: COLOR.orange, fontFamily: FONT.hero, fontSize: 48 }}>{kitCount}</span>
        </div>
      )}
      {stage.isUp(frame, F.ten) && frame < F.dozen && (
        <div style={{ position: "absolute", left: appX, top: appY - 100, fontFamily: FONT.mono, fontSize: 18, color: COLOR.grey, opacity: interpolate(frame, [F.ten, F.ten + 12, F.dozen - 10, F.dozen], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          ≈ the typical free app
        </div>
      )}
      {stage.isUp(frame, F.dozen) && frame < F.row && (
        <div style={{ position: "absolute", left: appX, top: appY - 100, fontFamily: FONT.mono, fontSize: 18, color: COLOR.grey, opacity: interpolate(frame, [F.dozen, F.dozen + 12, F.row - 10, F.row], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          a news / weather app: 20–30
        </div>
      )}

      {/* ── the row of other apps, same kits inside ── */}
      {Array.from({ length: rowN }).map((_, i) => {
        const at = F.row + i * 16;
        const inn = springIn({ frame, fps: 30, delay: at, durationInFrames: 16 });
        if (inn <= 0.01) return null;
        const x = rowLeft + i * (rowSize + rowGap);
        const kitLit = frame >= at + 44 && i < 4;
        const isMon = i === 1;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: rowY, width: rowSize, height: rowSize, opacity: stage.exit(frame) * Math.min(1, inn), translate: `0px ${(1 - Math.min(1, inn)) * 26 + stage.flyY(frame, 1, 380) * (0.3 + i * 0.12)}px` }}>
            <FlatFigure shape={appTile({ glyph: (["controller", "bag", "cloud", "map", "dots"] as const)[i], color: [COLOR.grey, COLOR.ink, COLOR.grey, COLOR.orange, COLOR.grey][i] })} w={rowSize} h={rowSize} />
            {kitLit && (
              <div style={{ position: "absolute", right: -18, top: rowSize * 0.32, width: 52, height: 34, opacity: interpolate(frame, [at + 44, at + 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: String(isMon && frame >= F.link ? pulse(frame, F.link, 0.2, 20) : 1) }}>
                <FlatFigure shape={sdkChip({ tone: COLOR.orange })} w={52} h={34} />
              </div>
            )}
            {frame >= F.link && (isMon || i === 3) && (
              <div style={{ position: "absolute", left: 0, right: 0, top: rowSize + 8, textAlign: "center", fontFamily: FONT.mono, fontSize: 15, color: COLOR.ink }}>
                {isMon ? "MON · shopping" : "THU · word game"}
              </div>
            )}
          </div>
        );
      })}

      {/* the MON→THU link */}
      {frame >= F.link && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: stage.exit(frame) }}>
          <path
            d={`M ${rowLeft + 1 * (rowSize + rowGap) + rowSize} ${rowY + rowSize * 0.5} C ${WIDTH * 0.55} ${rowY - 120}, ${WIDTH * 0.5} ${rowY - 120}, ${rowLeft + 3 * (rowSize + rowGap)} ${rowY + rowSize * 0.5}`}
            fill="none"
            stroke={COLOR.orange}
            strokeWidth={3}
            strokeDasharray="9 8"
            strokeDashoffset={interpolate(frame, [F.link, F.linkThu], [500, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })}
            pathLength={500}
          />
          {frame >= F.linkThu - 20 && (
            <text x={WIDTH * 0.52} y={rowY - 88} textAnchor="middle" fontFamily={FONT.mono} fontSize={19} fill={COLOR.ink} opacity={interpolate(frame, [F.linkThu - 20, F.linkThu], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              learned Monday · used Thursday
            </text>
          )}
        </svg>
      )}

      {/* ── peak line — builds in two hits on its own VO beats ── */}
      {frame >= F.oneapp - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.1, textAlign: "center", opacity: safeRamp(frame, [F.oneapp - 6, F.oneapp + 10, dur - 26, dur - 8]) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 62, letterSpacing: "0.02em", color: COLOR.ink, scale: String(pulse(frame, F.oneapp + 2, 0.05, 18)) }}>YOU INSTALLED ONE APP.</div>
          {frame >= F.piece - 8 && (
            <div style={{ fontFamily: FONT.hero, fontSize: 62, letterSpacing: "0.02em", color: COLOR.orange, opacity: interpolate(frame, [F.piece - 8, F.piece + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: String(frame >= F.peak - 6 ? chipsPulse : 1) }}>
              AND A PIECE OF TEN AD COMPANIES.
            </div>
          )}
          <Bloom window={[F.peak + 6, F.peak + 20, dur - 34, dur - 12]} radius={200} x="50%" y="150%" intensity={0.62} />
        </div>
      )}
    </>
  );
};
