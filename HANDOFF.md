# Advanced Plumbing & Drain — delivery handoff

**Client-review build · November 18, 2026**  
**Status: implementation complete for review; production launch is blocked on client approvals and real delivery verification.** The existing site, DNS, booking system, analytics accounts, and office inbox have not been modified.

## Delivered

- Responsive blueprint-inspired homepage, the original logo, sticky header, mobile action bar, emergency phone block, source-linked trust area, four illustrated service categories, a two-step service request, reviews source links, process, coverage, journal, map facade, and footer.
- 132 indexable pages: **129 inventoried existing canonical URLs** plus `/service-areas/`, `/resources/`, and `/accessibility/`. A separate custom 404 makes **133 HTML documents**. The inventory includes 69 journal articles, existing category archives, and city-specific service pages discovered beyond the initial brief.
- Astro static output, TypeScript, Tailwind, typed Markdown, local fonts/WebP, no framework hydration, no first-load external scripts. Real article search, topic filters, progressive “show more,” keyboard menus, expandable FAQs, and privacy settings.
- Serverless Netlify handler with Zod validation, same-origin policy, honeypot, body limits, durable production throttling, and idempotent transactional email. The local preview is validation-only and does not retain submitted personal details.
- Readable metadata, canonical and Open Graph tags, LocalBusiness/Plumber, Service, FAQPage and breadcrumb data, sitemap and robots files. No unsupported aggregate rating.
- The mobile/tablet navigation opens as an animated floating panel. It supports reduced motion, Escape, outside dismissal, and keyboard focus return. [Watch the menu interaction](docs/mobile-menu-motion.webm).
- Review sources use locally hosted Google and Yelp wordmarks, full-card links, and a responsive two-card layout. Approved excerpts, when supplied, appear separately. [See the updated review cards](docs/review-cards-preview.png).
- Full source, lockfile, `.env.example`, redirect inventory (`docs/redirect-map.csv`), acceptance tests, CI workflow and one-page `EDITING.md`.

## What the public preview intentionally omits

| Missing evidence | Safe behavior now | TODO before launch |
|---|---|---|
| Scheduler approval and booking completion | The live homepage opens a **Housecall Pro** booking page. The HTTPS destination and branded first screen were verified on November 18, 2026. The redesign still publishes no booking link or widget. | See [booking verification](docs/booking-verification.md). Have the office confirm account ownership, the intended **$0.00** display on all three service choices, and whether submission requests or confirms an appointment. Run an authorized end-to-end test before enabling `schedulerUrl`. |
| Cleared review text/counts | Direct Google and Yelp profile links; no fabricated excerpts, ratings, or counts | Obtain 3–6 permitted excerpts, names/initials, dates, individual source links and permission. Record dated counts separately. Resolve Yelp usage clearance. |
| Current accreditation/mark permission | Text links to the published BBB and Diamond profiles; no reproduced accreditation marks | Verify current status, license, and display permission; retain dated evidence. |
| Pricing, tenure and response promises | No free-estimate, same-day, years-in-business, price, or arrival-window claims | Approve actual policies in writing. No pricing page until meaningful policies/ranges exist. |
| Approved video and captions | Existing team photo on About; no legacy autoplay or fallback text | Supply cleared video, captions, and equivalent transcript; then enable `business.video.approved`. |
| Marketing-text approval | SMS control hidden; privacy acknowledgement is separate | Counsel reviews the program, versioned consent copy, opt-out handling and records. Do not enable marketing by merely checking a front-end flag. |
| Production credentials | No email sent in this preview. Production fails closed when configuration is incomplete. | Set verified sender, provider key, office inbox, durable limiter, and approved confirmation. Verify both real inbox receipts. |

## Client sign-off checklist

- [ ] **TODO — operating status and access:** confirm active business by phone; identify domain, DNS, hosting, WordPress, scheduler, GBP, analytics and tag-container owners. No outreach or ownership assumptions were made.
- [ ] **TODO — NAP:** check §13.3 name, `(415) 744-4944`, office email, license `1009195`, and physical address against the client's current records, GBP, Yelp and licensing authority. The source homepage can display another tracking number; this build deliberately uses the PRD number. Confirm whether the Sacramento Street suite may be displayed. No walk-in invitation.
- [ ] **TODO — rights/editorial:** approve the logo master, team photo, individual image rights, journal photos and curated excerpts. Supply approved names only. No individual is identified in the new team section.
- [ ] **TODO — migration:** reconcile `docs/legacy-urls.json` against the full CMS export, Search Console landing pages, external backlinks and analytics. The sitemap crawl is not evidence that every historical attachment, pagination, campaign or unlisted URL has been discovered. Add missing one-hop redirects; do not redirect every unknown URL to the homepage.
- [ ] **TODO — local/service pages:** review all drafted signs, process, scope, FAQs and service-area text; provide real projects if desired. Newly discovered Daly City URLs were kept, not expanded to unsupported towns. `/recent-projects/` is a project inquiry route until real examples are cleared.
- [ ] **TODO — articles:** approve the migrated article bodies and descriptions. Subject-matter review is especially important for gas, electrical, permit and safety-related articles. Archive migration is not a professional technical or code-compliance review.
- [ ] **TODO — privacy and terms:** existing legal text is retained from WordPress, not represented as newly approved. Counsel must reconcile it with the actual fields, processors, retention policy, optional analytics and disabled SMS program. Two conflicting contact phone numbers in the old legal pages were normalized to the PRD phone. A separate Yosemite mailing address could not be verified and is withheld, not presumed to be the Sacramento Street office. Confirm the correct legal correspondence address with counsel. Do not publish new legal wording without approval.
- [ ] **TODO — appointment and email language:** approve follow-up wording and contact channels. A service request is not an appointment. No promised ETA or pricing. A customer confirmation is impossible when the optional email field is blank.
- [ ] **TODO — accessibility:** run manual keyboard, screen-reader, zoom/reflow and real-device tests with the client. Automated checks are not a WCAG conformance certification.
- [ ] **TODO — final deployment:** repeat functional, CSP, accessibility, redirect and performance checks on the actual HTTPS host. Verify both test emails (not mock results) and anti-spam behavior. Confirm source/date-backed ratings and scheduler or sign off on explicit scope deferrals.

`content/launch-approvals.json` is intentionally false by default. `npm run launch:check` should fail until the responsible people have recorded genuine sign-offs. These are release approvals, not development placeholders on public pages.

## Acceptance evidence

See **[QA.md](docs/QA.md)**, machine-readable `docs/static-qa.json`, `docs/browser-qa.json`, and `docs/lighthouse-qa.json`. The 18 discrepancy tests check the implementation or its safe, disabled state. They do **not** certify unconfirmed business claims, cleared review rights, real booking completion, counsel approval, field Core Web Vitals, or real email receipt.

## Production operations

1. Establish GA4/Search Console/call-log/scheduler baselines. Have the office document calls, qualified service requests and completed bookings per 100 sessions, split by device.
2. Keep scope-limited credentials in hosting secrets; verify sender DNS and SPF/DKIM, provider access and the actual office spam-folder outcome. Avoid logging full request bodies. Agree on provider retention and deletion procedures.
3. Configure only approved analytics IDs. Without consent there are no analytics requests. GTM must not read form inputs; allow only non-PII `phone_click`, `emergency_call`, `service_request_complete` and optional `scheduler_click` events. Preview submissions never count as conversions. Confirm completed bookings within the actual scheduler; a click is not a completion.
4. Schedule a recurring static rebuild for expired offers, annual copyright and rating freshness. An expiry guard also hides stale banners in the browser. Switch off stale ratings until reverified.
5. Back up the existing WordPress site and DNS configuration. Lower TTL in a planned change window, deploy, smoke-test, and retain a reversible cutover plan. Submit `/sitemap.xml` only through an authorized Search Console account.
6. Monitor indexing, broken URLs, form deliverability, spam and call flow for two weeks. Review organic query/landing-page trends at 30/60/90 days. Establish real-user LCP, INP and CLS from field data; lab results are not a substitute.

**Deferred by design:** P2 photo uploads, a customer portal, payments, instant quotes, new unsupported towns and made-up team/project content.
