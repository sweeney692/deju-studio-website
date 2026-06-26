# 2026-06-26 - Careers link 404 + mobile landing fix

The hiring campaign was live and a careers link opened from Instagram showed
Netlify's "Page not found". This session diagnosed it (the site was never
down), made every plausible careers URL resolve, and fixed a separate bug
where the careers link parked mobile visitors on the FAQ section instead of
the application form. Also did a codebase tidy + docs pass.

## What was reported

A screenshot from the Instagram in-app browser showing "Page not found" at
`www.dejustudio.com`, with the note that the campaign is live. The IG browser
only ever shows the bare domain in its address bar and hides the path, so the
404 was path-specific, not a whole-site outage.

## Diagnosis

- **The site was up the whole time.** Root returned HTTP 200, apex 301s to
  `www`, the latest deploy was `ready`/published, and GA4 realtime showed paid
  Instagram visitors actively on the homepage.
- **Two distinct problems behind the symptom:**
  1. **Case-sensitive / exact redirect matching.** Only the literal `/careers`
     was mapped to `/#careers`. Any variant 404'd: `/Careers` (the usual form
     of a hand-typed bio link), `/career`, `/hiring`, `/jobs`, `/apply`,
     `/careers/<anything>`. The link tapped from Instagram was almost certainly
     one of these. 404s are invisible to GA4 (the Netlify 404 page carries no
     gtag), which is exactly why no careers landings ever appeared in the data.
  2. **Deep-anchor landing parked on the wrong section.** Opening `/careers`
     (→ 301 → `/#careers`) made the browser jump to careers at parse time, then
     the 13 lazy-loaded images + the map iframe **above** careers finished
     loading and pushed it down - leaving the viewport on `#faq`, which sits
     directly above `#careers`. On a phone this reflow dribbles in over a couple
     of seconds, so the first one-shot fix wasn't enough.

Note on attribution: GA4 cannot distinguish "ad points at `/careers`" from
"ad points at `/`" - the `/careers` redirect resolves to `/`, and GA4 strips
both the `utm_*` params and the `#careers` fragment from the recorded landing
page. So the brief's destination (`/careers`) is correct; the real defect was
the FAQ mis-landing, now fixed.

## What we fixed (all deployed + verified live)

### 1. Tolerant careers redirects (`netlify.toml`)
Added explicit aliases so no plausible careers link can 404 again, each → `/#careers`:
`/Careers`, `/careers/*`, `/career`, `/hiring`, `/jobs`, `/job`, `/apply`,
`/apply-now`. (Netlify redirect matching is case-sensitive and exact, so every
variant must be listed.) Verified: all return 200 and resolve to `/#careers`.

### 2. Robust deep-anchor landing (`js/nav.js`)
Appended a fragment-landing fix: when the page opens at a hash, re-snap to the
target every 50ms for ~3s (riding out lazy images / the map iframe / late
mobile reflow), using the same 96px offset as `scroll-padding-top` so the
sticky header doesn't cover the heading. It bails the instant the visitor
scrolls, so it never yanks them back.

### 3. Cache-bust (`index.html`)
Bumped the include to `js/nav.js?v=3` so the aggressively-caching Instagram
in-app browser fetches the new script instead of a stale copy. **When you edit
`nav.js` again, bump this `?v=` number.**

### Verification (real Chrome via puppeteer-core, mobile viewport)
Measured the actual scroll landing on the live site, **normal and throttled
slow-3G** (which forces the lazy-load reflow that was breaking it):

| Condition | Lands on | Careers heading at | Heading shown |
|---|---|---|---|
| Normal | careers | y=96px | "Join the Deju studio." |
| Slow 3G | careers | y=96px | "Join the Deju studio." |

## The link to use

- **Paid IG ad (already set, correct):**
  `https://www.dejustudio.com/careers?utm_source=instagram&utm_medium=paid&utm_campaign=hiring`
- **Desty's organic posts (bio link, Story stickers, captions):**
  `https://www.dejustudio.com/careers?utm_source=ig&utm_medium=social&utm_campaign=hiring`
  (`utm_source=ig` keeps organic distinct from the paid `instagram` source in GA4.)

To test on a phone: fully close the in-app browser (tap the X, don't just back
out) and reopen the link, or use a Safari/Chrome private tab, so it fetches the
fresh JS.

## Housekeeping done this session
- Audited the tree for stale/unused files: all 6 CSS and 7 JS files are loaded
  by the HTML; both QR SVGs are used by the tabletent artwork; no build
  intermediates or OS cruft are tracked (`.DS_Store`, `business-expansion/` are
  already gitignored). Confirmed the previously-flagged dead CSS classes
  (`.divider-brass`, `.stack`, `.service-card`, etc.) have **0 references** -
  already removed. Nothing stale left to delete.
- Did **not** touch the `js/config.js` dead fields (rules say ask first) or the
  curated gallery images.
- Updated docs: this summary, `CLAUDE.md`, `marketing/hiring-campaign/README.md`,
  `marketing/hiring-campaign/CAMPAIGN-BRIEF.md`.

## Still open (unchanged by this session)
- Applicant auto-reply email - finish the Wix → Cloudflare domain move (main
  open task). See `2026-06-24-...md` + `BACKEND-SETUP.md` Step 5.
- Meta IG ad - monitor once approved; organic amplification; screen applications.
- Google Ads "Conversions" column / Primary action fix (Ads-side).
