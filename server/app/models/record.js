var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var RecordSchema = new Schema({
  date: Date,
  cost: Number,
  mileage: Number,
  notes: String,
  vehicleId: ObjectId
});

module.exports = mongoose.model('Record', RecordSchema);
