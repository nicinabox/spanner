class App.ImportRecordsView extends Thorax.View
  name: 'import_records'

  events:
    'click a[class*=js-]': (e) -> e.preventDefault()
    'click .js-import-records': 'importRecords'
    'click .js-cancel-import': 'cancelImport'
    'submit form': 'previewImport'

  initialize: ->
    @records = []

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
