class App.AddVehicleView extends Thorax.View
  name: 'add_vehicle'

  events:
    'submit form': 'createVehicle'

  createVehicle: (e) ->
    e.preventDefault()
    model = new App.Vehicle @serialize()

    @listenToOnce model, 'sync', ->
      App.router.redirectTo "vehicles/#{model.id}"

    if model.isValid()
      @collection.create model
      @parent.close()
    else
      _.each model.validationError, (error) =>
        @$("[name=#{error.name}]").closest('.form-group')
          .addClass('has-error')
