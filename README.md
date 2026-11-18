# Advanced Plumbing & Drain — website redesign

A static, mobile-first Astro / TypeScript site with Tailwind 4, self-hosted fonts, a service-aware request flow, and a small serverless delivery endpoint. This is a client-review build, not a change to the live WordPress site.

## Run it

Use Node.js 22 LTS and npm. The local preview never sends real emails and does not save request details.

```sh
npm ci
npm run dev                 # Astro development server
# Or, for the tested static site:
npm run build
npm run preview             # http://localhost:4321; PORT can be overridden
```

The Astro dev server binds to `0.0.0.0`; the static preview binds to `127.0.0.1` by default and accepts `PREVIEW_HOST` when network access is needed. The browser uses same-origin relative URLs, including `/api/request`. No CDN, external font, review widget, scheduler, or map is needed on first load.

## Contents

| Location | Purpose |
|---|---|
| `content/business.ts` | Business data, approved-feature switches, scheduler and analytics settings |
| `content/services`, `locations`, `blog` | Typed Markdown collections, original URL paths, content and FAQs |
| `content/reviews.ts`, `offers.ts`, `team.ts` | Office-maintained, approval-gated material |
| `content/legal` | Existing policy text, awaiting counsel review |
| `src/components`, `src/views` | Shared accessible components and page templates |
| `src/styles/global.css` | Responsive UI, design tokens, local fonts and print styles |
| `api/request.mjs` | Zod validation, honeypot, origin checks, size limits, throttling, transactional email |
| `netlify/functions/request.mjs` | Thin serverless adapter; deploy previews never deliver mail |
| `public/_redirects`, `docs/redirect-map.csv` | One-hop aliases and the migration inventory |
| `tests`, `.github/workflows/quality.yml` | API, discrepancy, interaction, accessibility, routing and Lighthouse gates |
| `.env.example`, `netlify.toml` | Hosting and server-side configuration |

## Verify

```sh
npm run check               # Astro / TypeScript
npm test                    # Isolated API and mock-provider tests: no real email
npm run build               # Static pages, link/metadata/budget checks, 18 PRD regression checks
npx playwright install --with-deps chromium
npm run test:e2e            # Starts a local preview when needed
# With the local production-build preview running, set the Chromium path:
export CHROME_PATH="$(node -e "console.log(require('playwright').chromium.executablePath())")"
npm run lighthouse          # Four mobile templates; reports retained locally
npm run launch:check        # INTENTIONALLY blocks until the real client sign-offs exist
```

Run Lighthouse on an idle machine, not during parallel browser tests. The checked-in evidence in `docs/` describes this build, not field Core Web Vitals or a deployed domain.

## Deploy to a private staging environment

1. Connect the repository to the client's Netlify account. Build command and publish directory are in `netlify.toml`. Do not deploy the local `scripts/preview.mjs` as a production form service.
2. Use a protected deploy preview for review. Set `PUBLIC_REQUEST_MODE=preview`. No hosting, domain, DNS, or production analytics settings have been changed.
3. Provision Resend on a verified sending domain and a restricted Upstash Redis REST database. Put secrets in the host environment only, never in `PUBLIC_*`, the repo, or browser code.
4. For a controlled delivery test, use a **separate protected staging site**, its own `SITE_URL`, test office/sender inboxes, `REQUEST_DELIVERY=live`, `PUBLIC_REQUEST_MODE=live`, and approved confirmation text. Deploy previews and branch deploys intentionally cannot send mail. Inspect both actual inboxes.
5. After client approval, set production `SITE_URL`, `OFFICE_EMAIL`, `MAIL_FROM`, `RESEND_API_KEY`, `APPROVED_CONFIRMATION`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, a random `RATE_LIMIT_SALT`, and `REQUEST_DELIVERY=live`. Rebuild with `PUBLIC_REQUEST_MODE=live` and recheck the launch checklist.
6. Deploy behind HTTPS, verify the map/scheduler/analytics CSP once configured, run the URL checks against the real host, and submit `/sitemap.xml` via the client's Search Console. Keep the existing WordPress snapshot for rollback.

## Request behavior

Two steps: service and urgency → contact details. Emergency selection reveals a prominent phone link. Name, US phone, 5-digit ZIP, service, urgency, a short description, and separate privacy acknowledgement are required. Email and service address are optional. Marketing is hidden by default. No photo upload in v1.

The endpoint does not put customer information in URLs, logs, analytics, or a local database. The production limit is five valid submissions per hashed IP per ten minutes, using an atomic, expiring Redis counter. Resend receives one idempotent batch: an office email plus a customer confirmation **only if email was supplied**. The response is not shown as successful on a provider error. Acceptance by the provider is not proof that an inbox received it.

**Start with [HANDOFF.md](HANDOFF.md) for the remaining launch decisions and [EDITING.md](EDITING.md) for day-to-day edits.**
