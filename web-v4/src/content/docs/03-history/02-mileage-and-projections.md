---
title: Mileage and projections
---



Spanner estimates where each vehicle's mileage will be in the future, based on record history. This estimate is called the [Projection](/docs/concepts#projection).

## How it works

The Projection is derived from records. Each record contributes a `(date, mileage)` point. Spanner computes a weighted average rate across the most recent periods and projects forward:

- **Estimated mileage** - the odometer reading projected to today
- **Miles per day** - the weighted average daily mileage
- **Miles per year** - the daily rate annualized (miles per day times 365)

The Projection drives mileage-based [Reminders](/docs/concepts#reminder) and [Service Schedules](/docs/concepts#service-schedule).

If the estimated mileage differs from the actual odometer, use **Mileage Adjustment** from the vehicle's menu to record the real reading. The Projection recalculates from the new data point.

## Notes

A vehicle needs at least two records for the Projection to compute a rate. With one record, no rate is available - the estimated mileage falls back to that record's mileage.

Records can be added out of order. The Projection uses record dates, not creation order. The most recent 10 records are weighted into the rate, with newer records carrying more weight.
