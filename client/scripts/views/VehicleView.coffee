class App.VehicleView extends Thorax.View
  name: 'vehicle'
  id: 'vehicle'

  events:
    'click #header .name': 'showChangeNamePopover'
    'click #header .vehicles': 'showVehiclesPopover'
    'click #header .settings': 'showSettingsPopover'
    'click .add-service': 'showAddServicePopover'
    'keyup #filter': 'filterRecords'
    'submit #header form': (e) -> e.preventDefault()

  initialize: (id) ->
    @vehicles = new App.Vehicles

    @listenTo @vehicles, 'sync', ->
      @setModel @vehicles.get(id)
      @setCollection new App.Records vehicle_id: id

      @listenTo @model, 'change', @render
      @listenTo @collection, 'sync change', ->
        @model.set records: @collection.groupByYear()

      @collection.fetch()

    @vehicles.fetch()

  filterRecords: (e) ->
    val = e.currentTarget.value
    re  = new RegExp val, 'i'

    @$('#records tr').each ->
      $this   = $(this)
      content = $this.text()

      $this.hide()
      $this.show() if re.test(content)

  showAddServicePopover: (e) ->
    e.preventDefault()
    view = new App.PopOverView
      title: 'Add Service'
      elem: e.currentTarget
      child: new App.AddServiceView
        collection: @collection
        model: @model
    view.attach()

  showVehiclesPopover: (e) ->
    e.preventDefault()
    view = new App.PopOverView
      elem: e.currentTarget
      child: new App.VehiclesMenu
        collection: @vehicles
    view.attach()

  showChangeNamePopover: (e) ->
    e.preventDefault()
    view = new App.PopOverView
      elem: e.currentTarget
      title: 'Rename Vehicle'
      child: new App.RenameVehicleView
        model: @model
    view.attach()

  showSettingsPopover: (e) ->
    e.preventDefault()
    view = new App.PopOverView
      elem: e.currentTarget
      title: 'Vehicle Settings'
      child: new App.VehicleSettingsView
        model: @model
    view.attach()
