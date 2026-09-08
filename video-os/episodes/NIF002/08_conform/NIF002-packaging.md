# NIF002 — Package & Ship (Runbook v1.0 §13)

Topic: the real-time ad auction behind every free app. Reversal: *"You were
never the user. You are the inventory it takes to market. And the app is free
because you sell."* Bridge → next episode: Google Maps. CTA names episode 1.

Per §13: `TITLE = the promise, the mystery` · `THUMBNAIL = the contradiction,
a visual question` · `VIDEO = the revelation`.

---

## 1. Title candidates (§13.1)

Pick one, or hand me a favourite direction and I'll generate more of that flavour.
None of these give away the reversal — they promise it.

1. **Your Phone Runs 14 Trillion Ad Auctions a Day**
2. **Free Apps Sell You in Under a Tenth of a Second**
3. **The Auction That Runs Before Your Screen Even Loads**
4. **What Your Attention Actually Sells For (Down to the Cent)**
5. **The $390 Billion Auction Hiding Inside Every Free App**
6. **Every Free App Auctions You Off — Here's the Receipt**
7. **I Priced the Half-Second Every Free App Hides From You**

Matches Ep1's pattern (a specific, sourced number + a stated contradiction, no
clickbait adjectives) — **#1** and **#5** hew closest to "56% of Every Movie
Ticket Doesn't Go to the Theater"'s shape: cold number, flat delivery.

---

## 2. Thumbnail — prompt, not a render (§13.2)

I didn't generate an image — you asked for the brief so you can run it through
whatever you're using. 3840×2160, 16:9. Three concepts below, same style lock,
different visual metaphor. Lead recommendation: **Concept A (the gavel)** — it
reads "auction" in under a second at thumbnail scale, which the other two don't
do quite as fast.

### Style lock (reuse this block for every NIF thumbnail)

```
Vintage editorial print-poster style, bold halftone illustration, screen-print
duotone shading (NOT full color, NOT photorealistic). Aged cream paper
background, color #F6F2E7, with very subtle paper grain and a faint dot-grid
texture. Pure black ink, color #111111, for the illustration line-work and
halftone shading. Exactly ONE accent color used sparingly — warm vermilion-red,
color #E24D28 — reserved for: a hand-drawn underline swash under the headline,
a thin offset "print-misregistration" duplicate silhouette behind the main
illustration (shifted ~15px down-right, solid accent color, no detail), and one
small label chip. Never fill the hero illustration itself in the accent color —
it stays black-halftone on cream, the red is a shadow/accent layer only.

Blueprint/technical-drawing details in the corners: four small crosshair
registration marks (one per corner), a thin vertical ruler-tick strip along the
right edge, a tiny uppercase monospace eyebrow label in the top-left (grey,
letter-spaced, ~10px scale-equivalent).

Headline typography: two-line, ultra-bold heavily condensed grotesk display
face (Anton / Archivo Black / League Gothic feel), tight tracking, pure black
#111111, left-aligned, occupying the left third of the frame. A single loose
hand-drawn underline swash in #E24D28 beneath the second line only.

Bottom-left: a small torn-paper "evidence" card — off-white #FBF8F0 paper with
a rough torn top edge and a faint drop shadow, holding a printed barcode and a
short mono-type data line (a real, specific-sounding number relevant to the
episode). This card is the same device Ep1 used for its cinema-ticket prop —
keep it exactly that scale and placement (bottom-left, slightly rotated, ~4-6%
of frame width).

Composition: the hero illustration occupies the right two-thirds, huge, filling
most of the vertical frame, in dramatic low-angle scale-contrast against a
small human silhouette figure standing at its base looking up — the figure is
a simple flat silhouette in solid #111111, ordinary clothes, no face detail
(matches a small, ordinary-person cutout, NOT a hero pose). No other clutter.
Generous cream negative space upper-left for the headline to breathe.
```

### Concept A — the gavel (recommended)

```
[STYLE LOCK above] +

Hero illustration: a giant wooden auctioneer's gavel, mid-swing, about to
strike its sound block, rendered in bold black halftone shading with dramatic
directional light — same treatment as a giant object in a vintage poster. Its
offset red silhouette shadow is visible behind it, shifted down-right,
suggesting speed/impact. A tiny plain silhouette figure stands at the base of
the gavel's block, head tilted up, dwarfed by it.

Headline (two lines, condensed bold black, swash under line 2):
  SOLD
  IN 0.1 SECONDS

Evidence card (bottom-left, torn paper, barcode + mono line):
  "WINNING BID · $0.0004 · 0.098 SEC"

Eyebrow label (top-left, small mono, grey):
  THE REAL-TIME AD AUCTION
```

### Concept B — the price tag

```
[STYLE LOCK above] +

Hero illustration: a giant hanging retail price tag on a string, halftone
black shading, swinging slightly, filling most of the right two-thirds of the
frame. A barcode is printed on the tag in solid black. Its offset red
silhouette sits behind it, shifted down-right. A tiny plain silhouette figure
stands beneath it, looking up, roughly at the height of the tag's string.

Headline (two lines, condensed bold black, swash under line 2):
  YOU'RE
  THE PRODUCT

Evidence card (bottom-left, torn paper, barcode + mono line):
  "YOUR PRICE · $0.0004 PER VIEW"

Eyebrow label (top-left, small mono, grey):
  THE REAL-TIME AD AUCTION
```

### Concept C — the stopwatch

```
[STYLE LOCK above] +

Hero illustration: a giant stopwatch, halftone black shading, its hands frozen
mid-sweep, filling most of the right two-thirds of the frame. Its offset red
silhouette sits behind it, shifted down-right, as if it just snapped forward.
A tiny plain silhouette figure stands at its base, looking up at the dial.

Headline (two lines, condensed bold black, swash under line 2):
  SOLD IN
  0.1 SECONDS

Evidence card (bottom-left, torn paper, barcode + mono line):
  "AUCTION CLOSED · 0.098 SEC"

Eyebrow label (top-left, small mono, grey):
  THE REAL-TIME AD AUCTION
```

### After you generate one (§13.3 — VidIQ validation)

Score every candidate, iterate, **target 90+, don't stop at the first pass.**
I can run the score once it's attached to the video (vidIQ's scorer wants a
`videoId` — it scores what's actually sitting on a video, not a bare file), or
paste me the number and I'll read it straight — I won't state a score vidIQ
didn't actually return.

---

## 3. Chapters (§13.4) — exact frame-timed, phrased as answers

Straight from `Root.tsx`'s locked v4 beat table (`globalStartFrame` @ 30fps) —
not estimated.

```
0:00 Nothing is free (the claim)
0:09 The half-second you never see
0:47 The honest part: free apps ARE a good deal
1:25 $390 billion a year runs through this auction
2:03 What your phone sends the instant an app opens
2:48 How a word game knows your age
3:37 Your phone's one advertising ID
4:05 Your data becomes a "lot," sold to hundreds of buyers at once
4:47 What one view of you is actually worth
5:24 Why the price swings from a tenth of a cent to two cents
5:57 14 trillion of these auctions run every day
6:35 Where the winning bid's money actually goes
7:08 Following one real ad dollar down the chain
7:46 The "half of every dollar disappears" number, checked
8:41 Where the wasted half actually goes
9:14 The Trade Desk's 20% toll
9:42 Why free games build a "watch this for a reward" slot
10:08 The one player in the chain that isn't buying anything
10:27 Quick question: how many ads did you see today?
10:49 What happens to the auctions you don't win
11:41 When your locations stop being dots and become a life
12:23 The private auctions: Google, Meta, Amazon
13:10 Apple's own ad business, opened right after "Ask App Not to Track"
13:43 Why a federal judge called Google's ad tech illegal
14:15 The counter-argument: not a scam, mostly waste
14:59 You were never the user
15:46 The stutter you'll notice next time an app opens
16:21 Next time: Google Maps
```

(28 chapters, all ≥10s apart, first at 0:00 — passes YouTube's chapter rules.)

---

## 4. Description (§13.5)

```
Every time a free app opens, it runs an auction — hundreds of buyers, under a
tenth of a second, before you notice. This episode prices that auction: every
company that gets paid, in order, and what your attention is actually worth,
down to the cent.

WHAT THIS EPISODE ANSWERS
• What actually happens in the half-second before a free app shows you an ad
• Who gets paid, in order, and how much
• What your attention is worth (down to the cent) — and why the price swings
• Why free games add "watch this ad for a reward" slots
• What happens to your data when an advertiser DOESN'T win the auction
• Why a US federal judge ruled part of Google's ad business illegal (Apr 2025)

Previous episode: 56% of Every Movie Ticket Doesn't Go to the Theater

SOURCES
IAB OpenRTB spec · Statista / Google Play (2024) · In-app ad spend, industry
estimate (2025) · US Senate, Sen. Wyden (2021) · FTC data-broker filings ·
Binns et al. 2018; Exodus Privacy · Third-party tracking research · Mobile
eCPM benchmarks, Appodeal/Playio (2025) · RTB request volume + DSP throughput,
industry estimate (2026) · ISBA/PwC transparency studies (2020 & 2022) · ANA
Programmatic Transparency Study (Dec 2023) · The Trade Desk investor filings ·
Rewarded-video ARPDAU study (2025) · US Senate, Wyden–Cassidy (2021) · FTC v.
Mobilewalla order (Dec 2024) · FTC v. Kochava; FTC Gravy/Venntel actions
(2024–2026) · Alphabet, Meta, Amazon 10-K filings (2025) · Apple App Tracking
Transparency (2021) & App Store ads expansion (2022) · US v. Google, EDVA —
liability ruling (17 Apr 2025)

— ON AI —
Narration uses an AI voice model trained on my own recorded voice. Every visual
in this video is built in code from the sources listed above — there are no
generated images or stock footage. AI assists research and scripting; every
editorial judgement is my own.

CHAPTERS
[paste the block from §3]

Transcript: attached as .srt on upload (WhisperX / plain-script source).
```

**Upload checklist:** "Altered or synthetic content" = **YES** (cloned voice).
Thumbnail = whichever Concept scores highest. Chapters pasted into the
description exactly as above — YouTube reads them from there.
