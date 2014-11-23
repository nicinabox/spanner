class App.PopOverView extends Thorax.View
  name: 'popover'
  className: 'pop-over'
  width: 300

  events:
    'click .close': 'close'

  attach: ->
    if App.layout.$('.pop-over').length
      App.layout.$('.pop-over').remove()

    @setPosition()
    @render()
    @appendTo App.layout.$el
    @$('input:first').select()

  setPosition: ->
    # Left offset is easy
    offset     = $(@elem).offset()
    offset.top = $(@elem).outerHeight() + offset.top

    # Right offset is awkward
    if offset.left + @width > $(window).width()
      offset.left = offset.left - @width + $(@elem).outerWidth()

    @$el.css offset

  close: (e) ->
    e.preventDefault()
    @remove()
