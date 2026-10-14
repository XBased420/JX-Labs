# Motion layer

The site's animation and smooth scrolling live in two files: `public/motion.js` and `public/motion.css`. They sit on top of the existing site. `public/site.js` calls a few optional hooks on `window.JXMotion`, and every hook falls back to the old behaviour. That means the site works exactly as before if the motion files fail to load, and also for visitors who prefer reduced motion.

## Libraries (vendored, pinned)

| Folder | Library | License |
|---|---|---|
| `public/vendor/gsap-3.15.0/` | GSAP core, ScrollTrigger, SplitText, ScrambleTextPlugin, Flip | GreenSock standard no-charge license (free, commercial use OK) |
| `public/vendor/lenis-1.3.26/` | Lenis smooth scroll + its CSS | MIT |

The files are copies of the published npm packages (`gsap@3.15.0`, `lenis@1.3.26`); only the source-map comments were removed. To upgrade one:

1. Put the new files in a new versioned folder.
2. Update the paths in the `motionLibraries` list in `src/render.mjs`.
3. Update the expected order in the motion test in `scripts/render.test.mjs`.

Several effects are adapted from React Bits (MIT + Commons Clause, © David Haz) and ported to plain JavaScript. The notice is kept at the top of `motion.js`.

## What it does

| Effect | Where | Built with |
|---|---|---|
| Smooth mouse-wheel scrolling (touch stays native) | Whole site; off during login and for reduced motion | Lenis on GSAP's ticker, synced with ScrollTrigger |
| Boot sequence on a timeline (same order, timing and sounds as before) | Every section | GSAP timeline |
| Below-the-fold items wait and type in as you scroll to them | Mostly phones; Portfolio and About on desktop | ScrollTrigger.batch |
| Headings decrypt into place | Terminal look | ScrambleText (React Bits DecryptedText) |
| Headings slam in letter by letter | Poster look | SplitText (React Bits SplitText) |
| Directory links scramble on hover | Terminal look, mouse only | ScrambleText |
| Home prompt cycles real section commands | Terminal look | React Bits TextType |
| Step rules draw 01 → 04 | How It Works (follows scroll on phones) | GSAP + ScrollTrigger |
| Estimate total and deposit count up | Services & Estimate | React Bits CountUp |
| Portfolio records open and close smoothly | Our Portfolio | GSAP |
| Card photo grows into the concept viewer and back | Concept Lab | Flip.fit |
| CTA buttons lean toward the pointer | "Start a project" buttons, mouse only | React Bits Magnet (quickTo) |
| Pointer spotlight on cards | Concept cards, estimate options, portfolio rows; mouse only | React Bits SpotlightCard |
| Success beat | Terminal decrypt, Poster confetti, others fade in | ScrambleText / React Bits ClickSpark |
| Dim glyph field behind the welcome screen | Terminal login only | React Bits LetterGlitch (canvas) |
| 3D wireframe neural network you slowly fly through (layers of linked nodes, firing signals, rotating wireframe hubs, wireframe floor and ceiling; leans toward the pointer, speeds up while scrolling) | Blueprint look background, login and site; replaces the flat drifting grid, which stays as the fallback | Canvas 2D, `wireSpace()` in motion.js |

Colours come from each look's CSS variables, so every effect matches all four looks.

## Rules to keep

- **Reduced motion:** `gsap.matchMedia()` turns everything off, and Lenis is never created.
- **Screen readers:** scrambled headings carry an `aria-label` with the real text, and the count-up's live region only ever contains the final value.
- **Nested scroll areas:** these need `data-lenis-prevent` (the concept frame, the look menu and text areas get it automatically).
- **Scroll resets:** go through `scrollToTop()` in `site.js` so Lenis stays in sync.
- **Lenis and CSS smooth scroll:** don't add `scroll-behavior: smooth` back for `html.lenis`, because it fights Lenis.
