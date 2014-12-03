class App.Session extends Thorax.Model
  urlRoot: '/session'
  idAttribute: 'uid'

  initialize: ->
    @on 'change:token', @onChangeToken

  toRequestJSON: ->
    _.pick(@toJSON(), 'uid', 'token')

  login: (data) ->
    @save(data)

  logout: ->
    @destroy()
    localStorage.clear()
    @clear()
    App.session = new @constructor

  authorize: (data) ->
    if data
      @set(data)
      localStorage.setItem 'session', JSON.stringify(@toJSON())
    else
      data = JSON.parse(localStorage.getItem('session'))
      @set(data) if data

  unauthorize: ->
    @logout()

  isAuthorized: ->
    !!@get 'token'

  onChangeToken: ->
    if @isAuthorized()
      @trigger 'auth:resolve'
    else
      @trigger 'auth:reject'
