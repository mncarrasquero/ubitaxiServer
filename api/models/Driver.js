/**
 * Driver.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema:true,
	attributes: {
		isActive: {
			type: 'boolean',

		},

		name: {
			type: 'string',
			required: true
		},
		uuid: {
			type: 'string',
			required: true
		},
		lastname: {
			type: 'string',
			required: true
		},
		email: {
			type: 'email',
			required: true,
			unique: true
		},
		password: {
			type: 'string',
			required: true,
			minLength: 5

		},
		ci: {
			type: 'string',
			required: true,
			unique: true
		},
		picture: {
			type: 'string',
			defaultsTo: 'a0.png'

		},
		dir_picture: {
			type: 'string',
			defaultsTo: 'linker/drivers/'

		},
		phone: {
			type: 'string',
			required: true,
		},
		birthday: {
			type: 'date'

		},
		address: {
			type: 'string',
			required: true,
		},
		city: {
			type: 'string',
		},
		state: {
			type: 'string',
		},
		country: {
			type: 'string',
		},
		rating: {
			type: 'string',
		},
		point: {
			type: 'string',
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

		lastLogin: {
			type: 'datetime',
		},


		lastPosition: {
			type: 'json'
		},
		car: {
			type: 'json'
		},
		toJSON: function() {
			var obj = this.toObject();
			// Remove the password object value
			delete obj.password;
			// return the new object without password
			return obj;
		}



	}
};