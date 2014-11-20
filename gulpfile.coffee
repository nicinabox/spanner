gulp   = require 'gulp'
config = require './config'
$      = require('gulp-load-plugins')()

gulp.task 'default', [
  'precompile'
  'watch'
  'server'
]

gulp.task 'watch', ->
  gulp.watch config.paths.client.html, ['copy:html']
  gulp.watch config.paths.client.styles, ['styles']
  gulp.watch config.paths.client.scripts, ['scripts']
  gulp.watch config.paths.client.templates, ['templates']

gulp.task 'precompile', [
  'vendor'
  'scripts'
  'templates'
  'styles'
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
    import_path: ['node_modules']
  ))

gulp.task 'templates', ->
  gulp.src(config.paths.client.templates)
    .pipe($.handlebars())
    .pipe($.defineModule('plain'))
    .pipe($.declare({
      namespace: 'JST'
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest(config.paths.www.assets))

gulp.task 'copy:html', ->
  gulp.src(config.paths.client.html)
    .pipe(gulp.dest(config.paths.www.root))

gulp.task 'server', ->
  gulp.src(config.paths.www.root)
    .pipe($.webserver({
      port: 8001
      livereload: true
      open: true
    }))
