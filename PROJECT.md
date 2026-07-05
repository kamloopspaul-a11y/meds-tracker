# PROJECT.md — Meds Tracker PWA

## Overview
A Progressive Web App for tracking daily medications and prescription renewal dates. Installed on iPhone Home Screen via Safari / GitHub Pages.

**Live URL:** https://kamloopspaul-a11y.github.io/meds-tracker/
**GitHub:** https://github.com/kamloopspaul-a11y/meds-tracker (public repo)
**Google Sheet:** Meds Tracker (tabs: Log, MedList)
**Apps Script URL:** https://script.google.com/macros/s/AKfycbxcLD26lSIIWg1mG7WfpZOS8kdAKGpOjBnaBOLFphM0vEDzP3S7dRXSDO4GpeJCRXGNhQ/exec

## Current Version
v3.2 — deployed July 4, 2026

## Stack
- `index.html` — single-file PWA (HTML + CSS + JS)
- `manifest.json` — installable PWA manifest
- `sw.js` — service worker (offline support)
- `Code.gs` — Google Apps Script (Web App, Execute as Me / Anyone)
- Google Sheet "Meds Tracker" (tab: Log) — permanent dose log
- localStorage — toggle state (resets midnight), medication list (`medList`), patient info (`patientInfo`)

## Layout
```
[ Notice area ]     ← amber/red cards, only visible when triggered
[ Thyroid ]         ← once daily, morning — Methimazole + Propranolol
[ A.M. Inhalers ]   ← morning — Inspiolto + Pulmicort
[ P.M. Inhalers ]   ← evening — Inspiolto + Pulmicort
[ ▸ Refill Dates ]     ← collapsible, status button cycles per med; reads tracked items from medList
[ ▸ History ]          ← last 14 days, loaded on demand from Sheets
[ 🔴 Red Circle Meds ] ← collapsible, full editable Rx/supplement list + print button (first-responder cue)
```

## Notice Thresholds
- Dr. Jones amber: ≤20 days (non-renewable: Inspiolto, Pulmicort)
- Dr. Jones red: ≤7 days (non-renewable)
- Safeway call: ≤7 days (all meds)
- Overdue: past nextRefill date

## Refill Config
Refill tracking is no longer a separate hardcoded list — it lives on individual items inside `medList` (each item has an optional `refill: { track, label, daysSupply, nextRefill, renewable, doctor, status }` object). Adding a new prescription through the Red Circle Meds editor and checking "Track refill / renewal reminders" gives it a row in Refill Dates and eligibility for notices, exactly like the original 3:

| Item (id) | daysSupply | nextRefill (seed) | Renewable |
|-----|-----------|------------|-----------|
| Methimazole — "Thyroid Meds" (`thyroid`) | 90 | 2026-07-15 | Yes |
| Inspiolto Respimat (`inspiolto`) | 30 | 2026-06-28 | No |
| Pulmicort Turbuhaler (`pulmicort`) | 100 | 2026-07-28 | No |

**Refill status button (per med, cycles automatically + manually):**
- **Filled** (dimmed, default) — quiet, no action needed.
- **Renew Meds** (amber) — auto-activates ~20 days before due; tap once you've called the pharmacist/Dr.
- **Ordered** (green) — pending pickup; tap once the new supply is in hand. This advances the refill date by daysSupply and resets the med back to Filled.

**Important:** The final tap (Ordered → Filled) should happen when you START the new supply, not at pharmacy pickup. This keeps the cycle dates accurate.

## Medications
- **Thyroid:** Methimazole + Propranolol — once daily, morning
- **Inspiolto Respimat:** 2 puffs AM + PM — non-renewable Rx (Dr. Jones)
- **Pulmicort Turbuhaler:** 2 puffs AM + PM — non-renewable Rx (Dr. Jones)
- **Prescribing physician:** Dr. Jones
- **Pharmacy:** Safeway (Fortune Drive)

## Locked Decisions
- No marquee — static notice cards only
- Toggles lock on tap, reset at midnight (device clock, Pacific time)
- Refill status is a 3-stage cycle: Filled → Renew Meds (auto, ~20 days out) → Ordered → Filled (manual, advances date)
- localStorage is source of truth for daily state; Sheets is permanent log
- Day-rollover uses device LOCAL date (not UTC) — anchors midnight reset to Pacific time and follows DST automatically
- Dose logging: instant POST to Apps Script on each toggle tap
- History: lazy-loaded from Sheets when section is opened

## Red Circle Meds — Backup / Restore to Sheets (manual, secret-protected)
Added because `medList`/`patientInfo` live only in phone localStorage (see below) with no redundancy — a lost/wiped/crashed phone would lose the whole list permanently. Paul wants privacy first, so this is manual-only (no auto-sync, no timer) and explicitly excludes date of birth.
- **"🗄️ Backup to Sheets"** — POSTs `{ action: 'backupMedList', secret, patient (no dob), medList }` to the Apps Script. Each tap appends a new timestamped row to the Sheet's **MedList** tab (history kept, not overwritten) — cheap in storage, gives a fallback if a bad backup follows a good one.
- **"⬇️ Restore from Sheets"** — GETs the latest MedList row, asks for confirmation, then overwrites local `medList`/`patientInfo` (keeping whatever DOB is already on the phone, since DOB is never part of the payload — re-enter it manually after a restore onto a fresh device).
- **Security:** the repo is public, so the Apps Script URL (and the `WEBHOOK_SECRET` constant in `index.html`) are technically visible to anyone who views source. The secret raises the bar against casual/automated abuse of the MedList backup/restore endpoints; it is not a substitute for keeping the Sheet itself private. The pre-existing dose-log endpoint (`action: 'logDose'`, default in `doPost`) intentionally does **not** require the secret — unchanged behavior, lower-sensitivity data.
- **Apps Script setup required (one-time, manual):** open the Sheet → Extensions → Apps Script → Project Settings → Script Properties → add `WEBHOOK_SECRET` = the same value as `index.html`'s `WEBHOOK_SECRET` constant → Deploy → Manage deployments → Edit → New version.
- **Rotation:** added to `Studio/TODO_LIST.md` alongside the existing SmartCart `WEBHOOK_SECRET` rotation cue — same reasoning (public repo, plaintext-visible secret).

## Red Circle Meds (editable medication list, for providers / first responders)
A collapsible section (below History) listing every prescription, supplement, and OTC item Paul takes. The name and red-circle icon are a deliberate cue — "Vial of Life"-style — so a first responder recognizes it as the place to find medical info in an emergency.
- **Fully editable in-app.** Data lives in localStorage (`medList` array of items, `patientInfo` object), seeded once from `DEFAULT_MED_LIST`/`DEFAULT_PATIENT` in `index.html`. No code edits needed to add/change/remove meds going forward.
- Tap "✏️ Edit List" to reveal per-row edit icons, an "+ Add Item" button, and an edit icon on the patient block. Editing patient info covers name, DOB, conditions, allergies.
- Each item: Category (free text + autocomplete from existing categories), Name, Dose, Frequency, Purpose, and an optional refill-tracking block (checkbox reveals Days Supply, Next Refill Date, Renewable, Doctor). Checking refill tracking on any item — new or existing — automatically wires it into the Refill Dates list and the notice thresholds; a 🔔 badge marks tracked items in the table.
- Categories currently in use: Prescription, Prescription — As Needed, Supplement — Daily, Supplement — Winter (Oct–Mar), Over-the-Counter — As Needed. New categories can be typed freely.
- "🖨️ Print / Share" calls `window.print()`; print CSS (`#printArea`) shows only the patient block + tables (no edit controls), hiding the rest of the app, so it prints/shares cleanly regardless of edit mode.
- On first load, one-time migration (`migrateLegacyRefillData`) pulls any pre-v2.9 `refillDates`/`refillStatus` localStorage values into the new unified item-based model, then removes the old keys.

## Deferred / Phase 2
- Push notifications (PWA web push) — replaces email system from HealthBot
- Air quality integration in dashboard
- Exercise tracker / Exercise Coach (Phase 3)
- Wearable integration (Phase 3, device TBD)

## Refill Reminder Spec (implemented)
- Thyroid (renewable): Safeway call at ≤7 days
- Inspiolto (non-renewable): Dr. Jones amber ≤20 days, red ≤7 days; Safeway ≤7 days
- Pulmicort (non-renewable): Dr. Jones amber ≤20 days, red ≤7 days; Safeway ≤7 days

## GitHub Push Workflow
```bash
cd ~/Documents/Studio/Projects/Health
git add .
git commit -m "message"
git push
```
