class App.VehicleView extends Thorax.View
  name: 'vehicle'
  id: 'vehicle'

  events:
    'click .js-name': 'showChangeNamePopover'
    'click .js-vehicles': 'showVehiclesPopover'
    'click .js-settings': 'showSettingsPopover'

    'click .js-add-service': 'showAddServicePopover'
    'click .js-add-reminder': 'showAddReminderPopover'
    'click .js-remove-record': 'removeRecord'

    'keyup #filter': 'filterRecords'
    'submit #header form': (e) -> e.preventDefault()
    'click a[class*=js-]': (e) -> e.preventDefault()

  initialize: (id) ->
    @vehicles = App.vehicles
    @model    = @vehicles.get(id)

    @reminders  = new App.Reminders [], vehicleId: id
    @collection = new App.Records [], vehicleId: id

    @listenTo @vehicles, 'sync', ->
      @setModel @vehicles.get(id)
      @recordsView.setModel @model

    @listenTo @collection, 'add sync remove', ->
      @milesPerYear = @collection.milesPerYear()
      @render()

    @sessionView = new App.SessionView
    @recordsView = new App.RecordsView
      collection: @collection

    @remindersView = new App.RemindersView
      collection: @reminders

    @vehicles.fetch()
    @collection.fetch()
    @reminders.fetch()

  filterRecords: (e) ->
    val = e.currentTarget.value
    re  = new RegExp val, 'i'

    @$('#records tr').each ->
      $this   = $(this)
      content = $this.text()

      $this.hide()
      $this.show() if re.test(content)

  removeRecord: (e) ->
    id = $(e.currentTarget).data('record-id')
    if confirm 'Really delete record?'
      record = @collection.get(id)
      record.destroy()

  showAddServicePopover: (e) ->
    App.popover.toggle
      title: 'Add Service'
      elem: e.currentTarget
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

  showVehiclesPopover: (e) ->
    App.popover.toggle
      elem: e.currentTarget
      view: new App.VehiclesMenu
        collection: @vehicles

  showChangeNamePopover: (e) ->
    App.popover.toggle
      elem: e.currentTarget
      title: 'Rename Vehicle'
      populate: true
      view: new App.RenameVehicleView
        model: @model

  showSettingsPopover: (e) ->
    App.popover.toggle
      elem: e.currentTarget
      title: 'Vehicle Settings'
      view: new App.VehicleSettingsView
        model: @model
        collection: @collection
