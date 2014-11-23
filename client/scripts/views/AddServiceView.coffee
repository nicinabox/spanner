class App.AddServiceView extends Thorax.View
  name: 'add_service'

  events:
    'submit form': 'createRecord'

  createRecord: (e) ->
    e.preventDefault()
    model = new App.Record @serialize()

    if model.isValid()
      @collection.create model
      @parent.close()
    else
      _.each model.validationError, (error) =>
        @$("[name=#{error.name}]").closest('.form-group')
          .addClass('has-error')
