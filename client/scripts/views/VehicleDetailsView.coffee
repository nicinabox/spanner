class App.VehicleDetailsView extends Thorax.View
  name: 'vehicle_details'

  initialize: (id) ->
    @vehicles = App.vehicles
    $.when(@vehicles.fetch()).then =>
      @model = @vehicles.get(id)

      @vehicleHeaderView = new App.VehicleHeaderView
        model: @model

      @render()
