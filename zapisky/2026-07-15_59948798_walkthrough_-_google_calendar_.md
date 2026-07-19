# Zápis z konverzace: Walkthrough - Google Calendar API Integration

**Datum:** 2026-07-15 16:35:18
**ID konverzace:** `59948798-97de-4e50-aad6-edd79c0076fc`
**Odkaz na logy:** [transcript.jsonl](file:///Users/lukasbendik/.gemini/antigravity/brain/59948798-97de-4e50-aad6-edd79c0076fc/.system_generated/logs/transcript.jsonl)

## Zadání uživatele
```text
už by to mělo být aktualizované. je to tak?
```

## Provedené změny (z walkthrough.md)
# Walkthrough - Google Calendar API Integration

We have successfully implemented and verified the direct sync of training plan events to Google Calendar.

## Changes Made

### 1. New Sync Script
- Created [sync_google_calendar.py](file:///Users/lukasbendik/Projects/Run/portal/scripts/sync_google_calendar.py):
  - Authenticates with Google Calendar API using Service Account JSON credentials.
  - Generates stable, base32hex-compliant unique IDs using MD5 hashes (`run-portal-<date>`) to prevent duplicate events on Google Calendar.
  - Builds rich event payloads including daily training metadata, Open-Meteo weather forecasts, and AI coach recommendations.
  - Uses `transparency: transparent` so events are marked as "Free" and do not block the user's availability.
  - Queries Google Calendar for existing events with the shared property `source=run-portal` and automatically deletes any events that are no longer in `plan.json` (rescheduling/deletion cleanup).

### 2. GitHub Actions Workflows
- Updated [.github/workflows/sync.yml](file:///Users/lukasbendik/Projects/Run/.github/workflows/sync.yml):
  - Installed `google-auth` and `google-api-python-client` dependencies.
  - Added a step to run the calendar sync after the intervals sync.
- Updated [.github/workflows/weather.yml](file:///Users/lukasbendik/Projects/Run/.github/workflows/weather.yml):
  - Configured push trigger on `portal/src/data/plan.json` so manual plan updates are immediately pushed to Google Calendar.
  - Installed `google-auth` and `google-api-python-client` dependencies.
  - Added a step to run the calendar sync right after the daily weather updates, ensuring the latest weather and AI recommendations appear on the calendar.

### 4. Event Summary / Title Format Update
- Updated `portal/src/pages/plan.ics.ts` and `portal/scripts/sync_google_calendar.py` to:
  - Remove the prefix type label (e.g. "E", "L", "T") from the event summary.
  - Automatically append the target distance in parentheses (e.g. `(6 km)`) to the event title if `distance_km` is present in the plan day data.

---

## Validation & Verification

1. **Local Dry-Run Verification**:
   - Ran `python3 portal/scripts/sync_google_calendar.py --dry-run` to verify plan parsing and payload generation for all 78 events. Output completed successfully with no errors, confirming correct title formatting (e.g. `Lehký E + strides (6 km)`).
2. **GitHub Actions Run Verification**:
   - Run `29424903561` (`sync-intervals`) and run `29424358123` (`update-plan-weather`) completed successfully in the cloud.
   - Run `29432496381` completed successfully and updated all 78 existing events in the Google Calendar with the new format: `[gcal_sync] Synchronizováno nových událostí: 0, aktualizováno: 78`.

## Checklist úkolů (z task.md)
- [x] Vytvořit script `portal/scripts/sync_google_calendar.py`
- [x] Upravit `.github/workflows/sync.yml`
- [x] Upravit `.github/workflows/weather.yml`
- [x] Otestovat synchronizaci lokálně (dry-run a reálný běh)
- [x] Provést push změn do Git repozitáře

