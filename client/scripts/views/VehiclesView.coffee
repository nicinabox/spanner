class App.VehiclesView extends Thorax.View
  name: 'vehicles'
  id: 'vehicles'

  collection: new App.Vehicles

  initialize: ->
    @collection.fetch()

  events:
    'submit form': 'saveVehicle'

  saveVehicle: (e) ->
    e.preventDefault()
    @collection.create @serialize(e)
    e.target.reset()
