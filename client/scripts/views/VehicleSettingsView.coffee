class App.VehicleSettingsView extends Thorax.View
  name: 'vehicle_settings'

  events:
    'click a': 'callMethod'

  callMethod: (e) ->
    e.preventDefault()
    method = $(e.currentTarget).data('method')
    this[method]()

  enableCost: ->
    settings = @model.get('settings')
    @model.save
      settings:
        enable_cost: !settings.enable_cost

  retireVehicle: ->
    alert 'I should probably implement this feature...'

  removeVehicle: ->
    App.popover.pushView
      title: 'Remove Vehicle'
      view: new App.RemoveVehicleConfirmationView
        model: @model
