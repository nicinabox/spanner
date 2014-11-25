Handlebars.registerHelpers
  log: (obj) ->
    console.log obj

  formatDate: (format, date) ->
    moment(date).utc().format(format) if date

  formatNumber: (format, number) ->
    numeral(number).format(format) if number
