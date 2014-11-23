class App.AddServiceView extends Thorax.View
  name: 'add_service'

  events:
    'submit form': 'createService'

  createService: (e) ->
    e.preventDefault()
    @collection.create @serialize()
    @parent.close()
