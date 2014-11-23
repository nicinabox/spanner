class App.PopOverView extends Thorax.LayoutView
  name: 'popover'
  className: 'pop-over'
  width: 300

  events:
    'click .close': 'close'
    'click .back': 'back'

  stack: []

  toggle: (options) ->
    @setPosition(options.elem)
    @stackEmpty = true
    @title      = options.title

    @render()
    options.view.retain()

    @stack.push options
    @setView options.view
    @appendTo App.layout.$el

    @$('input:first').select()

  pushView: (options) ->
    @title      = options.title
    @stackEmpty = false

    @render()
    options.view.retain()
    @stack.push options
    @setView options.view

    @delegateEvents()
    @$('input:first').select()

  popView: ->
    current     = @stack.pop()
    previous    = _.last(@stack)

    @title      = previous.title
    @stackEmpty = @isLastInStack(previous)

    @render()
    current.view.release()
    @setView previous.view
    previous.view.delegateEvents()

    @$('input:first').select()

  isLastInStack: (view) ->
    @stack[0] == view

  setPosition: (elem) ->

    # Left offset is easy
    offset     = $(elem).offset()
    offset.top = $(elem).outerHeight() + offset.top

    # Right offset is awkward
    if offset.left + @width > $(window).width()
      offset.left = offset.left - @width + $(elem).outerWidth()

    @$el.css offset
    @$el.css width: @width

  back: (e) ->
    e.preventDefault()
    @popView()

  close: (e) ->
    e.preventDefault() if e
    @remove()
    App.popover = new @constructor
