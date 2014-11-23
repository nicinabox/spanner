class App.VehiclesMenu extends Thorax.View
  name: 'vehicles_menu'
  collection: App.vehicles

  events:
    'click .add-vehicle': 'showAddVehiclePopover'

  showAddVehiclePopover: (e) ->
    e.preventDefault()
    App.popover.pushView
      title: 'Add Vehicle'
      view: new App.AddVehicleView
        collection: @collection
