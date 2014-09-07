/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	beforeCreate: function(values, cb) {
    if(values.createdAt && typeof value.createdAt === 'string'){
        values.createdAt = new Date(Date.parse(values.createdAt));
    }
    return cb();
},
beforeUpdate: function(values, cb){
    if(values.createdAt && typeof value.createdAt === 'string'){
        values.createdAt = new Date(Date.parse(values.createdAt));
    }
    return cb();
},
	schema: true,
	attributes: {
		eventLocation: {
			type: 'json',
		},
		gpsPassengerLocation: {
			type: 'json',
		},
		eventDestinoCoordinate: {
			type: 'json',
		},

		
		eventPriori: {
			type: 'string',
			required: false,
			//defaultsTo: 1
		},

		isActive: {
			type: 'boolean',
			required: false,
			defaultsTo: true
		},
		status: {
			type: 'integer',
			defaultsTo: "1"
		},
		eventCalle: {
			type: 'string',
			required: false
		},
		eventSector: {
			type: 'string',
			required: false
		},
		eventCity: {
			type: 'string',
			required: false
		},
		eventExtra: {
			type: 'string',
			required: false
		},
		eventDestinoName: {
			type: 'string',
			required: false
		},
		eventDestinoLat: {
			type: 'float',
			required: false
		},
		eventDestinoLng: {
			type: 'float',
			required: false
		},
		eventAccGps: {
			type: 'float',
			required: false
		},
		eventLocation: {
			type: 'json'
		},


		passengerId: {
			type: 'string',
			required: false
		},
		passengerName: {
			type: 'string',
			required: false
		},
		passengerLastname: {
			type: 'string',
			required: false
		},
		passengerPhonenumber: {
			type: 'string',
			required: false
		},



		driverId: {
			type: 'string',
			required: false
		},
		driverName: {
			type: 'string',
			required: false
		},
		driverLastname: {
			type: 'string',
			required: false
		},
		driverPhonenumber: {
			type: 'string',
			required: false
		},
		driverCarModel: {
			type: 'string',
			required: false
		},
		driverCarPlate: {
			type: 'string',
			required: false
		},
		driverCarColor: {
			type: 'string',
			required: false
		},





	}
};