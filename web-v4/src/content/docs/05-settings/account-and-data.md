---
title: Account and data
---



Account management and the data Spanner stores for you.

## In the app

The [Settings page](/settings) holds account info, password, email, webhook URL, and account deletion.

## How it works

### Email

Your email is used to log in and to send transactional emails: password resets and maintenance [Reminder](/docs/concepts#reminder) notifications.

### Webhook

A webhook URL receives notifications in addition to email. Use a service like [ntfy.sh](https://ntfy.sh) to forward Spanner notifications to your phone or another channel. The Settings page can generate a random webhook URL for ntfy.

### Deletion

Deleting your account marks it for deletion. You can sign in again within 30 days to restore it. After that window, your email, vehicles, records, classifications, reminders, service schedules, and attachments are permanently removed. Analytics contributions remain in aggregate form but cannot be traced back to you.

### Data

Spanner stores: your email, your vehicles, and your records (including classifications, reminders, and service schedules). Attachments are stored in a private bucket. Analytics are anonymized.

## Notes

There is no household or shared-account concept; each account is solo. Retiring a vehicle is not deletion; see [Editing and retiring](/docs/vehicles/editing-and-retiring).
