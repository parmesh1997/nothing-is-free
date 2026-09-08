import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { Floor } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B22 — Apple plays it cleverly. MEDIUM · 1012 f (33.7 s). The one [dry].
 * Empty → a "Ask App Not to Track?" prompt, ALLOW / ASK NOT TO TRACK → most tap
 * "ask not to track" → everyone else's price line sags → the App Store grows a
 * "SPONSORED" slot Apple keeps → "the referee opened its own betting window".
 * Peak: "its own betting window" — whisper "window" @ f972.
 */
export const B22: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Apple App Tracking Transparency (2021); App Store Ads expansion (2022)">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 28, holdFrames: 14 });
  const vo = useBeatTiming("B22");

  const F = {
    prompt: vo.at("added", 109),
    choose: vo.at("no", 246),
    sag: vo.at("cheaper", 422),
    expand: vo.at("expanded", 486),
    slot: vo.at("store", 605),
    list: vo.at("list", 784),
    peak: vo.at("window", 972),
  };

  const promptX = WIDTH * 0.1;
  const promptY = HEIGHT * 0.16;
  const promptW = 560;

  const choose = interpolate(frame, [F.choose, F.choose + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sag = interpolate(frame, [F.sag, F.sag + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const slotPulse = pulse(frame, F.peak, 0.06, 24);

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.22} kind="floor" />

      {/* ── the permission prompt ── */}
      {frame >= F.prompt - 8 && (
        <div
          style={{
            position: "absolute",
            left: promptX,
            top: promptY,
            width: promptW,
            background: COLOR.cardWhite,
            border: `3px solid ${COLOR.ink}`,
            padding: "30px 34px",
            opacity: safeRamp(frame, [F.prompt, F.prompt + 16, F.slot + 40, F.slot + 90]),
            scale: String(interpolate(frame, [F.prompt, F.prompt + 16], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })),
          }}
        >
          <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 30, color: COLOR.ink }}>
            Allow "the word game" to track you?
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: 19, color: COLOR.grey, marginTop: 10, lineHeight: 1.4 }}>
            Your activity will be used to show you personalised ads.
          </div>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "14px 0", textAlign: "center", border: `2px solid ${COLOR.ink}`, fontFamily: FONT.sans, fontWeight: 600, fontSize: 20, color: COLOR.grey, opacity: choose > 0 ? 0.4 : 1 }}>
              Allow
            </div>
            <div style={{ padding: "14px 0", textAlign: "center", background: choose > 0 ? COLOR.ink : "transparent", border: `2px solid ${COLOR.ink}`, fontFamily: FONT.sans, fontWeight: 700, fontSize: 20, color: choose > 0 ? COLOR.cardWhite : COLOR.ink, scale: String(choose > 0 && choose < 1 ? 1 + 0.04 * Math.sin(choose * Math.PI) : 1) }}>
              Ask App Not to Track
            </div>
          </div>
          {choose > 0.6 && <div style={{ fontFamily: FONT.mono, fontSize: 16, color: COLOR.grey, marginTop: 14 }}>— most people tap this</div>}
        </div>
      )}

      {/* ── the sagging price line ── */}
      {frame >= F.sag - 6 && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: stage.exit(frame) }}>
          <path
            d={`M ${WIDTH * 0.5} ${HEIGHT * 0.32} Q ${WIDTH * 0.72} ${HEIGHT * 0.32 + sag * 180} ${WIDTH * 0.94} ${HEIGHT * 0.32 + sag * 60}`}
            fill="none"
            stroke={COLOR.ink}
            strokeWidth={4}
          />
          <text x={WIDTH * 0.5} y={HEIGHT * 0.29} fontFamily={FONT.mono} fontSize={18} fill={COLOR.grey}>everyone else's price for you</text>
          {sag > 0.5 && <text x={WIDTH * 0.7} y={HEIGHT * 0.32 + sag * 180 + 30} fontFamily={FONT.hero} fontSize={30} fill={COLOR.ink}>VAGUER · CHEAPER</text>}
        </svg>
      )}

      {/* ── Apple's own list of everything you downloaded ── */}
      {frame >= F.list - 8 && frame < F.peak + 10 && (
        <div style={{ position: "absolute", left: WIDTH * 0.08, top: HEIGHT * 0.22, width: WIDTH * 0.36, opacity: interpolate(frame, [F.list, F.list + 16, F.peak, F.peak + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.08em", color: COLOR.ink }}>APPLE ALREADY HAS: every app you ever downloaded</div>
          {["a banking app", "a dating app", "a period tracker", "a weather app", "3 mobile games", "a VPN"].map((a, i) => {
            const on = interpolate(frame, [F.list + 14 + i * 8, F.list + 26 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 22, color: COLOR.grey, padding: "5px 0", borderBottom: `1px solid ${COLOR.grid}`, opacity: on, translate: `${(1 - on) * -12}px 0px` }}>
                {a}
              </div>
            );
          })}
          <div style={{ fontFamily: FONT.mono, fontSize: 15, color: COLOR.grey, marginTop: 8 }}>— it never needed the auction to know you</div>
        </div>
      )}

      {/* ── the sponsored slot — the App Store storefront grows it in ── */}
      {frame >= F.expand - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.52, top: HEIGHT * 0.5, width: WIDTH * 0.4, opacity: safeRamp(frame, [F.expand, F.expand + 16, dur - 18, dur - 6]) }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 16, color: COLOR.grey }}>APP STORE — SEARCH RESULTS</div>
          {/* a couple of ordinary results, then the sponsored one wedges in */}
          {[0, 1].map((i) => (
            <div key={i} style={{ marginTop: 10, height: 40, background: COLOR.cardWhite, border: `2px solid ${COLOR.grid}`, opacity: interpolate(frame, [F.expand + i * 8, F.expand + 12 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
          ))}
          <div
            style={{
              marginTop: 10,
              padding: "20px 26px",
              background: COLOR.orange,
              color: COLOR.cardWhite,
              transformOrigin: "left center",
              overflow: "hidden",
              maxHeight: interpolate(frame, [F.slot, F.slot + 28], [0, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut }),
              opacity: interpolate(frame, [F.slot, F.slot + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              scale: String(slotPulse),
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: 14, letterSpacing: "0.14em" }}>SPONSORED</div>
            <div style={{ fontFamily: FONT.hero, fontSize: 40, marginTop: 4 }}>APPLE KEEPS THIS ONE</div>
          </div>
          <Bloom window={[F.peak - 4, F.peak + 12, dur - 24, dur - 8]} radius={220} x="30%" y="60%" intensity={0.68} />
        </div>
      )}

      {/* the dry line */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.84, textAlign: "center", fontFamily: FONT.hero, fontSize: 46, color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 14, dur - 4]) }}>
          THE REFEREE OPENED <span style={{ color: COLOR.orange }}>ITS OWN BETTING WINDOW.</span>
        </div>
      )}
    </>
  );
};
