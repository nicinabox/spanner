class App.VehicleSettingsView extends Thorax.View
  name: 'vehicle_settings'

  events:
    'click .remove-vehicle': 'removeVehicle'

  removeVehicle: (e) ->
    e.preventDefault()
    if confirm 'Are you sure you want to remove this vehicle?'
      @model.destroy()
      App.router.redirectTo 'vehicles'
