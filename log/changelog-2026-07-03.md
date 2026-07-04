# Changelog 2026-07-03

## SplitButton component
- New `SplitButton` component composing Button + Menu
- Exported from lib index, added to UI showcase page
- Visual divider between segments via `gap-px`

## Dialog actions slot
- Added `actions` snippet slot below scrollable content
- Always visible on small screens (not inside scroll area)
- SuggestSchedulesDialog uses it for Cancel/Add buttons

## Unified reminders/schedules view
- Reminders and schedules shown on same page with separate sections
- Reminders section first (stable), Service Tasks below (newer)
- Tab label changed to "Reminders" with combined overdue badge
- Section subtext explains purpose of each
- Icons next to section titles (Bell/Wrench)
- Empty state for each section when the other has items
- VehicleLink badge shows combined overdue count
- Removed standalone reminders tab from nav

## Presets dialog improvements
- Removed category picker screen (split button handles it)
- Removed Back button, added Cancel button
- Interval text uses RefreshCw icon, simplified language
- Title reflects selected type ("Car Tasks")

## Schedule form fixes
- ServiceScheduleForm accepts configurable `action` prop
- Edit page passes `?/update` action
- CompleteScheduleForm closes on successful submit

## Backend: mileage date projection
- Mileage-only schedules now project a due date using vehicle.miles_per_day
- Backfilled existing mileage-only schedules

## Vehicle serializer + data types
- Added service_schedules to VehicleSerializer
- Added serviceSchedules to frontend Vehicle type
- Added getServiceSchedule (singular) data function
