class App.UIPopoverView extends Thorax.View
  className: 'pop-over'

  events:
    'submit form': 'submit'
    'click .close': 'close'

  initialize: ->
    @template   = Handlebars.templates[@name]
    @setElOffset()

  attach: ->
    if App.layout.$('.pop-over').length
      App.layout.$('.pop-over').remove()
      return

    @render()
    @appendTo App.layout.$el
    @$('input:first').select()

  setElOffset: ->
    WIDTH = 300
    properties = {}

    # Left offset is easy
    offset     = $(@target).offset()
    offset.top = $(@target).outerHeight() + offset.top

    # Deal with right offset
    if offset.left + WIDTH > $(window).width()
      offset.left = offset.left - WIDTH + $(@target).outerWidth()

    properties = offset
    @$el.css properties

  close: (e) ->
    e.preventDefault()
    @remove()

  submit: (e) ->
    e.preventDefault()
    @model.save @serialize()
    @remove()
