/**
 * Passenger.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
    /*
    beforeCreate: function(attrs, next) {
      var bcrypt = require('bcrypt');

      bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(attrs.password, salt, function(err, hash) {
          if (err) return next(err);

          attrs.password = hash;
          next();
        });
      });
    },

*/



    name: {
      type: 'string',
      required: true,
      maxLength: 20
    },
    lastName: {
      type: 'string',
      required: false,
      maxLength: 20
    },
     isActive: {
      type: 'boolean',
      required: false,
      defaultsTo: true

    },
    point: {
      type: 'intenger',
      required: false,
      defaultsTo: '0'

    },
    email: {
      type: 'email',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 3
    },
    phoneNumber: {
      type: 'string',
      required: true,
    },
    
    lastLogin: {
      type: 'datetime',
      required: false
    },
    platform: {
      type: 'string',
      required: false
    },
    model: {
      type: 'string',
      required: false
    },
    uuid: {
      type: 'string',
      required: false
    },
    city: {
      type: 'string',
      required: false
    },
    state: {
      type: 'string',
      required: false
    },
    country: {
      type: 'string',
      required: false
    },

    taxiFavorito: {
      type: 'array',
      id: {
        type: 'string',
        required: false
      },
      name: {
        type: 'string',
        required: false
      },
      picture: {
        type: 'string',
        required: false
      }
    },
    taxiNoFavorito: {
      type: 'array',
      id: {
        type: 'string',
        required: false
      },
      name: {
        type: 'string',
        required: false
      },
      picture: {
        type: 'string',
        required: false
      }
    },


    toJSON: function() {
      var obj = this.toObject();
      // delete obj.password;
      return obj;

    }
    /* e.g.
    nickname: 'string'
    */

  }

};