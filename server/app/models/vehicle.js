var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var VehicleSchema = new Schema({
  name: String,
  position: { type: Number, default: 0 },
  settings: {
    enableCost: { type: Boolean, default: false },
    retired: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
