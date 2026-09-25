# Someone Always Pays: the new sub-niche (from episode 10)

Final version, after the QA audit (`SAP_QA_Audit.md`). **The recommendation changed from
"The Legal Heist" to "The Money Whodunit"**: finding S1 in the audit explains why.
**Chosen by the creator on 2026-09-25.** The runbook applies it throughout.

---

## 1 · In one word: **Whodunit**

> **Every episode, someone takes your money, legally. By the end, you know who.**

The channel's name and sign-off already are a whodunit: *"Someone always pays. Now you
know who."* The episodes have been explainers wearing that line. From episode 10, they
are mysteries that earn it.

---

## 2 · Why episodes 1–9 had no curiosity

Every title promised an **explanation** ("why X costs Y", "how X makes money"). The
viewer assumes the answer before clicking ("they profit from it"), nobody in the story
has anything to lose, and an explanation has no twist to wait for.

**The first fix I proposed (the heist) still had this problem.** A heist introduces
the crew early and keeps *how they did it* as the open question, and "how does it
work?" is the explainer question in costume. **A whodunit keeps *who* open until the
end.** That question can't be answered by assumption, only by the reveal.

| Frame | The question held open | Where it's answered | Verdict |
| --- | --- | --- | --- |
| Explainer (episodes 1–9) | "Why is it expensive?" | Guessed before clicking | No curiosity |
| The Catch (the other session's) | "What's in the fine print?" | Piecemeal, as a list | Educational; pulls toward advice |
| The Legal Heist (my first answer) | "How did they do it?" | Through the whole middle | The explainer engine in costume |
| **The Money Whodunit** ⭐ | **"Who actually took it?"** | **At ~85%, by name** | **Held to the end; matches the tagline** |

### 2.1 · What our own numbers say (read 2026-09-25, creator's figures)

| Episode | Uploaded (IST) | Impressions | Views | Avg view duration | Viewer is the payer? |
| --- | --- | --- | --- | --- | --- |
| $9 popcorn saves the cinemas | Saturday night | ~600–700 (3 weeks) | ~100 | ~2:00 of ~8:00 (≈25%) | **Yes**: your popcorn |
| Printer ink dearer than blood | Sunday night | ~450 | 57 | ~3:30 of ~13:00 (≈27%) | **Yes**: your ink |
| Google Maps' $11B a year | Weekday | ~300–400 | ~32 | — | No: a company's income |
| How free local TV gets paid | Weekday | ~200 | ~30 | — | Half: free to you |
| Latest (1 day old) | Weekday | 56 | 4 | CTR ~3% | Too young to read |

**Three readings, in order of confidence:**

1. **Retention is the ceiling, not clicks.** Both of the best-reached episodes kept
   about a quarter of the video. YouTube showed them to a few hundred people, the
   people who clicked mostly left early, and the test stopped there. Clicks earn the
   test; what viewers do after the click decides whether it grows. This is the
   problem the whodunit exists to fix: a question held to 85% instead of an answer
   guessed before the click.
2. **The payer in the title wins.** The two best titles put the viewer's own
   purchase and an absurd number in front ("$9 popcorn", "ink dearer than blood").
   The weaker ones were about how a company earns money, where the viewer has no
   stake. It matches case test row 2 (the victim) and is now a Step 0 gate (runbook
   §6.0).
3. **Weekend evenings (IST) did better, but it isn't proven.** The popcorn episode is
   also the oldest, and old videos keep collecting impressions. From now on,
   episodes are compared at the same age (Studio's *First 7 days*), and the upload
   slot is fixed on Saturday at 21:30 IST so the day stops being a variable (runbook
   §1.4, §6.1).

**Figures this small swing a lot.** Five episodes with a few hundred impressions each
point the way, and the next three cases confirm it or don't (§1.3's rule: one episode
is noise, three in a row are a signal).

---

## 3 · Why a viewer would watch ours when the topic is already on YouTube

This is the question every episode must answer at Step 0, and the whodunit answers it
by design:

1. **Their answer is our red herring.** The popular videos on a topic give the obvious
   answer ("airports are greedy"). In our episode that's **suspect number one, and it
   gets cleared on screen.** A viewer who already watched those videos gets a twist,
   not a repeat. *If the popular answer is the whole story, the topic fails Step 0.*
2. **They explain; we solve.** The same sourced facts, run through a mystery engine: a
   crime, suspects, clues and a reveal.
3. **You're in it.** Lucky, the recurring victim (and sometimes the culprit), stands in
   for the viewer. Explainers talk about companies; we follow a person.
4. **Receipts in a drawn world.** Real documents on screen (§9.9): the scam-exposé
   channels' strongest device, in a format none of them use.
5. **A series, not a feed of topics.** The same detective voice, the same victim, and
   case devices that return. Viewers binge characters, not subjects.

### 3.1 · "What if the idea is saturated?"

**A saturated topic and a saturated angle are different things**, and only the second
one is a problem.

- **YouTube doesn't refuse crowded topics.** It shows every video to a small test
  audience and then asks one question: *is this a better recommendation for this viewer
  than everything else I could show them?* A tenth identical explainer loses that
  comparison. A video with **a different reason to watch** can win it, even on a crowded
  topic.
- **A crowded topic helps us.** If thirteen videos all say "cinemas are greedy",
  that's thirteen videos' worth of viewers who hold our red herring. Our twist lands
  hardest on exactly those people.
- **A taken angle kills us.** If three channels already tell popcorn as a mystery, we'd
  be the fourth copy, and the first movers keep the trust. That topic is dropped.

This is now measured, not argued: `saturation.mjs` (case test row 11) reads YouTube's
top 30 results for the topic and says *low demand*, *topic crowded, angle open* (go)
or *angle taken* (drop).

### 3.2 · The transfer, stated plainly

The proven way into a crowded platform is to **transfer** a proven thing, not copy
it. A transfer moves one of four things:

| Axis | Example | Ours |
| --- | --- | --- |
| **Angle** | The same subject told a new way | ⭐ **The mystery format moved onto everyday prices.** Nobody tells prices as whodunits |
| Country | A US-proven concept made about another country | Not used: the cases are mostly universal |
| Length | Short content made long, or the reverse | Not used |
| Language | A proven English format in another language | **A later lever**: once ten English cases have proven retention, the same cases dubbed with ElevenLabs into a large, under-served language |

The channel's production (hand-built sets, a drawn cast, sourced documents) is also a
**high barrier to entry**. A transfer that is easy to copy gets copied within months;
one that takes this much craft doesn't.

---

## 4 · The formats this stands on (and the bend)

| Proven format | Evidence | What we take |
| --- | --- | --- |
| **Mystery and true crime** | One of YouTube's most durable genres. Documentary-style, faceless, voiced channels lead it, and the brain-teaser pull is the reason people stay | The whodunit structure: crime, suspects, clues, red herring, reveal |
| **Scam exposé with receipts** (Coffeezilla) | Long documentary-style exposés, calm and sarcastic, built on calls and documents | Receipts on screen; the calm, amused narrator |
| **"Why they're hated"** (Ticketmaster, Spirit Airlines) | Recurring, steady search demand | An antagonist the viewer already suspects: perfect as the red herring |
| **Comedic animated history** (Oversimplified) | Your own reference | Real people as characters, true jokes |

**The bend:** mystery storytelling moved onto **everyday prices**, a market nobody tells
as mysteries, where the crime is legal and the victim is the viewer. The genre is
proven; the market is ours.

---

## 5 · The four options, after the audit

| | Open question | Binge engine | Why-ours | Risk | Verdict |
| --- | --- | --- | --- | --- | --- |
| **1 · The Money Whodunit** | Who took it? | The reveal at 85% | Their answer is our red herring | Low (legal premise, sourced) | ⭐ **Recommended** |
| 2 · The Legal Heist | How did they do it? | The plan and the twist | The crew | Medium (accusatory, and explanation-driven) | Its devices live on inside option 1 |
| 3 · The Catch | What's in the fine print? | Relatability | POV | Advice pull; template shape | Its POV lives on as the cold open |
| 4 · Villain Origins | Who invented this? | Characters | Comedic history | Drifts to documentary | Its villains become suspects |

---

## 6 · The format bible

### 6.1 · The case spine (proportions, not fixed times)

| # | Movement | Share | What happens | Mode |
| --- | --- | --- | --- | --- |
| 1 | **The Crime** | 0:00–0:15 | Lucky pays, happily. Something small and wrong is visible in the picture. It ends on the number and the title's question in the world | Story |
| 2 | **The Case** | to ~10% | What was taken, from how many people, every year. The stakes as one sourced number | Story |
| 3 | **The Suspects** | ~10–25% | The lineup: 3–5 parties who each could have taken it. The first is **the popular answer** | Story + comedy |
| 4 | **The Alibis** | ~25–60% | Each suspect's story, told as history with real people and dates. Clues pile up (this is where the mechanism lives). **The red herring is cleared by ~40%**: the first payoff (§4.2) | Story + mechanism |
| 5 | **The Reconstruction** | ~60–80% | The crime replayed with what we now know drawn over it: every hidden hand in the transaction | Story |
| 6 | **The Reveal** | ~80–95% | The culprit, by name. Often a rule, a structure, or another customer, and sometimes Lucky herself. The runbook's reversal (§2.6) lands here | Story |
| 7 | **The Close** | last ~5% | What you'll notice now (never advice). The callback. *"Someone always pays. Now you know who."* | Story |

**Mode target:** STORY and COMEDY ≥ 65%, MECHANISM ≤ 35% of runtime, and no MECHANISM run
longer than 45 s without a story cut. That is the creator's 70/30 as a gate.

### 6.2 · The case devices: three per episode, rotating

| Device | What it is |
| --- | --- |
| **The money meter** | A running count of what was taken, living in the world: a till screen, a scoreboard, a receipt printing (the accent colour) |
| **The lineup** | The suspects side by side: a police lineup, a dinner table, a courtroom bench, a jury box. The staging changes every episode |
| **Suspect cards** | A freeze frame with a name, a role and a year, on a real document when one exists |
| **The evidence board** | Red string, photos, a receipt pinned in the middle |
| **The reconstruction overlay** | The cold open replayed with hands, cuts and arrows drawn over it |
| **Cleared / guilty stamps** | A rubber stamp landing on a suspect card, with its sound |
| **The challenge** | Just before the reveal the picture freezes on the lineup: *"You know what we know. Who took it?"* Two seconds of silence, then the reveal. The mystery writer's challenge to the reader, and the question the pinned comment asks |

**Each episode uses three of the seven, never the same three twice in a row** (§4.8's uniqueness
quota). The case spine is the constant; the surfaces change.

### 6.3 · The rules that keep it safe and fresh

- **Legal is the premise.** "Nobody broke a law. Somebody still took it." Never allege
  a crime; the words are *culprit*, *suspect* and *took*, never *scam* or *fraud*
  about a named company. Every claim is sourced (§7.2).
- **No advice.** The close says what the viewer will *notice*, never what they should
  *do* (YouTube's July 2026 rule on AI personas and money advice).
- **The victim rotates.** Lucky is usually the victim. Sometimes she is the unwitting
  culprit, and sometimes the victim is someone the viewer never thought about.
- **Polite disbelief, not outrage** (§0).

### 6.4 · Runtime, the opening seconds, and the end

- **Start at about 8 minutes (1,400 words).** It grows only when an episode holds 45%
  (runbook §1.4). Shorter also means fewer setups, which is what makes a solo channel
  finishable every week.
- **The title echoes within five seconds:** the title's object is in the first image,
  and its words are in the world by 0:15. A viewer who can't see what they clicked for
  leaves.
- **The end screen points to the previous case.** Finishing one case should offer
  another immediately: that's the binge.

### 6.5 · Titles

The title poses the *who* or clears the obvious suspect. It never uses the same
template twice in a row.

| Flat (episodes 1–9 style) | Whodunit |
| --- | --- |
| Why airport food is so expensive | Who Took $6 From Your Airport Sandwich? |
| Why movie theater popcorn costs so much | Your Popcorn Costs $9. The Cinema Didn't Take It. |
| How credit card rewards work | Someone Paid for Your Free Flight. They Used Cash. |
| How free games make money | Your Free Game Was Paid For by One Stranger |

**Thumbnail:** Lucky mid-purchase, and **one** accent element: the missing money, or a
single suspect with a question mark. Readable at 10% size (§9.10).

---

### 6.6 · The channel description (from episode 10)

The old description keeps its first and last lines, which were already a whodunit. The
middle promised three kinds of episode told as history, which is the educational
channel the whodunit replaces, and it breaks "one viewer, one format, every upload"
(runbook §1.1). History stays inside every case, as the alibis and the reconstruction.

```
Nothing is free. Someone always pays. This channel finds out who.

Every episode is a case. Something ordinary takes your money, and the answer
everyone gives for who's behind it is wrong. We line up the suspects, check
their alibis, rebuild what happened, and name who actually takes it. Legally,
every time. Not the boardroom view. The receipt view.

Real people, real decisions, real dates. Every figure is sourced, with years,
in the description.

New cases every week.

Nothing is free. Now you know who's paying.
```

Say "every week" until two a week is proven sustainable; a promise the channel breaks
costs more than a vague one. Update the description when episode 10 publishes, not
before, so episode 9 isn't sold as something it isn't.

## 7 · The case slate: twelve episodes

Every topic still passes the evidence gate and the case test (runbook §6.2, §6.2.1).
Every number is sourced at Step 1. The suspects and culprits below are hypotheses for
research, not findings.

| # | Working title | Suspects (the first is the red herring) | Hypothesis for the culprit |
| --- | --- | --- | --- |
| 1 | **Your Popcorn Costs $9. The Cinema Didn't Take It.** ⭐ episode 10, a deliberate remake of episode 1 (below) | The greedy cinema · **the studio (episode 1's own answer)** · the popcorn supplier · the other people in the room | **Metering:** the fans who buy snacks pay more so the casual viewer's ticket stays cheap. The research lead is Gil & Hartmann, *Marketing Science*, 2009 |
| 2 | Someone Paid for Your Free Flight. They Used Cash. | The bank · the airline · the shop · the cash payer | Swipe fees go into prices for everyone (Boston Fed research, 2010) |
| 3 | Who Took $6 From Your Airport Sandwich? | The airport · the vendor · the concession operator · the pricing rule | The rule meant to protect you (§4.1's example) |
| 4 | Who Pays for the Gym You Actually Use? | You · the gym · the equipment makers · the members who never come | The members who never come |
| 5 | Your Ink Costs More Than Champagne. Who Decided? *(shipped as an explainer; a remake only after popcorn's remake has been read)* | The ink makers · the retailers · chemistry · the printer's price tag | "The printer is sold cheap" is the popular answer, so it fails the cold-answer test. It needs a culprit beyond razor-and-blades before it can be a case |
| 6 | Who Took $34 From Your $60 Ticket? | The ticketing site · the artist · the venue · the promoter | The fee is shared |
| 7 | Your Free Game Was Paid For by One Stranger | The ads · the developer · the app store · the "whales" | A tiny share of players |
| 8 | Who's Paying for Your Hotel's "Free" Wi-Fi? | The hotel · the booking site · the resort fee | The fee split |
| 9 | Who Profits When Your TV Breaks? | The maker · the store · the insurer | The extended warranty |
| 10 | Who Bought You in 0.1 Seconds? | The app · the advertiser · the exchange | The auction (reuses NIF002's research) |
| 11 | Who Got Paid When You Searched "Pizza Near Me"? | The map · the pizzeria · the listing sites | The pizzeria paid to be found (reuses NIF004) |
| 12 | You Won a Free Vacation. Who Paid for It? | The resort · the marketer · the other buyers | The buyers who signed |

**Why popcorn opens the new format, even though episode 1 was popcorn:**

- **It's the channel's best-reached topic.** YouTube already knows who clicks on it
  from us.
- **It's the cleanest test of the format.** Same topic, new format: if the remake holds
  45% where episode 1 held 25%, the format did it. That is "change one thing at a
  time" (runbook §14.3) applied to the biggest change we'll make.
- **Its best red herring is our own old answer.** Episode 1 said the studio takes the
  ticket money and popcorn keeps the cinema alive. That's also what most popcorn
  videos say, and what a fresh model says cold. So it's suspect two, cleared on screen,
  and the case goes past it. A title variant says so outright: *"We Blamed the Studio
  for Your $9 Popcorn. We Were Wrong."*
- **The twist has a source.** Two economists studied a cinema chain's snack sales and
  argued that snack prices are a way of charging the keenest fans more (Gil &
  Hartmann, *Marketing Science*, 2009, whose working paper was titled *"Why Does
  Popcorn Cost So Much at the Movies?"*). Step 1 checks it and finds the numbers. The
  history stays true and funny: cinemas first refused popcorn, then the Depression made
  it their business.
- **Conditions.** It still passes all eleven rows of the case test and gets a case
  score. If the cold-answer test names metering, popcorn doesn't open the format, and
  the next slate topic that passes does. Episode 1 stays up; the remake is a new video,
  not a re-upload.

---

## 8 · How the runbook changed (applied on this branch)

| Section | Change |
| --- | --- |
| §0 | The sub-niche, in one word and one line |
| §1.1 Positioning | The Money Whodunit; the payer-POV test stays |
| §1.2 Formats | Three case types (*the bait*, *the fee*, *the rule*); the history spine stays |
| §2.8 Inserts | The case devices (six; the seventh, the challenge, came in the trust-score pass) |
| §4 intro, §4.2 | The case spine replaces the old spine; the first payoff by 40% and the reversal at 85% stay |
| §4.5 The why test | A new row: *why ours?* |
| §4.6 The mix | 40/60 becomes **30/70**, with mode tags and a gate |
| §4.8 | Three devices per episode, rotating |
| §6 | Step 0 sub-steps **0a–0e**; new **§6.2.1 The case test**; Round 1 card and vidIQ prompt updated |
| §7.3, §7.5 | New devices (the lineup, the reconstruction); `Mode:` in the beat sheet |
| §9.0, §9.7 | Cold open first; the L1/L2/L3 tier mix |
| §12 | New gates: Case test, Cold answer, Why ours, Story ratio, Suspects sourced, No advice, Cold open first |
| §1.1, §1.4, §4.1 (second pass) | The transfer; saturated topic vs saturated angle; one viewer, one format; an 8-minute start; the title echo |
| §6.2.1 (second pass) | Row 10 (the transfer) and row 11 (first mover, `saturation.mjs`): eleven rows in total |
| §9.8.3, §9.8.4, §14 (second pass) | The diorama orbit; setups, not shots; the backward end screen; change one thing at a time |
| §1.4, §6.1, §6.0, §9.10, §12, §14.2 (own-data pass) | The Saturday 21:30 IST slot; the channel's own outliers read at equal age; the payer in the title; the feed test; equal-age numbers in `shipped.md` |
| §2.8, §6.2.2, §14 (trust-score pass) | The seventh device (the challenge); the case score; the pinned case question; CTR read with retention |
| §2.4 (locations pass) | A new scene of the crime every case; returning locations re-dressed and earned |
