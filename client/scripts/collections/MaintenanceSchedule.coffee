class App.MaintenanceSchedule extends Thorax.Collection
  model: App.MaintenanceAction

  initialize: (options) ->
    @vehicle = options.vehicle
    @fetch() if @vehicle.hasDetails()

  nextActions: ->
    MILEAGE = @vehicle.get('currentEstimatedMileage') || 0
    MPD = @vehicle.get('milesPerDay') || 0

    actions = @map (model) ->
      m             = model.toJSON()
      inNextMileage = m.intervalMileage - (MILEAGE % m.intervalMileage)
      inNextDays    = Math.floor inNextMileage / MPD

      if inNextMileage < MPD * 90 && m.frequency == 4
        m.inNextMileage = inNextMileage
        m.inNextDuration = moment().add(inNextDays, 'days').fromNow()
        m

    _(actions).compact().indexBy('item').values().value()

  fetch: ->
    edmunds = new App.EdmundsApi
      version: 1
      dataset: 'maintenance'
      resource: 'actionrepository/findbymodelyearid'
      params:
        modelyearid: @vehicle.modelYearId()

    edmunds.fetch().done (data) =>
      @reset @parse data

  parse: (data) ->
    data.actionHolder
