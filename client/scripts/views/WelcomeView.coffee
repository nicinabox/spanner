class App.WelcomeView extends Thorax.View
  name: 'welcome'
  id: 'welcome'

  events:
    'submit form': 'login'

  initialize: ->
    @placeholder = 'E.g., ' + @randomEmail()
    @listenTo App.session, 'auth:resolve', ->
      App.router.redirectTo 'vehicles'

  login: (e) ->
    e.preventDefault()

    App.session.login()

  randomEmail: ->
    emails = [
      'lando@cloudcity.com'
      'robertpaulson@loustavern.com'
    ]

    _.sample(emails)
