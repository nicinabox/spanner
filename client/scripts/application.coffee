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

    $.when(@session.authorize())
      .then( =>
        @session.on 'auth:resolve', =>
          fragment = Backbone.history.fragment
          if !fragment or /login/.test(fragment)
            App.router.redirectTo 'vehicles'

        @session.on 'auth:reject', ->
          App.router.redirectTo ''

        Backbone.history.start()

        if @session.isAuthorized()
          @vehicles.fetch()
          @session.trigger 'auth:resolve'
        else
          @session.trigger 'auth:reject'
      )

_.bindAll App
window.App = App
