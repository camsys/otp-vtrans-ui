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

Handlebars.registerHelper('formatTimeWithflexCallAndRideMaxStartTime', function (time, flexCallAndRideMaxStartTime, offset, options) {
  if (time) {
    var timeFormatted = utils.formatTime(time, options.hash.format, offset)
    var flexCallAndRideMaxStartTimeFormatted = utils.formatTime(flexCallAndRideMaxStartTime, options.hash.format, offset)

    flexCallAndRideMaxStartTimeFormatted = flexCallAndRideMaxStartTimeFormatted.substring(flexCallAndRideMaxStartTimeFormatted.indexOf(' ') + 1)
    flexCallAndRideMaxStartTimeFormatted = flexCallAndRideMaxStartTimeFormatted.substring(flexCallAndRideMaxStartTimeFormatted.indexOf(' ') + 1)
    return timeFormatted + ' to ' + flexCallAndRideMaxStartTimeFormatted
  } else {
    return ''
  }
})

Handlebars.registerHelper('formatTimeWithflexCallAndRideMinEndTime', function (time, flexCallAndRideMinEndTime, offset, options) {
  if (time) {
    var timeFormatted = utils.formatTime(time, options.hash.format, offset)
    timeFormatted = timeFormatted.substring(timeFormatted.indexOf(' ') + 1)
    timeFormatted = timeFormatted.substring(timeFormatted.indexOf(' ') + 1)

    var flexCallAndRideMinEndTimeFormatted = utils.formatTime(flexCallAndRideMinEndTime, options.hash.format, offset)

    return flexCallAndRideMinEndTimeFormatted + ' to ' + timeFormatted
  } else {
    return ''
  }
})

Handlebars.registerHelper('formatItineraryWithflexCallAndRideMaxStartTime', function (offset, options){
  var time = options.data.root.legs[0].attributes.startTime
  var flexCallAndRideMaxStartTime = options.data.root.legs[0].attributes.flexCallAndRideMaxStartTime

  if(flexCallAndRideMaxStartTime !== null && flexCallAndRideMaxStartTime != 'Invalid Date') {

    var averageTime = (time+flexCallAndRideMaxStartTime)/2
    var averageTimeFormatted = utils.formatTime(averageTime, options.hash.format, offset)

    return 'approximately ' + averageTimeFormatted
  }
  else{
    var timeFormatted = utils.formatTime(time, options.hash.format, offset)
    return 'at ' + timeFormatted
  }

})

Handlebars.registerHelper('includePlusForVariableDurationTrips', function (offset, options){
  var flexCallAndRideMaxStartTime = options.data.root.legs[0].attributes.flexCallAndRideMaxStartTime

  if(flexCallAndRideMaxStartTime !== null && flexCallAndRideMaxStartTime != 'Invalid Date') {
    return '+'
  }
  else{
    return ''
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


Handlebars.registerHelper('flagStopDropOffText', function(leg) {
  return window.OTP_config.flagStopDropOffText
})
Handlebars.registerHelper('flagStopPickupText', function(leg) {
  return window.OTP_config.flagStopPickupText
})
Handlebars.registerHelper('deviatedRouteText', function(leg) {
  return window.OTP_config.deviatedRouteText
})



Handlebars.registerHelper('isFlagStop', function (boardAlightType) {
  if (isFlagStopHelper(boardAlightType)) {
    return 'FLAG_STOP'
  }
  return ''
})

Handlebars.registerHelper('hasToTransitMessage', function(leg) {
  if ( (leg.data.root.flexDrtDropOffMessage !== null && leg.data.root.flexDrtDropOffMessage !== '') || (leg.data.root.flexFlagStopDropOffMessage !== null && leg.data.root.flexFlagStopDropOffMessage !== '')){
    return 'TRUE'
  }

  if (leg.data.root.to.boardAlightType === 'FLAG_STOP' || leg.data.root.to.boardAlightType === 'DEVIATED' || leg.data.root.to.boardAlightType === 'CALLANDRIDE') {
    return 'FLAG_STOP'
  }
  return ''
})
Handlebars.registerHelper('hasFromTransitMessage', function(leg) {
  if(isFlagStopHelper(leg.data.root.from.boardAlightType) || isCallAndRideHelper(leg.data.root.from.boardAlightType))
  {
    return 'TRUE'
  }

  return ''
})

function isFlagStopHelper(boardAlightType) {
  return (boardAlightType === 'FLAG_STOP')
}
function isCallAndRideHelper(boardAlightType)
{
  return (boardAlightType !== null && boardAlightType == 'DEVIATED') || (boardAlightType !== null && boardAlightType == 'CALLANDRIDE')
}

Handlebars.registerHelper('itineraryFirstLegHasflexCallAndRideMaxStartTime', function(itinerary) {
  if (itinerary.data.root.legs[0].attributes.flexDrtPickupMessage !== null) {
    return 'TRUE'
  }
  return ''
})

Handlebars.registerHelper('hasflexDrtPickupMessage', function (leg) {
  if (flexDrtPickupMessage(leg)) {
    return 'TRUE'
  }
  return ''
})
Handlebars.registerHelper('hasflexDrtDropOffMessage', function (leg) {

  if (flexDrtDropOffMessage(leg)) {
    return 'TRUE'
  }
  return ''
})

function flexDrtPickupMessage(leg){
  return leg.data.root.flexDrtPickupMessage !== null && leg.data.root.flexDrtPickupMessage !== '' && leg.data.root.from.boardAlightType != 'FLAG_STOP';
}
function flexDrtDropOffMessage(leg){
  return leg.data.root.flexDrtDropOffMessage !== null && leg.data.root.flexDrtDropOffMessage !== '' && leg.data.root.to.boardAlightType != 'FLAG_STOP';
}

Handlebars.registerHelper('hasflexFlagStopPickupMessage', function (leg) {
  if (leg.data.root.flexFlagStopPickupMessage !== null && leg.data.root.flexFlagStopPickupMessage !== '') {
    return 'TRUE'
  }
  return ''
})
Handlebars.registerHelper('hasflexFlagStopDropOffMessage', function (leg) {
  if (leg.data.root.flexFlagStopDropOffMessage !== null && leg.data.root.flexFlagStopDropOffMessage !== '') {
    return 'TRUE'
  }
  return ''
})

Handlebars.registerHelper('isAnyCallAndRideFromAttributes', function(attributes)
{
  var fromBAT = attributes.from.boardAlightType
  var toBAT = attributes.to.boardAlightType

  return determineCallAndRideStatus(fromBAT, toBAT)
})

Handlebars.registerHelper('isAnyCallAndRide', function(leg)
{
  var fromBAT = leg.data.root.from.boardAlightType
  var toBAT = leg.data.root.to.boardAlightType

  return determineCallAndRideStatus(fromBAT, toBAT)
})

function determineCallAndRideStatus(fromBAT, toBAT)
{
  if( (fromBAT === 'DEVIATED' || fromBAT === 'CALLANDRIDE') ||
    (toBAT === 'DEVIATED'   || toBAT === 'CALLANDRIDE')
  ){
    return 'TRUE'
  }
  return ''
}

Handlebars.registerHelper('isCallAndRide', function (boardAlightType) {
  if (isCallAndRideHelper(boardAlightType)) {
    return 'TRUE'
  }
  return ''
})

Handlebars.registerHelper('hideDropoffDeviatedMessage', function (leg) {
  if (leg.data.root.callAndRide) {
     return 'TRUE'
  }
  return ''
})

Handlebars.registerHelper('hasflexDrtAdvanceBookMin', function (leg) {
  if (leg.data.root.flexDrtAdvanceBookMin !== null && leg.data.root.flexDrtAdvanceBookMin !== '') {
    return 'TRUE'
  }
  return ''
})

Handlebars.registerHelper('hasflexCallAndRideMaxStartTime', function (leg) {
  if (leg.data.root.flexCallAndRideMaxStartTime !== null && leg.data.root.flexCallAndRideMaxStartTime !== '' && leg.data.root.flexCallAndRideMaxStartTime !== 'undefined') {
    return 'TRUE'
  }
  return ''
})
Handlebars.registerHelper('hasflexCallAndRideMinEndTime', function (leg) {
  if (leg.data.root.flexCallAndRideMinEndTime !== null && leg.data.root.flexCallAndRideMinEndTime !== '' && leg.data.root.flexCallAndRideMinEndTime !== undefined) {
    return 'TRUE'
  }
  return ''
})

Handlebars.registerHelper('hasResultNumber', function (count, itins) {
  if (itins.data.root.itins !== undefined && itins.data.root.itins.length >= count) {
    return 'TRUE'
  }
  return ''
})


Handlebars.registerHelper('fareString', function (fare) {
  if (fare && fare.regular) {
    var cents = parseInt(fare.regular.cents)
    if (cents <= 0 ) return ''
    var f = cents / Math.pow(10, fare.regular.currency.defaultFractionDigits)
    return fare.regular.currency.symbol + f.toFixed(fare.regular.currency.defaultFractionDigits)
  }
  return ''
})

