var usersModel = require('../Database/Users').usersModel;
var carrerasModel = require('../Database/Users').carrerasModel;
var bcrypt = require('../Util/BCrypt');
var email = require('../Util/emailsender');

module.exports = {
	store,
	find,
	update,
	destroy,
	activate
};
/**
* Crea nuevo usuario en la base de datos. El email se pasa a minusculas
* 
* @param Expected request body
*/
function store(request, response){
	var data = request.body;
	data["since"] = new Date;
	data["token"] = bcrypt.hash(data['email']+Math.random());
	data["activo"] = false;
	data["password"] = bcrypt.hash(data['password']);

	var user = new usersModel(data);
	user.save(function(err, userObj){
		if(err) return response.json({error: err});
		
		usersModel.findOne(userObj)
		.populate('study')
		.exec(function(err, userObj){
			if(err) return response.json({error: err});
			email.send({body: buildMailBody(userObj), to: userObj.email, subject: 'Token de activacion'});

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

/**
* Activa un usuario validando el token
*/
function activate(request, response){
	var email = request.body.email;
	var token = request.body.token;
	var user = usersModel.findOne({email: email}, function(err, userObj){
		if(err) return response.json({error: error});

		if(userObj.token == token){
			userObj.token = '';
			userObj.activo = true;

			usersModel.update(user, userObj, function(err, userObj){
				if(err) return response.json({error: error});
				return response.json({status: 'ok'});
			});
			
		}else return response.json({status: 'denied', error: 'Token incorrecto'});
	});
}

/*
* Utilizada como private, crea el HTML del body para envio de token al usuario
*
* @author Felix Vasquez
*/
function buildMailBody(user){
	var html = "<h2>Hola "+user.name+" "+user.lastname+"</h2><br>"+
				"Gracias por utilizar carpooling ULACIT. Su token de activación es:<br>"+
				"<b>"+user.token+"</b>";
	return html;
}