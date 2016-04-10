var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function unique(value, callback){
  usersModel.count({email: value}, function(err, count){
    return callback(count==0);
  });
}
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
            value: 'number',
            name: 'string'
          }
      },
      age: 'number',
      _study: {
          type: Schema.Types.ObjectId,
          ref: 'carreras'
      },
  	whatsapp: 'number',
  	email: {
      type: 'string', 
      validate : [unique, 'El correo ingresado ya fue registrado'],
      required: true
    },
  	password: {type: 'string', required: true},
  	since: 'date'
  });
var usersModel = mongoose.model('Users', usersSchema);
module.exports = {
  usersModel,
  usersSchema
};