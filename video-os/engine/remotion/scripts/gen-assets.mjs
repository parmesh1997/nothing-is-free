/**
 * gen-assets.mjs — generate NIF background plates / props with the Gemini image
 * models (Nano Banana Pro = gemini-3-pro-image, Nano Banana 2 = gemini-3.1-flash-image).
 *
 *   npm run gen:assets                 # generate every asset that doesn't exist yet
 *   npm run gen:assets -- --force      # regenerate all
 *   npm run gen:assets -- --only B00   # just one
 *   npm run gen:assets -- --flash      # force the cheap model for everything
 *
 * Reads public/plates/<EP>/assets.json. Needs GEMINI_API_KEY in engine/remotion/.env.
 * Every image carries Google's invisible SynthID watermark (AI disclosure — see
 * channels/nif/ON_AI.md).
 */
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const PUBLIC = path.join(ROOT, "public");

// --- load .env (no dependency) ------------------------------------------------
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("✗ GEMINI_API_KEY not set. Put it in engine/remotion/.env");
  process.exit(1);
}

// --- args --------------------------------------------------------------------
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const FLASH_ALL = args.includes("--flash");
const onlyIx = args.indexOf("--only");
const ONLY = onlyIx >= 0 ? args[onlyIx + 1] : null;
const epIx = args.indexOf("--ep");
const EP = epIx >= 0 ? args[epIx + 1] : "NIF002";

const MODEL = { pro: "gemini-3-pro-image", flash: "gemini-3.1-flash-image" };

const manifestPath = path.join(PUBLIC, "plates", EP, "assets.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const STYLE = manifest.style ?? "";

const ai = new GoogleGenAI({ apiKey: KEY });

const extractImage = (resp) => {
  const parts = resp?.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    const data = p.inlineData?.data ?? p.inline_data?.data;
    if (data) return Buffer.from(data, "base64");
  }
  // surface any text the model returned instead (refusal / safety)
  const txt = parts.map((p) => p.text).filter(Boolean).join(" ");
  throw new Error(txt ? `no image — model said: ${txt.slice(0, 300)}` : "no image in response");
};

let made = 0;
let failed = 0;
for (const a of manifest.assets) {
  if (ONLY && a.id !== ONLY) continue;
  const outAbs = path.join(PUBLIC, a.out);
  if (fs.existsSync(outAbs) && !FORCE) {
    console.log(`· ${a.id}  exists, skip`);
    continue;
  }
  const model = MODEL[FLASH_ALL ? "flash" : a.model ?? "pro"];
  const prompt = `${STYLE}\n\nScene: ${a.prompt}`;
  process.stdout.write(`→ ${a.id}  (${model}) … `);
  try {
    const resp = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseModalities: ["Image"],
        imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
      },
    });
    const buf = extractImage(resp);
    fs.mkdirSync(path.dirname(outAbs), { recursive: true });
    fs.writeFileSync(outAbs, buf);
    console.log(`ok  ${(buf.length / 1024).toFixed(0)} KB  → public/${a.out}`);
    made++;
  } catch (e) {
    console.log(`FAIL  ${e.message}`);
    failed++;
  }
}

console.log(`\n${made} generated, ${failed} failed.`);
process.exit(failed ? 1 : 0);
