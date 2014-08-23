module.exports.routes = {



	'/': {
		view: 'homepage'
	},

	'/dashboard': 'AdminController.dashboard',

	'get /login': {
		view: 'user/login'
	},
	'get /signup': {
		view: 'user/signup'
	},
	'/welcome': {
		view: 'user/welcome'
	},
	'post /login': 'UserController.login',
	'post /signup': 'UserController.signup',
	'/logout': 'UserController.logout',
};