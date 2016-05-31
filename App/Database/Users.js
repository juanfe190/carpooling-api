var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var usersSchema = new Schema({
    image: 'string',
  	name: {type: 'string', required: true},
  	lastname: {type: 'string', required: true},
  	city: {
         province: {
            value: 'number',
            name: 'string'
          },
          canton: {
            value: 'number', //EL VALUE DEL CANTON ES EL INDEX AL RECIBIR TODOS LOS CANTONES DE CADA PROVINCIA
            name: 'string'
          }
      },
      age: 'number',
      study: {
          type: Schema.Types.ObjectId,
          ref: 'carreras'
      },
  	whatsapp: 'number',
  	email: {
      type: 'string', 
      required: true
    },
    username: {
      type: 'string', 
      required: true
    },
  	password: {type: 'string', required: true},
    vehicleId: 'string',
  	since: 'date',
    token: 'string',
    activo: 'boolean'
  });
var usersModel = mongoose.model('Users', usersSchema);
module.exports = {
  usersModel,
  usersSchema
};