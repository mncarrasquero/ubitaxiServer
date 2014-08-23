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
  login: function (req, res) {

   // console.log(req._passport.session.user);




    res.locals.flash = _.clone(req.session.flash);

    return res.login({
      successRedirect: '/dashboard'
    });

  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
    req.logout();
     req.session.flash = {
        err: 'Hasta luego...',
        type : 'alert-info'
      };
    return res.redirect('/login');
   
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {

    User.create(req.params.all()).exec(function (err, user) {
      if (err) return res.negotiate(err);
      req.login(user, function (err){
        if (err) return res.negotiate(err);
        return res.redirect('/welcome');
      });
    });
  }
};

