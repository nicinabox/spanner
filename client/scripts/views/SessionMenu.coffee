class App.SessionMenu extends Thorax.View
  name: 'session_menu'

  events:
    'click .js-logout': 'logout'

  logout: (e) ->
    e.preventDefault()
    App.session.logout()
