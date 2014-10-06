/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
mandrill = require('mandrill-api/mandrill');
mandrill_client = new mandrill.Mandrill('SkxqA6fV9H56kGZjEvVBkQ');


moment = require('moment');



	setInterval(function() {

	
var objFecha = new Date();
var milisegundos = objFecha.getTime();
// Restar 5 minutos . 
objFecha.setTime( milisegundos - (5 * 60000) );

		//date.toISOString(); //"2011-12-19T15:28:46.493Z"
		

		Event.native(function(err, collection) {
			collection.update({
					isActive: true,
					status: 1,
					createdAt : {"$lte": new Date(objFecha.toISOString())}

				}, {
					'$set': {
						isActive: false,
						status: 5
					}
				},

				{
					multi: true,
					safe: true
				},
				function(err) {
					if (err) {
						console.log(err);
					} else {
						//console.log("Revisando eventos expirados  " +objFecha.toISOString());

					}
				}
			);
		});


	}, 30000);
	cb();
};