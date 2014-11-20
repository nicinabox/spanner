class App.ApplicationRouter extends Backbone.Router
  routes:
    '': 'welcome'

  constructor: ->
    _.each @routes, (method, route) ->
      unless @constructor::[method]
        @constructor::[method] = (options...) ->
          @render method, options...
    , this

    super

  render: (method) ->
    name = _.capitalize(method)
    view = new App[name + 'View']
    App.layout.setView view
