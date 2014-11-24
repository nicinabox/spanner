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
    @vehicles.fetch()

    Backbone.history.start()
    @session.authorize()

_.bindAll App
window.App = App
