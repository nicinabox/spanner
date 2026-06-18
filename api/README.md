# api

## Authentication

All authenticated routes require version in `Accepts` header:

`Accepts: "application/json;version=2"`

### POST /sessions

Sends email with login url

Body

`email`

### GET /sessions/:login_token

Used by login url to authenticate token

### GET /sessions

Returns current user sessions

## Vehicles

### GET /vehicles
### POST /vehicles
### PUT /vehicles/:id
### DELETE /vehicles/:id

## Records

### GET /vehicles/:vehicle_id/records
### POST /vehicles/:vehicle_id/records
### PUT /vehicles/:vehicle_id/records/:id
### DELETE /vehicles/:vehicle_id/records/:id

Records support optional file attachments (receipts, photos, etc.). Attachments
are appended on create/update (existing attachments are not removed). Each file
must be 10MB or smaller. Attachments are stored on local disk in development/test
and in a private S3-compatible bucket (e.g. Railway) in production.

Send attachments as multipart form data under `record[attachments][]`. The
response includes an `attachments` array with each file's `id` (signed), `filename`,
`content_type`, `byte_size`, and a short-lived `url` (presigned in production).

### DELETE /vehicles/:vehicle_id/records/:record_id/attachments/:signed_id

Removes a single attachment from a record.

#### Required environment variables (production)

- `S3_BUCKET_NAME`
- `S3_REGION` (defaults to `us-east-1`)
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_ENDPOINT` (optional; for non-AWS S3-compatible providers)
- `S3_FORCE_PATH_STYLE` (set to `true` for non-AWS providers)

## Reminders

### GET /vehicles/:vehicle_id/reminders
### POST /vehicles/:vehicle_id/reminders
### PUT /vehicles/:vehicle_id/reminders/:id
### DELETE /vehicles/:vehicle_id/reminders/:id
