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

        // Let's combine results of 3 queries
        Q.all([
                // let's find one user with name "Pavel"
                Passenger.count({
                    isActive: true
                }).then(),

                Driver.count({
                    isActive: true
                }).then(),

                Event.count({
                    isActive: false,
                    status: 7
                }).then(),

                Event.count({

                    or: [{

                            status: 7
                        },

                        {
                            status: 4
                        }
                    ]
                }).then(),

                // let's find one Lexus car

            ])
            .spread(function(Passenger, Driver, Event, CanceladosTaxista) {
                // Output results as json, but you can do whatever you want here
                //res.json([user, car, phone]);
                res.view({
                    layout: 'admin/layoutAdmin.ejs',
                    user: req.session.passport.me,
                    data: {
                        pasajeros: Passenger,
                        taxistas: Driver,
                        CanceladosTaxista: CanceladosTaxista,
                        serviciosCompletados: Event,
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
