class App.VehiclesView extends Thorax.View
  name: 'vehicles'
  id: 'vehicles'

  events:
    'click .add-vehicle': 'showAddVehiclePopover'
    'rendered': 'sortable'

  sortable: ->
    _.defer =>
      collection = @collection
      @$('#vehicles-menu').sortable
        placeholder: "sortable-placeholder col-md-3"
        update: (e, ui) ->
          $(this).children().each (i, el) ->
            model = $(el).model()
            model.save position: i
          collection.sort()

  initialize: ->
    @collection = App.vehicles
    @sessionView = new App.SessionView

  saveVehicle: (e) ->
    e.preventDefault()
    @collection.create @serialize(e)
    e.target.reset()

  showAddVehiclePopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      elem: e.currentTarget
      title: 'Add Vehicle'
      top: -5
      view: new App.AddVehicleView
        collection: @collection
