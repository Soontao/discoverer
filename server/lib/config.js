const rand_str = require("randomstring");

const vcap_services = process.env.VCAP_SERVICES && JSON.parse(process.env.VCAP_SERVICES);

/**
 * use http basic auth or not
 */
const use_basic_auth = process.env.USE_BASIC_AUTH == "true";

/**
 *  if use http basic auth, username is 
 */
const http_basic_username = process.env.HTTP_BASIC_USERNAME || rand_str.generate(8);

/** 
 * if use http basic auth, password is 
 */
const http_basic_password = process.env.HTTP_BASIC_PASSWORD || rand_str.generate(8);

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
  use_basic_auth,
  http_basic_password,
  http_basic_username,
  mongo_connect_uri,
  server_port,
  server_listen_host,
  expired_check_interval
}