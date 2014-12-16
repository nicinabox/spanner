var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var VehicleSchema = new Schema({
  user: String,
  name: String,
  vin: String,
  notes: String,
  details: {},
  position: { type: Number, default: 0 },
  settings: {
    enableCost: { type: Boolean, default: false },
    retired: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
