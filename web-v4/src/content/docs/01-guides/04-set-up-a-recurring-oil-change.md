---
title: Set up a recurring oil change
---



Goal: create a Service Schedule that tracks oil changes for a vehicle.

1. Open the vehicle from the Vehicles page.
2. Go to the **Tasks** tab.
3. Click the add action to open the schedule form.
4. Choose the **oil change** classification.
5. Enter a **distance interval** - for example, every 5000 miles (or kilometers, depending on the vehicle's distance unit).
6. Optionally enter a **month interval** - for example, every 6 months.
   - At least one interval is required. Both can be set; the schedule triggers when either is reached.
7. Save the schedule.

## What you should see

The schedule appears in the vehicle's tasks list with computed next-due date and mileage. These are based on the most recent record tagged "oil change", or, if none exists, the vehicle's estimated mileage.

## What happens next

When you [log a record](/docs/guides/log-a-record) tagged "oil change", the schedule resets. When the next due date or mileage is reached, the schedule shows as due.
