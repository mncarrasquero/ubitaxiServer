/**
* Ciudades.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		name: {
			type: 'string',
			required: true
		},
		country: {
			type: 'string',
			required: true
		},

		manager: {
			type: 'string',
			required: true
		},
		phone: {
			type: 'string',
			required: true
		},
		email: {
			type: 'string',
			required: true
		},

		location: {
			type: 'json'
		},
  }
};

