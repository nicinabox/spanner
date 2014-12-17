class App.RootView extends Thorax.LayoutView
  el: '#app'

  initialize: ->
    Thorax.setRootObject(this)

    _.bindAll this, 'closePopoversWithClick'
    _.bindAll this, 'closePopoversWithEsc'

    @on 'load:start', Thorax.loadHandler(
      ->
        NProgress.start()
    , ->
      NProgress.done()
    )

    $(document).on('click', @closePopoversWithClick)
    $(document).on('keyup', @closePopoversWithEsc)

  closePopoversWithClick: (e) ->
    return if e.originalEvent.defaultPrevented

    clickInPopover = $(e.target).closest('.pop-over').length
    unless clickInPopover
      App.popover.close()

  closePopoversWithEsc: (e) ->
    code = e.keyCode or e.which
    if code == 27
      App.popover.close()
