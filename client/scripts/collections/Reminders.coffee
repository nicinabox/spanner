class App.Reminders extends Thorax.Collection
  model: App.Reminder
  url: ->
    "/api/vehicles/#{@vehicleId}/reminders"

  initialize: (models, options) ->
    @vehicleId = options.vehicleId
