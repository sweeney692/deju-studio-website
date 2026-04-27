# Deju Studio Website

Marketing website for [Deju Studio](https://www.dejustudio.com), an ultra-premium private nail studio in Lodtunduh, Ubud, Bali. Bookings happen exclusively through WhatsApp.

## Stack

- Hand-written HTML5, vanilla CSS, vanilla JS. No framework, no build step.
- Hosted on Netlify, deployed automatically from this GitHub repo on push to `main`.

## File map

```
/
├── index.html, services.html, gallery.html, about.html, contact.html
├── css/        reset, tokens, base, components, pages, motion
├── js/         config (single source of truth), whatsapp, nav, gallery, reveal
├── assets/     img (web-optimised gallery photos), logo (forest + cream variants)
├── scripts/    optimize-images.sh (regenerate web-ready gallery)
├── netlify.toml, robots.txt, sitemap.xml
```

## Editing site-wide details

Almost everything site-wide lives in [`js/config.js`](js/config.js): WhatsApp number, address, hours, map embed URL, Instagram handle, message templates, analytics IDs. Edit that one file and every page updates.

To update the price list, edit [`services.html`](services.html). The menu sections are typeset HTML; price changes are a single character edit.

To regenerate gallery images from a new source folder, edit [`scripts/optimize-images.sh`](scripts/optimize-images.sh) and run `bash scripts/optimize-images.sh`.

## Open items before launch

- [ ] Replace `js/config.js` placeholder analytics IDs with real Google Analytics (`G-...`) and Google Ads (`AW-...`) IDs.
- [ ] Replace the map iframe `src` in `contact.html` with the precise embed URL from Google Maps -> Share -> Embed a map.
- [ ] Confirm exact opening hours and update `js/config.js` and the footer in each HTML file.
- [ ] Wire up the live Google Reviews widget (Elfsight or equivalent) in the `.reviews-mount` containers on `index.html` and `contact.html`.
- [ ] Replace the temporary `assets/logo/logo-cream.png` (recoloured from the Forest variant) with an official Bone Cream logo asset when available.

## Local preview

Any static-file server works. Two simple options:

```bash
python3 -m http.server 5173
# → http://localhost:5173

# or
npx serve .
```

## Brand reference

The visual system is documented in `Deju-Studio-Developer-Guide.html` (kept outside the repo). Colours, typography and motion are codified in [`css/tokens.css`](css/tokens.css).
