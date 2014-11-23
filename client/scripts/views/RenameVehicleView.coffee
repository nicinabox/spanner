class App.RenameVehicleView extends Thorax.View
  name: 'rename_vehicle'

  events:
    'submit form': 'saveVehicle'

  saveVehicle: (e) ->
    e.preventDefault()
    @model.save @serialize()
    @parent.remove()
