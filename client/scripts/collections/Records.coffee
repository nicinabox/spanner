class App.Records extends Thorax.Collection
  model: App.Record
  url: ->
    "/api/vehicles/#{@vehicleId}/records"

  initialize: (models, options) ->
    @vehicleId = options.vehicleId

  comparator: 'date'

  milesPerYear: ->
    first = @first()
    last  = @last()
    return unless first

    first = first.toJSON()
    last  = last.toJSON()

    diffToday = moment(moment()).diff(last.date, 'days')
    diffDays  = moment(last.date).diff(first.date, 'days') + diffToday

    diffMileage = last.mileage - first.mileage

    mpd = diffMileage / diffDays

    if diffDays < 365
      diffEOY = 365 - moment().dayOfYear()
      mpy = mpd * (diffDays + diffEOY)
    else
      mpy = mpd * 365

    mpy

  groupByYear: (data) ->
    _(data or @toJSON())
      .groupBy((r) -> +moment(r.date).year())
      .pairs()
      .map((r) ->
        r[0] = +r[0]
        r[1] = _.sortBy(r[1], (record) -> -moment(record.date))
        _.zipObject(['year', 'records'], r)
      )
      .sortBy((r) -> -r.year)
      .compact()
      .value()
