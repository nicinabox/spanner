class App.ImportRecordsView extends Thorax.View
  name: 'import_records'

  events:
    'click a': 'runMethod'
    'submit form': 'previewImport'

  initialize: ->
    @records = []

  runMethod: (e) ->
    e.preventDefault()
    method = $(e.currentTarget).data('method')
    this[method]()

  previewImport: (e) ->
    e.preventDefault()
    file = @$('input[type=file]')[0].files[0]
    @preview = true
    @render()

    @parseFile file, (results) =>
      data   = results.data
      labels = data.shift()

      @records = _.map data, (r) ->
        _.zipObject(labels, r)

      @collection.reset()
      @collection.add @records

  importRecords: ->
    @importing = true
    @render()

    _.defer =>
      @collection.reset()

      # REVIEW: Probably don't do this.
      _.each @records, (r) ->
        @collection.create(r)
      , this

    @doneImporting()

  doneImporting: ->
    @doneImporting = true
    @render()

  cancelImport: ->
    @preview = @importing = undefined
    @render()

  parseFile: (file, done) ->
    Papa.parse file,
      complete: done
