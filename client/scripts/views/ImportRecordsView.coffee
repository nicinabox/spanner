class App.ImportRecordsView extends Thorax.View
  name: 'import_records'

  events:
    'submit form': 'importRecords'

  importRecords: (e) ->
    e.preventDefault()
    file = @$('input[type=file]')[0].files[0]

    @parseFile file, (results) =>
      data   = results.data
      labels = data.shift()

      _.each data, (r) ->
        @collection.create _.zipObject(labels, r)
      , this

  parseFile: (file, done) ->
    Papa.parse file, done

