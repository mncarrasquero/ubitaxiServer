/**
 * PassengerController
 *
 * @description :: Server-side logic for managing passengers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res, next) {
		var email = req.param('email');
		Passenger.findOne({
			email: email
		}).exec(function(err, usr) {
			if (err) {
				res.send(500, {
					error: "DB Error"
				});
			} else if (usr) {
				res.json({
					status: false,
					code: "11001",
					response: "Email duplicado",

				});
			} else {


				Passenger.create(req.params.all(), function passengerCreated(error, passenger) {
					if (error) {
						res.json({
							status: false,
							code: "11001",
							response: "Error al crear el usuario, validacion de datos",

						});
						console.log("User NO created:", error);
					} else {
						//req.session.user = user;
						//res.send(user);
						res.json({
							status: true,
							code: "",
							response: "Pasajero creado satisfactoriamente.",
							data: passenger
						});
						console.log("User created:", passenger);
					}
				});
			}
		});
	},

	login: function(req, res, next) {
		Passenger.findOne({
			email: req.param('email')
		}).exec(function(err, user) {
			if (err) res.json({
				error: 'DB error'
			}, 500);
			if (user) {
				if (req.param('password') != user.password) {
					// invalid password
					if (req.session.user) req.session.user = null;
					res.json({
						status: false,
						error: 'Invalid user or password'
					});
				} else {
					//procedo a actualizar el lastLogin
					Passenger.update({
						id: user.id
					}, {
						lastLogin: new Date()
					}).exec(function afterwards(err, updated) {
						if (err) {
							// handle error here- e.g. `res.serverError(err);`
							return;
						}
						// password match				
						user.lastLogin = updated[0].lastLogin;
						req.session.user = user.id;
						res.json({
							status: true,
							data: user
						});
						//console.log('Updated user to have name ' + updated[0].lastLogin);
					});
				};
			} else {
				res.json({
					status: false,
					error: 'Invalid user or password'
				});
			}
		});
	},

	calcularPrecio: function(req, res, next) {

		var kilometro = parseFloat("11.6");
		var minuto = parseFloat("3.4");
		var base = parseFloat("34");
		var tiempo1 = req.param('min') * minuto;
		var km = kilometro + parseFloat(req.param('km'));
		var p1 = Math.round(base + parseFloat(tiempo1) + parseFloat(km));
		var p2 = Math.round(base + parseFloat(tiempo1 * 1.5) + parseFloat(km));

		p1 = Math.round(p1 / 10) * 10;
		p2 = Math.round(p2 / 10) * 10;

		res.json({
			status: true,
			code: "",
			response: "",
			data: {
				precio1: p1,
				precio2: p2
			}
		});
		console.log("Calculando tarifa:");

	},


	chequeoPasajero: function(req, res) {

		/*
		 * en chequeo cuenta. se verifica el estatus del pasajero. y se cumple si hay conexion a internet
		 * la respuesta es true con la data del pasajero. menos la clave. se busca con la informacion del id
		 */

		Passenger.findOne({
			id: req.param('id')
		}).exec(function(err, user) {
			if (err) res.json({
				error: 'DB error'
			}, 500);
			if (user) {
				// si existe el usuario procedo a validar el estatus en el sistema
				//si es bien devuelvo la data 
				if (user.isActive == true) {

					//procedo a buscar si tiene algun evento creado... ene stado de activo...
					Event.findOne({
						passengerId: req.param('id'),
						isActive: true
					}).exec(function(err, evento) {
						if (err) res.json({
							error: 'DB error'
						}, 500);
						if (evento) {

							if (evento.status == 1) {
								//buscando taxi

								res.json({
								status: true,
								Appversion: "1.1",
								error: '',
								mensaje: "Bienvenido",
								data: user,
								code: "e01",
								evento: evento
							});
							};
							if (evento.status == 8) {
								//buscando taxi

								res.json({
								status: true,
								Appversion: "1.1",
								error: '',
								mensaje: "Bienvenido",
								data: user,
								code: "e08",
								evento: evento
							});
							};

							if (evento.status == 9) {
								//buscando taxi

								res.json({
								status: true,
								Appversion: "1.1",
								error: '',
								mensaje: "Bienvenido",
								data: user,
								code: "e09",
								evento: evento
							});
							};
						



						} else {
							//no tiene eventos creados

							res.json({
								status: true,
								Appversion: "1.1",
								error: '',
								mensaje: "Bienvenido",
								code: "e00",
								data: user
							});


						}
					});



				} else {
					//si esta desabilitado respondo con el mensaje de error y procedo  a hacer logout en la app
					res.json({
						status: false,
						Appversion: "1.1",
						error: 'X01',
						mensaje: "Usuario Bloqueado contacta con soporte hola@ubitaxi.net",
						data: ""
					});

				};
			} else {
				//si el id no corresponde responde error y procedo a hacer logout en la app
				res.json({
					status: false,
					Appversion: "1.1",
					error: 'X02',
					mensaje: "Cuenta no existe",
					data: ""
				});
			}
		});


	},



	chat: function(req, res) {

	}

};
[]