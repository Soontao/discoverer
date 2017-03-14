const ip = require('ip');
const os = require('os');

const vcap_application = process.env.VCAP_APPLICATION && JSON.parse(process.env.VCAP_APPLICATION)

/**
 * the discoverer server link
 */
const server_url = process.env.C_SERVER_URL || "http://127.0.0.1:3999";

/**
 * this service name
 */
const service_name = process.env.C_SERVICE_NAME ||
  (vcap_application && vcap_application.application_name) ||
  os.hostname();

/**
 * the url can be accessed from outside
 */
const instance_url = process.env.C_INSTANCE_URL ||
  (vcap_application && `https://${vcap_application.uris[0]}`) ||
  `http://${ip.address()}`;

/**
 * this instance id
 */
const instance_id = process.env.C_INSTANCE_ID;

/**
 * renew info interval
 */
const heart_break_interval = parseInt(process.env.C_HEART_BREAK_INTERVAL) || 15;

/**
 * if it true, it will not regite anyway
 */
const no_registe = process.env.C_NO_REGISTE == "true";

const auth_username = process.env.C_AUTH_USER || undefined;

const auth_password = process.env.C_AUTH_PASS || undefined;

module.exports = {
  server_url,
  instance_id,
  instance_url,
  service_name,
  heart_break_interval,
  no_registe,
  auth_password,
  auth_username
}