class App.VehicleView extends Thorax.View
  name: 'vehicle'
  id: 'vehicle'

  events:
    'click .js-add-service': 'showAddServicePopover'
    'click .js-add-reminder': 'showAddReminderPopover'
    'click .js-remove-record': 'removeRecord'
    'click .js-edit-vehicle-notes': 'showEditVehicleNotesPopover'

    'click a[class*=js-]': (e) -> e.preventDefault()

  initialize: (id) ->
    @vehicles = App.vehicles
    if @vehicles.length
      @model = @vehicles.get(id)
    else
      @model = new App.Vehicle _id: id
      @model.fetch()

    @collection  = new App.Records [], vehicleId: id
    @reminders   = new App.Reminders [], vehicleId: id

    # Listeners
    @listenTo @model, 'change', @render

    @listenTo @collection, 'add sync remove', ->
      @milesPerYear = @collection.milesPerYear()
      @render()

    # Child views
    @recordsView = new App.RecordsView
      model: @model
      collection: @collection

    @remindersView = new App.RemindersView
      collection: @reminders

    @vehicleHeaderView = new App.VehicleHeaderView
      model: @model

    @nextActionsView = new App.VehicleNextActionsView
      model: @model
      collection: @collection

    @reminders.fetch()
    @collection.fetch()

  removeRecord: (e) ->
    id = $(e.currentTarget).data('record-id')
    if confirm 'Really delete record?'
      record = @collection.get(id)
      record.destroy()

  showAddServicePopover: (e) ->
    App.popover.toggle
      title: 'Add Service'
      elem: e.currentTarget
      focus: '[name=mileage]'
      view: new App.AddServiceView
        collection: @collection
        vehicle: @model.toJSON()

  showAddReminderPopover: (e) ->
    App.popover.toggle
      title: 'Add Reminder'
      elem: e.currentTarget
      view: new App.AddReminderView
        vehicle: @model
        collection: @reminders

  showEditVehicleNotesPopover: (e) ->
    e.preventDefault()

    App.popover.toggle
      elem: e.currentTarget
      title: 'Edit Vehicle Notes'
      populate: true
      view: new App.EditVehicleNotesView
        model: @model
