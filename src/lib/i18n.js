import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
.use(LanguageDetector)
.init({
    //lng: 'en',
    detection: options,
    resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
    en: {
        translation: {
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
                dragOrForm:'Drag pints on the map or use the form above to adjust trip settings.',
                option:'Option',
                departs:'Departs',
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
                startAddr:'Start Address',
                endAddr:'End Address',
                hideSettings:'Hide Settings',
                showSettings:'Show Settings',
                maxWalk:'Max walk',
                showServiceRequiringSpecialExceptions:'Show services that:',
                avoidWalking:'Avoid Walking',
                mile14:'1/4 mile maximum walk',
                mile12:'1/2 mile maximum walk',
                mile34:'3/4 mile maximum walk',
                mile1:'1 mile maximum walk',
                miles2:'2 miles maximum walk',
                miles3:'3 miles maximum walk',
                miles5:'5 miles maximum walk',
                maxBike:'Max Bike',
                servReqRes:'Requiring reservation',
                servEliReq:'Have eligibility requirements',
                submit:'Update Search',
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
                showSettings:'Mostrar Configuraciones',
                maxWalk:'Caminata máxima',
                showServiceRequiringSpecialExceptions:'Mostrar servicios que:',
                avoidWalking:'Evitar caminar',
                mile:'milla',
                miles:'millas',
                mile14:'1/4 milla de caminata máxima',
                mile12:'1/2 milla de caminata máxima',
                mile34:'3/4 milla de caminata máxima',
                mile1:'1 milla de caminata máxima',
                miles2:'2 millas de caminata máxima',
                miles3:'3 millas de caminata máxima',
                miles5:'5 millas de caminata máxima',
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