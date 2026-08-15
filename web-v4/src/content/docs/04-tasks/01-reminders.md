---
title: Reminders
---



A reminder is a one-shot trigger attached to a vehicle. When the trigger condition is met, Spanner sends an email. Reminders remain in the list after they fire.

## In the app

Open a vehicle from the [Vehicles page](/vehicles), then go to **Reminders** (Select vehicle > Reminders). The list and add action live there.

## How it works

A reminder has a trigger, one of:

- **Date** - fires on the given calendar date
- **Mileage** - fires when the vehicle's [Projected](/docs/concepts#projection) mileage reaches the threshold
- **Date or mileage** - fires when either condition is met (whichever comes first)

A reminder fires when its date arrives. Date reminders fire once on that date and stop. Mileage reminders fire repeatedly as the Projection updates and the mileage threshold is crossed.

Reminders remain in the list after firing. To re-arm or remove a reminder, edit it from the Reminders tab and save or delete it.

## Notes

Mileage triggers depend on the [Projection](/docs/concepts#projection). A vehicle with no record history will not fire mileage reminders.
