var log = require('./log')('itinerary-map-view')
var utils = require('./utils')

var Backbone = require("backbone");
var L = require("leaflet");
require("leaflet-polylinedecorator");
require("leaflet-curve");
require("./leaflet-shifted-polyline.js")

var flagStopIcon;
var flagStopLineStyle

var ItineraryMapView = Backbone.View.extend({
  initialize: function (options) {
    var self = this

    flagStopIcon = L.divIcon({
      className: 'otp-flagStop',
      iconAnchor: [10, 15],
      iconSize: [28, 28],
    })

    flagStopLineStyle = {
      color: window.OTP_config.flagStopLineColor,
      weight: 7
      // weight: window.OTP_config.flagStopLineWeight
    }

    this.options = options || {}

    this.attachedToMap = false
    this.pathLayer = new L.LayerGroup()
    this.stopLayer = new L.LayerGroup()
    this.pathMarkerLayer = new L.LayerGroup()
    this.highlightLayer = new L.LayerGroup()

    this.listenTo(this.model, 'activate', function () {
      self.preview = false
      self.render()
    })

    this.listenTo(this.model, 'mouseenter', function () {
      self.preview = true
      self.render()
    })

    this.listenTo(this.model, 'deactivate', function () {
      self.clearLayers()
    })

    this.listenTo(this.model, 'mouseleave', function () {
      self.clearLayers()
    })

    this.model.get('legs').each(function (leg) {
      self.initializeLeg(leg)
    })
  },

  initializeLeg: function (leg) {
    var self = this

    this.listenTo(leg, 'mouseenter', function () {
      self.highlightLeg = leg
      self.render()
    })

    this.listenTo(leg, 'mouseleave', function () {
      self.highlightLeg = null
      self.render()
    })

    this.listenTo(leg, 'fromclick', function () {
      var from = leg.get('from')
      self.options.map.panTo([from.lat, from.lon])
    })

    this.listenTo(leg, 'toclick', function () {
      var to = leg.get('to')
      self.options.map.panTo([to.lat, to.lon])
    })

    var steps = leg.get('steps')
    if (!steps || !steps.length) return

    steps.forEach(function (step) {
      self.initializeStep(step)
    })
  },

  initializeStep: function (step) {
    var self = this
    this.listenTo(step, 'click', function () {
      self.options.map.panTo([step.get('lat'), step.get('lon')])
    })

    this.listenTo(step, 'mouseleave', function () {
      self.options.map.closePopup()
    })
  },

  attachToMap: function () {
    this.options.map.addLayer(this.highlightLayer)
    this.options.map.addLayer(this.pathLayer)
    this.options.map.addLayer(this.pathMarkerLayer)
    this.options.map.addLayer(this.stopLayer)
    this.attachedToMap = true
  },

  detachFromMap: function () {
    this.options.map.removeLayer(this.highlightLayer)
    this.options.map.removeLayer(this.pathLayer)
    this.options.map.removeLayer(this.pathMarkerLayer)
    this.options.map.removelayer(this.stopLayer)
    this.attachedToMap = false
  },

  render: function () {
    if (!this.attachedToMap) this.attachToMap()
    this.clearLayers()

    this.mapBounds = new L.LatLngBounds()

    var self = this
    this.model.get('legs').forEach(function (leg) {
      if (!leg.isCallAndRide()) {
        self.renderLeg(leg)
      } else {
        self.renderCallAndRideLeg(leg)
      }
    })

    this.options.map.fitBounds(this.mapBounds)
  },

  renderLeg: function (leg) {
    var popupContent, minutes
    var points = leg.get('geomPoints')
    var weight = 8

    // draw highlight, if applicable
    if (this.highlightLeg === leg) {
      var highlight = new L.Polyline(points)
      highlight.setStyle({
        color: '#ffff00',
        weight: weight * 2,
        opacity: this.preview ? 0.75 : 0.75
      })
      this.highlightLayer.addLayer(highlight)
    }

    // draw the polyline
    var polyline = new L.Polyline(points)

    polyline.setStyle({
      color: this.options.legColor || leg.getMapColor(),
      weight: weight,
      opacity: this.preview ? 0.75 : 0.75
    })
    this.pathLayer.addLayer(polyline)
    polyline.leg = leg

    this.mapBounds.extend(polyline.getBounds())

    if (leg.isWalk() || leg.isBicycle()) {
      popupContent = '<div class="otp-legMode-icon otp-legMode-icon-' + leg.get('mode') + '"></div> <div class="otp-legMode-icon otp-legMode-icon-arrow-right"></div> ' + leg.get('to').name

      popupContent += '<br/>'

      minutes = leg.get('duration') / 60
      popupContent += Math.round(minutes) + ' mins '

      var distance = utils.distanceString(leg.get('distance'), this.options
        .metric)
      popupContent += distance

      polyline.bindTooltip(popupContent)

      for (var step in leg.get('steps').models) {
        this.pathMarkerLayer.addLayer(this.getStepBubbleMarker(leg, leg.get(
          'steps').models[step]))
      }
    } else if (leg.isTransit()) {
      popupContent = '<div class="otp-legMode-icon otp-legMode-icon-' + leg
          .get('mode') + '"></div> '

      if (leg.get('routeShortName')) {
        popupContent += leg.get('routeShortName')
      }

      if (leg.get('routeLongName')) {
        if (popupContent !== '') {
          popupContent += ' '
        }

        popupContent += leg.get('routeLongName') + '<br/> '
      }

      popupContent += ' <div class="otp-legMode-icon otp-legMode-icon-arrow-right"></div> ' + leg.get('to').name

      minutes = leg.get('duration') / 60
      popupContent += ' (' + Math.round(minutes) + ' mins)'

      if (leg.isFlagStopLeg() === true) {
        var flagStopContent = popupContent + '<h5>Flag Stop</h5> <br/>'

        if (leg.isFromFlagStop() === true) {
          var flagStopContent = flagStopContent + leg.get('continuousPickupMessage')
          var fromFlagStopMarker = L.marker([leg.get('from').lat, leg.get('from').lon], {icon: flagStopIcon});
          var fromStopLine = new L.ShiftedPolyline(utils.decodePolyline(leg.getFromFlagStopArea()), {dashArray: "10 10"});
          fromStopLine.setStyle(flagStopLineStyle)

          fromStopLine.bindTooltip(flagStopContent)
          this.stopLayer.addLayer(fromStopLine)
          this.stopLayer.addLayer(fromFlagStopMarker)
        }
        if (leg.isToFlagStop() === true) {
          var flagStopContent = flagStopContent + leg.get('continuousDropOffMessage')
          var toFlagStopMarker = L.marker([leg.get('to').lat, leg.get('to').lon], {icon: flagStopIcon});
          var toStopLine = new L.ShiftedPolyline(utils.decodePolyline(leg.getToFlagStopArea()), {dashArray: "10 10"});
          toStopLine.setStyle(flagStopLineStyle)

          toStopLine.bindTooltip(flagStopContent)
          this.stopLayer.addLayer(toStopLine)
          this.stopLayer.addLayer(toFlagStopMarker)
        }
      }
      if (leg.isDeviatedRouteLeg()) {
        popupContent += '<h5>Deviated Route</h5> <br/>'

        if (leg.isFromDeviatedRoute() === true) {
          if (leg.hasDrtPickupMessage()) {
            popupContent += 'Pickup Notice: ' + leg.get('drtPickupMessage') + '<br/>'
          }
          var fromOriginLatLong = [leg.getDeviatedRouteFromStartLat(), leg.getDeviatedRouteFromStartLon()]
          var fromDestinationLatLong = [leg.getDeviatedRouteFromEndLat(), leg.getDeviatedRouteFromEndLon()]

          var fromArcPoint = this.determineArcPoint(fromDestinationLatLong, fromOriginLatLong)

          var fromCurvedPath = L.curve([
            'M', fromOriginLatLong,
            'Q', fromArcPoint, fromDestinationLatLong
          ])
          fromCurvedPath.setStyle({
            color: window.OTP_config.flagStopLineColor,
            weight: 5,
            vertices: 20000000,
            offset: 100
          })

          fromCurvedPath.bindTooltip(popupContent)
          this.stopLayer.addLayer(fromCurvedPath)
        }
        if (leg.isToDeviatedRoute() === true) {
          if (leg.hasDrtDropOffMessage()) {
            popupContent += 'Drop Off Notice: ' + leg.get('drtDropOffMessage') + '<br/>'
          }
          var toOriginLatLong = [leg.getDeviatedRouteToStartLat(), leg.getDeviatedRouteToStartLon()]
          var toDestinationLatLong = [leg.getDeviatedRouteToEndLat(), leg.getDeviatedRouteToEndLon()]

          var toArcPoint = this.determineArcPoint(toOriginLatLong, toDestinationLatLong)

          var toCurvedPath = L.curve([
            'M', toOriginLatLong,
            'Q', toArcPoint, toDestinationLatLong
          ])
          toCurvedPath.setStyle({
            color: window.OTP_config.flagStopLineColor,
            weight: 5,
            vertices: 20000000,
            offset: 100
          })

          toCurvedPath.bindTooltip(popupContent)
          this.stopLayer.addLayer(toCurvedPath)
        }
      }
      polyline.bindTooltip(popupContent)
    }

    var marker = this.getLegFromBubbleMarker(leg, this.highlightLeg === leg)
    this.pathMarkerLayer.addLayer(marker)
  },

  renderCallAndRideLeg: function (leg) {
    // draw the arc a
    var popupContent = '<div class="otp-legMode-icon otp-legMode-icon-' + leg.get('mode') + '"></div> <div class="otp-legMode-icon otp-legMode-icon-arrow-right"></div> ' + leg.get('to').name

    popupContent += '<br/>'

    var minutes = leg.get('duration') / 60
    popupContent += Math.round(minutes) + ' mins '

    var deviatedRouteContent = popupContent + '<h5>Call And Ride</h5> <br/>'

    if (leg.hasDrtPickupMessage()) {
      deviatedRouteContent += 'Pickup Notice: ' + leg.get('drtPickupMessage') + '<br/>'
    }
    if (leg.hasDrtDropOffMessage()) {
      deviatedRouteContent += 'Drop Off Notice: ' + leg.get('drtDropOffMessage') + '<br/>'
    }

    var fromOriginLatLong = [leg.getDeviatedRouteFromStartLat(), leg.getDeviatedRouteFromStartLon()]
    var toDestinationLatLong = [leg.getDeviatedRouteToEndLat(), leg.getDeviatedRouteToEndLon()]

    var fromArcPoint = this.determineArcPoint(fromOriginLatLong, toDestinationLatLong)

    var fromCurvedPath = L.curve([
      'M', fromOriginLatLong,
      'Q', fromArcPoint, toDestinationLatLong
    ])
    fromCurvedPath.setStyle({
      color: window.OTP_config.flagStopLineColor,
      weight: 5,
      vertices: 20000000,
      offset: 100
    })

    fromCurvedPath.bindTooltip(deviatedRouteContent)
    this.stopLayer.addLayer(fromCurvedPath)
    var marker = this.getLegFromBubbleMarker(leg, this.highlightLeg === leg)
    this.pathMarkerLayer.addLayer(marker)
    this.mapBounds.extend(fromCurvedPath.getBounds())
  },
  determineArcPoint: function (originLatLong, destinationLatLong) {
    var offsetLong = destinationLatLong[1] - originLatLong[1]
    var offsetLat = destinationLatLong[0] - originLatLong[0]
    var r = Math.sqrt(Math.pow(offsetLong, 2) + Math.pow(offsetLat, 2))
    var theta = Math.atan2(offsetLat, offsetLong)
    var thetaOffset = (3.14 / 6)
    var r2 = (r / 2) / (Math.cos(thetaOffset))
    var theta2 = theta + thetaOffset
    var midpointLong = (r2 * Math.cos(theta2)) + originLatLong[1]
    var midpointLat = (r2 * Math.sin(theta2)) + originLatLong[0]
    return [midpointLat, midpointLong]
  },

  getStepBubbleMarker: function (leg, step) {
    var marker = new L.CircleMarker([step.get('lat'), step.get('lon')], {
      color: '#666',
      stroke: 3,
      radius: 5,
      fillColor: '#aaa',
      opacity: 1.0,
      fillOpacity: 1.0
    })

    if (step.get('relativeDirection')) {
      var popupContent =
      '<span class="otp-legStepLabel-icon otp-legStep-icon-' + step.get(
          'relativeDirection') + '"></span>' +
        ' <div class="otp-legMode-icon otp-legMode-icon-' + leg.get('mode') +
        '"></div> ' + step.get('streetName')

      popupContent += ' ('

      var distance = utils.distanceString(step.get('distance'), this.options.metric)

      popupContent += distance + ' )'

      marker.bindTooltip(popupContent)
    }

    return marker
  },

  getLegFromBubbleMarker: function (leg, highlight) {
    var popupContent =
    '<div class="otp-legMode-icon otp-legMode-icon-arrow-right"></div>  <div class="otp-legMode-icon otp-legMode-icon-' +
      leg.get('mode') + '"></div> '

    if (leg.get('routeShortName')) {
      popupContent += leg.get('routeShortName')
    }

    if (leg.get('routeLongName')) {
      if (popupContent !== '') {
        popupContent += ' '
      }

      popupContent += leg.get('routeLongName')
    }

    popupContent += ' ' + utils.formatTime(leg.get('startTime'), null, this.options.planView.model.getTimeOffset()) + ' '

    var markerOpacity = 1.0

    if (leg.isFromFlagStop() === true) {
      markerOpacity = 0.0
    }

    var marker = new L.CircleMarker([leg.get('from').lat, leg.get('from').lon], {
      color: '#000',
      stroke: 10,
      radius: 5,
      fillColor: '#fff',
      opacity: markerOpacity,
      fillOpacity: markerOpacity
    })

    marker.bindTooltip(popupContent)

    return marker
  },

  getLegBubbleAnchor: function (quadrant) {
    if (quadrant === 'nw') return [32, 44]
    if (quadrant === 'ne') return [0, 44]
    if (quadrant === 'sw') return [32, 0]
    if (quadrant === 'se') return [0, 0]
  },

  clearLayers: function () {
    log('clearing itinerary layers')

    this.pathLayer.clearLayers()
    this.pathMarkerLayer.clearLayers()
    this.highlightLayer.clearLayers()
    this.stopLayer.clearLayers()
  }
})

module.exports = ItineraryMapView;
