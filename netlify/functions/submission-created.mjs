// Netlify event-triggered function.
// Netlify invokes a function named exactly `submission-created` on every VERIFIED
// form submission (production only). Here we send a confirmation email to the
// careers applicant via the Resend HTTP API.
//
// Zero dependencies: uses the global `fetch` (Node 18+ on Netlify) and ESM syntax
// via the .mjs extension, so there is NO build step, package.json, or node_modules.
//
// Requires one environment variable on the Netlify site: RESEND_API_KEY.
// Sends from careers@dejustudio.com, which means dejustudio.com must be verified
// in Resend (SPF/DKIM DNS records). Replies route to the studio inbox.

const FROM = "Deju Studio <careers@dejustudio.com>";
const REPLY_TO = "info.dejustudio@gmail.com";

export const handler = async (event) => {
  let submission;
  try {
    submission = JSON.parse(event.body).payload;
  } catch {
    return { statusCode: 400, body: "Invalid payload" };
  }

  // Only handle the careers form. Ignore any other form on the site.
  if (!submission || submission.form_name !== "careers-application") {
    return { statusCode: 200, body: "Ignored: not a careers submission" };
  }

  const data = submission.data || {};
  const to = String(data.email || submission.email || "").trim();
  const fullName = String(data.name || "").trim();
  const firstName = fullName.split(/\s+/)[0] || "there";

  if (!to) {
    // Nothing to send to; succeed quietly so Netlify does not retry.
    return { statusCode: 200, body: "No applicant email on submission" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; cannot send confirmation email.");
    return { statusCode: 500, body: "Email not configured" };
  }

  const subject = "We have your application - Deju Studio";

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for applying to join Deju Studio as a Nail Artist. We have received your application and your portfolio.",
    "",
    "We read every application personally. If your experience and style fit what we are looking for, we will reply by email to arrange a conversation. Please allow us a little time to review everyone fairly.",
    "",
    "In the meantime, you are welcome to see more of the studio's work at https://www.dejustudio.com",
    "",
    "Warm regards,",
    "The Deju Studio team",
    "Ubud, Bali",
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F2EBDD;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EBDD;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FAF6EE;border-radius:12px;overflow:hidden;font-family:Helvetica,Arial,sans-serif;color:#1A1A1A;">
            <tr>
              <td style="background:#1E5128;padding:28px 36px;text-align:center;">
                <span style="color:#F2EBDD;font-size:22px;letter-spacing:.18em;text-transform:uppercase;">Deju Studio</span>
                <div style="color:#D4B98A;font-size:12px;letter-spacing:.28em;text-transform:uppercase;margin-top:6px;">Private Nail Studio &middot; Ubud, Bali</div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 36px 12px;">
                <p style="font-size:18px;margin:0 0 18px;">Hi ${firstName},</p>
                <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Thank you for applying to join Deju Studio as a Nail Artist. We have received your application and your portfolio.</p>
                <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">We read every application personally. If your experience and style fit what we are looking for, we will reply by email to arrange a conversation. Please allow us a little time to review everyone fairly.</p>
                <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">In the meantime, you are welcome to see more of the studio's work on our website.</p>
                <p style="text-align:center;margin:0 0 28px;">
                  <a href="https://www.dejustudio.com" style="background:#1E5128;color:#F2EBDD;text-decoration:none;font-size:14px;letter-spacing:.06em;padding:13px 28px;border-radius:8px;display:inline-block;">See the studio</a>
                </p>
                <p style="font-size:15px;line-height:1.6;margin:0;">Warm regards,<br>The Deju Studio team<br>Ubud, Bali</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px 30px;text-align:center;color:#9CAE93;font-size:12px;">
                This is a confirmation that your application was received.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject, html, text }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend send failed:", res.status, err);
    return { statusCode: 502, body: "Send failed" };
  }

  return { statusCode: 200, body: `Confirmation sent to ${to}` };
};
