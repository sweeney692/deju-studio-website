# Nail Artist hiring campaign - careers funnel, flyers, Meta ads, screening agent

Date: 2026-06-23. Goal: hire 3 nail artists. Channel: Instagram + Facebook ads, 1,000,000 IDR budget. Applications go through a website form with a backend (not WhatsApp - the booking line is saturated), and an AI agent triages them.

## What shipped

### Website careers funnel (live on push)
- New `#careers` section in `index.html`: role, requirements, benefits, and a **Netlify Forms** application form (`name="careers-application"`, multipart for an optional portfolio upload). Posts to a new `careers-thanks.html` success page that fires a GA4 `generate_lead` event.
- Form CSS: `.careers-*` block appended to `css/components.css` (brand tokens, 16px inputs to avoid iOS zoom).
- Nav + footer "Careers" links added.
- 5th JSON-LD block, `@type: JobPosting`, in `<head>` (separate block per convention) for Google Jobs. `validThrough` 2026-09-23 - update or remove when the role closes.
- `/careers` -> `/#careers` 301 in `netlify.toml`. `llms.txt` / `llms-full.txt` Careers section. `sitemap.xml` lastmod bumped.
- Applications were verified rendering at desktop + mobile; all 5 JSON-LD blocks parse.

### Flyers (5 formats, via the existing pipeline)
- New templates `marketing/flyer/build/hiring-editorial-{story,ig,fb,a4}.html`; added to `build/build.sh`.
- Outputs in `marketing/flyer/`: Story 1080x1920 (PNG+PDF, doubles as IG Story + WhatsApp Status), Instagram 1080x1350, Facebook 1080x1080, A4 (PNG+PDF). CTA is the website (`dejustudio.com/careers`) + a dark-on-light QR (`build/assets/qr-hiring.png`).
- Photos from `marketing/flyer/Hiring/` resized into `build/assets/hiring-1.jpg` (Story/IG/A4) and `hiring-2.jpg` (FB). Story/IG use a vertical stack; FB is side-by-side. Every painted nail stays fully visible (photo biased to top, only background cropped); no filter on the nail art. A4 PDF verified through the Quartz print path.

### Campaign + backend docs (`marketing/hiring-campaign/`)
- `CAMPAIGN-BRIEF.md` - Meta setup (Traffic objective optimised for landing-page-views, 1 ad set, 2 ads, ~70-85k IDR/day over 12-14 days), targeting (Ubud + Gianyar, women 19-35, beauty/nail interests), the **Special Ad Category** caveat + geo-only fallback, English ad copy, organic amplification, UTMs + KPIs.
- `BACKEND-SETUP.md` - Netlify Forms detection, email notify to `info.dejustudio@gmail.com` under a `Careers` Gmail label, mirror to a Google Sheet, GA4 conversion. `apps-script.gs` - the Sheet sink for the Netlify outgoing webhook.

### Screening agent (separate Agent Forge repo)
- Scaffolded `agents/app-screener/` (persona, orientation, rubric in `data/job-requirements.md`, three skills, definition-of-done). Reads the applications Sheet, scores 0-100 against the rubric, ranks, surfaces a top-3, escalates borderline cases, never auto-rejects. Phase 2: validate on 10+ real applications before any automation (readiness gate).

## Decisions / notes
- Applications never touch WhatsApp; the booking line is untouched.
- Female 19-35 is the founder's stated preference, applied in review + ad targeting, NOT a hard public gate or a scored field (fairness + Meta Special Ad Category).
- Netlify Forms is the site's first and only backend (documented in `CLAUDE.md`).

## Next (user-driven, outside the repo)
1. Deploy `main`; confirm Netlify registers `careers-application`.
2. Wire notifications + Sheet + Gmail label per `BACKEND-SETUP.md`; mark GA4 `generate_lead` as a key event.
3. Build the Meta campaign per `CAMPAIGN-BRIEF.md`; post organic + add the careers link to the IG bio.
4. When applications arrive, run the `app-screener` over the first batch and validate against your own judgment.
