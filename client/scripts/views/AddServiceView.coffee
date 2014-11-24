class App.AddServiceView extends Thorax.View
  name: 'add_service'

  events:
    'submit form': 'createRecord'

  initialize: ->
    @today = moment().format('YYYY-MM-DD')
    @currentEstimatedMileage = @collection.currentEstimatedMileage()

  createRecord: (e) ->
    e.preventDefault()
    model = new App.Record @serialize()

    if model.isValid()
      @collection.create model
      @parent.close()
      e.target.reset()
    else
      _.each model.validationError, (error) =>
        @$("[name=#{error.name}]").closest('.form-group')
          .addClass('has-error')
