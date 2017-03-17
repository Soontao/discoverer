const logger = require('./logger')("auth");

const passport = require('passport');
const rand_str = require("randomstring");
const BasicStrategy = require('passport-http').BasicStrategy;
const DigestStrategy = require('passport-http').DigestStrategy;
const config = require('./config');

const auth_username = config.auth_username;
const auth_password = config.auth_password;

logger(`use http degist auth: username:${auth_username}, password:${auth_password}`);

passport.use(new DigestStrategy(
  { qop: 'auth' },
  (username, done) => {
    if (username == auth_username)
      return done(null, auth_username, auth_password)
    else
      return done(null, false)
  },
  (params, done) => {
    done(null, true)
  }

))

module.exports = passport.authenticate('digest', { session: false });