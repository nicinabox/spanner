class App.Record extends Thorax.Model
  validatePresence: ['date', 'notes']

  validate: (attrs) ->
    errors = _.map attrs, (v, k) =>
      if _.contains(@validatePresence, k) and _.isEmpty(v)
        {
          name: k
          message: 'cannot be empty'
        }

    errors = _.compact(errors)
    errors unless _.isEmpty(errors)

  set: (data) ->
    data.date    = moment(data.date).utc().format('YYYY-MM-DD')
    data.mileage = numeral(data.mileage).value()

    super(data)
