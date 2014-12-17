class App.VehicleHeaderView extends Thorax.View
  name: 'vehicle_header'

  events:
    'click .back': 'goBack'
    'click .js-name': 'showChangeNamePopover'
    'click .js-settings': 'showSettingsPopover'

    'keyup #filter': 'filterRecords'

    'submit #header form': (e) -> e.preventDefault()
    'click a[class*=js-]': (e) -> e.preventDefault()

  initialize: ->
    @sessionView = new App.SessionView

  goBack: (e) ->
    e.preventDefault()
    fragment = Backbone.history.fragment
    fragments = fragment.split('/')
    fragments.pop()
    App.router.redirectTo fragments.join('/')

  filterRecords: (e) ->
    val = e.currentTarget.value
    re  = new RegExp val, 'i'

    @parent.$('#records tr').each ->
      $this   = $(this)
      content = $this.text()

      $this.hide()
      $this.show() if re.test(content)

  showChangeNamePopover: (e) ->
    App.popover.toggle
      elem: e.currentTarget
      title: 'Edit Vehicle Details'
      populate: true
      view: new App.EditVehicleView
        model: @model

  showSettingsPopover: (e) ->
    App.popover.toggle
      elem: e.currentTarget
      title: 'Vehicle Settings'
      view: new App.VehicleSettingsView
        model: @model
        collection: @collection
