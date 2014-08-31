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

	
		
};