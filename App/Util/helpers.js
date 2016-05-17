module.exports = {
	randomString
}

/*
* Genera un string aleatorio
*
* @param Tamano del string
* @author Felix Vasquez
*/
function randomString(length){
	length = length || 6;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}