class App.RemindersView extends Thorax.View
  name: 'reminders'

  events:
    'click .js-add-reminder': 'showAddReminderPopover'
    'click .js-reminder': 'showEditReminderPopover'
    'click a[class*=js-]': (e) -> e.preventDefault()

  showAddReminderPopover: (e) ->
    App.popover.toggle
      title: 'Add Reminder'
      elem: e.currentTarget
      view: new App.AddReminderView
        collection: @collection

  showEditReminderPopover: (e) ->
    App.popover.toggle
      elem: e.currentTarget
      title: 'Edit Reminder'
      populate: true
      view: new App.AddReminderView
        model: $(e.currentTarget).model()
        collection: @reminders
