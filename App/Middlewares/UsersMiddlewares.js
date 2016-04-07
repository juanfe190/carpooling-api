var usersModel = require('../Database/Users').usersModel;
module.exports = {
	checkIfExists
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