const mongoose = require('mongoose');
const uuid = require('uuid');
mongoose.Promise = global.Promise;

function dateAfterSeconds(secNum) {
  secNum = secNum || 45;
  return new Date((new Date).getTime() + secNum * 1000);
}

const ServiceInstanceSchema = mongoose.Schema({
  instanceIp: String,
  serviceName: String,
  instancePort: {
    type: Number,
    default: 80
  },
  expires: {
    type: Date,
    default: dateAfterSeconds
  },
  instanceId: {
    type: String,
    default: uuid
  }
});

ServiceInstanceSchema.methods.renew_expires = function(sec) {
  this.expires = dateAfterSeconds(sec);
}

const ServiceInstanceModel = mongoose.model('ServiceInstance', ServiceInstanceSchema);

module.exports = {
  ServiceInstanceSchema,
  ServiceInstanceModel
}