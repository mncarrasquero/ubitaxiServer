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

	'post /createDriver': 'DriverController.create',
	'get /signup': 'UserController.signup',



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
	//hay conductres api para passenger
	'post /api/hayCondunctores': 'DriverController.hayCondunctores',
	//chequeo de estatus de pasaro inicial 
	'post /api/chequeoPasajero': 'PassengerController.chequeoPasajero',
		//calificacion pasajero
	'post /api/calificacionPasajero': 'EventController.calificacionPasajero',
	'post /api/taxiNollegoPasajero': 'EventController.taxiNollegoPasajero',


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