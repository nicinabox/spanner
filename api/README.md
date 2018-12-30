# spanner-api

## API

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

## Reminders

### GET /vehicles/:vehicle_id/reminders
### POST /vehicles/:vehicle_id/reminders
### PUT /vehicles/:vehicle_id/reminders/:id
### DELETE /vehicles/:vehicle_id/reminders/:id

## Jobs

With dokku you need to manage cron manually.

Locally:

    whenever | pbcopy

Edit relevant cron configs on server:

    cd /etc/cron.d

`grep CRON /var/log/syslog` to see the output log for troubleshooting.


## Deploy

    git push dokku master
