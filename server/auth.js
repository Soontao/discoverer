const debug = require('debug')('discoverer:app')

const passport = require('passport');
const rand_str = require("randomstring");
const BasicStrategy = require('passport-http').BasicStrategy;

const http_basic_username = process.env.HTTP_BASIC_USERNAME || rand_str.generate(8);
const http_basic_password = process.env.HTTP_BASIC_PASSWORD || rand_str.generate(8);

debug(`http basic auth: username:${http_basic_username}, password:${http_basic_password}`);

passport.use(new BasicStrategy((username, password, done) => {
  if (username == http_basic_username && password == http_basic_password) done(null, true)
  else done(null, false)
}))

module.exports = passport.authenticate('basic', { session: false });