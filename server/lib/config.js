const rand_str = require("randomstring");

const vcap_services = process.env.VCAP_SERVICES && JSON.parse(process.env.VCAP_SERVICES);


const use_auth = process.env.USE_AUTH == "true";


const auth_username = process.env.AUTH_USER || rand_str.generate(8);


const auth_password = process.env.AUTH_PASS || rand_str.generate(8);

/**
 * mongodb connect uri
 */
const mongo_connect_uri =
  process.env.CONNECT_URI
  // or
  ||
  (vcap_services && vcap_services.mlab && vcap_services.mlab[0].credentials.uri)
  // or
  ||
  "mongodb://localhost/discoverer";

const server_port = process.env.PORT || 3999;

const server_listen_host = process.env.LISTEN_HOST || '0.0.0.0'

const expired_check_interval = process.env.CHECK_INTERVAL || 2;

module.exports = {
  use_auth,
  auth_password,
  auth_username,
  mongo_connect_uri,
  server_port,
  server_listen_host,
  expired_check_interval
}