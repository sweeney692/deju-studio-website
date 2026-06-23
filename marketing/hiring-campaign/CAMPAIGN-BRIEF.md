# Deju Studio - Nail Artist Hiring Campaign

Meta (Instagram + Facebook) ad campaign to hire 3 nail artists. Budget: **1,000,000 IDR**.
Created 2026-06-23. Channel: Instagram + Facebook. Destination: `https://www.dejustudio.com/careers`.

House style throughout: no em dashes, no emoji, no exclamation marks.

---

## 1. The funnel (how it all connects)

```
Meta ad (IG/FB) ──┐
Flyer link / URL ─┼─▶ dejustudio.com/careers ─▶ application form ─▶ email to info.dejustudio@gmail.com (Careers label)
Organic + WA ─────┘                                              └▶ Netlify Forms API ─▶ screening agent ─▶ shortlist
```

Applications never touch the WhatsApp booking line. The email notification is live; the screening agent reads submissions straight from the Netlify Forms API (no Google Sheet required). See `BACKEND-SETUP.md`.

## 2. Creative assets (built, in `marketing/flyer/`)

| File | Size | Use |
|---|---|---|
| `Deju - Hiring - Editorial - Story.png` / `.pdf` | 1080x1920 | Instagram Story, Facebook Story, **WhatsApp Status** |
| `Deju - Hiring - Editorial - Instagram 1080x1350.png` | 1080x1350 | Instagram feed post + ad |
| `Deju - Hiring - Editorial - Facebook 1080x1080.png` | 1080x1080 | Facebook feed post + ad |
| `Deju - Hiring - Editorial - A4.png` / `.pdf` | A4 | WhatsApp document share + printed flyer |

Rebuild any time: `cd marketing/flyer && bash build/build.sh`. Source photos: `marketing/flyer/Hiring/`.

## 3. Campaign structure (Meta Ads Manager)

Keep it simple. A 1M IDR budget (~$61) does not support splitting into many ad sets.

- **1 Campaign** - objective **Traffic**, optimised for **Landing page views**.
  - Do NOT pick "Leads"/conversion optimisation: it needs far more events than this budget produces to exit the learning phase. Optimise for landing-page-views, and measure form submissions as the real KPI (GA4).
- **1 Ad set**:
  - **Budget:** ~70,000 to 85,000 IDR/day, **12 to 14 days** (total ~1,000,000 IDR). Use a daily budget, not lifetime, so you can pause/scale.
  - **Location:** Ubud + Gianyar Regency. If using a pin + radius, drop a pin on Ubud and set ~4 km (note Meta's minimum radius and Special Ad Category caveat below).
  - **Age:** 19 to 35. **Gender:** Women. (See Special Ad Category caveat.)
  - **Detailed targeting (interests):** Manicure, Nail art, Nail salon, Beauty salon, Cosmetology, Beauty. Keep it broad-ish; the local base is small.
  - **Languages:** leave open. The English ad copy self-selects English speakers.
  - **Placements:** Advantage+ placements (Instagram + Facebook feed, Stories, Reels, Explore).
- **2 Ads** (A/B):
  - Ad A: the **Story** creative (1080x1920) - photo 1 (single hand, lotus).
  - Ad B: the **Facebook square** (1080x1080) - photo 2 (two hands). Or run the 1080x1350 in feed.
  - After 3 to 4 days, pause the weaker ad and move its budget to the winner.

### Special Ad Category caveat (read before launch)
Meta may require you to declare this as the **Employment** Special Ad Category. If it does, Meta **removes age + gender targeting and widens the minimum radius**. Fallback: target **Ubud + Gianyar by geography + interests only**, and let the English "we are hiring a nail artist" copy and the creative self-select. The applicant pool will still skew correctly. Do not try to evade the category; just run the geo + interest version.

## 4. Ad copy (English-led)

**Primary text (feed):**
Deju Studio in Ubud is hiring nail artists. If you have at least six months of experience, strong manicure skills, and a portfolio you are proud of, we would love to see your work. You will train and grow with us in a calm, private studio. Competitive salary plus commission, four days off a month, holiday bonus, professional training, and free manicure and pedicure. Based in or near Ubud or Gianyar, with conversational English. Apply on our website.

**Short text (Stories / Reels overlay is on the creative already):**
We are hiring nail artists in Ubud. Apply at dejustudio.com/careers

**Headline (link card):** Now hiring: Nail Artist in Ubud
**Description:** Six months experience, a portfolio, and good English. Apply online.
**CTA button:** Apply Now
**Destination URL:** `https://www.dejustudio.com/careers?utm_source=meta&utm_medium=paid&utm_campaign=hiring`

## 5. Organic amplification (free, do alongside the ads)

- Post the **Story** to Deju's Instagram + Facebook Stories, and pin the **1080x1350** to the feed.
- Put the careers link in the **Instagram bio** for the duration.
- Post the **A4** as **Desty's WhatsApp Status** - it reaches her nail-world network directly.
- Share the A4 in relevant **Ubud / Bali job and nail-tech Facebook groups**.
- Consider **boosting the real feed post** (social proof from comments/likes) rather than only running a dark ad.

## 6. Tracking and KPIs

- **UTMs:** the ad link carries `utm_source=meta` (set it on the destination URL in Ads Manager). The flyer now uses a written link (no QR), so people typing `dejustudio.com/careers` arrive as Direct/typed traffic in GA4. If you want flyer attribution, print a short redirect link that appends `utm_source=flyer` (optional).
- **Success metric:** completed applications (GA4 `generate_lead` form-submit event - see `BACKEND-SETUP.md` to wire it), not clicks.
- **Watch daily for the first 3 days:** CPM, CPC, landing-page views, then consolidate to the winning ad.
- **Realistic expectation:** ~$61 in a hyperlocal audience yields roughly tens of thousands of impressions and a few hundred to ~1,000 clicks. Treat the ad as one of three channels (ads + organic + flyer). For 3 hires in a tight community, the combined reach is enough.

## 7. Pre-launch checklist

- [ ] Careers page live on dejustudio.com (deployed) and form submits to the Sheet + email.
- [ ] `generate_lead` GA4 event firing on submit.
- [ ] Flyers exported and reviewed (PDF + PNG).
- [ ] Meta page + Instagram connected in Ads Manager; payment method set.
- [ ] Campaign built per section 3; Special Ad Category decision made.
- [ ] Organic posts queued; careers link in IG bio.
