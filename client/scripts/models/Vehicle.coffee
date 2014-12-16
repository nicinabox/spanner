class App.Vehicle extends Thorax.Model
  idAttribute: '_id'
  validatePresence: ['name']

  settings: ->
    @get('settings') || {}

  hasVin: ->
    !_.isEmpty @get('vin')

  hasDetails: ->
    !_.isEmpty @get('details')

  validate: (attrs) ->
    errors = _.map attrs, (v, k) =>
      if _.contains(@validatePresence, k) and _.isEmpty(v)
        {
          name: k
          message: 'cannot be empty'
        }

    errors = _.compact(errors)
    errors unless _.isEmpty(errors)
