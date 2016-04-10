var usersModel = require('../Database/Users').usersModel;
var Q = require('q');
module.exports = {
	checkIfExists,
	checkIfEmailExists,
	checkRequiredValues
};

/**
* Revisa que el usuario a tratar exista
* @param String id (En body o en URL)
*/
function checkIfExists(request, response, next){
	var id = request.params.id || request.body.id;
	if(!id) return response.json({error: 'El id del usuario no fue encontrado en el request'});

	var user = usersModel.findById(id, function(err, docs){
		if(err) return response.json({error: err});
		if(docs) return next();

		return response.json({error: 'El usuario especificado no existe'});
	});
}

/**
* Revisa que el usuario a tratar exista
* @param String email (En body o en URL)
*/
function checkIfEmailExists(request, response, next){
	var email = request.params.email || request.body.email;
	if(!email) return response.json({error: 'El email del usuario no fue encontrado en el request'});

	var user = usersModel.count({email: email}, function(err, count){
		if(err) return response.json({error: err});
		if(count>0) return next();

		return response.json({error: 'El email especificado no existe'});
	});
}

/**
* Revisa que los atributos requeridos existan en el request
*
*/
function checkRequiredValues(request, response, next){
	var data = request.body;
	var requiredFields = ['password', 'email'];
	Q.fcall(function(){
		requiredFields.forEach(function(value, index){
			if(typeof data[value] === 'undefined' || !data[value]) return {invalid: true, value: value};
		});

	}).then(function(isEmpyOrNull){
		if(isEmpyOrNull) return reponse.json({error: 'El atributo '+isEmpyOrNull.value+' es requerido'});
		else return next();
	}).done();
}