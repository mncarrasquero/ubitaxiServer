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
				eventAccGps: req.param('PassengerAccGps'),
				coordinates: [parseFloat(req.param('PassengerLngGps')), parseFloat(req.param('PassengerLatGps'))]
			},
			eventDestinoName: req.param('EventDestinoName'),
			eventDestinoCoordinate: [parseFloat(req.param('EventDestinoLng')), parseFloat(req.param('EventDestinoLat'))],
			eventPrice: [req.param('EventPrecioBajo'), req.param('EventPrecioAlto')],
			passengerId: req.param('passengerId'),
			passengerName: req.param('passengerName'),
			passengerLastname: req.param('passengerLastname'),
			passengerPhonenumber: req.param('passengerPhonenumber'),
			passengerKarma: req.param('passengerKarma'),
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
			id: req.param('id'),
			passengerId: req.param('passengerId'),
		}).exec(function findOneCB(err, found) {
			if (err) {} else {
				if (found) {
					if (found.status == 1) {
						Event.update({
							id: req.param('id')
						}, {
							status: 3,
							isActive: false
						}).exec(function afterwards(err, updated) {
							if (err) {
								// handle error here- e.g. `res.serverError(err);`
								return;
							}
							console.log('Updated user to have name ' + updated[0].id);
						});
						res.json({
							status: true,
							code: "909",
							response: JSON.stringify(found),

						});
					} else {
						//aqui es si el evento tiene otro estatus diferente a 1 q es buscando taxi
						if (found.status == 5) {
							res.json({
								status: true,
								code: "1006",
								response: "evento ya cancelado por el parka",
							});
							return;
						};
						if (found.status == 3) {
							res.json({
								status: true,
								code: "1006",
								response: "evento ya cancelado por ti ",
							});
							return;
						};

						res.json({
							status: false,
							code: "1005",
							response: "esperar que pregunte el askMyevent",

						});

					};
				} else {
					res.json({
						status: false,
						code: "1004",
						response: "este evento no existe",

					});
				};

			};

		});

		// We found Jessie
		// Don't forget to handle your error

	},

	eventQuest: function(req, res) {
		//evaluar si el evento esta disponible
		Event.findOne({
			id: req.param('id')
		}).exec(function(err, evento) {
			if (err) res.json({
				error: 'DB error'
			}, 500);
			if (evento) {
				//evaluar el estatus del evento
				if (evento.status = 1) {
					//evento esta disponible
					//buscar datos del taxista solicitante
					Driver.findOne({
						id: req.param('driverId')
					}).exec(function(err, driver) {
						if (err) res.json({
							error: 'DB error'
						}, 500);
						if (driver) {
							//procedemos a actualizar el registro de evento agregando los datos del conductor.
							/*
					eventLocation: {
												type: "Point",
												coordinates: [parseFloat(driver.lastPosition.coordinates[0]), parseFloat(driver.lastPosition.coordinates[1])]
											},*/


							Event.update({
								id: req.param('id')
							}, {
								status: 8,
								isActive: true
							}).exec(function afterwards(err, updated) {

								if (err) {
									// handle error here- e.g. `res.serverError(err);`
									return;
								}

								res.json({
									status: true,
									mensaje: driver
								});
								//console.log('Updated user to have name ' + updated[0].name);
							});



						} else {
							res.json({
								status: false,
								mensaje: "Upps ocurrio un error"
							});
						};
					});

				} else {
					//evento no esta disponible
					res.json({
						status: false,
						error: "x206",
						mensaje: "Evento no disponible"
					});
				};



			} else {
				//evento no existe
				res.json({
					status: false,
					error: "x205",
					mensaje: "Evento no existe"
				});
			}
		});

	},



	eventSearch: function(req, res) {

		var lat = parseFloat(req.param('lat'));
		var lng = parseFloat(req.param('lng'));
		var idDriver = parseFloat(req.param('id'));
		var maxDistance = parseInt(req.param('maxDistance')) || 2;
		var limit = parseInt(req.param('limit')) || 50;
		//  console.log('   lat         ', lat, typeof lat);
		//  console.log('   lng         ', lng);
		//  console.log('   maxDistance ', maxDistance, typeof maxDistance);
		//  console.log('   limit       ', limit);

		//Validar que driver este activo 

		Driver.findOne({
			id: req.param('id')
		}).exec(function(err, user) {
			if (err) res.json({
				error: 'DB error'
			}, 500);
			if (user) {
				// si existe el usuario procedo a validar el estatus en el sistema
				//si es bien devuelvo la data 
				if (user.isActive == true) {
					//el usuariu esta actuvo y validado
					Event.native(function(err, collection) {

						collection.geoNear(lng, lat, {
							maxDistance: 5 / 6378,
							limit: limit,
							// in meters
							query: {
								//'lastPosition.status': 'disponible'
							},
							name: true, // allows filtering
							distanceMultiplier: 6378, // converts radians to miles (use 6371 for km)
							spherical: true
						}, function(mongoErr, docs) {
							if (mongoErr) {
								console.error(mongoErr);
								res.json({
									status: false,
								});
							} else {
								//console.log('docs=', docs);
								// res.send('proximity successful, got '+docs.results.length+' results.');
								// res.json(docs.results);
								if (docs.results.length == 0) {
									res.json({

										status: true,
										qty: docs.results.length,
										//response: docs.results
									});
								} else {
									res.json({
										status: true,
										qty: docs.results.length,
										response: docs.results
									});


								};
							}
						});
					});



				} else {
					//si esta desabilitado respondo con el mensaje de error y procedo  a hacer logout en la app
					res.json({
						status: false,
						Appversion: "1.1",
						error: 'X007',
						mensaje: "Usuario Bloqueado contacta con soporte hola@ubitaxi.net",
						data: ""
					});

				};
			} else {
				//si el id no corresponde responde error y procedo a hacer logout en la app
				res.json({
					status: false,
					Appversion: "1.1",
					error: 'X03',
					mensaje: "Upppps... al parecer estamos presentando un problema tecnico pronto lo repararemos gracias.",
					data: ""
				});
			}
		});



	},

};