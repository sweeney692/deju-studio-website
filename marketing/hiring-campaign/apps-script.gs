/**
 * Deju Studio - careers application sink.
 * Receives Netlify Forms outgoing-webhook POSTs and appends one row per application
 * to the active Google Sheet. Deploy as a Web app (Execute as: Me, Access: Anyone).
 *
 * Header row expected (row 1):
 * timestamp | name | age | area | email | phone | experience | manicure_experience |
 * english_level | open_to_training | portfolio_link | portfolio_file | about | score | rank | notes
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    // Netlify wraps form fields under `data`; fall back to the root for safety.
    var d = body.data || body;

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Applications')
             || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Netlify includes uploaded files under data with a `url` we can store as a link.
    var portfolioFile = '';
    if (d.portfolio_file) {
      portfolioFile = (typeof d.portfolio_file === 'object' && d.portfolio_file.url)
        ? d.portfolio_file.url
        : String(d.portfolio_file);
    }

    sheet.appendRow([
      new Date(),
      d.name || '',
      d.age || '',
      d.area || '',
      d.email || '',
      d.phone || '',
      d.experience || '',
      d.manicure_experience || '',
      d.english_level || '',
      d.open_to_training || '',
      d.portfolio_link || '',
      portfolioFile,
      d.about || '',
      '', // score - filled by the screening agent
      '', // rank  - filled by the screening agent
      ''  // notes - filled by the screening agent
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
