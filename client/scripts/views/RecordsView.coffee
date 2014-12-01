class App.RecordsView extends Thorax.View
  name: 'records'

  events:
    'click #records tr': 'showEditServicePopover'

  initialize: ->
    @records = @collection.groupByYear()
    @listenTo @collection, 'add sync remove', ->
      @records = @collection.groupByYear()
      @render()

  showEditServicePopover: (e) ->
    e.preventDefault()

    App.popover.toggle
      title: 'Edit Service'
      elem: e.currentTarget
      populate: true
      focus: '[name=mileage]'
      top: -80
      view: new App.AddServiceView
        collection: @collection
        model: @collection.get($(e.currentTarget).data('id'))
        vehicle: @model.toJSON()
