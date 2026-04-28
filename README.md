# Deju Studio Website

Marketing website for [Deju Studio](https://www.dejustudio.com), an ultra-premium private nail studio in Ubud, Bali. Bookings happen exclusively through WhatsApp.

## Live

- Production: https://www.dejustudio.com (and https://dejustudio.com)
- Netlify project: `dejustudio` (auto-deploys from `main`)
- Analytics: GA4 `G-BZ8DVJJCNE` + Google Ads `AW-11529975683` (conversion label `tzL7CKzm76McEIPv9fkq`). All firing as of 2026-04-28.
- Live Google Ads Search campaign: "Deju Studio - Search - Ubud Tourists", 75k IDR/day, English, presence-based Ubud + 10km radius, Sat-Thu schedule.

## Stack

- Hand-written HTML5, vanilla CSS, vanilla JS. No framework, no build step.
- Single-page editorial layout. All sections live in [`index.html`](index.html); the nav uses in-page anchors (`#about`, `#services`, `#gallery`, `#visit`).
- Hosted on Netlify, deployed automatically on push to `main`.

## File map

```
/
├── index.html                  Single-page site (hero, about, services, gallery, visit, reviews, CTA)
├── css/
│   ├── reset.css, tokens.css   CSS reset + design tokens (colours, type, spacing)
│   ├── base.css                Typography, container, base elements
│   ├── components.css          Buttons, nav, hero, gallery, services carousel, footer, lightbox
│   ├── pages.css               Page-specific composition rules
│   └── motion.css              Reveal animations
├── js/
│   ├── config.js               Single source of truth (WhatsApp number, message templates, analytics IDs)
│   ├── whatsapp.js             Wires every [data-wa] CTA to a pre-filled wa.me link, fires Ads conversion on click
│   ├── analytics.js            GA4 + Google Ads loader (loads gtag using Ads ID as primary, see notes below)
│   ├── nav.js                  Mobile nav toggle
│   ├── gallery.js              Lightbox for the gallery collage
│   ├── carousel.js             Services price-list carousel (with dots + arrows)
│   └── reveal.js               IntersectionObserver-driven reveal-on-scroll
├── assets/
│   ├── img/                    Web-optimised gallery photos (1600w JPG + WebP pairs)
│   └── logo/                   Forest + Cream logo variants
├── scripts/optimize-images.sh  Regenerates assets/img/ from the source folder
├── netlify.toml                Publish + redirects (legacy /about.html → /#about etc) + cache headers
├── robots.txt, sitemap.xml
├── README.md                   This file
└── CLAUDE.md                   Project context for AI assistants - read this for the full picture
```

## Editing site-wide details

Almost everything site-wide lives in [`js/config.js`](js/config.js): WhatsApp number, message templates per service, analytics IDs.

To update copy or prices, edit [`index.html`](index.html) directly. The price list lives in the `#services` section (services carousel). Address, hours, and map embed are also currently hardcoded in `index.html` (see "Open items" below).

WhatsApp CTAs use the `data-wa="<service-slug>"` attribute. They have a baseline `href="https://wa.me/6282340889808"` directly in the HTML as a no-JS fallback; `js/whatsapp.js` upgrades the href at load time with the per-service templated message and fires the Google Ads conversion event on click. Don't strip the baseline href.

To regenerate gallery images from a new source folder, run `bash scripts/optimize-images.sh` (requires ImageMagick `magick` CLI). Source filenames are listed in the script.

## Analytics + conversion notes

- `js/analytics.js` loads the gtag library using the **Ads ID (`AW-...`) as the primary** in the script URL, not the GA4 ID. This is a deliberate workaround: Google's gtag endpoint occasionally returns 404 for newly-created GA4 streams that haven't fully propagated server-side, which would block the entire gtag library from loading and break the Ads conversion as a side effect. The Ads endpoint serves reliably; GA4 is then registered via `gtag('config', ...)` against the loaded library.
- The conversion event is fired in `js/whatsapp.js` on every `[data-wa]` CTA click. It sends both a GA4 `click_whatsapp` event and an Ads `conversion` event with `send_to: AW-11529975683/tzL7CKzm76McEIPv9fkq`.
- To test end-to-end: open the live site in a clean browser (no ad blockers / privacy extensions), open DevTools Network tab, filter `google`, click any WhatsApp CTA. Expect `gtag/js?id=AW-...` (200), `collect?v=2&tid=G-BZ8DVJJCNE&...` (204), and a `googleads.g.doubleclick.net/pagead/...` request.
- If `gtag/js` fails with `ERR_BLOCKED_BY_CLIENT`, that's the testing browser's extension or system-level network blocker - not a site bug.

## Open items

- [ ] **Address inconsistency**: `index.html` says "Jl. Tirta Tawar, Petulu, 80571"; `js/config.js` says "Gn. Abang Street, Lodtunduh, 80582". Pick the canonical address and update everywhere (schema.org JSON-LD, footer, contact section, map iframe, Open in Maps link, config.js).
- [ ] **Decide what to do with unused `js/config.js` fields** (`address`, `hours`, `mapEmbedSrc`, `mapsUrl`). Either wire them up so config is canonical, or delete them. The `hours` value matches the live site so deleting it loses no information; the address field disagrees with the site (see point above).
- [ ] **Submit "Deju Studio" for Google Ads business name verification** so ads display the trade name instead of the URL-derived placeholder. ads.google.com -> Tools -> Billing/Setup -> Business name verification.
- [ ] **Update Google Business Profile hours** at business.google.com to match the site (Sat-Thu by appointment, Friday closed). Important so the location asset on Search ads doesn't conflict with what searchers see in Maps.
- [ ] (Optional) Add `openingHours` to the `BeautySalon` JSON-LD block in `index.html` for richer structured data.
- [ ] (Optional) Replace `assets/logo/logo-cream.png` with an official Bone Cream logo asset when one is available.

## Local preview

Any static-file server works:

```bash
python3 -m http.server 5173
# → http://localhost:5173

# or
npx serve .
```

## DNS / hosting

- Domain `dejustudio.com` is registered with Wix; nameservers are locked to Wix DNS (`ns6/7.wixdns.net`).
- DNS records (managed in Wix DNS panel) point to Netlify:
  - A `@` → `75.2.60.5`
  - CNAME `www` → `dejustudio.netlify.app`
- Netlify holds the custom domain + Let's Encrypt SSL (auto-renews).

## Brand reference

The visual system is documented in `Deju-Studio-Developer-Guide.html` (gitignored, kept locally). Colours, typography and motion are codified in [`css/tokens.css`](css/tokens.css).
