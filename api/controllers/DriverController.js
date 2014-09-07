/**
 * DriverController
 *
 * @description :: Server-side logic for managing drivers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var uuid = require('node-uuid');
var path = require('path');


module.exports = {
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
      Driver.create({
        isActive: true,
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
      email: req.param('email'),
      password: req.param('password')
    }, function(err, driver) {

      //   if (err) return verify_cb(err);
      if (!driver) {
        return res.json({
          status: false,
          message: 'Usuario o clave invalidos'
        });
      } else {
        return res.json({
          status: true,
          data: driver
        });
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
        maxDistance: 145 / 6378,
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
          console.log('docs=', docs);
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
              nuevoArray.push(docs.results[i].obj.lastPosition.coordinates);

            }


            res.json({
              status: true,
              response:  nuevoArray
            });
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