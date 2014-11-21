class App.Session extends Thorax.Model
  localStorage: new Backbone.LocalStorage("Session")

  initialize: ->
    @on 'change:token', @onChangeToken

  login: ->
    @save
      token: @newToken()

  logout: ->
    @destroy()
    @clear()

  authorize: ->
    @fetch().done => @onChangeToken()

  isAuthorized: ->
    !!@get 'token'

  newToken: ->
    Math.random().toString(36).substring(7)

  onChangeToken: ->
    if @isAuthorized()
      @trigger 'auth:resolve'
    else
      @trigger 'auth:reject'

  parse: (data) ->
    data[0] if data
