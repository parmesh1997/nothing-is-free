#!/usr/bin/env bash
# cleanup-renders.sh — reclaim disk from finished renders + scratch.
#
# DRY RUN by default: prints what it WOULD delete, with sizes. Nothing is
# touched until you pass --go. Run tiers one at a time.
#
#   bash video-os/scripts/cleanup-renders.sh 1          # preview tier 1
#   bash video-os/scripts/cleanup-renders.sh 1 --go     # actually delete tier 1
#
# What is KEPT no matter what:
#   - every *.mp3 (VO / SFX / music — small, source of truth, now in git)
#   - out/beats/NIF003-*.mov      (NIF003 Step 4 / Resolve still needs these)
#   - out/review/NIF003-FULL.mp4  (the reference full render)
#   - Ep3/*.mov                   (NIF003 in flight)
#   - Ep2/The $390 Billion*.mp4   (the published NIF002 video — consistency ref)

set -u
ROOT="D:/YT/Nothing Is Free"
cd "$ROOT" || exit 1
TIER="${1:-}"; GO="${2:-}"

nuke() {  # nuke <path-or-glob> ...
  local total=0 n=0
  for p in "$@"; do
    for f in $p; do
      [ -e "$f" ] || continue
      local sz; sz=$(du -sk "$f" 2>/dev/null | cut -f1); total=$((total+sz)); n=$((n+1))
      if [ "$GO" = "--go" ]; then rm -rf "$f" && echo "  deleted  $f"; else echo "  would delete  ($(du -sh "$f" 2>/dev/null|cut -f1))  $f"; fi
    done
  done
  echo "  ── $n items, $(awk "BEGIN{printf \"%.1f GB\", $total/1024/1024}")"
}

case "$TIER" in
1)
  echo "TIER 1 — superseded NIF002 per-beat ProRes renders (~37 GB, regenerable)"
  nuke "video-os/engine/remotion/out/EP02-B*.mov" \
       "video-os/engine/remotion/out/NIF002-B*.mov" \
       "video-os/engine/remotion/out/NIF002-B*.remotion-in-progress" \
       "video-os/engine/remotion/out/review/NIF002-B*.mp4" \
       "video-os/engine/remotion/out/master" \
       "video-os/engine/remotion/out/dev" \
       "video-os/engine/remotion/out/test" \
       "video-os/engine/remotion/out/sfxtest"
  ;;
2)
  echo "TIER 2 — build/audit screenshots + tiny scratch (~0.3 GB, regenerable via 'remotion still')"
  nuke "video-os/engine/remotion/out/*.png" \
       "video-os/engine/remotion/out/*.log" \
       "video-os/engine/remotion/out/*.mp4" \
       "video-os/engine/remotion/out/_t.mov" \
       "video-os/engine/remotion/out/ContinuousShotSample.mp4" \
       "video-os/engine/remotion/out/SceneComposition.mp4"
  # note: keeps out/beats/ and out/review/NIF003-FULL.mp4
  ;;
3)
  echo "TIER 3 — loose scratch media at the repo root (~0.2 GB of junk-named files)"
  nuke "AFGAWFJGH.mov" "1234567890.mov" "qoiuf3hiu.mov" "real.mov" \
       "Timeline 1.mov" "Timeline 1.wav" "Timeline 15.wav" "Timeline 1\`DS.mov" \
       "Timeline 1e5h.mov" "Timeline 1e5h.wav" \
       "2.wav" "3.wav" "Untitled3.wav" "Untitled69_A01_L.wav" "Untitled69_A01_R.wav" \
       ".mcp.json.bak-2026-09-06"
  ;;
4)
  echo "TIER 4 — REVIEW BY HAND, do not blind-run. NIF001/NIF002 archives + masters."
  echo "  These may be your only local copy of published work. Decide per-file:"
  for f in "56-percent-movie-ticket-economics-hidden-economics.mov" \
           "Ep1" "Ep2/NIF002_graded.mp4"; do
    [ -e "$f" ] && echo "    $(du -sh "$f" 2>/dev/null | cut -f1)  $f"
  done
  echo "  Keep the published cut of each ep somewhere (or trust YouTube), then rm the rest."
  ;;
*)
  echo "usage: bash video-os/scripts/cleanup-renders.sh <1|2|3|4> [--go]"
  echo "  1  old NIF002 beat renders   ~37 GB"
  echo "  2  audit PNGs + scratch mp4  ~0.3 GB"
  echo "  3  loose root scratch        ~0.2 GB"
  echo "  4  NIF001/002 archives       review by hand"
  ;;
esac
