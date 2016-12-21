class App.VehicleSettingsView extends Thorax.View
  name: 'vehicle_settings'

  events:
    'click a[class*=js-]': (e) -> e.preventDefault()
    'click .js-enable-cost': 'enable_cost'
    'click .js-import-records': 'importRecords'
    'click .js-retire-vehicle': 'retireVehicle'
    'click .js-remove-vehicle': 'removeVehicle'

  enable_cost: ->
    @model.save
      enable_cost: !@model.get('enable_cost')

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
