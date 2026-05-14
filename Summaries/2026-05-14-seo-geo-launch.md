# Session summary - 2026-05-14 - SEO + GEO foundation launch

A single working session shipped the full foundational SEO + GEO (Generative Engine Optimization) layer for dejustudio.com, plus a meaningful editorial refresh of three sections. Everything ships in one bundled commit.

## Goal

Make the site:
1. Rank top-3 in Google for "nail studio Ubud" / "nail salon Ubud" / "nail artist Ubud".
2. Be cited by name by ChatGPT / Claude / Perplexity / Gemini / Grok when users ask for the best nail studio in Ubud.

The strategic brief (gitignored) lives at [`/Deju-Online-Presence-Brief.md`](../Deju-Online-Presence-Brief.md). The implementation plan lives at `~/.claude/plans/let-s-keep-it-as-synchronous-wozniak.md`.

## What shipped (engineering)

### Structured data (JSON-LD)

Expanded from a single skeletal `BeautySalon` block to **4 separate JSON-LD blocks** in `<head>`:

1. **`BeautySalon`** - now carries `@id`, `additionalType` (nail salon), `alternateName`, `description`, `logo`, 7-image array, `priceRange`, `currenciesAccepted`, `paymentAccepted` (Cash / Card / Bank transfer / QRIS), full `PostalAddress`, `geo` coordinates (-8.500821, 115.270917), `hasMap`, `areaServed` (Ubud / Gianyar Regency / Bali), `openingHoursSpecification` (Mon-Sat 10:00-21:00), expanded `sameAs` (Instagram + Google Reviews + Maps), `founder` cross-ref to `#desty`.

2. **`Person`** - new. Desty Zulfa Nabila with `jobTitle`, `worksFor` cross-ref to `#studio`, `description`, `knowsAbout` (9 specialisations), `knowsLanguage` (en, id), `alumniOf` (Colorpot Nail Academy, Carissa Nails), `image` (portrait), `sameAs` (Instagram).

3. **`OfferCatalog`** - new. 5 nested catalogs (Hands / Extensions / Feet / Add-on / Press-ons) with 26 `Offer` entries mirroring the visible IDR pricing.

4. **`FAQPage`** - new. 22 questions covering pricing, services, booking, location, trust. **Schema text matches visible HTML byte-for-byte** (Google rich-results eligibility requirement).

### New root-level files

- **`/robots.txt`** - explicit allow for 18 AI/search crawlers (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bytespider, CCBot, cohere-ai, Meta-ExternalAgent, FacebookBot, Diffbot, DuckAssistBot, plus wildcard).
- **`/sitemap.xml`** - now includes `<lastmod>`, `changefreq`, and a Google `image:image` sitemap with descriptive captions for 7 hero/gallery shots.
- **`/llms.txt`** - Markdown summary file for AI crawlers (Jeremy Howard's emerging standard). Includes about, services + indicative pricing, specialisations, key pages index.
- **`/llms-full.txt`** - ~1,800-word Markdown corpus. Studio overview, philosophy, full service menu with descriptions, all 22 FAQs, travel times to nearby landmarks, 3 Google reviews verbatim.

### `<head>` improvements

- Expanded Open Graph: `og:url`, `og:site_name`, `og:locale=en_ID`, `og:image:width/height/alt`.
- Full Twitter Card set (`summary_large_image`).
- `theme-color` (#1E5128 forest), `format-detection`.
- Geo meta tags: `geo.region=ID-BA`, `geo.placename=Ubud`, `geo.position`, `ICBM`.
- Hero image LCP preload (`<link rel="preload" as="image">` for desktop + mobile variants).

### Security + transport headers (`netlify.toml`)

- **`Strict-Transport-Security`** - `max-age=63072000; includeSubDomains; preload` (2 years, eligible for HSTS preload list).
- **`Content-Security-Policy`** - allow-list covering self, googletagmanager, google-analytics, doubleclick, fonts.googleapis/gstatic, maps origins, www.google.com (for the Maps iframe).

### `rel="me"` on Instagram links

Both Instagram anchors (Visit section + footer) carry `rel="me"` for IndieAuth identity verification, increasingly respected by AI crawlers.

## What shipped (visual / editorial)

### `#about` section - merged

Philosophy + Specialisations merged into one section. Single image (milky manicure) in an asymmetric blob shape with subtle shadow. "Book on WhatsApp" CTA below the text column. The old standalone Specialisations section was deleted.

### `#artist` section - new

A new section between the merged About and Services. Side-by-side layout: Desty's portrait (in its own organic blob shape, distinct from the about image) + 3-paragraph bio + a 3-stat credentials row (Founder / 100+ five-star Google reviews / EN · ID fluent consultations). Bio drawn from the Desty Portfolio PDF: covers training at Colorpot and Carissa Nails, signature pairing of Russian manicure + structured gel, range from minimalist to 4D nail art.

### `#services` - description enrichment

The 8 add-on rows (Gel Removal, Callus Removal, Nail Repair, Nail Art Lv. 1-5) gained `menu-item__desc` paragraphs explaining what each tier includes.

### `#gallery` - rebuilt

- All 10 tiles now uniform 1:1 squares (was an asymmetric collage with `--tall` / `--wide` modifiers).
- 4-column scattered grid on desktop, 3 on tablet, 2 on mobile.
- Each tile carries a unique asymmetric `border-radius` blob shape (none identical to each other or to the `#about` / `#artist` images).
- Subtle drop shadow on each tile, deeper on hover.
- Per-tile `translateY` + `rotate` for a deliberate "scattered" feel (stable across reloads, scrubbed on mobile).
- **A "Book on WhatsApp" CTA tile** sits in the centre of row 2, spanning 2 cells, with a button ~1.5x the default size.
- `art-3d-pearl` and `ext-square-chrome` (previously centre row) now sit bottom-right.

### `#visit` section - trimmed

The "Getting here" / "Travel times" block was removed - the same information already lives in the FAQ (Q14-Q17) and `BeautySalon` schema, so removing the visible block doesn't degrade SEO/GEO. Kept: the "Bike and scooter parking..." sentence and "Open in Google Maps" link, both moved to the right column below the embedded map.

### `#faq` section - new

22-question accordion (browser-native `<details>` / `<summary>`, zero JS). Editorial styling: Fraunces summary headers, brass `+` chevron that rotates 45° to `×` when open, thin rules between items, focus-visible outline. All 22 answers match the matching FAQPage JSON-LD byte-for-byte.

### `#book` (closing CTA) + nav

- Added `id="book"` to the closing CTA section.
- Added `id="reviews"` to the reviews section.
- Added an `FAQ` link to the primary nav between `Visit` and `Book on WhatsApp`.

### Hours change (Mon-Sat / Sun closed)

Studio hours updated everywhere:
- Schema `openingHoursSpecification` - now Mon-Sat 10:00-21:00.
- Visit section definition list - "Monday - Saturday: by appointment / Sunday: closed".
- Footer - same.
- `js/config.js` `hours` field (still unused by JS but kept in sync).
- `/llms.txt` and `/llms-full.txt`.
- `CLAUDE.md` and `README.md` notes.

## What needs Desty's review

These FAQ answers were drafted with reasonable defaults. They're shipped but Desty should review (any change = update both visible HTML and matching FAQPage JSON-LD answer text):

1. **Q12 - Do you require a deposit?** Currently says "No deposit is required. Appointments are confirmed directly over WhatsApp." Confirm correct.
2. **Q13 - Cancellation policy?** Currently says "Please give at least 24 hours notice over WhatsApp..." Confirm.
3. **Q19 - Hygiene + sterilisation?** Currently describes metal tool sterilisation, single-use consumables, workstation wipe-down. Confirm or expand with specific equipment (autoclave / UV) if applicable.
4. **Q20 - Products cruelty-free / low-tox?** Currently hedges ("professional brands selected for quality and skin-safety"). Specify brand names if Desty's comfortable, to strengthen the GEO signal.

## Outside the codebase - high-leverage next steps

1. **Google Business Profile** at business.google.com - the single highest-leverage action. Update hours (Mon-Sat / Sunday closed), upload 20+ photos, add the full services menu with prices, seed Q&A from the FAQ, start a review collection ritual.
2. **Submit `sitemap.xml`** in Google Search Console + Bing Webmaster Tools.
3. **Local citations** - identical NAP across Apple Business Connect, TripAdvisor, Honeycombers, Ubud Now & Then, The Bali Bible, NOW! Bali, Fresha / Booksy, Foursquare.
4. **Google Ads** - update ad schedule to Mon-Sat (was Sat-Thu) but hold until campaign exits bid-strategy learning.
5. **Press outreach** to Honeycombers Bali, Ubud Now & Then, The Bali Bible. Offer Desty's signature service in exchange for honest coverage.

## Housekeeping done this session

- Removed orphaned `.gallery-grid` + `.gallery-item__caption` CSS rules (superseded by `.gallery-scatter`).
- Added `POS Materials/` and `summaries/` to `.gitignore`.
- Bumped CLAUDE.md and README.md to reflect new state.

## Housekeeping still outstanding

- A bigger pile of stale CSS classes from the multi-page collapse (commit `f9391fe`) is still in `css/components.css` and `css/pages.css`: `.about-hero`, `.about-hero__media`, `.body-lg`, `.container-narrow`, `.divider-brass`, `.filter-bar`, `.founder-letter`, `.home-pillars`, `.home-services`, `.menu-aftercare`, `.menu-item__book`, `.menu-section`, `.pillar`, `.pillars`, `.service-card*`, `.service-grid`, `.small`, `.stack*`. They're harmless but bloat the stylesheet. Worth a dedicated cleanup PR.
- `js/config.js` dead fields (address, hours, mapEmbedSrc, etc.) still flagged as TODO. CLAUDE.md says "ask before removing".

## Verification done

- All 4 JSON-LD blocks parse as valid JSON.
- FAQPage schema text matches visible HTML byte-for-byte: 0 mismatches across all 22 answers.
- Sitemap.xml is valid XML.
- All 5 files at root (`/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`) serve HTTP 200 from local server.
- Local visual review at every iteration.
- CSP and HSTS will be verified post-deploy (they're Netlify-side headers, not visible from `python -m http.server`).

## Post-deploy verification checklist

After the push lands on Netlify:

- [ ] Wait for `state: "ready"` on the latest deploy in `netlify api listSiteDeploys`.
- [ ] Hard-refresh https://www.dejustudio.com (Cmd+Shift+R) and click through every section.
- [ ] Click a WhatsApp CTA, DevTools Network tab should show gtag/js, collect, googleads requests fire.
- [ ] Paste https://www.dejustudio.com into Google's Rich Results Test - expect BeautySalon, Person, FAQPage, OfferCatalog detected with 0 errors.
- [ ] Run https://securityheaders.com on the live URL - expect grade A or A+.
- [ ] Curl https://www.dejustudio.com/llms.txt and https://www.dejustudio.com/llms-full.txt - both should return 200 with Markdown.
- [ ] Lighthouse mobile audit - LCP < 2.5s, SEO 100, Best Practices 100.
