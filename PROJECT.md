# Health — Project Notes

**User:** Paul (kamloopspaul@gmail.com), Kamloops BC
**Started:** April 23, 2026

---

## Conditions

- COPD
- Light asthma
- Hyperthyroidism
- Vitamin B12 deficiency

---

## Current Medications

### Thyroid / Heart
- **Jamp-Methimazole** 10 mg — hyperthyroidism
- **Propranolol** 20 mg — heart

### COPD (Inhalers)
- **Inspiolto Respimat** 2.5 mcg / 2.5 mcg — 60 doses, twice daily
- **Pulmicort Turbuhaler** 100 mcg — 200 doses, twice daily

### Supplements
- **Vitamin D3** — 10,000 IU/day
- **Vitamin K2** — 120 mcg/day
- **Nattokinase** — 100 mg / 2,000 FU, delayed release, daily
- **Creatine** — 1 tsp/day (periodic)
- **Vitamin B12** — needed per bloodwork (not yet started; dose TBD)

---

## Prescription Refills

**Dr. Dana N. Jones RX 4916 — Safeway Pharmacy, Fortune Drive**

| Medication | Renew Every | Next Refill | Notes |
|---|---|---|---|
| Thyroid meds (Methimazole + Propranolol) | 90 days | July 15, 2026 | |
| Inspiolto Respimat | 30 days | June 28, 2026 | Non-renewable — needs new Rx |
| Pulmicort Turbuhaler | 100 days | July 28, 2026 | Non-renewable — needs new Rx |

> **⚠ Inhalers are non-renewable.** Request new prescriptions from Dr. Jones by **July 15, 2026** to cover both inhaler refills.

---

## Interior Health — Pulmonary Rehabilitation

- Classes: Tuesdays & Thursdays, 8 weeks (ended June 18, 2026)
- 4 pre-read files on file in this folder

---

## Future Ideas (Parked)

- **Diagnostics PWA** — adherence dashboard reading from Google Sheets via Apps Script endpoint
- **Air quality alerts** — AQI for Kamloops (wildfire smoke / COPD trigger awareness)
- **Exercise tracking** — TCC laps + MacArthur Island sessions; eventual Apple Watch integration
- **Exercise Coach PWA** — guided workouts with COPD-aware pacing (Phase 3, potentially marketable)

---

## Meds Tracker PWA

**Status:** Phase 1 built (2026-06-05). Not yet deployed.

### Architecture
- Single-file PWA (`index.html`) + `manifest.json` + `sw.js`
- Google Sheets backend via Apps Script (`Code.gs`) — separate sheet from Golf
- localStorage for today's toggle state; Sheets for history log
- Installable on iPhone Home Screen via Safari

### Toggle Behaviour
- 3 toggles: T Pills AM | Inspiolto AM | Inspiolto PM
- Each locks after POST — cannot be undone
- All 3 locked → "All done today ✓" banner
- Auto-resets at next-day open via date comparison

### Deploy Checklist
- [ ] Create Google Sheet "Meds Tracker"
- [ ] Paste Code.gs → Deploy as Web App (Execute as Me, Anyone)
- [ ] Paste deployed URL into `index.html` SCRIPT_URL constant
- [ ] Add icon-192.png + icon-512.png
- [ ] Push to GitHub repo, enable Pages
- [ ] Add to iPhone Home Screen from Safari

### Refill Reminders (spec confirmed, not yet built)
| Med | Supply | Renewable | Rx Alert | Fill Alert |
|---|---|---|---|---|
| T Pills | 90 days | Yes | — | 5 days before |
| Inspiolto | 30 days | No | 20 days before | 5 days before |
| Pulmicort | 100 days | No | 20 days before | 5 days before |

- Stored in Sheets tab "Refills": Med | NextRefill | DaysRxWarning | DaysFillWarning | Renewable
- Amber card = call Dr. Jones. Red card = call Safeway. Persistent, no dismiss.
- Update NextRefill in Sheets after each pickup.
