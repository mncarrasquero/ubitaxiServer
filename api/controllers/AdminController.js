/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	dashboard: function(req, res) {
		
		res.view({
			layout: 'admin/layoutAdmin.ejs',
			 user: req.session.passport.me
		});

	},
	createDriver: function(req, res) {
		
		res.view({
			layout: 'admin/layoutAdmin.ejs',
			 user: req.session.passport.me
		});

	},



};