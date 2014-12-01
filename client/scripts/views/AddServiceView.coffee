class App.AddServiceView extends Thorax.View
  name: 'add_service'

  events:
    'submit form': 'createOrUpdateRecord'
    'click [data-destroy]': 'destroyRecord'
    'rendered': ->
      @$('textarea').autosize()

  initialize: ->
    @date = moment().format('MM-DD-YYYY')
    unless @model
      @currentEstimatedMileage = @collection.currentEstimatedMileage()

  destroyRecord: (e) ->
    e.preventDefault()
    @model.destroy()
    @parent.close()

  createOrUpdateRecord: (e) ->
    e.preventDefault()

    if @model
      @model.save @serialize()
      @parent.close()
    else
      model = new App.Record @serialize()

      if model.isValid()
        @collection.create model
        @parent.close()
        e.target.reset()
      else
        _.each model.validationError, (error) =>
          @$("[name=#{error.name}]").closest('.form-group')
            .addClass('has-error')
