# Verification report

**November 18, 2026 · Local, compressed Astro production build**

## Results

| Check | Result |
|---|---|
| Astro / TypeScript | 0 errors, warnings, or hints |
| Static output | 132 sitemap routes and one custom 404 page |
| Migration | All 129 inventoried legacy canonical URLs retained; 17 shorthand/old-sitemap aliases tested as a single 301 to a 200 |
| Internal references | 9,097 checked, including anchors and assets; 0 broken |
| Metadata | Unique nonempty titles; descriptions under 160 characters; canonical, Open Graph and parseable JSON-LD |
| API unit tests | 22 passed, including invalid data, origin restrictions, spam, throttling, safe failure, optional email and mock delivery |
| PRD matrix regressions | 18 passed, including safe omission of unconfirmed features |
| Browser suite | 148 passed in the full handoff run; two additional review-card tests and five new mobile-navigation tests passed in focused runs |
| Accessibility automation | axe WCAG A/AA rules on all 132 sitemap routes; homepage additionally checked at 320, 375, 600, 768, 1024, 1280 and 1440px |
| Browser reliability | No initial-load external requests, failed resources, console errors or page exceptions on inventoried routes |
| Script budget | 5,051 bytes gzip across **all** emitted client JS bundles, below the homepage's 60 KB ceiling |

The browser suite covers both form steps, inline errors, the emergency call branch, back-navigation without lost values, honest preview confirmation, retry/error recovery, contextual service selection, menu keyboard handling, mobile actions, FAQ expansion, journal searching/filtering/pagination, map deferral, privacy preference changes, and one-hop redirects.

The test map uses a local provider response fixture **after** checking that no map is requested before a click. Provider email tests also use mocks. Neither is represented as a third-party end-to-end or delivery test.

## Mobile Lighthouse

Lighthouse 12.6.1, simulated mobile throttling, one clean run per template on the local compressed production-build preview. All configured assertions passed.

| Template | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Homepage | 100 | 100 | 96 | 100 | 1.51 s | 0 |
| Water heater service | 100 | 100 | 100 | 100 | 1.35 s | 0 |
| Daly City location | 100 | 100 | 96 | 100 | 1.50 s | 0 |
| Contact | 100 | 100 | 96 | 100 | 1.36 s | 0 |

Best-practices deductions on three templates are the mobile font-size heuristic, mostly small secondary labels. Total blocking time was 0 ms on each clean run. A previous homepage run while three browser test workers were active scored 85 performance; the final measurements above are isolated, after adding text compression. Scores are measurements, not uptime or performance promises.

**INP is not established by these navigation audits.** Confirm real-user LCP, INP and CLS at the 75th percentile after launch. A lab score of 100 accessibility does not certify WCAG 2.2 AA; assistive-technology, 200%/400% zoom, device and editorial review remain necessary.

## Review-card refinement

The homepage and Reviews page now use locally hosted platform wordmarks, individually labelled links, and CSS-only responsive cards. Both public profile URLs and the approval gates are unchanged. The 18 discrepancy checks and updated static integrity checks pass. Two focused Playwright tests verified keyboard activation and new-tab destinations using intercepted external navigations, as well as axe checks and reflow at 320, 390, 768, 980, and 1440 pixels on both routes. No JavaScript was added. The Lighthouse figures above precede this isolated component update.

## Mobile navigation motion

The hamburger now opens a floating navigation panel with a 285 ms slide/fade entrance, softly staggered links, a dimmed backdrop, and a hamburger-to-close transition. The exit is 155 ms. A reduced-motion preference removes the transitions and closes immediately. The site does not ship an animation library.

Five new browser tests passed, plus the existing desktop and mobile navigation tests. They cover interrupted/rapid toggles, unchanged header position, inert links during exit, Escape and outside-tap dismissal, focus return, same-page request links, viewport changes, and a scrollable menu above the mobile action bar on short screens. Expanded-state axe checks passed at 320, 390, 768, 1024, and 1100 pixels. The documented Lighthouse run predates these refinements.

[Watch the mobile interaction](mobile-menu-motion.webm).

## Code acceptance vs. launch acceptance

All 18 discrepancy regression cases pass in this build. The existing Housecall Pro destination and first screen were verified separately in a read-only [booking check](booking-verification.md). Office approval and end-to-end booking completion remain open, as do cleared reviews, credential confirmation, approved legal copy, inbox receipt and client review. No score from a mock provider is used as evidence of actual delivery. The Markdown and legal migrations require client approval. No Search Console submission, analytics baseline, DNS update, production integration or public release was performed.

**Evidence:** `static-qa.json`, `browser-qa.json`, `lighthouse-qa.json`, `legacy-urls.json`, `redirect-map.csv`, and the executable suites in `tests/`. Reproduction commands are in `README.md`.
