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
	    _study: data.study,
		whatsapp: data.whatsapp,
		email: data.email,
		password: bcrypt.hash(data.password),
		since: new Date
	});

	user.save(function(err, userObj){
		if(err) return response.json({error: err});
		
		usersModel.findOne(userObj).populate('_study').exec(function(err, userObj2){
			if(err) return response.json({error: err});

			return response.json(userObj2);
		});
	});
}

/**
* Busca usuario por ID
*/
function find(request, response){
	var id = request.params.id;
	usersModel.findById(id, function(error, user){
		if(error) return response.json({error: error});

		return response.json(user);
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
	    study: {
	        value: data.study.value,
	        name: data.study.name
	    },
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