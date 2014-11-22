class App.Records extends Thorax.Collection
  url: 'https://www.kimonolabs.com/api/8mnhn4ye?apikey=83b22741069a1bc1503c47d81f7452e7'

  sync: (method, collection, options) ->
    options.dataType = "jsonp"
    Backbone.sync(method, collection, options)

  parse: (data) ->
    data.results.records if data
