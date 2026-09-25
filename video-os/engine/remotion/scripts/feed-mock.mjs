/**
 * feed-mock.mjs — the feed test (§9.10). "Does our thumbnail and title stand out, and say
 * something different, next to the videos YouTube would show beside it?" answered by
 * looking at it where the viewer meets it, not on its own.
 *
 *   (from engine/remotion/)
 *   node scripts/feed-mock.mjs "why is movie theater popcorn so expensive" \
 *        --ours ../../episodes/NIF010/07_packaging/thumb_a.png,../../episodes/NIF010/07_packaging/thumb_b.png \
 *        --title "Your Popcorn Costs $9. The Cinema Didn't Take It." \
 *        [--n 11] [--pos 3|random] [--dur 8:00] [--out ../../episodes/NIF010/07_packaging/feed.html]
 *   node scripts/feed-mock.mjs --json fixture.json --ours a.png --title "…"   (offline: {entries: [...]})
 *
 * Writes one self-contained HTML page (our thumbnails are embedded; theirs load from
 * i.ytimg.com) with, per variant, the three places a video is met:
 *   Home        a mobile-width feed, one video per row, ours at --pos
 *   Suggested   the sidebar: small thumbnails with the title beside them — where a
 *               thumbnail has to read at about 10% of full size
 *   Search      the results list for the same query
 * A "Squint" button blurs the page: what still reads is what a scrolling thumb sees.
 *
 * The check it supports, written to 07_packaging/feed-test.md: in each view, is ours
 * the first thumbnail the eye lands on, and does it promise something none of the
 * others do? The creator decides; nothing here scores it.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { extname } from "node:path";

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const N = parseInt(opt("--n", "11"), 10);
const POS = opt("--pos", "3");
const ours = (opt("--ours", "") || "").split(",").filter(Boolean);
const ourTitle = opt("--title", "");
const ourChannel = opt("--channel", "Nothing Is Free");
const ourDur = opt("--dur", "8:00");
const outFile = opt("--out", "feed.html");
const fixture = opt("--json", null);
const query = args.join(" ");
if ((!query && !fixture) || !ours.length || !ourTitle) {
  console.error('usage: node scripts/feed-mock.mjs "<query>" --ours a.png[,b.png] --title "<title>" [--n 11] [--pos 3|random] [--out feed.html]');
  process.exit(1);
}

let entries;
if (fixture) {
  entries = JSON.parse(readFileSync(fixture, "utf8")).entries;
} else {
  const r = JSON.parse(
    execFileSync("yt-dlp", ["-J", "--flat-playlist", `ytsearch${N}:${query}`], {
      encoding: "utf8", maxBuffer: 64 << 20, stdio: ["ignore", "pipe", "ignore"],
    }),
  );
  entries = r.entries ?? [];
}
entries = entries.filter((e) => e && e.title).slice(0, N);

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const dataUri = (p) => {
  if (!existsSync(p)) throw new Error(`no such thumbnail: ${p}`);
  return `data:${MIME[extname(p).toLowerCase()] ?? "image/png"};base64,${readFileSync(p).toString("base64")}`;
};
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const views = (n) =>
  !Number.isFinite(n) ? "" : n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M views` : n >= 1e3 ? `${Math.round(n / 1e3)}K views` : `${n} views`;
const dur = (s) => {
  if (!Number.isFinite(s)) return "";
  s = Math.round(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${x}` : `${m}:${x}`;
};
const thumbOf = (e) => e.thumbnail ?? `https://i.ytimg.com/vi/${e.id}/mqdefault.jpg`;

const card = (v, cls) => `
  <div class="card ${cls}${v.ours ? " ours" : ""}">
    <div class="th"><img src="${v.thumb}" alt=""><span class="d">${esc(v.dur)}</span></div>
    <div class="meta"><div class="t">${esc(v.title)}</div><div class="c">${esc(v.channel)}</div><div class="c">${esc(v.views)}</div></div>
  </div>`;

const sections = ours.map((path, k) => {
  const us = { ours: true, thumb: dataUri(path), title: ourTitle, channel: ourChannel, views: "New", dur: ourDur };
  const them = entries.map((e) => ({
    thumb: thumbOf(e), title: e.title, channel: e.channel || e.uploader || "", views: views(e.view_count), dur: dur(e.duration),
  }));
  const at = POS === "random" ? Math.floor(Math.random() * (them.length + 1)) : Math.min(Math.max(parseInt(POS, 10) - 1, 0), them.length);
  const list = [...them.slice(0, at), us, ...them.slice(at)];
  const label = String.fromCharCode(65 + k);
  return `
  <h2>Variant ${label} · <span>${esc(path)}</span> · ours is #${at + 1}</h2>
  <div class="views">
    <section><h3>Home (mobile)</h3><div class="home">${list.slice(0, 6).map((v) => card(v, "big")).join("")}</div></section>
    <section><h3>Suggested (sidebar)</h3><div class="side">${list.map((v) => card(v, "small")).join("")}</div></section>
    <section><h3>Search</h3><div class="search">${list.slice(0, 6).map((v) => card(v, "row")).join("")}</div></section>
  </div>`;
});

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Feed test</title>
<style>
  :root { --bg:#0f0f0f; --fg:#f1f1f1; --muted:#aaa; --ring:#e24d28; }
  * { box-sizing:border-box } body { margin:0; padding:16px; background:var(--bg); color:var(--fg); font:14px/1.35 Roboto, Arial, sans-serif }
  header { display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:8px }
  header p { margin:0; color:var(--muted) } button { background:#272727; color:var(--fg); border:0; border-radius:18px; padding:8px 14px; cursor:pointer }
  h2 { font-size:16px; margin:24px 0 8px } h2 span { color:var(--muted); font-weight:400 } h3 { font-size:13px; color:var(--muted); margin:0 0 8px; font-weight:500 }
  .views { display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px; align-items:start }
  .card { display:flex; gap:8px } .th { position:relative; flex:none } .th img { display:block; width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:8px; background:#222 }
  .d { position:absolute; right:4px; bottom:4px; background:rgba(0,0,0,.8); font-size:11px; padding:1px 4px; border-radius:4px }
  .t { font-weight:500; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden } .c { color:var(--muted); font-size:12px }
  .big { flex-direction:column; margin-bottom:16px } .big .th { width:100% } .big .t { font-size:15px }
  .small { margin-bottom:8px } .small .th { width:168px } .small .t { font-size:13px }
  .row { margin-bottom:12px } .row .th { width:46% } .row .t { font-size:15px }
  body.mark .ours .th img { outline:3px solid var(--ring); outline-offset:2px }
  body.squint main { filter: blur(2.5px) }
</style></head><body>
<header><strong>Feed test</strong><p>“${esc(query || "fixture")}” · ${entries.length} results</p>
<button onclick="document.body.classList.toggle('squint')">Squint</button>
<button onclick="document.body.classList.toggle('mark')">Show ours</button></header>
<main>${sections.join("")}</main>
</body></html>`;

writeFileSync(outFile, html);
console.log(`feed test → ${outFile} (${ours.length} variant${ours.length > 1 ? "s" : ""}, ${entries.length} competitors)`);
