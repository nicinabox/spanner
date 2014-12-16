class App.EditVehicleNotesView extends Thorax.View
  name: 'edit_vehicle_notes'

  events:
    'submit form': 'saveVehicle'
    'rendered': ->
      _.delay =>
        @$('textarea').autosize()

  saveVehicle: (e) ->
    e.preventDefault()
    @model.save @serialize()
    @parent.close()
