var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MaintenanceSchema = new Schema({
  actions: Schema.Types.Mixed,
  vehicleId: ObjectId
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
