const debug = require('debug');

module.exports = (module_name) => debug(`discoverer:${module_name}`);