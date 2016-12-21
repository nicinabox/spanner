class App.VehicleDetailsView extends Thorax.View
  name: 'vehicle_details'

  events:
    'click .js-refresh-details': 'refresh'
    'click a[class*=js-]': (e) -> e.preventDefault()

  initialize: (id) ->
    @vehicles = App.vehicles
    if @vehicles.length
      @model = @vehicles.get(id)
    else
      @model = new App.Vehicle id: id
      @model.fetch()

    @listenTo @model, 'change', @render

    @vehicleHeaderView = new App.VehicleHeaderView
      model: @model

  refresh: ->
    @model.save()
