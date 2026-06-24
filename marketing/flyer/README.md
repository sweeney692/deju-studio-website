# Deju flyers

Promotional and campaign flyers built on the Deju brand system (Bone Cream /
Forest Green, Fraunces + Inter), exported for Instagram, Facebook, WhatsApp, and
print. Same convention as the [tabletents](../tabletent/): hand-written HTML
templates -> a Python data-URI inliner -> Chrome headless export. No build tools,
no npm.

## Campaigns

| Campaign | Templates | Status |
|---|---|---|
| **Mani + Pedi / Refer-a-Friend promo** | `build/promo-editorial-*.html` | Current. Editorial direction only. |
| **Press On Nails Workshop** | `build/editorial-*.html`, `build/photographic-*.html` | Shipped 2026-06-13. |
| **Nail Artist hiring** | `build/hiring-editorial-*.html` | Shipped 2026-06-23, design refreshed same day. Drives to `dejustudio.com/careers` via a written link CTA (no QR). The four vertical placements (A4, Story, IG, FB) share one vertical-stack layout: logo → centered nail photo → "Nail Artist" headline → "What you bring / What we offer" columns → centered green footer with a cream gap. Story reserves a clear band + "Apply at the link" cue for an Instagram link sticker. A fifth **1.91:1 landscape** (`build/hiring-editorial-landscape.html` → `Deju - Hiring - Editorial - Landscape 1200x628.png`, added 2026-06-24) reflows the same content horizontally (photo+logo left, copy right, green CTA bar) for Meta's landscape slot - note for Instagram feed the portrait 1080x1350 is still stronger. Photo is `build/assets/hiring-1-centered.jpg` (square centered crop of `hiring-1.jpg`); raw sources in `_source/Hiring/`. Campaign + backend in `marketing/hiring-campaign/`. |

The promo's **Bold** direction was tried and retired (squashed nails, busy
background); its files are kept locally in `_archive/` (gitignored), not in the repo.

## The promo (current)

One combined offer, presented as **either/or**:

- **The Mani & Pedi** - book a manicure + pedicure together, 10% off the pair.
- **or Refer a Friend** - introduce a friend, you both get 10% off your next visit.

Open-ended (no expiry). Address: Jl. Tirta Tawar, Petulu, Ubud. Built in four
placements, all Editorial:

| File (in this folder) | Size | Use |
|---|---|---|
| `Deju - Promo - Editorial - Story.png` / `.pdf` | 1080x1920 | IG/FB Story + WhatsApp Status. Has a reserved "Book on WhatsApp" zone for Desty's IG link sticker. |
| `Deju - Promo - Editorial - Instagram Ad 1080x1350.png` | 1080x1350 (4:5) | Instagram feed/ad |
| `Deju - Promo - Editorial - Facebook Ad 1080x1080.png` | 1080x1080 (1:1) | Facebook feed/ad |
| `Deju - Promo - Editorial - A4 WhatsApp.pdf` / `.png` | 210x297mm (A4) | WhatsApp (PDF as document/print, PNG as shared image) |

## Rebuild

```bash
cd marketing/flyer
bash build/build.sh
```

`build/build.sh` inlines every template's `{{asset:...}}` placeholders into a
standalone `*.inlined.html` (via `build/inline.py`), then exports PNGs (Chrome
`--screenshot`) and PDFs (Chrome `--print-to-pdf`) into this folder. The
`*.inlined.html` files are generated intermediates (gitignored).

To add a new size, copy the closest `promo-editorial-*.html`, set its `@page` /
`width` / `height`, re-flow, and add an export line to `build.sh`.

## Non-negotiable rules (the nail art is the product)

1. **Every nail must be fully visible** - never cover the painted nails with
   text, panels, or badges. Hands/feet can be cropped; nails cannot. Keep the
   photo frame at the source image's true aspect (the promo photo is 4:3, so its
   frames are 4:3 and the whole image shows).
2. **No CSS `filter` over the nail art** - no saturate/contrast/brightness, no
   colour grading. Filters elsewhere (a frame `drop-shadow`, decorative
   elements) are fine; the nail image renders true colour.
3. **House style:** no em dashes, no emoji, no exclamation marks.

## Print gotchas (verify the PDF, not just the PNG)

- Chrome print-to-PDF turns `box-shadow`/`text-shadow` into hard rectangles. Use
  `filter: drop-shadow()` or solid-fill panels instead.
- macOS Quartz viewers (Preview, WhatsApp) and poppler render PDFs differently -
  check the actual PDF, e.g. `qlmanage -t -s 2000 -o /tmp "<file>.pdf"`.
- Inverted (light-on-dark) QR codes can scan in a PNG but fail in the PDF. Use
  dark-on-light QRs.

## Folders

```
flyer/
├── build/                  Source of truth
│   ├── *.html              Templates ({{asset:...}} placeholders)
│   ├── inline.py           Inlines assets to base64 data URIs
│   ├── build.sh            Inline + export all flyers
│   └── assets/             Logos (incl. trimmed logo-forest-trim.png), QRs, photos
├── Deju - Promo - ...      Final exported promo flyers (committed)
├── Deju - Workshop ...     Final exported workshop flyers (committed)
├── _source/                Raw photos, inspiration refs, drafts (LOCAL ONLY, gitignored)
└── _archive/               Retired directions e.g. Bold (LOCAL ONLY, gitignored)
```

The raw promo photo (`_source/Mani Pedi Promo Pic.JPG`) is resized into
`build/assets/mani-pedi.jpg`, which is what the templates load.
