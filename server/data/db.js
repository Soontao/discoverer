const mongoose = require('mongoose');
const config = require('../lib/config');
const connect_uri = config.mongo_connect_uri;
const ServiceInstanceSchema = require('./ServiceInstanceSchema').ServiceInstanceSchema;
const debug = require('debug')('discoverer:db')

require('./check_expired');

mongoose.Promise = global.Promise;

mongoose.connect(connect_uri);

const conn = mongoose.connection;

conn.on('error', debug);

conn.on('open', () => debug("connection established"))

module.exports = conn;