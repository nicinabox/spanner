class App.Records extends Thorax.Collection
  model: App.Record
  localStorage: new Backbone.LocalStorage("records")

  initialize: (options) ->
    @vehicle_id = options.vehicle_id

  groupByYear: ->
    _(@toJSON())
      .groupBy((r) -> +moment(r.date).year())
      .pairs()
      .map((r) ->
        r[0] = +r[0]
        r[1] = _.sortBy(r[1], (record) -> -moment(record.date))
        _.zipObject(['year', 'records'], r)
      )
      .sortBy((r) -> -r.year)
      .value()

  parse: (data) ->
    _(data).filter(vehicle_id: @vehicle_id).value()
