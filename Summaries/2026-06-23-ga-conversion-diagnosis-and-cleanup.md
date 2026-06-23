# GA conversion-tracking diagnosis + codebase cleanup

Date: 2026-06-23. Follows `2026-06-23-careers-deploy-and-ga-mcp.md` (which set up the `analytics-mcp` server). This session was the first to actually query GA4 through the MCP after the Claude Code restart, used it to investigate a suspected conversion-tracking problem, and did a codebase tidy-up.

## What we completed

### 1. Verified the GA4 MCP works end-to-end
- After the restart, `analytics-mcp` loads its tools. Confirmed `claude mcp list` shows it Connected, the key is at `~/deju-ga-mcp-key.json`, and the service account can read account summaries + run reports against property **534840336** (timezone Asia/Makassar, currency IDR, unsampled).
- Pulled last-28-day sessions by source as a smoke test: Google Ads (`google / cpc`) is now the #1 source, and **AI assistants (ChatGPT ~33, Gemini) are already sending referral traffic** - the `llms.txt` / GEO work is paying off.

### 2. Diagnosed the "conversions aren't counting" worry - tracking is actually healthy
- The user believed `click_whatsapp` had logged only ~1 conversion. Investigated from both ends (GA4 data + the site code).
- **GA4 is fine.** Over the last 90 days: `click_whatsapp` fired **171 times / 133 counted as key events**. It **is** marked as a key event. Since the campaign launched (2026-05-01) the **ad traffic alone produced 49 WhatsApp conversions**; 133 total across all sources (direct 24, organic 22, IG 15, ChatGPT 18, Gemini 2).
- **Site code is correct.** `js/whatsapp.js` fires both the Ads `conversion` ping (`send_to: AW-11529975683/tzL7CKzm76McEIPv9fkq`) and the GA4 `click_whatsapp` event on every `[data-wa]` click; `js/config.js` carries the right IDs. Nothing to fix on the website.
- **Root cause is on the Google Ads side.** The "1 from weeks ago" is almost certainly the **2026-04-28 end-to-end verification click**. GA4 ↔ Google Ads **are linked** (customer `7732639350`, since 2026-05-01), so the 49 ad conversions should be visible in Ads. If the Ads "Conversions" column still reads ~1, the conversion action is misconfigured - most likely set to **Secondary** (the column only sums Primary), or **Unverified / inactive**, or there are competing actions (the gtag one vs. a GA4 import) and the wrong one is Primary / in the campaign's goals.

### 3. Could we check Google Ads programmatically? Not yet.
- No Google Ads MCP is installed; `analytics-mcp` is GA4-only. The GA service account can't auth the Ads API (Ads on a personal Gmail needs OAuth, not a service account), and the Ads API requires an approved **developer token** (days of lead time). **Deferred to next session** as a separate, larger task. For now the fix is a 2-minute check in the Ads UI (Tools -> Conversions: status + Primary/Secondary).

### 4. Codebase cleanup (housekeeping)
- **Dead CSS removed (~132 lines)** left over from the multi-page -> single-page collapse. Each class was verified to have **0 references** in `index.html`, `careers-thanks.html`, and `js/` before removal (selectors that match nothing can't affect rendering; no build step). Removed: `.service-card*`, `.service-grid`, `.pillars`/`.pillar`, `.filter-bar*`, `.menu-item__book`, `.menu-section` (base), `.about-hero*`, `.founder-letter`, `.home-pillars`, `.home-services`. `components.css` 941->854, `pages.css` 144->99. Brace balance re-verified. **Kept** all live classes (`hero*`, `lightbox*`, `menu-list`/`menu-item__name|desc|price`, `menu-section__cta`, `menu-list--compact*`, `services-*`, `philosophy-row`, `about__eyebrow-second|subhead|cta-btn`, contact classes, `closing-cta`, `home-hero`).
- **Pruned a stale 12M git worktree** (`.claude/worktrees/infallible-shtern-9bf3a8`, abandoned 6 weeks, git-flagged `prunable`, pointing at the old `Deju Studio Website` path) and deleted its orphan branch `claude/infallible-shtern-9bf3a8`.
- **Fixed a stale path in `CLAUDE.md`**: "How to resume" said `cd "Deju Studio Website"`; the repo is now `Deju Studio OS`.
- Confirmed the working tree was otherwise clean - no tracked `.DS_Store` / build intermediates, all heavy source assets correctly gitignored.

## State now
- GA4 MCP: **working in-session**; use it to monitor traffic + the hiring campaign.
- WhatsApp conversion tracking: **confirmed healthy in GA4** (133 key events / 90d). Open item is Ads-side display only.
- Codebase: dead CSS gone, stale worktree gone, docs path fixed.

## Next
1. **(User, 2 min)** Open ads.google.com -> Tools -> Conversions, check the WhatsApp conversion action's **Status** and **Primary/Secondary**. Set it Primary if it's Secondary; re-verify if inactive. Avoid double-counting (only one action - gtag *or* GA4 import - should be Primary).
2. **(Next session)** Decide whether to stand up a **Google Ads MCP** for programmatic spend/conversion monitoring alongside GA4 (gated on a developer-token application + OAuth). Tracked in `CLAUDE.md` "Where to pick up next".
