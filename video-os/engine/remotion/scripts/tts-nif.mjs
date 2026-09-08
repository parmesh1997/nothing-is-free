#!/usr/bin/env node
/**
 * tts-nif.mjs — Step 2 VO generation (runbook §22.11).
 *
 * Reads an episode's `01_script/script.md`, pulls each beat's `v3 TAGGED`
 * block, generates it with ElevenLabs v3 + the NIF clone, and writes
 * `02_narration/B##.mp3`.
 *
 *   node scripts/tts-nif.mjs NIF004                # generate every missing beat
 *   node scripts/tts-nif.mjs NIF004 --dry-run      # list beats + char/credit estimate, generate nothing
 *   node scripts/tts-nif.mjs NIF004 --only B00,B30 # just these
 *   node scripts/tts-nif.mjs NIF004 --force B03    # RE-generate B03 (overwrites — use only for a broken take)
 *
 * RULES (runbook §22.11):
 *   · ONE take per beat. A beat whose mp3 already exists is SKIPPED. No
 *     regeneration except an explicit --force <beat> for a genuinely broken take.
 *   · Model is eleven_v3 — the `v3 TAGGED` block is sent as-is, tags and all.
 *   · Key comes from engine/remotion/.env (ELEVENLABS_API_KEY), never a flag.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ENGINE = resolve(HERE, "..");

// ── config — matches runbook §22.11. Change here, once. ──────────────────────
const VOICE_ID = "zLWsrQYpIfTgCZ3GXmUr"; // NIF JUJU v2
const MODEL_ID = "eleven_v3";
const VOICE_SETTINGS = { stability: 0.5, use_speaker_boost: true };
const OUTPUT_FORMAT = "mp3_44100_192";
const CREDITS_PER_CHAR = 0.64; // v3, measured 2026-09-09 (382 cr / ~600 chars) — estimate only

const FFPROBE =
  process.env.FFPROBE ||
  "C:/Users/parme/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffprobe.exe";

// ── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const positional = argv.filter((a) => !a.startsWith("--"));
const epArg = positional[0];
if (!epArg) {
  console.error("usage: node scripts/tts-nif.mjs <NIF004 | path/to/episode> [--dry-run] [--only B00,B01] [--force B03]");
  process.exit(1);
}
const dryRun = flags.has("--dry-run");
const onlyList = valAfter("--only")?.split(",").map((s) => s.trim().toUpperCase()) ?? null;
const forceList = valAfter("--force")?.split(",").map((s) => s.trim().toUpperCase()) ?? [];
function valAfter(flag) {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null;
}

const epDir = epArg.includes("/") || epArg.includes("\\")
  ? resolve(epArg)
  : resolve(ENGINE, "..", "..", "episodes", epArg);
const scriptPath = join(epDir, "01_script", "script.md");
const outDir = join(epDir, "02_narration");
if (!existsSync(scriptPath)) {
  console.error(`no script at ${scriptPath}`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

// ── key ─────────────────────────────────────────────────────────────────────
const envTxt = existsSync(join(ENGINE, ".env")) ? readFileSync(join(ENGINE, ".env"), "utf8") : "";
const KEY = (envTxt.match(/^ELEVENLABS_API_KEY=(.+)$/m) || [])[1]?.trim() || process.env.ELEVENLABS_API_KEY;
if (!KEY && !dryRun) {
  console.error("no ELEVENLABS_API_KEY in engine/remotion/.env");
  process.exit(1);
}

// ── parse the script into beats ─────────────────────────────────────────────
const md = readFileSync(scriptPath, "utf8");
// split on the ━━━ B## ━━━ headers, keep the id
const parts = md.split(/^━+ (B\d\d) ━+.*$/m);
// parts = [preamble, "B00", body0, "B01", body1, ...]
const beats = [];
for (let i = 1; i < parts.length; i += 2) {
  const id = parts[i];
  const body = parts[i + 1] || "";
  beats.push({ id, tagged: pullBlock(body, "v3 TAGGED"), plainWords: countWords(pullBlock(body, "PLAIN")) });
}

/** text of a labelled block (`PLAIN` / `v3 TAGGED`) up to the next label, NOTE, rule, or end. */
function pullBlock(body, label) {
  const re = new RegExp(`^\\s*${label}\\s*$`, "m");
  const m = re.exec(body);
  if (!m) return "";
  const rest = body.slice(m.index + m[0].length).split(/\r?\n/);
  const out = [];
  for (const raw of rest) {
    const line = raw.trim();
    if (/^(PLAIN|v3 TAGGED|NOTE\b|━|─{3,}|-{3,})/.test(line)) break;
    if (line) out.push(line);
  }
  return out.join(" ").replace(/\s+/g, " ").trim();
}
function countWords(s) {
  return s ? s.replace(/\[[^\]]*\]/g, " ").trim().split(/\s+/).filter(Boolean).length : 0;
}

let selected = beats.filter((b) => b.tagged);
if (onlyList) selected = selected.filter((b) => onlyList.includes(b.id));
const missingText = beats.filter((b) => !b.tagged).map((b) => b.id);
if (missingText.length) console.log(`⚠️  no 'v3 TAGGED' block for: ${missingText.join(", ")}`);

// ── report / dry-run ────────────────────────────────────────────────────────
console.log(`\nepisode: ${epDir}`);
console.log(`model: ${MODEL_ID}  ·  voice: ${VOICE_ID}  ·  ${OUTPUT_FORMAT}  ·  settings ${JSON.stringify(VOICE_SETTINGS)}\n`);

let estChars = 0, willGen = 0, skipped = 0;
for (const b of selected) {
  const mp3 = join(outDir, `${b.id}.mp3`);
  const exists = existsSync(mp3);
  const forced = forceList.includes(b.id);
  const status = exists && !forced ? "skip (exists)" : forced ? "FORCE re-gen" : "generate";
  if (exists && !forced) skipped++;
  else {
    willGen++;
    estChars += b.tagged.length;
  }
  console.log(`  ${b.id}  ${String(b.tagged.length).padStart(4)} chars  ${String(b.plainWords).padStart(3)}w  ${status}`);
}
console.log(`\n  ${willGen} to generate, ${skipped} skipped  ·  ~${estChars} chars  ·  est ~${Math.round(estChars * CREDITS_PER_CHAR).toLocaleString()} credits`);

if (dryRun) {
  console.log("\n--dry-run — nothing generated.");
  process.exit(0);
}
if (willGen === 0) {
  console.log("\nnothing to do.");
  process.exit(0);
}

// ── generate ────────────────────────────────────────────────────────────────
let totalCredits = 0;
for (const b of selected) {
  const mp3 = join(outDir, `${b.id}.mp3`);
  if (existsSync(mp3) && !forceList.includes(b.id)) continue;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=${OUTPUT_FORMAT}`,
    {
      method: "POST",
      headers: { "xi-api-key": KEY, "content-type": "application/json" },
      body: JSON.stringify({ text: b.tagged, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS }),
    },
  );
  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !ct.includes("audio")) {
    console.error(`  ${b.id}  FAIL ${res.status}  ${(await res.text()).slice(0, 300)}`);
    console.error("  stopping — fix and re-run (done beats are skipped).");
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(mp3, buf);
  const cost = Number(res.headers.get("x-credits-used") || res.headers.get("character-cost") || 0) || Math.round(b.tagged.length * CREDITS_PER_CHAR);
  totalCredits += cost;
  let wpm = "?";
  try {
    const dur = parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]).toString().trim());
    wpm = (b.plainWords / (dur / 60)).toFixed(0);
    if (Math.abs(Number(wpm) - 134) / 134 > 0.15) wpm += " ⚠️";
  } catch {}
  console.log(`  ${b.id}  ✓  ${(buf.length / 1024).toFixed(0)} KB  ${wpm} wpm  ~${cost} cr`);
}
console.log(`\n✓ done — ~${totalCredits.toLocaleString()} credits. Next: transcribe + reconcile (Step 2).`);
