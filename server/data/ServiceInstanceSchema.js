const mongoose = require('mongoose');
const uuid = require('uuid');
mongoose.Promise = global.Promise;

function dateAfterSeconds(secNum) {
  secNum = secNum || 45;
  return new Date((new Date).getTime() + secNum * 1000);
}

const ServiceInstanceSchema = mongoose.Schema({
  instance_url: {
    type: String,
    required: [true, "instance_url must be defined"]
  },
  service_name: {
    type: String,
    required: [true, "service_name must be defined"]
  },
  expires: {
    type: Date,
    default: dateAfterSeconds
  },
  instance_id: {
    type: String,
    default: uuid
  }
});

ServiceInstanceSchema.methods.renew_expires = function (sec) {
  this.expires = dateAfterSeconds(sec);
}

const ServiceInstanceModel = mongoose.model('Service_Instance', ServiceInstanceSchema);

module.exports = {
  ServiceInstanceSchema,
  ServiceInstanceModel
}