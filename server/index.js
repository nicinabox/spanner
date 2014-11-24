var _ = require('lodash');
var express      = require('express');
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var app          = express();

var mongoDbPath = 'mongodb://localhost/service-records';
mongoose.connect(mongoDbPath);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

var port   = process.env.PORT || 8080;
var router = express.Router();

var Vehicle  = require('./app/models/vehicle');
var Record   = require('./app/models/record');
var Reminder = require('./app/models/reminder');

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/vehicles')
  .post(function(req, res) {
    var vehicle = new Vehicle();
    _.merge(vehicle, req.body);

    vehicle.save(function(err, v) {
      if (err) res.send(err);
      res.json(v);
    });
  })

  .get(function(req, res) {
    Vehicle.find(function(err, vehicles) {
      if (err) res.send(error);

      res.json(vehicles);
    });
  });

router.route('/vehicles/:id')
  .get(function(req, res) {
    Vehicle.findById(req.params.id, function(err, vehicle) {
      if (err) res.send(err);
      res.json(vehicle);
    });
  })

  .put(function(req, res) {
    Vehicle.findById(req.params.id, function(err, vehicle) {
      if (err) res.send(err);
      _.merge(vehicle, req.body);

      vehicle.save(function(err) {
        if (err) res.send(err);

        res.json(vehicle);
      });

    });
  })

  .delete(function(req, res) {
    Vehicle.remove({
      _id: req.params.id
    }, function(err, vehicle) {
      if (err) res.send(err);

      res.json(vehicle);
    });
  });

router.route('/vehicles/:vehicleId/records')
  .get(function(req, res) {
    Record.find({ vehicleId: req.params.vehicleId }, function(err, records) {
      if (err) res.send(err);
      res.json(records);
    });
  })

  .post(function(req, res) {
    var record = new Record();
    _.merge(record, req.body, req.params);

    record.save(function(err, rec) {
      if (err) res.send(err);
      res.json(rec);
    });
  });

router.route('/vehicles/:vehicleId/records/:id')
  .delete(function(req, res) {
    Record.remove({
      _id: req.params.id
    }, function(err, record) {
      if (err) res.send(err);
      res.json(record);
    });
  });

router.route('/vehicles/:vehicleId/reminders')
  .get(function(req, res) {
    Reminder.find({ vehicleId: req.params.vehicleId }, function(err, reminders) {
      if (err) res.send(err);
      res.json(reminders);
    });
  })

  .post(function(req, res) {
    var reminder = new Reminder();
    _.merge(reminder, req.body, req.params);

    reminder.save(function(err, rec) {
      if (err) res.send(err);
      res.json(rec);
    });
  });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
