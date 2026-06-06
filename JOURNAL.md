# JOURNAL — Health

*Append-only session log. Newest entries at the top.*

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
