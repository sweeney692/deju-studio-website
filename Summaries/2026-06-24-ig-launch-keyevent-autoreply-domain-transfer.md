# 2026-06-24 - Instagram ad launch, GA4 key event, applicant auto-reply, domain transfer

Session focused on getting the Nail Artist hiring campaign actually live: standing up the Meta ad, fixing GA4 conversion counting, and starting an applicant auto-reply email. That last piece uncovered a Wix DNS limitation that is now being resolved by moving the domain off Wix.

## What we completed

### GA4 conversion tracking (done + verified)
- **`generate_lead` is now a key event.** The GA4 "Key events" UI was hard to locate (and Claude-in-Chrome couldn't either), so it was created via the **GA4 Admin API** (`keyEvents.create`, `ONCE_PER_SESSION`, no default value).
- To allow the API write, the `analytics-mcp` service account (`deju-ga-mcp@...`) was **upgraded from Viewer to Editor** on the property. The working Admin-API recipe (mint a JWT with `openssl`, scope `analytics.edit`, call `analyticsadmin.googleapis.com`) is recorded in `CLAUDE.md` and memory (`project_ga_mcp`).
- **Verified end to end:** a real test careers submission produced `generate_lead` = 1 event / 1 key event in GA4. Whole chain works (form → `/careers-thanks` → gtag → GA4 conversion).
- Pulled a 30-day baseline: ~400 sessions/mo, `click_whatsapp` healthy (118 in 30d, all key events). No paid-social traffic yet, so the new `utm_source=instagram` will be unambiguous.

### Meta Instagram ad (built, pending review)
- **Decision: Instagram-only** (dropped Facebook). `CAMPAIGN-BRIEF.md` updated throughout (channel, funnel, placements, budget, UTMs).
- Walked through the full build in Ads Manager. The Advantage+ flow can't be restricted to one platform, so we **restarted as a manual Traffic campaign**: landing-page-views goal, Ubud + Gianyar, **manual placements = Instagram only**, A/B = Story + 1080x1350, ~**75,000 IDR/day x ~13 days** (ends ~6 July 2026), destination `?utm_source=instagram&utm_medium=paid&utm_campaign=hiring`. Account-level placement controls also exclude Audience Network + low-quality FB placements.
- No Meta Pixel needed (we optimize for landing-page-views and measure via GA4 `generate_lead`).
- **New creative:** added a 1.91:1 **landscape** hiring flyer (`Deju - Hiring - Editorial - Landscape 1200x628.png`, template `build/hiring-editorial-landscape.html`, added to `build.sh`). Note: for the IG feed the portrait 1080x1350 is still the stronger format.

### Applicant auto-reply email (in progress)
- Goal: auto-send each applicant a branded confirmation. **Netlify Forms has no native autoresponder**, so we added `netlify/functions/submission-created.mjs` - a zero-dependency function (global `fetch`, `.mjs`, no build step) that fires on every verified submission and emails the applicant from `careers@dejustudio.com` via **Resend**. Committed, but **dormant** until configured.

## The blocker we hit (and the decision)

Resend's domain verification needs an **MX record on a `send.` subdomain**. **Wix DNS does not support subdomain MX**, and **Wix does not allow changing nameservers** for Wix-registered domains (confirmed by Wix support + WHOIS: Wix is the registrar). So Cloudflare DNS can't be reached by just repointing nameservers.

We weighed three paths and the user chose to **transfer the domain off Wix**:
1. Switch provider to SendGrid/Brevo (verify via CNAME/TXT, work on Wix as-is) - lighter, not chosen.
2. **Move to Cloudflare DNS via domain transfer - chosen** (also gets off Wix long-term).
3. No-code Gmail/Zapier - not chosen.

Important nuance discovered: you **cannot transfer directly to Cloudflare Registrar** (it only accepts domains already on Cloudflare nameservers). So the route is: transfer Wix → a transfer-friendly registrar (Porkbun/Namecheap) → point nameservers at Cloudflare.

DNS inventory before any change (low-risk - only two records, no email/MX/TXT):
- A `dejustudio.com` → `75.2.60.5` (Netlify)
- CNAME `www` → `dejustudio.netlify.app`
A Cloudflare zone was already created with both records set to **DNS only (grey cloud)** - nameservers `blakely.ns.cloudflare.com` / `harvey.ns.cloudflare.com`. DNSSEC is off.

## Where we left off

Asked Wix support (via a prepared message) to **unlock `dejustudio.com` and provide the EPP/auth code**. Next session resumes there.

## Resume checklist (auto-reply email)
1. Get the auth code + confirm the domain is unlocked at Wix.
2. Transfer the registration to Porkbun or Namecheap (pay the transfer/renewal, ~$10; ~5 days, no downtime - Wix NS keep serving until cut over).
3. At the new registrar, set nameservers to Cloudflare's `blakely`/`harvey` - zone goes Active.
4. Add Resend's DNS records in Cloudflare; verify the domain in Resend.
5. Set `RESEND_API_KEY` as a Netlify env var.
6. Push to deploy; submit a real application to test the auto-reply; delete the test submission.
- Fallback if the transfer stalls: switch the function to SendGrid/Brevo (CNAME/TXT verification works on Wix today).

## Other open items (unchanged)
- Meta ad: await approval, then monitor (CPC / landing-page-views), pause weaker creative, do organic amplification (Story to IG Stories, pin 1080x1350, careers link in IG bio, A4 to WhatsApp Status).
- Screen applications with the Agent Forge `app-screener` once they arrive.
- Google Ads "Conversions" column / Primary action fix is still Ads-side (separate from this work).

## Housekeeping done this session
- Removed dead CSS (`.stack`, `.stack-lg`, `.divider-brass` in `css/base.css` - verified unused).
- Removed stray `*.inlined.html` build intermediates.
- Updated READMEs: `marketing/hiring-campaign/README.md`, `BACKEND-SETUP.md`, `marketing/flyer/README.md`, new `netlify/functions/README.md`.
- Memory: saved `feedback_use_context7_for_docs` (always use Context7 for library/platform docs) and `project_netlify_forms_limits`; updated `project_ga_mcp` (Editor + Admin-API writes).
