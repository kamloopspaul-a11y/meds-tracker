// ── Meds Tracker — Apps Script ────────────────────────────────────────────────
// Deploy as: Web App → Execute as Me → Anyone (including anonymous)
//
// Tabs:
//   Log      — Date | Time | Med           (daily dose-toggle log, no secret required)
//   MedList  — Timestamp | Data            (Red Circle Meds backups, secret required)
//
// MedList backup/restore requires WEBHOOK_SECRET to match a Script Property
// of the same name (Project Settings → Script Properties). This repo is
// public, so the app's WEBHOOK_SECRET constant in index.html is technically
// visible to anyone who looks — the secret raises the bar against casual
// automated abuse, it isn't a substitute for keeping the Sheet itself private.
//
// By design, the DOB field is stripped out before it ever reaches this script
// or the Sheet — Paul chose not to have his date of birth leave the phone.

var LOG_SHEET_NAME      = 'Log';
var MEDLIST_SHEET_NAME  = 'MedList';

function getWebhookSecret() {
  return PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET') || '';
}

// Cross-realm-safe Date check. `instanceof Date` can return false for Date
// values returned by Range.getValues() because they originate from a
// different JS execution context. Duck-type instead.
function isDateLike(v) {
  return v && typeof v === 'object' && typeof v.getTime === 'function' && !isNaN(v.getTime());
}

function getLogSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(LOG_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(LOG_SHEET_NAME);
    sh.appendRow(['Date', 'Time', 'Med']); // header
    sh.getRange(1, 1, 1, 3).setFontWeight('bold');
  }
  return sh;
}

function getMedListSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(MEDLIST_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(MEDLIST_SHEET_NAME);
    sh.appendRow(['Timestamp', 'Data']); // header
    sh.getRange(1, 1, 1, 2).setFontWeight('bold');
    sh.setColumnWidth(2, 600);
  }
  return sh;
}

// ── POST ──────────────────────────────────────────────────────────────────────
function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (data.action === 'backupMedList') {
    if (data.secret !== getWebhookSecret()) {
      return jsonOut({ ok: false, error: 'unauthorized' });
    }
    var sh = getMedListSheet();
    sh.appendRow([new Date(), JSON.stringify({ patient: data.patient, medList: data.medList })]);
    return jsonOut({ ok: true });
  }

  // Default (legacy-compatible): dose-toggle log entry, no secret required.
  var logSh = getLogSheet();
  logSh.appendRow([data.date, data.time, data.med]);
  return jsonOut({ ok: true });
}

// ── GET ───────────────────────────────────────────────────────────────────────
function doGet(e) {
  var action = e.parameter.action;

  if (action === 'history') {
    var days = parseInt(e.parameter.days || '14', 10);
    var sh   = getLogSheet();
    var data = sh.getDataRange().getValues();
    var rows = [];

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
      var date = isDateLike(rawDate)
        ? Utilities.formatDate(rawDate, tz, 'yyyy-MM-dd')
        : (rawDate ? String(rawDate).trim() : '');
      var time = isDateLike(rawTime)
        ? Utilities.formatDate(rawTime, tz, 'HH:mm')
        : (rawTime ? String(rawTime).trim() : '');
      var med = row[2] ? String(row[2]).trim() : '';

      if (!date) continue;

      var rowDate = new Date(date + 'T12:00:00');
      if (rowDate < cutoff) continue;

      rows.push({ date: date, time: time, med: med });
    }

    rows.sort(function(a, b) { return b.date.localeCompare(a.date); }); // most recent first
    return jsonOut(rows);
  }

  if (action === 'restoreMedList') {
    if (e.parameter.secret !== getWebhookSecret()) {
      return jsonOut({ ok: false, error: 'unauthorized' });
    }
    var mlSh = getMedListSheet();
    var mlData = mlSh.getDataRange().getValues();
    if (mlData.length < 2) {
      return jsonOut({ ok: false, error: 'no backups yet' });
    }
    var lastRow = mlData[mlData.length - 1]; // [Timestamp, Data]
    var payload = JSON.parse(lastRow[1]);
    return jsonOut({ ok: true, timestamp: lastRow[0], patient: payload.patient, medList: payload.medList });
  }

  return jsonOut({ ok: true, message: 'Meds Tracker API' });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
