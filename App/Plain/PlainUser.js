module.exports = 
function(data, socket){
	var self = this;
	this.socket = socket;

	this.image = data.image;
	this.name = data.name;
	this.lastname = data.lastname;
	this.city = data.city;
	this.age = data.age;
	this.study = data.study;
	this.whatsapp = data.whatsapp;
	this.email = data.email;
	this.password = data.password;
}