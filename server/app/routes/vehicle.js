var _ = require('lodash');
var express = require('express');
var router = express.Router();

var passwordless = require('passwordless');
var EdmundsApi = require('../edmunds');

var Vehicle     = require('../models/vehicle');
var Record      = require('../models/record');
var Reminder    = require('../models/reminder');
var Maintenance = require('../models/maintenance');

var ONE_MONTH = 2629800000;
var ONE_YEAR = 31557600000;

var getVehicleDetails = function(vehicle, callback) {
  if (!vehicle.vin) return;

  var api = new EdmundsApi({
    resource: 'vins/' + vehicle.vin
  });

  console.log(api.url());
  return api.fetch(callback);
};

var getVehicleMaintenance = function(vehicle, callback) {
  var _modelYearId = modelYearId(vehicle)
  if (!_modelYearId) return;

  var api = new EdmundsApi({
    version: 1,
    dataset: 'maintenance',
    resource: 'actionrepository/findbymodelyearid',
    params: {
      modelyearid: _modelYearId
    }
  });

  console.log(api.url());
  api.fetch(callback)
};

var modelYearId = function(vehicle) {
  if (vehicle.details && vehicle.details.years) {
    return vehicle.details.years[0].id;
  }
};

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.use('/vehicles', passwordless.restricted());

router.route('/vehicles')
  .post(function(req, res) {
    var vehicle = new Vehicle();
    _.merge(vehicle, req.body, { user: req.user });

    if (vehicle.vin) {
      getVehicleDetails(vehicle, function(err, resp, body) {
        _.extend(vehicle, { details: JSON.parse(body) });

        vehicle.save(function(err, v) {
          if (err) res.send(err);
          res.json(v);
        });
      });

    } else {
      vehicle.save(function(err, v) {
        if (err) res.send(err);
        res.json(v);
      });
    }
  })

  .get(function(req, res) {
    Vehicle.find({ user: req.user }, function(err, vehicles) {
      if (err) res.send(error);

      res.header('Cache-Control', 'public, max-age=' + ONE_MONTH);
      res.json(vehicles);
    });
  });

router.route('/vehicles/:id')
  .get(function(req, res) {
    Vehicle.findById(req.params.id, function(err, vehicle) {
      if (err) res.send(err);

      res.header('Cache-Control', 'public, max-age=' + ONE_MONTH);
      res.json(vehicle);
    });
  })

  .put(function(req, res) {
    Vehicle.findById(req.params.id, function(err, vehicle) {
      if (err) res.send(err);
      _.merge(vehicle, req.body);

      if (vehicle.vin) {
        vehicle.vin = vehicle.vin.toUpperCase();
        getVehicleDetails(vehicle, function(err, resp, body) {
          if (err) {
            console.log(err);
            return;
          }

          var details = JSON.parse(body);
          _.extend(vehicle, { details: details });

          vehicle.save(function(err, v) {
            if (err) res.send(err);
            res.json(v);
          });
        });

      } else {
        vehicle.save(function(err) {
          if (err) res.send(err);
          res.json(vehicle);
        });
      }
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

router.route('/vehicles/:vehicleId/maintenance')
  .get(function(req, res) {
    var vehicleId = req.params.vehicleId
    Maintenance.findOne({ vehicleId: vehicleId }, function(err, maintenance) {
      if (err) res.send(err);

      res.header('Cache-Control', 'public, max-age=' + ONE_MONTH);

      if (maintenance) {
        res.json(maintenance);

      } else {
        Vehicle.findById(vehicleId, function(err, vehicle) {
          getVehicleMaintenance(vehicle, function(err, resp, body) {
            maintenance = new Maintenance

            _.extend(maintenance, {
              actions: JSON.parse(body),
              vehicleId: vehicleId
            });

            maintenance.save()
            res.json(maintenance);
          });
        });
      }
    });
  });

router.route('/vehicles/:vehicleId/records')
  .get(function(req, res) {
    Record.find({ vehicleId: req.params.vehicleId }, function(err, records) {
      if (err) res.send(err);

      res.header('Cache-Control', 'public, max-age=' + ONE_MONTH);
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
  .put(function(req, res) {
    Record.findById(req.params.id, function(err, record) {
      if (err) res.send(err);
      _.merge(record, req.body);

      record.save(function(err) {
        if (err) res.send(err);

        res.json(record);
      });

    });
  })

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

      res.header('Cache-Control', 'public, max-age=' + ONE_MONTH);
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

router.route('/vehicles/:vehicleId/reminders/:id')
  .put(function(req, res) {
    Reminder.findById(req.params.id, function(err, reminder) {
      if (err) res.send(err);
      _.merge(reminder, req.body);

      reminder.save(function(err) {
        if (err) res.send(err);
        res.json(reminder);
      });

    });
  })

  .delete(function(req, res) {
    Reminder.remove({
      _id: req.params.id
    }, function(err, record) {
      if (err) res.send(err);
      res.json(record);
    });
  });

module.exports = router;
