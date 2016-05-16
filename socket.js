var RideSocketHandler = require('./App/WebSocketHandler/RideSocketHandler');

module.exports = {
	startConnection
};

var activeUsers=[];
function startConnection(io){
	RideSocketHandler.configure(io, activeUsers);
	io.on('connection', function(socket){
		//Acciones globales
		socket.on('getRides', RideSocketHandler.sendRidesToClient);
		socket.on('createRide', RideSocketHandler.createRide.bind(null, socket));
		socket.on('deleteRide', RideSocketHandler.deleteRide.bind(null, socket));
		socket.on('joinRide', RideSocketHandler.joinRide.bind(null, socket));
		socket.on('disconnect', function(){ onUserDisconnect(socket._id) });	
	});
}

function onUserDisconnect(id){
	activeUsers = activeUsers.filter(function(user, index){
		return user._id != id;
	});
}	