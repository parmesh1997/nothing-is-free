import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { phoneBody, phoneScreenRect } from "../shapes";
import { Floor } from "../scene";
import { useStage, pulse, loop, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B04 — the request. HIGH · 1342 f (44.8 s).
 * Empty → phone → a REQUEST card compiles itself, one field per VO clause →
 * a ghosted setup screen with the box already ticked → "the packet is the
 * thing being sold. You." → empty.
 * Peak: "You." — whisper "you" @ f1286 (last word). Bloom on it.
 */
export const B04: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Bidstream contents — US Senate (Wyden) 2021; FTC data-broker complaints">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

type RowKey = "rowId" | "rowLoc" | "rowModel" | "rowCarrier" | "rowApp" | "rowTime" | "rowKit";

const ROWS: Array<{ key: RowKey; label: string; value: string }> = [
  { key: "rowId", label: "DEVICE ADVERTISING ID", value: "a1f9-4e02-b1c8-c2b7" },
  { key: "rowLoc", label: "ROUGH LOCATION", value: "37.77, -122.41" },
  { key: "rowModel", label: "PHONE MODEL", value: "iPhone · iOS 17" },
  { key: "rowCarrier", label: "CARRIER", value: "major US network" },
  { key: "rowApp", label: "APP JUST OPENED", value: "the word game" },
  { key: "rowTime", label: "TIME OF DAY", value: "08:41 local" },
  { key: "rowKit", label: "+ WHAT THE AD KIT ALREADY KNOWS", value: "……………………" },
];

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 36, holdFrames: 14 });
  const vo = useBeatTiming("B04");
  const F: Record<RowKey | "phone" | "card" | "send" | "route" | "arrive" | "ghost" | "check" | "peak" | "you", number> = {
    phone: vo.at("tap", 24),
    card: vo.at("builds", 120),
    send: vo.at("sends", 190),
    route: vo.at("exchange", 300),
    arrive: vo.at("describes", 430),
    rowId: vo.at("advertising", 519),
    rowLoc: vo.at("location", 609),
    rowModel: vo.at("model", 648),
    rowCarrier: vo.at("carrier", 690),
    rowApp: vo.at("opened", 751),
    rowTime: vo.at("time", 789),
    rowKit: vo.at("knows", 898),
    ghost: vo.at("agreed", 945),
    check: vo.at("setup", 1039),
    peak: vo.at("sold", 1186),
    you: vo.at("you", 1286, 6),
  };

  const groundY = Math.round(HEIGHT * 0.92);
  const phoneH = Math.round(HEIGHT * 0.56);
  const phoneW = Math.round(phoneH * 0.49);
  const phoneCx = Math.round(WIDTH * 0.15);
  const scr = phoneScreenRect(phoneW, phoneH);
  const barT = loop(frame, 40);

  const cardW = 760;
  const cardH = 560;
  const cardX = WIDTH * 0.34;
  const cardY = HEIGHT * 0.13;
  const headerH = 60;
  const rowTop = cardY + headerH + 34;
  const rowGap = (cardH - headerH - 60) / ROWS.length;

  const cardIn = interpolate(frame, [F.arrive, F.arrive + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const rowsStarted = frame >= F.rowId;
  const scanY = rowTop + loop(frame, 50) * (cardH - headerH - 70);

  // ── the packet flight: phone → (past the app's own company) → ad exchange ──
  const flightStart = { x: phoneCx + phoneW * 0.3, y: groundY - phoneH * 0.5 };
  const ownNode = { x: WIDTH * 0.4, y: HEIGHT * 0.72 };
  const exchNode = { x: cardX + cardW * 0.5, y: cardY + cardH * 0.5 };
  const packetDest = { x: exchNode.x - 172, y: exchNode.y }; // land just left of the AD EXCHANGE node
  const legA = interpolate(frame, [F.send, F.route], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const legB = interpolate(frame, [F.route, F.arrive], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const packetX = frame < F.route ? flightStart.x + (ownNode.x - flightStart.x) * legA : ownNode.x + (packetDest.x - ownNode.x) * legB;
  const packetY = frame < F.route ? flightStart.y + (ownNode.y - flightStart.y) * legA : ownNode.y + (packetDest.y - ownNode.y) * legB;
  const packetLive = frame >= F.send && frame < F.arrive - 4;

  const dim = interpolate(frame, [F.peak, F.peak + 28], [1, 0.34], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const outlinePulse = pulse(frame, F.peak + 6, 0.025, 26);

  return (
    <>
      <Floor stage={stage} at={6} heightFraction={0.24} kind="desk" />

      {/* ── phone ── */}
      <div
        style={{
          position: "absolute",
          left: phoneCx - phoneW / 2,
          top: groundY - phoneH,
          width: phoneW,
          height: phoneH,
          rotate: "-3deg",
          transformOrigin: "50% 100%",
          opacity: stage.present(frame, F.phone, 18),
          translate: `${stage.fly(frame, -1, 700)}px ${(1 - Math.min(1, stage.enter(frame, F.phone))) * 40}px`,
        }}
      >
        <FlatFigure shape={phoneBody()} w={phoneW} h={phoneH} />
        <svg width={phoneW} height={phoneH} viewBox={`0 0 ${phoneW} ${phoneH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <rect x={scr.left + scr.width * 0.14} y={scr.top + scr.height * 0.44} width={scr.width * 0.72} height={scr.height * 0.028} rx={3} fill={COLOR.grid} />
          <rect x={scr.left + scr.width * 0.14} y={scr.top + scr.height * 0.44} width={scr.width * 0.72 * barT} height={scr.height * 0.028} rx={3} fill={COLOR.ink} />
          <text x={scr.left + scr.width / 2} y={scr.top + scr.height * 0.56} textAnchor="middle" fontFamily={FONT.mono} fontSize={scr.width * 0.08} fill={COLOR.grey}>
            {frame >= F.send ? "SENT" : frame >= F.card ? "BUILDING REQUEST…" : "OPENING…"}
          </text>
          {/* the packet assembling inside the screen, before it ejects */}
          {frame >= F.card && frame < F.send && (
            <rect
              x={scr.left + scr.width * 0.34}
              y={scr.top + scr.height * 0.66}
              width={scr.width * 0.32}
              height={interpolate(frame, [F.card, F.send], [2, scr.height * 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              fill={COLOR.ink}
            />
          )}
        </svg>
      </div>

      {/* ── the packet flight: phone → past the app's own company → ad exchange ── */}
      {frame >= F.send - 4 && frame < F.rowId && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: stage.exit(frame) }}>
          {/* trail */}
          <path
            d={`M ${flightStart.x} ${flightStart.y} L ${ownNode.x} ${ownNode.y}${frame >= F.route ? ` L ${packetX} ${packetY}` : ""}`}
            fill="none"
            stroke={COLOR.grey}
            strokeWidth={2}
            strokeDasharray="5 7"
            opacity={0.5}
          />

          {/* the app's own company — dim, skipped */}
          {frame >= F.send + 6 && (
            <g opacity={interpolate(frame, [F.send + 6, F.send + 20, F.arrive + 30, F.arrive + 50], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              <rect x={ownNode.x - 96} y={ownNode.y - 30} width={192} height={60} fill={COLOR.paperShade} stroke={COLOR.grey} strokeWidth={2} strokeDasharray="4 4" />
              <text x={ownNode.x} y={ownNode.y - 4} textAnchor="middle" fontFamily={FONT.mono} fontSize={14} fill={COLOR.grey}>the app&apos;s own</text>
              <text x={ownNode.x} y={ownNode.y + 15} textAnchor="middle" fontFamily={FONT.mono} fontSize={14} fill={COLOR.grey}>company</text>
              {frame >= F.route && <line x1={ownNode.x - 70} y1={ownNode.y + 34} x2={ownNode.x + 70} y2={ownNode.y + 34} stroke={COLOR.grey} strokeWidth={2} />}
            </g>
          )}

          {/* AD EXCHANGE node — becomes the card header */}
          {frame >= F.route - 6 && frame < F.arrive + 12 && (
            <g opacity={interpolate(frame, [F.route - 6, F.route + 10, F.arrive + 2, F.arrive + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              <rect x={exchNode.x - 130} y={exchNode.y - 34} width={260} height={68} fill={COLOR.ink} />
              <text x={exchNode.x} y={exchNode.y + 8} textAnchor="middle" fontFamily={FONT.mono} fontSize={22} letterSpacing="0.08em" fill={COLOR.cardWhite}>AD EXCHANGE</text>
              {frame >= F.arrive - 10 && (
                <circle cx={exchNode.x} cy={exchNode.y} r={interpolate(frame, [F.arrive - 10, F.arrive + 6], [10, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} fill="none" stroke={COLOR.orange} strokeWidth={3} opacity={interpolate(frame, [F.arrive - 10, F.arrive + 12], [0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
              )}
            </g>
          )}

          {/* the packet itself */}
          {packetLive && (
            <g transform={`translate(${packetX} ${packetY}) rotate(${Math.sin(frame * 0.3) * 8})`}>
              <rect x={-22} y={-15} width={44} height={30} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={2.5} />
              <line x1={-22} y1={-6} x2={22} y2={-6} stroke={COLOR.ink} strokeWidth={1.5} />
              <line x1={-22} y1={2} x2={22} y2={2} stroke={COLOR.grey} strokeWidth={1.5} />
              <line x1={-22} y1={10} x2={10} y2={10} stroke={COLOR.grey} strokeWidth={1.5} />
            </g>
          )}
        </svg>
      )}

      {/* "the request is tiny — and it describes you" */}
      {frame >= F.route + 20 && frame < F.rowId && (
        <div style={{ position: "absolute", left: cardX, top: cardY - 46, fontFamily: FONT.sans, fontWeight: 600, fontSize: 22, color: COLOR.ink, opacity: interpolate(frame, [F.route + 20, F.route + 36, F.rowId - 20, F.rowId], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          tiny · and it <span style={{ color: COLOR.orange }}>describes you</span>
        </div>
      )}

      {/* ── ghost setup screen behind the card ── */}
      {frame >= F.ghost - 10 && (
        <div
          style={{
            position: "absolute",
            left: cardX + cardW - 120,
            top: cardY + cardH * 0.08,
            width: 380,
            height: 260,
            border: `2px dashed ${COLOR.grey}`,
            background: COLOR.paperShade,
            opacity: interpolate(frame, [F.ghost, F.ghost + 20], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * stage.exit(frame),
            padding: 22,
            fontFamily: FONT.mono,
            fontSize: 16,
            color: COLOR.grey,
          }}
        >
          SETUP · STEP 3 / 3
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 24, height: 24, border: `2px solid ${COLOR.ink}`, background: frame >= F.check ? COLOR.ink : "transparent", color: COLOR.cardWhite, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {frame >= F.check ? "✓" : ""}
            </div>
            <span style={{ color: COLOR.ink }}>Allow personalised ads</span>
          </div>
          <div style={{ marginTop: 18, opacity: interpolate(frame, [F.check + 10, F.check + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            — you tapped past this
          </div>
        </div>
      )}

      {/* ── the REQUEST card ── */}
      {cardIn > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: cardX,
            top: cardY,
            width: cardW,
            height: cardH,
            background: COLOR.cardWhite,
            border: `3px solid ${COLOR.ink}`,
            opacity: Math.min(1, cardIn) * stage.exit(frame),
            scale: String((0.82 + 0.18 * Math.min(1, cardIn)) * outlinePulse),
            transformOrigin: "50% 50%",
            overflow: "hidden",
          }}
        >
          {/* header band */}
          <div style={{ height: headerH, background: COLOR.ink, color: COLOR.cardWhite, fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.1em", display: "flex", alignItems: "center", padding: "0 26px" }}>
            BID REQUEST → AD EXCHANGE
          </div>

          {/* scanning line while compiling */}
          {!rowsStarted && (
            <>
              <div style={{ position: "absolute", left: 0, right: 0, top: scanY - cardY, height: 2, background: COLOR.orange, opacity: 0.7 }} />
              <div style={{ position: "absolute", left: 26, top: rowTop - cardY, fontFamily: FONT.mono, fontSize: 20, color: COLOR.grey }}>compiling a description of you…</div>
            </>
          )}

          {/* rows */}
          <div style={{ opacity: dim }}>
            {ROWS.map((r, i) => {
              const at = F[r.key];
              const on = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
              if (on <= 0.01) return null;
              const chars = Math.max(0, Math.floor(((frame - at - 4) / 30) * 34));
              return (
                <div key={i} style={{ position: "absolute", left: 26, top: rowTop - cardY + i * rowGap, opacity: Math.min(1, on), translate: `${(1 - Math.min(1, on)) * -12}px 0px` }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.08em", color: COLOR.grey }}>{r.label}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 500, color: COLOR.ink, marginTop: 2 }}>
                    {r.value.slice(0, Math.min(r.value.length, chars))}
                    {chars < r.value.length && <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }}>▍</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── peak line ── */}
      {frame >= F.peak - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.79, textAlign: "center", opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 20, dur - 5]) }}>
          <span style={{ fontFamily: FONT.hero, fontSize: 52, color: COLOR.ink, letterSpacing: "0.02em" }}>THE PACKET IS THE THING BEING SOLD. </span>
          <span style={{ fontFamily: FONT.hero, fontSize: 52, color: COLOR.orange, letterSpacing: "0.02em", display: "inline-block", scale: String(pulse(frame, F.you, 0.16, 20)) }}>
            NOT THE SCREEN. YOU.
          </span>
          <Bloom window={[F.you - 4, F.you + 10, F.you + 46, F.you + 72]} radius={240} x="70%" y="50%" intensity={0.82} />
        </div>
      )}
    </>
  );
};
