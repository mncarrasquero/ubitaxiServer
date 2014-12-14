/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Q = require('q');
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

    test1: function(req, res, next) {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz123456789";
        for (var i = 0; i < 4; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log(text);

        return text;

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



    dashboard: function(req, res, next) {

  
   

        var today = moment().zone('-0430').format('YYYY-MM-DD');
        var _date = new Date(today);



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
                        '>=': _date
                    },

                }).then(),
                //fIN eventos hoy

                //cuantos eventos completados hoy
                Event.count({
                    createdAt: {
                        '>=': _date
                    },
                    status: 7
                }).then(),
                //fIN 



                //cuantos eventos cancelados por parka
                Event.count({
                    createdAt: {
                        '>=': _date
                    },
                    status: 5

                }).then(),
                //fIN 


                //cuantos eventos cancelados pasajero
                Event.count({
                    createdAt: {
                        '>=': _date
                    },
                    status: 2

                }).then(),
                //fIN 

                //cuantos eventos cancelados taxista
                Event.count({
                    createdAt: {
                        '>=': _date
                    },
                    status: 4

                }).then(),
                //fIN 



                //ultimos servicios
                Event.find({
                    isActive: false,
                    status: 7
                }).sort({
                    createdAt: 'desc'
                }).then(),
                //Ultimos Servicios




                // let's find one Lexus car

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