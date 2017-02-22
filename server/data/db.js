const mongoose = require('mongoose');
const connect_uri = process.env.CONNECT_URI || JSON.parse(process.env.VCAP_SERVICES).mlab[0].credentials.uri
const ServiceInstanceSchema = require('./ServiceInstanceSchema').ServiceInstanceSchema;
const debug = require('debug')('discoverer:db')

mongoose.Promise = global.Promise;

mongoose.connect(connect_uri);

const conn = mongoose.connection;

conn.on('error', debug);

conn.on('open', () => debug("connection established"))

module.exports = conn;