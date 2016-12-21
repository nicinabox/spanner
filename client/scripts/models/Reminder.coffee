class App.Reminder extends Thorax.Model
  validatePresence: ['notes']

  validate: (attrs) ->
    errors = _.map attrs, (v, k) =>
      if _.contains(@validatePresence, k) and _.isEmpty(v)
        {
          name: k
          message: 'cannot be empty'
        }

    errors = _.compact(errors)
    errors unless _.isEmpty(errors)
