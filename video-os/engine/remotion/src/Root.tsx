import "./index.css";
import { Composition, Folder } from "remotion";
import { fontsReady } from "./fonts";
import { serifReady } from "./nif002/v4/fonts4";
import { OpenerDemo } from "./nif002/v4/scenes/OpenerDemo";
import { EpisodeV4, EPISODE_V4_TOTAL } from "./nif002/v4/EpisodeV4";
import { SfxStem } from "./nif002/v4/audio";
import { V4_BEATS } from "./nif002/v4/beats";
import { HEIGHT, WIDTH, FPS } from "./tokens";
import { LockedFieldDemo } from "./dev/LockedFieldDemo";
import { PrintLanguageDemo } from "./dev/PrintLanguageDemo";
import { ContinuousShotSample } from "./dev/ContinuousShotSample";
import { CollageDemo } from "./dev/CollageDemo";
import { LuckySceneDemo } from "./dev/LuckySceneDemo";
import { AssetsShowcase } from "./dev/AssetsShowcase";
import { LuckySheet } from "./dev/LuckySheet";
import { SceneComposition } from "./dev/SceneComposition";
import { HierarchyDemo, StackDemo, FlowDemo } from "./dev/ArchetypeDemos";
import {
  LuckyDemo,
  SignatureDemo,
  DarkLawDemo,
} from "./dev/CharacterAndChannelDemos";
import { B00, B01, B02, B03, B04, B05, B06, B07, B08, B09, B10, B11, B12, B13, B14, B15, B16, B17, B18, B19, B20, B21, B22, B23, B24, B25, B26, B27, B00v3, B01v3, B02v3, B03v3, B04v3, B05v3, B07v3 } from "./nif002";
import { BEAT_PROPS_DEFAULTS, FIELD } from "./tokens";
import { GrainTile } from "./field/Grain";
import { V2PrimitivesDemo } from "./dev/V2PrimitivesDemo";
import { Episode3StyleDemo, EPISODE3_STYLE_DEMO_TOTAL } from "./dev/Episode3StyleDemo";
import { MassMethodDemo, MASS_METHOD_DEMO_TOTAL } from "./dev/MassMethodDemo";
import { MotionStudyGlide, MOTION_STUDY_GLIDE_TOTAL } from "./dev/MotionStudyGlide";
import { V4_BEATS_NIF003 } from "./nif003/v4/beats";
import { EpisodeV4 as EpisodeV4NIF003, EPISODE_V4_TOTAL as EPISODE_V4_TOTAL_NIF003 } from "./nif003/v4/EpisodeV4";
import { SfxStem as SfxStemNIF003 } from "./nif003/v4/audio";
import { V4_BEATS_NIF004 } from "./nif004/v4/beats";
import { EpisodeV4 as EpisodeV4NIF004, EPISODE_V4_TOTAL as EPISODE_V4_TOTAL_NIF004 } from "./nif004/v4/EpisodeV4";
import { SfxStem as SfxStemNIF004 } from "./nif004/v4/audio";

/**
 * Root.tsx — the composition registry (§11.1 Tier 0).
 *
 * Channel-level project for "Nothing Is Free". Every composition is
 * 1920×1080 @ 30fps (§11.1). Per-episode beat compositions get their own
 * Folder ("EP01", "EP02", …) as they are built at Step 3 (§11).
 *
 * `dev/` holds verification compositions only — never channel output, never
 * rendered by scripts/render-all.mjs (which only picks up EP** ids).
 */

const waitForFonts = async () => {
  await fontsReady;
  return {};
};

const waitForFontsV4 = async () => {
  await Promise.all([fontsReady, serifReady]);
  return {};
};

const dev = (
  id: string,
  component: React.FC,
  seconds: number,
): React.ReactNode => (
  <Composition
    id={id}
    component={component}
    durationInFrames={Math.round(seconds * FPS)}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    calculateMetadata={waitForFonts}
  />
);

/** NIF002 (§11.3) — real durationInFrames + globalStartFrame from
 *  episodes/NIF002/03_transcript/reconcile.json. episodeTotalFrames 30573
 *  (B25 carries a +180f Dark-Law tail past its VO so the closing title
 *  "NOTHING IS FREE." types out fully and holds on black — creator 2026-09-04). */
const NIF002_TOTAL = 30573;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nif002 = (n: string, C: React.FC<any>, durationInFrames: number, globalStartFrame: number) => (
  <Composition
    id={`NIF002-${n}`}
    component={C}
    durationInFrames={durationInFrames}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{
      ...BEAT_PROPS_DEFAULTS,
      beatId: n,
      durationInFrames,
      fps: FPS,
      globalStartFrame,
      episodeTotalFrames: NIF002_TOTAL,
      audioSrc: `audio/nif002/${n}.mp3`,
      audioOffsetMs: 0,
    }}
    calculateMetadata={waitForFonts}
  />
);

/** NIF003 ("You don't pay for TV") — real durationInFrames + globalStartFrame
 *  from episodes/NIF003/03_transcript/reconcile.json. episodeTotalFrames
 *  37230 (Step 2 reconcile, creator accepted 2026-09-05, no Dark-Law tail
 *  applied yet — B29 is this episode's reversal, revisit when it's built). */
const NIF003_TOTAL = 37230;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nif003 = (n: string, C: React.FC<any>, durationInFrames: number, globalStartFrame: number) => (
  <Composition
    id={`NIF003-${n}`}
    component={C}
    durationInFrames={durationInFrames}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{
      ...BEAT_PROPS_DEFAULTS,
      beatId: n,
      durationInFrames,
      fps: FPS,
      globalStartFrame,
      episodeTotalFrames: NIF003_TOTAL,
      audioSrc: `audio/nif003/${n}.mp3`,
      audioOffsetMs: 0,
    }}
    calculateMetadata={waitForFontsV4}
  />
);

/** NIF004 ("Google Maps — the hidden economics of the free map") — real
 *  durationInFrames + globalStartFrame from episodes/NIF004/03_transcript/
 *  reconcile.json. episodeTotalFrames 31654 (Step 2 reconcile, creator accepted
 *  2026-09-09). B30 is this episode's reversal (Dark Law engages mid-beat). */
const NIF004_TOTAL = 31654;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nif004 = (n: string, C: React.FC<any>, durationInFrames: number, globalStartFrame: number) => (
  <Composition
    id={`NIF004-${n}`}
    component={C}
    durationInFrames={durationInFrames}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{
      ...BEAT_PROPS_DEFAULTS,
      beatId: n,
      durationInFrames,
      fps: FPS,
      globalStartFrame,
      episodeTotalFrames: NIF004_TOTAL,
      audioSrc: `audio/nif004/${n}.mp3`,
      audioOffsetMs: 0,
    }}
    calculateMetadata={waitForFontsV4}
  />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="dev">
        {dev("AssetsShowcase", AssetsShowcase, 3)}
        {dev("LuckySheet", LuckySheet, 4)}
        {dev("SceneComposition", SceneComposition, 6)}
        {dev("ContinuousShotSample", ContinuousShotSample, 18)}
        {dev("LuckySceneDemo", LuckySceneDemo, 5)}
        {dev("CollageDemo", CollageDemo, 5)}
        {dev("LockedFieldDemo", LockedFieldDemo, 6)}
        {dev("PrintLanguageDemo", PrintLanguageDemo, 6)}
        {dev("LuckyDemo", LuckyDemo, 5)}
        {dev("V2PrimitivesDemo", V2PrimitivesDemo, 10)}
        <Composition
          id="Episode3StyleDemo"
          component={Episode3StyleDemo}
          durationInFrames={EPISODE3_STYLE_DEMO_TOTAL}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="MassMethodDemo"
          component={MassMethodDemo}
          durationInFrames={MASS_METHOD_DEMO_TOTAL}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="MotionStudyGlide"
          component={MotionStudyGlide}
          durationInFrames={MOTION_STUDY_GLIDE_TOTAL}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          calculateMetadata={waitForFonts}
        />
      </Folder>
      <Folder name="dev-archetypes">
        {dev("HierarchyDemo", HierarchyDemo, 7)}
        {dev("StackDemo", StackDemo, 9)}
        {dev("FlowDemo", FlowDemo, 8)}
      </Folder>
      <Folder name="dev-channel">
        {dev("SignatureDemo", SignatureDemo, 5)}
        {dev("DarkLawDemo", DarkLawDemo, 8)}
      </Folder>

      <Folder name="NIF002">
        {nif002("B00", B00, 277, 0)}
        {nif002("B01", B01, 1134, 277)}
        {nif002("B02", B02, 1153, 1411)}
        {nif002("B03", B03, 1132, 2564)}
        {nif002("B04", B04, 1342, 3696)}
        {nif002("B05", B05, 1477, 5038)}
        {nif002("B06", B06, 841, 6515)}
        {nif002("B07", B07, 1266, 7356)}
        {nif002("B08", B08, 1105, 8622)}
        {nif002("B09", B09, 987, 9727)}
        {nif002("B10", B10, 1129, 10714)}
        {nif002("B11", B11, 992, 11843)}
        {nif002("B12", B12, 1143, 12835)}
        {nif002("B13", B13, 1643, 13978)}
        {nif002("B14", B14, 1007, 15621)}
        {nif002("B15", B15, 836, 16628)}
        {nif002("B16", B16, 781, 17464)}
        {nif002("B17", B17, 553, 18245)}
        {nif002("B18", B18, 673, 18798)}
        {nif002("B19", B19, 1547, 19471)}
        {nif002("B20", B20, 1266, 21018)}
        {nif002("B21", B21, 1407, 22284)}
        {nif002("B22", B22, 1012, 23691)}
        {nif002("B23", B23, 935, 24703)}
        {nif002("B24", B24, 1331, 25638)}
        {nif002("B25", B25, 1240, 26969)}
        {nif002("B26", B26, 1045, 28209)}
        {nif002("B27", B27, 1139, 29254)}
      </Folder>

      <Folder name="NIF002-v4">
        <Composition
          id="NIF002-V4"
          component={EpisodeV4}
          durationInFrames={EPISODE_V4_TOTAL}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          calculateMetadata={waitForFontsV4}
        />
        <Composition
          id="NIF002-V4DEMO"
          component={OpenerDemo}
          durationInFrames={650}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          calculateMetadata={waitForFontsV4}
        />
        {/* SFX-only stem for the DaVinci Fairlight mix — render to a .wav */}
        <Composition
          id="NIF002-SFX"
          component={SfxStem}
          durationInFrames={EPISODE_V4_TOTAL}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      </Folder>
      <Folder name="NIF002-v4-beats">
        {(
          [
            ["B00v4", 277, 0], ["B01v4", 1134, 277], ["B02v4", 1153, 1411], ["B03v4", 1132, 2564],
            ["B04v4", 1342, 3696], ["B05v4", 1477, 5038], ["B06v4", 841, 6515], ["B07v4", 1266, 7356],
            ["B08v4", 1105, 8622], ["B09v4", 987, 9727], ["B10v4", 1129, 10714], ["B11v4", 992, 11843],
            ["B12v4", 1143, 12835], ["B13v4", 1643, 13978], ["B14v4", 1007, 15621], ["B15v4", 836, 16628],
            ["B16v4", 781, 17464], ["B17v4", 553, 18245], ["B18v4", 673, 18798], ["B19v4", 1547, 19471],
            ["B20v4", 1266, 21018], ["B21v4", 1407, 22284], ["B22v4", 1012, 23691], ["B23v4", 935, 24703],
            ["B24v4", 1331, 25638], ["B25v4", 1420, 26969], ["B26v4", 1045, 28389], ["B27v4", 1139, 29434],
          ] as [keyof typeof V4_BEATS, number, number][]
        ).map(([id, dur, start]) => nif002(id, V4_BEATS[id], dur, start))}
      </Folder>

      <Folder name="NIF003-v4-beats">
        {(
          [
            ["B00v4", 311, 0],
            ["B01v4", 1064, 311],
            ["B02v4", 1549, 1375],
            ["B03v4", 1191, 2924],
            ["B04v4", 1679, 4115],
            ["B05v4", 1410, 5794],
            ["B06v4", 1710, 7204],
            ["B07v4", 1009, 8914],
            ["B08v4", 1045, 9923],
            ["B09v4", 1345, 10968],
            ["B10v4", 1672, 12313],
            ["B11v4", 1285, 13985],
            ["B12v4", 580, 15270],
            ["B13v4", 980, 15850],
            ["B14v4", 1134, 16830],
            ["B15v4", 887, 17964],
            ["B16v4", 1360, 18851],
            ["B17v4", 1861, 20211],
            ["B18v4", 899, 22072],
            ["B19v4", 1163, 22971],
            ["B20v4", 714, 24134],
            ["B21v4", 777, 24848],
            ["B22v4", 1218, 25625],
            ["B23v4", 926, 26843],
            ["B24v4", 928, 27769],
            ["B25v4", 1513, 28697],
            ["B26v4", 1012, 30210],
            ["B27v4", 829, 31222],
            ["B28v4", 1405, 32051],
            ["B29v4", 1542, 33456],
            ["B30v4", 892, 34998],
            ["B31v4", 705, 35890],
            ["B32v4", 635, 36595],
          ] as [keyof typeof V4_BEATS_NIF003, number, number][]
        ).map(([id, dur, start]) => nif003(id, V4_BEATS_NIF003[id], dur, start))}
      </Folder>

      <Folder name="NIF003-v4">
        <Composition
          id="NIF003-V4"
          component={EpisodeV4NIF003}
          durationInFrames={EPISODE_V4_TOTAL_NIF003}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          calculateMetadata={waitForFontsV4}
        />
        {/* SFX-only stem for the DaVinci Fairlight mix — render to a .wav */}
        <Composition
          id="NIF003-SFX"
          component={SfxStemNIF003}
          durationInFrames={EPISODE_V4_TOTAL_NIF003}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      </Folder>

      <Folder name="NIF004-v4-beats">
        {(
          [
            ["B00v4", 493, 0], ["B01v4", 882, 493], ["B02v4", 1093, 1375], ["B03v4", 884, 2468],
            ["B04v4", 1081, 3352], ["B05v4", 1107, 4433], ["B06v4", 1079, 5540], ["B07v4", 901, 6619],
            ["B08v4", 1191, 7520], ["B09v4", 1110, 8711], ["B10v4", 1389, 9821], ["B11v4", 920, 11210],
            ["B12v4", 784, 12130], ["B13v4", 637, 12914], ["B14v4", 827, 13551], ["B15v4", 1038, 14378],
            ["B16v4", 764, 15416], ["B17v4", 748, 16180], ["B18v4", 1168, 16928], ["B19v4", 949, 18096],
            ["B20v4", 942, 19045], ["B21v4", 1038, 19987], ["B22v4", 654, 21025], ["B23v4", 1470, 21679],
            ["B24v4", 1114, 23149], ["B25v4", 834, 24263], ["B26v4", 892, 25097], ["B27v4", 1052, 25989],
            ["B28v4", 748, 27041], ["B29v4", 657, 27789], ["B30v4", 1186, 28446], ["B31v4", 748, 29632],
            ["B32v4", 678, 30380], ["B33v4", 596, 31058],
          ] as [keyof typeof V4_BEATS_NIF004, number, number][]
        ).map(([id, dur, start]) => nif004(id, V4_BEATS_NIF004[id], dur, start))}
      </Folder>

      <Folder name="NIF004-v4">
        <Composition
          id="NIF004-V4"
          component={EpisodeV4NIF004}
          durationInFrames={EPISODE_V4_TOTAL_NIF004}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          calculateMetadata={waitForFontsV4}
        />
        {/* SFX-only stem for the DaVinci Fairlight mix — render to a .wav */}
        <Composition
          id="NIF004-SFX"
          component={SfxStemNIF004}
          durationInFrames={EPISODE_V4_TOTAL_NIF004}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      </Folder>

      <Folder name="NIF002-v3">
        {nif002("B00v3", B00v3, 277, 0)}
        {nif002("B01v3", B01v3, 1134, 277)}
        {nif002("B02v3", B02v3, 1153, 1411)}
        {nif002("B03v3", B03v3, 1132, 2564)}
        {nif002("B04v3", B04v3, 1342, 3696)}
        {nif002("B05v3", B05v3, 1477, 5038)}
        {nif002("B07v3", B07v3, 1266, 7356)}
      </Folder>

      {/* one-time bake targets — never rendered into an episode */}
      <Composition
        id="bake-grain-tile"
        component={GrainTile}
        durationInFrames={1}
        fps={FPS}
        width={FIELD.grain.tilePx}
        height={FIELD.grain.tilePx}
      />
    </>
  );
};
