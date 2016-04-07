var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
    image: 'string',
  	name: 'string',
  	lastname: 'string',
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
      study: {
          value: 'string',
          name: 'string'
      },
  	whatsapp: 'number',
  	email: 'string',
  	password: 'string',
  	since: 'date'
  });

var usersModel = mongoose.model('Users', usersSchema);
module.exports = {
  usersModel,
  usersSchema
};