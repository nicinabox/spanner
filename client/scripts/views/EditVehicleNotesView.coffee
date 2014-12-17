class App.EditVehicleNotesView extends Thorax.View
  name: 'edit_vehicle_notes'

  events:
    'submit form': 'save'
    'rendered': ->
      _.delay =>
        @$('textarea').autosize()

  save: (e) ->
    e.preventDefault()
    @model.save @serialize()
    @parent.close()
