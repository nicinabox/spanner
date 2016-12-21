Handlebars.registerHelpers = (methods) ->
  _.each methods, (fn, name) ->
    Handlebars.registerHelper name, fn

App =
  start: ->
    @session = new App.Session
    @layout  = new App.RootView
    @router  = new App.ApplicationRouter
    @popover = new App.PopOverView

    @vehicles = new App.Vehicles

    @session.on 'auth:resolve', =>
      @router.redirectTo 'vehicles'

    @session.on 'auth:reject', =>
      @router.redirectTo ''

    Backbone.history.start(pushState: true)

_.bindAll App
window.App = App
