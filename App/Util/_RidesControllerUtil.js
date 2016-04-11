var Province = require('./Provincias/provincias');
var Canton = require('./Provincias/cantones');

/**
* Cambia el request city e imita un 'populate' 
*
*/
function populateCity(rideObj, key, callback){
	var valueProvince = rideObj[key].province;
	var indexCanton = rideObj[key].canton;
	try{
		var nameProvince = Province[valueProvince].Nombre;
		var objCanton = getCantones(valueProvince)[indexCanton];
	}catch(err) {return response.json({error: 'Error al poblar city, verifique el formato del JSON y que el value exista'});}
	

	if(!nameProvince) return response.json({error: 'Provincia no encontrada'});
	if(!objCanton) return response.json({error: 'Canton no encontrado'});

	rideObj[key]={
		province: {
			value: valueProvince,
			name: nameProvince
		},
		canton: {
			value: indexCanton,
			name: objCanton.Nombre
		}
	};
	return rideObj.save();
}