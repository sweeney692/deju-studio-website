# Press On Nails Workshop flyer (Editorial + Bold directions)

**Date:** 2026-06-13
**Branch:** `main`
**Driver:** Conor

## What we built

A promotional flyer for Desty's **Press On Nails Workshop** (one day, four
hours, 450.000 IDR), redesigned from a flat first-draft PDF into two polished
design directions, each in two formats, all built on the Deju brand system
(Forest/Bone-Cream palette, Fraunces + Inter type). Source of the draft +
inspiration: `marketing/flyer/Salinan dari MENU COURSE.pdf` and
`marketing/flyer/Inspiration/`.

### Deliverables (in `marketing/flyer/`)

| File | Format | Notes |
|---|---|---|
| `Deju - Workshop Flyer - Editorial - A4.pdf` | 210x297mm print | Bone-cream, gallery tiles of nail sets |
| `Deju - Workshop Flyer - Editorial - Story.png/.pdf` | 1080x1920 | same, vertical |
| `Deju - Workshop Flyer - Bold - A4.pdf` | 210x297mm print | Dark photographic, the heavily-iterated one |
| `Deju - Workshop Flyer - Bold - Story.png/.pdf` | 1080x1920 | mirrors the Bold A4 layout |

The **Bold** direction is the one Conor iterated on extensively and is the
current favourite. The **Editorial** direction was left at its initial build
(its own distinct bone-cream look) by choice.

## Build pipeline (`marketing/flyer/build/`)

No build step on the live site - this is a standalone, reproducible artwork
pipeline that mirrors the tabletent convention.

- **4 source templates:** `editorial-a4.html`, `editorial-story.html`,
  `photographic-a4.html` (Bold A4), `photographic-story.html` (Bold story).
- **`inline.py`** - replaces `{{asset:<name>}}` placeholders with base64
  `data:` URIs from `build/assets/`, producing standalone `*.inlined.html`.
- **`build.sh`** - inlines all four, then exports every deliverable via
  Chrome headless. Re-run it to rebuild everything:
  `bash build/build.sh` from `marketing/flyer/`.
- **`build/assets/`** - resized product photos (`p-*.jpg`), trimmed cream
  logo (`logo-cream-trim.png`), QR codes (`qr-forest.png` = dark-on-light,
  `qr-cream.png` = inverted), generated via `qrencode` + `sips`.

### Export commands (inside build.sh)

- **A4 PDF:** `chrome --headless --print-to-pdf=... file://...-a4.inlined.html`
  (respects `@page { size:A4 }`).
- **Story PNG:** `chrome --headless --screenshot --window-size=1080,1920 ...`
- **Story PDF:** `--print-to-pdf` with `@page { size:1080px 1920px }`.

## Gotchas discovered (important - these bit us repeatedly)

1. **Chrome print-to-PDF renders `box-shadow` AND `text-shadow` as hard
   rectangles.** Soft blurred shadows look fine on screen / in PNG
   screenshots but become solid dark boxes in the PDF print path. Fixes:
   the editorial gallery tiles use `filter: drop-shadow()` (traces the blob
   shape); the Bold panel/lead had their text-shadows removed and replaced
   with a single solid-fill panel + a darker scrim for contrast.
2. **The "black background" product photos are actually transparent PNGs**
   flattened to white by `sips` - they're bright catalog shots, not moody.
   Text over them needs a strong scrim (see the Bold `.scrim` gradient:
   dark at top for the hero, clear in the middle for the nails, dark at the
   bottom for the panel + footer).
3. **Inverted QR codes (`qr-cream`, light-on-dark) scan in the PNG but FAIL
   in the PDF** - the print path resamples the small modules and they fall
   apart. Always use the standard dark-on-light `qr-forest.png`.
4. **The logo PNG has transparent padding** baked in, so it looked indented.
   `logo-cream-trim.png` is the bounding-box-cropped version for true
   flush-left alignment.
5. **`sips --cropOffset` is unreliable** for QA crops - use Python PIL
   (`Image.crop`) instead. To check the real PDF (not just on-screen),
   rasterise it: `qlmanage -t -s 1600 -o <dir> "<file>.pdf"`.

## Bold flyer layout (final, approved)

Hero text top-left (eyebrow / "Press On Nails *Workshop*" / lead / "Led by
Desty" / trimmed cream logo flush-left), circular price badge top-right
beside the headline, full-bleed nail photo through the middle, a tightened
dark "What you will take home" panel, and a footer with reservation details
+ a centred QR. The Bold story (1080x1920) mirrors this with +25% text.

## Where to pick up next

1. **Bold A4 QR fix (recommended, pending Conor's OK).** `photographic-a4.html`
   still uses the inverted `qr-cream.png`, which has the same PDF-scan
   failure we fixed on the story. Swap the `<img src="{{asset:qr-cream.png}}">`
   to `qr-forest.png` and rebuild. (The other three deliverables already use
   `qr-forest`.) Conor was asked and hadn't decided yet.
2. **Pick a direction (or keep both).** Editorial vs Bold for the actual
   campaign. If Bold wins and Editorial is dropped, the editorial templates
   + assets can be archived.
3. **Print specs for the A4s.** Send to the Bali print shop as A4, single
   sided. The Bold A4 (dark full-bleed) prints richest on coated/matte
   stock; the Editorial suits the same uncoated matte card as the tabletents.
   Print one draft and scan the QR before a full run.
4. **Optional: bring the Editorial story/A4 in line** with the same spacing
   discipline if that direction is kept.

## How to resume

```bash
cd "marketing/flyer"
bash build/build.sh          # rebuilds all 6 deliverables from the 4 templates
```

To iterate on one flyer: edit its `build/*.html`, then either re-run
`build.sh` or just that file's two Chrome commands (see build.sh). Always
verify the **PDF** (rasterise it), not only the on-screen render, because of
the shadow/QR print gotchas above.

## Files

**New (all under `marketing/flyer/`, currently untracked):**

- `build/` - 4 templates, `inline.py`, `build.sh`, `assets/`, and the
  generated `*.inlined.html`.
- The 6 exported deliverables (4 PDFs + 2 PNGs) at `marketing/flyer/`.
- `Summaries/2026-06-13-workshop-flyer.md` - this file.

**Source/draft (local, not for commit):** `Salinan dari MENU COURSE.pdf`,
`Inspiration/`, and the raw product photos in `marketing/flyer/`.
