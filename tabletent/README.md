# Tabletent print artwork

Print-ready artwork for partner-restaurant table tents. Each partner gets one
HTML file in this directory. The booking QR embedded in each file points the
diner to the website with a unique `ref` slug so we can attribute WhatsApp
inquiries back to the partner and pay commission.

## Current partners

| Partner | Slug | Artwork | Booking QR target | Source |
|---|---|---|---|---|
| Padma Warung | `padma-warung` | [padma-warung.html](padma-warung.html) | `https://www.dejustudio.com/?ref=padma-warung&utm_source=padma-warung&utm_medium=qr&utm_campaign=tabletent` | Live since 2026-05-04 |

The exported print PDF for each partner lives in `POS Materials/` at the main
repo root (gitignored). Filename pattern: `Deju Studio - Tabletent for <Partner>.pdf`.

## Layout (current design)

Tri-fold prism, three A6 panels read in order:

1. **Hero** - Forest logo + "More than a manicure, designs made for you." +
   "Scan inside ›" eyebrow.
2. **Gallery** - "Check out our gallery on Instagram" eyebrow, Instagram QR
   (links to `instagram.com/dejustudio`), `@dejustudio` handle, "From minimalist
   to 4D." footer eyebrow.
3. **Scan** - "Book on WhatsApp" eyebrow, booking QR (the `?ref=` link),
   `dejustudio.com` URL, "Open your camera. Tap the link. We'll meet you on
   WhatsApp." instruction, and a "Hosted by <Partner>" line at the foot.

Both QRs and the logo are inlined as `data:` URIs inside the HTML so the file
renders standalone (under `file://`, in print preview, and outside the repo).
Don't strip them out.

## Format

- **Shape:** triangular prism table tent (3 panels + glue tab)
- **Panels:** A6, 105 mm x 148 mm each
- **Sheet:** 325 mm x 148 mm trim, +3 mm bleed all round = **331 mm x 154 mm finished**
- **Glue tab:** 10 mm strip on the right edge of the flat sheet
- **Folds:** at 105 mm, 210 mm, 315 mm (measuring from the inner trim edge)

## Exporting the print PDF

1. Open the partner's HTML file in **Chrome** (Safari is unreliable for custom
   mm page sizes).
2. **File - Print** (Cmd+P).
3. Page size: **Custom**, set to **331 mm x 154 mm**.
4. Margins: **None**.
5. **Background graphics: On** (so the Bone Cream paint is preserved).
6. **Save as PDF** into `POS Materials/` at the main repo root, overwriting the
   previous export. Filename: `Deju Studio - Tabletent for <Partner>.pdf`.

Verify in Preview.app: Tools - Show Inspector - the page size should read
**331 x 154 mm exactly**. If it's off, the panels won't fold correctly.

## Sending to a Bali print shop

Specs to give the printer:

- **Stock:** 300-350 gsm uncoated card. Matte finish. (Coated/glossy fights the
  Bone Cream warmth.)
- **Print:** full colour, single-sided.
- **Bleed:** 3 mm included in the file.
- **Trim:** to 325 x 148 mm.
- **Score and fold:** on the three vertical fold lines, then glue the 10 mm tab
  inside the back panel to form the prism.
- **Quantity:** ask for at least 5 spares (kitchens spill).

The exported PDF is RGB. Most local print shops convert RGB to CMYK in their
RIP. If they request CMYK, run a one-shot conversion with Ghostscript:

```bash
gs -dSAFER -dBATCH -dNOPAUSE \
   -sDEVICE=pdfwrite \
   -sColorConversionStrategy=CMYK \
   -dProcessColorModel=/DeviceCMYK \
   -sOutputFile="Deju Studio - Tabletent for Padma Warung - CMYK.pdf" \
   "Deju Studio - Tabletent for Padma Warung.pdf"
```

## Adding a new partner

1. Pick a slug (lowercase, hyphenated, no spaces): `villa-rumi`, `warung-bodag`, etc.
2. Add it to `partnerNames` in [../js/config.js](../js/config.js):
   ```js
   partnerNames: {
     'padma-warung': 'Padma Warung',
     'villa-rumi':   'Villa Rumi',
   }
   ```
3. Generate the booking QR (Forest on Bone Cream, error-correction Q):
   ```bash
   qrencode -o assets/img/qr-villa-rumi.svg -t SVG -l Q -m 2 \
     --foreground=1E5128 --background=F2EBDD \
     "https://www.dejustudio.com/?ref=villa-rumi&utm_source=villa-rumi&utm_medium=qr&utm_campaign=tabletent"
   ```
   The Instagram QR is shared across all partners and lives at
   `assets/img/qr-instagram-dejustudio.svg`. No need to regenerate it.
4. Duplicate `padma-warung.html` to `villa-rumi.html`, then re-inline the new
   booking QR + logo with this Python helper from the repo root:
   ```bash
   python3 - <<'PY'
   import base64, pathlib
   slug = "villa-rumi"
   logo = pathlib.Path("assets/logo/logo-forest.png").read_bytes()
   booking_qr = pathlib.Path(f"assets/img/qr-{slug}.svg").read_bytes()
   ig_qr      = pathlib.Path("assets/img/qr-instagram-dejustudio.svg").read_bytes()
   logo_uri    = "data:image/png;base64," + base64.b64encode(logo).decode()
   booking_uri = "data:image/svg+xml;base64," + base64.b64encode(booking_qr).decode()
   ig_uri      = "data:image/svg+xml;base64," + base64.b64encode(ig_qr).decode()
   p = pathlib.Path(f"tabletent/{slug}.html")
   html = pathlib.Path("tabletent/padma-warung.html").read_text()
   # Replace the three data URIs in the source by re-inlining from disk
   # (or text-find the existing data: prefixes and swap). Then replace
   # 'Padma Warung' -> 'Villa Rumi' and 'padma-warung' -> 'villa-rumi'.
   p.write_text(html)
   PY
   ```
5. Test locally before printing (see Verification below).
6. Export the print PDF as above into `POS Materials/`.

## Verification

Before sending to print:

1. **WhatsApp tag wiring:** start `python3 -m http.server 5173` from the repo
   root, open `http://localhost:5173/?ref=<slug>`, click any WhatsApp CTA. The
   pre-filled WhatsApp message should be the **generic** template plus
   ` (Sent from <Partner>)` on the same line. (Service-specific templates do
   *not* fire when a partner ref is set - the studio sees a single recognisable
   opener for all partner traffic.)
2. **Persistence:** with `?ref=<slug>` in the URL, click an in-page anchor
   (e.g. Services). After the URL strips back to no params, click WhatsApp -
   tag should still be there.
3. **No-ref fallback:** open `http://localhost:5173/` with no params. WhatsApp
   messages should be the per-service templates with no trailing tag
   (regression check).
4. **Both QRs scan:** print one draft on plain paper. Scan the booking QR with
   a phone from ~50 cm - should land on the site with the right ref. Scan the
   Instagram QR - should open `instagram.com/dejustudio`.
5. **PDF dimensions:** open the exported PDF in Preview.app and confirm
   **331 x 154 mm**.

## Why this design

- **Forest on Bone Cream:** the brand's calmer daytime palette. Reads as part of
  the studio rather than as a flyer competing with restaurant decor.
- **High-correction QR (level Q):** still scannable if the card gets smudged or
  partly occluded by glassware.
- **Generic message for partner traffic:** when the studio sees
  `(Sent from <Partner>)` they know it's a partner inquiry without having to
  parse a specific service template. Easier reconciliation for commission.
- **No prices on the tent:** keeps it ageless. Pricing changes don't make the
  tent stale.
- **No exclamation marks, no emoji, no em dashes:** house style.
