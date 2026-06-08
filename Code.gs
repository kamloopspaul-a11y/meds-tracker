// ── Meds Tracker — Apps Script ────────────────────────────────────────────────
// Deploy as: Web App → Execute as Me → Anyone (including anonymous)
//
// Sheet columns: Date | Time | Med
// Sheet name:    Log

var SHEET_NAME = 'Log';

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Date', 'Time', 'Med']); // header
    sh.getRange(1, 1, 1, 3).setFontWeight('bold');
  }
  return sh;
}

// ── POST — log a dose ──────────────────────────────────────────────────────────
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sh   = getSheet();
  sh.appendRow([data.date, data.time, data.med]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── GET — history ──────────────────────────────────────────────────────────────
function doGet(e) {
  var action = e.parameter.action;
  var days   = parseInt(e.parameter.days || '14', 10);

  if (action === 'history') {
    var sh   = getSheet();
    var data = sh.getDataRange().getValues();
    var rows = [];

    // Cutoff date
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    var tz = Session.getScriptTimeZone();

    for (var i = 1; i < data.length; i++) { // skip header
      var row = data[i];

      // Sheets sometimes auto-converts "yyyy-MM-dd" / "HH:mm" strings into
      // real Date values on write. Normalize either case back to plain
      // strings so filtering/sorting/display all stay consistent.
      var rawDate = row[0];
      var rawTime = row[1];
      var date = (rawDate instanceof Date)
        ? Utilities.formatDate(rawDate, tz, 'yyyy-MM-dd')
        : (rawDate ? String(rawDate).trim() : '');
      var time = (rawTime instanceof Date)
        ? Utilities.formatDate(rawTime, tz, 'HH:mm')
        : (rawTime ? String(rawTime).trim() : '');
      var med = row[2] ? String(row[2]).trim() : '';

      if (!date) continue;

      var rowDate = new Date(date + 'T12:00:00');
      if (rowDate < cutoff) continue;

      rows.push({ date: date, time: time, med: med });
    }

    // Most recent first
    rows.sort(function(a, b) { return b.date.localeCompare(a.date); });

    return ContentService
      .createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Meds Tracker API' }))
    .setMimeType(ContentService.MimeType.JSON);
}
