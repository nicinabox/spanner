Handlebars.registerHelpers
  log: (obj) ->
    console.log obj

  formatDate: (date, format) ->
    moment(new Date(date)).utc().format(format) if date

  formatNumber: (format, number) ->
    numeral(number).format(format) if number

  capitalize: (str) ->
    _.capitalize(str) if str

  markdown: (str) ->
    marked(str) if str

  any: (collection, options) ->
    if !_.isEmpty(collection)
      options.fn(this)
