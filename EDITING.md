# Office editing guide

**Make changes in a review branch. Preview them on a phone, obtain approval, then publish.** Keep your current version so you can undo a change. Do not edit files in `dist/`.

| To update… | Edit… | Remember |
|---|---|---|
| Phone, office email, address, hours, profiles | `content/business.ts` | Match the verified business profiles. `showAddress` controls display. |
| An offer | `content/offers.ts` | Use exact approved title, terms, internal destination, start/end dates, and `approved: true`. No speculative prices or free-estimate promises. |
| A notice | `business.announcement` | Set `text` and `endDate` (`YYYY-MM-DD`). Clear the text to remove it. Rebuild at expiry for no-JavaScript visitors. |
| A review | `content/reviews.ts` | Add a short permitted excerpt, reviewer name/initial, `Google` or `Yelp`, original source URL, date, and approval. Remove broken paragraph separators. |
| A rating/count | `ratings` in `content/reviews.ts` | Add platform, source URL, count, rating, `verifiedOn`, and approval. Only then enable `showRatings`. Figures older than 90 days fail the build when enabled. |
| Service information and FAQs | `content/services/*.md` | Edit `intro`, `symptoms`, `process`, `cost`, and FAQ `q`/`a` fields. Never change the `path` casually. |
| Local information | `content/locations/*.md` | Keep location-specific information accurate. Do not add unsupported towns or projects. |
| A general question | `content/faqs.ts` | Use a concise question and plain-language answer. |
| Team photos/names | `content/team.ts` | Confirm image rights and individual approval. Keep alt text short and descriptive. |
| A journal article | `content/blog/*.md` | Copy an existing file's frontmatter; give it a unique title, original path, short description, date, and category. Write the article below the closing `---`. |

### Switches that need approval

- **Scheduler:** set `schedulerUrl` to the confirmed HTTPS booking destination. Test it on a phone. Never substitute a generic form for a booking confirmation.
- **Marketing texts:** leave `showSmsOptIn: false` unless counsel supplies exact copy. If approved, set `smsConsentText` and enable the matching server setting. The checkbox must stay separate, optional, and unchecked.
- **Credentials, years and video:** only enable approved claims. Video requires a caption file, transcript, and permission. Nothing plays automatically.
- **Analytics:** use one approved GTM container or GA4 ID. Keep form-field values out of tag mappings. Visitors control analytics in **Privacy choices**.

### Before publishing

Run `npm run check` and `npm run build`. Open the edited page, follow its links, check the mobile call bar, and submit a **preview** request. A failed build explains what to fix; do not bypass it. Have the maintainer schedule a regular rebuild for time-limited offers and rating expiry. Server secrets belong in the hosting dashboard, never in a content file.
