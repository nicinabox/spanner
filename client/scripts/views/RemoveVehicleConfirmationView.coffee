class App.RemoveVehicleConfirmationView extends Thorax.View
  name: 'remove_vehicle_confirmation'

  events:
    'submit form': 'removeVehicle'

  initialize: ->
    @confirmation_word = 'delete'

  removeVehicle: (e) ->
    e.preventDefault()
    data = @serialize()

    if data.confirmation == @confirmation_word
      @model.destroy()
      App.router.redirectTo 'vehicles'
