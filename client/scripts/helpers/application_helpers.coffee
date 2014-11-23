Handlebars.registerHelpers
  log: (obj) ->
    console.log obj

  formatDate: (format, date) ->
    moment(date).format(format) if date

  formatNumber: (format, number) ->
    numeral(number).format(format) if number
