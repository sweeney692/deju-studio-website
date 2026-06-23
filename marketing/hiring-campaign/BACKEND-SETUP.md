# Careers Application - Backend Setup

The careers form on `dejustudio.com/careers` is a **Netlify Form**. This guide wires it to a notification inbox and a Google Sheet (the store the screening agent reads). One-time setup, no code deploy needed beyond what is already in the repo.

The form is already in `index.html` (`name="careers-application"`, `data-netlify="true"`, multipart for file uploads) and submits to the `/careers-thanks` page, which fires a GA4 `generate_lead` event.

---

## Step 1 - Form detection (DONE 2026-06-23)

The form is already detected and live in production. On first deploy it registered 0 forms because the site had `processing_settings.ignore_html_forms = true` (form detection off - the site never had a form before). This was flipped via the API:

```
netlify api updateSite --data '{"site_id":"8ff708dc-55db-4452-b5ba-16076b9d3320","body":{"processing_settings":{"html":{"pretty_urls":true},"ignore_html_forms":false}}}'
```

Then a production redeploy registered `careers-application` (13 fields), and a test submission was captured and deleted. **Gotcha for the future:** if form submissions ever stop being captured, check `ignore_html_forms` is still `false` (and that form detection only runs on **production** deploys, not CLI draft previews).

> Note: Netlify Forms free tier allows 100 submissions/month and file uploads up to 10 MB total per submission. The portfolio **link** is the primary input; the file upload is optional, which keeps usage light. If volume or uploads exceed the tier, upgrade Forms or switch to the function-based store noted in the plan.

## Step 2 - Email notifications to info.dejustudio@gmail.com (DONE 2026-06-23)

Configured via the Netlify API (no dashboard needed):

```
netlify api createHookBySiteId --data '{"site_id":"8ff708dc-55db-4452-b5ba-16076b9d3320","body":{"type":"email","event":"submission_created","data":{"email":"info.dejustudio@gmail.com"}}}'
```

Every submission now emails `info.dejustudio@gmail.com`. **Optional, manual (not automatable here):** add a Gmail **Careers** label + filter (Gmail's filter creation is not in the available tooling, and the filter must be made in the `info.dejustudio@gmail.com` account). Match on the Netlify sender / "careers-application" subject, apply the label. Inbox hygiene only; the notification works without it.

## Step 3 - The agent's store: read straight from the Netlify Forms API (no Sheet needed)

The screening agent reads submissions directly from Netlify, so the Google Sheet + Apps Script webhook from earlier drafts is **no longer required**:

```
netlify api listFormSubmissions --data '{"form_id":"6a39f024e9537d0008564fa1"}'
```

Each submission's `data` object holds the fields. The agent ranks and outputs a digest; no write-back store is needed for v1.

**Optional (only if you want a spreadsheet view or persistent score write-back):** create a Google Sheet, paste `apps-script.gs` into Extensions -> Apps Script, deploy it as a Web app, and add its URL as a Netlify **outgoing webhook** (Forms -> notifications -> Outgoing webhook) so each submission also appends a row. Not needed otherwise.

## Step 4 - GA4 conversion (already wired)

The thank-you page `careers-thanks.html` fires `gtag('event', 'generate_lead', ...)` on load. In GA4:
1. **Admin -> Events** - after the first real submissions, mark `generate_lead` as a **key event (conversion)**.
2. Optionally import it into Google Ads as a conversion if you ever run search ads for hiring.
3. This is the success KPI for the Meta campaign (see `CAMPAIGN-BRIEF.md`), measured per `utm_source` (meta vs flyer).

## Step 5 - Hand off to the screening agent

Once applications are arriving in the Sheet, the **Agent Forge `app-screener`** reads the Sheet, scores each candidate against the rubric, and produces a ranked shortlist with reasons. See `/Users/conorsweeney/Agent Forge/agents/app-screener/` (Phase 2). Start by running it manually over the first batch and checking its ranking against your own judgment before trusting it.

---

## Field reference (form `name` attributes)

`name, age, area, email, phone, experience, manicure_experience, english_level, open_to_training, portfolio_link, portfolio_file, about` plus the honeypot `bot-field` (ignore) and `form-name` (always `careers-application`).
