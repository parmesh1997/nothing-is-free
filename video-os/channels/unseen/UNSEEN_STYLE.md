# Unseen: format and visual system (draft)

**The channel:** everyday objects, and the mechanism inside them that nobody sees.
One object per episode, cut open, played back slower than it really happens.

Style frame: `lab/styleframe_match.jpg`. It was rendered by `lab/styleframe_match.py`
(Blender 5, Cycles), and the text layer is a mock of what Remotion would draw
(`lab/overlay_mock.py`). The label text is real chemistry. The `0.02 s` on the
ruler is a placeholder, not a sourced timing.

Unseen runs on the same pipeline as Someone Always Pays: the evidence gate, script
rules, one VO render, word timing, stills audit, proxy watch, Resolve, and the
Step 5 review loop. Only the look and the format are different, and they are
defined below.

---

## 1 · Why this look

| Constraint | What it decided |
| --- | --- |
| Blender and Remotion only, a 4070 Ti, one episode a week | Matte materials, an empty studio, soft light. No realistic textures, no heavy ray tracing, no fluid simulation |
| Must not look like Someone Always Pays | That channel is drawn 2D with ink. This one is clean 3D in a dark studio. Nobody should confuse the two |
| Must not look like stock or AI | Code-built objects in a fixed palette, and one cut plane as the signature. No photo textures |
| Humans are the most expensive thing in 3D | **No people.** If a hand is needed, it is a plain grey clay hand. Never a face |

---

## 2 · The visual constants

These are the same in every episode; they make the channel recognisable in one frame.

| Constant | Spec |
| --- | --- |
| **The studio** | A seamless slate cyclorama `#27313C` with a dark world. **Every episode is shot here.** No rooms and no locations, so there is nothing to build per episode except the object |
| **The cut** | The hero object is cut along one plane that faces the lens. Cut faces show what the thing is made of: coloured grains, layers, the wax inside the wood |
| **Clay materials** | Matte, roughness 0.5–0.9. Five to seven hues per object, and a small bevel on every edge. No photo textures, and no printed words on objects (all text is Remotion's) |
| **Cool studio, one warm story light** | Cool key, warm rim, low fill. The *event* (a spark, a current, heat) is the only warm light source |
| **The accent** | `#FFC83D` yellow means *the hidden thing*: label ticks, anchor rings, the ruler's playhead. The same idea as SAP's orange-means-money |
| **The time ruler** | Along the bottom: the real elapsed time of the event, with the playhead moving through it. It is the channel's progress rule, and it shows how slowed down the moment is |
| **Labels** | A dark card with a yellow kicker, a title, and one line of consequence, joined by a leader line to an anchor ring on the object. Labels arrive one at a time, when the narration names them |
| **Camera** | A long lens (70–100 mm) with shallow focus. Slow orbits and push-ins into the cut. Never a fast whip |

---

## 3 · Episode structure (8–12 minutes)

| Position | What happens |
| --- | --- |
| 0:00–0:10 | **The ordinary moment at real speed.** The match strikes. One second. Freeze |
| ~0:10–0:25 | **The promise.** "That took one second. Here is everything that happened in it." The ruler appears and the playhead rewinds to zero |
| by ~10% | **The cut opens.** The object splits along the plane: the signature move, every episode |
| 10–40% | **Stage by stage along the ruler.** Each stage is a stretch of the ruler, a push into the cut, and its label |
| by ~40% | **The unseen part.** The fact that re-frames the object (for the match: the phosphorus is on the box, and that separation is what makes it a *safety* match) |
| 40–70% | **Who built the trick.** The history, told briefly in the same studio with one period prop |
| ~70–85% | **What goes wrong.** Why a damp match fails, why the second strike works |
| close | **Reassemble.** An exploded view flies back together, then the ordinary moment plays at real speed again, and the viewer now sees everything in it. Fixed sign-off |

---

## 4 · The Blender kit (built once)

| Piece | What it does |
| --- | --- |
| `studio.py` | Cyclorama, three area lights, world, AgX view transform, camera defaults |
| `clay(name, colour, roughness)` | The material factory |
| `section(name, base, grains)` | Cut-face material: a base colour plus Voronoi grains per ingredient |
| `cut(object, plane)` | Bisect with the cut face filled by the section material. For a box it is just a half box whose front face is the section |
| `explode(parts, axis, t)` | Geometry Nodes: parts slide apart along an axis, keyed to a word |
| `streaks(origin, n)` | Sparks, dust or droplets as short emissive streaks, not a simulation |
| `export_anchors()` | Screen positions of the named label anchors, per frame: the same camera-JSON contract SAP uses |

`lab/styleframe_match.py` already contains first versions of `clay`, `section`,
`cut`, `streaks` and `export_anchors`. It is the start of the kit.

**Fire, liquid and smoke** are the expensive cases. They are drawn as stylised
shapes (an emissive flame mesh driven by noise, streaks, simple volumes), never as
a fluid simulation.

---

## 5 · Render budget on an RTX 4070 Ti (estimates, to be measured)

| Renderer | Use | Rough time per 1080p frame |
| --- | --- | --- |
| EEVEE | Most shots | ~1–3 s |
| Cycles (OptiX, 64 samples, denoised) | Two or three macro hero shots with glow | ~5–15 s |

A 10-minute episode is 14,400 frames. Mostly EEVEE is about **4–12 hours** of GPU
time a week, which fits overnight. The style frame took 3 minutes on this cloud
sandbox's 4 CPU cores in Cycles. Expect a few seconds on the 4070 Ti. EEVEE
will look slightly softer than this Cycles frame; judge the look on an EEVEE
still before locking the palette.

The SAP rule still applies: a locked-off shot renders one frame. The labels,
ruler and text animate in Remotion on top.

---

## 6 · Two channels, one pipeline

- **Someone Always Pays:** one episode a week, 2D drawn, the current runbook.
- **Unseen:** one episode a week, this document. It reuses the SAP runbook's Steps
  0–5 and scripts. It has no cast rig, no location cap (the studio is constant) and
  one hero object per episode.
- **A separate narrator voice** for Unseen, made with ElevenLabs Voice Design like
  SAP Narrator, so the channels do not sound like one person.
- **Evidence gate:** the same VPH floor. Check the established how-it-works 3D
  channels in vidIQ first (Jared Owen and Animagraffs are the obvious ones) and
  find the angle they have not taken: *the moment, slowed down, with the timing
  on screen*.

---

## 7 · A prompt for a moodboard image (ChatGPT or similar)

For reference boards only. Law 12 still holds: nothing generated appears on screen.
The prompt below keeps the image inside what EEVEE can actually do:

```
Stylised 3D product cutaway of [OBJECT], cut exactly in half along a plane facing
the camera, the cut face showing its inner layers as flat matte colours with small
coloured grains. Matte clay materials only, roughness high, no photographic
textures, no reflections, no glass caustics, no subsurface glow, small bevels on
every edge, simple geometric shapes. Seamless dark slate-blue studio backdrop
(#27313C) with a soft floor-to-wall curve. One large soft cool key light from the
upper left, a warm rim light from behind, and a single small warm light at the
point where [THE EVENT] happens. 70mm lens, three-quarter view from slightly
above, shallow depth of field. Real-time render look, clean and calm, like a
Blender EEVEE render. No text, no labels, no people, no hands.
```
