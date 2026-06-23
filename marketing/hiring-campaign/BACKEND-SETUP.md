# Careers Application - Backend Setup

The careers form on `dejustudio.com/careers` is a **Netlify Form**. This guide wires it to a notification inbox and a Google Sheet (the store the screening agent reads). One-time setup, no code deploy needed beyond what is already in the repo.

The form is already in `index.html` (`name="careers-application"`, `data-netlify="true"`, multipart for file uploads) and submits to the `/careers-thanks` page, which fires a GA4 `generate_lead` event.

---

## Step 1 - Confirm Netlify detects the form

1. Deploy `main` (push). Netlify parses the deployed HTML and auto-registers the form `careers-application`.
2. In Netlify: **Site configuration -> Forms** should now list `careers-application`. If it does not appear, ensure **Form detection** is enabled and redeploy.
3. Submit one test application on the live site. It should appear under **Forms -> careers-application -> Submissions**, and you should land on the thank-you page.

> Note: Netlify Forms free tier allows 100 submissions/month and file uploads up to 10 MB total per submission. The portfolio **link** is the primary input; the file upload is optional, which keeps usage light. If volume or uploads exceed the tier, upgrade Forms or switch to the function-based store noted in the plan.

## Step 2 - Email notifications to info.dejustudio@gmail.com (Careers label)

1. Netlify: **Forms -> Settings and notifications -> Form notifications -> Add notification -> Email notification**.
2. Form: `careers-application`. Email to: `info.dejustudio@gmail.com`.
3. In Gmail, create a label **Careers** and a filter:
   - Matches: `subject:("careers-application")` OR `from:(forms@netlify.com)` (adjust to the actual Netlify sender).
   - Do this: Apply label **Careers**, Skip the Inbox (optional), never send to Spam.
4. This keeps applicant mail separate from client/booking mail. The WhatsApp booking line is untouched.

## Step 3 - Mirror submissions into a Google Sheet (the agent's store)

This gives the screening agent a clean, structured store to read.

1. Create a Google Sheet named **Deju - Nail Artist Applications**. Add a header row matching the form fields:
   `timestamp | name | age | area | email | phone | experience | manicure_experience | english_level | open_to_training | portfolio_link | portfolio_file | about | score | rank | notes`
   (the last three are filled by the screening agent.)
2. In the Sheet: **Extensions -> Apps Script**. Paste the contents of `apps-script.gs` (in this folder). Save.
3. Deploy the Apps Script as a **Web app** (Deploy -> New deployment -> Web app; Execute as: Me; Who has access: Anyone). Copy the web app URL.
4. In Netlify: **Forms -> Settings and notifications -> Add notification -> Outgoing webhook**. Form: `careers-application`. URL: the Apps Script web app URL. Netlify will POST each submission JSON to it, and the script appends a row.
5. Submit another test application and confirm a new row appears in the Sheet.

## Step 4 - GA4 conversion (already wired)

The thank-you page `careers-thanks.html` fires `gtag('event', 'generate_lead', ...)` on load. In GA4:
1. **Admin -> Events** - after the first real submissions, mark `generate_lead` as a **key event (conversion)**.
2. Optionally import it into Google Ads as a conversion if you ever run search ads for hiring.
3. This is the success KPI for the Meta campaign (see `CAMPAIGN-BRIEF.md`), measured per `utm_source` (meta vs flyer).

## Step 5 - Hand off to the screening agent

Once applications are arriving in the Sheet, the **Agent Forge `app-screener`** reads the Sheet, scores each candidate against the rubric, and produces a ranked shortlist with reasons. See `/Users/conorsweeney/Agent Forge/agents/app-screener/` (Phase 2). Start by running it manually over the first batch and checking its ranking against your own judgment before trusting it.

---

## Field reference (form `name` attributes)

`name, age, area, email, phone, experience, manicure_experience, english_level, open_to_training, portfolio_link, portfolio_file, about` plus the honeypot `bot-field` (ignore) and `form-name` (always `careers-application`).
