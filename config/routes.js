module.exports.routes = {



    '/': {
        view: 'homepage'
    },

    '/dashboard': 'AdminController.dashboard',

    '/file/upload': 'FileController.upload',
    '/file/index': 'FileController.index',

    'get /createDriver': 'AdminController.createDriver',
    'get /detailNewDriver': 'AdminController.detailNewDriver',
    'get /listDriver': 'AdminController.listDriver',
    'get /prospectos': 'AdminController.prospectos',
    'get /listPassenger': 'AdminController.listPassenger',

    'post /addciudad': 'AdminController.addciudad',


'post /updatePassengerData': 'AdminController.updatePassengerData',

'post /api/historialDriver': 'DriverController.historialDriver',



    
    'get /nuevaciudad': 'AdminController.nuevaciudad',
    'get /listciudades': 'AdminController.listciudades',

    'get /viewpassenger': 'AdminController.viewpassenger',
    'get /viewdriver': 'AdminController.viewdriver',


    'get /api/test1': 'AdminController.test1',

    'get /mapa': 'AdminController.mapa',


    'post /api/generateRank': 'AdminController.generateRank',

    'post /api/findMyRank': 'AdminController.findMyRank',
    'post /api/stateRank': 'AdminController.stateRank',


    




    'post /createDriver': 'DriverController.create',
    'get /signup': 'UserController.signup',

    'get /recoverypass': 'UserController.recoverypass',
    'post /changepass': 'UserController.changepass',


    'get /login': {
        view: 'user/login'
    },
    '/welcome': {
        view: 'user/welcome'
    },
    'post /login': 'UserController.login',
    'post /signup': 'UserController.signup',
    '/logout': 'UserController.logout',

    //api en json resonse
    '/api/listDrivers': 'DriverController.listDrivers',
    'post /api/loginDriver': 'DriverController.loginDriver',
    'post /api/passengerCreate': 'PassengerController.create',
    'post /api/passengerLogin': 'PassengerController.login',
    'post /api/calcularPrecio': 'PassengerController.calcularPrecio',

    '/api/listpassengers': 'PassengerController.listpassengers',
    
    '/api/listprospectos': 'DriverController.listprospectos',


    'post /api/comentariosApp': 'PassengerController.comentariosApp',


    'post /api/ultimosServicios': 'PassengerController.ultimosServicios',

    'post /api/reclamoAbusoApp': 'PassengerController.reclamoAbusoApp',


    'post /api/detalleEvento': 'PassengerController.detalleEvento',

    'post /api/chequeoDriver': 'DriverController.chequeoDriver',

    'post /api/eventosAsk': 'AdminController.eventosAsk',

    'post /api/pasajeroEventos': 'AdminController.pasajeroEventos',

    
    








    //olvido de contraseña pasajero 

    'post /api/olvidoPass': 'PassengerController.olvidoPass',
    //hay conductres api para passenger
    'post /api/hayCondunctores': 'DriverController.hayCondunctores',
    //chequeo de estatus de pasaro inicial 
    'post /api/chequeoPasajero': 'PassengerController.chequeoPasajero',

    //chequeo de estatus de pasaro inicial 
    'post /api/ciudadNoDisponible': 'PassengerController.ciudadNoDisponible',
    'post /api/newProspecto': 'DriverController.newProspecto',


    //calificacion pasajero
    'post /api/calificacionPasajero': 'EventController.calificacionPasajero',
    'post /api/taxiNollegoPasajero': 'EventController.taxiNollegoPasajero',


    'post /api/testEmail': 'EventController.testEmail',


    'post /api/addPoint': 'EventController.addPoint',




    
    //evento crear cancelar preguntar
    '/createEvent': {
        controller: 'event',
        action: 'create'
    },
    'post /api/eventQuest': {
        controller: 'event',
        action: 'eventQuest'
    },

    'post /api/cancelEventDriver': {
        controller: 'event',
        action: 'cancelEventDriver'
    },


    'post /api/passengerCancel': {
        controller: 'event',
        action: 'passengerCancel'
    },

    'post /api/yaLlego': {
        controller: 'event',
        action: 'yaLlego'
    },

    'post /api/completeEventDriver': {
        controller: 'event',
        action: 'completeEventDriver'
    },

    'post /api/cancelSearch': {
        controller: 'event',
        action: 'cancelSearch'
    },


    'post /api/eventSearch': {
        controller: 'event',
        action: 'eventSearch'
    },
    '/myEvent': {
        controller: 'event',
        action: 'myEvent'
    },

    'post /api/myEventDriver': {
        controller: 'event',
        action: 'myEventDriver'
    },




};