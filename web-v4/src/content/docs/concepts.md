---
title: Concepts
---

Definitions for terms used throughout Spanner. Alphabetized.

## Classification

A user-defined tag that groups related records: oil change, tire rotation, brake service. Each vehicle has its own set of classifications. Records can carry one or more classifications. A Service Schedule is bound to a single classification.

See: [Classifications](/docs/history/classifications)

## Deferral

A state on a Service Schedule that pushes the next-due values forward in time. Deferring by months moves the next due date forward by that many months from today. Deferring by distance moves the next due mileage forward by that many miles.

See: [Deferring and disabling](/docs/tasks/deferring-and-disabling)

## Projection

A calculated estimate of where a vehicle's mileage will be in the future. Based on record history, it produces an estimated current mileage, a daily mileage rate, and an annual mileage rate. The Projection drives mileage-based reminders and service schedules.

See: [Mileage and projections](/docs/history/mileage-and-projections)

## Record

A maintenance event for a vehicle: oil change, tire rotation, brake service. Has a date, mileage, optional cost, and notes. Records can carry attachments and classifications.

See: [Logging a record](/docs/history/logging-a-record)

## Reminder

A notification attached to a vehicle. Reminders send on a date, on a mileage threshold, or on whichever comes first, subject to the vehicle's [email preferences](/docs/vehicles/preferences). Date reminders send once on the date. Mileage reminders send each time the projected mileage crosses the threshold. Reminders remain in the list until completed.

See: [Reminders](/docs/tasks/reminders)

## Service Schedule

A vehicle's recurring maintenance pattern, defined by a distance and/or month interval, bound to a classification. Tracks when the next service is due. Resets when a matching record is added.

See: [Service Schedules](/docs/tasks/service-schedules)

## User

A person with a Spanner account. Owns one or more vehicles. Each account is solo: no household or shared-account concept.

## Vehicle

A car, truck, motorcycle, boat, or other tracked asset belonging to a user. Has a name, optional VIN, distance unit (miles, kilometers, hours, or nautical miles), display position, color, free-form notes, and a retired flag. The current mileage is not stored on the vehicle; it comes from records.

See: [Vehicles](/docs/vehicles)
