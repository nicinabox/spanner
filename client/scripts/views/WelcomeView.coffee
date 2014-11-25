class App.WelcomeView extends Thorax.View
  name: 'welcome'
  id: 'welcome'

  events:
    'submit form': 'login'

  initialize: ->
    @placeholder = 'E.g., ' + @randomEmail()

  login: (e) ->
    e.preventDefault()
    @authenticating = true
    App.session.login(@serialize())
    @render()

  randomEmail: ->
    emails = [
      'lando@cloudci.ty'
      'robertpaulson@loustave.rn'
      'drspaceman@rockefellerpla.ce'
      'mal@firef.ly'
    ]

    _.sample(emails)
