const ServiceInstanceModel = require('./ServiceInstanceSchema').ServiceInstanceModel;
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

const check_timer = setInterval(remove_expired, 2 * 1000);

module.exports = remove_expired;