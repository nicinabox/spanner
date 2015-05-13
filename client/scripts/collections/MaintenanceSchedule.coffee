class App.MaintenanceSchedule extends Thorax.Collection
  model: App.MaintenanceAction
  url: ->
    "/api/vehicles/#{@vehicleId}/maintenance"

  initialize: (models, options) ->
    @vehicleId = options.vehicleId

  nextActions: (mileage, mpd) ->
    RECURRING_ID = 4
    DAYS = 90

    actions = @map (model) ->
      m             = model.toJSON()
      inNextMileage = m.intervalMileage - (mileage % m.intervalMileage)
      inNextDays    = Math.floor inNextMileage / mpd

      if inNextMileage < mpd * DAYS && m.frequency == RECURRING_ID
        m.inNextMileage = inNextMileage
        m.inNextDuration = moment().add(inNextDays, 'days').fromNow()
        m

    _(actions).compact().indexBy('item').values().value()

  parse: (data) ->
    data.actions.actionHolder
