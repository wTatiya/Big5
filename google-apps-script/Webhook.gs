/**
 * Big Five (20-item Likert) quiz webhook — append each submission as a row in Google Sheets.
 *
 * Setup:
 * 1. Create a Google Sheet (or pick an existing one). Copy its ID from the URL:
 *    https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
 * 2. Open Extensions → Apps Script, paste this file, set SPREADSHEET_ID and SHEET_NAME below.
 * 3. (Optional) Project Settings → Script properties → Add WEBHOOK_TOKEN; same value as
 *    webhookToken in assets/submission-config.js to reject random POSTs.
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL (ends in /exec) into submission-config.js → webhookUrl.
 *
 * Client sends POST with Content-Type: text/plain and a JSON body (see assets/submission.js).
 */

/** @type {string} */
var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
/** Tab name; created if missing */
var SHEET_NAME = "Big5Submissions";

/** Column order must match {@link doPost} {@code appendRow} (9 columns). */
var WEBHOOK_HEADER_ROW_ = [
  "submitted_at",
  "result_summary",
  "big5_o",
  "big5_c",
  "big5_e",
  "big5_a",
  "big5_n",
  "answers_json",
  "age",
];

var WEBHOOK_HEADER_COL_COUNT_ = 9;

/**
 * @param {GoogleAppsScript.Events.DoPost} e
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut_({ ok: false, error: "empty_body" });
    }

    /** @type {Record<string, unknown>} */
    var data = JSON.parse(e.postData.contents);

    var expected = PropertiesService.getScriptProperties().getProperty("WEBHOOK_TOKEN");
    if (expected) {
      var token = data.webhookToken;
      if (token !== expected) {
        return jsonOut_({ ok: false, error: "forbidden" });
      }
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    ensureHeader_(sheet);

    var answers = data.answers;
    var answersJson = answers ? JSON.stringify(answers) : "";

    sheet.appendRow([
      data.submitted_at || "",
      data.result_summary || "",
      num_(data.big5_score_o),
      num_(data.big5_score_c),
      num_(data.big5_score_e),
      num_(data.big5_score_a),
      num_(data.big5_score_n),
      answersJson,
      num_(data.age),
    ]);

    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

/**
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 */
function ensureHeader_(sheet) {
  var first = sheet.getRange(1, 1, 1, WEBHOOK_HEADER_COL_COUNT_).getValues()[0];

  if (String(first[0]).trim() === "submitted_at") {
    // Legacy sheets had 8 columns; appendRow now writes 9 (age last). Fill missing header only.
    var col9 = String(first[8]).trim();
    if (col9 === "") {
      sheet.getRange(1, 9).setValue("age");
    }
    return;
  }

  if (first.join("") === "") {
    sheet.getRange(1, 1, 1, WEBHOOK_HEADER_COL_COUNT_).setValues([WEBHOOK_HEADER_ROW_]);
  }
}

/**
 * @param {unknown} v
 * @returns {number|string}
 */
function num_(v) {
  if (typeof v === "number" && !isNaN(v)) {
    return v;
  }
  var n = Number(v);
  return isNaN(n) ? "" : n;
}

/**
 * @param {Record<string, unknown>} obj
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
