# CLAUDE.md

Context for AI assistants picking up work on this repo. Read this once at the start of a session.

## What this is

Single-page marketing site for Deju Studio, an ultra-premium private nail studio in Ubud, Bali. Vanilla HTML/CSS/JS, no framework, no build step. Hosted on Netlify (auto-deploys from `main`). Bookings happen exclusively through WhatsApp; there is no booking form, login, or backend.

## Current state

- **Live in production** at https://www.dejustudio.com with valid SSL (Let's Encrypt, Netlify-managed, auto-renews).
- **Analytics + conversion are live and verified.** GA4 stream `G-BZ8DVJJCNE` and Google Ads `AW-11529975683` (conversion label `tzL7CKzm76McEIPv9fkq`) are firing on every WhatsApp CTA click. Verified end-to-end on 2026-04-28 - GA4 `click_whatsapp` events landing, Ads conversion ping landing.
- **Google Ads Search campaign is live and spending.** Campaign: "Deju Studio - Search - Ubud Tourists", 75,000 IDR/day, English, presence-based Ubud + 10km radius, Sat-Thu schedule. Maximize Clicks bidding with 12k IDR max CPC. Full plan at `/Users/conorsweeney/.claude/plans/ok-let-s-plan-this-toasty-cray.md`. Memory: `project_ads_campaign.md`.
- **Studio hours**: Saturday - Thursday by appointment, Friday closed. (Updated 2026-04-28; was previously "Mon-Sat / Sun closed".)
- **Mobile menu is fixed and verified.** The mobile nav overlay properly fixes to the viewport with a solid `--pure-bone` background, the logo on mobile is `transform: scale(2)` from a clamp(72px, 8vw, 96px) base, and link size is 24px display font. Verified on phone 2026-04-28. See "Architecture conventions" below for the backdrop-filter pitfall that caused earlier breakage.
- **Partner-attribution table tents are live (2026-05-04).** First partner is **Padma Warung** in Ubud. Mechanism: a `?ref=<slug>` URL param flips every WhatsApp CTA in that browser session to use the generic message template plus a `(Sent from <Partner>)` suffix. Slug-to-name map lives in `js/config.js` under `partnerNames`. The print artwork lives at `tabletent/padma-warung.html` (tri-fold prism, A6 panels, Instagram QR on the middle panel and booking QR on the back panel, both encoded with the brand's Forest-on-Bone-Cream palette). The exported print PDF lives at the main repo root in `POS Materials/` (gitignored).
- DNS records live in Wix (the domain registrar) but resolve to Netlify (A `75.2.60.5`, CNAME `www → dejustudio.netlify.app`). Wix does not own SSL or hosting; it is purely a DNS host.
- Netlify CLI is installed locally and authenticated as `info.dejustudio@gmail.com` (Deju Studio team). Project ID: `8ff708dc-55db-4452-b5ba-16076b9d3320`. Use `netlify status` to confirm.
- Layout is single-page editorial (one `index.html` with `#about`, `#services`, `#gallery`, `#visit` anchors). The earlier multi-page version was collapsed in commit `f9391fe`. Legacy `/about.html`, `/services.html`, `/gallery.html`, `/contact.html` are 301-redirected in `netlify.toml` to the new anchors - leave those redirects alone.

## Architecture conventions

- **No build step.** Edit files, push to `main`, Netlify deploys. Do not introduce bundlers, package managers, or transpilers without checking with the user first.
- **`js/config.js` is the single source of truth** for the WhatsApp number, per-service message templates, and analytics IDs. CTAs throughout the site use `data-wa="<slug>"` attributes; `js/whatsapp.js` upgrades them with pre-filled `wa.me` links and per-service templated messages, and fires the conversion event on click.
- **Every `[data-wa]` anchor has a baseline `href="https://wa.me/6282340889808"` directly in HTML** as a no-JS fallback. `whatsapp.js` overwrites the href at load time with the templated message, but if it ever fails to load (extension blocking, network error), the CTA still opens WhatsApp. Don't strip these baseline hrefs.
- **`js/analytics.js` loads gtag using the Ads ID as the primary**, not the GA4 ID. This is a deliberate workaround: Google's gtag endpoint can return 404 for newly-created GA4 streams that haven't fully propagated server-side, which would block the entire gtag library from loading and break the Ads conversion as a side effect. See the comment in `analytics.js` and the commit message on `e1e7902`.
- **Gallery images** are managed via `scripts/optimize-images.sh`. The full curated library lives in `assets/img/` (JPG + WebP pairs, 1600w long edge). `index.html` only displays a subset; the rest are kept for future swaps. Don't delete unused images without asking.
- **Source assets** (raw photos in `Image Gallery/`, `Pricing/`, `Reviews/`, original logo PNGs, the developer guide PDF) are gitignored on purpose. They live locally only.
- **Mobile menu / `backdrop-filter` pitfall.** `.site-header` only carries `backdrop-filter: blur(12px)` on desktop. On mobile it is explicitly disabled because `backdrop-filter` makes the element a containing block for `position: fixed` descendants (per CSS spec, same as `transform`/`filter`). With it enabled on mobile, the `.site-nav` overlay was being trapped inside the header's box, so the menu background didn't paint full-screen and the open menu overlapped the logo. If you re-enable `backdrop-filter` site-wide or move the nav into a different positioned ancestor, this bug comes back. The mobile logo also uses `transform: scale(2)` with `transform-origin: left center` so the layout box (and therefore the header height + the menu's `top: 96px` offset) stays unchanged.
- **Partner attribution flow.** Partners are added in two places only: `partnerNames` in `js/config.js` (slug -> display name), and a new `tabletent/<slug>.html` artwork file. `js/whatsapp.js` reads `?ref=<slug>` from the landing URL, persists it to `sessionStorage.dejuRef`, and on every `[data-wa]` CTA click overrides the per-service template with the generic one and appends ` (Sent from <Partner>)` so the studio sees a single recognisable opener in WhatsApp. GA4 also auto-captures the QR's `utm_source`/`utm_medium`/`utm_campaign` params, so traffic shows up in Acquisition reports. Non-partner visitors (no `?ref=`) keep the original per-service messages unchanged. Print artwork uses inlined `data:` URIs for the logo + QR codes so the HTML renders standalone (works under `file://` and detached from the repo). The exported PDF for distribution lives in the (gitignored) `POS Materials/` folder at the main repo root.

## Where to pick up next

Grouped by who owns the action. User-driven items happen outside the codebase; technical items are code changes.

### User-driven (outside this repo)

1. **Submit "Deju Studio" for Google Ads business name verification** so ads display the trade name instead of a URL-derived placeholder. Path: ads.google.com -> Tools -> Billing or Setup -> Business name verification. Requires evidence (NIB / business registration, domain ownership, Instagram presence). Takes 3-21 days.

2. **Update Google Business Profile hours** at business.google.com to match the site (Sat-Thu by appointment, Friday closed). Free, ~2 minutes. Important so the location asset on Search ads doesn't conflict with what searchers see in Maps.

3. **Monitor the live ad campaign.** The campaign entered "Bid strategy learning" on 2026-04-28. Don't make material edits during the 7-10 day learning phase (would reset learning). Safe weekly tasks: prune Search Terms by adding negative keywords, review impression share. Once 15+ conversions accrue, switch bidding from Maximize Clicks to Maximize Conversions. Once 30+, switch to Target CPA. Full monitoring plan at `/Users/conorsweeney/.claude/plans/ok-let-s-plan-this-toasty-cray.md`.

4. **Print and deliver the Padma Warung table tent.** The artwork file is at `tabletent/padma-warung.html` and the latest export at `POS Materials/Deju Studio - Tabletent for Padma Warung.pdf` (gitignored). After every copy edit to the HTML, **re-export the PDF** (Chrome -> Print -> Save as PDF, Custom 331x154 mm, margins None, background graphics On) so the PDF stays in sync. Specs to give the Bali print shop: 300-350 gsm uncoated matte card, single-sided, trim to 325x148 mm with 3 mm bleed, score and fold at the three vertical fold lines, glue the 10 mm tab inside the back panel. Order at least 5 spares. Before sending, scan both QR codes from a printed draft to catch any URL or slug typos.

5. **Track Padma Warung commission.** Every WhatsApp inquiry that arrived from the table tent will end with `(Sent from Padma Warung)`. Reconcile those against bookings completed and pay commission per the partner agreement. GA4 also reports the same traffic under `source = padma-warung` for sanity-checking volume.

### Technical (code changes)

6. **`js/config.js` has dead fields.** `address`, `hours`, `mapEmbedSrc`, `mapsUrl`, `whatsappDisplay`, `instagram`, `instagramUrl`, `email`, `googleBusinessUrl` are defined but no JS reads them - `index.html` hardcodes the values directly. Only `whatsappNumber`, `whatsappTemplates`, `analytics`, and the new `partnerNames` are actually read (by `whatsapp.js` and `analytics.js`). As of 2026-04-28 all values match the live site, so deleting them now would lose no information. Two valid futures: wire them up so config is canonical, or delete. **Ask before removing.**

7. **Adding more partner table tents.** When a new partner signs up: (a) add `<slug>: '<Display Name>'` to `partnerNames` in `js/config.js`, (b) generate a new QR with `qrencode -o assets/img/qr-<slug>.svg -t SVG -l Q -m 2 --foreground=1E5128 --background=F2EBDD "https://www.dejustudio.com/?ref=<slug>&utm_source=<slug>&utm_medium=qr&utm_campaign=tabletent"`, (c) duplicate `tabletent/padma-warung.html`, find/replace the slug + name + inline data URIs (use the existing python helper pattern - see git history for `tabletent/padma-warung.html`), (d) export to PDF and drop in `POS Materials/`. Tabletent README has the full step-by-step.

8. **(Optional) Add `openingHours` to the `BeautySalon` schema.org JSON-LD block** in `index.html`. Currently the site has structured data but no opening-hours field. Would help Google's rich results.

9. **(Optional) Replace `assets/logo/logo-cream.png` with an official Bone Cream variant** when one is available.

## How to resume work

### Orient yourself

1. `cd "/Users/conorsweeney/Deju Studio Website"`
2. `git status` and `git log --oneline -10` to see what's changed recently.
3. `netlify status` to confirm CLI auth and which site is linked.

### Edit and preview

4. For local preview: `python3 -m http.server 5173` and open `http://localhost:5173`. No build step - edit files, refresh browser.
5. To test on a real phone, your laptop's LAN IP works: `python3 -m http.server 5173 --bind 0.0.0.0` then open `http://<your-laptop-ip>:5173` from the phone (same Wi-Fi).
6. Most copy and structure lives in `index.html`. Site-wide config (WhatsApp number, message templates, analytics IDs) lives in `js/config.js`. Visual tokens (colours, type, spacing) live in `css/tokens.css`.

### Deploy

7. Push to `main`. Netlify auto-deploys in ~1-2 min.
8. Verify a deploy completed: `netlify api listSiteDeploys --data '{"site_id":"8ff708dc-55db-4452-b5ba-16076b9d3320"}'` and check the top entry has `state: "ready"` matching your latest commit SHA.
9. After deploy, hard-reload to bypass cache. On desktop: Cmd+Shift+R. On iOS Safari: easiest is to open the site in a Private tab (long-press tabs icon -> New Private Tab). On iOS Chrome: open in an Incognito tab. Private/Incognito tabs always fetch fresh CSS/JS.

### Test the analytics + conversion path

10. Open the site in a clean browser (no ad blockers / privacy extensions), open DevTools Network tab, filter `google`, click any WhatsApp CTA. Expect:
   - `gtag/js?id=AW-...` (200)
   - `collect?v=2&tid=G-BZ8DVJJCNE&...` (204)
   - `googleads.g.doubleclick.net/pagead/...` request firing
   - If `gtag/js` fails with `ERR_BLOCKED_BY_CLIENT`, that's the testing browser's extension or system-level network blocker, not a site bug.

### Test the partner attribution path

11. Open `http://localhost:5173/?ref=padma-warung`, click any WhatsApp CTA. The pre-filled message should be the generic template plus ` (Sent from Padma Warung)`.
12. With the partner-tagged session active, click an in-page anchor (e.g. Services). The URL strips back, but the next WhatsApp click should still carry the tag (sessionStorage persistence).
13. Open `http://localhost:5173/` with no params. WhatsApp messages should be the per-service templates with **no** trailing tag (regression check).
14. To test the print artwork without serving from the repo, open `tabletent/padma-warung.html` directly in Chrome via `file://`. The logo + both QR codes are inlined as data URIs so the page must render fully without any local server.

### Re-export the print PDF after editing the artwork

15. Open the partner's HTML file in Chrome (Safari is unreliable for custom mm page sizes). `Cmd+P` -> Save as PDF, page size **Custom 331 x 154 mm**, margins **None**, background graphics **On**. Save into `POS Materials/` overwriting the existing PDF. Verify in Preview.app -> Tools -> Show Inspector -> page size reads exactly 331 x 154 mm.

## Things to avoid

- Don't add em dashes anywhere. Use a hyphen instead. (Global rule from user memory.)
- Don't introduce a build step or `package.json`.
- Don't delete unused gallery images in `assets/img/` without asking - they are the curated library.
- Don't strip the baseline `href="https://wa.me/..."` from `[data-wa]` anchors in `index.html` - they are deliberate no-JS fallbacks.
- Don't change `js/analytics.js` to use the GA4 ID as the gtag/js primary - this would re-break the Ads conversion. See the comment in that file.
- Don't re-enable `backdrop-filter` on `.site-header` at mobile widths, and don't move `.site-nav` into a different positioned ancestor without checking what containing block its `position: fixed` ends up in. This re-breaks the mobile menu (background fails to paint full-screen, menu overlaps the logo). See "Architecture conventions" above.
- Don't touch the `[[redirects]]` block in `netlify.toml` that maps legacy multi-page URLs to in-page anchors.
- Don't commit anything from the gitignored list (`Image Gallery/`, `Pricing/`, `Reviews/`, `Logo*.PNG`, `Deju-Studio-Developer-Guide.*`, `Desty - Portofolio .pdf`, `POS Materials/`).
- Don't break the partner-attribution flow when editing `js/whatsapp.js`. Specifically: when a partner ref is in sessionStorage, the message body must use the **generic** template (not the per-service one) plus ` (Sent from <Partner>)` on the same line. Service-specific templates only fire for non-partner traffic. Tests in `CLAUDE.md` -> "Test the partner attribution path".
- Don't strip the inline `data:image/png;base64,...` and `data:image/svg+xml;base64,...` URIs from `tabletent/*.html` files. They're inlined deliberately so the artwork renders standalone (under `file://`, in print preview, and outside the repo).
- Don't make material changes (keywords, bids, budget +/- 20%, schedule, locations, bid strategy) to the live Google Ads campaign during the learning phase - it resets learning and sets the campaign back another week.
