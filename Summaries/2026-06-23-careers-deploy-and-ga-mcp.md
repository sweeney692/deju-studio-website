# Careers funnel deploy + Google Analytics MCP

Date: 2026-06-23. Follows the same-day build of the hiring funnel (`2026-06-23-hiring-campaign.md`) and flyer refresh (`2026-06-23-hiring-flyer-revisions.md`). This session took the careers funnel live and wired up GA reporting into Claude Code.

## What we completed

### 1. Shipped the careers funnel to production
- Deployed via the Netlify CLI from the **Deju account** (`info.dejustudio@gmail.com`), after a draft-preview check, then merged PR #2 to `main` so source and production match. The site is GitHub-connected, so `main` stays in sync going forward.
- Verified live: `/careers` 301s to `/#careers`, the form + `JobPosting` schema render, the thank-you page serves.

### 2. Fixed Netlify form detection
- First deploy registered **0 forms** because the site had `processing_settings.ignore_html_forms = true` (off by default - it had never had a form). Flipped it to `false` via `netlify api updateSite`, redeployed, and the `careers-application` form registered (13 fields). Ran a real test submission end to end, confirmed capture, then deleted it. **Gotcha:** form detection runs only on production deploys, not CLI draft previews.

### 3. Application notifications + store (simplified)
- Created a Netlify form-submission **email hook** to `info.dejustudio@gmail.com` via the API (`createHookBySiteId`). Gmail `Careers` label + filter set up.
- **Dropped the Google Sheet + Apps Script requirement.** The screening agent now reads submissions straight from the **Netlify Forms API** (`listFormSubmissions`, `form_id 6a39f024e9537d0008564fa1`). Updated the Agent Forge `app-screener` bundle and `BACKEND-SETUP.md` accordingly. The Sheet/Apps Script remains documented as optional.

### 4. Google Analytics MCP (new capability)
- Set up Google's official **`analytics-mcp`** server so GA4 is queryable from Claude Code - for monitoring traffic and the hiring campaign (sessions by source, `generate_lead` by `utm_source`).
- From scratch under the Deju Google account: GCP project `deju-studio-analytics`, enabled GA Admin + Data APIs, created a read-only **service account** (`deju-ga-mcp@deju-studio-analytics.iam.gserviceaccount.com`, key at `~/deju-ga-mcp-key.json`) and granted it Viewer on GA4 property **534840336**. Registered the MCP (`pipx`-installed binary) in Claude Code; verified it pulls real data (last-7-day sessions by channel).
- **Why a service account:** `gcloud auth application-default login` with the `analytics.readonly` scope is blocked by Google for the default client ("This app is blocked"); the SA-key path is the working approach. Detail recorded in memory `project_ga_mcp`.

### 5. Housekeeping + docs
- Removed gitignored build scratch (`build/*.inlined.html`) and loose `.DS_Store`. Confirmed `business-expansion/` is gitignored (local-only) and source photos live in `marketing/flyer/_source/Hiring/`.
- Fixed stale QR references (the flyer refresh removed the QR) in `CAMPAIGN-BRIEF.md`; added `marketing/hiring-campaign/README.md`.
- Updated `CLAUDE.md`: careers live-status, GA MCP, the form-detection gotcha, a "Launch + monitor the hiring campaign" next-steps item, and a "Check careers applications + GA" resume section.

## State now
- Careers funnel: **live**, capturing + emailing applications. Form `form_id`: `6a39f024e9537d0008564fa1`.
- GA MCP: **set up and verified**; needs a Claude Code restart to load its tools into a session.
- Flyers: final (4 placements, no QR).

## Next (user-driven)
1. **Launch the Meta ad campaign** (the main open task) per `marketing/hiring-campaign/CAMPAIGN-BRIEF.md`; post flyers organically; add the careers link to the IG bio.
2. **GA4:** mark `generate_lead` as a key event (Admin -> Key events). Then monitor via the GA MCP.
3. **Screen applications** with the Agent Forge `app-screener` once they arrive; validate on the first ~10 (Phase 2 readiness gate).
