# CLAUDE.md

Context for AI assistants picking up work on this repo. Read this once at the start of a session.

## What this is

Single-page marketing site for Deju Studio, an ultra-premium private nail studio in Ubud, Bali. Vanilla HTML/CSS/JS, no framework, no build step. Hosted on Netlify (auto-deploys from `main`). Bookings happen exclusively through WhatsApp; there is no booking form, login, or backend.

## Current state

- **Live in production** at https://www.dejustudio.com with valid SSL (Let's Encrypt, Netlify-managed, auto-renews).
- DNS records live in Wix (the domain registrar) but resolve to Netlify (A `75.2.60.5`, CNAME `www → dejustudio.netlify.app`). Wix does not own SSL or hosting; it is purely a DNS host.
- Netlify CLI is installed locally and authenticated as `info.dejustudio@gmail.com` (Deju Studio team). Project ID: `8ff708dc-55db-4452-b5ba-16076b9d3320`. Use `netlify status` to confirm.
- Layout is single-page editorial (one `index.html` with `#about`, `#services`, `#gallery`, `#visit` anchors). The earlier multi-page version was collapsed in commit `f9391fe`. Legacy `/about.html`, `/services.html`, `/gallery.html`, `/contact.html` are 301-redirected in `netlify.toml` to the new anchors - leave those redirects alone.

## Architecture conventions

- **No build step.** Edit files, push to `main`, Netlify deploys. Do not introduce bundlers, package managers, or transpilers without checking with the user first.
- **`js/config.js` is the single source of truth** for WhatsApp number, per-service message templates, and analytics IDs. CTAs throughout the site use `data-wa="<slug>"` attributes; `js/whatsapp.js` wires them to pre-filled `wa.me` links at load time.
- **Gallery images** are managed via `scripts/optimize-images.sh`. The full curated library lives in `assets/img/` (JPG + WebP pairs, 1600w long edge). `index.html` only displays a subset; the rest are kept for future swaps. Don't delete unused images without asking.
- **Source assets** (raw photos in `Image Gallery/`, `Pricing/`, `Reviews/`, original logo PNGs, the developer guide) are gitignored on purpose. They live locally only.

## Open items the user knows about

These are tracked in `README.md` ("Open items before launch"). Most important:

1. **Analytics IDs are placeholders.** `js/config.js` has `G-PLACEHOLDER` / `AW-PLACEHOLDER`. `js/analytics.js` and `js/whatsapp.js` no-op while placeholders are present, so it is safe to leave in production but no events fire. Replace with real IDs from the GA4 + Google Ads accounts when the user has them.
2. **Address inconsistency.** `index.html` says "Jl. Tirta Tawar, Petulu, 80571" (in schema.org JSON-LD, footer, `#visit` section, map iframe, Maps link). `js/config.js` says "Gn. Abang Street, Lodtunduh, 80582". The user's auto-memory says Lodtunduh. Confirm with the user which is correct before changing anything; do not silently pick one.
3. **`config.js` has dead fields.** `address`, `hours`, `mapEmbedSrc`, `mapsUrl` are defined but no JS reads them. The intent was that they would be the canonical source; the page hardcodes them instead. Two valid futures: wire them up, or delete them. Ask before removing.

## How to resume work

1. `cd "/Users/conorsweeney/Deju Studio Website"`
2. `git status` and `git log --oneline -10` to see current state.
3. `netlify status` to confirm CLI auth and which site is linked.
4. For local preview: `python3 -m http.server 5173` and open `http://localhost:5173`.
5. To deploy: just push to `main`. Netlify picks it up automatically. To verify a deploy: `netlify api listSiteDeploys --data '{"site_id":"8ff708dc-55db-4452-b5ba-16076b9d3320"}' | head -50` or watch in the admin UI.

## Things to avoid

- Don't add em dashes anywhere. Use a hyphen instead. (Global rule from user memory.)
- Don't introduce a build step or package.json.
- Don't delete unused gallery images in `assets/img/` without asking - they are the curated library.
- Don't touch the `[[redirects]]` block in `netlify.toml` that maps legacy multi-page URLs to in-page anchors.
- Don't commit anything from the gitignored list (`Image Gallery/`, `Pricing/`, `Reviews/`, `Logo*.PNG`, `Deju-Studio-Developer-Guide.*`, `Desty - Portofolio .pdf`).
