import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { DarkLaw } from "../../channel/DarkLaw";
import { EASE } from "../../parts/motion";
import { appTile, barcode, phoneBody, phoneScreenRect } from "../shapes";
import { Floor } from "../scene";
import { useStage, loop } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B25 — the reversal. REVERSAL · Dark Law (§2.9). 1240 f (VO 1166 + 74
 * silent tail). globalStartFrame 26969.
 * Paper still up → the app icon sits centre → crossfade to ink on "run it
 * forward" → the icon flips to a lot number / barcode → the reversal line types
 * on → "you were never the user. you are the inventory. free because you sell."
 * → "NOTHING IS FREE." types on, silent → hold.
 */
const CROSSFADE_LOCAL = 235; // whisper "forward" @ f235
const GLOBAL_START = 26969;

export const B25: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} darkLawStartGlobalFrame={GLOBAL_START + CROSSFADE_LOCAL}>
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const vo = useBeatTiming("B25");
  const stage = useStage(dur, { disperseFrames: 20, holdFrames: 8 });

  const F = {
    icon: 16,
    thing: vo.at("thing", 167),
    crossfade: CROSSFADE_LOCAL,
    survive: vo.at("survive", 320),
    notyou: vo.at("someone", 470, 1),
    job: vo.at("job", 560),
    flip: vo.at("finishes", 620),
    flipDone: vo.at("bid", 880),
  };

  const iconSize = 220;
  const iconX = WIDTH * 0.14;
  const iconY = HEIGHT * 0.2;
  const groundY = HEIGHT * 0.84;
  const inkIconY = HEIGHT * 0.06;

  // the flip is slow and deliberate — it tracks "its real job is to describe you"
  const flip = interpolate(frame, [F.flip, F.flipDone], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const iconIn = interpolate(frame, [F.icon, F.icon + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  // everything on the paper side fades out as the crossfade hits
  const paperSide = interpolate(frame, [F.crossfade - 6, F.crossfade + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const phoneH = Math.round(HEIGHT * 0.5);
  const phoneW = Math.round(phoneH * 0.49);
  const phoneCx = WIDTH * 0.66;
  const scr = phoneScreenRect(phoneW, phoneH);

  return (
    <>
      {/* PAPER SIDE — "you think of the free app as a thing you use" */}
      {frame < F.crossfade + 16 && (
        <div style={{ opacity: paperSide }}>
          <Floor stage={stage} at={6} heightFraction={0.22} kind="desk" />

          {/* a hand-held phone showing the app, resting on the desk */}
          <div style={{ position: "absolute", left: phoneCx - phoneW / 2, top: groundY - phoneH + 4, width: phoneW, height: phoneH, opacity: Math.min(1, iconIn), rotate: "-2deg", transformOrigin: "50% 100%" }}>
            <FlatFigure shape={phoneBody()} w={phoneW} h={phoneH} />
            <svg width={phoneW} height={phoneH} viewBox={`0 0 ${phoneW} ${phoneH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <rect x={scr.left + scr.width * 0.3} y={scr.top + scr.height * 0.32} width={scr.width * 0.4} height={scr.width * 0.4} rx={scr.width * 0.09} fill={COLOR.orange} />
              <rect x={scr.left + scr.width * 0.18} y={scr.top + scr.height * 0.62} width={scr.width * 0.64} height={scr.height * 0.02} rx={2} fill={COLOR.grid} />
            </svg>
          </div>

          {/* the big app icon */}
          <div style={{ position: "absolute", left: iconX, top: iconY, width: iconSize, height: iconSize, opacity: Math.min(1, iconIn) }}>
            <FlatFigure shape={appTile({ glyph: "letter", color: COLOR.orange })} w={iconSize} h={iconSize} />
          </div>

          {frame >= F.thing - 6 && (
            <div style={{ position: "absolute", left: iconX, top: iconY + iconSize + 28, width: 620, fontFamily: FONT.hero, fontSize: 52, color: COLOR.ink, opacity: interpolate(frame, [F.thing, F.thing + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              YOU THINK OF IT AS A THING YOU USE.
            </div>
          )}
        </div>
      )}

      {/* INK SIDE — the icon flips to a lot number, up top clear of the typed line */}
      {frame >= F.crossfade + 4 && (
        <div
          style={{
            position: "absolute",
            left: WIDTH / 2 - iconSize / 2,
            top: inkIconY,
            width: iconSize,
            height: iconSize,
            transform: `perspective(900px) rotateY(${flip * 180}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
            <FlatFigure shape={appTile({ glyph: "letter", color: COLOR.orange })} w={iconSize} h={iconSize} />
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <FlatFigure shape={barcode({ seed: 42, label: "LOT · YOU" })} w={iconSize} h={iconSize} />
          </div>
        </div>
      )}

      {/* INK SIDE — "someone pays for this. it isn't you." — a coin that can't land */}
      {frame >= F.survive - 6 && frame < F.flip + 12 && (
        <svg style={{ position: "absolute", left: 0, right: 0, top: 0, width: "100%", height: HEIGHT * 0.34, overflow: "visible" }}>
          {(() => {
            const restY = inkIconY + iconSize * 0.42;
            const drop = interpolate(frame, [F.survive, F.survive + 20], [-180, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
            const bounce = frame > F.survive + 20 ? Math.abs(Math.sin((frame - F.survive - 20) * 0.1)) * 30 * Math.max(0, 1 - (frame - F.survive - 20) / 80) : 0;
            const cx = WIDTH / 2 + iconSize / 2 + 130;
            const cy = restY + drop - bounce;
            const struck = frame >= F.notyou;
            return (
              <g opacity={interpolate(frame, [F.survive - 6, F.survive + 6, F.flip - 6, F.flip + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                <circle cx={cx} cy={cy} r={30} fill="none" stroke="#E9E9E3" strokeWidth={3} />
                <text x={cx} y={cy + 11} textAnchor="middle" fontFamily={FONT.hero} fontSize={38} fill="#E9E9E3">$</text>
                {struck && <line x1={cx - 44} y1={cy - 44} x2={cx + 44} y2={cy + 44} stroke={COLOR.orange} strokeWidth={5} />}
                <text x={cx} y={cy + 62} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={COLOR.grey}>{struck ? "— not you" : "someone pays"}</text>
              </g>
            );
          })()}
        </svg>
      )}

      {/* INK SIDE — the argument's hinge, one line, landing on its beat then gone */}
      {frame >= F.notyou - 6 && frame < F.flip + 14 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: "28.5%", textAlign: "center", fontFamily: FONT.hero, fontSize: 26, letterSpacing: "0.05em", color: "#E9E9E3", opacity: interpolate(frame, [F.notyou, F.notyou + 12, F.flip, F.flip + 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          THE ONE WHO PAYS <span style={{ color: COLOR.orange }}>ISN&apos;T YOU.</span>
        </div>
      )}

      {/* INK SIDE — once it's a barcode, it keeps getting scanned */}
      {flip > 0.92 && (
        <svg style={{ position: "absolute", left: WIDTH / 2 - iconSize / 2, top: inkIconY, width: iconSize, height: iconSize, overflow: "visible" }}>
          <line
            x1={0}
            x2={iconSize}
            y1={loop(frame, 46) * iconSize}
            y2={loop(frame, 46) * iconSize}
            stroke={COLOR.orange}
            strokeWidth={2.5}
            opacity={0.8}
          />
        </svg>
      )}

      <DarkLaw reversalLine="You were never the user. You are the inventory." crossfadeAt={F.crossfade} cps={17} />
    </>
  );
};
