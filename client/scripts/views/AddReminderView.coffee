class App.AddReminderView extends Thorax.View
  name: 'add_reminder'

  events:
    'submit form': 'createOrUpdateRecord'
    'click [data-destroy]': 'destroyRecord'
    'rendered': ->
      @$('input[name=date]').datepicker({
        format: 'M d, yyyy'
        autoclose: true
      })

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
      model = new App.Reminder @serialize()

      if model.isValid()
        @collection.create model
        @parent.close()
      else
        _.each model.validationError, (error) =>
          @$("[name=#{error.name}]").closest('.form-group')
            .addClass('has-error')
