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
    model = @collection.get $(e.currentTarget).data('id')
    App.popover.toggle
      title: 'Edit Service'
      elem: e.currentTarget
      populate: true
      view: new App.AddServiceView
        collection: @collection
        model: model
