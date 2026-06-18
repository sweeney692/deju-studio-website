# 2026-06-18 - Hours change, card surcharge, Mani+Pedi promo flyers, marketing reorg

Session covering a small site content change, a payment disclosure, a new
promotional flyer suite, and a tidy-up/commit of the `marketing/` tree.

## 1. Studio hours -> Sunday to Friday (Saturday now closed)

Saturday became Desty's day off; Sunday opened. Updated every place the open
days appear, all in one commit (`6605639`):

- `BeautySalon` JSON-LD `openingHoursSpecification` (dropped Saturday, added Sunday)
- Both visible Hours blocks in `index.html` (`#visit` + closing area)
- `js/config.js` `hours` array
- `llms.txt` + `llms-full.txt`

Bookable window unchanged (10:00-21:00). No FAQ answer names specific days, so the
FAQ byte-match invariant was unaffected. Deployed and verified ready on Netlify.

**Still open (user):** the Google Ads ad-schedule should move to **Sun-Fri** to
match - but only once the campaign exits bid-strategy learning (schedule edits
reset learning). GBP hours were to be set in the UI by Conor (Saturday closed,
Sunday 10:00-21:00).

## 2. Card payments carry a 3% surcharge (disclosed)

The payment FAQ implied card was free. Commit `879eec5` added "Card payments
carry a 3% surcharge." to the visible `#faq` answer AND the byte-identical
`FAQPage` JSON-LD answer (verified equal), plus `llms.txt` / `llms-full.txt`. The
schema `paymentAccepted` property (a plain method list) was left as-is. Deployed.

## 3. Mani + Pedi / Refer-a-Friend promo flyers

**Strategy.** Researched premium-salon promo tactics for Deju's two audiences
(95% tourists / 5% high-income Ubud residents). Principle: for an ultra-premium
brand, lead with value-adds, not headline discounts. After discussion Conor chose
a single combined promo presented as **either/or**:

- **The Mani & Pedi** - book a manicure + pedicure together, **10% off** the pair.
- **or Refer a Friend** - introduce a friend, **you both get 10% off** your next
  appointment.

Open-ended (no expiry). "One offer per visit · By appointment." Address:
Jl. Tirta Tawar, Petulu, Ubud. The "10% off" is kept subordinate in the hierarchy
so it reads as an invitation, not a coupon.

**Design.** Editorial direction only (Bone Cream / Forest Green, Fraunces + Inter),
built on the same pipeline as the tabletents and workshop flyer
(`build/*.html` -> `inline.py` -> `build.sh` Chrome export). A **Bold** full-bleed
direction was tried and retired (squashed nails, busy red-textile background); it
lives in gitignored `_archive/`.

**Photo.** `_source/Mani Pedi Promo Pic.JPG` (hands + feet, mani + pedi), resized
to `build/assets/mani-pedi.jpg`.

**Four placements** (all in `marketing/flyer/`):

| File | Size | Use |
|---|---|---|
| `Deju - Promo - Editorial - Story.png` / `.pdf` | 1080x1920 | IG/FB Story + WhatsApp Status |
| `Deju - Promo - Editorial - Instagram Ad 1080x1350.png` | 1080x1350 (4:5) | Instagram feed/ad |
| `Deju - Promo - Editorial - Facebook Ad 1080x1080.png` | 1080x1080 (1:1) | Facebook feed/ad |
| `Deju - Promo - Editorial - A4 WhatsApp.pdf` / `.png` | 210x297mm | WhatsApp doc/print + image |

Layout details that took iteration:

- **Offers side by side** (two columns + a vertical "or" divider, terms centered
  below) on every format - this is the layout Conor preferred.
- **Story link space:** the Story reserves a "Book on WhatsApp" cue + clear band
  in the lower-middle so Desty can drop an Instagram link sticker (her WhatsApp
  booking link) without covering anything. Ads don't need this (link is set in
  Meta Ads Manager).
- **No QR** on these (removed - the link is added at post/ad time).

**Two hard rules established (now global, in memory + `marketing/flyer/README.md`
+ CLAUDE.md):**

1. **Every painted nail must stay fully visible** - never cover nails with text or
   panels. A regression where the enlarged logo had pushed the photo frames
   wider-than-4:3 (cropping top fingernails + bottom toenails) was fixed by
   restoring each frame to the photo's **true 4:3 ratio** so the whole image shows.
2. **No CSS `filter` over the nail art** (no saturate/contrast/colour-grade) - the
   nails must render true colour. Filters elsewhere (frame drop-shadow) are fine.

Also: the brand logo PNG is a 700x700 square with the wordmark filling only ~35%
of the height. Trimming it to its content bbox (`build/assets/logo-forest-trim.png`,
528x248) reclaimed the wasted vertical space, letting the logo be prominent
without crushing the photo. Logo size was bumped then reverted at Conor's request
(the smaller, well-distributed version was preferred).

## 4. Marketing folder reorg + housekeeping

- Moved `tabletent/` -> `marketing/tabletent/` so all off-site collateral lives
  under `marketing/` (alongside `flyer/`). Fixed the relative path references in
  `marketing/tabletent/README.md` and updated `README.md` + `CLAUDE.md`.
- Tidied `marketing/flyer/`: raw photos, inspiration refs, and the
  `Salinan dari MENU COURSE.pdf` draft moved into gitignored `_source/`; retired
  Bold direction in gitignored `_archive/`; `.DS_Store` files removed.
- `.gitignore`: added `marketing/flyer/_source/`, `_archive/`, and
  `build/*.inlined.html` (generated intermediates). The build pipeline, assets,
  and final exported flyers ARE committed.
- New `marketing/flyer/README.md` documents the build system, campaigns, formats,
  nail-art rules, and print gotchas.
- Refreshed `README.md` (file map + tabletent paths) and `CLAUDE.md` (current
  state, next steps, resume, things-to-avoid).

## How to rebuild the flyers

```bash
cd marketing/flyer
bash build/build.sh
```

Always verify the exported **PDF**, not just the PNG (macOS Quartz/Preview can
render differently from poppler). See `marketing/flyer/README.md`.
