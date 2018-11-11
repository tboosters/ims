let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let routingRouter = require('./routes/routing');
let incidentRouter = require('./routes/incident');

let resBuilder = require('./utilities/res-builder');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Utilities and console logging
app.use(function (req, res, next) {
    req.resBuilder = resBuilder;
    console.log("Receives a request");
    next();
});

// Routes
app.use('/', indexRouter);
app.use('/route', routingRouter);
app.use('/incident', incidentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // render the error json
    res.status(err.status || 500);
    let msg = err.message;
    let stackTrace = req.app.get('env') === 'development' ? err.stack : {};
    // use resBuilder in app-context
    // res.json(resBuilder.build(msg, stackTrace));
    res.render('error', { error: err });
});

app.listen(3000, function () {
    console.log('IMS listening on port 3000.');
});

module.exports = app;
