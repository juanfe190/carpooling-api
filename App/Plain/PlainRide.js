module.exports = 
function(data){
	var self = this;
	this.from = data.from;
	this.to = data.to;
	this.departureTime = data.departureTime;
	this.date = data.date;
	this.seatsAvailable = data.seatsAvailable;
	this.owner = new PlainUser(data.owner);
	this.joinedUsers = data.joinedUsers.map(function(user, key){
		return new PlainUser(user);
	});
}