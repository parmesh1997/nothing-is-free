import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, FONT, HEIGHT } from "../../tokens";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { useBeatTiming } from "../timing";
import { V3Beat } from "../v3/V3Beat";
import { ControlRoom, BOARD } from "../v3/sets";
import { useStage3, bump, cyc } from "../v3/stage3";
import { V3 } from "../v3/palette";

/**
 * NIF002 B03 — v3. The scale of the rent, on the control-room board.
 * $390B/yr in-app ad spend → 80¢ of every phone-ad dollar → a few billion
 * auctions an hour, in fractions of a cent → "you are a rounding error that
 * happens constantly." Peak: "rounding error".
 */
export const B03v3: React.FC<BeatProps> = (props) => {
  const dur = props.durationInFrames;
  const vo = useBeatTiming("B03");
  const F = {
    rent: vo.at("rent", 8),
    spend: vo.at("390", 120),
    eighty: vo.at("80", 353),
    billions: vo.at("billion", 717),
    fractions: vo.at("fractions", 880),
    peak: vo.at("rounding", 960),
  };
  return (
    <V3Beat
      props={props}
      beat="B03"
      source="Emarketer / IAB — mobile in-app ad spend, 2024"
      set={<ControlRoom />}
      cam={[
        { at: 0, zoom: 1.0, y: 2 },
        { at: F.spend, zoom: 1.03, y: -2 },
        { at: F.peak, zoom: 1.08, y: 4 },
        { at: dur, zoom: 1.11, y: 6 },
      ]}
    >
      <Content dur={dur} F={F} />
    </V3Beat>
  );
};

const Content: React.FC<{ dur: number; F: Record<string, number> }> = ({ dur, F }) => {
  const frame = useCurrentFrame();
  const s = useStage3(dur, { disperseFrames: 28, holdFrames: 12 });

  const spend = interpolate(frame, [F.spend, F.spend + 90], [0, 390], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });
  const bar = interpolate(frame, [F.eighty, F.eighty + 50], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });
  const perHr = 3_100_000_000 + Math.floor(cyc(frame, 5) * 2_400_000_000);

  return (
    <>
      {/* everything renders on the board */}
      <div style={{ position: "absolute", left: BOARD.x, top: BOARD.y, width: BOARD.w, height: BOARD.h, opacity: s.body(frame) * interpolate(frame, [F.peak - 20, F.peak + 6], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), color: COLOR.cardWhite, fontFamily: FONT.sans, overflow: "hidden" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.14em", color: V3.muted }}>ADVERTISERS SPEND, PER YEAR, ON ADS INSIDE PHONE APPS</div>

        {/* $390B hero */}
        {frame >= F.spend - 8 && (
          <div style={{ fontFamily: FONT.hero, fontSize: 180, lineHeight: 0.9, color: V3.accent, marginTop: 4, scale: String(bump(frame, F.spend + 90, 0.05, 20)) }}>
            ${Math.round(spend)}B
          </div>
        )}

        {/* 80¢ bar */}
        {frame >= F.eighty - 6 && (
          <div style={{ marginTop: 18, opacity: interpolate(frame, [F.eighty - 6, F.eighty + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 26 }}>
              <span style={{ color: V3.accent }}>{Math.round(bar * 100)}¢</span> of every phone-ad dollar now goes here
            </div>
            <div style={{ position: "relative", width: "100%", height: 40, border: `3px solid ${COLOR.cardWhite}`, marginTop: 10 }}>
              <div style={{ position: "absolute", inset: 0, width: `${bar * 100}%`, background: V3.accent }} />
            </div>
          </div>
        )}

        {/* a few billion an hour */}
        {frame >= F.billions - 6 && frame < F.peak && (
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: 24, opacity: interpolate(frame, [F.billions, F.billions + 12, F.peak - 12, F.peak], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            AUCTIONS / HOUR: <span style={{ color: V3.accent, fontFamily: FONT.hero, fontSize: 34, fontVariantNumeric: "tabular-nums" }}>{perHr.toLocaleString("en-US")}</span>
            <div style={{ fontFamily: FONT.sans, fontSize: 18, color: V3.muted, marginTop: 4 }}>each one settles in fractions of a cent</div>
          </div>
        )}
      </div>

      <Bloom window={[F.peak - 6, F.peak + 10, F.peak + 50, F.peak + 80]} radius={320} x="50%" y="50%" intensity={0.68} />

      {/* ── peak: you are a rounding error (over the dark screen) ── */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.26, textAlign: "center", opacity: interpolate(frame, [F.peak, F.peak + 12, dur - 20, dur - 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), translate: `0px ${(1 - Math.min(1, springIn({ frame, fps: 30, delay: F.peak, durationInFrames: 18 }))) * 40}px` }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 88, color: COLOR.cardWhite, letterSpacing: "0.02em" }}>
            YOU ARE A <span style={{ color: V3.accent }}>ROUNDING ERROR</span>.
          </div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 28, color: "#C9C3B4", marginTop: 12 }}>
            that happens, constantly.
          </div>
        </div>
      )}
    </>
  );
};
