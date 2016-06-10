var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var routes = require('./routes/index');
var admin = require('./routes/admin');
var metrics = require('./routes/metrics');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/admin', admin);
app.use('/metrics', metrics);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var elastic = require('./elasticsearch');
 
var j = schedule.scheduleJob('*/10 * * * * *', function(){
  var url = 'http://192.168.99.100:8081/job/test-shit/lastSuccessfulBuild/api/json?pretty=true';

  console.log('scheduleJobe very 10 second');

  request(url, function(error, response, body){
    if(!error){
      var json = {
        project: "",
        component: "",
        name: "",
        build: "",
        duration: "",
        timestamp: ""
      };
    obj = JSON.parse(body);
    json.project = obj.displayName;
    json.component = 'test';
    json.name = obj.displayName;
    json.build = obj.number;
    json.duration = obj.duration;
    json.timestamp = (new  Date(obj.timestamp)).toISOString();

    console.log(json);

      elastic.addMetrics(json).then(function (result) {
        console.log(result);
      });
    }
  });
});


module.exports = app;