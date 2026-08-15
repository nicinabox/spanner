---
title: Importing and exporting
---



Move a vehicle's history into or out of Spanner using CSV files. Importing replaces all existing records for the vehicle; exporting downloads them as a CSV.

## In the app

Open a vehicle from the [Vehicles page](/vehicles), then go to **Transfer** (Select vehicle > Transfer). The page has two sections: Export History and Import History.

## Export

Export downloads your vehicle's complete history as a CSV file. The file contains every record for the selected vehicle.

The CSV format:

```
date,cost,mileage,notes
2024-01-15,45.00,52500,"Oil change"
2024-06-20,,54200,"Tire rotation"
```

Columns:

- **date** - when the service was performed (YYYY-MM-DD)
- **cost** - optional, in your account's currency
- **mileage** - odometer reading at the time of service, in the vehicle's distance unit
- **notes** - optional free-text

## Import

Import reads a CSV file and replaces all existing records for the vehicle. There is no merge mode.

The expected format is the same as the export format above. Dates must be `YYYY-MM-DD`. Mileage and date are required; cost and notes are optional.

A toggle in the form lets you declare the data is from [Fuelly](https://fuelly.com). Fuelly exports use a different column layout, so the importer parses it differently when this is on.

## Notes

Importing is destructive. The warning in the form is not decorative - existing records are removed before the new ones are added.

Classifications, reminders, and service schedules are not affected by import. Only records change.
