# Hiring campaign - Nail Artist (Ubud)

Everything for the 2026-06 push to hire 3 nail artists: the paid campaign plan, the application backend, and how it connects to the website and the screening agent. Created 2026-06-23.

## The funnel (live)

```
Meta ad (IG/FB) ──┐
Flyer link / URL ─┼─▶ dejustudio.com/careers ─▶ application form ─▶ email to info.dejustudio@gmail.com (Careers label)
Organic + WA ─────┘                                              └▶ Netlify Forms API ─▶ screening agent ─▶ shortlist
```

Applications go through the **website only**, never the WhatsApp booking line (which is saturated with clients).

## Files here

| File | What it is |
|---|---|
| `CAMPAIGN-BRIEF.md` | The Meta (Instagram + Facebook) ad plan for the 1,000,000 IDR budget: objective, targeting, ad copy, organic amplification, UTMs, KPIs, and the Special Ad Category caveat. |
| `BACKEND-SETUP.md` | How the application form is wired: Netlify Forms detection, the live email notification, GA4 conversion, and the (optional) Google Sheet mirror. Includes the `ignore_html_forms` gotcha. |
| `apps-script.gs` | Optional Google Apps Script that appends each submission to a Sheet (only if you want a spreadsheet view; the agent does not need it). |

## Related, elsewhere in the repos

- **Careers page + form + JobPosting schema:** `index.html` (`#careers` section), `careers-thanks.html`, `css/components.css` (`.careers-*`). Documented in the root `CLAUDE.md` under "Careers / hiring".
- **Flyers (5 placements):** `marketing/flyer/build/hiring-editorial-*.html`; exported PNG/PDF in `marketing/flyer/`. Rebuild: `cd marketing/flyer && bash build/build.sh`. Design notes: `Summaries/2026-06-23-hiring-flyer-revisions.md`.
- **Screening agent (separate repo):** `~/Agent Forge/agents/app-screener/` - reads applications from the Netlify Forms API, scores against the role rubric, surfaces a ranked shortlist.
- **Analytics:** the Deju GA4 (property `534840336`) is queryable via the `analytics-mcp` MCP server for monitoring the campaign (sessions by source, `generate_lead` form submissions). Setup recorded in memory (`project_ga_mcp`).

## Current status (2026-06-23)

- Careers page + form: **live in production**, form detection on, email notifications on.
- Flyers: **final** (4 placements, refreshed to one vertical layout, written-link CTA, no QR).
- Meta campaign: **not yet launched** - this is the main remaining task (build it in Ads Manager per `CAMPAIGN-BRIEF.md`).
- Screening agent: **scaffolded**, to be validated on the first real applications (Phase 2).

## How to read submissions (no Sheet needed)

```
netlify api listFormSubmissions --data '{"form_id":"6a39f024e9537d0008564fa1"}'
```

Each submission's `data` object holds the form fields. The screening agent uses exactly this.
