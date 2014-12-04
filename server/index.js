var _              = require('lodash');
var express        = require('express');
var bodyParser     = require('body-parser');
var expressSession = require('express-session');
var mongoose       = require('mongoose');
var passwordless   = require('passwordless');
var MongoStore     = require('passwordless-mongostore');

var postmark = require("postmark")(process.env.POSTMARK_API_KEY);

var vehicleRoutes = require('./app/routes/vehicle');
var sessionRoutes = require('./app/routes/session');
var app           = express();

var mongoDbPath = process.env.MONGOLAB_URI || 'mongodb://localhost/service-records';
mongoose.connect(mongoDbPath);

var host = process.env.DELIVERY_HOST || 'localhost:8080';

passwordless.init(new MongoStore(mongoDbPath), {
  allowTokenReuse: true
});
passwordless.addDelivery(
  function(tokenToSend, uidToSend, recipient, callback) {
    postmark.send({
      "TextBody": 'Hello '+ recipient +'!\nYou can now access your vehicles here: ' +
        'http://' + host + '/#login/' +
        encodeURIComponent(uidToSend) + '/' +
        tokenToSend,
      "From": 'spanner@spanner.nicinabox.com',
      "To": recipient,
      "Subject": 'Login to Spanner'
    }, function(err, message) {
      if (err) console.log(err);
      callback(err);
    });
  }, {
    ttl: 1000 * 60 * 1440 * 30 // 30 days
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSession({
  secret: '42',
  saveUninitialized: true,
  resave: false
}));
app.use(express.static('public'));

// Passwordless middleware
app.use(passwordless.acceptToken());

app.use('/api', vehicleRoutes);
app.use('/', sessionRoutes);

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Magic happens on port ' + port);
