class App.WelcomeView extends Thorax.View
  name: 'welcome'
  id: 'welcome'

  events:
    'submit form': 'login'

  initialize: ->
    @placeholder = 'E.g., ' + @randomEmail()

  login: (e) ->
    e.preventDefault()
    App.session.login()

  randomEmail: ->
    emails = [
      'lando@cloudcity.com'
      'robertpaulson@loustavern.com'
    ]

    _.sample(emails)
