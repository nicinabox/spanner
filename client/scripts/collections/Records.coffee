class App.Records extends Thorax.Collection
  model: App.Record
  url: ->
    "/api/vehicles/#{@vehicleId}/records"

  initialize: (models, options) ->
    @vehicleId = options.vehicleId

  comparator: 'date'

  currentEstimatedMileage: ->
    mpd = @recentMilesPerDay()
    return unless mpd

    last        = @last().toJSON()
    elapsedDays = moment().diff(last.date, 'days')

    currentMileage = last.mileage + (elapsedDays * mpd)
    Math.floor(currentMileage / 10) * 10

  milesPerYear: ->
    ONE_YEAR = 365
    mpd = @milesPerDay()
    return unless mpd

    first       = @first().toJSON()
    elapsedDays = moment().diff(first.date, 'days')

    if elapsedDays < ONE_YEAR
      remainingDays = ONE_YEAR - moment().dayOfYear()
      mpy = mpd * (elapsedDays + remainingDays)
    else
      mpy = mpd * ONE_YEAR

    Math.floor(mpy / 10) * 10

  recentMilesPerDay: (days = 90)->
    return unless @length
    ceil  = moment()
    floor = ceil.subtract(days, 'days').startOf('month')

    models = @filter (model) ->
      modelDate = moment model.get('date')
      model if modelDate.isAfter(floor)

    first = _.first(models).toJSON()
    last = _.last(models).toJSON()

    elapsedDays    = moment(last.date).diff(first.date, 'days')
    elapsedMileage = last.mileage - first.mileage
    +(elapsedMileage / elapsedDays).toFixed(2)

  milesPerDay: ->
    return unless @length

    first = @first().toJSON()
    last  = @last().toJSON()

    elapsedDays    = moment(last.date).diff(first.date, 'days')
    elapsedMileage = last.mileage - first.mileage

    +(elapsedMileage / elapsedDays).toFixed(2)

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
