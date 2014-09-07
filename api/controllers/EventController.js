/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create: function(req, res, next) {
		//req.params.all()
		Event.create({

			eventCalle: req.param('EventCalle'),
			eventSector: req.param('EventSector'),
			eventCity: req.param('EventCity'),
			eventExtra: req.param('EventExtra'),
			eventPriori: req.param('eventPriori'),
			eventLocation: {
				type: "Point",
				coordinates: [parseFloat(req.param('EventLng')), parseFloat(req.param('EventLat'))]
			},
			gpsPassengerLocation: {
				type: "Point",
				eventAccGps: req.param('EventAccGps'),
				coordinates: [parseFloat(req.param('EventLngGps')), parseFloat(req.param('EventLatGps'))]
			},
			eventDestinoName: req.param('EventDestinoName'),
			eventDestinoCoordinate: [parseFloat(req.param('EventDestinoLng')), parseFloat(req.param('EventDestinoLat'))],
			eventPrice: [req.param('EventPrecioBajo'), req.param('EventPrecioAlto')],
			passengerId: req.param('passengerId'),
			passengerName: req.param('passengerName'),
			passengerLastname: req.param('passengerLastname'),
			passengerPhonenumber: req.param('passengerPhonenumber'),
		}, function passengerCreated(error, evento) {
			if (error) {
				res.json({
					status: false,
					code: "11001",
					response: "Error al crear Evento",

				});
				console.log("User NO created:", error);
			} else {
				//req.session.user = user;
				//res.send(user);
				res.json({
					status: true,
					code: "",
					response: "Evento creado.",
					data: evento
				});
				console.log("User created:", evento);
			}
		});

	},

	myEvent: function(req, res, next) {

		/*
		 * status del evento
		 * 1 busqueda de taxis  -- 909
		 * 2 cancelado pasajero -- 910
		 * 3 cancelada busqueda por pasajero -- 911
		 * 4 cancelado por taxista  -- 912
		 * 5 cancelado por parka  -- 913
		 * 6 cancelado por sistema  -- 914
		 * 7 completado
		 * 8 aceptado por un taxista
		 */



		Event.findOne()
			.where({
				id: req.param('id')
			})
			.exec(function(err, evento) {

		
				if (evento == null) {
					res.json({
						status: false,
						code: "404",
						response: "Evento no existe",

					});

				} else {


					switch (evento.status) {

						case 1:
							res.json({
								status: true,
								code: "909",
								response: "Estamos buscando un taxi",

							});
							break;
						case 2:
							res.json({
								status: true,
								code: "910",
								response: "Evento cancelado por el pasajero",

							});
							break;
						case 3:
							res.json({
								status: true,
								code: "911",
								response: "La busqueda fue cancelada por el pasajero",

							});
							break;
						case 4:
							res.json({
								status: true,
								code: "912",
								response: "Este evento fue cancelado por el taxista",

							});
							break;
						case 5:
							res.json({
								status: true,
								code: "913",
								response: "Excedido el tiempo de busqueda",

							});
							break;
						case 6:
							res.json({
								status: true,
								code: "914",
								response: "Cancelado por el sistema",

							});
							break;
						case 7:
							res.json({
								status: true,
								code: "915",
								response: "Evento completado",

							});
							break;
						case 8:
							res.json({
								status: true,
								code: "916",
								response: "Eceptado por un taxista falta cargar data del taxista :D",

							});
							break;
					}



				};

			});


	},


	cancelSearch: function(req, res, next) {

		Event.findOne({
			id: req.param('id')
		}).exec(function findOneCB(err, found) {
			console.log('We found ' + found);
		});

		// We found Jessie
		// Don't forget to handle your error

	}

};