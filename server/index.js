var _              = require('lodash');
var express        = require('express');
var bodyParser     = require('body-parser');
var expressSession = require('express-session');
var mongoose       = require('mongoose');
var passwordless   = require('passwordless');
var MongoStore     = require('passwordless-mongostore');
var email          = require("emailjs");

var vehicleRoutes = require('./app/routes/vehicle');
var sessionRoutes = require('./app/routes/session');
var app           = express();

var smtpOptions = {
  user: process.env.SMTP_EMAIL,
  password: process.env.SMTP_PASSWORD,
  host: 'smtp.gmail.com',
  ssl: true
};
var smtpServer = email.server.connect(smtpOptions);

var mongoDbPath = 'mongodb://localhost/service-records';
mongoose.connect(mongoDbPath);

var host = process.env.DELIVERY_HOST || 'http://localhost:8080/';

passwordless.init(new MongoStore(mongoDbPath), {
  allowTokenReuse: true
});
passwordless.addDelivery(
  function(tokenToSend, uidToSend, recipient, callback) {
      // Send out token
      smtpServer.send({
         text: 'Hello '+ recipient +'!\nYou can now access your vehicles here: ' +
              host + '#login/' +
              encodeURIComponent(uidToSend) + '/' +
              tokenToSend,
         from:    smtpOptions.user,
         to:      recipient,
         subject: 'Login to ' + host
      }, function(err, message) {
          if (err) console.log(err);
          callback(err);
      });
  }, { ttl: 1000*60*10 });

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
