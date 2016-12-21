class App.Vehicle extends Thorax.Model
  validatePresence: ['name']

  url: ->
    if @id
      "/api/vehicles/#{@id}"
    else
      "/api/vehicles"

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

    if attrs.vin && attrs.vin.length != 17
      errors.push {
        name: 'vin'
        message: 'must be 17 characters'
      }

    errors = _.compact(errors)
    errors unless _.isEmpty(errors)
