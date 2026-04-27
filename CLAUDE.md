# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

No test runner is configured. Type-check via `npx tsc --noEmit`.

## Architecture

React + Vite PWA. **All data lives in `localStorage`** — there is no backend in this repo. The app is installable on iPhone via Safari → Share → Add to Home Screen.

### Data flow

`useSchedule.ts` is the single state hub. It:
1. Loads `ScheduleStore` (keyed by `YYYY-MM-DD`) from `localStorage` via `storage.ts`
2. Runs `migrateStore()` to apply any pending schema migrations
3. Seeds today and any pre-built dates from `defaultSchedule.ts` if they're missing
4. Exposes block CRUD, date navigation, and day-note helpers to `SchedulePage.tsx`

Navigation is restricted to today and future only (`canGoPrev = currentDate > todayStr()`).

### Adding or updating a pre-built schedule

1. Add a `getAprXXSchedule()` function in `defaultSchedule.ts` using the `b()` helper
2. Register the date in `CUSTOM_SCHEDULE_DATES` and the `getDefaultSchedule()` switch
3. Bump `CURRENT_VERSION` in `migrateStore()` and add a migration step that deletes the old date so the new default seeds on next load

### Category color system (V2 warm palette)

Defined in `categoryConfig.ts`. Four legend groups:
- `work` → sage green `#c8d8c0`
- `fitness` → blue `#ccd4e0` (legend label: "Wellness / Breaks")
- `appointment`, `errand`, `social` → rose `#e0cdd4` (legend label: "Out & About")
- `key` → gold `#e0d0bc` (label: "Key Moments")
- `home`, `drive` → neutral parchment `#faf7f2` — **hidden from legend**

Current-time highlight deepens the row's own category color (no red line).

### Path alias

`@/` resolves to `src/` (configured in `vite.config.ts`).

---

## Scheduling rules (apply when building schedules for the user)

**Sections**
- Weekdays (Mon–Fri): Morning (pre-9 AM), Work (9 AM–5 PM), Evening (5 PM+)
- Weekends: Morning, Afternoon, Evening
- Everything between 9 AM and 5 PM on weekdays goes in the Work section — including outdoor walks, lunch, and mid-day workouts

**Recurring patterns**
- Outdoor walks: 3 per day on weekdays (Work section mental breaks); 1 on weekends
- ZIIP Halo: 20 min, bare face — always paired with bedtime or morning routine, never standalone mid-day
- Red light therapy: same bare-face window as ZIIP Halo when scheduled together

**Errands / Out & About blocks**
- Include address in the amber badge for any standalone store or venue with multiple locations (Costco, Whole Foods, Firebirds, etc.)
- Stores inside a shared mall (Apple Store, Sephora, Mango at Tysons) do not need individual addresses — note the mall name in the subtitle
- Cluster errands by geography; fresh/frozen grocery stores (Costco, Whole Foods) always go last
  - Nearest Whole Foods: 600 H St NE, DC 20002 (0.6 mi from home)
  - Nearest Costco: 1200 S Fern St, Arlington, VA 22202 (~4 mi, Pentagon City)

**Survey workflow**: when user says "check my survey" → query production DB:
```
executeSql({ sqlQuery: "SELECT data FROM surveys ORDER BY submitted_at DESC LIMIT 1", environment: "production" })
```
Then build and implement the schedule directly.

## Deployment

The repo is hosted at GitHub (`chaerobin/dailyscheduleee`) and auto-deploys to Netlify on push to `main`. The active codebase is the root-level `src/`.

The `Daily-Planner-View/` directory is **not part of the Vite build** — ignore it.
