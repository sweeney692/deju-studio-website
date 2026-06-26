# Hiring campaign - Nail Artist (Ubud)

Everything for the 2026-06 push to hire 3 nail artists: the paid campaign plan, the application backend, and how it connects to the website and the screening agent. Created 2026-06-23.

## The funnel (live)

```
Instagram ad ─────┐                                              ┌▶ email to info.dejustudio@gmail.com (Careers label)
Flyer link / URL ─┼─▶ dejustudio.com/careers ─▶ application form ─┼▶ Netlify Forms API ─▶ screening agent ─▶ shortlist
Organic + WA ─────┘                                              └▶ auto-reply to applicant (submission-created fn, pending)
```

Applications go through the **website only**, never the WhatsApp booking line (which is saturated with clients).

## Files here

| File | What it is |
|---|---|
| `CAMPAIGN-BRIEF.md` | The Meta **Instagram-only** ad plan for the 1,000,000 IDR budget: objective, targeting, ad copy, organic amplification, UTMs, KPIs, and the Special Ad Category caveat. (Switched from IG+FB to IG-only 2026-06-24.) |
| `BACKEND-SETUP.md` | How the application form is wired: Netlify Forms detection, the live email notification, the GA4 `generate_lead` key event (done), the applicant **auto-reply function** (in progress), and the (optional) Google Sheet mirror. Includes the `ignore_html_forms` gotcha. |
| `apps-script.gs` | Optional Google Apps Script that appends each submission to a Sheet (only if you want a spreadsheet view; the agent does not need it). |

## Related, elsewhere in the repos

- **Careers page + form + JobPosting schema:** `index.html` (`#careers` section), `careers-thanks.html`, `css/components.css` (`.careers-*`). Documented in the root `CLAUDE.md` under "Careers / hiring".
- **Flyers (5 placements):** `marketing/flyer/build/hiring-editorial-*.html`; exported PNG/PDF in `marketing/flyer/`. Rebuild: `cd marketing/flyer && bash build/build.sh`. Design notes: `Summaries/2026-06-23-hiring-flyer-revisions.md`.
- **Applicant auto-reply (in progress):** `netlify/functions/submission-created.mjs` sends a Resend confirmation email to each applicant; dormant until DNS is off Wix. See `BACKEND-SETUP.md` Step 5.
- **Screening agent (separate repo):** `~/Agent Forge/agents/app-screener/` - reads applications from the Netlify Forms API, scores against the role rubric, surfaces a ranked shortlist.
- **Analytics:** the Deju GA4 (property `534840336`) is queryable via the `analytics-mcp` MCP server for monitoring the campaign (sessions by source, `generate_lead` form submissions). Setup recorded in memory (`project_ga_mcp`).

## Current status (updated 2026-06-26)

- Careers page + form: **live in production**, form detection on, studio email notifications on.
- Careers links + mobile landing: **fixed 2026-06-26.** All `/careers` variants resolve (no more 404s from hand-typed/bio links), and the link lands visitors on the application form rather than the FAQ section. Use `…/careers?utm_source=ig&utm_medium=social&utm_campaign=hiring` for Desty's organic posts. See `Summaries/2026-06-26-careers-link-404-and-mobile-landing-fix.md`.
- GA4 `generate_lead`: **done** - registered as a key event and **verified firing** end to end.
- Flyers: **final** - the four vertical placements (A4, Story, IG, FB) plus a new **1.91:1 landscape** (`Deju - Hiring - Editorial - Landscape 1200x628.png`) added 2026-06-24 for Meta. Written-link CTA, no QR.
- Meta campaign: **built in Ads Manager (Instagram-only), pending Meta review/approval**. Manual Traffic campaign, landing-page-views goal, Ubud+Gianyar, IG-only placements. A/B: Story + 1080x1350. Then monitor + organic amplification.
- Applicant auto-reply email: **in progress** - function committed (`netlify/functions/submission-created.mjs`, Resend) but dormant; blocked on moving DNS off Wix (domain transfer underway). See `BACKEND-SETUP.md` Step 5.
- Screening agent: **scaffolded**, to be validated on the first real applications (Phase 2).

## How to read submissions (no Sheet needed)

```
netlify api listFormSubmissions --data '{"form_id":"6a39f024e9537d0008564fa1"}'
```

Each submission's `data` object holds the form fields. The screening agent uses exactly this.
