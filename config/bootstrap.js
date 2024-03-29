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
    uuid = require('node-uuid');
    Q = require('q');
    path = require('path');
    // socket = req.socket;
    io = sails.io;



    setInterval(function() {
        console.log("generando rank");
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

                            }
                        }
                    );
                });
            };
        })





    }, 600000);

    setInterval(function() {


        var objFecha = new Date();
        var milisegundos = objFecha.getTime();
        // Restar 5 minutos . 
        objFecha.setTime(milisegundos - (3 * 60000));

        //date.toISOString(); //"2011-12-19T15:28:46.493Z"


        Event.native(function(err, collection) {
            collection.update({
                    isActive: true,
                    status: 1,
                    createdAt: {
                        "$lte": new Date(objFecha.toISOString())
                    }

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



    setInterval(function() {


        var objFecha = new Date();
        var milisegundos = objFecha.getTime();
        // Restar 5 minutos . 
        objFecha.setTime(milisegundos - (100.4 * 60000));

        //date.toISOString(); //"2011-12-19T15:28:46.493Z"


        Central.find()
            .where({
                createdAt: {
                    '<=': new Date(objFecha.toISOString())
                }
            })
            .where({
                isActive: true
            })


        .exec(function(err, objects) {
            if (objects) {
                for (var i = 0; i < objects.length; i++) {
                    Central.update({
                        id: objects[i].id
                    }, {
                        status: 5,
                        isActive: false,

                    }).exec(function afterwards(err, updated) {
                        var requestify = require('requestify');
                        requestify.get('http://smsgateway.me/api/v3/messages/send?email=mncarrasquero@gmail.com&password=19177230&number=' + updated[0].telefono + '&message=No pudimos encontrarte un taxi te pedimos disculpas. te invitamos a descargar para android Ubitaxi  &device=8672')
                            .then(function(response) {
                                // Get the response body (JSON parsed or jQuery object for XMLs)
                                
                            });
                    });
                };

            };



        });




        //   }, 30000);
    }, 8000);


    cb();
};