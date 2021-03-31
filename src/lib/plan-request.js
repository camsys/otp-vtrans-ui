var qs = require('querystring')

var Itineraries = require('./itineraries')
var ItineraryStop = require('./itinerary-stop')
var PlanAlerts = require('./plan-alerts')
var log = require('./log')('plan-request')
var PlanResponse = require('./plan-response')
var utils = require('./utils')

var Backbone = require("backbone")
var $ = window.$

var PlanRequest = Backbone.Model.extend({
  initialize: function (opts) {
    var self = this
    if (window.OTP_config.routerDefaults) {
      for (var key in window.OTP_config.routerDefaults) {
        this.set(key, window.OTP_config.routerDefaults[key])
      }
    }
    this.locale = $.i18n.locale;
    this.on('change', function () {
      self.request()
    })
  },

  defaults: {
    fromPlace: null,
    toPlace: null,
    intermediatePlaces: null,
    intermediatePlacesOrdered: null,
    date: null,
    time: null,
    routerId: null,
    arriveBy: null,
    wheelchair: null,
    maxWalkDistance: null,
    walkSpeed: null,
    bikeSpeed: null,
    triangleSafetyFactor: null,
    triangleSlopeFactor: null,
    triangleTimeFactor: null,
    optimize: null,
    mode: 'TRANSIT,WALK',
    minTransferTime: null,
    preferredRoutes: null,
    preferredAgencies: null,
    unpreferredRoutes: null,
    unpreferredAgencies: null,
    showIntermediateStops: null,
    bannedRoutes: null,
    bannedAgencies: null,
    bannedTrips: null,
    transferPenalty: null,
    maxTransfers: null,
    numItineraries: 3,
    wheelchairAccessible: false,
    flexFlagStopBufferSize: window.OTP_config.flagStopBufferSizeDefault,
    flexUseReservationServices: true,
    flexUseEligibilityServices: true,
    parkAndRide: true,
    locale: 'en',
  },

  request: function () {
    if (!this.attributes.fromPlace) {
      this.trigger('failure', 'Click the map or enter an address to select a start location')
    } else if (!this.attributes.toPlace) {
      this.trigger('failure', 'Click the map or enter an address to select an end location')
    } else {
      log('requesting plan %s', this.urlRoot + this.toQueryString())
      this.trigger('requesting', this)

      if (this.attributes.parkAndRide) {
        this.attributes.mode = 'TRANSIT,WALK,CAR_PARK'
      }


      var m = this

      $.ajax(this.urlRoot, {
        dataType: 'json',
        data: utils.filterParams(this.attributes)
      })
        .done(function (data) {
          log('processing results')
          if (data.error) {
            m.trigger('failure',
              window.OTP_config.noTripsFoundMessage
            )
          } else if (data && data.plan) {
            if (data.plan.from && data.plan.to) {
              if (data.plan.itineraries && data.plan.itineraries.length > 0) {
                m.trigger('success', m.processRequest(data.plan))
              } else {
                m.trigger('failure',
                  window.OTP_config.noTripsFoundMessage
                )
              }
            } else {
              m.trigger('failure',
                'Problem finding results for those locations. Please enter a valid start and end location.')
            }
          } else {
            m.trigger('failure',
              'Problem finding results for those locations. Please enter a valid start and end location.')
          }
        })
        .fail(function (xhr, status) {
          log('error: %s', status)
          m.trigger('failure', 'Unable to plan trip.')
        })
    }
  },

  processRequest: function (plan) {
    var itins = new Itineraries(plan.itineraries)

    // For each itin
    itins.each(function (itin) {
      itins.handleActivate(itin)
    })

    // Add alerts: migrated from a branch of OTP

    var alerts = [];
    var flexCallAndRideMaxStartTime = Math.max.apply(null, plan.itineraries.map(function(d) { return d.startTime }));
    if (flexCallAndRideMaxStartTime < new Date() && window.OTP_config.tripPlanInPastMessage) {
      alerts.push({ alertHeaderText: window.OTP_config.tripPlanInPastMessage })
    }
    if (window.OTP_config.outOfAreaPolygon) {
      if (!utils.isPointInPolygon(window.OTP_config.outOfAreaPolygon, plan.from.lat, plan.from.lon)
        || !utils.isPointInPolygon(window.OTP_config.outOfAreaPolygon, plan.to.lat, plan.to.lon)) {
        alerts.push( { alertHeaderText: window.OTP_config.outOfAreaMessage });
      }
    }

    var planAlerts = new PlanAlerts(alerts)
    return new PlanResponse({
      request: this,
      from: new ItineraryStop(plan.from),
      to: new ItineraryStop(plan.to),
      date: plan.date,
      itineraries: itins,
      alerts: planAlerts
    })
  },

  getFromLatLng: function () {
    if (!this.get('fromPlace')) {
      return null
    }

    var llStr = this.get('fromPlace').split('::')[0].split(',')
    return [parseFloat(llStr[0]), parseFloat(llStr[1])]
  },

  getToLatLng: function () {
    if (!this.get('toPlace')) {
      return null
    }

    var llStr = this.get('toPlace').split('::')[0].split(',')
    return [parseFloat(llStr[0]), parseFloat(llStr[1])]
  },

  toQueryString: function () {
    return '?' + qs.stringify(utils.filterParams(this.attributes))+'&locale='+userLang
  },

  fromQueryString: function (queryString) {
    this.set(qs.parse(queryString))
  }
})

module.exports = PlanRequest
