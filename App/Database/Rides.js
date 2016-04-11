var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
      owner: {type: Schema.Types.ObjectId, ref: 'Users'},
      joinedUsers: [{type: Schema.Types.ObjectId, ref: 'Users'}],
      waze: 'string'
});

var ridesModel = mongoose.model('Rides', ridesSchema);
module.exports = {
  ridesModel,
  ridesSchema
};