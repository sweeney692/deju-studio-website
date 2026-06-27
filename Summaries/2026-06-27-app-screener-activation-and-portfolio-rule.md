# 2026-06-27 - Screening agent first run, 5-image portfolio rule, and the Cloudflare-transfer no-downtime plan

## Context
Desty had received ~5 applicants for the Nail Artist role but there was no sign the `app-screener` agent was doing anything. This session diagnosed that, ran the agent for real, tightened the portfolio requirement, committed the agent bundle, and worked out the safe path for the upcoming Wix -> Cloudflare domain transfer.

## What we found
- **The agent was never "running in the background" - by design.** `app-screener` (in the `agent-forge` repo, `agents/app-screener/`) is a **manual bundle** of markdown (persona + orientation + rubric + screen/score/rank skills), invoked on demand, not a service. Its own README and definition-of-done set a **readiness gate**: do not automate until it has scored 10+ real applicants that Desty has also judged by hand and broadly agrees with. So the absence of scoring was expected - nobody had run it, and it wasn't even committed to git yet.
- **Only 2 of the ~5 applicants were in the system.** The Netlify Forms API (`form_id 6a39f024e9537d0008564fa1`) held just submissions #3 (juliet) and #4 (Dewa Ayurai). The other ~3 reached Desty via **WhatsApp**, outside the form - the agent can only see Netlify form submissions, so those 3 are invisible to it unless pasted in. (Confirmed by Conor/Desty.)
- **One of the two was a test.** juliet is **Desty's sister**, who submitted to test the form end to end (explains the dead portfolio link, empty upload, and "ya baik" free-text). Excluded from ranking.

## What we did
1. **Ran the agent for real (first batch).** Pulled submissions, screened/scored/ranked. Output digest: `agent-forge:agents/app-screener/data/screening-digest-2026-06-27.md`.
   - **Dewa Ayurai** - the one genuine applicant. Her uploaded portfolio photo is genuinely premium (clean almond extensions, hand-painted frangipani/leopard art, neat cuticle lines, glossy finish). Initially scored 81; after the new evidence-depth rule (below) re-scored **71/100 provisional -> interview**, because only one image was actually viewable (Instagram is behind a login wall). Conor confirmed Desty had already obtained the full portfolio and **booked an interview for Monday** - so the agent's call matched the founder's.
2. **Tightened the portfolio requirement to 5+ examples** (Conor's call: one photo can't prove consistency or that the work is the applicant's).
   - **Live careers form** (`index.html`, deployed): the portfolio link field now asks for "at least 5 examples"; the optional upload notes a single multi-image PDF can carry them all. We kept it to **one file per submission on purpose** - Netlify's free Forms plan caps uploads at ~10 MB/month, and 5 raw phone photos would exhaust that in one or two applicants. (Options weighed: 5 separate upload slots = blows the cap; link-only = agent can't fetch Instagram. Chosen: required link + optional single PDF.)
   - **Rubric** (`agent-forge:.../data/job-requirements.md`): added a **Portfolio evidence-depth rule** - fewer than 5 viewable pieces caps Portfolio quality at <=12/25, marks the score provisional, and forces a "request more evidence" note. Never an auto-reject.
3. **Committed the agent bundle** to the `agent-forge` repo (it was previously untracked) and **stood up a feedback log** (`data/feedback-log.md`) that records the agent's call vs Desty's actual verdict per applicant, with a running validation tally toward the 10-applicant gate. First entry: Dewa, agent ↔ founder agreement 1/1.

## The Cloudflare transfer - process and why it won't take the site offline
Decided to **proceed with the Wix -> Cloudflare DNS transfer next session** (it unblocks the dormant applicant auto-reply email, which needs DNS records Wix won't host). The key worry was downtime. Answer, verified against live DNS this session:

**Two separate operations, only one carries any risk:**
- **Registrar transfer (Wix -> Porkbun/Namecheap):** moves only *who manages the registration*. It does **not** change DNS - the domain keeps resolving through Wix's nameservers throughout. **Zero downtime.**
- **Nameserver flip (Wix DNS -> Cloudflare DNS):** the only step with any risk, and only if the Cloudflare zone is empty/wrong when you flip. Propagation is gradual and both old and new answers point at the same Netlify servers, so there's no unreachable moment **provided the zone is pre-mirrored.**

**Live records the Cloudflare zone must mirror before the flip** (confirmed via `dig` 2026-06-27):
| Record | Value | Target |
|---|---|---|
| Nameservers (now) | `ns6/ns7.wixdns.net` | Wix |
| `A @` | `75.2.60.5` | Netlify |
| `CNAME www` | `dejustudio.netlify.app` | Netlify |
| MX | none | (no email on domain today) |

**Sequence for zero downtime:**
1. At Wix: confirm the auth/EPP code arrived (requested 2026-06-24), domain **unlocked**, WHOIS privacy off / admin email reachable.
2. Pre-flight: verify the Cloudflare zone has `A @ -> 75.2.60.5` and `CNAME www -> dejustudio.netlify.app`, both **DNS-only (grey cloud)** so Netlify keeps terminating Let's Encrypt SSL. (Proxying/orange-cloud would change SSL handling - keep it DNS-only.)
3. Initiate the transfer at the gaining registrar with the auth code; approve from Wix. Takes hours to ~5 days; **site stays up** on Wix nameservers the whole time. (Direct transfer into Cloudflare Registrar isn't possible until the domain already uses Cloudflare nameservers - hence the Porkbun/Namecheap hop.)
4. After it lands: confirm NS still reads Wix, then deliberately switch nameservers to Cloudflare's `blakely.ns.cloudflare.com` / `harvey.ns.cloudflare.com`.
5. Add Resend's DNS records in Cloudflare (the `send.` subdomain MX + SPF/DKIM/DMARC TXT) and verify in Resend.
6. Set `RESEND_API_KEY` as a Netlify env var, redeploy, submit a real application to test, delete the test submission.
7. Do **not** delete the Wix zone until `dig NS dejustudio.com` shows Cloudflare and the site loads clean.

**Lighter fallback if the transfer stalls:** switch the auto-reply function from Resend to **SendGrid/Brevo**, which verify via CNAME/TXT records Wix *does* support - no transfer needed. The transfer was chosen only for the longer-term benefit of leaving Wix.

## Housekeeping
- Both repos verified clean: no stale build intermediates, `.bak`/`.tmp`/`.orig`, or orphaned files. Removed local `.DS_Store` junk (gitignored). Folder structure left as-is - it's already logical and, with no build step, moving files would break path references and the `netlify.toml` redirects.

## State after this session
- Careers form requiring 5+ portfolio examples is **live** (deploy `b318210`, state ready).
- `app-screener` bundle + feedback log committed and pushed to `agent-forge`.
- Screening is **manual, supervised** (Stage 1). Validation gate: 1 of 10 genuine applicants judged so far.

## Resume next session (priority order)
1. **Do the Cloudflare transfer** using the sequence above (the main open task; user confirmed proceeding). Start by confirming the Wix auth code + unlock.
2. **Finish the auto-reply** once DNS is on Cloudflare (Resend verify -> `RESEND_API_KEY` -> deploy -> test).
3. **Keep screening** each new web applicant and logging Desty's verdict toward the 10-applicant gate; once it's met, automate via a scheduled cloud agent. (Holding on the 3 WhatsApp applicants for now, per Conor - waiting for web applicants.)
4. Monitor the live IG hiring ad + GA4 `generate_lead`; refresh the JobPosting `validThrough` when the role closes.
