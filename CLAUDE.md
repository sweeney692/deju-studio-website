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

## Where to pick up next

Grouped by who owns the action. User-driven items happen outside the codebase; technical items are code changes.

### User-driven (outside this repo)

1. **Submit "Deju Studio" for Google Ads business name verification** so ads display the trade name instead of a URL-derived placeholder. Path: ads.google.com -> Tools -> Billing or Setup -> Business name verification. Requires evidence (NIB / business registration, domain ownership, Instagram presence). Takes 3-21 days.

2. **Update Google Business Profile hours** at business.google.com to match the site (Sat-Thu by appointment, Friday closed). Free, ~2 minutes. Important so the location asset on Search ads doesn't conflict with what searchers see in Maps.

3. **Monitor the live ad campaign.** The campaign entered "Bid strategy learning" on 2026-04-28. Don't make material edits during the 7-10 day learning phase (would reset learning). Safe weekly tasks: prune Search Terms by adding negative keywords, review impression share. Once 15+ conversions accrue, switch bidding from Maximize Clicks to Maximize Conversions. Once 30+, switch to Target CPA. Full monitoring plan at `/Users/conorsweeney/.claude/plans/ok-let-s-plan-this-toasty-cray.md`.

### Technical (code changes)

4. **`js/config.js` has dead fields.** `address`, `hours`, `mapEmbedSrc`, `mapsUrl`, `whatsappDisplay`, `instagram`, `instagramUrl`, `email`, `googleBusinessUrl` are defined but no JS reads them - `index.html` hardcodes the values directly. Only `whatsappNumber`, `whatsappTemplates`, and `analytics` are actually read (by `whatsapp.js` and `analytics.js`). As of 2026-04-28 all values match the live site, so deleting them now would lose no information. Two valid futures: wire them up so config is canonical, or delete. **Ask before removing.**

5. **(Optional) Add `openingHours` to the `BeautySalon` schema.org JSON-LD block** in `index.html`. Currently the site has structured data but no opening-hours field. Would help Google's rich results.

6. **(Optional) Replace `assets/logo/logo-cream.png` with an official Bone Cream variant** when one is available.

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

## Things to avoid

- Don't add em dashes anywhere. Use a hyphen instead. (Global rule from user memory.)
- Don't introduce a build step or `package.json`.
- Don't delete unused gallery images in `assets/img/` without asking - they are the curated library.
- Don't strip the baseline `href="https://wa.me/..."` from `[data-wa]` anchors in `index.html` - they are deliberate no-JS fallbacks.
- Don't change `js/analytics.js` to use the GA4 ID as the gtag/js primary - this would re-break the Ads conversion. See the comment in that file.
- Don't re-enable `backdrop-filter` on `.site-header` at mobile widths, and don't move `.site-nav` into a different positioned ancestor without checking what containing block its `position: fixed` ends up in. This re-breaks the mobile menu (background fails to paint full-screen, menu overlaps the logo). See "Architecture conventions" above.
- Don't touch the `[[redirects]]` block in `netlify.toml` that maps legacy multi-page URLs to in-page anchors.
- Don't commit anything from the gitignored list (`Image Gallery/`, `Pricing/`, `Reviews/`, `Logo*.PNG`, `Deju-Studio-Developer-Guide.*`, `Desty - Portofolio .pdf`).
- Don't make material changes (keywords, bids, budget +/- 20%, schedule, locations, bid strategy) to the live Google Ads campaign during the learning phase - it resets learning and sets the campaign back another week.
