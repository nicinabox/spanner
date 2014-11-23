class App.AddVehicleView extends Thorax.View
  name: 'add_vehicle'

  events:
    'submit form': 'createVehicle'

  createVehicle: (e) ->
    e.preventDefault()
    @collection.create @serialize()
    @parent.close()
