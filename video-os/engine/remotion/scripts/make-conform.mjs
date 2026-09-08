// Generate DaVinci-importable timeline files (EDL + FCP7 XML) that lay the 28
// NIF002-B##v4 ProRes beats end-to-end, hard cuts. Add the cross-dissolves in
// Resolve (select all → Add 10 Frame Dissolve) — see 08_conform/davinci-finish-guide.md.
//
//   node scripts/make-conform.mjs               → reads out/master/*.mov durations
//   node scripts/make-conform.mjs --review      → reads out/review/*.mp4 instead
import { spawnSync } from "node:child_process";
import { existsSync, writeFileSync, mkdirSync } from "node:fs";

const FPS = 30;
const review = process.argv.includes("--review");
const dir = review ? "out/review" : "out/master";
const ext = review ? "mp4" : "mov";
const ffprobe = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";
const outDir = "../../episodes/NIF002/08_conform";
mkdirSync(outDir, { recursive: true });

const beats = Array.from({ length: 28 }, (_, i) => `B${String(i).padStart(2, "0")}`);
const files = beats.map((b) => `${dir}/NIF002-${b}v4.${ext}`);
const missing = files.filter((f) => !existsSync(f));
if (missing.length) {
  console.log("MISSING:", missing.join(" "));
  console.log("render first: node scripts/render-v4.mjs" + (review ? "" : " --prores"));
  process.exit(1);
}

const framesOf = (f) => {
  const r = spawnSync(ffprobe, ["-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries", "stream=nb_read_frames,duration", "-of", "csv=p=0", f], { encoding: "utf8" });
  const parts = (r.stdout || "").trim().split(",");
  const nb = parseInt(parts[0], 10);
  if (Number.isFinite(nb) && nb > 0) return nb;
  return Math.round(parseFloat(parts[1] || "0") * FPS);
};

const tc = (frames) => {
  const f = frames % FPS;
  const s = Math.floor(frames / FPS) % 60;
  const m = Math.floor(frames / (FPS * 60)) % 60;
  const h = Math.floor(frames / (FPS * 3600));
  const p = (n) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
};

const lens = files.map(framesOf);
let acc = 0;
const clips = beats.map((b, i) => {
  const start = acc;
  acc += lens[i];
  return { b, file: files[i].split("/").pop(), abs: files[i], frames: lens[i], recIn: start, recOut: acc };
});
const total = acc;
console.log("durations (frames):", lens.join(" "));
console.log(`total ${total}f = ${tc(total)}  (${(total / FPS / 60).toFixed(2)} min)`);

// ── EDL ──────────────────────────────────────────────────────────────────────
const REC0 = 3600 * FPS; // 01:00:00:00 record start
let edl = `TITLE: NIF002\nFCM: NON-DROP FRAME\n\n`;
clips.forEach((c, i) => {
  const n = String(i + 1).padStart(3, "0");
  edl += `${n}  ${c.b.padEnd(8)} V     C        ${tc(0)} ${tc(c.frames)} ${tc(REC0 + c.recIn)} ${tc(REC0 + c.recOut)}\n`;
  edl += `* FROM CLIP NAME: ${c.file}\n\n`;
});
writeFileSync(`${outDir}/NIF002.edl`, edl);

// ── FCP7 XML (relinks from pool / by path; controllable name) ────────────────
const winPath = (p) => "file://localhost/" + p.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1:");
const clipXml = (c, i) => `
        <clipitem id="${c.b}">
          <name>${c.file}</name>
          <duration>${c.frames}</duration>
          <rate><timebase>${FPS}</timebase><ntsc>FALSE</ntsc></rate>
          <in>0</in><out>${c.frames}</out>
          <start>${c.recIn}</start><end>${c.recOut}</end>
          <file id="file-${i}">
            <name>${c.file}</name>
            <pathurl>${winPath(process.cwd() + "\\" + c.abs.replace(/\//g, "\\"))}</pathurl>
            <rate><timebase>${FPS}</timebase><ntsc>FALSE</ntsc></rate>
            <duration>${c.frames}</duration>
            <media><video><samplecharacteristics><width>1920</width><height>1080</height></samplecharacteristics></video></media>
          </file>
        </clipitem>`;
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
  <sequence id="NIF002">
    <name>NIF002_conform_v1</name>
    <duration>${total}</duration>
    <rate><timebase>${FPS}</timebase><ntsc>FALSE</ntsc></rate>
    <media>
      <video>
        <format><samplecharacteristics><width>1920</width><height>1080</height><rate><timebase>${FPS}</timebase></rate></samplecharacteristics></format>
        <track>${clips.map(clipXml).join("")}
        </track>
      </video>
    </media>
  </sequence>
</xmeml>`;
writeFileSync(`${outDir}/NIF002.fcpxml`, xml);

console.log(`\nwrote:\n  ${outDir}/NIF002.edl\n  ${outDir}/NIF002.fcpxml`);
console.log("import into Resolve, then select all clips → Add 10 Frame Dissolve (keep B24→B25 a hard cut).");
