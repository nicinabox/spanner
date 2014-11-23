class App.VehiclesView extends Thorax.View
  name: 'vehicles'
  id: 'vehicles'
  collection: new App.Vehicles

  events:
    'click .add-vehicle': 'showAddVehiclePopover'

  initialize: ->
    @collection.fetch()

  saveVehicle: (e) ->
    e.preventDefault()
    @collection.create @serialize(e)
    e.target.reset()

  showAddVehiclePopover: (e) ->
    e.preventDefault()
    view = new App.PopOverView
      elem: e.currentTarget
      title: 'Add Vehicle'
      child: new App.AddVehicleView
        collection: @collection
    view.attach()
