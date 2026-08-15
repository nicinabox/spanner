---
title: Classifications
---



A classification is a tag that groups related records: oil change, tire rotation, brake service. Classifications connect records to Service Schedules.

## In the app

Classifications appear on records in the History table and in the record form. Open a vehicle from the [Vehicles page](/vehicles), then go to **History**. Classifications are also used when configuring [Service Schedules](/docs/tasks/service-schedules).

## How it works

Each vehicle has its own set of classifications. Examples include oil change, tire rotation, and brake service, but the names are user-defined - any per-vehicle list works.

A classification has:

- **Name** - the tag shown on records and used to identify the service
- **Keywords** - phrases that trigger automatic suggestions when a record's notes mention them

Records can carry one or more classifications. The classification list is per-vehicle - what is set up for one vehicle doesn't appear on another.

A [Service Schedule](/docs/concepts#service-schedule) is bound to a single classification. When a record carrying that classification is added, the schedule uses it to compute the next due date and mileage.

## Notes

Spanner can suggest classifications based on a record's notes when keywords match. Suggestions appear beneath the notes field on the record form; they can be accepted or overridden.
