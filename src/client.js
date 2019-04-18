// styles
import "./lib/styles/map.css";
import "./lib/styles/narrative.css";
import "./lib/styles/request-form.css";
import "./lib/styles/tabs.css";
import "./lib/styles/topo.css";
import "./client.css";

// html
import "./index.html"
import "./config.js"

var $ = window.$
var Backbone = require("backbone")
var L = require("leaflet")
var OTP = require("./lib/index.js");

var ready = $(document).ready

// potentially: Google
if (window.OTP_config.useGoogleMaps) {
  ready = function(cb) { $(document).ready(function() { $.getScript("https://maps.googleapis.com/maps/api/js?v=3&libraries=places&" + window.OTP_config.googleAuth, cb); }) }
  require('leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant.js')
}

// full: http://stackoverflow.com/questions/13029904/twitter-bootstrap-add-class-to-body-referring-to-its-mode
// Assigns class to body based on the width of screen
// This is used to move narrative from sidebar to own tab in small screens
function assign_bootstrap_mode () {
  var width = $(window).width()
  var mode = ''
  var nar = $('#narrative').detach()
  if (width < 768) {
    mode = 'mode-xs'
    nar.appendTo('#plan')
    $('body').css( 'overflow-y', 'scroll' )
  } else if (width < 992) {
    mode = 'mode-sm'
    nar.appendTo('#plan')
    $('body').css( 'overflow-y', 'scroll' )
  } else {
    mode = 'mode-md'
    nar.appendTo('#sidebar')
  }

  $('body').removeClass('mode-md').removeClass('mode-sm').removeClass('mode-xs').addClass(mode)
}

ready(function () {
  var log = OTP.log('client')

  // set up the leafet map object
  var map = L.map('map').setView(window.OTP_config.initLatLng, (window.OTP_config.initZoom || 13))
  map.attributionControl.setPrefix('')

  var streetLayer, aerialLayer;
  
  if (window.OTP_config.useGoogleMaps) {
    
    streetLayer = L.gridLayer.googleMutant({
      type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    });
    
    aerialLayer = L.gridLayer.googleMutant({
      type: 'satellite'
    });
    
    // Wait for Google API to load before adding the default layer (streets).
    streetLayer._GAPIPromise.then(function() {
      streetLayer.addTo(map);
    })

  } else {
    // create OpenStreetMap tile layers for streets and aerial imagery
    streetLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          token: window.OTP_config.osmMapKey
    })
    
    aerialLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.satellite',
          token: window.OTP_config.osmMapKey
    })
    
    // display the OSM street layer by default
    streetLayer.addTo(map)
  }
    
  // create a leaflet layer control and add it to the map
  var baseLayers = {
    'Street Map': streetLayer,
    'Satellite Map': aerialLayer
  }
  
  L.control.layers(baseLayers).addTo(map)

  // create a data model for the currently visible stops, and point it
  // to the corresponding API method
  var stopsRequestModel = new OTP.StopsInRectangleRequest()
  stopsRequestModel.urlRoot = window.OTP_config.otpApi + 'default/index/stops'

  // create the stops request view, which monitors the map and updates the
  // bounds of the visible stops request as the viewable area changes
  new OTP.StopsRequestMapView({ // eslint-disable-line no-new
    model: stopsRequestModel,
    map: map
  })

  // create the stops response view, which refreshes the stop markers on the
  // map whenever the underlying visible stops model changes
  var stopsResponseMapView = new OTP.StopsResponseMapView({
    map: map
  })
  stopsRequestModel.on('success', function (response) {
    stopsResponseMapView.newResponse(response)
  })

  // create the main OTP trip plan request model and point it to the API
  var requestModel = new OTP.PlanRequest()
  requestModel.urlRoot = window.OTP_config.otpApi + 'default/plan'

  // create and render the main request view, which displays the trip
  // preference form
  var requestView = new OTP.RequestForm({
    model: requestModel,
    map: map,
    el: $('#request')
  })

  // create and render the request map view, which handles the map-specific
  // trip request elements( e.g. the start and end markers)
  var requestMapView = new OTP.RequestMapView({
    model: requestModel,
    map: map
  })

  // create the main response view, which refreshes the trip narrative display
  // and map elements as the underlying OTP response changes
  var responseView = new OTP.PlanResponseView({
    narrative: $('#narrative'),
    map: map
  })

  // instruct the response view to listen to relevant request model events

  var Router = Backbone.Router.extend({
    routes: {
      'start/:lat/:lon/:zoom': 'start',
      'start/:lat/:lon/:zoom/:routerId': 'startWithRouterId',
      'plan(?*querystring)': 'plan'
    },
    start: function (lat, lon, zoom) {
      map.setView(L.latLng(lat, lon), zoom)
    },
    startWithRouterId: function (lat, lon, zoom, routerId) {
      window.OTP_config.routerId = routerId

      requestModel.urlRoot = window.OTP_config.otpApi + routerId + '/plan'
      map.setView(L.latLng(lat, lon), zoom)
    },
    plan: function (querystring) {
      log('loading plan from querystring')
      requestModel.fromQueryString(querystring)
    }
  })

  var router = new Router()

  requestModel.on('change', function () {
    log('replacing url')
    router.navigate('plan' + requestModel.toQueryString(), { trigger: false })
  })
  requestModel.on('success', function (response) {
    responseView.newResponse(null, response)
  })
  requestModel.on('failure', function (error) {
    log('handling failure')
    responseView.newResponse(error, false)
  })

  log('rendering request views')

  requestMapView.render()
  requestView.render()

  log('starting router')

  Backbone.history.start({pushState: true})

  // make the UI responsive to resizing of the containing window
  function resize () {
    var height = $(window).height()
    $('#map').height(height)
    $('#sidebar').height(height)
    map.invalidateSize()
    assign_bootstrap_mode()
  }

  $(document).on('shown.bs.tab', 'a.formap', function () {
    map.invalidateSize()
  })

  $(window).resize(resize)
  resize()
  $('#tabs').tab()
  map.invalidateSize()
  assign_bootstrap_mode()


  var options = {
      // order and from where user language should be detected
    order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain', 'cookie'],

    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // cache user language on
    caches: ['localStorage', 'cookie'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

    // optional expire and domain for set cookie
    cookieMinutes: 10,
    cookieDomain: 'myDomain',

    // optional htmlTag with lang attribute, the default is:
    htmlTag: document.documentElement
  }

  $(document).ready(function(){
    // using default values from README
    i18next
    .use(window.i18nextBrowserLanguageDetector)
    .init({
      //lng: 'en',
      detection: options,
      resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
        en: {
            translation: {
                startAddr:'Start Address',
                endAddr:'End Address',
                nav: {
                    input:'Input',
                    plan:'Plan',
                    map:'Map',
                },
                handlebars: {
                    title:'VTRANS OTP UI',
                    to:'to',
                    toUP:'To',
                    setStartLocation:'Set Start Location',
                    setEndLocation: 'Set End Location',
                    dragOrForm:'Drag start and end location pins on the map or use the form above to adjust trip settings.',
                    option:'Option',
                    departs:'departs',
                    depart:'Depart',
                    exceedMaxWalk:'This itinerary exceeds your maximum walk distance.',
                    apprx:'approximately',
                    from:'From',
                    stopNum:'Stop #',
                    flagStop:'Flag Stop',
                    serviceNote:'Service note:',
                    arrive:'Arrive',
                    arriveBy:'Arrive at',
                    departBy:'Depart by',
                    hideSettings:'Hide Settings',
                    showSettings:'Show Settings',
                    maxWalk:'Max walk',
                    avoidWalking:'Avoid Walking',
                    mile14:'1/4 mile',
                    mile12:'1/2 mile',
                    mile34:'3/4 mile',
                    mile1:'1 mile',
                    miles2:'2 miles',
                    miles3:'3 miles',
                    miles5:'5 miles',
                    maxBike:'Max Bike',
                    servReqRes:'Show services requiring reservation',
                    servEliReq:'Show services with eligibility requirements',
                    submit:'Submit',
                    searching:'Searching',
                    toPlan:'To plan a trip: ',
                    selectStartEnd:'select a start and end location by clicking the map or by entering an address above.',
                    roundabout:'Take roundabout',
                    exitOn:'exit on',
                    startOn:'Start on',
                    heading:'heading',
                    toContinueOn:'to continue on',
                    onTo:'on to',
                }
            }
        },
        es: {
            translation: {
                startAddr:'Dirección de inicio',
                endAddr:'Dirección final',
                nav: {
                    input:'Entrada',
                    plan:'Plan',
                    map:'Mapa',
                },
                handlebars: {
                    title:'VTRANS OTP UI',
                    to:'a',
                    toUP:'A',
                    setStartLocation:'Establecer ubicación de inicio',
                    setEndLocation: 'Establecer ubicación final',
                    dragOrForm:'Coloque el pin de inicio y final, o use el formulario para la configuración del viaje.',
                    option:'Opción',
                    departs:'sale',
                    depart:'Salir',
                    exceedMaxWalk:'Este itinerario excede su distancia máxima de caminata.',
                    apprx:'Aproximadamente',
                    from:'Desde',
                    stopNum:'Parada #',
                    flagStop:'Problema con la parada',
                    serviceNote:'Nota de servicio:',
                    arrive:'Llegar',
                    arriveBy:'Llegar a',
                    departBy:'Salir a',
                    startAddr:'Dirección de inicio',
                    endAddr:'Dirección final',
                    hideSettings:'Ocultar Configuraciones',
                    showSettings:'Mostrar Settings',
                    maxWalk:'Caminata máxima',
                    avoidWalking:'Evitar caminar',
                    mile:'milla',
                    miles:'millas',
                    mile14:'1/4 milla',
                    mile12:'1/2 milla',
                    mile34:'3/4 milla',
                    mile1:'1 milla',
                    miles2:'2 millas',
                    miles3:'3 millas',
                    miles5:'5 millas',
                    maxBike:'Ciclismo maximo',
                    servReqRes:'Mostrar los servicios que requieren reserva.',
                    servEliReq:'Mostrar servicios con requisitos de elegibilidad.',
                    submit:'Entregar',
                    searching:'Buscando',
                    toPlan:'Planear un viaje: ',
                    selectStartEnd:'seleccione una ubicación de inicio y finalización en el mapa o ingrese una dirección arriba.',
                    roundabout:'Entrar en la rotonda',
                    exitOn:'salir en',
                    startOn:'comienza en',
                    heading:'dirigiéndose hacia',
                    toContinueOn:'continuar',
                    onTo:'sobre',
                }
            }
        },
      }
    }, function(err, t) {
      // for options see
      // https://github.com/i18next/jquery-i18next#initialize-the-plugin
      jqueryI18next.init(i18next, $);
      
      $(".localize").localize();
    });
  });

})
