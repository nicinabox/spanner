_sync = Backbone.sync

Backbone.sync = (method, model, options) ->
  options.url = buildUrl(method, model, options)

  if model && (method == 'create' || method == 'update' || method == 'patch')
    options.contentType = 'application/json';
    options.data = JSON.stringify(options.attrs || model.toJSON());

  _error = options.error
  options.error = (xhr, status, error_thrown) ->
    _error?(xhr, status, error_thrown)
    App.session.unauthorize() if xhr.status == 401

  _sync.call(this, method, model, options)

buildUrl = (method, model, options) ->
  q   = $.param(App.session.toRequestJSON())
  url = _.result model, 'url'
  [url, q].join('?')
