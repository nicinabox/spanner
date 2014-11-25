class App.RootView extends Thorax.LayoutView
  el: '#app'

  initialize: ->
    _.bindAll this, 'closePopovers'
    $(document).on 'click', @closePopovers

  closePopovers: (e) ->
    return if e.originalEvent.defaultPrevented
    inPopover = $(e.target).closest('.pop-over').length
    unless inPopover
      App.popover.close()
