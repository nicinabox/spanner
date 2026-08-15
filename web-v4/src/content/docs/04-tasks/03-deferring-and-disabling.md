---
title: Deferring and disabling
---



Service Schedules can be postponed (deferred) without deleting them. Deferring preserves the schedule's history.

## In the app

Open a vehicle from the [Vehicles page](/vehicles), then go to **Tasks** (Select vehicle > Tasks). Each schedule row has a **Defer** action.

## How it works

### Deferring

A [deferral](/docs/concepts#deferral) sets how far in the future the next-due date and mileage should sit, measured from today. The Defer form accepts:

- **Months** - pushes the next-due date forward by N months from today
- **Distance** - pushes the next-due mileage forward by N miles from where the schedule would otherwise land

Either or both can be set. The schedule continues to be active and will trigger at the deferred date or mileage.

Each defer overwrites the previous one - the values are absolute, measured from today, not stacked on top of earlier defers.

### Removing a defer

Picking **Defer** again and clearing the months and distance fields, or saving the schedule's edit form, removes the deferral. The schedule reverts to its computed next-due values.

### Deleting

Deleting removes a service schedule permanently. Use this only if the service type is no longer being tracked for the vehicle. Edit the schedule from its edit page to delete it.

## Notes

The schedule's history (when it last fired, deferral state, classifications) is preserved across defers. Deleting is the only operation that removes the schedule and its history.
