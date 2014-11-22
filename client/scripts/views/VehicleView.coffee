class App.VehicleView extends Thorax.View
  name: 'vehicle'
  id: 'vehicle'

  events:
    'click #header .name': 'showChangeNamePopover'
    'click #header .vehicles': 'showVehiclesPopover'

  initialize: (id) ->
    @vehicles = new App.Vehicles

    @listenTo @vehicles, 'sync', ->
      @setModel @vehicles.get(id)
      @setCollection new App.Records

      @listenTo @model, 'change', @render

    @vehicles.fetch()

  showVehiclesPopover: (e) ->
    e.preventDefault()
    view = new App.UIPopoverView
      name: 'vehicles_list'
      target: e.currentTarget
      collection: @vehicles
    view.attach()

  showChangeNamePopover: (e) ->
    e.preventDefault()
    view = new App.UIPopoverView
      name: 'rename_vehicle'
      target: e.currentTarget
      value: @model.get('name')
      model: @model
    view.attach()
