/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    listciudades: function(req, res, next) {

        Ciudades.find()
            .exec(function foundUsers(err, city) {

                if (err) return res.serverError(err);

                // Get an array of all the UserId2 values, using sails.util.pluck,
                // which is essentially Lodash's _.pluck
                // var friend_ids = sails.util.pluck(friend_records, 'id');

                // Get the User records for those users.  Using an array
                // in the criteria makes Waterline do an "in" query

                // pass the array down to the /views/index.ejs page
                res.view({
                    layout: 'admin/layoutAdmin.ejs',
                    user: req.session.passport.me,
                    ciudades: city
                });


            });

    },


    sayHiToFriend: function(req, res) {


        /*
        io.sockets.emit('central', {
            action: 'Point',
            response: {
                id: req.param('id'),
                lat: req.param('lat'),
                lng: req.param('lng'),
                name: req.param('name'),
                picture: req.param('picture'),
                plate: req.param('plate')

            }
        });
        */

        res.json({
            message: 'Message sent!'
        });
    },




    test1: function(req, res, next) {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz123456789";
        for (var i = 0; i < 4; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log(text);

        return text;

    },




    updateDriverData: function(req, res, next) {
        var valores = req.params.all();
        var activo = true;
        if (req.param('isActive') === "true") {
            activo = true;
        } else {
            activo = false;

        };


        Driver.update({
            id: req.param('id')
        }, {
            isActive: activo,
            uuid: req.param('uuid'),
            name: req.param('name'),
            lastname: req.param('lastname'),
            email: req.param('email'),
            picture: req.param('picture'),
            dir_picture: req.param('dir_picture'),
            password: req.param('password'),
            phone: req.param('phone'),
            ci: req.param('ci'),
            birthday: req.param('birthday'),
            address: req.param('address'),


            point: req.param('point'),

            car: {
                brand: req.param('car-brand'),
                model: req.param('car-model'),
                year: req.param('car-year'),
                color: req.param('car-color'),
                type: req.param('car-type'),
                door: req.param('car-door'),
                cap: req.param('car-cap'),
                plate: req.param('car-plate'),
                serial: req.param('car-serial'),
                owner: req.param('car-owner'),
                rating: req.param('car-rating'),
            }

        }).exec(function afterwards(err, updated) {
            if (err) {
                // handle error here- e.g. `res.serverError(err);`
                console.log(err);
                return;
            }
            res.redirect('/listDriver');
            return;


        });




    },





    updatePassengerData: function(req, res, next) {
        var valores = req.params.all();
        var activo = true;
        if (req.param('isActive') === "true") {
            activo = true;
        } else {
            activo = false;

        };
        console.log(valores);

        Passenger.update({
            id: req.param('id')
        }, {
            name: req.param('name'),
            lastName: req.param('lastName'),
            email: req.param('email'),
            password: req.param('password'),
            phoneNumber: req.param('phoneNumber'),
            isActive: activo,

        }).exec(function afterwards(err, updated) {
            if (err) {
                // handle error here- e.g. `res.serverError(err);`
                return;
            }
            return res.redirect('/listpassenger');


        });




    },



    nuevaciudad: function(req, res, next) {
        res.view({
            layout: 'admin/layoutAdmin.ejs',
            user: req.session.passport.me
        });
    },

    mapa: function(req, res, next) {
        res.view({
            layout: 'admin/layoutAdmin.ejs',
            user: req.session.passport.me
        });
    },


    addciudad: function(req, res, next) {


        Ciudades.create(req.params.all(), function passengerCreated(error, ciudad) {
            if (error) {
                res.json({
                    status: false,
                    response: "Error al crear la ciudad",

                });

            } else {

                return res.redirect('/listciudades');

            }
        });


    },

    central: function(req, res, next) {

        console.log(req.session.passport.me);
        res.view({
            layout: 'admin/layoutCentral.ejs',
            user: req.session.passport.me,
            data: {

            }
        });

    },

    dashboard: function(req, res, next) {

        //console.log(req.session.passport.me);

        if (req.session.passport.me.role == "central") {
            res.redirect('/central');
            return;

        };

        var inicio = new Date(moment().zone('-0430').startOf('day').toISOString());
        var fin = new Date(moment().zone('-0430').endOf('day').toISOString());





        Q.all([
                // let's find one user with name "Pavel"
                //cuantos pasajero hay 
                Passenger.count({
                    isActive: true
                }).then(),
                // Fin de pasajeto

                //cuantos conductores hay
                Driver.count({
                    isActive: true
                }).then(),
                //fIN DE CONDUCTORES

                //cuantos eventos hoy
                Event.count({
                    createdAt: {
                        '>=': inicio,
                        '<=': fin
                    },


                }).then(),
                //fIN eventos hoy

                //cuantos eventos completados hoy
                Event.count({
                    createdAt: {
                        '>=': inicio,
                        '<=': fin
                    },

                    status: 7
                }).then(),
                //fIN 



                //cuantos eventos cancelados por parka
                Event.count({
                    createdAt: {
                        '>=': inicio,
                        '<=': fin
                    },

                    status: 5

                }).then(),
                //fIN 


                //cuantos eventos cancelados pasajero
                Event.count({
                    createdAt: {
                        '>=': inicio,
                        '<=': fin
                    },

                    status: 2

                }).then(),
                //fIN 

                //cuantos eventos cancelados taxista
                Event.count({
                    createdAt: {
                        '>=': inicio,
                        '<=': fin
                    },

                    status: 4

                }).then(),
                //fIN 



                //ultimos servicios
                Event.find({
                    isActive: false,
                    status: 7,
                    limit: 10,
                }).sort({
                    createdAt: 'desc'
                }).then(),
                //Ultimos Servicios






            ])
            .spread(function(Passenger, Driver, totalHoy, completadosHoy, canceladosParka, canceladoPasajero, canceladoTaxista, EventosCompletados) {
                // Output results as json, but you can do whatever you want here
                //res.json([user, car, phone]);

                /*
                var data  = new Array();
    var tempData = new Object();
    var eventId = "";
    var cont = "";

                Event.find({
                    groupBy: ['passengerId'],
                    sum: ['status'],
                    //limit: 20,
                    //sort: 'count DESC'
                }).exec(function(error, eventos) {
                    if (error) res.json(error);
                    for (var i = 0; i < eventos.length; i++) {
                        
                        //console.log(eventos[i].passengerId);
                        eventId = eventos[i].passengerId;

                        Event.count({
                            passengerId:  eventos[i].passengerId,
                             status: 7                         

                        }).exec(function(err, contador) {
                            cont = contador
                          
                            
                        });
                         data.push({"passengerId": eventId, "cantidad": contador }); 

                    };
                    console.log(data);
                });

*/




                res.view({
                    layout: 'admin/layoutAdmin.ejs',
                    user: req.session.passport.me,
                    data: {
                        pasajeros: Passenger,
                        taxistas: Driver,
                        totalHoy: totalHoy,
                        completadosHoy: completadosHoy,
                        sinRespuesta: canceladosParka,
                        canceladoPasajero: canceladoPasajero,
                        canceladoTaxista: canceladoTaxista,
                        eventosCompletados: EventosCompletados,
                    }
                });

            }).fail(function(reason) {
                // output reason of failure
                res.json(reason);
            });



    },



    createDriver: function(req, res) {

        res.view({
            layout: 'admin/layoutAdmin.ejs',
            user: req.session.passport.me
        });

    },

    prospectos: function(req, res) {

        res.view({
            layout: 'admin/layoutAdmin.ejs',
            user: req.session.passport.me
        });

    },

    listDriver: function(req, res) {

        res.view({
            layout: 'admin/layoutAdmin.ejs',
            user: req.session.passport.me
        });

    },

    listPassenger: function(req, res) {

        res.view({
            layout: 'admin/layoutAdmin.ejs',
            user: req.session.passport.me
        });

    },

    viewpassenger: function(req, res) {
        Q.all([
                // let's find one user with name "Pavel"
                Passenger.findOne({
                    id: req.param('id'),

                }).then(),

                Event.find({
                    passengerId: req.param('id'),
                    or: [{
                        status: 7
                    }, {
                        status: 4
                    }, {
                        status: 2
                    }]
                }).sort({
                    createdAt: 'desc'
                }).then(),

                Driver.count({
                    isActive: true
                }).then(),


                Event.count({
                    passengerId: req.param('id'),
                    or: [{
                        status: 7
                    }, {
                        status: 4
                    }, {
                        status: 2
                    }]
                }).then(),

                Event.count({
                    passengerId: req.param('id'),
                    or: [{
                        status: 7
                            //completados
                    }]
                }).then(),

                Event.count({
                    passengerId: req.param('id'),
                    or: [{
                        status: 2
                            //cancelado taxista
                    }]
                }).then(),

                Event.count({
                    passengerId: req.param('id'),
                    or: [{
                        status: 4
                            //cancelado pasajero
                    }]
                }).then(),


                Event.count({
                    passengerId: req.param('id'),
                    or: [{
                        status: 5
                            //por parka
                    }]
                }).then(),

                // let's find one Lexus car

            ])
            .spread(function(Passenger, Eventos, Driver, EventCount, Completados, CaceladosPasajero, CanceladoTaxista, sinRespuesta) {
                // Output results as json, but you can do whatever you want here
                //res.json([user, car, phone]);
                //console.log(Eventos);
                res.view({
                    layout: 'admin/layoutAdmin.ejs',
                    user: req.session.passport.me,
                    data: {
                        pasajero: Passenger,
                        taxistas: Driver,
                        eventos: Eventos,
                        totalEvent: EventCount,
                        Completados: Completados,
                        CaceladosPasajero: CaceladosPasajero,
                        CanceladoTaxista: CanceladoTaxista,
                        sinRespuesta: sinRespuesta,

                    }
                });

            }).fail(function(reason) {
                // output reason of failure
                res.json(reason);
            });



    },


    viewdriver: function(req, res) {
        Q.all([
                // let's find one user with name "Pavel"
                Driver.findOne({
                    id: req.param('id'),

                }).then(),

                Event.count({
                    'dataDriver.driverId': {
                        contains: req.param('id')
                    },

                    or: [{
                        status: 7
                            //completados
                    }]
                }).then(),

                Event.count({
                    'dataDriver.driverId': {
                        contains: req.param('id')
                    },
                    or: [{
                        status: 2
                            //cancelado taxista
                    }]
                }).then(),
                //eventos q partcipo
                Event.find({
                    'dataDriver.driverId': {
                        contains: req.param('id')
                    },
                    or: [{
                        status: 7
                    }, {
                        status: 4
                    }, {
                        status: 2
                    }]
                }).sort({
                    createdAt: 'desc'
                }).then(),




                // let's find one Lexus car

            ])
            .spread(function(Driver, completadosDriver, canceladosDriver, eventos) {
                // Output results as json, but you can do whatever you want here
                //res.json([user, car, phone]);

                var karma = completadosDriver / (completadosDriver + canceladosDriver);
                karma = karma * 100;
                karma = karma.toFixed(0);


                res.view({
                    layout: 'admin/layoutAdmin.ejs',
                    user: req.session.passport.me,
                    data: {
                        Driver: Driver,
                        completadosDriver: completadosDriver,
                        canceladosDriver: canceladosDriver,
                        karma: karma,
                        eventos: eventos




                    }
                });

            }).fail(function(reason) {
                // output reason of failure
                res.json(reason);
            });



    },

    eventosAsk: function(req, res, next) {

        var inicio = new Date(moment(req.param('inicio')).toISOString());
        var fin = new Date(moment(req.param('fin')).toISOString());


        Event.find({
                createdAt: {
                    '>=': inicio,
                    '<=': fin
                },

            })
            .exec(function foundEvent(err, eventos) {

                if (err) return res.serverError(err);
                if (eventos) {
                    for (var i = eventos.length - 1; i >= 0; i--) {
                        delete eventos[i]["gpsPassengerLocation"];
                        delete eventos[i]["gpsDriverLocation"];
                        delete eventos[i]["dataTaximetro"];
                        delete eventos[i]["eventPrice"];
                        delete eventos[i]["dataPriceEvent"];





                    };

                    eventos = eventos.filter(function() {
                        return true;
                    });


                    res.json({
                        cant: eventos.length,
                        status: true,
                        data: eventos
                    });


                } else {
                    //si el id no corresponde responde error y procedo a hacer logout en la app
                    res.json({
                        status: false,
                        data: ""
                    });
                }
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

    stateRank: function(req, res, next) {
        var state = req.param('state');
        var top = req.param('top') || 10;
        Rank.find({
            state: state
        }).exec(function(err, data) {

            if (data != "") {

                var output = [];
                for (var i = 0, l = data[0].rank.length; i < top; ++i) {

                    output.push(data[0].rank[i]);

                }
                res.json({
                    status: true,
                    data: output

                });

            } else {
                res.json({
                    status: false

                });

            };



        });
    },


    findMyRank: function(req, res, next) {
        var driverId = req.param('driverId');
        Driver.findOne({
            id: driverId
        }).exec(function(err, driver) {


            if (err) {
                res.json({
                    status: false

                });
            } else {
                Rank.find({
                    state: driver.state
                }).exec(function(err, data) {

                    if (data != "") {

                        var found = false;
                        var point = "";
                        var pos = "";
                        for (var i = 0; i < data[0].rank.length; i++) {
                            if (data[0].rank[i].id == driverId) {
                                found = true;
                                point = data[0].rank[i].point;
                                pos = i + 1;
                                break;
                            }
                        }
                        res.json({
                            status: true,
                            pos: pos,
                            point: point,
                            driverId: driverId

                        });

                    } else {
                        res.json({
                            status: false

                        });

                    };



                });
            };


        });
    },







    generateRank: function(req, res) {
        var sort_by = function(field, reverse, primer) {

            var key = primer ?
                function(x) {
                    return primer(x[field])
                } :
                function(x) {
                    return x[field]
                };

            reverse = [-1, 1][+!!reverse];

            return function(a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        }


        var state = "Zulia";

        Driver.find({

            isActive: true,
            state: state
        }).exec(function(err, drivers) {

            if (drivers) {
                var nuevo = [];
                var data = {};
                for (var i = drivers.length - 1; i >= 0; i--) {
                    data = {
                        picture: drivers[i].dir_picture + drivers[i].picture,
                        name: drivers[i].name + " " + drivers[i].lastname,
                        point: drivers[i].point,
                        state: drivers[i].state,
                        id: drivers[i].id
                    }
                    nuevo.push(data);

                };
                nuevo.sort(sort_by('point', false, parseInt));

                var aGuardar = {
                    generateAt: new Date(),
                    state: state,
                    rank: nuevo
                };

                Rank.native(function(err, collection) {
                    collection.update({
                            state: state
                        }, {
                            date: new Date(),
                            state: state,
                            rank: nuevo
                        }, {
                            upsert: true,
                            safe: true
                        },
                        function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json({
                                    status: true,
                                    date: new Date(),
                                    state: state,
                                    rank: nuevo
                                });
                            }
                        }
                    );
                });

            };



        })



    },


    driverEventos: function(req, res, next) {

        var sort_by = function(field, reverse, primer) {

            var key = primer ?
                function(x) {
                    return primer(x[field])
                } :
                function(x) {
                    return x[field]
                };

            reverse = [-1, 1][+!!reverse];

            return function(a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        }


        var inicio = new Date(moment().subtract(35, 'days').toISOString());
        var fin = new Date(moment().endOf('day').toISOString());
        //var fin = new Date(moment().toISOString());
        var status = req.param("status") || 7;

        Event.find({
                status: status,
                createdAt: {
                    '>=': inicio,
                    '<=': fin
                },

            })
            .exec(function foundEvent(err, eventos) {

                if (err) return res.serverError(err);
                if (eventos) {
                    for (var i = eventos.length - 1; i >= 0; i--) {
                        delete eventos[i]["gpsPassengerLocation"];
                        delete eventos[i]["gpsDriverLocation"];
                        delete eventos[i]["dataTaximetro"];
                        delete eventos[i]["eventPrice"];
                        delete eventos[i]["dataPriceEvent"];

                    };

                    eventos = eventos.filter(function() {
                        return true;
                    });



                    var newFoods = _.chain(eventos).reduce(function(memo, evento) {
                        memo[evento.dataDriver['driverId']] = memo[evento.dataDriver['driverId']] || [];
                        memo[evento.dataDriver['driverId']].push(evento);
                        //  memo[ evento.passengerId ].push( evento.passengerName );
                        return memo;
                    }, {}).map(function(eventos, id) {
                        return {
                            id: id,
                            driverName: eventos[0].dataDriver['driverName'] + " " + eventos[0].dataDriver['driverLastname'],
                            total: eventos.length
                        };
                    }).value();


                    newFoods.sort(sort_by('total', false, parseInt));

                    // return newFoods;

                    res.json({

                        data: newFoods
                    });



                } else {
                    //si el id no corresponde responde error y procedo a hacer logout en la app
                    res.json({
                        status: false,
                        data: ""
                    });
                }
            });




    },


    detalleEventoPublico: function(req, res) {

        //var maxDistance = parseInt(req.param('maxDistance')) || 2;
        var limit = 1;

        Event.findOne({
            id: req.param('id')
        }).exec(function(err, eventos) {

            if (err) res.json({
                error: 'DB error'
            }, 500);
            if (eventos) {
                var posiciones8 = [];
                var posiciones9 = [];
                for (var i = 0; i < eventos.gpsDriverLocation.length; i++) {
                    if (eventos.gpsDriverLocation[i].flag == 8) {
                        var data = [eventos.gpsDriverLocation[i].lat, eventos.gpsDriverLocation[i].lng]
                        posiciones8.push(data);
                    };
                    if (eventos.gpsDriverLocation[i].flag == 9) {
                        var data = [eventos.gpsDriverLocation[i].lat, eventos.gpsDriverLocation[i].lng]
                        posiciones9.push(data);
                    };

                };


                var pasar = {

                    nombreCliente: eventos.passengerName,
                    nombreChofer: eventos.dataDriver.driverName + " " + eventos.dataDriver.driverLastname,
                    fotoChofer: "http://app.ubitaxi.net:1337/" + eventos.dataDriver.driverPicture,
                    carroChofer: eventos.dataDriver.carBrand + " " + eventos.dataDriver.carModel + " - " + eventos.dataDriver.carColor,
                    palas: eventos.dataDriver.carPlate,
                    eventoOrigen: eventos.eventLocation.coordinates,
                    posiciones8: JSON.stringify(posiciones8),
                    posiciones9: JSON.stringify(posiciones9)

                };

                res.view('admin/rastreoevento', {
                    data: pasar,
                });
                /*
                                 res.json({
                                     status: true,
                                     data: {

                                         nombreCliente: eventos.passengerName,
                                         nombreChofer: eventos.dataDriver.driverName + " " + eventos.dataDriver.driverLastname,
                                         fotoChofer: "http://app.ubitaxi.net:1337/"+eventos.dataDriver.driverPicture,
                                         carroChofer: eventos.dataDriver.carBrand + " "+ eventos.dataDriver.carModel + " - "+ eventos.dataDriver.carColor,
                                         palas: eventos.dataDriver.carPlate,
                                         pociciones: eventos.gpsDriverLocation




               
                                     }
                                 });*/

            } else {
                //si el id no corresponde responde error y procedo a hacer logout en la app
                res.json({
                    status: false,
                    data: ""
                });
            }
        });



    },




    pasajeroEventos: function(req, res, next) {

        var sort_by = function(field, reverse, primer) {

            var key = primer ?
                function(x) {
                    return primer(x[field])
                } :
                function(x) {
                    return x[field]
                };

            reverse = [-1, 1][+!!reverse];

            return function(a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        }


        var inicio = new Date(moment().subtract(35, 'days').toISOString());
        var fin = new Date(moment().toISOString());
        var status = 7;

        Event.find({
                status: status,
                createdAt: {
                    '>=': inicio,
                    '<=': fin
                },

            })
            .exec(function foundEvent(err, eventos) {

                if (err) return res.serverError(err);
                if (eventos) {
                    for (var i = eventos.length - 1; i >= 0; i--) {
                        delete eventos[i]["gpsPassengerLocation"];
                        delete eventos[i]["gpsDriverLocation"];
                        delete eventos[i]["dataTaximetro"];
                        delete eventos[i]["eventPrice"];
                        delete eventos[i]["dataPriceEvent"];

                    };

                    eventos = eventos.filter(function() {
                        return true;
                    });



                    var newFoods = _.chain(eventos).reduce(function(memo, evento) {
                        memo[evento.passengerId] = memo[evento.passengerId] || [];
                        memo[evento.passengerId].push(evento);
                        //  memo[ evento.passengerId ].push( evento.passengerName );
                        return memo;
                    }, {}).map(function(eventos, id) {
                        return {
                            id: id,
                            passengerName: eventos[0].passengerName + " " + eventos[0].passengerLastname,
                            total: eventos.length
                        };
                    }).value();


                    newFoods.sort(sort_by('total', false, parseInt));

                    // return newFoods;

                    res.json({

                        data: newFoods
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