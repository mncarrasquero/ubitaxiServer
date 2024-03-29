/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    eventCentral: function(req, res, next) {
        //req.params.all()
        Central.create({
            cliente: req.param('cliente'),
            telefono: req.param('telefono'),
            direccion: req.param('direccion'),
            destino: req.param('destino'),
            latDestino: req.param('latDestino'),
            lngDestino: req.param('lngDestino'),
            eventLocation: {
                type: "Point",
                coordinates: [parseFloat(req.param('lngOrigen')), parseFloat(req.param('latOrigen'))]
            },


            operador: req.param('operador'),
            origen: req.param('origen'),
            type: req.param('type'),
            ciudad: "Maracaibo",
            isActive: true,
            status: 1
        }, function passengerCreated(error, evento) {
            if (error) {
                res.json({
                    status: false,
                    code: "11001",
                    response: "Error al crear Evento",

                });

            } else {
                //req.session.user = user;
                //res.send(user);
                //notificar al usuario de q el evento fue creado
                // http://smsgateway.me/api/v3/messages/send?email=mncarrasquero@gmail.com&password=19177230&number=04146208056&message=hola mundo&device=8672
                var requestify = require('requestify');

                requestify.get('http://smsgateway.me/api/v3/messages/send?email=mncarrasquero@gmail.com&password=19177230&number=' + req.param('telefono') + '&message=Hola ' + req.param('cliente') + ', Te estamos buscando un taxi te avisaremos en unos minutos el resultado de la busqueda &device=8672')
                    .then(function(response) {
                        // Get the response body (JSON parsed or jQuery object for XMLs)

                    });







                res.json({
                    status: true,
                    code: "",
                    response: "Evento creado.",
                    data: evento
                });
                // console.log("User created:", evento);
            }
        });

    },








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
            dataPriceEvent: {
                type: req.param('EventPrecioType'),
                extra: req.param('EventPrecioExtra'),

            },



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
                // console.log("User created:", evento);
            }
        });
    },

    myEvent: function(req, res, next) {

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
                                evento: evento

                            });
                            break;
                        case 8:

                            res.json({
                                status: true,
                                code: "916",
                                response: "Eceptado por un taxista ",
                                evento: evento


                            });
                            break;

                        case 9:
                            res.json({
                                status: true,
                                code: "917",
                                response: "el taxista ya llego",
                                evento: evento

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
                if (evento.status == 1) {
                    //evento esta disponible
                    //buscar datos del taxista solicitante
                    Driver.findOne({
                        id: req.param('driverId')
                    }).exec(function(err, driver) {
                        if (err) res.json({
                            error: 'DB error'
                        }, 500);
                        if (driver) {


                            Event.update({
                                id: req.param('id')
                            }, {
                                status: 8,
                                isActive: true,
                                dataDriver: {
                                    driverId: driver.id,
                                    driverName: driver.name,
                                    driverLastname: driver.lastname,
                                    driverPhone: driver.phone,
                                    driverPicture: driver.dir_picture + driver.picture,
                                    carBrand: driver.car.brand,
                                    carModel: driver.car.model,
                                    carYear: driver.car.year,
                                    carColor: driver.car.color,
                                    carPlate: driver.car.plate,
                                    lastPosition: {
                                        lat: req.param('lat'),
                                        lng: req.param('lng')
                                    }
                                },


                            }).exec(function afterwards(err, updated) {

                                if (err) {
                                    res.json({
                                        status: false,
                                        mensaje: "error DB",
                                        response: err
                                    });
                                    return;
                                }

                                res.json({
                                    status: true,
                                    mensaje: "avento asignado",
                                    response: evento
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


    eventQuestV2: function(req, res) {


        //evaluaar q  tipo de evento es movil o central

        if (req.param('type') == "movil") {


            //evaluar si el evento esta disponible


            Event.findOne({
                id: req.param('id')
            }).exec(function(err, evento) {
                if (err) res.json({
                    error: 'DB error'
                }, 500);
                if (evento) {
                    //evaluar el estatus del evento
                    if (evento.status == 1) {
                        //evento esta disponible
                        //buscar datos del taxista solicitante
                        Driver.findOne({
                            id: req.param('driverId')
                        }).exec(function(err, driver) {
                            if (err) res.json({
                                error: 'DB error'
                            }, 500);
                            if (driver) {


                                Event.update({
                                    id: req.param('id')
                                }, {
                                    status: 8,
                                    isActive: true,
                                    dataDriver: {
                                        driverId: driver.id,
                                        driverName: driver.name,
                                        driverLastname: driver.lastname,
                                        driverPhone: driver.phone,
                                        driverPicture: driver.dir_picture + driver.picture,
                                        carBrand: driver.car.brand,
                                        carModel: driver.car.model,
                                        carYear: driver.car.year,
                                        carColor: driver.car.color,
                                        carPlate: driver.car.plate,
                                        lastPosition: {
                                            lat: req.param('lat'),
                                            lng: req.param('lng')
                                        }
                                    },


                                }).exec(function afterwards(err, updated) {

                                    if (err) {
                                        res.json({
                                            status: false,
                                            mensaje: "error DB",
                                            response: err
                                        });
                                        return;
                                    }

                                    res.json({
                                        status: true,
                                        mensaje: "avento asignado",
                                        response: evento
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

        }else{
  Central.findOne({
                id: req.param('id')
            }).exec(function(err, evento) {
                if (err) res.json({
                    error: 'DB error'
                }, 500);
                if (evento) {
                    //evaluar el estatus del evento
                    if (evento.status == 1) {
                        //evento esta disponible
                        //buscar datos del taxista solicitante
                        Driver.findOne({
                            id: req.param('driverId')
                        }).exec(function(err, driver) {
                            if (err) res.json({
                                error: 'DB error'
                            }, 500);
                            if (driver) {


                                Event.update({
                                    id: req.param('id')
                                }, {
                                    status: 8,
                                    isActive: true,
                                    dataDriver: {
                                        driverId: driver.id,
                                        driverName: driver.name,
                                        driverLastname: driver.lastname,
                                        driverPhone: driver.phone,
                                        driverPicture: driver.dir_picture + driver.picture,
                                        carBrand: driver.car.brand,
                                        carModel: driver.car.model,
                                        carYear: driver.car.year,
                                        carColor: driver.car.color,
                                        carPlate: driver.car.plate,
                                        lastPosition: {
                                            lat: req.param('lat'),
                                            lng: req.param('lng')
                                        }
                                    },


                                }).exec(function afterwards(err, updated) {

                                    if (err) {
                                        res.json({
                                            status: false,
                                            mensaje: "error DB",
                                            response: err
                                        });
                                        return;
                                    }

                                    res.json({
                                        status: true,
                                        mensaje: "avento asignado",
                                        response: evento
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




        };

    },

    eventSearchV2: function(req, res) {

        var lat = parseFloat(req.param('lat'));
        var lng = parseFloat(req.param('lng'));
        var trueHeading = parseFloat(req.param('trueHeading')) || 0;
        var idDriver = req.param('id');
        var maxDistance = parseInt(req.param('maxDistance')) || 7;
        var limit = parseInt(req.param('limit')) || 50;

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
                    //actualizo su posicion

                    Driver.update({
                        id: req.param('id')
                    }, {
                        lastPosition: {
                            type: "Point",
                            status: "disponible",
                            trueHeading: trueHeading,
                            date: new Date(),
                            coordinates: [parseFloat(req.param('lng')), parseFloat(req.param('lat'))]
                        },


                    }).exec(function afterwards(err, updated) {
                        if (err) {

                            return;
                        } else {

                        }


                    });

                    //fin de actualizar poscicion
                    Event.native(function(err, collection) {
                        collection.geoNear(lng, lat, {
                            maxDistance: 5 / 6378,
                            limit: limit,
                            query: {
                                'status': 1,
                                'isActive': true,
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
                                var central;
                                Central.native(function(err, collection) {
                                    collection.geoNear(lng, lat, {
                                        maxDistance: 5 / 6378,
                                        limit: limit,
                                        query: {
                                            'status': 1,
                                            'isActive': true,
                                        },
                                        name: true, // allows filtering
                                        distanceMultiplier: 6378, // converts radians to miles (use 6371 for km)
                                        spherical: true
                                    }, function(mongoErr, docs1) {
                                        if (mongoErr) {
                                            console.error(mongoErr);
                                            res.json({
                                                status: false,
                                            });
                                        } else {
                                            if (docs1.results.length == 0) {
                                                central = {
                                                    qty: docs1.results.length
                                                }

                                            } else {

                                                central = {

                                                    qty: docs1.results.length,
                                                    response: docs1.results
                                                };

                                            };
                                        }

                                        if (docs.results.length + central.qty == 0) {
                                            res.json({

                                                status: true,

                                                qty: docs.results.length + central.qty,
                                                central: central,
                                                //response: docs.results
                                            });
                                        } else {
                                            res.json({
                                                status: true,

                                                qty: docs.results.length + central.qty,
                                                response: docs.results,
                                                central: central,
                                            });


                                        };


                                    });
                                });



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



    eventSearch: function(req, res) {

        var lat = parseFloat(req.param('lat'));
        var lng = parseFloat(req.param('lng'));
        var trueHeading = parseFloat(req.param('trueHeading')) || 0;


        var idDriver = req.param('id');
        //var maxDistance = parseInt(req.param('maxDistance')) || 2;
        var maxDistance = parseInt(req.param('maxDistance')) || 7;
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
                    //actualizo su posicion

                    Driver.update({
                        id: req.param('id')
                    }, {
                        lastPosition: {
                            type: "Point",
                            status: "disponible",
                            trueHeading: trueHeading,
                            date: new Date(),
                            coordinates: [parseFloat(req.param('lng')), parseFloat(req.param('lat'))]
                        },


                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        } else {
                            /*
                            io.sockets.emit('central', {
                                action: 'Point',
                                response: {
                                    id: req.param('id'),
                                    lat: parseFloat(req.param('lat')),
                                    lng: parseFloat(req.param('lng')),
                                    name: user.name+" "+ user.lastname,

                                    picture: user.dir_picture+user.picture,
                                    plate: user.car.plate,
                                    date: new Date(moment().zone('-0430').toISOString())
                                }
                            });
                    */
                        }


                    });

                    //fin de actualizar poscicion

                    Event.native(function(err, collection) {

                        collection.geoNear(lng, lat, {
                            maxDistance: 5 / 6378,
                            limit: limit,
                            // in meters
                            query: {
                                'status': 1,
                                'isActive': true,
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



    passengerCancel: function(req, res) {
        var eventId = req.param('eventId');
        var passengerId = req.param('passengerId');
        var razonCancel = req.param('razonCancel');

        Event.findOne({
            id: eventId,

        }).exec(function(err, evento) {
            if (err) res.json({
                error: 'DB error'
            }, 500);
            if (evento) {

                if (evento.status == 8) {


                    //estado 8 aceptado por un taxista.
                    // procedo hacer un update en el evento.

                    //x208 servicio cancelado CON penalizacion DE 5 MINUTOS
                    Event.update({
                        id: eventId
                    }, {
                        status: 2,
                        isActive: false,
                        razonCancel: razonCancel
                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        }
                        //buscar datos del pasajro como emeail
                        Passenger.findOne({
                            id: evento.passengerId,

                        }).exec(function(err, pasajero) {


                            //send an e-mail to jim rubenstein
                            var template_name = "serviciocanceladopasajero";
                            var template_content = [{
                                "name": "PASAJERO",
                                "content": "example content"
                            }];
                            var message = {
                                "html": "<p>Example HTML content</p>",
                                "text": "Example text content",
                                "subject": "¿Ocurrió algo inesperado?",
                                "from_email": "hola@ubitaxi.net",
                                "from_name": "Ubitaxi Venezuela",
                                "to": [{
                                    "email": pasajero.email,
                                    "name": pasajero.name + " " + pasajero.lastName,
                                    "type": "to"
                                }],
                                "headers": {
                                    "Reply-To": "hola@ubitaxi.net"
                                },
                                "important": true,
                                "track_opens": true,
                                "track_clicks": null,
                                "auto_text": null,
                                "auto_html": null,
                                "inline_css": true,
                                "url_strip_qs": null,
                                "preserve_recipients": null,
                                "view_content_link": null,
                                //"bcc_address": "message.bcc_address@example.com",
                                "tracking_domain": null,
                                "signing_domain": null,
                                "return_path_domain": null,
                                "merge": true,
                                "global_merge_vars": [{
                                        "name": "pasajero",
                                        "content": pasajero.name
                                    }, {
                                        "name": "fechaevento",
                                        "content": moment(evento.createdAt).lang('es').zone('-0430').format('LLLL')
                                    }, {
                                        "name": "drivername",
                                        "content": evento.dataDriver.driverName
                                    }, {
                                        "name": "eventoid",
                                        "content": evento.id
                                    }, {
                                        "name": "lugar",
                                        "content": evento.eventCalle
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
                                //console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
                            });



                            //send an e-mail to jim rubenstein
                            /*
                            mandrill('/messages/send', {
                                message: {
                                    to: [{
                                        email: pasajero.email,
                                        name: evento.passengerName + " " + evento.passengerLastname
                                    }],
                                    name: 'cancelServicio',
                                    from_email: 'hola@ubitaxi.net',
                                    from_name: 'Ubitaxi Venezuela',
                                    subject: "¿Ocurrió algun problema?",
                                    text: "   Estimado " + evento.passengerName + ",\nEn Ubitaxi, nos esforzamos por ofrecer a los usuarios la mejor experiencia de taxis que hay.\n\nLe estamos enviando un correo electrónico después de notar que canceló su viaje con el conductor  " + evento.dataDriver.driverName + " Fecha:  " + moment(evento.createdAt).lang('es').zone('-0430').format('LLLL') + ".  identificador del servicio: " + evento.id + " \nNos preguntábamos si algo salió mal de nuestra parte; ¿tuvo algún tipo de problema con la aplicación y / o el conductor?\n\nTambién nos gustaría recordarle que todos los pasajeros que cancelen tres veces en una semana se prohibirá automáticamente nuestro servicio, por el plazo de un mes.\n\nPor favor, responda a este correo electrónico y háganos saber si hay algo que podamos hacer.\n\n\nGracias por su tiempo.\n\nAtt,\nEquipo Ubitaxi."
                                }
                            }, function(error, response) {
                                //uh oh, there was an error
                                if (error) console.log(JSON.stringify(error));
                                //everything's good, lets see what mandrill said
                                else console.log(response);


                                });
*/

                            /// fin de send email por cancel

                        });



                        res.json({
                            status: true,
                            error: "x208",
                            mensaje: "Servicio cancelado"
                        });
                    });



                };
                if (evento.status != 8) {
                    //x209 servicio cancelado sin penalizacion
                    res.json({
                        status: true,
                        error: "x209",
                        mensaje: "Servicio cancelado"
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



    cancelEventDriver: function(req, res) {
        var eventId = req.param('eventId');
        var idDriver = req.param('idDriver');
        var razonCancel = req.param('razonCancel');

        Event.findOne({
            id: eventId,

        }).exec(function(err, evento) {
            if (err) res.json({
                error: 'DB error'
            }, 500);
            if (evento) {

                if (evento.status == 8) {


                    //estado 8 aceptado por un taxista.
                    // procedo hacer un update en el evento.

                    //x208 servicio cancelado CON penalizacion DE 5 MINUTOS
                    Event.update({
                        id: eventId
                    }, {
                        status: 4,
                        isActive: false,
                        razonCancel: razonCancel
                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        }

                        res.json({
                            status: true,
                            error: "x208",
                            mensaje: "Servicio cancelado"
                        });
                    });



                };
                if (evento.status != 8) {
                    //x209 servicio cancelado sin penalizacion
                    Event.update({
                        id: eventId
                    }, {
                        status: 4,
                        isActive: false,
                        razonCancel: razonCancel
                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        }

                        res.json({
                            status: true,
                            error: "x209",
                            mensaje: "Servicio cancelado"
                        });
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

    addPoint: function(req, res) {
        var driverId = req.param('driverId');
        var point = req.param('point');
        Driver.findOne({
            id: driverId,

        }).exec(function(err, driver) {
            data = parseInt(driver.point) + parseInt(point);
            Driver.update({
                id: driverId
            }, {
                point: data,

            }).exec(function afterwards(err, updated) {
                if (err) {
                    // handle error here- e.g. `res.serverError(err);`
                    return;
                }

                res.json({
                    status: true,
                    error: "x208",
                    mensaje: "Puntos Actualizados",
                    total: data
                });
            });


        })



    },

    calificacionPasajero: function(req, res) {
        var eventId = req.param('eventId');
        var comentario = req.param('comentario');
        comentario = comentario.replace(/(\r\n|\n|\r)/gm, " ");
        var experiencia = req.param('experiencia');



        Event.findOne({
            id: eventId,

        }).exec(function(err, evento) {
            if (err) res.json({
                error: 'DB error'
            }, 500);
            if (evento) {

                //evaluar la calificancion para asignar puntos

                if (experiencia == "positivo") {
                    Driver.findOne({
                        id: evento.dataDriver['driverId'],

                    }).exec(function(err, driver) {
                        data = parseInt(driver.point) + 15;
                        Driver.update({
                            id: evento.dataDriver['driverId']
                        }, {
                            point: data,

                        }).exec(function afterwards(err, updated) {



                        });


                    })
                };


                if (experiencia == "negativo") {
                    Driver.findOne({
                        id: evento.dataDriver['driverId'],

                    }).exec(function(err, driver) {
                        data = parseInt(driver.point) - 30;
                        Driver.update({
                            id: evento.dataDriver['driverId']
                        }, {
                            point: data,

                        }).exec(function afterwards(err, updated) {



                        });


                    })
                };









                if (evento.status != 1) {

                    console.log("resiviendo calificacion: ");

                    Event.update({
                        id: eventId
                    }, {
                        status: 7,
                        isActive: false,
                        coment: comentario,
                        exp: experiencia,
                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        }

                        res.json({
                            status: true,
                            error: "x208",
                            mensaje: "comentario Enviado"
                        });
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
    taxiNollegoPasajero: function(req, res) {
        var eventId = req.param('eventId');
        Event.findOne({
            id: eventId,
        }).exec(function(err, evento) {
            if (err) res.json({
                error: 'DB error'
            }, 500);
            if (evento) {
                //evento q este en taxi ya llego
                if (evento.status == 9) {
                    Event.update({
                        id: eventId
                    }, {
                        status: 2,
                        razonCancel: "taxista no llego",
                        isActive: false,
                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        }
                        //211 servicio penalizado si lo vuelve hacer 

                        Driver.findOne({
                            id: evento.dataDriver['driverId'],

                        }).exec(function(err, driver) {
                            data = parseInt(driver.point) - 10;
                            Driver.update({
                                id: evento.dataDriver['driverId']
                            }, {
                                point: data,

                            }).exec(function afterwards(err, updated) {

                                res.json({
                                    status: true,
                                    code: "x211",
                                    mensaje: "Servicio cancelado y penalizado"
                                });

                            });


                        })




                    });



                };
                if (evento.status != 8) {
                    //x209 servicio cancelado sin penalizacion
                    res.json({
                        status: true,
                        error: "x209",
                        mensaje: "Servicio cancelado"
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



    yaLlego: function(req, res) {
        var eventId = req.param('eventId');
        var idDriver = req.param('idDriver');
        Event.findOne({
            id: eventId,

        }).exec(function(err, evento) {
            if (err) res.json({
                error: 'DB error'
            }, 500);
            if (evento) {

                if (evento.status == 8) {


                    //estado 8 aceptado por un taxista.
                    // procedo hacer un update en el evento.

                    //x210 servicio marcado como ya llego a la ubicacion del conductor
                    Event.update({
                        id: eventId
                    }, {
                        status: 9,
                        isActive: true,
                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        }

                        res.json({
                            status: true,
                            error: "x210",
                            mensaje: "Servicio cancelado"
                        });
                    });



                };
                if (evento.status != 8) {
                    //x209 servicio cancelado sin penalizacion
                    res.json({
                        status: true,
                        error: "x209",
                        mensaje: "Servicio cancelado"
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
    completeEventDriver: function(req, res) {
        var eventId = req.param('eventId');
        var idDriver = req.param('idDriver');
        var taximetroTotal = req.param('taximetroTotal');
        var taximetroMin = req.param('taximetroMin');
        var taximetroKm = req.param('taximetroKm');
        var cobrado = req.param('cobrado');
        Event.findOne({
            id: eventId,

        }).exec(function(err, evento) {
            if (err) res.json({
                error: 'DB error'
            }, 500);
            if (evento) {

                if (evento.status == 8 || evento.status == 9) {


                    //estado 8 aceptado por un taxista.
                    // procedo hacer un update en el evento.

                    //x210 servicio marcado como ya llego a la ubicacion del conductor
                    Event.update({
                        id: eventId
                    }, {
                        status: 7,
                        cobrado: cobrado,
                        isActive: false,
                        dataTaximetro: {
                            taximetroTotal: taximetroTotal,
                            taximetroMin: taximetroMin,
                            taximetroKm: taximetroKm,
                        }

                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        };

                        Passenger.findOne({
                            id: evento.passengerId,

                        }).exec(function(err, pasajero) {
                            //enviar recibo
                            //send an e-mail to jim rubenstein
                            var template_name = "recibo";
                            var template_content = [{
                                "name": "PASAJERO",
                                "content": "example content"
                            }];
                            var message = {
                                "html": "<p>Example HTML content</p>",
                                "text": "Example text content",
                                "subject": "Recibo de servicio Ubitaxi por " + cobrado + " Bs.",
                                "from_email": "noreply@ubitaxi.net",
                                "from_name": "Ubitaxi Venezuela",
                                "to": [{
                                    "email": pasajero.email,
                                    "name": evento.passengerName + " " + evento.passengerLastname,
                                    "type": "to"
                                }],
                                "headers": {
                                    "Reply-To": "support@ubitaxi1.zendesk.com"
                                },
                                "important": true,
                                "track_opens": true,
                                "track_clicks": null,
                                "auto_text": null,
                                "auto_html": null,
                                "inline_css": true,
                                "url_strip_qs": null,
                                "preserve_recipients": null,
                                "view_content_link": null,
                                //"bcc_address": "message.bcc_address@example.com",
                                "tracking_domain": null,
                                "signing_domain": null,
                                "return_path_domain": null,
                                "merge": true,
                                "global_merge_vars": [{
                                        "name": "pasajero",
                                        "content": pasajero.name
                                    }, {
                                        "name": "fecha",
                                        "content": moment(evento.createdAt).lang('es').zone('-0430').format('lll')
                                    }, {
                                        "name": "conductor",
                                        "content": evento.dataDriver.driverName + " " + evento.dataDriver.driverLastname
                                    }, {
                                        "name": "carro",
                                        "content": evento.dataDriver.carBrand + " - " + evento.dataDriver.carModel + " - " + evento.dataDriver.carColor
                                    }, {
                                        "name": "id",
                                        "content": evento.id
                                    }, {
                                        "name": "descripcion",
                                        "content": evento.eventCalle + " - " + evento.eventExtra
                                    }, {
                                        "name": "monto",
                                        "content": cobrado
                                    }



                                ],


                            }

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
                                //console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
                            });



                        });





                        ///fin de enviar recibo


                        res.json({
                            status: true,
                            error: "",
                            mensaje: "Servicio completado"
                        });
                    });



                };
                if (evento.status != 8) {
                    //x209 servicio cancelado sin penalizacion
                    res.json({
                        status: true,
                        error: "x209",
                        mensaje: "Servicio cancelado"
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

    myEventDriver: function(req, res, next) {
        var eventId = req.param('eventId');
        var idDriver = req.param('idDriver');
        var lat = req.param('lat');
        var lng = req.param('lng');
        var trueHeading = parseFloat(req.param('trueHeading')) || 0;


        Event.findOne()
            .where({
                id: eventId
            })
            .exec(function(err, evento) {
                if (evento == null) {
                    res.json({
                        status: false,
                        code: "404",
                        response: "Evento no existe",
                    });
                } else {

                    if (evento.status == 2) {

                        res.json({
                            status: false,
                            code: "x915",
                            response: "Evento cancelado por el pasajero",

                        });

                    } else {

                        var flag = evento.status;

                        if (evento.gpsDriverLocation) {

                            var data = evento.gpsDriverLocation;
                            var newData = {
                                date: new Date(),
                                lat: parseFloat(lat),
                                lng: parseFloat(lng),
                                trueHeading: trueHeading,
                                flag: flag
                            };
                            data.push(newData);

                        } else {
                            var data = [{
                                date: new Date(),
                                lat: parseFloat(lat),
                                lng: parseFloat(lng),
                                trueHeading: trueHeading,
                                flag: flag
                            }];

                        };



                        Event.update({
                            id: eventId
                        }, {
                            gpsDriverLocation: data
                        }).exec(function afterwards(err, updated) {
                            if (err) {
                                // handle error here- e.g. `res.serverError(err);`
                                return;
                            }
                            res.json({
                                status: true,
                                code: "",
                                response: {
                                    status: evento.status
                                },

                            });
                        });



                    };

                };

            });


    },



    testEmail: function() {


        //send an e-mail to jim rubenstein
        var template_name = "serviciocanceladopasajero";
        var template_content = [{
            "name": "PASAJERO",
            "content": "example content"
        }];
        var message = {
            "html": "<p>Example HTML content</p>",
            "text": "Example text content",
            "subject": "¿Ocurrió algo inesperado?",
            "from_email": "hola@ubitaxi.net",
            "from_name": "Ubitaxi Venezuela",
            "to": [{
                "email": "mncarrasquero@gmail.com",
                "name": "mario Carrasquero",
                "type": "to"
            }],
            "headers": {
                "Reply-To": "message.reply@example.com"
            },
            "important": true,
            "track_opens": null,
            "track_clicks": null,
            "auto_text": null,
            "auto_html": null,
            "inline_css": true,
            "url_strip_qs": null,
            "preserve_recipients": null,
            "view_content_link": null,
            //"bcc_address": "message.bcc_address@example.com",
            "tracking_domain": null,
            "signing_domain": null,
            "return_path_domain": null,
            "merge": true,
            "global_merge_vars": [{
                    "name": "pasajero",
                    "content": "merge1 content"
                }, {
                    "name": "fechaevento",
                    "content": "merge1 content"
                }, {
                    "name": "drivername",
                    "content": "merge1 content"
                }, {
                    "name": "eventoid",
                    "content": "merge1 content"
                }, {
                    "name": "fecha1",
                    "content": "merge1 content"
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



};


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
 * 9 ya el taxista llego
 */