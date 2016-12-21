_sync = Backbone.sync

Backbone.sync = (method, model, options) ->
  options.headers = {
    accept: 'application/json;version=2'
    authorization: "Token #{App.session.get('auth_token')}"
  }

  if model && (method == 'create' || method == 'update' || method == 'patch')
    options.contentType = 'application/json'
    options.data = JSON.stringify(options.attrs || model.toJSON())

  _error = options.error
  options.error = (xhr, status, error_thrown) ->
    _error?(xhr, status, error_thrown)
    App.session.unauthorize() if xhr.status == 401

  _sync.call(this, method, model, options)
