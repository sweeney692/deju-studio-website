# Padma Warung tabletent + partner-attribution flow

**Date:** 2026-05-04
**Branch:** `claude/infallible-shtern-9bf3a8`
**Driver:** Conor

## What we built

A printed table tent for Padma Warung (first partner restaurant in Ubud)
that sits on tables and points diners at Deju Studio via two QR codes -
one for booking on WhatsApp, one for the studio's Instagram gallery. The
booking QR is wired so we can attribute every WhatsApp inquiry back to
Padma Warung and pay commission.

## How attribution works (end-to-end)

1. The booking QR encodes
   `https://www.dejustudio.com/?ref=padma-warung&utm_source=padma-warung&utm_medium=qr&utm_campaign=tabletent`.
2. On landing, [js/whatsapp.js](../js/whatsapp.js) reads the `?ref` param
   and persists it to `sessionStorage.dejuRef` so it survives in-page
   anchor navigation (`#services`, `#visit`, etc).
3. On every WhatsApp CTA click, if a partner ref is set, the message
   body uses the **generic** template (not the per-service one) plus
   ` (Sent from Padma Warung)` on the same line. So in WhatsApp the
   studio sees a single recognisable opener for all partner traffic.
4. GA4 also auto-captures the `utm_*` params, so the same traffic shows
   up under `source = padma-warung` in Acquisition reports.
5. Visitors with no `?ref=` get the original per-service templates,
   unchanged. (Verified with a regression test.)

The slug-to-display-name map lives in
[js/config.js](../js/config.js) under `partnerNames`. Adding a new
partner is one config line plus a duplicated HTML file.

## Print artwork

Tri-fold prism, three A6 panels:

1. **Hero** - Forest logo + "More than a manicure, designs made for you."
2. **Gallery** - "Check out our gallery on Instagram" eyebrow, Instagram
   QR, `@dejustudio` handle, "From minimalist to 4D." footer.
3. **Scan** - "Book on WhatsApp" eyebrow, booking QR (with the `?ref=`
   link), `dejustudio.com`, "Hosted by Padma Warung" at the foot.

Sheet: 331 mm x 154 mm (3 A6 panels + 10 mm glue tab + 3 mm bleed).
Forest #1E5128 ink on Bone Cream #F2EBDD card. Both QRs are level Q
(25% error correction) so they tolerate smudges.

The HTML file at [tabletent/padma-warung.html](../tabletent/padma-warung.html)
inlines the logo and both QR codes as `data:` URIs - it renders fully
standalone (under `file://`, in print preview, anywhere) without needing
the assets folder alongside it.

## Files touched

**Modified:**

- `js/config.js` - added `partnerNames` map.
- `js/whatsapp.js` - reads `?ref`, persists, overrides template, appends
  `(Sent from <Partner>)` for partner sessions.
- `.gitignore` - added `POS Materials/`.
- `CLAUDE.md` - documented partner-attribution flow + tabletent in
  Current state, Architecture conventions, Where to pick up next, and
  Things to avoid.
- `README.md` - added Partner-attribution table tents section + folder
  references.

**New:**

- `tabletent/padma-warung.html` - print artwork (with inlined data URIs).
- `tabletent/README.md` - print specs, partner-onboarding flow, exporter
  instructions.
- `assets/img/qr-padma-warung.svg` - booking QR (Forest on Bone Cream).
- `assets/img/qr-instagram-dejustudio.svg` - Instagram QR (shared across
  all partners).
- `Summaries/2026-05-04-padma-warung-tabletent.md` - this file.

**Outside the repo (gitignored):**

- `POS Materials/Deju Studio - Tabletent for Padma Warung.html`
- `POS Materials/Deju Studio - Tabletent for Padma Warung.pdf` (needs
  re-export after the latest copy edits).

## Verification done

- Node-mocked the WhatsApp builder with `?ref=padma-warung` -> message
  produced was exactly
  `Hi Deju, I'd like to book an appointment. Could you share availability? (Sent from Padma Warung)`.
- Regression-checked no-ref path -> original per-service template, no tag.

## Verification still owed (user-side)

- Re-export the print PDF from the current HTML (Chrome -> Print ->
  Save as PDF, Custom 331x154 mm, margins None, background graphics
  On). Overwrite the existing PDF in `POS Materials/`.
- Print one draft on plain paper, scan both QRs to catch any URL typo
  before paying for card stock.
- Confirm with the print shop that they will trim to 325x148 mm with
  3 mm bleed and score-and-fold at the three vertical fold lines.

## Next partner

When a new partner signs (e.g. Villa Rumi):

1. Add `'villa-rumi': 'Villa Rumi'` to `partnerNames` in
   `js/config.js`.
2. Generate a QR with `qrencode` (Forest on Bone Cream, level Q).
3. Duplicate `padma-warung.html` -> `villa-rumi.html`, re-inline the
   booking QR, find/replace the slug + display name.
4. Test locally with `?ref=villa-rumi`.
5. Export PDF to `POS Materials/`.

Full step-by-step in [tabletent/README.md](../tabletent/README.md).
