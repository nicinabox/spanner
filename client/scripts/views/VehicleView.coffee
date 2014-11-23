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
    @vehicles = App.vehicles

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
    App.popover.toggle
      title: 'Add Service'
      elem: e.currentTarget
      view: new App.AddServiceView
        collection: @collection
        model: @model

  showVehiclesPopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      elem: e.currentTarget
      view: new App.VehiclesMenu
        collection: @vehicles

  showChangeNamePopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      elem: e.currentTarget
      title: 'Rename Vehicle'
      view: new App.RenameVehicleView
        model: @model

  showSettingsPopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      elem: e.currentTarget
      title: 'Vehicle Settings'
      view: new App.VehicleSettingsView
        model: @model
