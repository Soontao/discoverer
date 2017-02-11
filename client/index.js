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
    this._serverUrl = serverUrl;
    this._serviceName = serviceName;
    this._instanceIp = instanceIp;
    this._instancePort = instancePort;
    this._instanceId = instanceId;
    this._heartBreakInterval = heartBreakInterval;
    this._servicesCache = {};
    this.REGISTE_URL = `${this._serverUrl}/discoverer/registe`;
    this.RENEW_URL = `${this._serverUrl}/discoverer/renew`;
    this.UNREGISTE_URL = `${this._serverUrl}/discoverer/unregiste`;
    this.CLIENTS_URL = `${this._serverUrl}/discoverer/clients`;
  }

  _startHeartBreak() {
    this.heartbreak = setInterval(this._renew.bind(this), this._heartBreakInterval * 1000);
    debug(`instance ${this._instanceId} heartbreak started`)
  }

  _stopHeartBreak() {
    if (this.heartbreak) {
      clearInterval(this.heartbreak);
      debug(`instance ${this._instanceId} heartbreak stoped`)
    }
  }

  getThisClientInfo() {
    return {
      serviceName: this._serviceName,
      instancePort: this._instancePort,
      instanceIp: this._instanceIp,
      instanceId: this._instanceId
    }
  }


  /**
   * Get a specific service instances, or get all serivices
   * 
   * @param {any} [serviceName=undefined]
   * @returns
   * 
   * @memberOf DiscovererClient
   */
  getServiceInfo(serviceName = undefined) {
    return serviceName ? this._cacheServicesInstances()[serviceName] : this._cacheServicesInstances();
  }

  /**
   * cache or get cached servicesInstances
   * 
   * @param {Object} [servicesInstances=undefined]
   * @returns
   * 
   * @memberOf DiscovererClient
   */
  _cacheServicesInstances(servicesInstances = undefined) {
    this._servicesCache = servicesInstances || this._servicesCache;
    return this._servicesCache
  }

  _registe(done) {
    const option = {
      url: this.REGISTE_URL,
      method: "POST",
      json: true,
      body: this.getThisClientInfo()
    }
    request(option, (err, req, body) => {
      if (err) throw err;
      // refresh intanceId
      this._instanceId = body.registed.instanceId;
      this._instanceIp = body.registed.instanceIp;
      this._startHeartBreak();
      if (done) done(body.registed);
    })
  }

  _unregiste(done) {
    const option = {
      url: this.UNREGISTE_URL,
      method: "DELETE",
      json: true,
      body: this.getThisClientInfo()
    }
    request(option, (err, req, body) => {
      if (err) throw err
      if (done) done(body.unregisted);
    })

  }

  _clients(done) {
    const option = {
      url: this.CLIENTS_URL,
      method: "GET",
      json: true,
      body: this.getThisClientInfo()
    }
    request(option, (err, req, body) => {
      if (err) throw err;
      if (done) done(this._cacheServicesInstances(body.services));
    })
  }

  _renew(done) {
    const option = {
      url: this.RENEW_URL,
      method: "PUT",
      json: true,
      body: this.getThisClientInfo()
    }
    request(option, (err, req, body) => {
      if (err) throw err;
      if (done) done(body.renewed);
    })
  }

}

module.exports = DiscovererClient;