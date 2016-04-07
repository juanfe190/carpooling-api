var bcrypt = require('bcrypt-nodejs');

module.exports = {hash, compare};

/**
* Crea un nuevo hash 
* 
* @param String a hashear 
*/
function hash(word){
	var salt = bcrypt.genSaltSync();
	return bcrypt.hashSync(word, salt);
}

/**
* Compara un String plain y uno hasheado, y devuelve TRUE si coinciden 
* y FALSE en su defecto
*
* @param String sin hash
* @param SAtring hasheada
*/
function compare(word, hashed){
	return bcrypt.compareSync(word, hashed)
}