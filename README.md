# Deju Studio Website

Marketing website for [Deju Studio](https://www.dejustudio.com), an ultra-premium private nail studio in Ubud, Bali. Bookings happen exclusively through WhatsApp.

## Live

- Production: https://www.dejustudio.com (and https://dejustudio.com)
- Netlify project: `dejustudio` (auto-deploys from `main`)

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
│   ├── whatsapp.js             Wires every [data-wa] CTA to a pre-filled wa.me link
│   ├── analytics.js            GA4 + Google Ads loader (no-op while IDs are placeholders)
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
└── CLAUDE.md                   Project context for AI assistants
```

## Editing site-wide details

Almost everything site-wide lives in [`js/config.js`](js/config.js): WhatsApp number, message templates per service, analytics IDs.

To update copy or prices, edit [`index.html`](index.html) directly. The price list lives in the `#services` section (services carousel). Address, hours, and map embed are also currently hardcoded in `index.html` (see "Open items" below).

To regenerate gallery images from a new source folder, run `bash scripts/optimize-images.sh` (requires ImageMagick `magick` CLI). Source filenames are listed in the script.

## Open items before launch

- [ ] Replace `js/config.js` placeholder analytics IDs with real Google Analytics (`G-...`) and Google Ads (`AW-...` + conversion label) IDs.
- [ ] Resolve address inconsistency: `index.html` says "Jl. Tirta Tawar, Petulu, 80571"; `js/config.js` says "Gn. Abang Street, Lodtunduh, 80582". Pick the canonical address and update everywhere (schema.org JSON-LD, footer, contact section, map iframe, Open in Maps link).
- [ ] Confirm exact opening hours and update the footer + `#visit` section in `index.html`.
- [ ] (Optional) Replace the temporary `assets/logo/logo-cream.png` with an official Bone Cream logo asset when available.
- [ ] (Optional) Wire the unused `address` / `hours` / `mapEmbedSrc` fields in `js/config.js` to the page so the address lives in one place.

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
