# EP02 · BEAT SHEET

**Topic:** The real-time auction behind every free ad-supported app · **Pillar B** · **Pattern 3 (The Trace)**
Companion to [EP02_01_SCRIPT.md](EP02_01_SCRIPT.md). 28 beats, B00–B27.

> **RECONCILED (Step 2 done).** The `EST` values in the per-beat blocks below are **superseded** — real durations, frame counts and `globalStartFrame` are in [EP02_RECONCILE.md](EP02_RECONCILE.md) / [reconcile.json](reconcile.json). Actual runtime **16:50.7**, `episodeTotalFrames` **30321** @ 30 fps. `CALIBRATED WPM` filled: **134** (§17.1). Creator picks delta option A / B / C before Step 3.

---

## Per-beat

```
B00  "Nothing is free. It ran an auction."      EST 6.1s     OPENING · signature
     Narration:     signature + the claim clause
     Words:         21
     Visual mode:   flat
     Motion intent: Lucky's hand holds a phone; a loading ring turns one tick;
                    a faint gavel-tick lands on the ring; a price ghosts in and
                    out. Signature audio stamp on the tick (§6.4 — SFX still
                    MISSING, assets/ep02_audio/sfx/stamp.wav).
     Planes:        BG locked field · MID a plain room edge, low contrast ·
                    FG the phone + hand (subject, 50% frame h), the ring, the type
     Camera:        still
     Peak:          on "auction", ~0:04
     Entry side:    subject already present
     Transition:    hard cut to B01
     Loop:          L0 opens (the claim)

B01  "The half second you never look at"         EST 28.7s    OPENING
     Narration:     the cold-open sting resolves + the promise (deliverables)
     Words:         96
     Visual mode:   2.5D (small)
     Motion intent: a packet leaves the phone screen, flies to an EXCHANGE node;
                    a ring of ~200 tiny company tiles lights around it; ONE tile
                    flares; a 1-cent coin drops onto the phone; "$0.0—?" resolves
                    to "≈ 1¢". Then three promise lines rise in the lower third.
     Planes:        BG field · MID the exchange ring at mid-depth · FG phone,
                    coin, the promise type
     Camera:        very small push toward the exchange on "who set that price"
     Peak:          the tile flare + coin, ~0:12  (sting MUST land by 0:10 — §15.2)
     Entry side:    packet exits screen-right toward centre
     Transition:    hard cut
     Loop:          L1 opens ("who set that price") · L2 opens ("about a cent")

B02  "The honest part"                            EST 32.2s    MEDIUM · save-the-cat
     Narration:     free apps are usually a good deal; the dev is not the villain
     Words:         108
     Visual mode:   flat
     Motion intent: an app grid fills; 97 of every 100 tiles wash to a tint;
                    a small two-person desk slides in under a "STUDIO" label;
                    Lucky on a couch, phone glow on her face, ads flicking past.
     Planes:        BG field · MID the app-grid wall · FG the studio desk +
                    Lucky (subject at human scale, ~40% frame h — §5.1), caption
     Camera:        still, slow breathe
     Peak:          on "still made money off me", ~0:30
     Entry side:    Lucky enters from L, sits
     Transition:    hard cut
     Loop:          —

B03  "It is a big rent"                            EST 26.8s    MEDIUM
     Narration:     ~$390B/yr in-app ad spend; >80% of all mobile ad spend
     Words:         90
     Visual mode:   flat
     Motion intent: "$390,000,000,000" counts up as a hero figure; a single bar
                    fills to 82% under "MONEY SPENT ADVERTISING ON PHONES";
                    behind it, tick marks multiply into a grey field ("a few
                    billion / hour").
     Planes:        BG field · MID the tick field · FG hero number + bar + label
     Camera:        still; small push on the count
     Peak:          the number landing, ~0:12
     Entry side:    number rises from the ground rule
     Transition:    hard cut
     Loop:          —

B04  "Start with the tap"                          EST 32.8s    HIGH
     Narration:     the bid request and everything it carries; you agreed in setup
     Words:         110
     Visual mode:   flat
     Motion intent: phone screen; a request-card peels off it and opens; fields
                    stamp on in sequence (ADVERTISING ID · LOCATION · MODEL ·
                    CARRIER · APP · TIME · "+ what the kit knows"); a setup screen
                    ghosts behind with a checkbox already ticked.
     Planes:        BG field · MID the setup screen, low contrast · FG phone +
                    the request-card (subject), field type
     Camera:        still; the card is the anchor
     Peak:          "That packet is the thing being sold. You." ~0:30
     Entry side:    card peels up from screen
     Transition:    hard cut
     Loop:          —

B05  "How does a word game know your age"          EST 36.1s    MEDIUM
     Narration:     the borrowed kits (SDKs); ~10 per app, 2–3 dozen in news/weather
     Words:         121
     Visual mode:   2.5D (small)
     Motion intent: one app icon; ~10 chips plug into its edge; the same chip
                    design is then shown riding inside a row of other app icons;
                    a line links "Mon · shopping" to "Thu · word game" past a
                    shared chip.
     Planes:        BG field · MID the row of other apps at mid-depth · FG the
                    focus app + its chips, the link line
     Camera:        small pan along the row of apps on "rides inside thousands"
     Peak:          "a piece of ten advertising companies", ~0:33
     Entry side:    chips enter from R, staggered 4f
     Transition:    matched motion (a chip carries into B06)
     Loop:          —

B06  "All those kits write to one number"          EST 23.3s    MEDIUM
     Narration:     the advertising ID as the spine; you can reset it, nobody does
     Words:         78
     Visual mode:   flat
     Motion intent: a single long ID string / barcode draws vertically as a
                    spine; the chips from B05 all fire arrows into it; a settings
                    row appears with a "Reset" toggle that no hand touches.
     Planes:        BG field · MID faint chip cloud · FG the ID spine (subject),
                    the toggle, label
     Camera:        still
     Peak:          "Almost nobody ever does.", ~0:22
     Entry side:    spine draws from the ground rule upward
     Transition:    hard cut
     Loop:          —

B07  "The exchange makes you a lot"                 EST 33.7s    HIGH
     Narration:     fan-out to dozens/hundreds of buyers; 100ms; remember the losers
     Words:         113
     Visual mode:   2.5D
     Motion intent: NEW COMPONENT AuctionFan — the exchange node throws lines out
                    to an arc of ~120 buyer tiles; each tile blinks a bid; a
                    100ms clock sweeps; tiles that miss the sweep grey out.
                    Ends holding the full arc.
     Planes:        BG field · MID the exchange node · FG the buyer arc (fills
                    the lower + mid frame — occupancy anchor), the clock
     Camera:        push in on the node, then PULL to reveal the whole arc
                    (reason: show how many strangers get your description) —
                    wide-end occupancy must hold (§3.3)
     Peak:          "one hundred milliseconds", ~0:20
     Entry side:    lines fan from centre outward
     Transition:    continuous camera move into B08
     Loop:          L3 opens ("remember the losers")

B08  "That is you, priced"                          EST 32.2s    HIGH
     Narration:     eCPMs by format → divide by 1,000 → 0.1¢–2¢ per view
     Words:         108
     Visual mode:   flat
     Motion intent: three price cards deal in ($1.20 / $10 / $20 per 1,000);
                    a "÷ 1,000" operator drops; the result "0.1¢ – 2¢" slams in
                    as the hero; a faint world map dims everywhere outside a few
                    regions.
     Planes:        BG field · MID the dimmed map · FG the price cards → the
                    hero result, unit label
     Camera:        still; hard settle on the hero
     Peak:          "That is you, priced.", ~0:30
     Entry side:    cards from R, stagger 5f
     Transition:    hard cut
     Loop:          L2 sharpens

B09  "Why the gap"                                  EST 28.7s    MEDIUM
     Narration:     targeting — richer description = higher bid
     Words:         96
     Visual mode:   flat
     Motion intent: NEW COMPONENT ProfileCard — a sparse card ("someone,
                    somewhere · $") sits left; a rich card ("woman · 30s · near
                    pharmacy · opened baby-care app · $$$$") builds line by line
                    on the right; a price meter climbs as lines are added.
     Planes:        BG field · MID a soft grid · FG the two cards + the meter
     Camera:        still
     Peak:          the meter maxing on the rich card, ~0:24
     Entry side:    rich-card lines from R
     Transition:    hard cut
     Loop:          —

B10  "This is not a rare event"                     EST 28.3s    MEDIUM
     Narration:     ~14 trillion auctions/day; 1M/sec per bidder; you trigger thousands
     Words:         95
     Visual mode:   flat
     Motion intent: a counter tears upward toward 14,000,000,000,000 and can't
                    settle; "1,000,000 / SEC" stamps on a bidder box; small
                    Lucky-on-couch with a tally counting to "~3,000" over the day.
     Planes:        BG field · MID the counter wall · FG the bidder box + Lucky
                    vignette + tally
     Camera:        still; the counter's motion is the event
     Peak:          "fourteen trillion", ~0:10
     Entry side:    counter from the ground rule
     Transition:    hard cut

B11  "The money does not go straight to the app"    EST 29.5s    HIGH
     Narration:     winner served; the payment flows back down through every hand
     Words:         99
     Visual mode:   2.5D
     Motion intent: the winning tile lights; the ad paints onto the phone; a
                    dollar coin then travels BACK along the chain, passing through
                    four gates, a sliver shaved at each, arriving small.
     Planes:        BG field · MID the chain of gates at mid-depth · FG the coin
                    (tracked subject), the phone, gate labels
     Camera:        track the coin right-to-left along the chain (follow the money)
     Peak:          the coin arriving shrunk, ~0:27
     Entry side:    coin travels R→L
     Transition:    matched motion into B12 (the coin becomes the ledger's top line)

B12  "Walk one real ad down that chain"             EST 36.4s    BUILD
     Narration:     $2.00 CPM → tolls → ~$1.00 to the app → app keeps ~half of 0.1¢
     Words:         122
     Visual mode:   flat
     Motion intent: NEW COMPONENT TollStack — a ledger builds top-down:
                    $2.00 → −20% buy → −15% exchange → −15% sell → −data →
                    ≈ $1.00 → ÷ 1,000 → 0.10¢ → app keeps ≈ 0.05¢. Each line
                    lands on the one above; the bar on the right shrinks in step.
     Planes:        BG field · MID faint column rules · FG the stack (subject,
                    fills bottom two-thirds — occupancy anchor), the shrink bar
     Camera:        small push as the stack passes the midline
     Peak:          "the app kept about half of that", ~0:33
     Entry side:    lines drop from top, stagger 6f
     Transition:    hard cut

B13  "Half of every ad dollar disappears"           EST 41.2s    HIGH · L1-correction
     Narration:     the repeated myth; 2020 (15p) → 2022 (3p, 65p to publisher)
                    → 2023 US (36¢ reaches a real person); it's tolls + waste
     Words:         138
     Visual mode:   flat
     Motion intent: a big "50%" myth stamps in, then a red offset X strikes it;
                    three dated study cards deal left-to-right with their headline
                    figures; the "36¢" card ends as the hero.
     Planes:        BG field · MID a timeline rule 2020–2023 · FG the struck myth
                    → the three cards → 36¢ hero, source tags on each
     Camera:        small pan across the timeline as cards land
     Peak:          "thirty-six cents", ~0:33
     Entry side:    cards from R, stagger 6f
     Transition:    hard cut
     Loop:          L1 (the correction is audible here — §15.2 inherited-claim)

B14  "Where does the wasted part go"                EST 27.5s    MEDIUM
     Narration:     made-for-advertising sites; ~1 ad in 5 in the 2023 study
     Words:         92
     Visual mode:   flat
     Motion intent: a webpage mock assembles as nothing but ad slots — no
                    headline, no body; a "1 IN 5" bar fills; a small flame sits
                    on a dollar and eats it.
     Planes:        BG field · MID the blank page frame · FG the ad-slot grid,
                    the bar, the burning dollar
     Camera:        still
     Peak:          "the advertiser's own money, burning quietly", ~0:25
     Entry side:    slots tile in from top-left
     Transition:    hard cut

B15  "One toll, with a real name"                   EST 22.7s    MEDIUM
     Narration:     The Trade Desk ≈ 20% take; one of several steps
     Words:         76
     Visual mode:   flat
     Motion intent: a named card ("THE TRADE DESK — largest independent buying
                    platform"); a bar with ~20% wedged out and labelled "fee to
                    run the software"; behind it, 3–4 more unlabelled toll-gates
                    recede.
     Planes:        BG field · MID the receding toll-gates · FG the named card +
                    the wedge bar
     Camera:        small push; the receding gates parallax
     Peak:          "one fifth of the money", ~0:16
     Entry side:    card from R
     Transition:    hard cut

B16  "The app changes shape around it"              EST 29.9s    MEDIUM
     Narration:     add a rewarded video → ARPDAU +30–60%; the game builds a seat
     Words:         100
     Visual mode:   flat
     Motion intent: a plain game screen; a "WATCH 30s TO CONTINUE" panel grows
                    out of it; an ARPDAU bar steps up +30–60% with a countdown
                    ring inside the panel.
     Planes:        BG field · MID the game screen · FG the rewarded panel
                    (subject), the ARPDAU bar
     Camera:        still
     Peak:          "with you in it", ~0:28
     Entry side:    panel expands from centre
     Transition:    hard cut

B17  "One more group, just reading"                 EST 15.5s    REST · mid-tease
     Narration:     the player in the auction that isn't buying an ad
     Words:         52
     Visual mode:   flat
     Motion intent: the company chain sits lit; at the back, one unlit tile with
                    an eye/ear mark; a question mark rises over it; everything
                    else dims slightly toward it.
     Planes:        BG field · MID the chain · FG the back tile + "?"
     Camera:        very slow push toward the back tile
     Peak:          "not who you would think to blame", ~0:14
     Entry side:    —
     Transition:    hard cut
     Loop:          L4 opens (the tease)

B18  "Quick question first"                         EST 17.0s    REST · engagement (~50%)
     Narration:     guess how many ads your last free app showed you
     Words:         57
     Visual mode:   flat
     Motion intent: Lucky lowers the phone and looks up; a comment field slides
                    in with a blinking cursor; a "?" where a number will go;
                    hold on her.
     Planes:        BG field · MID room edge · FG Lucky (human scale), the
                    comment field
     Camera:        still, breathe
     Peak:          "low by about half", ~0:16
     Entry side:    Lucky already present; field from bottom
     Transition:    hard cut
     Loop:          L5 opens (prediction — paid off B26 + pinned comment)

B19  "Back to the auction, and to the losers"       EST 37.0s    HIGH · L3+L4 close
     Narration:     losing bidders keep the data; 2021 Senate ask; Dec 2024 order
     Words:         124
     Visual mode:   2.5D
     Motion intent: the AuctionFan returns; one tile wins and lights; the other
                    ~120 stay lit and each keeps a copy of the ProfileCard;
                    a 2021 letter prop and a Dec-2024 order prop stamp in.
     Planes:        BG field · MID the fan · FG the kept ProfileCards spreading
                    across the lower frame (occupancy anchor), the two typeset props
     Camera:        pull slightly to take in how many copies exist
     Peak:          "the first order of its kind", ~0:34
     Entry side:    cards multiply outward from the fan
     Transition:    continuous move into B20

B20  "Dots become a life"                           EST 32.8s    HIGH
     Narration:     stitched location = home/work/clinic; bulk sale; some to govt
     Words:         110
     Visual mode:   2.5D (small)
     Motion intent: a scatter of pins on a plain map resolves into a labelled
                    path — HOME · WORK · a clinic · a courtroom · a place of
                    worship (FTC complaint categories — §14.4, plain, one clause
                    each); a bulk crate stamps "HUNDREDS OF MILLIONS OF DEVICES";
                    a government building silhouette receives one.
     Planes:        BG field · MID the map plane · FG the path + labels, the crate
     Camera:        slow pull from one pin out to the whole path (reveal context)
     Peak:          "a record of where people go", ~0:26
     Entry side:    pins already scattered; path draws
     Transition:    hard cut
     Loop:          L4 closes

B21  "Most of the money is not there"               EST 38.5s    HIGH · L1 begins to close
     Narration:     ~75% inside walled gardens; Google ~$200B, Meta ~$190B,
                    Amazon >$20B/qtr; no toll chain because one owner
     Words:         129
     Visual mode:   2.5D
     Motion intent: NEW COMPONENT WalledVsOpen — the whole toll chain shrinks
                    into a box marked OPEN on the left; a large solid block marked
                    WALLED rises on the right; a spend bar fills ~75% into the
                    block; three hero values stack (200B / 190B / 20B per qtr).
     Planes:        BG field · MID the two zones · FG the spend bar + the hero
                    values (wordmarks = sourced SVG or channel-font typeset,
                    never generated — §7.8)
     Camera:        PULL BACK hard to reveal the walled block dwarfing the open
                    chain (reason: relative size is the point) — wide-end
                    occupancy must hold (§3.3)
     Peak:          "two hundred billion dollars", ~0:28
     Entry side:    the walled block rises from the ground rule
     Transition:    hard cut

B22  "Apple plays this cleverly"                    EST 30.1s    MEDIUM
     Narration:     2021 tracking prompt → everyone's price drops → 2022 Apple
                    grows its own App Store ads; it already knows your downloads
     Words:         101
     Visual mode:   flat
     Motion intent: NEW COMPONENT PermissionPrompt — a typeset "Allow [App] to
                    track…?" dialog; the "Ask App Not to Track" option highlights;
                    a market price line sags; then an "APP STORE — Sponsored"
                    slot lights up under Apple's own wall.
     Planes:        BG field · MID the store shelf · FG the prompt → the sagging
                    line → the sponsored slot
     Camera:        still
     Peak:          "The referee opened its own betting window.", ~0:29 (the one [dry])
     Entry side:    prompt from centre; slot from R
     Transition:    hard cut

B23  "Owning every step is how you get sued"        EST 27.5s    MEDIUM · L1 closes
     Narration:     April 2025 — a US federal judge: Google illegally monopolised
                    the publisher ad server and the ad exchange
     Words:         92
     Visual mode:   flat
     Motion intent: a gavel prop; "APRIL 2025" stamps; two boxes —
                    "PUBLISHER AD SERVER" and "AD EXCHANGE" — each takes a
                    "MONOPOLY" stamp; a triangle labelled MARKETPLACE / BUYER /
                    SELLER collapses onto one wordmark.
     Planes:        BG field · MID a courtroom rail, low contrast · FG the two
                    boxes + stamps, the triangle
     Camera:        still; hard settle on each stamp
     Peak:          "against the law", ~0:25
     Entry side:    boxes from L and R
     Transition:    hard cut

B24  "It is not that simple"                        EST 38.5s    HIGH · counter-argument
     Narration:     97% free / almost nobody pays / the auction funds the small
                    studio; ~1-in-1,000 click; invasive AND pointless
     Words:         129
     Visual mode:   flat
     Motion intent: the 97% app grid returns; the two-person studio from B02
                    re-enters; a "1 / 1,000" click tally ticks once and stops;
                    a balance scale wobbles between INVASIVE and POINTLESS and
                    settles level.
     Planes:        BG field · MID the app grid · FG the studio + the scale + tally
     Camera:        still, breathe
     Peak:          "invasive and pointless at the same time", ~0:34
     Entry side:    studio from L; scale from top
     Transition:    hard cut to black-in for the Dark Law

B25  "You were never the user"                      EST 31.0s + [DROP]   REVERSAL · Dark Law
     Narration:     run it forward — the app's real job is to describe you so a
                    stranger will bid; you are the inventory; free because you sell
     Words:         104
     Visual mode:   flat (Dark Law — §2.9)
     Motion intent: paper field crossfades to ink over 20f; grid stays at 8%
                    white; progress rule stays orange; the app icon flips to a
                    lot number / barcode; the reversal line types on in mono;
                    after the [DROP], "Nothing is free." types on, silent
                    (§6.4 SignatureReturn). Music has stopped.
     Planes:        BG ink field + faint grid + progress rule · MID — · FG the
                    flipped icon, the typed line
     Camera:        locked. No move. The crossfade carries it.
     Peak:          "because you sell." then the silence, ~0:30
     Entry side:    —
     Transition:    slow fade up from ink into B26
     Loop:          L0 closes · L1/L2 resolved

B26  "You will feel it now"                         EST 30.1s    MEDIUM · implication
     Narration:     the load-stutter IS the auction; ATT lowers your price;
                    ~1 in 7 turn it on
     Words:         101
     Visual mode:   flat
     Motion intent: a phone opens and the load-stutter is drawn as the AuctionFan
                    firing once, fast; the PermissionPrompt returns; a small
                    "1 in 7" figure fills.
     Planes:        BG field (paper returns) · MID room edge · FG the phone +
                    the quick fan, the prompt
     Camera:        still
     Peak:          "It just lowers your price.", ~0:24
     Entry side:    —
     Transition:    hard cut
     Loop:          L5 closes (pinned comment finishes it at ship)

B27  "Next time"                                    EST 25.7s    MEDIUM · bridge + CTA
     Narration:     bridge → Google Maps; CTA → names "56% of Every Movie Ticket
                    Doesn't Go to the Theater", subscribe
     Words:         86
     Visual mode:   flat
     Motion intent: a plain route line draws across a minimal map to a pin;
                    "NEXT — GOOGLE MAPS" sets; the previous-episode card slides in
                    ("56% OF EVERY MOVIE TICKET…"); a subscribe prompt.
     Planes:        BG field · MID the map · FG the route + pin, the two cards
     Camera:        small push along the route
     Peak:          "the next one finds you", ~0:24
     Entry side:    route draws L→R
     Transition:    end
     Loop:          —
```

---

## Runtime — RECONCILED

| Segment | Beats | Actual |
| --- | --- | --- |
| Cold open + promise + save-the-cat | B00–B02 | 1:25.5 |
| The mechanism (tap → request → kits → ID) | B03–B06 | 3:11.7 |
| The auction (fan-out → price → scale) | B07–B10 | 2:30.7 |
| The skim (winner → worked example → correction → waste → named toll) | B11–B15 | 3:11.6 |
| The turn (app reshapes → tease → engagement) | B16–B18 | 1:06.9 |
| The reveal (losers → where it goes → walled gardens → Apple → the ruling) | B19–B23 | 3:25.6 |
| Counter-argument + reversal + implication + bridge | B24–B27 | 2:36.1 |
| **TOTAL** | | **16:50.7** |

`episodeTotalFrames` **30321** @ 30 fps. Within the 12:00–60:00 window (§0.2); +1:50.7 over the 15:00 intake target. Delivered 133.8 wpm — the runbook's 205 assumption (§6.1) was ~35% too fast; `CALIBRATED WPM` is now **134**. Per-beat frames and `globalStartFrame` in [EP02_RECONCILE.md](EP02_RECONCILE.md).

**If the creator picks trim option B**, the reconcile-only body beats that could come back if a later cut over-corrects: consent-string / "we value your privacy" pop-ups + the IAB framework · the history of RTB (first ad exchanges, ~2007–2009) · verification vendors as another toll · kids' apps + the COPPA actions.

---

## Density arithmetic (§15.2 / §2.2)

Sourced items: **~40 discrete data points** (see Number Log) across the reconciled **16.85 min** → **~2.4 per minute**. Floor is **1 per 60s**. Every 3-minute window carries ≥5.

| Window | Sourced items |
| --- | --- |
| 0:00–3:00 (B00–B06) | 97% free · $390B · 82% · bidstream fields · ~10 kits/app · 2–3 dozen (news/weather) · advertising-ID mechanism |
| 3:00–6:00 (B07–B12) | 100ms · hundreds of buyers · $1.20/$10/$20 eCPM · 0.1¢–2¢ · ~14T/day · 1M/sec · 3.5h/day · toll stack (20% / 10–20%) |
| 6:00–9:00 (B13–B18) | 15p→3p · 51%→65% · 36¢ · ~1-in-5 MFA · Trade Desk ~20% · ARPDAU +30–60% |
| 9:00–12:00 (B19–B23) | Wyden 2021 · FTC Dec 2024 order · hundreds of millions of devices · govt purchases · ~75% walled · $200B · $190B · $20B/qtr · ATT 2021 · App Store ads 2022 · Apr 2025 ruling |
| 12:00–end (B24–B27) | 97% · ~1-in-1,000 CTR · ~1-in-7 ATT opt-in |

---

## Loop table

| Loop | Opens | Closes | What |
| --- | --- | --- | --- |
| **L0** signature claim | B00 | B25–B26 | "it ran an auction the second you opened it" → the reversal |
| **L1** who set the price | B01 | B21–B23 | "who set that price" → walled gardens + the monopoly ruling |
| **L2** what your attention costs | B01 → B08 | B12 / B24 | "about a cent" → "0.1¢–2¢" → "the app kept about half of that" |
| **L3** the losing bidders | B07 | B19 | "remember the losers" → the ~120 who keep your data for free |
| **L4** the mid-tease | B17 | B19–B20 | "one more group, just reading" → data brokers, where it goes |
| **L5** the prediction | B18 | B26 + pinned comment | "guess how many ads" → "a note about where you are" |

All open loops close on screen by B26; L5's payoff is completed by the pinned comment at ship (§13, §15.5).

---

## Number Log  *(draft — firm every row at Step 2 before the figure is spoken; §9.2, §15.2)*

| # | Figure (as spoken) | Value | Year | Tier | Reported / estimated | Source to lock |
| --- | --- | --- | --- | --- | --- | --- |
| N1 | Apps that cost nothing up front | ~97% | 2024 | 2 | Reported | Statista / Google Play distribution (96.9%) |
| N2 | In-app ad spend, global | ~$390B/yr | 2025 | 3 | **Estimated** (forecast) | Publift / market trackers — say "around" |
| N3 | In-app share of mobile ad spend | >80% | 2025 | 3 | Estimated | same |
| N4 | Bid-request contents | device ID, coarse location, IP, model, carrier, app, time | 2021 | 1 | Reported | Wyden–Cassidy bidstream letters (2021); FTC data-broker complaints |
| N5 | Tracking/ad kits per free app | ~10 median; 2–3 dozen in news/weather | 2018–24 | 2/3 | Reported (research) | Binns et al. 2018 "Third Party Tracking in the Mobile Ecosystem"; Exodus Privacy — **re-verify current** |
| N6 | RTB bid-response window | ~100ms (spec cap 100–300ms) | 2024 | 2 | Reported | IAB OpenRTB 2.x spec |
| N7 | Buyers a request fans out to | dozens–hundreds | — | 3 | Reported | ad-tech technical descriptions; Wyden letter ("hundreds of companies") |
| N8 | eCPM, US | banner ~$1.20; interstitial ~$10; rewarded video ~$16–20 | 2025–26 | 3 | Reported (benchmark) | Playio / Appodeal / Playwire benchmarks — say "around" |
| N9 | Auctions per day, all exchanges | ~14 trillion | 2026 | 3 | **Estimated** (industry aggregate) | one industry count — attribute as "one industry count" |
| N10 | DSP decisioning throughput | ~1,000,000 requests/sec | 2026 | 3 | Reported (benchmark) | industry aggregate |
| N11 | Time in apps per day, average | ~3.5 h | 2025 | 3 | Reported (measurement) | data.ai / market trackers |
| N12 | Programmatic toll split | DSP ~15–20%; SSP/exchange ~10–20% each | 2024 | 3 | Reported (ranges) | The Drum; Adalytics; UK CMA adtech appendix |
| N13 | The Trade Desk take rate | ~20% of gross spend (20.3%, 2024) | 2024 | 1 | Reported (derived from filings) | TTD 10-K / earnings — phrase as "about a fifth" |
| N14 | ISBA/PwC — unattributable spend | 15% (2020) → ~3% (2022) | 2020 / 2022 | 2 | Reported (study) | ISBA/PwC Programmatic Supply Chain Transparency Study I & II |
| N15 | ISBA/PwC — publisher share | 51% (2020) → 65% (2022) | 2020 / 2022 | 2 | Reported (study) | same |
| N16 | ANA — share of the dollar reaching a real viewable impression | ~36¢ (2023) | 2023 | 2 | Reported (log-level study) | ANA Programmatic Media Supply Chain Transparency Study, Dec 2023 |
| N17 | ANA — impressions on made-for-advertising sites | ~1 in 5 (~21%) | 2023 | 2 | Reported (study) | same — re-check exact MFA % |
| N18 | ARPDAU lift from adding rewarded video | +30–66% | 2025 | 3 | Reported (benchmark) | Playio / gamigion 2025 benchmark |
| N19 | Losing bidders retain bidstream data | asserted practice; regulator-confirmed for named firms | 2021 / 2024 | 1 | Reported | Wyden 2021; FTC v. Mobilewalla order Dec 2024 |
| N20 | FTC Mobilewalla order — first ban on retaining RTB-auction data for non-auction use | Dec 2024 | 2024 | 1 | Reported (FTC order) | FTC press release + order |
| N21 | Location data sold in bulk | hundreds of millions of devices | 2024–2026 | 1 | Reported (regulatory) | FTC v. Kochava settlement (2026); FTC Gravy/Venntel (Dec 2024) |
| N22 | Location data resold to government agencies without a warrant | asserted; documented for Venntel/Babel Street | 2020–24 | 1/2 | Reported | FTC Gravy/Venntel action; DHS OIG report; Senate Finance findings — **lock exact wording at Step 2**, fallback line if not firmly citable |
| N23 | Walled gardens' share of this ad spending | ~70–80% | 2025 | 3 | Estimated | Redseer / trade anal. — say "around three quarters" |
| N24 | Alphabet advertising revenue | ~$200B | 2025 (FY) | 1 | Reported | Alphabet 10-K |
| N25 | Meta advertising revenue | just under $190B | 2025 (FY) | 1 | Reported | Meta 10-K |
| N26 | Amazon advertising revenue | >$20B in a quarter (~$21B Q4 2025) | 2025 | 1 | Reported | Amazon 10-K / earnings |
| N27 | Apple — ATT prompt enforced | 2021 | 2021 | 1 | Reported | Apple / iOS 14.5 release |
| N28 | Apple — expanded App Store ads | 2022 | 2022 | 2 | Reported | Apple Search Ads expansion, Oct 2022 (press) |
| N29 | Google ad-tech monopoly ruling | liable — publisher ad server + ad exchange | Apr 2025 | 1 | Reported (court ruling) | *US v. Google*, EDVA, ruling 17 Apr 2025 (Judge Brinkema) |
| N30 | Display ad click-through rate | ~0.1% (standard banner lower) | 2024–26 | 3 | Reported (benchmark) | Smart Insights / display benchmarks — "about once in a thousand" |
| N31 | ATT opt-in rate | ~14% (≈ 1 in 7), globally | 2024 | 3 | Reported | Singular / Business of Apps / AppsFlyer |

**Inherited-claim correction (§15.2 — required, must be audible):** "half of every ad dollar is lost to ad tech." Corrected in B13 — the ISBA/PwC follow-up put publisher share at ~65% and unattributable spend at ~3%, while the ANA's harsher US study found only ~36¢ reaches a real viewable impression, most of the loss being *waste* (fake sites, unseen ads), not a single middleman taking half.

**Counter-argument (§6.2 — present, B24):** the auction is not simply predatory — ~97% of apps are free because almost nobody will pay, the model is what keeps small developers alive, and the advertiser typically gets almost nothing back (~0.1% CTR). It is wasteful and invasive at once; "heist" overstates it.

---

## Script gate self-check (§15.2)

| Check | Requirement | Status |
| --- | --- | --- |
| Word count | Within 5% of budget at calibrated WPM | ~2,800 PLAIN vs ~2,950 interim budget → ~5% under. ⚠️ Acceptable; confirm at reconcile once `CALIBRATED WPM` exists |
| Every beat names a drawable thing | Required | ✅ all 28 (see Motion intent / Planes per beat) |
| No recognisable real person required | Required | ✅ companies named + shown as sourced-SVG/typeset wordmarks (§7.8); senators, the judge unnamed on screen |
| Cold open | Character + action + contradiction + curiosity in 10s | ✅ B00–B01. ⚠️ scene build must land the "≈1¢" sting by 0:08–0:10 |
| v3 tags | ≤1/sentence · ~1 per 3–4 sentences · banned set absent | ✅ ~34 tags / ~150 sentences (~1 per 4.4) · banned set absent · `[dry]` ×1 (B22) · `[whispers]` unused |
| Signature | Untagged emotion, verbatim, inside 3s | ✅ "Nothing is free." + `[matter-of-fact]` per the canonical B00 example (§6.4); claim clause by 0:03 |
| Meaning independent of tags | Every sentence works if the tag is ignored | ✅ checked beat by beat |
| Density floor | ≥1 sourced item / 60s | ✅ ~2.7/min; every 3-min window ≥6 |
| Beat IDs | B00 onward, contiguous | ✅ B00–B27 |
| Reversal | Exists, is a reversal not a summary | ✅ B25 — role flip ("you were never the user; you are the inventory"), not a recap |
| Pattern variance vs previous | Differs from Ep 1 | ⚠️ Ep 1's pattern not on record here — this is Pattern 3 (Trace). Confirm no collision when Ep 1 script is to hand |
| No reused hook / bridge / close lines | Zero recycled | ⚠️ Run the §14.2 noun-swap test against the Ep 1 script at Step 3 |
| Bridge | Names a real planned next episode | ✅ Google Maps (Appendix E #4; bridge chain 2→4) |
| CTA | Names the previous episode | ✅ "56% of Every Movie Ticket Doesn't Go to the Theater" (creator-specified) |

## Anti-template check (§14.2)

| Rule | This episode |
| --- | --- |
| ≥2 new components/shells | **5**: `AuctionFan`, `TollStack`, `ProfileCard`, `WalledVsOpen`, `PermissionPrompt` |
| No shell in >50% of beats | Shells spread across phone-screen / diagram / data-card / Lucky-scene / Dark-Law — none dominates |
| Choreography differs from previous | Trace structure, coin-tracked money-flow, fan-out reveal — verify against Ep 1 at Step 3 |
| Noun-swap test | Run at Step 3 vs the Ep 1 script |

---

## Open flags carried to Step 2 / Step 3

1. **`CALIBRATED WPM` (§17.1)** — still blank; every EST and the word budget ride on 205 wpm.
2. **N5, N17, N22** — verify exact figures and lock citations before those lines are recorded; N22 (government purchases) gets a firm cite or the safer fallback line.
3. **Cold-open sting timing** — the "≈1¢" number must be on screen by ~0:08 (§15.2 hook check); design B01 states accordingly.
4. **Company wordmarks** — Google, Meta, Amazon, Apple, The Trade Desk: on screen only as sourced SVG or channel-font typeset, never generated (§7.8).
5. **Ep 1 cross-checks** — pattern collision, noun-swap, choreography divergence — need the Ep 1 script/scenes at Step 3.
6. **Signature stamp SFX** — `assets/ep02_audio/sfx/stamp.wav` still a `MISSING EXTERNAL ASSET` (channel-level, from Phase 0).
```
