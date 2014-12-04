gulp    = require 'gulp'
process = require 'child_process'
path    = require 'path'
config  = require './config'
$       = require('gulp-load-plugins')()

gulp.task 'default', [
  'precompile'
  'watch'
  'nodemon'
]

gulp.task 'watch', ->
  gulp.watch config.paths.client.html, ['copy:html']
  gulp.watch config.paths.client.images, ['copy:images']
  gulp.watch config.paths.client.styles, ['styles']
  gulp.watch config.paths.client.scripts, ['scripts']
  gulp.watch config.paths.client.templates, ['templates']

gulp.task 'precompile', [
  'vendor'
  'scripts'
  'templates'
  'styles'
  'copy:images'
  'copy:html'
]

gulp.task 'vendor', ->
  gulp.src(config.paths.client.vendor)
   .pipe($.concat('vendor.js'))
   .pipe(gulp.dest(config.paths.www.assets))

gulp.task 'scripts', ->
  gulp.src(config.paths.client.app)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.concat('compiled.coffee'))
    .pipe($.coffee())
    .pipe($.concat('application.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.www.assets))

gulp.task 'styles', ->
  gulp.src(config.paths.client.styles)
    .pipe($.compass(
      css: config.paths.www.assets
      sass: config.base(config.paths.client.styles)
      images: config.base(config.paths.client.images)
      import_path: ['node_modules', 'bower_components']
    ))

gulp.task 'templates', ->
  gulp.src(config.paths.client.templates)
    .pipe($.plumber())
    .pipe($.handlebars())
    .pipe($.defineModule('plain'))
    .pipe($.declare({
      namespace: 'Handlebars.templates'
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest(config.paths.www.assets))

gulp.task 'copy:images', ->
  gulp.src(config.paths.client.images)
    .pipe(gulp.dest(config.paths.www.assets))

gulp.task 'copy:html', ->
  gulp.src(config.paths.client.html)
    .pipe(gulp.dest(config.paths.www.root))

gulp.task 'nodemon', ->
  $.nodemon({
    script: config.paths.server.main
  })

gulp.task 'server', ->
  gulp.src(config.paths.www.root)
    .pipe($.webserver({
      port: 8001
      livereload: true
      open: true
    }))

gulp.task 'deploy', ['precompile'], (done) ->
  proc = process.spawn 'git', ['push', 'heroku', 'heroku:master'],
    stdout: 'inherit'
  proc.on 'close', ->
    done()
