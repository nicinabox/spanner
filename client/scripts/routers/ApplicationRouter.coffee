class App.ApplicationRouter extends Backbone.Router
  routes:
    '': 'welcome'
    'vehicles': 'vehicles'
    'vehicles/:id': 'vehicle'
    'sessions/:token': 'login'

  constructor: ->
    _.each @routes, (method, route) ->
      unless @constructor::[method]
        @constructor::[method] = (options...) ->
          @render method, options...
    , this

    super
    App.session.authorize()

    @on 'route', ->
      App.layout.$('.pop-over').remove()

  redirectTo: (path) ->
    @navigate path, trigger: true

  render: (method, options...) ->
    name = _.capitalize(method)
    view = new App[name + 'View'](options...)
    App.layout.setView view
    App.currentView = view

  login: (token) ->
    App.session.login(token)
