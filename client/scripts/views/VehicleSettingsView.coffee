class App.VehicleSettingsView extends Thorax.View
  name: 'vehicle_settings'

  events:
    'click .remove-vehicle': 'removeVehicle'

  removeVehicle: (e) ->
    e.preventDefault()
    App.popover.pushView
      title: 'Remove Vehicle'
      view: new App.RemoveVehicleConfirmationView
        model: @model
