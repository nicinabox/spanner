class App.ApplicationRouter extends Backbone.Router
  routes:
    '': 'welcome'
    'vehicles': 'vehicles'
    'vehicles/:id': 'vehicle'
    'vehicles/:id/details': 'vehicleDetails'
    'login/:uid/:token': 'login'

  constructor: ->
    _.each @routes, (method, route) ->
      unless @constructor::[method]
        @constructor::[method] = (options...) ->
          @render method, options...
    , this

    super

    @on 'route', ->
      App.layout.$('.pop-over').remove()

  redirectTo: (path) ->
    @navigate path, trigger: true

  render: (method, options...) ->
    name = _.capitalize(method)
    view = new App[name + 'View'](options...)
    App.layout.setView view
    App.currentView = view

  login: (uid, token) ->
    App.session.authorize({
      uid: uid
      token: token
    })
