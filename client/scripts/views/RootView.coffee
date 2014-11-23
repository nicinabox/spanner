class App.RootView extends Thorax.LayoutView
  el: '#root'

  events:
    'click .logout': 'logout'

  initialize: ->
    _.bindAll this, 'closePopovers'
    $(document).on 'click', @closePopovers

  closePopovers: (e) ->
    return if e.originalEvent.defaultPrevented
    inPopover = $(e.target).closest('.pop-over').length
    unless inPopover
      $('.pop-over').remove()

  logout: (e) ->
    e.preventDefault()
    # App.session.logout()
