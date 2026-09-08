import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BeatProps, episodeProgress, globalFrame } from "../../tokens";
import { useBeatTiming } from "../timing";
import { V4Field } from "./V4Field";
import { Interior, Park, Street } from "./locations";
import { DotField } from "./nodegraph";
import { MOVE } from "./language";

export type Loc = "room" | "living" | "bedroom" | "dining" | "office" | "park" | "street" | "bare";

// beat-to-beat black push (runbook §18/19, 2026-09-05) — solid-black hold on
// each side of the cut, in frames @ 30fps. Combined visible push window ≈
// (TRANSITION_HOLD + TRANSITION_RAMP) * 2 ≈ 42f ≈ 1.4s — inside the
// requested 1–1.5s. Tune both here, once, for every v4 beat.
export const TRANSITION_HOLD = 12;
export const TRANSITION_RAMP = 9;

/**
 * V4Beat — the wrapper every NIF002 v4 beat renders inside (creator, 2026-09-03).
 *
 *   · V4Field at the GLOBAL episode phase (grid drift + progress rule continuous
 *     across cuts, §11.3)
 *   · the sparse coded set-dressing (Street / Interior) on ~3 beats, else bare
 *   · optional dotted systems-map ground for the flow / node-graph data beats
 *   · ONE gentle continuous push — no per-beat zooms
 *   · the beat's VO, id stripped of a trailing "v4" (the mp3s are B00.mp3 …)
 *   · the whisper timing hook, handed to the content as `vo`
 *
 * 100% code — no generated stills (creator 2026-09-03: "I don't need the image
 * option anymore"). A beat: `<V4Beat props={props} beat="B03" dots> <Content/> </V4Beat>`.
 */
export const V4Beat: React.FC<{
  props: BeatProps;
  /** e.g. "B03" — also accepts the composition id and strips "v4". */
  beat?: string;
  source?: React.ReactNode;
  /** skip the room — just the cream wall (hero number / full-frame diagram). */
  bareRoom?: boolean;
  /** the location the beat is set in — only ~3 beats use one (creator: first /
   *  centre / last); every other beat is bare cream + grid. default "bare". */
  location?: Loc;
  /** systems-map beat: lay the dotted-grid ground over the field (flow beats). */
  dots?: boolean;
  /** one or more reaction pushes — the camera goes IN to a point, holds, comes
   *  back (creator: "zoom into the face… we will zoom back"). `x`/`y` are % of
   *  frame. Applied to the whole scene layer (kept modest so lane text barely
   *  shifts). */
  zooms?: { at: number; hold?: number; x?: string; y?: string; scale?: number }[];
  /** camera: [zoomStart, zoomEnd] over the beat. default a hair of push. */
  push?: [number, number];
  /** dark-law crossfade: global frame where paper→ink begins (B25 only). */
  darkLawAt?: number;
  /** which episode's public/audio/<dir>/ folder the VO comes from. Default
   *  "nif002" for backward compat with existing NIF002 renders — every other
   *  episode (NIF003+) must pass its own id explicitly, or it silently plays
   *  NIF002's audio (bug found 2026-09-05 building NIF003). */
  audioDir?: string;
  /** skip the beat-to-beat black-push overlay — NIF003 onward (creator
   *  2026-09-06 §22.7): beats render clean, transitions are added in Resolve.
   *  Each beat clip starts and ends on its full picture, no fade. */
  noTransition?: boolean;
  /** per-beat SFX layer, rendered alongside the VO so per-beat renders carry
   *  sound (NIF003 §22.7). Pass `<BeatSfx beat="B01" />` from the beat wrapper. */
  sfx?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ props, beat, source, bareRoom = false, location = "bare", dots = false, zooms, push = [1, 1.03], darkLawAt, audioDir = "nif002", noTransition = false, sfx, children }) => {
  const frame = useCurrentFrame();
  const dur = props.durationInFrames;
  const id = (beat ?? props.beatId ?? "B00").replace(/v4$/i, "");
  const gf = globalFrame(frame, props);

  const zoom = interpolate(frame, [0, dur], push, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: MOVE });

  // reaction pushes — pick the one whose window covers this frame
  let rz = 1;
  let rzOrigin = "50% 45%";
  for (const z of zooms ?? []) {
    const hold = z.hold ?? 24;
    const s = z.scale ?? 1.4;
    const v = interpolate(frame, [z.at, z.at + 10, z.at + 10 + hold, z.at + 24 + hold], [1, s, s, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: MOVE });
    if (v > rz) {
      rz = v;
      rzOrigin = `${z.x ?? "50%"} ${z.y ?? "42%"}`;
    }
  }
  const dark = darkLawAt === undefined ? 0 : interpolate(gf, [darkLawAt, darkLawAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const loc = bareRoom ? "bare" : location;

  // the set-dressing arrives in the first ~0.6s, then settles (creator: "the
  // backgrounds are coming in for the first two seconds, then Lucky…").
  const envReveal = interpolate(frame, [4, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const Env = () => {
    switch (loc) {
      case "park": return <Park reveal={envReveal} />;
      case "street": return <Street reveal={envReveal} />;
      case "bedroom": return <Interior decor="bedroom" reveal={envReveal} />;
      case "dining": return <Interior decor="dining" reveal={envReveal} />;
      case "office": return <Interior decor="office" reveal={envReveal} />;
      case "living": return <Interior decor="living" reveal={envReveal} />;
      // "bare" / "room" / anything else — the cream field is the whole bed
      default: return null;
    }
  };

  return (
    <AbsoluteFill>
      <V4Field progress={episodeProgress(frame, props)} globalFrame={gf} source={dark > 0.5 ? undefined : source}>
        {dots && dark < 0.5 && <DotField reveal={interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
        {/* the world — Env + the beat content — under the gentle push AND any
            reaction zoom. */}
        <AbsoluteFill style={{ transformOrigin: rzOrigin, transform: `scale(${rz.toFixed(3)})` }}>
          <AbsoluteFill
            style={{ transformOrigin: "50% 42%", transform: `scale(${zoom})` }}
          >
            <Env />
          </AbsoluteFill>
          {/* dark-law ink wash (B25) — over the field + set, UNDER the beat
              content so the reversal text stays readable on the ink. */}
          {dark > 0 && <AbsoluteFill style={{ background: "#111111", opacity: dark, pointerEvents: "none" }} />}
          {/* the reserved TEXT LANE — a permanent soft cream floor over the
              bottom ~22%. */}
          {dark < 0.5 && (
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(0deg, rgba(246,242,231,0.99) 0%, rgba(246,242,231,0.97) 14%, rgba(246,242,231,0.6) 19%, rgba(246,242,231,0) 24%)",
                pointerEvents: "none",
              }}
            />
          )}
          <AbsoluteFill
            style={{ transformOrigin: "50% 42%", transform: `scale(${zoom})` }}
          >{children}</AbsoluteFill>
        </AbsoluteFill>

        {/* beat-to-beat black push (creator, 2026-09-05: cuts were reading too
            fast — needs "one to one-point-five seconds" of black between
            beats). The concat is hard cuts (the bundled ffmpeg has no xfade),
            so this is TWO independent ramps that meet at the cut: beat N holds
            solid black for its last TAIL_HOLD frames, beat N+1 opens holding
            solid black for its first HEAD_HOLD frames — the hard cut lands
            while both sides are already full black, so it reads as one
            continuous push-to-black-and-back. Ramp + hold + hold + ramp ≈
            (RAMP+HOLD)*2 frames of visible push, tuned to ~1.3-1.5s total.
            Always black now (not cream) — this replaces the old "dissolve-
            through-cream" look. B25's own paper→ink narrative wash (the `dark`
            wash above) is untouched; this is only the edge overlay. */}
        {!noTransition && (
          <AbsoluteFill
            style={{
              background: "#111111",
              opacity: interpolate(
                frame,
                [
                  0,
                  TRANSITION_HOLD,
                  TRANSITION_HOLD + TRANSITION_RAMP,
                  dur - TRANSITION_HOLD - TRANSITION_RAMP,
                  dur - TRANSITION_HOLD,
                  dur - 1,
                ],
                [1, 1, 0, 0, 1, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
              pointerEvents: "none",
            }}
          />
        )}
      </V4Field>

      <Audio src={staticFile(`audio/${audioDir}/${id}.mp3`)} delayRenderTimeoutInMilliseconds={60_000} />
      {sfx}
    </AbsoluteFill>
  );
};

/** shared: a beat's VO timing, keyed off its stripped id. */
export const useVO = (beat: string) => useBeatTiming(beat.replace(/v4$/i, ""));
