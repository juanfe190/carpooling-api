var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var carrerasSchema = new Schema({
      value: {
        type: 'string',
        required: true
      },
      name: {
        type: 'string',
        required: true
      }
});

var carrerasModel = mongoose.model('carreras', carrerasSchema);
module.exports = {
  carrerasModel,
  carrerasSchema
};