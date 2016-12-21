class App.SessionView extends Thorax.View
  name: 'session_view'
  tagName: 'a'
  className: 'btn btn-default'

  events:
    'click': 'showSessionPopover'

  initialize: ->
    @model = App.session

  showSessionPopover: (e) ->
    e.preventDefault()
    App.popover.toggle
      elem: e.currentTarget
      view: new App.SessionMenu
        model: @model
