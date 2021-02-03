var express = require('express');
var app = express();
var db = require('./db');
global.__root   = __dirname + '/'; 
global.async   = require("async")
global.logger = require('./loggers/logger')
global.httpLogger = require('./loggers/httpLogger')
const {
  logError,
  logErrorMiddleware,
  returnError,
  isTrustedError
} = require('./errors/errorHandler')

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

var adminController = require(__root + 'app_module/adminPanel/adminController');
app.use('/api/admin', adminController);


module.exports = app;