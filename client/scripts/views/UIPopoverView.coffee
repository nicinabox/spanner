class App.UIPopoverView extends Thorax.View
  className: 'pop-over'

  events:
    'submit form': 'submit'
    'click .close': 'close'

  initialize: ->
    @template = Handlebars.templates[@name]
    @offset = $(@target).offset()
    @offset.top = $(@target).outerHeight() + @offset.top

    @$el.css @offset

  render: ->
    if App.layout.$('.pop-over').length
      App.layout.$('.pop-over').remove()
      return

    @$el.html @template(this)
    App.layout.$el.append @$el
    @$('input:first').select()

  close: (e) ->
    e.preventDefault()
    @remove()

  submit: (e) ->
    e.preventDefault()
    @model.save @serialize()
