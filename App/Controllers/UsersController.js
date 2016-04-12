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
* Crea nuevo usuario en la base de datos
* 
* @param Expected request body
*/
function store(request, response){
	var data = request.body;

	var user = new usersModel({
		image: data.image,
		name: data.name,
		lastname: data.lastname,
		city: {
	        province: {
	          value: data.city.province.value,
	          name: data.city.province.name
	        },
	        canton: {
	          value: data.city.canton.value,
	          name: data.city.canton.name
	        }
	    },
	    age: data.age,
	    study: data.study,
		whatsapp: data.whatsapp,
		email: data.email,
		password: bcrypt.hash(data.password),
		since: new Date
	});

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
	usersModel.update(user, {
		name: data.name,
		lastname: data.lastname,
		city: {
	        province: {
	          value: data.city.province.value,
	          name: data.city.province.name
	        },
	        canton: {
	          value: data.city.canton.value,
	          name: data.city.canton.name
	        }
	    },
	    age: data.age,
	    study: data.study,
		whatsapp: data.whatsapp,
		email: data.email,
		password: bcrypt.hash(data.password)
	}, function(err, count){
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