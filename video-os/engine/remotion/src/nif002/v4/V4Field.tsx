import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT } from "../../tokens";
import { Grain } from "../../field/Grain";
import { Grid } from "../../field/Grid";
import { ProgressRule } from "../../field/ProgressRule";
import { SourceTag } from "../../field/SourceTag";

/**
 * V4Field — the locked bed for v4 beats.
 *
 * The cream paper + faint grid + corner weight are the CONSTANT background —
 * "80% of it will be background… the background stays." Scenes are built ON this
 * bed and blend into it; they are the caller's `children`.
 *
 * Depth pass (creator 2026-09-03: "it is coming to the depth, the shadow — we can
 * do it better… a little bit of saturation… depth on the field"):
 *   · a warm top-left KEY-LIGHT bloom (the one light everything is lit by)
 *   · a soft warm GROUND POOL in the lower third — shade, not a floor line
 *   · a large far-corner ambient-occlusion wash (bottom-right)
 *   · a heavier, softer CORNER VIGNETTE so the frame has real weight at the edges
 *   · a faint vertical wall-gradient so the cream reads as a lit surface in space
 * None of it is touched by a scene's push; it is the room the scene sits in.
 */
export const V4Field: React.FC<{
  /** 0..1 episode progress for the rule. */
  progress: number;
  globalFrame?: number;
  source?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ progress, globalFrame, source, children }) => {
  const local = useCurrentFrame();
  // the field itself "arrives" in the first ~0.6s (creator: "the backgrounds are
  // coming in for the first two seconds") — a quiet settle, not a hard cut.
  const settle = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
      {/* vertical wall gradient — the cream is a lit surface, brighter up-left */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(160deg, #FBF6E9 0%, #F6F2E7 46%, #EFE9D8 100%)",
          pointerEvents: "none",
        }}
      />
      {/* warm key-light bloom, top-left — the single light source */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(80% 62% at 12% -6%, rgba(255,244,214,0.92) 0%, rgba(255,244,214,0.28) 34%, rgba(255,244,214,0) 62%)",
          opacity: 0.7 + settle * 0.3,
          pointerEvents: "none",
        }}
      />
      {/* far-corner ambient occlusion, bottom-right — depth away from the light */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 96% at 104% 112%, rgba(120,86,44,0.24) 0%, rgba(120,86,44,0.08) 40%, rgba(120,86,44,0) 66%)",
          pointerEvents: "none",
        }}
      />
      {/* soft warm ground pool — the scene stands in a pool of shade, no hard
          floor line; kept above the text lane so it doesn't muddy captions */}
      <AbsoluteFill
        style={{
          top: Math.round(HEIGHT * 0.52),
          bottom: Math.round(HEIGHT * 0.2),
          background:
            "linear-gradient(180deg, rgba(74,52,32,0) 0%, rgba(74,52,32,0.05) 48%, rgba(74,52,32,0.12) 88%, rgba(74,52,32,0.04) 100%)",
          pointerEvents: "none",
        }}
      />

      <Grid globalFrame={globalFrame ?? local} />
      {/* Vignette removed from Episode 3 onward (creator, 2026-09-05) — the
          corner darkening now happens by hand in the DaVinci Resolve grade
          instead of being baked in here. The other depth layers above
          (key-light bloom, far-corner AO, ground pool) are untouched. */}

      {children}

      <Grain />
      <ProgressRule progress={progress} />
      <SourceTag>{source}</SourceTag>
    </AbsoluteFill>
  );
};
