# Visual upgrade plan: Blender, Remotion and Resolve Studio

Researched 2026-09-24 for the Someone Always Pays scene system (runbook §2, §9.8,
§10.9). None of this is a rule yet. Each item is a **lab**: built in
`engine/remotion/lab/<name>/`, judged on stills and a short proxy, and written into
the runbook only after you approve it (§13.5). That is the same way every §9.8
rule was earned: measured on a render, not taken from a manual.

**Every lab is judged against three questions.** Does it strengthen "drawn, not
rendered" (§2)? Does it keep the one-drawing rule (§2.1), so the set and the cast
change together? Does it move CTR or APV, or lower the cost per finished second?

---

## A · Do first: cheap, and they fix the look

### A1 · Line boil on twos, in Blender and Remotion together

**What.** Hand-drawn animation "boils": the ink line wobbles slightly and the
wobble changes every second frame. Right now a 2.5D plate's Line Art is perfectly
stable, which is one reason the sets can read as a 3D render with an outline.

**How.**
- Blender: a Grease Pencil **Noise** modifier on the Line Art object, with a small
  offset and its **Step** set to 2, so the wobble holds for two frames and then
  changes.
- Remotion: the same wobble on the SVG ink of the 2D sets and the cast, through an
  SVG displacement filter (`feTurbulence` into `feDisplacementMap`) whose seed is
  `Math.floor((globalStartFrame + frame) / 2)`. `@remotion/noise` can drive it
  instead.
- Both sides use the same amplitude in pixels at 1080p, read from one shared
  constant. That keeps §2.1 "same line".

**Why.** It helps §3 law 11 without any extra work: a held shot is never dead,
because the ink keeps moving. It is also the clearest single sign of "drawn".

**Pass on stills and proxy:** amplitude of 1 px or less. Type, anchors and the
progress rule are excluded (type must stay sharp). No visible shimmer on a 2×
crop. `motion-check.mjs` will then report no held state on locked-off shots; check
this does not hide a genuinely frozen composition. The boil is not a substitute
for §3 law 11's "something alive".

### A2 · The cast animates on twos

**What.** Characters update their pose every second frame (12 poses a second)
while the camera and the set move on every frame. Spider-Verse used this
split to make CG read as drawn.

**How.** In the cast rig: `const f = Math.floor(frame / 2) * 2` for the body,
head, hands and blink. Test the mouth both on ones and on twos against the
Rhubarb cues.

**Pass:** a walk and a head-turn look deliberate, not stuttery, at 24 fps
playback. The foot-lock gate still holds (≤1 px), because planted feet do not
move anyway.

### A3 · A practicals mask pass from Blender

**What.** §10.9 wants bloom "on practicals only: lamps, windows, screens". Keyed by
brightness in Resolve, that also catches card-white signs and paper.

**How.** Blender renders one more alpha pass with only the practicals' emissive
surfaces visible (everything else a holdout). In Resolve it is the external matte
for a Glow on node 3 of the grade. In Remotion it can drive a glow on 2D shots.

**Pass:** the bloom sits on the lamp, not on the menu board next to it.

### A4 · A depth pass for "same focus"

§9.8 already says EEVEE's depth of field does nothing, so defocus comes from a
depth pass. The plan is to make that routine: the Blender **Mist** pass, normalised
per shot, rendered as a greyscale ProRes beside the plate. The same number drives
the cast's `blurPx` (it sits at a known depth from the camera JSON), so the plate
and the character blur by the same amount (§2.1).

**Pass:** at a rack focus, the character and the floor under their feet go soft
together.

### A5 · Line weight that follows distance, on both sides

§2.1 says "one weight at the same distance", which means weight may change with
distance. Today it does not. The camera JSON already carries pixels per metre, so
one function can set the cast's stroke width from it, and the same curve can set
the Line Art thickness falloff in Blender. Near objects get a heavier line and far
ones a lighter line, the way an illustrator draws, and the cast still matches the
set at every depth.

---

## B · Look upgrades, for a lab and your eye

### B1 · A crayon or paper texture inside the shade band only

Crayon Capital is one of the §2 references, and its warmth comes partly from
texture. A screen-space noise texture multiplied into the **shadow step only** of
the toon ramp (and a matching SVG pattern on the cast's shade fill) would add
that without any gradient. It stays "flat fill plus one shade step", with the
step textured. **It is a look change, so it is your call.** Judge it at viewer
size and on a 2× crop, as §10.9 requires.

### B2 · Outline-rich geometry as reusable Geometry Nodes

§2.4 says a location made of plain boxes looks cheap and needs spindles, mullions
and individual books. Building those by hand for every location is where 3a
hours go. A small library of Geometry Nodes generators would make that detail
cheap to reuse: shelves of individual books, blinds, railings, tiled floors with
grout lines, rows of chairs, and crowd lanes. Each takes a size and a seed. This
lowers the cost per second (§1.4) more than anything else here.

### B3 · Blender 5.3's new NPR shading nodes: test in beta, do not ship yet

Blender 5.3 (alpha until 30 September, release planned for 17 November 2026) adds
**Light Info, Light Evaluation, Shadow Raycast and Light Accumulation** shader
nodes for EEVEE. They let a toon shader read each light's colour, direction and
shadow. That goes straight at the §9.8 limit "the toon material cannot receive a
cast shadow", which today forces a real material wherever a cast shadow is needed.

**Plan:** rebuild one pilot location's material on the 5.3 beta in the lab. Keep
production on **5.2 LTS** until 5.3 is released and the lab passes. Record the
result in §9.8's measured table either way.

Also available now, in 5.1 and later: the **Raycast** shader node (screen-space in
EEVEE). It is worth one lab for drawn contact-shadow and occlusion ink on the set.

### B4 · Grease Pencil 5.2 line materials with dots and squares

5.2 can place dots or squares along a stroke at render time, with random size,
opacity and colour. It is cheap texture for ambient life: dust in a light beam,
rain on a window, a stippled shadow on a document. Minor, but free.

---

## C · Remotion

| Item | What | Status |
| --- | --- | --- |
| **`@remotion/effects`** | More than 50 effects since 4.0.464: glow, progressive blur, grain, halftone, emboss and others. Built for canvas-based components, so an SVG scene must be checked for compatibility first | Probe. Progressive blur (for A4) and glow (for A3) are the useful two. **Chromatic aberration stays banned** (§2.5) |
| **Twos and boil helpers** | A1 and A2 as two small shared helpers in `src/motion/`, so no episode writes its own | Build with A1 and A2 |
| **`calculateMetadata`** | Compositions read `durationInFrames` from `timing.json` themselves, so a beat can never be built against a stale length | Build. It fits §5's "nothing is built against estimated durations" |
| **Render speed** | `--concurrency` tuned once on your machine; `--gl=angle` on Windows for any WebGL or canvas effect; JPEG frames for the opaque proxy only; `--log=error` always (§5.4) | Measure once, write into §9.4 |
| **`@remotion/three`** | Already installed. A cheap route to the §2.8 isometric diorama insert without a Blender round trip | Use when an insert calls for it |

---

## D · DaVinci Resolve Studio 21.1

| Item | What it is | Recommendation |
| --- | --- | --- |
| **Film Look Creator** | Studio's single effect for halation, bloom, grain, gate weave and vignette. Version 21 adds contrast roll-off and gate softness | **Probe it against the locked chain** (§10.9). The Fusion Grain was chosen because the OFX Film Grain vanished on flat colour. If Film Look Creator's grain survives on a flat field on the 2× crop, one node could replace Grain and Vignette. If not, keep the Fusion chain |
| **20 new scripting APIs in 21.1** | Added to Studio with the built-in console | Run `get_whats_new` (already a rule, §10.1) and check for anything covering **Power Bins or presets**. If something does, the toolkit template workaround in §10.5.1 can go |
| **Inspector presets (Edit page, 21.1)** | Saved Inspector values applied to clips | Useful for the fade in and fade out if they can be scripted. Probe on `_NIF_CAPABILITY_PROBE` |
| **CineFocus, Depth Map** (AI, Studio) | Depth-based refocus estimated from the picture | Keep as a **fallback only**. The Blender depth pass (A4) is exact and free. On 2D shots, Remotion already knows every layer's depth |
| **Not recommended** | AI Speech Generator (the voice is fixed, §8.1); UltraSharpen and SuperScale (nothing is scaled, §1.4); Motion Deblur; the Krokodove 3D tools (Blender owns 3D); motion authored in Resolve (Remotion owns motion, §9.2) | Skip |

**Check the MCP wiring.** The runbook (§10.1) uses Resolve 21.1's **native** MCP
server. This repo's `.mcp.json` still points at a community Python server under
`C:\Users\parme\AppData\Local\davinci-resolve-mcp`, and that server failed to
start from this cloud session because the path only exists on your PC. If the
native server is the one you use, update `.mcp.json` so a new session connects to
the right one.

---

## Suggested order

1. **A1 + A2** together, in one lab, on the pilot's B00 shots. This is the biggest
   change to how the channel reads, for about a day of work.
2. **A3 + A4**: two extra Blender passes, used in the grade and in Remotion.
3. **B2** Geometry Nodes generators: build each one the first time a location
   needs it.
4. **D** Film Look Creator probe, and `get_whats_new` for presets.
5. **B3** on the 5.3 beta, in October, so the result is ready for the November
   release.
6. **B1** crayon texture, only if you want the warmer look after seeing A1 + A2.

---

## Sources

- [Blender 5.1 release](https://www.blender.org/press/blender-5-1-release/): Raycast shader node, faster EEVEE shader compilation
- [Blender 5.2 LTS release](https://www.blender.org/press/blender-5-2-lts-release/) and [Grease Pencil 5.2 notes](https://developer.blender.org/docs/release_notes/5.2/grease_pencil/): new fill, dots and squares line materials
- [BlenderNation: 5.2 Grease Pencil breakdown](https://www.blendernation.com/2026/07/06/blender-5-2-grease-pencil-16-new-features-breakdown/)
- [Blender 5.3 EEVEE notes](https://developer.blender.org/docs/release_notes/5.3/eevee/) and [the NPR design task](https://projects.blender.org/blender/blender/issues/120403): Light Info, Light Evaluation, Shadow Raycast, Light Accumulation
- [Resolve 21 New Features Guide](https://documents.blackmagicdesign.com/SupportNotes/DaVinci_Resolve_21_New_Features_Guide.pdf) and [CG Channel on Resolve 21.0](https://www.cgchannel.com/2026/06/blackmagic-design-releases-davinci-resolve-21-0/)
- [CineD on Resolve 21.1](https://www.cined.com/davinci-resolve-21-1-released-ai-assistant-integration-via-mcp-individual-hdr-trims-and-python-scripting-moves-to-studio/) and [Creative Video Tips: what's new in 21.1](https://creativevideotips.com/tutorials/whats-new-in-davinci-resolve-211): MCP, 20 new scripting APIs, Inspector presets
- [Film Look Creator in Resolve 21](https://videomontazher.com/en/color/resolve-fx/film-look-creator)
- [`@remotion/effects`](https://www.remotion.dev/docs/effects/api) and [its npm page](https://www.npmjs.com/package/@remotion/effects)
- [YouTube Analytics API metrics](https://developers.google.com/youtube/analytics/metrics): `audienceWatchRatio`, `relativeRetentionPerformance`, `elapsedVideoTimeRatio`
- [vidIQ Outliers](https://vidiq.com/features/outliers/) and [vidIQ keyword research](https://support.vidiq.com/en/articles/9421214-keywords-research): For you, Rising keywords, and the limits of the free plan
