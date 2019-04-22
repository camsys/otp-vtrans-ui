
//   $(document).ready(function(){
//     console.log("here");
//     // using default values from README
//     i18next
//     .use(window.i18nextBrowserLanguageDetector)
//     .init({
//       //lng: 'en',
//       detection: options,
//       resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
//         en: {
//             translation: {
//                 startAddr:'Start Address',
//                 endAddr:'End Address',
//                 nav: {
//                     input:'Input',
//                     plan:'Plan',
//                     map:'Map',
//                 },
//                 handlebars: {
//                     title:'VTRANS OTP UI',
//                     to:'to',
//                     toUP:'To',
//                     setStartLocation:'Set Start Location',
//                     setEndLocation: 'Set End Location',
//                     dragOrForm:'Drag start and end location pins on the map or use the form above to adjust trip settings.',
//                     option:'Option',
//                     departs:'departs',
//                     depart:'Depart',
//                     exceedMaxWalk:'This itinerary exceeds your maximum walk distance.',
//                     apprx:'approximately',
//                     from:'From',
//                     stopNum:'Stop #',
//                     flagStop:'Flag Stop',
//                     serviceNote:'Service note:',
//                     arrive:'Arrive',
//                     arriveBy:'Arrive at',
//                     departBy:'Depart by',
//                     hideSettings:'Hide Settings',
//                     showSettings:'Show Settings',
//                     maxWalk:'Max walk',
//                     avoidWalking:'Avoid Walking',
//                     mile14:'1/4 mile',
//                     mile12:'1/2 mile',
//                     mile34:'3/4 mile',
//                     mile1:'1 mile',
//                     miles2:'2 miles',
//                     miles3:'3 miles',
//                     miles5:'5 miles',
//                     maxBike:'Max Bike',
//                     servReqRes:'Show services requiring reservation',
//                     servEliReq:'Show services with eligibility requirements',
//                     submit:'Submit',
//                     searching:'Searching',
//                     toPlan:'To plan a trip: ',
//                     selectStartEnd:'select a start and end location by clicking the map or by entering an address above.',
//                     roundabout:'Take roundabout',
//                     exitOn:'exit on',
//                     startOn:'Start on',
//                     heading:'heading',
//                     toContinueOn:'to continue on',
//                     onTo:'on to',
//                 }
//             }
//         },
//         es: {
//             translation: {
//                 startAddr:'Dirección de inicio',
//                 endAddr:'Dirección final',
//                 nav: {
//                     input:'Entrada',
//                     plan:'Plan',
//                     map:'Mapa',
//                 },
//                 handlebars: {
//                     title:'VTRANS OTP UI',
//                     to:'a',
//                     toUP:'A',
//                     setStartLocation:'Establecer ubicación de inicio',
//                     setEndLocation: 'Establecer ubicación final',
//                     dragOrForm:'Coloque el pin de inicio y final, o use el formulario para la configuración del viaje.',
//                     option:'Opción',
//                     departs:'sale',
//                     depart:'Salir',
//                     exceedMaxWalk:'Este itinerario excede su distancia máxima de caminata.',
//                     apprx:'Aproximadamente',
//                     from:'Desde',
//                     stopNum:'Parada #',
//                     flagStop:'Problema con la parada',
//                     serviceNote:'Nota de servicio:',
//                     arrive:'Llegar',
//                     arriveBy:'Llegar a',
//                     departBy:'Salir a',
//                     startAddr:'Dirección de inicio',
//                     endAddr:'Dirección final',
//                     hideSettings:'Ocultar Configuraciones',
//                     showSettings:'Mostrar Configuraciones',
//                     maxWalk:'Caminata máxima',
//                     avoidWalking:'Evitar caminar',
//                     mile:'milla',
//                     miles:'millas',
//                     mile14:'1/4 milla',
//                     mile12:'1/2 milla',
//                     mile34:'3/4 milla',
//                     mile1:'1 milla',
//                     miles2:'2 millas',
//                     miles3:'3 millas',
//                     miles5:'5 millas',
//                     maxBike:'Ciclismo maximo',
//                     servReqRes:'Mostrar los servicios que requieren reserva.',
//                     servEliReq:'Mostrar servicios con requisitos de elegibilidad.',
//                     submit:'Entregar',
//                     searching:'Buscando',
//                     toPlan:'Planear un viaje: ',
//                     selectStartEnd:'seleccione una ubicación de inicio y finalización en el mapa o ingrese una dirección arriba.',
//                     roundabout:'Entrar en la rotonda',
//                     exitOn:'salir en',
//                     startOn:'comienza en',
//                     heading:'dirigiéndose hacia',
//                     toContinueOn:'continuar',
//                     onTo:'sobre',
//                 }
//             }
//         },
//       }
//     }, function(err, t) {
//       // for options see
//       // https://github.com/i18next/jquery-i18next#initialize-the-plugin
//       jqueryI18next.init(i18next, $);
      
//       $(".localize").localize();
//     });
//   });