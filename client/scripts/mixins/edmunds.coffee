class App.EdmundsApi
  _options:
    host: 'https://api.edmunds.com'
    prefix: 'api'
    version: 2
    dataset: 'vehicle'
    key: '27gb9pqv7cx57xwybknpw2zz'
    params: {}
    resource: ''

  constructor: (options) ->
    @options = _.extend {}, @_options, options

  fetch: ->
    Backbone.ajax @url()

  urlV1: ->
    [
      @options.host
      'v' + @options.version
      @options.prefix
      @options.dataset
      @options.resource
    ].join('/')

  urlV2: ->
    [
      @options.host
      @options.prefix
      @options.dataset
      'v' + @options.version
      @options.resource
    ].join('/')

  isUsingApiV1: ->
    @options.version == 1

  url: ->
    if @isUsingApiV1()
      baseUrl = @urlV1()
    else
      baseUrl = @urlV2()

    params = $.param _.extend {}, @options.params,
      api_key: @options.key
      fmt: 'json'

    [baseUrl, params].join('?')
