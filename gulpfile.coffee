gulp = require 'gulp'
_    = require 'lodash'
$    = require('gulp-load-plugins')()


# Much config
config =
  www:
    root: 'public'
    assets: 'assets'

  client:
    root: 'client'
    html: '*.html'
    scripts: 'scripts/**/*'
    styles: 'styles/**/*'
    templates: 'templates/**/*'

_.each config, (v, group) ->
  _.each v, (v, k) ->
    unless k == 'root'
      config[group][k] = [config[group].root, config[group][k]].join('/')


# Very task
gulp.task 'default', [
  'precompile'
  'watch'
  'server'
]

gulp.task 'watch', ->
  gulp.watch config.client.html, ['copy:html']
  gulp.watch config.client.styles, ['styles']
  gulp.watch config.client.scripts, ['scripts']
  gulp.watch config.client.templates, ['templates']

gulp.task 'precompile', [
  'scripts'
  'templates'
  'styles'
  'copy:html'
]

gulp.task 'scripts', ->
  gulp.src(config.client.scripts)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.concat('compiled.coffee'))
    .pipe($.coffee())
    .pipe($.concat('application.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.www.assets))

gulp.task 'styles', ->
  gulp.src(config.client.styles)
  .pipe($.compass(
    css: config.www.assets
    sass: config.client.styles.replace('/**/*', '')
    import_path: ['node_modules']
  ))

gulp.task 'templates', ->
  gulp.src(config.client.templates)
    .pipe($.handlebars())
    .pipe($.defineModule('plain'))
    .pipe($.declare({
      namespace: 'JST'
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest(config.www.assets))

gulp.task 'copy:html', ->
  gulp.src(config.client.html)
    .pipe(gulp.dest(config.www.root))

gulp.task 'server', ->
  gulp.src(config.www.root)
    .pipe($.webserver({
      port: 8001
      livereload: true
      open: true
    }))
