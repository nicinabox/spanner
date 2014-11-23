class App.Vehicle extends Thorax.Model
  validatePresence: ['name']

  defaults:
    settings: {}

  validate: (attrs) ->
    errors = _.map attrs, (v, k) =>
      if _.contains(@validatePresence, k) and _.isEmpty(v)
        {
          name: k
          message: 'cannot be empty'
        }

    errors = _.compact(errors)
    errors unless _.isEmpty(errors)
