class App.WelcomeView extends Thorax.View
  name: 'welcome'
  id: 'welcome'

  events:
    'submit form': 'requestSession'
    'click .try-again': 'tryAgain'

  initialize: ->
    @placeholder = 'E.g., ' + @randomEmail()
    @user = {}

  requestSession: (e) ->
    e.preventDefault()
    @authenticating = true
    @user = @serialize()

    App.session.requestSession(@user)
    @render()

  tryAgain: (e) ->
    e.preventDefault()
    @authenticating = false
    @render()

  randomEmail: ->
    emails = [
      'lando@cloudci.ty'
      'robertpaulson@loustave.rn'
      'drspaceman@rockefellerpla.ce'
      'mal@firef.ly'
    ]

    _.sample(emails)
