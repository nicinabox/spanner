class App.VehicleView extends Thorax.View
  name: 'vehicle'
  id: 'vehicle'

  events:
    'click #header .name': 'showChangeNamePopover'

  initialize: (id) ->
    @collection = new App.Vehicles

    @listenTo @collection, 'sync', ->
      @setModel @collection.get(id)

      @listenTo @model, 'change', @render

    @collection.fetch()

  showChangeNamePopover: (e) ->
    e.preventDefault()
    view = new App.UIPopoverView
      title: 'Rename vehicle'
      name: 'rename_vehicle'
      target: e.currentTarget
      value: @model.get('name')
      model: @model
    view.render()
