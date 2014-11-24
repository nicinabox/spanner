class App.VehicleView extends Thorax.View
  name: 'vehicle'
  id: 'vehicle'

  events:
    'click #header .name': 'showChangeNamePopover'
    'click #header .vehicles': 'showVehiclesPopover'
    'click #header .settings': 'showSettingsPopover'
    'click .add-service': 'showAddServicePopover'
    'click .add-reminder': 'showAddReminderPopover'
    'click .remove-record': 'removeRecord'
    'keyup #filter': 'filterRecords'
    'submit #header form': (e) -> e.preventDefault()

  initialize: (id) ->
    @vehicles = App.vehicles
    @model    =  @vehicles.get(id)

    @reminders  = new App.Reminders [], vehicleId: id
    @collection = new App.Records [], vehicleId: id
    @records    = @collection.groupByYear()

    @listenTo @vehicles, 'sync', ->
      @setModel @vehicles.get(id)

    @listenTo @collection, 'add sync remove', ->
      @records = @collection.groupByYear()
      @render()

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
    e.preventDefault()
    id = $(e.currentTarget).data('record-id')
    if confirm 'Really delete record?'
      record = @collection.get(id)
      record.destroy()

  showAddServicePopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      title: 'Add Service'
      elem: e.currentTarget
      view: new App.AddServiceView
        collection: @collection
        model: @model

  showAddReminderPopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      title: 'Add Reminder'
      elem: e.currentTarget
      view: new App.AddReminderView
        model: @model
        collection: @reminders

  showVehiclesPopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      elem: e.currentTarget
      view: new App.VehiclesMenu
        collection: @vehicles

  showChangeNamePopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      elem: e.currentTarget
      title: 'Rename Vehicle'
      view: new App.RenameVehicleView
        model: @model

  showSettingsPopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      elem: e.currentTarget
      title: 'Vehicle Settings'
      view: new App.VehicleSettingsView
        model: @model
        collection: @collection
