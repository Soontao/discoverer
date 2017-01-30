const services = {};

class ServiceInfo {

  constructor(object) {
    if (object && object.serviceName && object.instanceIp && object.instancePort) {
      this.instanceIp = object.instanceIp;
      this.serviceName = object.serviceName;
      this.instancePort = object.instancePort;
    } else
      throw Error("params not complete")
    if (object.serviceId)
      this.serviceId = object.serviceId
    else
      this.serviceId = `${object.instanceIp}:${object.instancePort}`
  }
}

function addInstance(serviceInfo) {
  s = new ServiceInfo(serviceInfo);
  if (!services[s.serviceName])
    services[s.serviceName] = {};
  services[s.serviceName][s.serviceId] = s;
}

function getInstances() {
  return services;
}

module.exports = {
  addInstance,
  getInstances
}