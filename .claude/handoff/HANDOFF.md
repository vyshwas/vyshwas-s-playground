# Handoff — Playground site: drawer bug, About section redesign, asset swaps

Written: 2026-07-09 22:47 local. Resumes: 2026-07-09 22:52 local.

## Done so far
- Fixed a real bug in `index.html`'s project drawer: opening a second/third project (via
  row click or the drawer's own Next/Prev buttons) stacked `history.pushState()` calls, and
  Chrome silently stopped honoring the second `history.back()` used by the close ("✕") button —
  so closing after switching projects left the previous project's content showing. Fixed by
  decoupling close from browser history entirely (`closeDrawerAction()` now closes directly;
  `openDrawer()` uses `replaceState` when already open, `pushState` only on the closed→open
  transition). Verified via CDP repro script — every close now works, including after cycling
  through all three projects.
- Fixed the Awara prototype's "blank on first load" bug (root cause: `go()`'s guard clause
  `if (name === state.screen...) return` matched on the very first boot call since initial
  `state.screen` was `'welcome'`, same as the first `go('welcome')` call). Fixed by setting
  initial `screen: ''`. Applied to both the canonical source
  (`C:\Users\vyshw\AwaraPrototype\awara-prototype.html`) and the Playground copy
  (`assets/awara-prototype.html`).
- Fixed a second Awara bug: a "Plan evolved / Undo" toast was visibly showing on fresh load
  (not something added on purpose — the user flagged it). Root cause: `.toast`'s hidden position
  used `top: 66px` + `transform: translateY(-130%)`, where -130% is relative to the toast's own
  ~51px height, netting almost exactly 0 — i.e. it landed visible instead of off-screen. Fixed
  with a fixed `translateY(-160px)` instead of a percentage. Synced to both copies.
- Added cache-busting query params (`?v=2`/`?v=3`) to the `data-proto` iframe sources so browser
  caching of the old buggy prototype files doesn't linger after fixes ship.
- Redesigned the About section (`#about` in `index.html`): replaced the old generic two-card
  "bento" grid with an editorial split — a big bold display "lede" line
  (`.about-lede`, "I didn't start in design.") followed by calmer continuation text
  (`.about-statement`), plus a compact mono-styled facts list (`.about-facts`:
  Background / Focus / Approach / Currently) on the right. Took structural inspiration from
  danielspatzek.com (ditch symmetric cards) and typographic inspiration from
  spatzek.studio/about and sebastian-martinez.com (checked both directly via CDP: neither uses
  wide letter-spacing on small text — they rely on weight + full contrast instead). Added a
  subtle GSAP ScrollTrigger fade/stagger reveal, consistent with GSAP already used elsewhere
  on the page.
- While in there, found and removed genuinely dead code: a GSAP ScrollTrigger pinning `#about`
  for 1200px of scroll, animating `.triangle-tile-1`/`.triangle-tile-2` elements that don't
  exist anywhere in the page (silent no-op that just made scrolling feel stuck for that stretch).
- Fixed the dot-matrix background's color clash: it's a canvas of animated color orbs masked
  into a dot pattern (`#wave-canvas`), and two orbs (coral/peach) sat in almost the same
  warm orange-yellow hue as the vermilion/lemon text. First pass desaturated them to neutral
  grey; user then asked to go further, so they're now near-black
  (`rgba(6,6,7,...)` / `rgba(3,3,4,...)`) which, under the canvas's `screen` blend mode against
  a black background, contributes essentially nothing visible — only the cooler navy/purple
  orbs still glow.
- Replaced the "The Whole Fruit" project's image (was a generic Unsplash stock photo) with the
  user's uploaded packaging shot, saved as `assets/project_wholefruit.png`, wired into both the
  hover-preview `data-image` and the drawer.
- Verified everything on a local Python server (`python -m http.server 8098` from the repo root)
  via raw Chrome DevTools Protocol screenshots (no Playwright/Puppeteer installed in this
  environment — CDP-over-raw-WebSocket is the established pattern here).

## Next step (be exact)
There is no queued implementation task. All requested changes for this session are complete
and verified locally. On resume: re-run `git status` and `git log --oneline -5` in this repo
to confirm nothing changed unexpectedly, then check in with the user for their next request
rather than assuming more work is wanted.

## Then after that
- If the local server isn't already running, restart it before showing anything:
  `cd` to this repo root and run `python -m http.server 8098` in the background.
- If Chrome (for CDP-based verification) isn't running, relaunch headless:
  `chrome.exe --headless=new --disable-gpu --remote-debugging-port=9333 --no-first-run`.

## Decisions already made (don't re-litigate)
- This repo (`vyshwas-s-playground`, remote `github.com/vyshwas/vyshwas-s-playground`) is the
  correct one for all Nocturne/Awara/portfolio-tab work — NOT the other repo,
  `C:\Users\vyshw\.gemini\antigravity\scratch\vishwas-portfolio` (remote
  `github.com/vyshwas/portfolio-website`). Do not touch that other repo's index.html/main.js/
  style.css — an earlier session accidentally destroyed uncommitted concurrent WIP there via
  `git checkout --`, and the user asked to check with that other tool/session before any further
  action there. That constraint still stands.
- This repo has an active auto-commit + auto-push watcher that cannot be paused or intercepted —
  it's coming from the user's other running IDE, `Antigravity.exe`, not a script in this repo.
  Every edit gets committed ("Auto-commit: playground changes") and pushed to `origin/main`
  within moments, regardless of "don't push yet" instructions. This has been disclosed to the
  user twice already; they've said to leave pushed changes as-is. Don't promise true
  local-only changes again — disclose the watcher up front instead.
- Awara and Nocturne prototypes are embedded as live iframes in the project drawer
  (`data-proto` attribute), not static screenshots — this was an explicit, deliberate fix
  earlier in the project, not an oversight.

## Open questions for the user
- None outstanding. The user's last message was a positive result summary from Claude with an
  offer to keep iterating on sizing/spacing — no unresolved question was pending when this
  handoff was written.

## Files touched this session
- `C:\Users\vyshw\.gemini\antigravity\scratch\vyshwas-s-playground\index.html`
- `C:\Users\vyshw\.gemini\antigravity\scratch\vyshwas-s-playground\assets\awara-prototype.html`
- `C:\Users\vyshw\.gemini\antigravity\scratch\vyshwas-s-playground\assets\project_wholefruit.png` (new)
- `C:\Users\vyshw\AwaraPrototype\awara-prototype.html` (canonical Awara source, kept in sync)
