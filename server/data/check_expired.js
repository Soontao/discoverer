const ServiceInstanceModel = require('./ServiceInstanceSchema').ServiceInstanceModel;
const config = require('../lib/config');
const logger = require("../lib/logger")("remove_expired")

const remove_expired = () => {
  return ServiceInstanceModel
    .find({ expires: { $lte: new Date() } })
    .then(expired_instances => Promise.all(expired_instances.map(instance => instance.remove())))
    .then(removed => {
      if (removed && removed.length > 0)
        logger(`instance ${removed.length}`)
      return removed;
    })
}

const check_timer = setInterval(remove_expired, config.expired_check_interval * 1000);

logger(`start to check expired instance each ${config.expired_check_interval} seconds`)

module.exports = { remove_expired, check_timer };