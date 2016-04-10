var usersModel = require('../Database/Users');
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
	var email = request.body.email;
	var password = request.body.password;

	checkUserAndPass(email, password, function(loginStatus, objUser){
		if(loginStatus){
			var token = jwt.sign({email: email}, constants.jwtPrivateKey);
			return response.json({status: 'ok', token: token, user: objUser});
		}else return response.json({status: 'denied'});
	});
}

/**
* Revisa que exista un usuario con el email y verifica
* la contrasena
*
* @param String email
* @param String password
* @param Function callback
*/
function checkUserAndPass(email, password, callback){
	usersModel.findOne({'email': email}, function(err, objUser){
		if(err) return console.log('Error en query: '+err);
		
		return callback(bcrypt.compare(password, objUser.password), objUser);
	});	
}