class App.VehicleView extends Thorax.View
  name: 'vehicle'
  id: 'vehicle'

  events:
    'click #header .name': 'showChangeNamePopover'
    'click #header .vehicles': 'showVehiclesPopover'

  initialize: (id) ->
    @collection = new App.Vehicles

    @listenTo @collection, 'sync', ->
      @setModel @collection.get(id)

      @listenTo @model, 'change', @render

    @collection.fetch()

  showVehiclesPopover: (e) ->
    e.preventDefault()
    view = new App.UIPopoverView
      name: 'vehicles_list'
      target: e.currentTarget
      collection: @collection
    view.attach()

  showChangeNamePopover: (e) ->
    e.preventDefault()
    view = new App.UIPopoverView
      name: 'rename_vehicle'
      target: e.currentTarget
      value: @model.get('name')
      model: @model
    view.attach()
