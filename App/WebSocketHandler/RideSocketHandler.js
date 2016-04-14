var RidesController = require('../Controllers/RidesController');

module.exports = {
	configure,
	createRide,
	deleteRide,
	joinRide,
	sendRidesToClient
}
var localio;
var activeUsers=[];

function configure(io, users){
	localio = io;
	activeUsers = users;
}
/**
* Crea un nuevo ride y lo almacena en la BD
* Agrega a 'activeUsers' el owner de dicho ride
*
* @param Socket del owner
* @param Object ride
*/
function createRide(socket, data){
	RidesController.store(data, function(err, rideObj){
		if(err) return socket.emit('err', {msg: err});

		var user = rideObj.owner;
		socket["email"] = user.email; //Agrega email al socket
		socket.join(rideObj._id); //Crea room, el nombre sera el 'id' del ride
		activeUsers.push({
			email: user.email,
			socket: socket,
			rideId: rideObj._id,
			type: 'owner'
		});

		sendRidesToClient();
	});
}

/**
* Eliminar ride de BD y todos sus usuarios de 'activeUsers'
* 
* @param String id
*/
function deleteRide(socket, id){
	console.log('delete');
	RidesController.destroy(id, function(err){
		if(err) return socket.emit('err', {msg: err});

		activeUsers =  activeUsers.filter(function(ride, index){
			ride.rideId != id;
		});

		sendRidesToClient();
	});
}

/**
* Se une a un ride
*
* @param Socket usuario unido
* @param Object ({email: 'String', rideId: 'String'})
*/
function joinRide(socket, data){
	RidesController.addJoinedUsers({email: data.email, rideId: data.rideId}, function(err){
		if(err) return socket.emit('err', {msg: err});
		socket["email"] = data.email; //Agrega email al socket
		socket.join(data.rideId); //Ingresa al room con el 'id' del ride
		activeUsers.push({
			email: data.email,
			socket: socket,
			rideId: data.rideId,
			type: 'user'
		});

		sendRidesToClient();
	});
}

/**
* Enviar rides a todos los clientes
*
* @param global io
*/
function sendRidesToClient(){
	RidesController.all(function(err, ridesObj){
		if(err) return socket.emit('err', {msg: err});
		localio.emit('updateClientRides', ridesObj);
	});
}