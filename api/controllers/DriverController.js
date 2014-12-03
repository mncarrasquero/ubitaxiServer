/**
 * DriverController
 *
 * @description :: Server-side logic for managing drivers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var uuid = require('node-uuid');
var path = require('path');


module.exports = {


    chequeoDriver: function(req, res) {

        /*
         * en chequeo cuenta. se verifica el estatus del pasajero. y se cumple si hay conexion a internet
         * la respuesta es true con la data del pasajero. menos la clave. se busca con la informacion del id
         */

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

                    //procedo a buscar si tiene algun evento creado... ene stado de activo...
                    Event.findOne({
                        'dataDriver.driverId': req.param('id')

                        ,
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

                                });
                            };



                            if (evento.status == 8) {

                                res.json({
                                    status: true,
                                    Appversion: "1.1",
                                    error: '',
                                    mensaje: "Bienvenido",
                                    data: user,
                                    code: "e08",
                                    evento: evento,

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



    /**
     * `DriverController.create()`   */
    create: function(req, res) {
        //subir foto primero   

        //console.log("la extencion del arvhivo es : "+ path.extname(uploadFile.filename));
        function generateName(file) {}

        Driver.findOne({
            email: req.param('email')
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
                var uploadFile = req.file('avatar');
                uploadFile.upload({
                    dirname: sails.config.appPath + "/assets/linker/drivers/",
                    saveAs: generateName(uploadFile),
                    //maxBytes: 500
                }, function onUploadComplete(err, files) { // Files will be uploaded to ./assets/images

                    if (err) {
                        return res.serverError(err);
                    } else {
                        console.log(files);
                        if (typeof files !== 'undefined' && files.length > 0) {
                            var nombreArchivo = path.basename(files[0].fd);
                            crearDriver(nombreArchivo);
                        } else {
                            var nombreArchivo = "a0.png";
                            crearDriver(nombreArchivo);
                        }
                    };
                });


            }
        });

        function crearDriver(nombreArchivo) {
            var pin = "";
            var possible = "abcdefghijklmnopqrstuvwxyz123456789";
            for (var i = 0; i < 5; i++) {
                pin += possible.charAt(Math.floor(Math.random() * possible.length));
            };


            Driver.create({
                isActive: true,
                uuid: req.param('uuid'),
                pin: pin,
                name: req.param('name'),
                lastname: req.param('lastname'),
                email: req.param('email'),
                picture: nombreArchivo,
                dir_picture: "linker/drivers/",
                password: req.param('password'),
                phone: req.param('phone'),
                ci: req.param('ci'),
                birthday: req.param('birthday'),
                address: req.param('address'),
                city: req.param('city'),
                state: req.param('state'),
                country: req.param('country'),
                rating: 3,
                point: 0,
                lastLogin: "",
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
                },

                lastPosition: {
                    type: "Point",
                    status: "",
                    date: "",
                    coordinates: [parseFloat(-71), parseFloat(10)]
                }
            }, function driverCreated(error, driver) {
                if (error) {
                    console.log(error);
                    res.json({
                        status: false,
                        code: "11001",
                        response: "Error al crear driver",

                    });
                    // console.log("User NO created:", error);
                } else {
                    //req.session.user = user;
                    //res.send(user);
                    console.log("User created:", driver);
                    return res.redirect('/detailNewDriver?id=' + driver.id);


                }
            });



        }



    },


    /**
     * `DriverController.listDrivers()`
     */
    listDrivers: function(req, res) {
        Driver.find().exec(function(err, driver) {
            if (err) {
                return res.json({
                    status: false,


                });
            } else {
                return res.json({
                    status: true,
                    aaData: driver
                });
            }
        });

    },

    loginDriver: function(req, res) {

        Driver.findOne({
            uuid: req.param('uuid')
        }, function(err, driver) {

            //   if (err) return verify_cb(err);
            if (!driver) {

                return res.json({
                    status: false,

                    code: "F01",
                    message: 'Este equipo no esta registrado en nuestro sistema',
                });
            } else {
                if (driver.ci == req.param('ci')) {
                    Driver.update({
                        emei: req.param('imei'),
                        ci: req.param('ci')
                    }, {
                        lastLogin: new Date(),
                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        }
                    });
                    return res.json({
                        status: true,
                        data: driver
                    });

                } else {

                    return res.json({
                        status: false,

                        code: "F02",
                        message: 'Cedula de identidad invalida',
                    });


                };

            };



        });



    },

    /**
     * `DriverController.hayCondunctores()`
     */
    hayCondunctores: function(req, res) {

        //  console.log('DriverUbiController: action=geoProximity ');
        //  console.log(' req.isSocket ', req.isSocket);
        // console.log(' req.isAjax   ', req.isAjax);
        // console.log(' req.isJson   ', req.isJson);

        var lat = parseFloat(req.param('lat'));
        var lng = parseFloat(req.param('lng'));
        var maxDistance = parseInt(req.param('maxDistance')) || 2;
        var limit = parseInt(req.param('limit')) || 3;
        //  console.log('   lat         ', lat, typeof lat);
        //  console.log('   lng         ', lng);
        //  console.log('   maxDistance ', maxDistance, typeof maxDistance);
        //  console.log('   limit       ', limit);

        Driver.native(function(err, collection) {

            collection.geoNear(lng, lat, {
                maxDistance: 15 / 6378,
                limit: limit,
                // in meters
                query: {
                    'lastPosition.status': 'disponible'
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
                            status: false,
                            //response: docs.results
                        });
                    } else {
                        var nuevoArray = [];
                        for (var i = 0; i < docs.results.length; i++) {


                            var now = moment().add(15, 'minute');
                            var date = docs.results[i].obj.lastPosition.date
                            var hace = now.diff(date, 'minutes')
                            //console.log(now.diff(date, 'minutes')); // 1

                            if (hace <= 20) {
                                nuevoArray.push(docs.results[i].obj.lastPosition.coordinates);
                            };



                        }
                        if (nuevoArray.length > 0) {
                            res.json({
                                status: true,
                                response: nuevoArray
                            });

                        } else {
                            res.json({
                                status: false,
                                response: nuevoArray
                            });

                        };


                    };
                }
            });
        });

    },


    /**
     * `DriverController.index()`
     */
    index: function(req, res) {
        return res.json({
            todo: 'index() is not implemented yet!'
        });
    },


    /**
     * `DriverController.edit()`
     */
    edit: function(req, res) {
        return res.json({
            todo: 'edit() is not implemented yet!'
        });
    },


    /**
     * `DriverController.view()`
     */
    view: function(req, res) {
        return res.json({
            todo: 'view() is not implemented yet!'
        });
    }
};