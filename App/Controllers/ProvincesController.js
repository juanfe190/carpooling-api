var Province = require('../Util/Provincias/provincias');
var Canton = require('../Util/Provincias/cantones');

module.exports ={
	getAllProvinces,
	getCanton
}

/**
* Retorna todas las provincias
* 
*/
function getAllProvinces(request, response){
	return response.json(Province);
}

/**
* Busca canton con el id de la provincia
*
* @param Expected 'request.params.id'
*/
function getCanton(request, reponse){
	var id = request.params.id;
	var cantones = [];

	for(var key in Canton){
		if(Canton[key].Provincia==id) cantones.push(Canton[key]);
	}

	return reponse.json(cantones);
}