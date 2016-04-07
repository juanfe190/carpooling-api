var ridesModel = require('../Database/Rides').ridesModel;
var usersModel = require('../Database/Users').usersModel;
module.exports={
	store,
	destroy,
	addJoinedUsers
};

/**
* Crea un nuevo ride en BD
* 
* @param Object
* @Function callback
*/
function store(data, callback){
	usersModel.findOne({email: data.owner}, function(err, userObj){
		if(err) return callback(err, null);
		var ride = new ridesModel({
			from: {
		        province: data.from.province,
		        canton: data.from.canton
		      },
		      to: {
		        province: data.to.province,
		        canton: data.to.canton
		      },
		      departureTime: data.departureTime,
		      date: data.date,
		      seatsAvailable: data.seatsAvailable,
		      owner: userObj,
		      joinedUsers: []
		});
		
		ride.save(function(err, rideObj){
			if(err) return callback(err, null);
			return callback(null, rideObj);
		});
	});
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
	ridesModel.findById(id, function(error, rideObj){
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