Handlebars.registerHelpers
  log: (obj) ->
    console.log obj

  formatDate: (format, date) ->
    moment(new Date(date)).utc().format(format) if date

  formatNumber: (format, number) ->
    numeral(number).format(format) if number

  markdown: (str) ->
    marked(str) if str

  any: (collection, options) ->
    if !_.isEmpty(collection)
      options.fn(this)
