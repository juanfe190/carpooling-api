var usersModel = require('../Database/Users').usersModel;
var Province = require('../Util/Provincias/provincias');
var Canton = require('../Util/Provincias/cantones');

module.exports = {
	checkIfExists,
	checkIfEmailExists,
	checkRequiredValues,
	populateCity
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
* Revisa que el usuario a tratar exista. Ademas cambia el email a lowercase
* @param String email (En body o en URL)
*/
function checkIfEmailExists(request, response, next){
	var email = request.params.email || request.body.email;
	if(!email) return response.json({error: 'El email del usuario no fue encontrado en el request'});
	email = email.toLowerCase();

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

	for(var x = 0; x<=requiredFields.length-1; x++){
		if(typeof data[requiredFields[x]] === 'undefined' || !data[requiredFields[x]]) return response.json({error: 'El atributo '+requiredFields[x]+' es requerido'});
	}
	return next();
}

/**
* Cambia el request city e imita un 'populate' 
*
*/
function populateCity(request, response, next){
	var valueProvince = request.body.city.province;
	var indexCanton = request.body.city.canton;
	try{
		var nameProvince = Province[valueProvince].Nombre;
		var objCanton = getCantones(valueProvince)[indexCanton];
	}catch(err) {return response.json({error: 'Error al poblar city, verifique el formato del JSON y que el value exista'});}
	

	if(!nameProvince) return response.json({error: 'Provincia no encontrada'});
	if(!objCanton) return response.json({error: 'Canton no encontrado'});

	request.body['city']={
		province: {
			value: valueProvince,
			name: nameProvince
		},
		canton: {
			value: indexCanton,
			name: objCanton.Nombre
		}
	};

	next();
}

/**
* Busca los cantones de una provincia, similar al controller pero 
* se utiliza como private solo en esta clase
*/
function getCantones(id){
	var cantones = [];

	for(var key in Canton){
		if(Canton[key].Provincia==id) cantones.push(Canton[key]);
	}

	return cantones;
}