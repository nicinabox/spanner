Handlebars.registerHelpers
  formatDate: (format, date) ->
    moment(date).format(format)
