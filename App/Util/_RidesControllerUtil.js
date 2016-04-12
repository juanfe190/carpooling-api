var Province = require('./Provincias/provincias');
var Canton = require('./Provincias/cantones');

/**
* Cambia el request city e imita un 'populate' 
*
*/
function populateCity(data, key){
	var valueProvince = data[key].province;
	var indexCanton = data[key].canton;
	try{
		var nameProvince = Province[valueProvince].Nombre;
		var objCanton = getCantones(valueProvince)[indexCanton];
	}catch(err) {console.log('Error')}
	



	data[key].province = 
	{
		value: valueProvince,
		name: nameProvince
	};
	data[key].canton = 
	{
		value: indexCanton,
		name: objCanton.Nombre
	};
	return data;
}

/**
* Busca los cantones de una provincia, similar al controller pero 
* se utiliza como private solo en esta clase
*/
function getCantones(id){
	var cantones = [];

	for(var key in Canton){
		if(Canton[key].Provincia==id) cantones.push(Canton[key]);
	}

	return cantones;
}

module.exports = {
	populateCity
}