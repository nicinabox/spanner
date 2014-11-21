class App.WelcomeView extends Thorax.View
  name: 'welcome'

  initialize: ->
    @placeholder = 'E.g., ' + @randomEmail()

  randomEmail: ->
    emails = [
      'lando@cloudcity.com'
      'robertpaulson@loustavern.com'
    ]

    _.sample(emails)
