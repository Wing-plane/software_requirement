var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//页面路由
var login = require('./routes/login');
app.use('/',login);
app.use('/login',login);

var adminHome = require('./routes/adminHome');
app.use('/adminHome',adminHome);

//queryUser
var queryUser = require('./routes/queryUser');
app.use('/queryUser',queryUser);

//auditUser
var auditUser = require('./routes/auditUser');
app.use('/auditUser',auditUser);

//queryProduct
var queryProduct = require('./routes/queryProduct');
app.use('/queryProduct',queryProduct);

//queryRecord
var queryRecord = require('./routes/queryRecord');
app.use('/queryRecord',queryRecord);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
