# Netlify Functions

Serverless functions for dejustudio.com. The site is otherwise static (no build
step); these are zero-dependency `.mjs` files using the global `fetch`, so there
is **no `package.json`, no `node_modules`, and no build** - Netlify zips each file
as-is. Functions directory is the Netlify default (`netlify/functions`); nothing
extra is set in `netlify.toml`.

## `submission-created.mjs` - applicant auto-reply email

Netlify automatically invokes a function named exactly `submission-created` on
**every verified Netlify Forms submission** (production deploys only). This one:

- ignores any form other than `careers-application`,
- reads the applicant's `email` / `name` from the submission,
- sends a branded confirmation email from `careers@dejustudio.com`
  (reply-to `info.dejustudio@gmail.com`) via the **Resend** HTTP API,
- fails quietly if not yet configured, so it never blocks a submission. The
  studio's own notification email (a separate Netlify form hook) is unaffected.

### Status: committed but DORMANT (as of 2026-06-24)

It does nothing until two things exist:

1. **`RESEND_API_KEY`** env var on the Netlify site.
2. **`dejustudio.com` verified in Resend**, which needs DNS records Wix can't add
   (subdomain MX). Wix also blocks nameserver changes, so the domain is being
   **transferred off Wix** to reach Cloudflare DNS.

Full context and the finish-up steps: `marketing/hiring-campaign/BACKEND-SETUP.md`
(Step 5) and `Summaries/2026-06-24-ig-launch-keyevent-autoreply-domain-transfer.md`.

To change the email copy, edit the `text` / `html` in `submission-created.mjs`
(house style: no em dashes, no emoji, no exclamation marks).
