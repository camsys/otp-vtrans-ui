var ItineraryWalkSteps = require('./itinerary-walk-steps')

var Backbone = require("backbone")
var $ = window.$

var OTPURL = window.OTP_config.otpApi + window.OTP_config.routerId

var ItineraryLeg = Backbone.Model.extend({
  initialize: function () {
    this.set('steps', new ItineraryWalkSteps(this.get('steps')))
  },

  defaults: {
    mode: null,
    route: null,
    agencyName: null,
    agencyUrl: null,
    agencyTimeZoneOffset: null,
    routeColor: null,
    routeType: null,
    routeId: null,
    routeTextColor: null,
    interlineWithPreviousLeg: null,
    tripShortName: null,
    headsign: null,
    agencyId: null,
    tripId: null,
    routeShortName: null,
    routeLongName: null,
    boardAlightType: null,
    boardRule: null,
    alightRule: null,
    rentedBike: null,

    callAndRide: null,
    startTime: null,
    endTime: null,
    distance: null,

    toStop: null,
    fromStop: null,

    legGeometry: null,

    intermediateStops: [],

    flexDrtPickupMessage: null,
    flexDrtDropOffMessage: null,
    flexDrtAdvanceBookMin: null,
    flexFlagStopPickupMessage: null,
    flexFlagStopDropOffMessage: null,

    flexCallAndRideMaxStartTime: null,
    flexCallAndRideMinEndTime: null,

    steps: [],

    notes: [],

    alerts: []
  },

  isTransit: function (mode) {
    mode = mode || this.get('mode')
    return mode === 'TRANSIT' || mode === 'SUBWAY' || mode === 'FERRY' || mode === 'RAIL' ||
    mode === 'BUS' || mode === 'TRAM' || mode === 'GONDOLA' || mode ===
    'TRAINISH' || mode === 'BUSISH'
  },

  isWalk: function (mode) {
    mode = mode || this.get('mode')
    return mode === 'WALK'
  },

  isBicycle: function (mode) {
    mode = mode || this.get('mode')
    return mode === 'BICYCLE'
  },

  isCar: function (mode) {
    mode = mode || this.get('mode')
    return mode === 'CAR'
  },

  getMapColor: function (mode) {
    mode = mode || this.get('mode')
    if (mode === 'WALK') return '#444'
    if (mode === 'BICYCLE') return '#0073e5'
    if (mode === 'SUBWAY') {
      return this.useSpecificOrDefaultColor('#f00')
    }
    if (mode === 'RAIL') {
      return this.useSpecificOrDefaultColor('#b00')
    }
    if (mode === 'BUS') {
      return this.useSpecificOrDefaultColor('#080')
    }
    if (mode === 'TRAM') {
      return this.useSpecificOrDefaultColor('#800')
    }
    if (mode === 'FERRY') {
      return this.useSpecificOrDefaultColor('#008')
    }
    if (mode === 'CAR') return '#444'
    return '#aaa'
  },

  getTextColor: function (mode) {
    mode = mode || this.get('mode')
    if (mode === 'WALK') return '#aaa'
    if (mode === 'BICYCLE') return '#444'
    if (mode === 'SUBWAY') {
      return this.useSpecificOrDefaultTextColor('#444')
    }
    if (mode === 'RAIL') {
      return this.useSpecificOrDefaultTextColor('#aaa')
    }
    if (mode === 'BUS') {
      return this.useSpecificOrDefaultTextColor('#aaa')
    }
    if (mode === 'TRAM') {
      return this.useSpecificOrDefaultTextColor('#aaa')
    }
    if (mode === 'FERRY') {
      return this.useSpecificOrDefaultTextColor('#aaa')
    }
    if (mode === 'CAR') return '#aaa'
    return '#444'
  },

  useSpecificOrDefaultTextColor: function(color){
    rtc = this.get('routeTextColor')

    console.log(rtc)

    if(rtc != null && rtc != '')
    {
      return '#'+rtc
    }else{
      return color
    }
  },

  useSpecificOrDefaultColor: function(color){
    rc = this.get('routeColor')

    if(rc != null && rc != '')
    {
      return '#'+rc
    }else{
      return color
    }
  },

  isFlagStopLeg: function () {
    return this.isFromFlagStop() || this.isToFlagStop()
  },

  isFromFlagStop: function () {
    var boardAlightType = this.get('from').boardAlightType

    if (boardAlightType === 'FLAG_STOP') {
      return true
    }
    return false
  },

  isToFlagStop: function () {
    var boardAlightType = this.get('to').boardAlightType

    if (boardAlightType === 'FLAG_STOP') {
      return true
    }
    return false
  },

  isCallAndRide: function () {
    var callNRide = this.get('callAndRide')

    if (callNRide === null || callNRide === false) {
      return false
    }

    return true
  },

  getFromFlagStopArea: function () {
    return this.get('from').flagStopArea.points
  },

  getToFlagStopArea: function () {
    return this.get('to').flagStopArea.points
  },

  isDeviatedRouteLeg: function () {
    return this.isFromDeviatedRoute() || this.isToDeviatedRoute()
  },

  isFromDeviatedRoute: function () {
    var boardAlightType = this.get('from').boardAlightType

    if (boardAlightType === 'DEVIATED') {
      return true
    }
    return false
  },

  isToDeviatedRoute: function () {
    var boardAlightType = this.get('to').boardAlightType

    if (boardAlightType === 'DEVIATED') {
      return true
    }
    return false
  },

  getDeviatedRouteFromStartLat: function () {
    return this.get('from').lat
  },
  getDeviatedRouteFromEndLat: function () {
    return this.get('geomPoints')[0].lat
  },
  getDeviatedRouteFromStartLon: function () {
    return this.get('from').lon
  },
  getDeviatedRouteFromEndLon: function () {
    return this.get('geomPoints')[0].lng
  },

  getDeviatedRouteToStartLat: function () {
    var points = this.get('geomPoints');
    return points[points.length - 1].lat;
  },
  getDeviatedRouteToEndLat: function () {
    return this.get('to').lat
  },
  getDeviatedRouteToStartLon: function () {
    var points = this.get('geomPoints');
    return points[points.length - 1].lng;
  },
  getDeviatedRouteToEndLon: function () {
    return this.get('to').lon
  },

  getStopTimes: function (callback) {
    console.log(this.toJSON())
  },

  getSurroundingStopTimes: function (callback) {
    var from = this.get('from')
    var serviceDate = this.get('serviceDate')
    var qs = OTPURL + '/index/stops/' + from.stopId + '/stoptimes/' + serviceDate
    $.get(qs, callback)
  },

  getFlexService: function (callback) {
    var tripId = this.get('tripId');
    var from = this.get('from');
    var startIndex = from.stopIndex;
    var qs = OTPURL + '/flexService/' + tripId + '?startIndex' + startIndex;
    $.get(qs, callback);
  },

  hasflexDrtPickupMessage: function () {
    if (this.flexDrtPickupMessage !== null && this.flexDrtPickupMessage !== '') {
      return true
    }
    return false
  },

  hasflexDrtDropOffMessage: function () {
    if (this.flexDrtDropOffMessage !== null && this.flexDrtDropOffMessage !== '') {
      return true
    }
    return false
  },

  hasflexDrtAdvanceBookMin: function () {
    if (this.flexDrtAdvanceBookMin !== null && this.flexDrtAdvanceBookMin !== '') {
      return true
    }
    return false
  },

  hasflexFlagStopPickupMessage: function () {
    if (this.flexFlagStopPickupMessage !== null && this.flexFlagStopPickupMessage !== '') {
      return true
    }
    return false
  },

  hasflexFlagStopDropOffMessage: function () {
    if (this.flexFlagStopDropOffMessage !== null && this.flexFlagStopDropOffMessage !== '') {
      return true
    }
    return false
  },

  hasflexCallAndRideMaxStartTime: function () {
    if (this.flexCallAndRideMaxStartTime !== null && this.flexCallAndRideMaxStartTime !== '') {
      return true
    }
    return false
  },

  hasflexCallAndRideMinEndTime: function () {
    if (this.flexCallAndRideMinEndTime !== null && this.flexCallAndRideMinEndTime !== '') {
      return true
    }
    return false
  },

  getShortestLegDuration: function(){
    var legDurationShortest = -1

    if (this.hasflexCallAndRideMinEndTime()) {
      if(this.hasflexCallAndRideMaxStartTime()) {
        legDurationShortest = (leg.flexCallAndRideMinEndTime - leg.flexCallAndRideMaxStartTime) / 1000
      } else {
        legDurationShortest = (leg.flexCallAndRideMinEndTime - leg.startTime) / 1000
      }
    } else {
      if(this.hasflexCallAndRideMaxStartTime()) {
        legDurationShortest = (leg.endTime - leg.flexCallAndRideMaxStartTime) / 1000
      } else {
        legDurationShortest = leg.duration
      }
    }

    return legDurationShortest
  }
})

module.exports = ItineraryLeg
