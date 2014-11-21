_      = require 'lodash'

config =
  base: (path) ->
    path.replace('/**/*', '')

  paths:
    www:
      root: 'public'
      assets: 'public/assets'

    client:
      root: 'client'
      html: 'client/*.html'
      scripts: 'client/scripts/**/*'
      styles: 'client/styles/**/*'
      templates: 'client/templates/**/*'

      app: [
        'client/scripts/application.coffee'
        'client/scripts/mixins/*'
        'client/scripts/helpers/*'
        'client/scripts/models/*'
        'client/scripts/collections/*'
        'client/scripts/views/*'
        'client/scripts/routers/*'
        'client/scripts/start.coffee'
      ]

      vendor: [
        'node_modules/lodash/dist/lodash.js'
        'node_modules/jquery/dist/jquery.js'
        'node_modules/handlebars/dist/handlebars.runtime.js'
        'node_modules/backbone/backbone.js'
        'bower_components/thorax/thorax.js'
        'node_modules/backbone.localstorage/backbone.localStorage.js'
        'bower_components/bootstrap-sass/dist/js/bootstrap.js'
      ]

module.exports = config
