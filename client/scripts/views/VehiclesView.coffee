class App.VehiclesView extends Thorax.View
  name: 'vehicles'
  id: 'vehicles'

  events:
    'click .add-vehicle': 'showAddVehiclePopover'

  initialize: ->
    @collection = App.vehicles

  saveVehicle: (e) ->
    e.preventDefault()
    @collection.create @serialize(e)
    e.target.reset()

  showAddVehiclePopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      elem: e.currentTarget
      title: 'Add Vehicle'
      view: new App.AddVehicleView
        collection: @collection
