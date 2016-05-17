var usersModel = require('../Database/Users').usersModel;
var bcrypt = require('../Util/BCrypt');
var jwt = require('jsonwebtoken');
var constants = require('../Util/constants');

module.exports = LoginController;

/**
* Recibe el request y crea response
*
* @param express Request
* @param express Response
*/
function LoginController(request, response){
	var username = request.body.username.toLowerCase();
	var password = request.body.password;

	checkUserAndPass(username, password, function(loginStatus, objUser){
		if(loginStatus){
			var token = jwt.sign({username: username}, constants.jwtPrivateKey);
			return response.json({status: 'ok', token: token, user: objUser});
		}else {
			if(objUser.token != '') return response.json({status: 'denied', error: '1002'});
			return response.json({status: 'denied', error: '1001'});
		}
	});
}

/**
* Revisa que exista un usuario con el email y verifica
* la contrasena
*
* @param String username
* @param String password
* @param Function callback
*/
function checkUserAndPass(username, password, callback){
	usersModel.findOne({'username': username})
	.populate('study')
	.exec(function(err, objUser){
		if(err) return console.log('Error en query: '+err);
		var valido = bcrypt.compare(password, objUser.password);

		if(objUser.token != '' || !objUser.activo) valido=false;
		return callback(valido, objUser);
	});	
}