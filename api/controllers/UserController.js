/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `UserController.login()`
   */

  changepass: function(req, res) {
    //valido el toquen 
 //console.log(req.param('newPass1') + "\n " +req.param('newPass2') );
   
     Passenger.findOne({
        email: req.param('email'),


      }).exec(function(err, user) {
        if (err) res.json({
          error: 'DB error'
        }, 500);
        if (user && user.passReset.token == req.param('token')  &&  moment().diff(user.passReset.created, 'hours') < 24  && user.passReset.isActive == true ) {
        
          // si existe el usuario procedo a validar el estatus en el sistema
          //si es bien devuelvo la data 
          if (user.isActive == true ) {

            console.log("usuario activo  procedo a cambiar el pass y  uso el token");
            
              Passenger.update({
                id: user.id
              }, { 
                  password: req.param('newPass1'),
                  passReset: {
                  created: user.passReset.created,
                  token: user.passReset.token,
                  isActive: false
                }
            
              }).exec(function afterwards(err, updated) {
                if (err) {
                  return;
                }
                  //descativo el token
                 return res.view('user/recoverypass', {expire: false, complete: true, email: req.param('email'), token: req.param('token')});
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

          console.log("usuario no existe");
           return res.view('user/recoverypass', {expire: true,  complete: false, email: req.param('email'), token: req.param('token')});
        }
      });





  },

  recoverypass: function(req, res) {

    if (req.param('email') && req.param('token')) {

      //validar q existe la verga esa...
      Passenger.findOne({
        email: req.param('email'),


      }).exec(function(err, user) {
        if (err) res.json({
          error: 'DB error'
        }, 500);
        if (user && user.passReset.token == req.param('token')  &&  moment().diff(user.passReset.created, 'hours') < 24  && user.passReset.isActive == true  ) {
        
          // si existe el usuario procedo a validar el estatus en el sistema
          //si es bien devuelvo la data 
          if (user.isActive == true ) {

            
            return res.view('', {
              expire: false,
               complete: false,
              email: req.param('email'),
              token: req.param('token')
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

          console.log("usuario no existe");
          return res.view('', {
            expire: true,
             complete: false,
          });
        }
      });



    } else {
      return res.view(
        "404"
      );
    }

  },


  login: function(req, res) {
    console.log("hola mundo login");
    // console.log(req._passport.session.user);



    res.locals.flash = _.clone(req.session.flash);

    return res.login({
      successRedirect: '/dashboard'
    });

  },


  /**
   * `UserController.logout()`
   */
  logout: function(req, res) {
    req.logout();
    req.session.flash = {
      err: 'Hasta luego...',
      type: 'alert-info'
    };
    return res.redirect('/login');

  },


  /**
   * `UserController.signup()`
   */
  signup: function(req, res) {

    User.create(req.params.all()).exec(function(err, user) {
      if (err) return res.negotiate(err);
      req.login(user, function(err) {
        if (err) return res.negotiate(err);
        return res.redirect('/welcome');
      });
    });
  }
};