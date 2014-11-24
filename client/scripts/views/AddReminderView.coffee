class App.AddReminderView extends Thorax.View
  name: 'add_reminder'

  events:
    'submit form': 'createRecord'

  createRecord: (e) ->
    e.preventDefault()
    m = new App.Reminder @serialize()

    if m.isValid()
      e.target.reset()
      @collection.create m
      @parent.close()
    else
      _.each m.validationError, (error) =>
        @$("[name=#{error.name}]").closest('.form-group')
          .addClass('has-error')
