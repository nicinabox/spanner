---
title: Correct a mileage projection
---

Goal: bring the vehicle's projected mileage back in line with the real odometer reading without logging a fake service record.

1. Open the vehicle from the Vehicles page.
2. Open the vehicle's menu and choose **Mileage Adjustment**.
3. Enter the current odometer reading.
4. Save.

## What you should see

A mileage-only record is added to the vehicle's history. The Projection recalculates from the new data point, and mileage-based reminders and service schedules re-anchor to the corrected mileage.

## When to use it

Use Mileage Adjustment when you've been driving without logging records and the projected mileage has drifted from reality. It keeps the Projection accurate without cluttering History with a fake service entry.

For ordinary service events, use a regular [record](/docs/guides/log-a-record) instead - records carry context that Mileage Adjustment does not.

## Notes

The mileage-only entry is hidden from History by default. It still feeds the Projection. To make it visible, enable **Show mileage adjustment records** in the vehicle's preferences on the Edit screen.
