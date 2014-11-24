class App.VehicleSettingsView extends Thorax.View
  name: 'vehicle_settings'

  events:
    'click a': 'callMethod'

  callMethod: (e) ->
    e.preventDefault()
    method = $(e.currentTarget).data('method')
    this[method]()

  enableCost: ->
    settings = @model.settings()
    @model.save
      settings:
        enableCost: !settings.enableCost

  importRecords: ->
    App.popover.pushView
      title: 'Import Records'
      view: new App.ImportRecordsView
        model: @model
        collection: @collection

  retireVehicle: ->
    alert 'Not yet implemented'

  removeVehicle: ->
    App.popover.pushView
      title: 'Remove Vehicle'
      view: new App.RemoveVehicleConfirmationView
        model: @model
