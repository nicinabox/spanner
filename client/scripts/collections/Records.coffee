class App.Records extends Thorax.Collection
  url: 'https://www.kimonolabs.com/api/8mnhn4ye?apikey=83b22741069a1bc1503c47d81f7452e7'

  sync: (method, collection, options) ->
    options.dataType = "jsonp"
    Backbone.sync(method, collection, options)

  comparator: (m) ->
    -m.get('year')

  parse: (data) ->
    return unless data
    r = data.results.records
    grouped = _(r)
      .groupBy((r) -> +moment(r.date).year())
      .pairs()
      .map((r) ->
        r[0] = +r[0]
        _.zipObject(['year', 'records'], r)
      )
      .value()

    grouped
