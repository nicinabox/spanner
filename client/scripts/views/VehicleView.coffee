class App.VehicleView extends Thorax.View
  name: 'vehicle'
  id: 'vehicle'

  events:
    'click #header .name': 'showChangeNamePopover'
    'click #header .vehicles': 'showVehiclesPopover'
    'keyup #filter': 'filterRecords'

  initialize: (id) ->
    @vehicles = new App.Vehicles

    @listenTo @vehicles, 'sync', ->
      @setModel @vehicles.get(id)
      @setCollection new App.Records

      @listenTo @model, 'change', @render

    @vehicles.fetch()

  filterRecords: _.debounce (e) ->
    val = e.currentTarget.value
    re = new RegExp val, 'i'

    @$('#records tr').each ->
      $this = $(this)
      html  = $this.html()

      $this.show()
      unless re.test(html)
        $this.hide()

  , 300

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
