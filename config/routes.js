module.exports.routes = {



	'/': {
		view: 'homepage'
	},

	'/dashboard': 'AdminController.dashboard',

	'/file/upload': 'FileController.upload',
	'/file/index': 'FileController.index',

	'get /createDriver': 'AdminController.createDriver',
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
};