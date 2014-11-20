App =
  start: ->
    @layout = new App.RootView
    @router = new App.ApplicationRouter

    Backbone.history.start()

_.bindAll App
window.App = App
