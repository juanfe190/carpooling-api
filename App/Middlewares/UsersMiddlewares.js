var usersModel = require('../Database/Users').usersModel;
module.exports = {
	checkIfExists,
	checkIfEmailExists
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

function checkIfEmailExists(request, response, next){
	var email = request.params.email || request.body.email;
	if(!email) return response.json({error: 'El email del usuario no fue encontrado en el request'});

	var user = usersModel.count({email: email}, function(err, docs){
		if(err) return response.json({error: err});
		if(docs) return next();

		return response.json({error: 'El email especificado no existe'});
	});
}