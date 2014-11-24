var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ReminderSchema = new Schema({
  reminder: String,
  vehicleId: ObjectId
});

module.exports = mongoose.model('Reminder', ReminderSchema);
