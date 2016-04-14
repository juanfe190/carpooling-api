var usersModel = require('../Database/Users').usersModel;
var carrerasModel = require('../Database/Users').carrerasModel;
var bcrypt = require('../Util/BCrypt');

module.exports = {
	store,
	find,
	update,
	destroy
};
/**
* Crea nuevo usuario en la base de datos. El email se pasa a minusculas
* 
* @param Expected request body
*/
function store(request, response){
	var data = request.body;
	data["since"] = new Date;

	var user = new usersModel(data);
	user.save(function(err, userObj){
		if(err) return response.json({error: err});
		
		usersModel.findOne(userObj)
		.populate('study')
		.exec(function(err, userObj){
			if(err) return response.json({error: err});

			return response.json(userObj);
		});
	});
}

/**
* Busca usuario por ID
*/
function find(request, response){
	var id = request.params.id;
	usersModel.findById(id)
	.populate('study')
	.exec(function(err, userObj){
		if(err) return response.json({error: error});

		return response.json(userObj);
	});
}

/**
* Actualiza usuario
*/
function update(request, response){
	var id = request.params.id;
	var data = request.body;

	var user = usersModel.findById(id);
	usersModel.update(user, data, function(err, count){
		if(err) return response.json({error: err});
		return response.json({status: 'ok'});
	});
}

/**
* Elimina un usuario
*/
function destroy(request, response){
	var id = request.body.id;
	var user = usersModel.findById(id);
	usersModel.remove(user, function(err){
		if(err) return response.json({error: err});

		return response.json({status: 'ok'});
	})
}