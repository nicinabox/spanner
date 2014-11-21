class App.ApplicationRouter extends Backbone.Router
  routes:
    '': 'welcome'
    'vehicles': 'vehicles'

  constructor: ->
    _.each @routes, (method, route) ->
      unless @constructor::[method]
        @constructor::[method] = (options...) ->
          @render method, options...
    , this

    super

    @listenTo App.session, 'auth:resolve', ->
      @redirectTo 'vehicles'

    @listenTo App.session, 'auth:reject', ->
      @redirectTo ''

  redirectTo: (path) ->
    @navigate path, trigger: true

  render: (method) ->
    name = _.capitalize(method)
    view = new App[name + 'View']
    App.layout.setView view
