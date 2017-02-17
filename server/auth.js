const debug = require('debug')('discoverer:app')

const passport = require('passport');
const rand_str = require("randomstring");
const BasicStrategy = require('passport-http').BasicStrategy;

const rand_username = rand_str.generate(8);
const rand_password = rand_str.generate(8);

debug(`generated use http basic auth, password:${rand_username},password:${rand_password}`);

passport.use(new BasicStrategy((username, password, done) => {
  if (username == rand_username && password == rand_password) done(null, true)
  else done(null, false)
}))

module.exports = passport;