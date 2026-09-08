# EP02 · CHOREOGRAPHY RULES

Creator direction, 2026-09-02, after reviewing the first opening-minute build. These apply to **every beat** in EP02 and are a candidate to promote into the Master Runbook (§16 — they extend/override §3.6 "don't destroy previous elements", §4.2 motion cadence, and the transition rules §4.5).

Implemented in code as [`src/ep02/stage.ts`](../nothing-is-free-remotion/src/ep02/stage.ts) (`useStage`, `pulse`, `loop`).

---

## 1 · Empty → build → disperse → empty

- **Frame 0 of every beat is the empty locked field** — paper, grid, ground rule, progress rule, and nothing else. No foreground element is present at f0.
- Elements **enter one at a time**, staggered (~0.25–0.5 s apart), **timed to the voiceover** — an element appears when the VO first refers to it, not before.
- In the **last ~1.0–1.3 s**, every foreground element **disperses** — some exit left, some exit right, some collapse or fade. Vary it beat to beat; don't whoosh everything the same way every time.
- The **final ~0.5 s (≈15 frames) is the empty locked field again.**
- **Why:** beat N ends on the same empty frame that beat N+1 begins on, so Resolve's hard cut (or a short cross-dissolve) between separately-rendered pieces is invisible. This is "one continuous shot" enforced at the seams.

## 2 · Something moves every ≤3.5 s — the whole beat

- No static hold longer than **3.5 s** anywhere, including the back half of a 38 s beat (§4.2 was being ignored on the long holds).
- Every 3–4 s, a **real event**: an element enters or leaves, a value lands, a label changes, a card nudges, an icon flashes, a camera move starts. Micro-motion (breathing, grid drift, a slow drift) does **not** count.
- Map the beat's script/VO to timestamps first. Wherever the VO names a concrete thing (a game, a company, a number), **draw it and animate it** at that moment — place it, move it, and if it stays on screen, **loop it** (a spinner keeps spinning, a loading bar keeps filling, a character keeps gesturing).

## 3 · Sync to the voiceover, especially the peak

- **Check the audio, not just the script.** The delivered VO is ~134 wpm with its own rhythm.
- On-screen text appears **when the VO says it** — "every company that gets paid" shows up as the VO reaches that phrase, not 5 seconds early.
- The **visual peak lands on the VO's key phrase.** If the script's payoff is "for a tenth of a cent," the number hits its final position exactly there.
- If the visual finishes more than **~1.5 s** before the audio, there's a dead hold — add an event. (Audio trailing a second or two over the final empty frame is fine and wanted — it's the seamless join.)

## 4 · Lucky is on a loop

- She **holds props in her hands** (the rig now has `showPhone` / `typing` poses that draw the phone in-hand) and **leans toward** what she's showing — not a stiff sprite with a floating object.
- She keeps a **small idle motion** the whole time she's on screen — weight shift, a gesture, a scroll thumb — reference: the Infographics Show. `<Lucky>` does this by default (`idle`, `cycleSeconds`).
- Her phone screen, when shown, **loops** — ads flicking, a loading bar.

## 5 · The field

- The **grid is visible** as a grid (opacity 0.14 → 0.30). The fold creases are removed (they read as stray lines over the content).
- The **vignette is stronger and concentrated in the corners** (0.08 → 0.28, wider clear centre) — weight at the edges, clean through the middle.
- Nothing in the locked-frame furniture (grain, vignette) should visibly sit "on top of" the content.

## 6 · The bar

Before calling a beat done: **would this go on the channel as-is?** Check the render, not the code. Text must not overlap. The pose must read. The object must obey physics (held, resting, falling — not floating). If any of that fails, it's not done.

---

## Stage API (`src/ep02/stage.ts`)

```ts
const stage = useStage(durationInFrames, { disperseFrames?, holdFrames? });
stage.present(frame, atFrame, dur?)   // opacity multiplier: enters at `at`, disperses at the end
stage.enter(frame, atFrame, dur?)     // spring 0..1+ (scale)
stage.exit(frame)                     // global 1→0 over the disperse window
stage.fly(frame, dir, distance?)      // px x-offset for a scene object exiting (0 until disperse)
stage.flyY(frame, dir, distance?)     // px y-offset for exiting up/down
stage.isUp(frame, atFrame)            // entered and not yet dispersing
stage.disperseAt                      // frame the disperse begins

pulse(frame, atFrame, amount?, frames?)  // a one-off scale bump on a held element (a real event)
loop(frame, periodFrames, phase?)        // 0..1 sawtooth for spinners / bars / idle
```
