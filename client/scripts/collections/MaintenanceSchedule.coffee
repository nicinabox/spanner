class App.MaintenanceSchedule extends Thorax.Collection
  model: App.MaintenanceAction
  url: ->
    "/api/vehicles/#{@vehicleId}/maintenance"

  initialize: (models, options) ->
    @vehicleId = options.vehicleId

    @vehicle = App.vehicles.get(@vehicleId)
    @listenTo App.vehicles, 'sync', ->
      @vehicle = App.vehicles.get(@vehicleId)

  nextActions: ->
    MILEAGE = @vehicle.get('currentEstimatedMileage') || 0
    MPD     = @vehicle.get('milesPerDay') || 0

    actions = @map (model) ->
      m             = model.toJSON()
      inNextMileage = m.intervalMileage - (MILEAGE % m.intervalMileage)
      inNextDays    = Math.floor inNextMileage / MPD

      if inNextMileage < MPD * 90 && m.frequency == 4
        m.inNextMileage = inNextMileage
        m.inNextDuration = moment().add(inNextDays, 'days').fromNow()
        m

    _(actions).compact().indexBy('item').values().value()

  parse: (data) ->
    data.actions.actionHolder
