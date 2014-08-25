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
   * `DriverController.create()`
   
   
   
   
   
   
   
   
   */
  create: function(req, res) {

    //subir foto primero 
    var uploadFile = req.file('avatar');
   
    //console.log("la extencion del arvhivo es : "+ path.extname(uploadFile.filename));
    function generateName(file) {}

    uploadFile.upload({  
      dirname: sails.config.appPath + "/assets/linker/drivers/",
      saveAs: generateName(uploadFile),
      //maxBytes: 500
    }, function onUploadComplete(err, files) { // Files will be uploaded to ./assets/images
     
      if (err) {
        return res.serverError(err);
      } else{
         var nombreArchivo =  path.basename(files[0].fd); 
    crearDriver(nombreArchivo);
      };
   
    });


function crearDriver(saveAs){


    Driver.create({
      name: req.param('name'),
      lastname: req.param('lastname'),
      email: req.param('email'),
      picture: saveAs,
      dir_picture: "linker/drivers/",
      password: req.param('password'),
      phone: req.param('phone'),
      birthday: req.param('birthday'),
      addres: req.param('addres'),
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
        res.json({
          status: false,
          code: "11001",
          response: "Error al crear driver",

        });
        console.log("User NO created:", error);
      } else {
        //req.session.user = user;
        //res.send(user);
        res.json({
          status: true,
          code: "",
          response: "driver creado.",
          data: driver
        });
        console.log("User created:", driver);
      }
    });

  }
  },


  /**
   * `DriverController.login()`
   */
  login: function(req, res) {
    return res.json({
      todo: 'login() is not implemented yet!'
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