var _ = require('lodash');
var express = require('express');
var router = express.Router();

var passwordless = require('passwordless');

var User = require('../models/user');

var ONE_MONTH = 2629800000;

router.route('/session')
  .post(
    passwordless.requestToken(
      function(email, delivery, callback) {
        User.findOne({ email: email }, function(error, user) {

          if (error) {
            console.log(error);
            callback(error.toString());

          } else if (user) {
            console.log(user);
            callback(null, user.id);

          } else {
            user = new User();
            user.email = email;
            user.save(function(error, user) {
              if (error) {
                callback(error.toString());
              } else {
                callback(null, user.id);
              }
            });
          }
        });
      }
    ),
    function(req, res) {
      res.sendStatus(200);
    }
  );

router.route('/session/:uid')
  .get(passwordless.restricted(), function(req, res) {
    User.findById(req.user, function(err, user) {
      if (err) res.send(err);

      res.header('Cache-Control', 'public, max-age=' + ONE_MONTH);
      res.json(user);
    });
  })

  .delete(passwordless.logout(), function(req, res) {
    res.sendStatus(200);
  });

module.exports = router;
