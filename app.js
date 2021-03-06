var express = require('express');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');
var uid = require('uid');
var fs      = require('fs');
var routes = require('./routes/index');
var extract = require('./routes/extract');
var download = require('./routes/download');

var app = express();
global.__path = __dirname + "/public/result/";
//create result folder if already not created
if(!fs.existsSync(__path)) {
fs.mkdirSync(__path);
}

var sessionKey = uid(10);
app.use(cookieParser(sessionKey));
app.use(session({
secret : sessionKey,
resave:true,
saveUninitialized :true
}));
global.__outputPath = __path+sessionKey+"/";

 fs.mkdirSync(global.__outputPath);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(multer({
    dest: global.__outputPath
}))
// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/extract', extract);
app.use('/download', download);
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
