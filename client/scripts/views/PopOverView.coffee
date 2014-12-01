class App.PopOverView extends Thorax.LayoutView
  name: 'popover'
  className: 'pop-over'
  width: 300

  events:
    'click .close': 'close'
    'click .back': 'back'

  stack: []

  toggle: (options) ->
    @stack      = []
    @stackEmpty = true
    @title      = options.title

    @render()
    options.view.retain()

    unless options.populate
      options.view.populate({}, {
        children: false
      })

    @stack.push options
    @setView options.view

    @appendTo App.layout.$el
    @setPosition(options)

    @selectInput(options)

  pushView: (options) ->
    @title      = options.title
    @stackEmpty = false

    @render()
    options.view.retain(this)
    @stack.push options
    @setView options.view

    @delegateEvents()
    @selectInput(options)

  popView: ->
    current     = @stack.pop()
    previous    = _.last(@stack)

    @title      = previous.title
    @stackEmpty = @isLastInStack(previous)

    @render()
    current.view.release()
    @setView previous.view
    previous.view.delegateEvents()

    @selectInput(options)

  selectInput: (options = {}) ->
    selector = options.focus || 'input, textarea'
    @$(selector).first().select()

  isLastInStack: (view) ->
    @stack[0] == view

  setPosition: (options) ->
    elem     = options.elem
    top      = options.top
    height   = @$el.outerHeight(true)
    offset   = $(elem).offset()
    position = offset
    bounds   =
      top: $(window).scrollTop()
      left: 0
      right: $(window).width()
      bottom: $(window).height()

    position.right = offset.left + @width

    # Normal top
    if _.isNumber(top)
      position.top = offset.top + top
    else
      position.top = offset.top + $(elem).outerHeight()

    position.bottom = position.top + height

    # Right bound
    if position.right > bounds.right
      position.left = offset.left - @width + $(elem).outerWidth()

    # Bottom bound
    if position.bottom > bounds.bottom + bounds.top
      position.top = bounds.bottom - height + bounds.top

    if position.top < bounds.top
      position.top = bounds.top if position.top - bounds.top < 10

    @$el.css
      left: position.left
      top: position.top
      width: @width

  back: (e) ->
    e.preventDefault()
    @popView()

  close: (e) ->
    e.preventDefault() if e

    view = @getView()
    view.release() if view
    @release()

    App.popover = new @constructor
