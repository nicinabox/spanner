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
        'client/scripts/mixins/*'
        'client/scripts/helpers/*'
        'client/scripts/models/*'
        'client/scripts/collections/*'
        'client/scripts/views/*'
        'client/scripts/routes/*'
        'client/scripts/applicaiton.coffee'
      ]

      vendor: [
        'node_modules/lodash/dist/lodash.js'
        'node_modules/jquery/dist/jquery.js'
        'node_modules/handlebars/handlebars.runtime.js'
        'node_modules/backbone/backbone.js'
      ]

module.exports = config
