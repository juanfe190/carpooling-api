var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = require('./Users').usersSchema;

var ridesSchema = new Schema({
      from: {
        province: 'string',
        canton: 'string'
      },
      to: {
        province: 'string',
        canton: 'string'
      },
      departureTime: 'string',
      date: 'date',
      seatsAvailable: 'number',
      owner: usersSchema,
      joinedUsers: [usersSchema]
});

var ridesModel = mongoose.model('Rides', ridesSchema);
module.exports = {
  ridesModel,
  ridesSchema
};