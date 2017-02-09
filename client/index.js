// discoverer client
const request = require('request');
const debug = require('debug')('discoverer:client');

/**
 * DiscovererClient
 * 
 * @class DiscovererClient
 */
class DiscovererClient {

  /**
   * Creates an instance of DiscovererClient.
   * 
   * @param {string} serverUrl Discoverer Server URL, Include server port
   * @param {string} serviceName The service name of this instance
   * @param {string} instanceIp
   * @param {string} instancePort
   * @param {string} instanceId
   * 
   * @memberOf DiscovererClient
   */
  constructor(serverUrl = 'http://127.0.0.1:3000', serviceName = 'nullService', instanceIp = undefined, instancePort = 80, instanceId = undefined, heartBreakInterval = 15) {
    this.serverUrl = serverUrl;
    this.serviceName = serviceName;
    this.instanceIp = instanceIp;
    this.instancePort = instancePort;
    this.instanceId = instanceId;
    this.heartBreakInterval = heartBreakInterval;
    this.REGISTE_URL = `${this.serverUrl}/discoverer/registe`;
    this.RENEW_URL = `${this.serverUrl}/discoverer/renew`;
    this.UNREGISTE_URL = `${this.serverUrl}/discoverer/unregiste`;
    this.CLIENTS_URL = `${this.serverUrl}/discoverer/clients`;
  }

  startHeartBreak() {
    this.heartbreak = setInterval(this.renew, this.heartBreakInterval * 1000);
    debug(`instance ${this.instanceId} heartbreak started`)
  }

  stopHeartBreak() {
    if (this.heartbreak) {
      clearInterval(this.heartbreak);
      debug(`instance ${this.instanceId} heartbreak stoped`)
    }
  }

  getThisServiceInstanceInfo() {
    return {
      serviceName: this.serviceName,
      instancePort: this.instancePort,
      instanceIp: this.instanceIp,
      instanceId: this.instanceId
    }
  }

  registe(done) {
    const option = {
      url: this.REGISTE_URL,
      method: "POST",
      json: true,
      body: this.getThisServiceInstanceInfo()
    }
    request(option, (err, req, body) => {
      if (err) throw err;
      // refresh intanceId
      this.instanceId = body.registed.instanceId;
      this.startHeartBreak();
      done(body);
    })
  }

  unregiste(done) {
    const option = {
      url: this.UNREGISTE_URL,
      method: "DELETE",
      json: true,
      body: this.getThisServiceInstanceInfo()
    }
    request(option, (err, req, body) => {
      if (err) throw err
      done(body);
    })

  }

  clients(done) {
    const option = {
      url: this.CLIENTS_URL,
      method: "GET",
      json: true,
      body: this.getThisServiceInstanceInfo()
    }
    request(option, (err, req, body) => {
      if (err) throw err;
      done(body);
    })
  }

  renew(done) {
    const option = {
      url: this.RENEW_URL,
      method: "PUT",
      json: true,
      body: this.getThisServiceInstanceInfo()
    }
    request(option, (err, req, body) => {
      if (err) throw err;
      done(body);
    })
  }

}

module.exports = DiscovererClient;