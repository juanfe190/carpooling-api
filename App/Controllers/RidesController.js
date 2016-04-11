var Q = require('q');

var ridesModel = require('../Database/Rides').ridesModel;
var usersModel = require('../Database/Users').usersModel;
var util = require('../Util/_RidesControllerUtil');
module.exports={
	store,
	destroy,
	addJoinedUsers,
	all
};

/**
* Devuelve todos los rides de la BD
*
* @param Function callback
*/
function all(callback){
	ridesModel.find({})
	.populate('joinedUsers')
	.populate({
		path: 'owner',
		populate: {path: 'study'}
	})
	.exec(function(err, ridesObj){
		if(err) return callback(err, null);

		
		return callback(null, ridesObj);
	});
}

/**
* Crea un nuevo ride en BD
* 
* @param Object
* @Function callback--------------------------------------------------------
*/
function store(data, callback){

Q.fcall(util.populateCity.bind(null, data, 'from'))
.then(util.populateCity.bind(null, data, 'to'))
.then(function(data){
	var ride = new ridesModel(data);

	ride.save(function(err, rideObj){
		if(err) return callback(err, null);
		ridesModel.findOne(rideObj).populate('owner').exec(function(err, result){
			if(err) return callback(err, null);
			if(!rideObj.owner) return callback('El owner dado no existe', null);
			return callback(null, rideObj);
		});
	});
}).done();
}

/**
* Elimina un ride de la BD
*
* @String id
* @Function callback
*/
function destroy(id, callback){
	var ride = ridesModel.findById(id);
	ridesModel.remove(ride, function(err){
		if(err) return callback(err);
		return callback(null);
	})
}

/**
* Busca ride por ID
*/
function find(id, callback){
	ridesModel.findById(id)
	.populate({
		path: 'owner',
		populate: {path: 'study'}
	})
	.populate('joinedUsers')
	.exec(function(error, rideObj){
		if(error) return callback(err, null);

		return callback(null, rideObj);
	});
}

/**
* Agrega usuario al ride
*
* @param Object ({email: 'String', rideId: 'String'})
* @param function callback
*/
function addJoinedUsers(params, callback){
	usersModel.findOne({email: params.email}, function(err, userObj){
		if(err) return callback(err);

		ridesModel.findById(params.rideId, function(err, rideObj){
			if(err) return callback(err);
			rideObj.joinedUsers.push(userObj);
			rideObj.save();
			return callback(null);
		});
	});
}

