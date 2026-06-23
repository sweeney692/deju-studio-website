# Hiring flyer revisions - layout refresh, QR removed, unified Facebook design

Date: 2026-06-23. A follow-up to the [hiring campaign build](2026-06-23-hiring-campaign.md) the same day. The four hiring flyer templates were revised for a cleaner, more consistent editorial look, the QR code was dropped in favour of a written/link CTA, and the Facebook placement was rebuilt to match the others. Plus repo housekeeping.

## What changed (design)

Applied across all four templates in `marketing/flyer/build/hiring-editorial-{a4,ig,story,fb}.html`, then re-exported via the usual inline → Chrome pipeline:

1. **Headline moved below the photo.** "Nail Artist / join our private studio" now sits between the image and the two requirement columns (was above the image).
2. **Cream gap under the footer.** Added bottom padding to `.sheet` (A4 11mm, IG 44px, Story 52px, FB 40px) so the green CTA box floats clear of the bottom edge instead of bleeding to it.
3. **Story link-sticker zone.** The Story gets an italic "Apply at the link" cue + down-arrow above a reserved clear cream band, so Desty can drop an Instagram link sticker to the careers page before posting (same convention as the promo story).
4. **QR removed from all four.** The green footer is now a centered single-column CTA ("Apply online / dejustudio.com/careers / Visit the link to apply..."). The `qr-hiring.png` asset is gone.
5. **Requirement columns +25%.** Both the "What you bring" / "What we offer" headings and bullets were enlarged ~25% (e.g. Story 34→43px headings, 23→29px bullets), with bullet markers and indents scaled to match.
6. **Nail art centered.** New square crop `build/assets/hiring-1-centered.jpg` (cropped from `hiring-1.jpg`) centers the lotus + gem nails in the blob; all four templates load it at `object-position:50% 50%`. Every painted nail stays fully visible; no filter on the image.

**Facebook rebuilt.** `hiring-editorial-fb.html` was a side-by-side (photo left, text right) layout. It is now the same vertical stack as the others (centered logo → photo → headline → two columns → centered footer), compressed to fit the 1080×1080 square. All four placements now share one design.

## Housekeeping

- **Removed orphaned build assets:** `build/assets/hiring-2.jpg` (only used by the old side-by-side FB) and `build/assets/qr-hiring.png` (QR dropped). `git rm`'d.
- **Raw hiring photos** (`New Hire Photo*.JPG`, reference/inspiration PNGs) moved from `marketing/flyer/Hiring/` into the gitignored `marketing/flyer/_source/Hiring/`, matching the established `_source/` convention. `Hiring/` removed from the tracked tree.
- **Removed `marketing/flyer/Promotion/`** - it held 12 byte-for-byte duplicates of promo + workshop finals that already live (committed) at the `marketing/flyer/` root.
- `build/assets/hiring-1.jpg` is **kept** as the uncropped parent of the centered crop (re-crop source).

## Not touched

- `business-expansion/` (separate workstream, untracked) was deliberately left **uncommitted**. Tell me if you want it in the repo.
- Promo, workshop, and tabletent collateral were not rebuilt.

## Final deliverables (all in `marketing/flyer/`)

- `Deju - Hiring - Editorial - A4.pdf` / `.png`
- `Deju - Hiring - Editorial - Story.pdf` / `.png`
- `Deju - Hiring - Editorial - Instagram 1080x1350.png`
- `Deju - Hiring - Editorial - Facebook 1080x1080.png`

## Resume / rebuild

```bash
cd marketing/flyer && bash build/build.sh   # rebuilds every flyer
```

To rebuild only the hiring set, inline + export the four `hiring-editorial-*` templates (see the `hiring-editorial-*` lines at the bottom of `build/build.sh`). Always verify the exported **PDF** (`qlmanage -t -s 1400 -o /tmp "<file>.pdf"`), not just the PNG. To re-center or re-crop the photo, edit `build/assets/hiring-1-centered.jpg` from `hiring-1.jpg` (or the raw `_source/Hiring/New Hire Photo.JPG`).
