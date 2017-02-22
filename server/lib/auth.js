const logger = require('./logger')("auth");

const passport = require('passport');
const rand_str = require("randomstring");
const BasicStrategy = require('passport-http').BasicStrategy;
const config = require('./config');

const http_basic_username = config.http_basic_username;
const http_basic_password = config.http_basic_password;

logger(`use http basic auth: username:${http_basic_username}, password:${http_basic_password}`);

passport.use(new BasicStrategy((username, password, done) => {
  if (username == http_basic_username && password == http_basic_password) done(null, true)
  else done(null, false)
}))

module.exports = passport.authenticate('basic', { session: false });