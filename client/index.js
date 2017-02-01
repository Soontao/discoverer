// discoverer client
const request = require('request');
const debug = require('debug')('discoverer:client');

/**
 * DiscovererClient
 * 
 * @class DiscovererClient
 */
class DiscovererClient {

  constructor(serverUrl, serviceName, instanceIp, instancePort, instanceId) {
    if (!serverUrl) // if Server Url not be defined, throw an error
      throw new Error("Discoverer Server URL must be specify")
    if (!serviceName) // if service name not be defined, throw an error
      throw new Error("Service Name must be defined")
    this.serverUrl = serverUrl;
    this.serviceName = serviceName;
    this.instanceIp = instanceIp;
    this.instancePort = instancePort;
    this.instanceId = instanceId || `${this.instanceIp}:${this.instancePort}`;
    this.REGISTE_URL = `${this.serverUrl}/discoverer/registe`;
    this.RENEW_URL = `${this.serverUrl}/discoverer/renew`;
    this.UNREGISTE_URL = `${this.serverUrl}/discoverer/unregiste`;
    this.CLIENTS_URL = `${this.serverUrl}/discoverer/clients`;
  }

  getThisServiceInstanceInfo() {
    return {
      serviceName: this.serviceName,
      instancePort: this.instancePort,
      instanceIp: this.instanceIp,
      instanceId: this.instanceId
    }
  }

  registe() {
    const option = {
      url: this.REGISTE_URL,
      method: "POST",
      json: true,
      body: JSON.stringify(this.getThisServiceInstanceInfo())
    }
    request(option, (err, req, body) => {
      if (err) throw err;
    })
  }

  unregiste() {

  }

  clients() {

  }

  renew() {

  }

}

module.exports = DiscovererClient;