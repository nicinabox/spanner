class App.VehicleDetailsView extends Thorax.View
  name: 'vehicle_details'

  events:
    'click .js-refresh-details': 'refresh'
    'click a[class*=js-]': (e) -> e.preventDefault()

  initialize: (id) ->
    @vehicles = App.vehicles
    $.when(@vehicles.fetch()).then =>
      @model = @vehicles.get(id)

      @listenTo @model, 'change', @render

      @vehicleHeaderView = new App.VehicleHeaderView
        model: @model

      @render()

  refresh: ->
    @model.save()
