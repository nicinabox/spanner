class App.EditVehicleView extends Thorax.View
  name: 'edit_vehicle'

  events:
    'submit form': 'saveVehicle'

  saveVehicle: (e) ->
    e.preventDefault()
    @model.save @serialize()
    @parent.close()
