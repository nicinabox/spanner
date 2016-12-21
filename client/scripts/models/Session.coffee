class App.Session extends Thorax.Model
  urlRoot: '/api/sessions'

  initialize: ->
    @on 'change:auth_token', @onChangeToken

  requestSession: (data) ->
    @save(data)

  login: (loginToken) ->
    $.ajax
      url: [@urlRoot, loginToken].join('/')
      dataType: 'json'
      success: (response) =>
        @authorize(response)

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
      if data
        @set(data)
      else
        @onChangeToken()

  unauthorize: ->
    @logout()

  isAuthorized: ->
    !!@get 'auth_token'

  onChangeToken: ->
    if @isAuthorized()
      @trigger 'auth:resolve'
    else
      @trigger 'auth:reject'
