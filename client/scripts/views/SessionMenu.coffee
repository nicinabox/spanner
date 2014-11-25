class App.SessionMenu extends Thorax.View
  name: 'session_menu'

  events:
    'click .logout': 'logout'

  logout: (e) ->
    e.preventDefault()
    App.session.logout()

