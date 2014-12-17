class App.EditVehicleView extends Thorax.View
  name: 'edit_vehicle'

  events:
    'submit form': 'saveVehicle'

  saveVehicle: (e) ->
    e.preventDefault()
    @model.set @serialize(), validate: true
    if @model.isValid()
      @model.save()
      @parent.close()
    else
      _.each @model.validationError, (error) =>
          @$("[name=#{error.name}]").closest('.form-group')
            .addClass('has-error')
