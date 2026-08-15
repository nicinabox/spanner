---
title: Service schedules
---



A service schedule is a recurring maintenance pattern bound to a single [Classification](/docs/concepts#classification). When a record with that classification is added, the schedule resets to the next due date and mileage.

## In the app

Open a vehicle from the [Vehicles page](/vehicles), then go to **Tasks** (Select vehicle > Tasks). The list of service schedules and the add action live there.

## How it works

A schedule is defined by:

- **Classification** - what counts as fulfilling the schedule (oil change, tire rotation, etc.)
- **Distance interval** - every N miles (optional)
- **Month interval** - every N months (optional)

At least one interval is required. Both can be set; the schedule triggers when either is reached.

Each schedule tracks `next_due_date` and `next_due_mileage`. These are computed from the most recent record matching the schedule's classification:

- **Distance** - `last_record_mileage + distance_interval`
- **Months** - `last_record_date + month_interval`

Completing the schedule, by adding a record with the matching classification, resets the next-due calculation.

## Notes

One service schedule per classification per vehicle. To change a schedule, edit its intervals; to stop tracking a service type, delete the schedule or [disable it](/docs/tasks/deferring-and-disabling).
