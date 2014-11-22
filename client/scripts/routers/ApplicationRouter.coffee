class App.ApplicationRouter extends Backbone.Router
  routes:
    '': 'welcome'
    'vehicles': 'vehicles'
    'vehicles/:id': 'vehicle'

  constructor: ->
    _.each @routes, (method, route) ->
      unless @constructor::[method]
        @constructor::[method] = (options...) ->
          @render method, options...
    , this

    super

    @listenTo App.session, 'auth:reject', ->
      @redirectTo ''

  redirectTo: (path) ->
    @navigate path, trigger: true

  render: (method, options...) ->
    name = _.capitalize(method)
    view = new App[name + 'View'](options...)
    App.layout.setView view
    App.currentView = view
