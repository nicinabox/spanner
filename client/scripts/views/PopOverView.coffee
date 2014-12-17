class App.PopOverView extends Thorax.LayoutView
  name: 'popover'
  className: 'pop-over'
  width: 340

  events:
    'click .close': 'close'
    'click .back': 'back'

  stack: []

  toggle: (options) ->
    @stack      = []
    @stackEmpty = true
    @title      = options.title

    return if @isTextSelected()

    @render()
    options.view.retain()

    @stack.push options
    @setView options.view

    if options.view.context
      options.view.populate(options.view.context())
    else
      options.view.populate({}, {
        children: false
      })

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

  isTextSelected: ->
    if window.getSelection
      !!window.getSelection().toString()

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

    if @width > bounds.right
      @width = bounds.right - 10

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

    if position.left < bounds.left
      position.left = (bounds.right - @width) / 2

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
