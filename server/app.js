const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan-debug');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

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

if (process.env.BASIC_AUTH) {
  const auth = require('./auth');
  app.use(auth.authenticate('basic', { session: false }))
}
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
  res.json({
    status: err.status,
    error: err.message
  });
});


module.exports = app;