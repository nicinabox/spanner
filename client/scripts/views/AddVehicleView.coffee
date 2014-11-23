class App.AddVehicleView extends Thorax.View
  name: 'add_vehicle'

  events:
    'submit form': 'createVehicle'

  createVehicle: (e) ->
    e.preventDefault()
    model = new App.Vehicle @serialize()

    if model.isValid()
      @collection.create model
      @parent.close()
      App.router.redirectTo "vehicles/#{model.id}"
    else
      _.each model.validationError, (error) =>
        @$("[name=#{error.name}]").closest('.form-group')
          .addClass('has-error')
