const ip = require('ip');
const os = require('os');

/**
 * the discoverer server link
 */
const server_url = process.env.C_SERVER_URL || "http://127.0.0.1:3999";

/**
 * this service name
 */
const service_name = process.env.C_SERVICE_NAME || os.hostname();

/**
 * the url can be accessed from outside
 */
const instance_url
  = process.env.C_INSTANCE_URL
  || (process.env.VCAP_SERVICES && JSON.parse(process.env.VCAP_APPLICATION).uris[0])
  || `http://${ip.address()}`;

/**
 * this instance id
 */
const instance_id = process.env.C_INSTANCE_ID;

/**
 * renew info interval
 */
const heart_break_interval = parseInt(process.env.C_HEART_BREAK_INTERVAL) || 15

module.exports = {
  server_url,
  instance_id,
  instance_url,
  service_name,
  heart_break_interval
}