/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	
    username: {
      type: 'email',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 5
    },
     name: {
      type: 'string',
     
    },
     lastname: {
      type: 'string',
      required: true,
     
    },
    role:{
    	type: 'string'
    }
  },

  

};