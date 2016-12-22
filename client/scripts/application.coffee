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
      if !Backbone.History.started
        Backbone.history.start(pushState: true)

      if !Backbone.history.getFragment()
        @router.redirectTo 'vehicles'

    @session.on 'auth:reject', =>
      if !Backbone.History.started
        Backbone.history.start(pushState: true)

      @router.redirectTo ''

    @session.authorize()

_.bindAll App
window.App = App
