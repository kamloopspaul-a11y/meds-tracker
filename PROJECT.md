# PROJECT.md — Meds Tracker PWA

## Overview
A Progressive Web App for tracking daily medications and prescription renewal dates. Installed on iPhone Home Screen via Safari / GitHub Pages.

**Live URL:** https://kamloopspaul-a11y.github.io/meds-tracker/
**GitHub:** https://github.com/kamloopspaul-a11y/meds-tracker
**Google Sheet:** Meds Tracker (Log tab)
**Apps Script URL:** https://script.google.com/macros/s/AKfycbxcLD26lSIIWg1mG7WfpZOS8kdAKGpOjBnaBOLFphM0vEDzP3S7dRXSDO4GpeJCRXGNhQ/exec

## Current Version
v2.2 — deployed June 6, 2026

## Stack
- `index.html` — single-file PWA (HTML + CSS + JS)
- `manifest.json` — installable PWA manifest
- `sw.js` — service worker (offline support)
- `Code.gs` — Google Apps Script (Web App, Execute as Me / Anyone)
- Google Sheet "Meds Tracker" (tab: Log) — permanent dose log
- localStorage — toggle state (resets midnight) + refill dates

## Layout
```
[ Notice area ]     ← amber/red cards, only visible when triggered
[ Thyroid ]         ← once daily, morning — Methimazole + Propranolol
[ A.M. Inhalers ]   ← morning — Inspiolto + Pulmicort
[ P.M. Inhalers ]   ← evening — Inspiolto + Pulmicort
[ ▸ Refill Dates ]  ← collapsible, Picked up ✓ button per med
[ ▸ History ]       ← last 14 days, loaded on demand from Sheets
```

## Notice Thresholds
- Dr. Jones amber: ≤20 days (non-renewable: Inspiolto, Pulmicort)
- Dr. Jones red: ≤7 days (non-renewable)
- Safeway call: ≤7 days (all meds)
- Overdue: past nextRefill date

## Refill Config (seed dates — update after each pickup)
| Med | daysSupply | nextRefill | Renewable |
|-----|-----------|------------|-----------|
| Thyroid Meds | 90 | 2026-07-15 | Yes |
| Inspiolto Respimat | 30 | 2026-06-28 | No |
| Pulmicort Turbuhaler | 100 | 2026-07-28 | No |

**Important:** Tap "Picked up ✓" when you START the new supply, not at pharmacy pickup. This keeps the cycle dates accurate.

## Medications
- **Thyroid:** Methimazole + Propranolol — once daily, morning
- **Inspiolto Respimat:** 2 puffs AM + PM — non-renewable Rx (Dr. Jones)
- **Pulmicort Turbuhaler:** 2 puffs AM + PM — non-renewable Rx (Dr. Jones)
- **Prescribing physician:** Dr. Jones
- **Pharmacy:** Safeway (Fortune Drive)

## Locked Decisions
- No marquee — static notice cards only
- Toggles lock on tap, reset at midnight (device clock, Pacific time)
- Manual pickup recording (no auto-advance)
- localStorage is source of truth for daily state; Sheets is permanent log
- Day-rollover uses device LOCAL date (not UTC) — anchors midnight reset to Pacific time and follows DST automatically
- Dose logging: instant POST to Apps Script on each toggle tap
- History: lazy-loaded from Sheets when section is opened

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
