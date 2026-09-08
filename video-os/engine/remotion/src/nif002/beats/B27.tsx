import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { DataCard } from "../../print/DataCard";
import { EASE } from "../../parts/motion";
import { streetGrid } from "../shapes";
import { Floor } from "../scene";
import { useStage, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B27 — bridge + CTA. MEDIUM · 1139 f (38.0 s).
 * Empty → a street map draws in → a route line draws to an orange pin,
 * "NEXT — GOOGLE MAPS" → the previous-episode card slides in → a subscribe
 * prompt; the progress rule visibly completes → hold on 100%.
 * Peak: "the next one finds you" + progress hits 100% — whisper "you" @ f1127.
 */
export const B27: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Nothing Is Free — hidden economics">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 30, holdFrames: 14 });
  const vo = useBeatTiming("B27");

  const F = {
    map: vo.at("directions", 221),
    service: vo.at("service", 315),
    valuable: vo.at("valuable", 419),
    route: vo.at("maps", 628),
    prevEp: vo.at("56", 696),
    rest: vo.at("rest", 909),
    subscribe: vo.at("subscribe", 1042),
    peak: vo.at("finds", 1120),
  };

  // the callback checklist — "things you were sure were free" — staggered off F.rest
  const restAt = F.rest;
  const CHECKS = [
    { at: restAt + 8, label: "a movie ticket — 56% skimmed" },
    { at: restAt + 44, label: "this app — sold you at open" },
    { at: restAt + 82, label: "directions — the biggest auction yet" },
  ];

  const mapX = WIDTH * 0.06;
  const mapY = HEIGHT * 0.1;
  const mapW = WIDTH * 0.52;
  const mapH = HEIGHT * 0.64;

  // the route draws slowly across the whole "an app that gives you directions…" clause
  const routeDraw = interpolate(frame, [F.map + 40, F.route + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.24} kind="floor" />

      {/* ── the map ── */}
      <div style={{ position: "absolute", left: mapX, top: mapY, width: mapW, height: mapH, opacity: stage.present(frame, F.map - 12, 16) * interpolate(frame, [F.rest - 20, F.rest + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), border: `2px solid ${COLOR.ink}` }}>
        <FlatFigure shape={streetGrid} w={mapW} h={mapH} />
        <svg width={mapW} height={mapH} viewBox={`0 0 ${mapW} ${mapH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path
            d={`M ${mapW * 0.1} ${mapH * 0.8} L ${mapW * 0.1} ${mapH * 0.5} L ${mapW * 0.45} ${mapH * 0.5} L ${mapW * 0.45} ${mapH * 0.22} L ${mapW * 0.82} ${mapH * 0.22}`}
            fill="none"
            stroke={COLOR.orange}
            strokeWidth={5}
            pathLength={1000}
            strokeDasharray={1000}
            strokeDashoffset={1000 * (1 - routeDraw)}
          />
          {routeDraw > 0.9 && <circle cx={mapW * 0.82} cy={mapH * 0.22} r={14} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={3} />}
          {/* a moving locator dot rides the route while it draws */}
          {routeDraw > 0.02 && routeDraw < 0.98 && (
            <circle cx={mapW * (0.1 + routeDraw * 0.72)} cy={mapH * (0.8 - routeDraw * 0.58)} r={9} fill={COLOR.ink} stroke={COLOR.cardWhite} strokeWidth={3} />
          )}
        </svg>
      </div>

      {/* labels that land as the VO describes the app */}
      {frame >= F.map && frame < F.route + 30 && (
        <div style={{ position: "absolute", left: WIDTH * 0.6, top: HEIGHT * 0.16, fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink, lineHeight: 1.2, opacity: interpolate(frame, [F.map, F.map + 14, F.route + 10, F.route + 30], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          IT GIVES YOU DIRECTIONS.
          {frame >= F.service && <><br /><span style={{ color: COLOR.grey }}>IT LOOKS LIKE A PUBLIC SERVICE.</span></>}
          {frame >= F.valuable && <><br /><span style={{ color: COLOR.orange }}>IT RUNS ONE OF THE MOST VALUABLE AUCTIONS ON EARTH.</span></>}
        </div>
      )}

      {/* ── NEXT label ── */}
      {frame >= F.route - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.6, top: HEIGHT * 0.14, opacity: safeRamp(frame, [F.route, F.route + 16, dur - 18, dur - 6]) }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: "0.16em", color: COLOR.grey }}>NEXT EPISODE</div>
          <div style={{ fontFamily: FONT.hero, fontSize: 88, lineHeight: 0.95, color: COLOR.ink, marginTop: 6 }}>GOOGLE<br />MAPS</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 22, color: COLOR.grey, marginTop: 10, maxWidth: 460 }}>
            looks like a public service. runs one of the most valuable auctions on earth.
          </div>
        </div>
      )}

      {/* ── previous-episode card ── */}
      {frame >= F.prevEp - 8 && frame < F.rest + 40 && (
        <div style={{ position: "absolute", left: WIDTH * 0.6, top: HEIGHT * 0.56, opacity: interpolate(frame, [F.prevEp - 8, F.prevEp + 8, F.rest + 20, F.rest + 40], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <DataCard title="PREVIOUS EPISODE" rows={[{ label: "the cut you never see", value: "56% of a movie ticket", accent: true }]} x={0} y={0} width={620} entryFrame={F.prevEp} />
        </div>
      )}

      {/* ── the callback checklist ── */}
      {frame >= F.rest - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.07, top: HEIGHT * 0.16, width: WIDTH * 0.5, opacity: safeRamp(frame, [F.rest, F.rest + 16, dur - 14, dur - 4]) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 42, color: COLOR.ink, marginBottom: 20 }}>
            THINGS YOU WERE SURE WERE <span style={{ color: COLOR.orange }}>FREE</span>
          </div>
          {CHECKS.map((c, i) => {
            const on = interpolate(frame, [c.at, c.at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
            if (on <= 0.01) return null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, opacity: Math.min(1, on), translate: `${(1 - Math.min(1, on)) * -16}px 0px` }}>
                <div style={{ width: 30, height: 30, border: `3px solid ${COLOR.ink}`, background: COLOR.orange, color: COLOR.cardWhite, fontFamily: FONT.hero, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</div>
                <span style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 26, color: COLOR.ink }}>{c.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── subscribe prompt ── */}
      {frame >= F.subscribe - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.82, textAlign: "center", opacity: safeRamp(frame, [F.subscribe, F.subscribe + 14, dur - 12, dur - 4]) }}>
          <span style={{ fontFamily: FONT.hero, fontSize: 46, color: COLOR.cardWhite, background: COLOR.orange, padding: "12px 32px" }}>
            SUBSCRIBE — THE NEXT ONE FINDS YOU
          </span>
        </div>
      )}

      {/* progress-rule completion marker */}
      {frame >= F.peak - 20 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: FONT.mono, fontSize: 14, letterSpacing: "0.2em", color: COLOR.grey, opacity: safeRamp(frame, [F.peak - 10, F.peak + 6, dur - 8, dur - 2]) }}>
          100%
        </div>
      )}
    </>
  );
};
