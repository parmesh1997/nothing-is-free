#!/usr/bin/env python3
"""
build-deeptext-abs.py  —  NIF003 deep-text / punch cue sheet in ABSOLUTE timecode.

Takes the beat-relative cues from 08_conform/NIF003-text-timing.md (hand-kept)
and the canonical beat starts from 03_transcript/reconcile.json, and emits
08_conform/NIF003-deeptext-abs.md — every PUNCH / DEEP TEXT / SIGNATURE / LABEL
cue as an absolute 30fps timecode with a suggested in-point and hold, so the
Text+ pass in Resolve is place-and-go with no arithmetic.

Subtitles are NOT here (auto-transcribe in Resolve, verbatim from script.md);
a few are listed greyed for context where a LABEL sits inside a sentence.

    python engine/remotion/scripts/build-deeptext-abs.py
"""
import json, os, sys

FPS = 30
# .../video-os/engine/remotion/scripts/  ->  .../video-os/
VOS = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
RECON = os.path.join(VOS, "episodes", "NIF003", "03_transcript", "reconcile.json")
OUT = os.path.join(VOS, "episodes", "NIF003", "08_conform", "NIF003-deeptext-abs.md")
OUT_CSV = os.path.join(VOS, "episodes", "NIF003", "08_conform", "NIF003-markers.csv")

beats = {b["id"]: b for b in json.load(open(RECON))["beats"]}

def tc(frame):
    frame = max(0, int(round(frame)))
    f = frame % FPS
    s = (frame // FPS) % 60
    m = (frame // (FPS * 60)) % 60
    h = frame // (FPS * 3600)
    return f"{h:02d}:{m:02d}:{s:02d}:{f:02d}"

def mmss(frame):
    t = frame / FPS
    return f"{int(t // 60)}:{t % 60:04.1f}"

# ── the cue list ────────────────────────────────────────────────────────────
# each: (beat, local_seconds, TYPE, text, hold_override_seconds|None)
# TYPE in {PUNCH, DEEP, DEEP_HOLD, SIG, LABEL, SUB}
# local_seconds is relative to the beat start EXCEPT B00/B01 which are absolute
# (marked abs=True in ABS_BEATS) — matches how NIF003-text-timing.md is written.
ABS_BEATS = {"B00", "B01"}

CUES = [
    # B00 — cold open + signature (times are episode-absolute)
    ("B00", 0.2, "SIG", 'Nothing is free.  — signature; "free." in orange #E24D28, ~150px condensed bold, ink. Settle by 1.4s, hold to 2.0s, lift up-and-out over ~20f. Audio stamp on the accent.', 2.6),
    ("B00", 4.2, "SUB", "And the channel you just turned on for free…", None),
    ("B00", 7.1, "PUNCH", 'kicker "Already paid"  •  FOUR COMPANIES  •  sub "before your show even started."  (rides the 4 marks stamping in 7.1–7.8)', 2.6),

    # B01 — the chain (times are episode-absolute)
    ("B01", 39.2, "PUNCH", 'kicker "Every company that gets paid,"  •  IN WHAT ORDER', 2.4),

    # B03 — how does channel four make a dollar  (local offsets)
    ("B03", 28.0, "PUNCH", "FREE TO RECEIVE", 2.2),
    ("B03", 34.0, "DEEP_HOLD", "If nobody charges you at the antenna — how does channel four make anyone a dollar?  (hold to beat end)", None),

    # B04 — the 1992 Cable Act
    ("B04", 20.0, "PUNCH", "THE CABLE ACT  ·  1992", 2.4),
    ("B04", 29.0, "LABEL", "MUST CARRY — carried, can't charge a cent", None),
    ("B04", 36.0, "LABEL", "RETRANS CONSENT — charge anything, or go dark", None),
    ("B04", 52.0, "PUNCH", "ALMOST EVERY STATION picked to get paid", 2.6),

    # B05 — under $1B -> $15B
    ("B05", 15.0, "DEEP", "This year: $15 BILLION", 3.5),
    ("B05", 44.0, "PUNCH", "+7% in a single year", 2.2),

    # B06 — the broadcast TV fee line
    ("B06", 9.0, "LABEL", "BROADCAST TV FEE — $10–$30/mo (up to $48 in some Comcast markets)", None),
    ("B06", 25.0, "PUNCH", "NOT A TAX  ·  NOT OPTIONAL", 2.4),

    # B07 — going dark
    ("B07", 33.0, "PUNCH", '"NEGOTIATING TACTIC"  (over the black screen)', 2.6),

    # B08 — Disney vs Charter 2023
    ("B08", 4.0, "LABEL", "SEP 2023", None),
    ("B08", 16.0, "DEEP", "15,000,000 households  ·  no vote", 3.0),
    ("B08", 26.0, "DEEP", "12 DAYS DARK", 3.0),

    # B09 — Disney vs DirecTV 2024
    ("B09", 5.0, "LABEL", "SEP 2024  ·  SATELLITE", None),
    ("B09", 30.0, "DEEP", "13 DAYS", 3.0),

    # B10 — Disney vs YouTube TV 2025 + the pattern
    ("B10", 5.0, "LABEL", "OCT 2025  ·  STREAMING", None),
    ("B10", 36.0, "DEEP", "Cable. Satellite. Streaming.  Three fights, three years in a row.", 3.8),
    ("B10", 52.0, "PUNCH", "A STRATEGY DISNEY RUNS ON A SCHEDULE", 2.8),

    # B11 — cutting the cord doesn't exit the chain
    ("B11", 27.0, "LABEL", "RSN FEE — $3–$17/mo (Fubo shows it openly)", None),
    ("B11", 42.0, "PUNCH", "YOU JUST CHANGED WHO MAILS YOU THE BILL", 2.8),

    # B12 — mid-roll
    ("B12", 0.0, "DEEP", "SUBSCRIBE — we price the number on your bill, every episode", 4.0),

    # B13 — sports = 60-90%
    ("B13", 19.0, "DEEP", "60–90% of every dollar cable pays broadcasters", 3.5),

    # B14 — ESPN's carriage rate
    ("B14", 30.0, "PUNCH", "BILLED WHETHER YOU WATCH A GAME OR NOT", 2.8),

    # B15 — $7.5B/year
    ("B15", 15.0, "DEEP", "$7.5B — before one ad, one ticket, one jersey", 3.5),

    # B16 — no opt-out
    ("B16", 20.0, "LABEL", "SPORTS TIER — CAN'T REMOVE", None),
    ("B16", 26.0, "PUNCH", "THE FEE IS BAKED IN ON PURPOSE", 2.6),

    # B17 — Bally Sports RSN bankruptcy
    ("B17", 58.0, "PUNCH", "THE MODEL OUTRAN ITS OWN AUDIENCE", 2.8),

    # B18 — Nielsen
    ("B18", 18.0, "LABEL", "$ per 1,000 viewers  ×  the rating  =  the ad price", None),
    ("B18", 23.0, "PUNCH", "SAME 30 SECONDS  ·  HIGHER PRICE", 2.4),

    # B19 — two invoices
    ("B19", 26.0, "PUNCH", "BILLED AS A SUBSCRIBER  ·  SOLD AS AN AUDIENCE", 2.8),
    ("B19", 37.0, "DEEP", "You only ever see the first one.", 3.2),

    # B20 — 77M
    ("B20", 11.0, "DEEP", "77,000,000 households have cut it entirely", 3.5),
    ("B20", 19.0, "PUNCH", "FEWER THAN HALF STILL PAY FOR TV — A FIRST", 2.8),

    # B21 — rates rose anyway
    ("B21", 11.0, "DEEP", "▲ 7% — the per-subscriber rate, the same year millions left", 3.5),
    ("B21", 19.0, "PUNCH", "FEWER PEOPLE  ·  EACH HOLDING MORE OF THE BILL", 2.8),

    # B22 — who's left  (LABEL range 0:10-0:22, expanded)
    ("B22", 10.0, "LABEL", "SPORTS FAN", None),
    ("B22", 16.0, "LABEL", "BUNDLED W/ INTERNET", None),
    ("B22", 22.0, "LABEL", "ONLY ONE PROVIDER", None),
    ("B22", 40.0, "PUNCH", "THE LEAST LEVERAGE TO SAY NO", 2.6),

    # B23 — Nexstar
    ("B23", 15.0, "DEEP", "200+ stations", 3.2),

    # B24 — Nexstar revenue
    ("B24", 20.0, "DEEP", "$700M+ in one quarter", 3.2),
    ("B24", 30.0, "PUNCH", "FOR SIGNALS FREE WITH A $20 ANTENNA", 2.6),

    # B25 — the political rate
    ("B25", 19.0, "LABEL", "POLITICAL CANDIDATE — lowest rate, by law, no negotiating up", None),
    ("B25", 35.0, "PUNCH", "A PROTECTED BEST PRICE — NEVER ONCE YOURS", 2.8),

    # B26 — not a scam
    ("B26", 28.0, "PUNCH", "PROBABLY WHY YOUR STATION STILL HAS REAL REPORTERS", 3.0),

    # B27 — no menu
    ("B27", 25.0, "PUNCH", "YOU WERE NEVER IN THE ROOM WHERE THE PRICE GOT DECIDED", 3.0),

    # B28 — stack the total  (LABEL range 0:03-0:35, expanded onto the receipt)
    ("B28", 3.0, "LABEL", "Avg TV bill  $100+/mo", None),
    ("B28", 13.0, "LABEL", "Broadcast fee  $100+/yr — can't remove", None),
    ("B28", 23.0, "LABEL", "Sports fee — can't decline", None),
    ("B28", 33.0, "LABEL", "The rate  ▲ every year", None),
    ("B28", 37.0, "DEEP", "NEVER ACTUALLY YOUR CHOICE — hundreds of dollars a year", 3.8),

    # B29 — THE REVERSAL  (LABEL range 0:22-0:31, 5 links; Dark Law fires ~0:44)
    ("B29", 22.0, "LABEL", "THE NETWORK — PAID", None),
    ("B29", 24.2, "LABEL", "LOCAL STATION — PAID", None),
    ("B29", 26.5, "LABEL", "RATINGS CO. — PAID", None),
    ("B29", 28.8, "LABEL", "ADVERTISER — PAID", None),
    ("B29", 31.0, "LABEL", "THE OPERATOR — PAID", None),
    ("B29", 45.5, "DEEP_HOLD", "YOU — never once got a seat at the table   (lands AFTER the Dark-Law ink wash completes ~00:19:20; hold to beat end)", None),

    # B30 — same shape  (subtitles only; no deep text)

    # B31 — bridge to Ep4
    ("B31", 17.0, "PUNCH", "SOMEBODY ALREADY PAYS FOR EVERY PIN", 2.8),

    # B32 — close
    ("B32", 4.0, "DEEP", "SUBSCRIBE — it's free, and this time we mean it", 4.0),
    ("B32", 12.0, "SIG", 'Nothing is free.  (typeset, silent — the §6.4 return; "free." in orange, ~150px condensed bold)', 3.5),
    ("B32", 16.0, "DEEP", "Somebody already answered that question — for money — before you did.", 4.0),
]

LEAD = {"PUNCH": 8, "DEEP": 8, "DEEP_HOLD": 8, "SIG": 6, "LABEL": 6, "SUB": 0}
TYPE_LABEL = {
    "PUNCH": "PUNCH", "DEEP": "DEEP TEXT", "DEEP_HOLD": "DEEP TEXT (hold)",
    "SIG": "SIGNATURE", "LABEL": "LABEL", "SUB": "subtitle (context)",
}

# resolve per-beat cue order + LABEL "until next label / beat end" holds
by_beat = {}
for c in CUES:
    by_beat.setdefault(c[0], []).append(c)

rows = []
for bid, cues in by_beat.items():
    b = beats[bid]
    bstart = b["globalStartFrame"]
    bend = bstart + b["durationInFrames"]
    is_abs = bid in ABS_BEATS
    # sort by land
    cues = sorted(cues, key=lambda c: c[1])
    label_lands = [bstart + int(round(c[1] * FPS)) for c in cues if c[2] == "LABEL"] if is_abs is False else \
                  [int(round(c[1] * FPS)) for c in cues if c[2] == "LABEL"]
    for i, (_, loc, typ, text, hold) in enumerate(cues):
        if typ == "SUB":
            continue
        land = int(round(loc * FPS)) if is_abs else bstart + int(round(loc * FPS))
        lead = LEAD[typ]
        cin = max(0, land - lead)
        if typ == "DEEP_HOLD":
            cout = bend - 6
        elif typ == "LABEL":
            if bid == "B29":
                # the reversal — all 5 PAID links stay stacked until the Dark-Law
                # wash so the whole lit chain is on screen when it goes to ink.
                cout = bstart + 1330
            else:
                # hold until the next LABEL in this beat, else +6s, near beat end
                later = [L for L in label_lands if L > land + 4]
                cap = min(later) if later else land + int(6.0 * FPS)
                cout = min(cap, bend - 4)
        else:
            # PUNCH / DEEP / SIG — NOT clamped to the beat end; a punch is allowed
            # to ride across the cut into the next beat's opening (creator's call).
            dur = hold if hold is not None else 3.0
            cout = land + int(round(dur * FPS))
        crosses = cout > bend
        rows.append((bid, land, cin, cout, typ, text, crosses))

rows.sort(key=lambda r: r[1])

lines = []
lines.append("# NIF003 — deep-text / punch cues in ABSOLUTE timecode\n")
lines.append("Generated by `engine/remotion/scripts/build-deeptext-abs.py` from")
lines.append("`NIF003-text-timing.md` + `03_transcript/reconcile.json`. 30 fps, non-drop,")
lines.append("episode-relative (00:00:00:00 = first frame of B00 on the timeline).\n")
lines.append("- **IN** = put the Text+ clip's start here (lead-in already applied: "
             "PUNCH/DEEP −8f, SIGNATURE/LABEL −6f).")
lines.append("- **OUT** = suggested end. LABELs hold until the next label or +6s; "
             "DEEP TEXT (hold) runs to the beat's last frame.")
lines.append("- Tune ±5–10f by eye against the VO word — these are lands, not law.")
lines.append("- **†** on the OUT = the cue runs past its beat's last frame into the "
             "next beat's opening. Intentional for a punch landing on a hard cut "
             "(B07, B11) — keep it riding across the transition.")
lines.append("- Subtitles are **not** here — auto-transcribe in Resolve, then fix "
             "wording against `01_script/script.md` PLAIN.\n")
lines.append("| IN (tc) | OUT (tc) | dur | Beat | Type | Text / spec |")
lines.append("|---|---|---|---|---|---|")
for bid, land, cin, cout, typ, text, crosses in rows:
    dur_s = (cout - cin) / FPS
    mark = " †" if crosses else ""
    tl = TYPE_LABEL[typ]
    lines.append(f"| `{tc(cin)}` | `{tc(cout)}`{mark} | {dur_s:.1f}s | {bid} | **{tl}** | {text} |")

lines.append("\n---\n")
lines.append("## Notes\n")
lines.append("- **B00 / B01** cue times were authored episode-absolute in the source "
             "sheet; every other beat was authored beat-relative. Both normalised here.")
lines.append("- **B09** header in `NIF003-text-timing.md` says `starts 5:45.5` — stale. "
             "Real start is **6:05.6** (f10968). Cues above use the real start.")
lines.append("- **B29 Dark-Law**: the paper→ink wash is baked in the Remotion picture, "
             "firing on \"You are the only party\" at **~`00:19:19:21`**, fully ink "
             "~20f later. The 5 PAID labels land one by one (0:22–0:31) and **all "
             "stay stacked until the wash** — the whole lit chain is on screen when "
             "it goes to ink. The `YOU` deep-text then lands on the ink. Duck the "
             "music bed out at ~`00:19:18` and hold the YOU beat dry (runbook §2.9).")
lines.append("- **SIGNATURE** (B00 open, B32 return): same lockup both times — condensed "
             "bold, ~150px, uppercase, ink, the word `free.` in `#E24D28`. Flat.")
lines.append("- LABEL rows for B22 / B28 / B29 were one range in the source, expanded "
             "here to a row per item across the range. B28's four receipt lines hold "
             "long (they stack on the receipt); B29's hold to the wash (above).")

open(OUT, "w", encoding="utf-8").write("\n".join(lines) + "\n")

# ── JSON — machine-readable cue list for the Resolve title builder ──────────
OUT_JSON = os.path.join(VOS, "episodes", "NIF003", "08_conform", "NIF003-deeptext-cues.json")
FULLTEXT = {
    ("B00", "SIG"): "Nothing is free.",
    ("B00", "PUNCH"): "FOUR COMPANIES",
    ("B01", "PUNCH"): "IN WHAT ORDER",
}
cue_json = []
for bid, land, cin, cout, typ, text, crosses in rows:
    # the on-screen words only — strip the parenthetical stage directions
    words = text.split("  (")[0].split("   (")[0].strip()
    words = FULLTEXT.get((bid, typ), words)
    cue_json.append({
        "beat": bid, "type": typ, "text": words,
        "land": land, "in": cin, "out": cout,
        "in_tc": tc(cin), "out_tc": tc(cout),
        "dur_frames": cout - cin, "crosses_cut": crosses,
    })
json.dump({"fps": FPS, "timeline_start_frame_hint": 108000, "cues": cue_json},
          open(OUT_JSON, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

# ── marker CSV — beat boundaries + every text cue, for the conform timeline ──
# color-coded so the creator can navigate marker-to-marker in Resolve.
COLOR = {"BEAT": "Blue", "PUNCH": "Orange", "DEEP": "Yellow", "DEEP_HOLD": "Yellow",
         "SIG": "Pink", "LABEL": "Green"}
mk = [("frame", "timecode", "name", "color", "type", "note")]
for bid, b in beats.items():
    f = b["globalStartFrame"]
    mk.append((f, tc(f), f"{bid}  ({mmss(f)})", COLOR["BEAT"], "BEAT",
               f"beat start · {b['durationInFrames']}f"))
for bid, land, cin, cout, typ, text, crosses in rows:
    short = text.split("  (")[0].split(" — ")[0][:60]
    mk.append((land, tc(land), f"{bid} {typ}: {short}", COLOR[typ], typ,
               f"in {tc(cin)} out {tc(cout)}" + (" (crosses cut)" if crosses else "")))
mk_sorted = [mk[0]] + sorted(mk[1:], key=lambda r: r[0])
import csv
with open(OUT_CSV, "w", encoding="utf-8", newline="") as fh:
    csv.writer(fh).writerows(mk_sorted)

print(f"wrote {OUT}")
print(f"wrote {OUT_CSV}  ({len(mk)-1} markers: 33 beat + {len(rows)} text)")
print(f"{len(rows)} cues  ({sum(1 for r in rows if r[4]=='PUNCH')} punch, "
      f"{sum(1 for r in rows if r[4].startswith('DEEP'))} deep, "
      f"{sum(1 for r in rows if r[4]=='LABEL')} label, "
      f"{sum(1 for r in rows if r[4]=='SIG')} signature)")
