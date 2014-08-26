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

	detailNewDriver: function(req, res) {
		Driver.findOne({
			id: req.param('id')
		}, function(err, driver) {
			// Send internal db errors back up (passes through back to our main app)
			if (err) {

			}
			if (!driver) {

				res.notFound();
			

			} else {
				//consulta generada con exito
				res.view({
					layout: 'admin/layoutAdmin.ejs',
					user: req.session.passport.me,
					driver: driver

				});
			};



		});



	},



};