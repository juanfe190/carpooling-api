var carrerasModel = require('../Database/Carreras').carrerasModel;

module.exports = {
	all,
	store
}

/**
* Devuelve todas las carreras
*/
function all(request, response){
	carrerasModel.find({}, function(err, carrerasObj){
		if(err) return response.json({error: err});

		return response.json(carrerasObj);
	});
}

/**
* Crea nueva carrera en la base de datos
* 
* @param Expected request body
*/
function store(request, response){
	var data = request.body;

	var carrera = new carrerasModel(data);

	carrera.save(function(err, carreraObj){
		if(err) return response.json({error: err});
		return response.json(carreraObj);
	});
}