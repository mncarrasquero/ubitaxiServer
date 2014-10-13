/**
 * PassengerController
 *
 * @description :: Server-side logic for managing passengers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var ciudadesServicio = ["Maracaibo", "Cabimas"]

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



	ciudadNoDisponible: function(req, res, next) {


		Ciudadnodisponible.create(req.params.all(), function passengerCreated(error, ciudad) {
			if (error) {
				res.json({
					status: false,
					response: "Error al crear la ciudad",

				});

			} else {

				res.json({
					status: true,
					code: "",
					response: "ciudad creado satisfactoriamente.",
					data: ciudad
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
		//console.log("Calculando tarifa:");

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
									evento: evento,
									ciudades: ciudadesServicio
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
									evento: evento,
									ciudades: ciudadesServicio
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
									evento: evento,
									ciudades: ciudadesServicio
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
								data: user,
								ciudades: ciudadesServicio
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



	olvidoPass: function(req, res) {

		function sendEmailOlvidoPass(email, token) {
			var url = "http://166.78.185.24:1337/recoverypass?email=" + email + "&token=" + token;
			console.log("test de enviar email  \n" + url);

			//send an e-mail to jim rubenstein
			var template_name = "olvidoPass";
			var template_content = [{
				"name": "PASAJERO",
				"content": "example content"
			}];
			var message = {
				"html": "<p>Example HTML content</p>",
				"text": "Example text content",
				"subject": "Ubitaxi asistencia para contraseña",
				"from_email": "no-reply@ubitaxi.net",
				"from_name": "Ubitaxi Venezuela",
				"to": [{
					"email": email,
					//"name": pasajero.name +" "+ pasajero.lastName,
					"type": "to"
				}],
				"headers": {
					"Reply-To": "no-reply@ubitaxi.net"
				},
				"important": true,
				"track_opens": true,
				"track_clicks": null,
				"auto_text": null,
				"auto_html": null,
				"inline_css": true,
				"url_strip_qs": true,
				"preserve_recipients": null,
				"view_content_link": null,
				//"bcc_address": "message.bcc_address@example.com",
				"tracking_domain": null,
				"signing_domain": null,
				"return_path_domain": null,
				"merge": true,
				"global_merge_vars": [{
					"name": "url",
					"content": url
				}],
			};
			var async = false;

			mandrill_client.messages.sendTemplate({
				"template_name": template_name,
				"template_content": template_content,
				"message": message,
				"async": async,

			}, function(result) {
				console.log(result);

			}, function(e) {
				// Mandrill returns the error as an object with name and message keys
				console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
				// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
			});



		}

		//en esta accion puede ocurrir  dos cosas
		//el cliente solicita olvido de contraseña valido q existe el usuario 
		//si existe valido q no tenga una solicitud abierta si no envio el correo 


		Passenger.findOne({
			email: req.param('email')
		}).exec(function(err, user) {
			if (err) res.json({
				error: 'DB error'
			}, 500);
			if (user) {
				// si existe el usuario procedo a validar el estatus en el sistema
				//si es bien devuelvo la data 
				if (user.isActive == true) {

					//valido que no tenga un recuperar activo
					if (typeof user.passReset !== 'undefined' && user.passReset !== null) {

						//si existe valido q este activo
						console.log("esta activo siguiente paso");
						//si esta activo y la fecha es menor a 48 horas  no hago nada respondo q ya el correo esta enviado
						var horas = moment().diff(user.passReset.created, 'hours');
						if (user.passReset.isActive == true && horas < 24) {
							console.log("el correo fue enviado ");
							res.json({
								status: true,
								error: 'E01',
								mensaje: "Revisa tu bandeja de entrada o la carpeta de spam",
							});

						}

						if (horas > 24 || user.passReset.isActive == false) {

							res.json({
								status: true,
								error: 'E02',
								mensaje: "Te hemos enviado un email para recuperar tu contraseña",
							});
							var token = uuid.v4();
							Passenger.update({
								id: user.id
							}, {
								passReset: {
									created: new Date(),
									token: token,
									isActive: true
								}
							}).exec(function afterwards(err, updated) {
								if (err) {
									return;
								}
								sendEmailOlvidoPass(user.email, token);
							});

						}

					} else {
						console.log("nuevo codigo de registro");
						//si no creo uno nuevo
						var token = uuid.v4();
						Passenger.update({
							id: user.id
						}, {
							passReset: {
								created: new Date(),
								token: token,
								isActive: true
							}

						}).exec(function afterwards(err, updated) {
							if (err) {
								// handle error here- e.g. `res.serverError(err);`
								return;
							}
							res.json({
								status: true,
								error: 'E02',
								mensaje: "Te hemos enviado un email para recuperar tu contraseña",
							});

							sendEmailOlvidoPass(user.email, token);

							//console.log('Updated user to have name ' + JSON.str updated[0].passReset);
						});



					};



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

	comentariosApp: function(req, res) {

		function sendEmail(email, id, name, lastname, phonenomber, comentario) {
			//send an e-mail to jim rubenstein
			var template_name = "contacto";
			var template_content = [{
				"name": "PASAJERO",
				"content": "example content"
			}];

			var message = {
				//"html": "<p>Example HTML content</p>",
				//"text": "Example text content",
				"subject": "Contacto via App",
				"from_email": email,
				"from_name": name,
				"to": [{
					"email": "support@ubitaxi1.zendesk.com",
					//"name": pasajero.name +" "+ pasajero.lastName,
					"type": "to"
				}],
				"headers": {
					//"Reply-To": "no-reply@ubitaxi.net"
				},
				"important": true,
				"track_opens": true,
				"track_clicks": null,
				"auto_text": null,
				"auto_html": null,
				"inline_css": true,
				"url_strip_qs": true,
				"preserve_recipients": null,
				"view_content_link": null,
				//"bcc_address": "message.bcc_address@example.com",
				"tracking_domain": null,
				"signing_domain": null,
				"return_path_domain": null,
				"merge": true,
				"global_merge_vars": [{
						"name": "userid",
						"content": id
					}, {
						"name": "nombre",
						"content": name
					}, {
						"name": "apellido",
						"content": lastname
					},

					{
						"name": "telefono",
						"content": phonenomber
					}, {
						"name": "email",
						"content": email
					}, {
						"name": "comentario",
						"content": comentario
					}

				],
			};
			var async = false;

			mandrill_client.messages.sendTemplate({
				"template_name": template_name,
				"template_content": template_content,
				"message": message,
				"async": async,

			}, function(result) {
				console.log(result);

			}, function(e) {
				// Mandrill returns the error as an object with name and message keys
				console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
				// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
			});



		}

		//en esta accion puede ocurrir  dos cosas
		//el cliente solicita olvido de contraseña valido q existe el usuario 
		//si existe valido q no tenga una solicitud abierta si no envio el correo 


		Passenger.findOne({
			email: req.param('email')
		}).exec(function(err, user) {
			if (err) res.json({
				error: 'DB error'
			}, 500);
			if (user) {
				// si existe el usuario procedo a validar el estatus en el sistema
				//si es bien devuelvo la data 

				sendEmail(user.email, user.id, user.name, user.lastName, user.phoneNumber, req.param('comentario'));

				res.json({
					status: true,
					error: '',
					mensaje: "Mensaje enviado",
				});



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

	ultimosServicios: function(req, res) {

		//var maxDistance = parseInt(req.param('maxDistance')) || 2;
    	var limit = parseInt(req.param('limit')) || 5;
    	var data = {};
		Event.find({
			passengerId: req.param('passengerId')
		}).limit(limit).exec(function(err, eventos) {



			if (err) res.json({
				error: 'DB error'
			}, 500);
			if (eventos) {
				for (var i = eventos.length - 1; i >= 0; i--) {
					delete eventos[i]["gpsDriverLocation"];
					if (eventos[i].status == 4 || eventos[i].status == 7 || eventos[i].status == 8 || eventos[i].status == 9 ) {

						data.push(eventos[i]);

					};
				};
				res.json({
					status: true,
					data: data
				});


			} else {
				//si el id no corresponde responde error y procedo a hacer logout en la app
				res.json({
					status: false,
					data: ""
				});
			}
		});



	}

};