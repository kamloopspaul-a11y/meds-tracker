# JOURNAL — Health

*Append-only session log. Newest entries at the top.*

---

## 2026-06-06

**Did:**
- Diagnosed and fixed a day-rollover bug: `todayStr()` was using `toISOString()` (UTC date) instead of the device's local date. Pacific is UTC-7, so the day boundary was rolling over around 5pm local instead of midnight — causing the toggle/lock state to reset or stick at the wrong times. Symptom Paul hit: app showed the correct current date but toggles were already locked as "taken" this morning (leftover state from the previous evening, carried over because the UTC-derived date string happened to coincide with today's local date).
- Replaced `todayStr()` with a version built from `getFullYear()/getMonth()/getDate()` — uses the phone's local wall-clock date, follows PST/PDT (DST) automatically, no hardcoded time zone needed.
- As a side effect, this also fixes a latent inconsistency in `daysUntil()`, which was comparing a UTC-derived date string against a locally-parsed `Date` object.
- Bumped service worker cache name `meds-v1` → `meds-v2` in `sw.js` so the cache-first SW picks up the corrected `index.html` instead of continuing to serve the stale cached version.
- Bumped app version to v2.2 (footer + PROJECT.md).
- Added a Locked Decision: day-rollover anchors to device LOCAL date, not UTC.
- Paul pushed to GitHub; Pages redeploy in progress.

**Decisions:**
- Use device local date for day-rollover (not a hardcoded "PST") — simpler, follows DST automatically, and correctly reflects wherever Paul actually is.
- Did not wipe localStorage — Paul will let tonight's local-midnight rollover clear today's stuck lock naturally.

**Next:**
- Confirm tomorrow morning that toggles reset correctly at local midnight and v2.2 is live (check footer).
- Continue monitoring the Inspiolto Dr. Jones notice (expected ~June 8) and refill cycle (Inspiolto pickup due June 28).

---

## 2026-05-20

**Did:**
- Reviewed HealthBot.txt to understand the Google Sheets + Apps Script medication reminder system built with Gemini.
- Updated PROJECT.md: added full HealthBot section (sheet structure, triggers, iPhone cheat codes, safeguards), revised Next Steps item 3 to reflect prescription renewal reminder plan, and added Gmail CSS constraints warning under email styling.

**Learned:**
- HealthBot sends bundled AM (07:00) and PM (19:00) reminder emails; replies parsed every 5 minutes.
- Email styling deferred until real-world behaviour observed; Gmail inline-only CSS constraint noted for future reference.
- Renewal reminder automation pending sufficient dose-count data in Settings sheet.

**Next:**
- Observe incoming HealthBot emails before attempting any styling.
- Update Settings sheet dose counts to eventually enable automated renewal alerts.

---

## 2026-04-26

**Did:**
- Added JOURNAL.md as part of the new memory system rollout. Existing PROJECT.md left untouched.

**Learned:**
- Folder also contains the SAIL HAP Levels 1-3 PDFs and the Pulmonary Rehabilitation Education .docx as reference material.

**Next:**
- Research and discussion phase. PROJECT.md may need expansion.

---

---

## 2026-05-22

**Did:**
- Reviewed available tools and connectors for the Health project.
- Brainstormed HealthBot email enhancements: air quality report, dose pacing flag, symptom snapshot, exercise prompt, weekly digest.
- Discussed diagnostics interface — concluded a PWA (Phase 2) is the right home for charts and trends; Gmail's JavaScript restriction rules out interactive email.
- Mapped out exercise tracking: TCC baseline (8 → 10 laps by June 18), MacArthur Island outdoor alternative (3.2km loop), Apple Watch as future data source.
- Framed Exercise Coach as a Phase 3 build — structured routines, breathing exercises, COPD-aware pacing; noted marketability potential in pulmonary rehab space.
- Added Ideation section to PROJECT.md.

**Next:**
- Air quality integration is the most immediately useful HealthBot enhancement — good candidate for next session.
- Begin sketching diagnostics PWA structure when ready to move to Phase 2.


---

## 2026-05-26

**Did:**
- Reviewed current HealthBot status: Health Assistant Bot has 100% error rate on parseIncomingReplies — reply parsing is broken.
- Diagnosed root problem: using email as both notification and response channel for the same Gmail account — noisy (4 emails × 2/day) and fragile.
- Discussed toggle-switch email idea — ruled out: email is stateless, AMP for Email too complex for personal use.
- Settled on PWA web push notifications as the right architecture to replace the email system.
- Confirmed iPhone 15 Plus (iOS 17) fully supports PWA push notifications — no workarounds needed. Must add PWA to Home Screen first (Apple requirement).
- Discussed wearables (Apple Watch, Fitbit) — deferred to Phase 3. Fitbit REST API more open than Apple Health.
- Noted Paul is exploring reducing T-meds holistically — tracker should accommodate medication changes over time.

**Decisions:**
- Email reminder system to be retired once PWA push is ready.
- Core loop: push notification → one-tap confirm → Apps Script POST → Sheets log.
- Dashboard (Phase 2) replaces re-reading emails for status.
- Wearable integration is Phase 3, device TBD.

**Open questions:**
- Notification times (suggestion: 8 AM / 6 PM)?
- Evening habit anchor for inhaler stack?
- Wearable device decision?

**Next:**
- Decide on notification times and evening anchor.
- Begin Phase 1 PWA build in a dedicated session.
- Air quality integration (from May 22 session) still queued — could fold into dashboard Phase 2.

---

## 2026-05-27

**Did:**
- Updated `PROJECT.md` to include a medication refill schedule noting the prescribing physician and pharmacy contact information.

**Note:**
- No code or tool changes. Pure reference update to PROJECT.md for operational use.

**Next:**
- Continue Phase 1 PWA push notification build when ready.

---

## 2026-06-05

**Did:**
- Built Meds Tracker PWA v1.0 — Phase 1 complete.
- Created: `index.html`, `manifest.json`, `sw.js`, `Code.gs`
- Architecture: 3 locking toggles (T Pills AM, Inspiolto AM, Inspiolto PM) + localStorage state + Apps Script/Sheets backend for history log.
- Each toggle locks after POST for the day. All 3 locked = "All done today ✓" banner. Auto-resets on new day via date comparison.
- History view (last 14 days) in collapsible section below toggles.
- Discussed adding refill reminder cards to the dashboard.

**Refill Reminder Spec (agreed, not yet built):**
- T Pills (90-day, renewable): single alert 5 days before NextRefill → "Call Safeway"
- Inspiolto (30-day, non-renewable): 20-day alert → "Call Dr. Jones for Rx"; 5-day alert → "Call Safeway"
- Pulmicort (100-day, non-renewable): 20-day alert → "Call Dr. Jones for Rx"; 5-day alert → "Call Safeway"
- Implementation: second Sheets tab "Refills" — Med | NextRefill | DaysRxWarning | DaysFillWarning | Renewable
- Alert cards appear above toggles; amber = Rx call, red = fill call. Persistent — no dismiss.
- Paul to confirm before building.

**Files created:**
- `Projects/Health/index.html`
- `Projects/Health/manifest.json`
- `Projects/Health/sw.js`
- `Projects/Health/Code.gs`

**Still needed before deploy:**
- Paul deploys Apps Script, copies URL into `index.html` (SCRIPT_URL constant)
- Create new Google Sheet "Meds Tracker", paste Code.gs
- Push to GitHub, enable GitHub Pages
- Add two placeholder icons (icon-192.png, icon-512.png)
- Add to iPhone Home Screen via Safari

**Next:**
- Confirm refill reminder spec → add Refills tab to Sheet + update Code.gs + add reminder cards to index.html
- Consider notification times / push notifications (deferred from May 26 session — still open)

---

## 2026-06-05

**Did:**
- Redesigned UI: dropped marquee idea in favour of a static notice area above the toggles.
- Renamed toggles: T Pills AM → Thyroid, Inspiolto AM/PM → A.M. Inhalers / P.M. Inhalers (each covers both Inspiolto + Pulmicort together).
- Built notice system: amber ⚠️ Dr. Jones warning at ≤20 days, red 🚨 urgent at ≤7 days (non-renewable inhalers only); red 💊 Safeway call at ≤7 days (all meds); red ❗ overdue.
- Replaced hardcoded refill dates with localStorage-backed refill tracking. Seed dates from config on first run; "Picked up ✓" button per med advances nextRefill by daysSupply. No code changes needed after deploy.
- Added collapsible ▸ Refill Dates section with per-med status and pickup button.
- Bumped to v2.1.
- Created Google Sheet "Meds Tracker" (tab: Log) via Chrome.
- Deployed Apps Script as Web App (Execute as Me / Anyone) and wired URL into index.html.
- Generated placeholder icons (icon-192.png, icon-512.png) — green pill design.
- Created GitHub repo kamloopspaul-a11y/meds-tracker, pushed all files, enabled GitHub Pages.
- App live at: https://kamloopspaul-a11y.github.io/meds-tracker/
- Paul added to iPhone Home Screen via Safari.

**Decisions:**
- No marquee — notices only, static and persistent.
- Toggles reset at midnight device time (localStorage date comparison).
- "Picked up ✓" should be tapped when starting a new supply, not at pharmacy pickup, to keep cycle dates accurate.
- Manual pickup recording preferred over auto-advance.
- Push notifications deferred — still open from May 26.

**Open questions / deferred:**
- Push notifications (PWA web push) — still queued from May 26 session.
- Button label "Picked up ✓" may be changed to "Started new supply" — deferred, Paul will remember for now.
- Air quality integration — still queued from May 22 session.

**Next:**
- Monitor app in daily use. Watch for Inspiolto Dr. Jones notice firing around June 8.
- Tap "Picked up ✓" when starting new Inspiolto supply (due June 28).
- Consider push notifications when ready to move to Phase 2.

---

## 2026-06-07

**Did:**
- Fixed a copy-paste bug in `index.html`: the `SCRIPT_URL` placeholder check was comparing the URL to itself, always true — this caused "Apps Script URL not set" on History AND silently blocked `postToSheets()` from logging any dose taps since deploy.
- Increased font size of "▸ Refill Dates" / "▸ History" summary links + icons from 0.85rem to 1rem (~12pt).
- Removed the duplicate disclosure-triangle icon on those two links (native `<summary>` marker was showing alongside the typed ▸).
- Redesigned the refill workflow: replaced the single "Picked up ✓" button (which read like a status, not an action) with a 3-stage cyclic status button — **Filled** (dimmed/default) → **Renew Meds** (amber, auto-activates ~20 days before due) → **Ordered** (green, pending pickup) → tap to confirm pickup, which advances the date and resets to Filled. Same button footprint throughout — fixed layout preserved. Applies uniformly to all 3 meds (Thyroid included, anticipating future Dr. involvement in renewal).
- Bumped version: v2.2 → v2.3 → v2.4, each pushed and deployed via GitHub Pages.

**Verification:**
- Paul tested live app: locks function correctly, History link no longer errors (pending first entries — Sheet was empty since no doses had logged due to the bug).
- Note: dose taps prior to the fix (including the morning of June 7) were not recorded in the Sheet's Log tab — this is expected and not a data-loss concern, just nothing was ever sent.

**Status:** App stable at v2.4. No open issues.

**Next:**
- Watch for first History entries to populate as new dose taps log correctly.
- Tap "Renew Meds" / "Ordered" through the new refill cycle as real renewal dates approach (Inspiolto due June 28).
- Push notifications (Phase 2) and other deferred items remain queued.

---

## 2026-06-08

**Issue reported:** Paul noticed the Sheet's Log tab still had nothing recorded, despite the v2.4 SCRIPT_URL fix on June 7.

**Diagnosis (used Chrome to call the live Apps Script directly from the page context):**
- GET `?action=history` worked fine (200 OK).
- POST with `Content-Type: application/json` failed every time with `TypeError: Failed to fetch` — silently swallowed by `.catch(() => {})` in `postToSheets()`.
- Root cause: a JSON-typed POST is a CORS "non-simple" request, so the browser sends an OPTIONS preflight first. Apps Script web apps don't respond to OPTIONS, so the preflight fails and the browser never sends the real POST. This was the actual reason nothing was ever logged — separate from (and masked by) the June 7 SCRIPT_URL bug.
- Secondary issue found while testing: Google Sheets auto-converts `"2026-06-08"` / `"09:15"` style strings into real Date/Time values on write (via `appendRow`/`setValue`, regardless of column number-format), which would have corrupted the History view's date filter and display once logging started working.

**Fixes (v2.5):**
- `index.html` — changed `postToSheets()`'s `Content-Type` from `application/json` to `text/plain;charset=utf-8`. This is a CORS "simple" content type so no preflight is sent; `e.postData.contents` server-side is unaffected (still the raw JSON string, `JSON.parse()` works the same).
- `Code.gs` — `doGet()` now normalizes any Date-typed cells back to `yyyy-MM-dd` / `HH:mm` strings via `Utilities.formatDate()` before filtering/sorting, so History stays correct regardless of how Sheets stored the value.
- `sw.js` — bumped cache name `meds-v2` → `meds-v2-5` to bust the old cached `index.html` on Paul's phone.
- Cleaned up the Sheet: removed test rows written during diagnosis, added the missing `Date | Time | Med` header row (the sheet had been created via the Chrome UI without one — `getSheet()` only adds it when creating a brand-new sheet), and set columns A:B to Plain Text format.

**Action needed from Paul:**
- Open the Apps Script project (Extensions → Apps Script from the Sheet, or the project URL), paste in the updated `Code.gs`, and redeploy (Deploy → Manage deployments → Edit → New version) so the History normalization takes effect. The dose-logging fix itself (in `index.html`) needs no Apps Script redeploy — it'll work as soon as GitHub Pages serves the new file and the service worker updates.
- After GitHub Pages updates, fully close and reopen the PWA on the iPhone (or wait for the new service worker to activate) so the new `index.html`/`sw.js` load.

**Status:** v2.5 pushed. Watching for first real History entries to confirm end-to-end.
