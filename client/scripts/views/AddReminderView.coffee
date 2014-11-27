class App.AddReminderView extends Thorax.View
  name: 'add_reminder'

  events:
    'submit form': 'createOrUpdateRecord'
    'click [data-destroy]': 'destroyRecord'

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
      m = new App.Reminder @serialize()

      if m.isValid()
        @collection.create m
        @parent.close()
      else
        _.each m.validationError, (error) =>
          @$("[name=#{error.name}]").closest('.form-group')
            .addClass('has-error')
