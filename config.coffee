_      = require 'lodash'

config =
  base: (path) ->
    path.replace('/**', '')
        .replace('/*', '')

  paths:
    www:
      root: 'public'
      assets: 'public/assets'

    server:
      root: 'server'
      main: 'server/index.js'

    client:
      root: 'client'
      static: [
        'client/*.html',
        'client/*.ico',
      ]
      scripts: 'client/scripts/**/*'
      styles: 'client/styles/**/*'
      images: 'client/images/*'
      templates: 'client/templates/**/*'

      app: [
        'client/scripts/application.coffee'
        'client/scripts/mixins/*'
        'client/scripts/helpers/*'
        'client/scripts/models/*'
        'client/scripts/collections/*'
        'client/scripts/views/VehicleHeader*'
        'client/scripts/views/*'
        'client/scripts/routers/*'
        'client/scripts/*.coffee'
        'client/scripts/start.coffee'
      ]

      vendor: [
        'node_modules/papaparse/papaparse.js'
        'node_modules/lodash/dist/lodash.js'
        'node_modules/jquery/dist/jquery.js'
        'node_modules/handlebars/dist/handlebars.runtime.js'
        'node_modules/backbone/backbone.js'
        'bower_components/thorax/thorax.js'
        'node_modules/moment/moment.js'
        'node_modules/numeral/numeral.js'
        'node_modules/marked/lib/marked.js'
        'node_modules/backbone.localstorage/backbone.localStorage.js'
        'bower_components/bootstrap-sass/dist/js/bootstrap.js'
        'bower_components/jquery-ui-sortable/jquery-ui-sortable.js'
        'bower_components/jquery-autosize/jquery.autosize.js'
        'bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js'
        'bower_components/nprogress/nprogress.js'
      ]

module.exports = config
