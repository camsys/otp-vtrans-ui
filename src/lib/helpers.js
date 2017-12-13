import hbs from 'handlebars/runtime';
var Handlebars = hbs

var utils = require('./utils')

Handlebars.registerHelper('formatTime', function (time, offset, options) {
  if (time) {
    return utils.formatTime(time, options.hash.format, offset)
  } else {
    return ''
  }
})

Handlebars.registerHelper('formatTimeWithMaxStartTime', function (time, maxStartTime, offset, options) {
  if (time) {
    var timeFormatted = utils.formatTime(time, options.hash.format, offset)
    var maxStartTimeFormatted = utils.formatTime(maxStartTime, options.hash.format, offset)

    maxStartTimeFormatted = maxStartTimeFormatted.substring(maxStartTimeFormatted.indexOf(' ') + 1)
    maxStartTimeFormatted = maxStartTimeFormatted.substring(maxStartTimeFormatted.indexOf(' ') + 1)
    return timeFormatted + ' to ' + maxStartTimeFormatted
  } else {
    return ''
  }
})

Handlebars.registerHelper('formatTimeWithMinEndTime', function (time, minEndTime, offset, options) {
  if (time) {
    var timeFormatted = utils.formatTime(time, options.hash.format, offset)
    timeFormatted = timeFormatted.substring(timeFormatted.indexOf(' ') + 1)
    timeFormatted = timeFormatted.substring(timeFormatted.indexOf(' ') + 1)

    var minEndTimeFormatted = utils.formatTime(minEndTime, options.hash.format, offset)

    return minEndTimeFormatted + ' to ' + timeFormatted
  } else {
    return ''
  }
})

Handlebars.registerHelper('formatItineraryWithMaxStartTime', function (offset, options){
  var time = options.data.root.legs[0].attributes.startTime
  var maxStartTime = options.data.root.legs[0].attributes.maxStartTime

  var timeFormatted = utils.formatTime(time, options.hash.format, offset)
  var maxStartTimeFormatted = utils.formatTime(maxStartTime, options.hash.format, offset)

  maxStartTimeFormatted = maxStartTimeFormatted.substring(maxStartTimeFormatted.indexOf(' ') + 1)
  maxStartTimeFormatted = maxStartTimeFormatted.substring(maxStartTimeFormatted.indexOf(' ') + 1)

  if(maxStartTime !== null && maxStartTime != 'Invalid Date') {
    return 'between ' + timeFormatted + ' and ' + maxStartTimeFormatted
  }
  else{
    return 'at ' + timeFormatted
  }

})

Handlebars.registerHelper('formatDuration', function (duration) {
  if (duration) {
    return utils.secToHrMin(duration)
  } else {
    return ''
  }
})

// can this be handled by i18n framework?
Handlebars.registerHelper('ordinal', function (n) {
  if (n > 10 && n < 14) return n + 'th'
  switch (n % 10) {
    case 1:
      return n + 'st'
    case 2:
      return n + 'nd'
    case 3:
      return n + 'rd'
  }
  return n + 'th'
})

Handlebars.registerHelper('modeString', function (mode) {
  switch (mode) {
    case 'TRANSIT':
    case 'TRANSIT,WALK':
      return 'Transit'
    case 'TRAINISH':
    case 'TRAINISH,WALK':
      return 'Train only'
    case 'BUS':
    case 'BUS,WALK':
      return 'Bus only'
    case 'BICYCLE':
      return 'Bicycle only'
    case 'WALK':
      return 'Walk only'
    case 'CAR':
      return 'Drive only'
    case 'TRANSIT,BICYCLE':
      return 'Bike to Transit'
    case 'TRANSIT,CAR_PARK':
      return 'Drive to Transit'
  }
  return mode
})

Handlebars.registerHelper('isFlagStop', function (boardAlightType) {
  if (boardAlightType === 'FLAG_STOP') {
    return 'FLAG_STOP'
  }
  return ''
})

Handlebars.registerHelper('hasToTransitMessage', function(leg) {
  if (leg.data.root.drtPickupMessage !== null && leg.data.root.drtPickupMessage !== '') {
    return 'TRUE'
  }
  if (leg.data.root.to.boardAlightType === 'FLAG_STOP') {
    return 'FLAG_STOP'
  }
  return ''
})
Handlebars.registerHelper('hasFromTransitMessage', function(leg) {
  if (leg.data.root.drtDropOffMessage !== null && leg.data.root.drtDropOffMessage !== '') {
    return 'TRUE'
  }
  if (leg.data.root.from.boardAlightType === 'FLAG_STOP') {
    return 'FLAG_STOP'
  }
  
  return ''
})

Handlebars.registerHelper('itineraryFirstLegHasMaxStartTime', function(itinerary) {
  if (itinerary.data.root.legs[0].attributes.drtPickupMessage !== null) {
    return 'TRUE'
  }
  return ''
})

Handlebars.registerHelper('hasDrtPickupMessage', function (leg) {
  console.log(leg.data.root.from.boardAlightType)
  if (leg.data.root.drtPickupMessage !== null && leg.data.root.drtPickupMessage !== '' && leg.data.root.from.boardAlightType != 'FLAG_STOP') {
    return 'TRUE'
  }
  return ''
})
Handlebars.registerHelper('hasDrtDropOffMessage', function (leg) {
  console.log(leg.data.root.to.boardAlightType)
  if (leg.data.root.drtDropOffMessage !== null && leg.data.root.drtDropOffMessage !== '' && leg.data.root.to.boardAlightType != 'FLAG_STOP') {
    return 'TRUE'
  }
  return ''
})
Handlebars.registerHelper('hasDrtAdvanceBookMin', function (leg) {
  if (leg.data.root.drtAdvanceBookMin !== null && leg.data.root.drtAdvanceBookMin !== '') {
    return 'TRUE'
  }
  return ''
})
Handlebars.registerHelper('hasMaxStartTime', function (leg) {
  if (leg.data.root.maxStartTime !== null && leg.data.root.maxStartTime !== '' && leg.data.root.maxStartTime !== 'undefined') {
    return 'TRUE'
  }
  return ''
})
Handlebars.registerHelper('hasMinEndTime', function (leg) {
  if (leg.data.root.minEndTime !== null && leg.data.root.minEndTime !== '' && leg.data.root.minEndTime !== undefined) {
    return 'TRUE'
  }
  return ''
})

Handlebars.registerHelper('fareString', function (fare) {
  if (fare && fare.regular) {
    var cents = parseInt(fare.regular.cents)
    if (cents === 0) return ''
    var f = cents / Math.pow(10, fare.regular.currency.defaultFractionDigits)
    return fare.regular.currency.symbol + f.toFixed(fare.regular.currency.defaultFractionDigits)
  }
  return ''
})
