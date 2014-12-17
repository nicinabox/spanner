class App.VehicleNextActionsView extends Thorax.View
  name: 'vehicle_next_actions'

  initialize: ->
    @schedule = new App.MaintenanceSchedule [], vehicleId: @model.id

    if !@schedule.length
      _scheduleFetch = @schedule.fetch()

    if !@collection.length
      _collectionFetch = @collection.fetch()

    $.when(_scheduleFetch, _collectionFetch).then =>
      @nextActions = @schedule.nextActions(
        @collection.currentEstimatedMileage()
        @collection.recentMilesPerDay()
      )

      @render()
