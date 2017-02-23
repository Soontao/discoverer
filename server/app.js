const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan-debug');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./data/db');
const config = require('./lib/config')

// routes
const homeRouter = require('./routes/root');
const discovererRouter = require('./routes/discoverer');

// new express instance
const app = express();

// pretty json
app.set('json spaces', 2)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set proxy
app.set('trust proxy', true)

if (config.use_basic_auth)
  app.use(require('./lib/auth'))

app.locals.db = db;

app.use(logger('discoverer:server', 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// some meta info
app.use('/', homeRouter);
app.use('/discoverer', discovererRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  // undefined field will removed before send to client
  res.json({
    status: err.status,
    error: err.message,
    validate_err: err.errors
  });
});


module.exports = app;