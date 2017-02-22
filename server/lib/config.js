const rand_str = require("randomstring");

/**
 * 
 */
const use_basic_auth = process.env.USE_BASIC_AUTH == "true";

/**
 * 
 */
const http_basic_username = process.env.HTTP_BASIC_USERNAME || rand_str.generate(8);

/**
 * 
 */
const http_basic_password = process.env.HTTP_BASIC_PASSWORD || rand_str.generate(8);

/**
 * mongodb connect uri
 */
const mongo_connect_uri =
  process.env.CONNECT_URI ||
  (process.env.VCAP_SERVICES && JSON.parse(process.env.VCAP_SERVICES).mlab[0].credentials.uri);


module.exports = {
  use_basic_auth,
  http_basic_password,
  http_basic_username,
  mongo_connect_uri
}