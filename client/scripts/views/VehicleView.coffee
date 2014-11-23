class App.VehicleView extends Thorax.View
  name: 'vehicle'
  id: 'vehicle'

  events:
    'click #header .name': 'showChangeNamePopover'
    'click #header .vehicles': 'showVehiclesPopover'
    'click .add-service': 'showAddServicePopover'
    'keyup #filter': 'filterRecords'

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

  filterRecords: _.debounce (e) ->
    val = e.currentTarget.value
    re = new RegExp val, 'i'

    @$('#records tr').each ->
      $this = $(this)
      html  = $this.html()

  showAddServicePopover: (e) ->
    e.preventDefault()
    view = new App.UIPopoverView
      name: 'add_service'
      target: e.currentTarget
      collection: @collection
      vehicle_id: @model.id
      submit: (e) ->
        e.preventDefault()
        data = @serialize()
        @collection.create data
        @remove()

    view.attach()

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
