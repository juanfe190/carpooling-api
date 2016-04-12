var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ridesSchema = new Schema({
      from: {
        province: {
            value: 'number',
            name: 'string'
          },
          canton: {
            value: 'number', //EL VALUE DEL CANTON ES EL INDEX AL RECIBIR TODOS LOS CANTONES DE CADA PROVINCIA
            name: 'string'
          },
          details: 'string'
      },
      to: {
        province: {
            value: 'number',
            name: 'string'
          },
          canton: {
            value: 'number', //EL VALUE DEL CANTON ES EL INDEX AL RECIBIR TODOS LOS CANTONES DE CADA PROVINCIA
            name: 'string'
          },
          details: 'string'
      },
      departureTime: 'string',
      date: 'date',
      seatsAvailable: 'number',
      owner: {type: Schema.Types.ObjectId, ref: 'Users'},
      joinedUsers: [{type: Schema.Types.ObjectId, ref: 'Users'}],
      waze: 'string'
});

var ridesModel = mongoose.model('Rides', ridesSchema);
module.exports = {
  ridesModel,
  ridesSchema
};