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
* @Function callback
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
	.exec(function(err, rideObj){
		if(err) return callback(err, null);

		return callback(null, rideObj);
	});
}

/**
* Buscar ride por owner
*
* @param ID del owner
*/
function findByOwner(owner, callback){
	ridesModel.find({owner: owner})
	.populate({
		path: 'owner',
		populate: {path: 'study'}
	})
	.exec(function(err, rideObj){
		if(err) return callback(err, null);
		if(!rideObj) return callback('Ride no encontrado', null);

		console.log('find by owner: '+rideObj);
		return callback(null, rideObj);
	});
}

/**
* Agrega usuario al ride
*
* @param Object ({user: 'Objectid de user', ride: 'Objectid de ride'})
* @param function callback
*/
function addJoinedUsers(params, callback){
	ridesModel.findById(params.ride, function(err, rideObj){
		if(err) return callback(err);
		if(rideObj.seatsAvailable<=0) return callback('No quedan campos disponibles');

		rideObj.seatsAvailable--;
		rideObj.joinedUsers.push(params.user);
		rideObj.save();
		return callback(null);
	});
}
