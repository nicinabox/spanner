class App.Vehicle extends Thorax.Model
  idAttribute: '_id'
  validatePresence: ['name']

  initialize: ->
    @on 'sync', ->
      if @hasVin() and !@hasDetails()
        @details()

    @on 'change:vin', ->
      if @hasVin()
        @details()

    @maintenanceSchedule = new App.MaintenanceSchedule
      vehicle: this

  settings: ->
    @get('settings') || {}

  squishVin: ->
    vin = @get('vin')
    vin.substr(0, 8) + vin.slice(9, 11)

  details: ->
    edmunds = new App.EdmundsApi
      resource: 'vins/' + @get('vin')

    edmunds.fetch().done (data) =>
      @save details: data
      data

  modelYearId: ->
    details = @get('details')
    details.years[0].id

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
