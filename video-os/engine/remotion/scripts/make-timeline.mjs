/**
 * make-timeline.mjs — Step 4 (§10.5). The whole Resolve timeline as one OpenTimelineIO file,
 * built from measured beat geometry, so assembly is one import instead of hundreds of
 * clip-by-clip MCP calls — and so it can be rebuilt in a second when a beat changes.
 *
 *   (from engine/remotion/)
 *   node scripts/make-timeline.mjs ../../episodes/NIF0NN [--out 08_conform/timeline.otio]
 *        [--v1 "05_layers/{beat}-scene.mov"] [--v2 "05_layers/{beat}-elements.mov"]
 *        [--v3 "05_layers/{beat}-text.mov"] [--a1 "02_narration/{beat}.mp3"] [--all]
 *
 * Tracks follow §10.5: V1 scene base · V2 element layers · V3 text · A1 voiceover.
 * Every clip starts on its beat's globalStartFrame from 03_transcript/timing.json. A missing
 * file becomes a gap and is listed, unless --all (then the clip is placed anyway, offline).
 *
 * Import in the Resolve MCP (one call):
 *   mp = project.GetMediaPool()
 *   mp.ImportTimelineFromFile(r"<episode>\08_conform\timeline.otio",
 *                             {"timelineName": "NIF0NN", "importSourceClips": True})
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const out = opt("--out", "08_conform/timeline.otio");
const patterns = {
  V1: opt("--v1", "05_layers/{beat}-scene.mov"),
  V2: opt("--v2", "05_layers/{beat}-elements.mov"),
  V3: opt("--v3", "05_layers/{beat}-text.mov"),
  A1: opt("--a1", "02_narration/{beat}.mp3"),
};
const all = args.includes("--all");
const ep = resolve(args.filter((a) => a !== "--all")[0] ?? ".");
const code = ep.split(/[\\/]/).pop();

const timing = JSON.parse(readFileSync(join(ep, "03_transcript/timing.json"), "utf8"));
const fps = timing.fps;
const beats = Object.entries(timing.beats)
  .map(([id, b]) => ({ id, start: b.globalStartFrame, dur: b.durationInFrames }))
  .sort((a, b) => a.start - b.start);

const RT = (v) => ({ OTIO_SCHEMA: "RationalTime.1", rate: fps, value: v });
const TR = (s, d) => ({ OTIO_SCHEMA: "TimeRange.1", start_time: RT(s), duration: RT(d) });
const base = { effects: [], markers: [], metadata: {}, enabled: true };
const gap = (d) => ({ OTIO_SCHEMA: "Gap.1", name: "", source_range: TR(0, d), ...base });
const clip = (name, file, d) => ({
  OTIO_SCHEMA: "Clip.2", name, source_range: TR(0, d), ...base,
  media_references: { DEFAULT_MEDIA: { OTIO_SCHEMA: "ExternalReference.1", name, target_url: pathToFileURL(file).href, available_range: null, metadata: {} } },
  active_media_reference_key: "DEFAULT_MEDIA",
});

const missing = [];
const track = (name, kind, pattern) => {
  const children = [];
  let cursor = 0;
  for (const b of beats) {
    if (b.start > cursor) children.push(gap(b.start - cursor));
    const file = join(ep, pattern.replaceAll("{beat}", b.id));
    if (existsSync(file) || all) children.push(clip(`${b.id}-${name}`, file, b.dur));
    else {
      missing.push(`${name} ${b.id}`);
      children.push(gap(b.dur));
    }
    cursor = b.start + b.dur;
  }
  return { OTIO_SCHEMA: "Track.1", name, kind, source_range: null, children, effects: [], markers: [], metadata: {}, enabled: true };
};

const timeline = {
  OTIO_SCHEMA: "Timeline.1",
  name: code,
  global_start_time: null,
  metadata: { source: "make-timeline.mjs", fps, beats: beats.length },
  tracks: {
    OTIO_SCHEMA: "Stack.1", name: "tracks", source_range: null, effects: [], markers: [], metadata: {}, enabled: true,
    children: [track("V1", "Video", patterns.V1), track("V2", "Video", patterns.V2), track("V3", "Video", patterns.V3), track("A1", "Audio", patterns.A1)],
  },
};

const outPath = resolve(ep, out);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(timeline, null, 1));
const total = beats.at(-1).start + beats.at(-1).dur;
console.log(`make-timeline · ${code} · ${beats.length} beats · ${(total / fps / 60).toFixed(2)} min @ ${fps} fps → ${out}`);
if (missing.length) console.log(`  ${missing.length} missing (placed as gaps): ${missing.slice(0, 12).join(", ")}${missing.length > 12 ? " …" : ""}`);
