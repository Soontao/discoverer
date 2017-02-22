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
  constructor(server_url = 'http://127.0.0.1:3999', service_name = 'nullService', instance_url = undefined, instancePort = 80, instance_id = undefined, heartBreakInterval = 15) {
    this._server_url = server_url;
    this._service_name = service_name;
    this._instance_url = instance_url;
    this._instance_id = instance_id;
    this._heartBreakInterval = heartBreakInterval;
    this._servicesCache = {};
    this.REGISTE_URL = `${this._server_url}/discoverer/registe`;
    this.RENEW_URL = `${this._server_url}/discoverer/renew`;
    this.UNREGISTE_URL = `${this._server_url}/discoverer/unregiste`;
    this.CLIENTS_URL = `${this._server_url}/discoverer/clients`;
    this.SERVICES_URL = `${this._server_url}/discoverer/services`;
  }

  _startHeartBreak() {
    this.heartbreak = setInterval(this._renew.bind(this), this._heartBreakInterval * 1000);
    debug(`instance ${this._instance_id} heartbreak started`)
  }

  _stopHeartBreak() {
    if (this.heartbreak) {
      clearInterval(this.heartbreak);
      debug(`instance ${this._instance_id} heartbreak stoped`)
    }
  }

  getThisClientInfo() {
    return {
      service_name: this._service_name,
      instance_url: this._instance_url,
      instance_id: this._instance_id
    }
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
      this._instance_id = body.registed.instance_id;
      this._instance_url = body.registed.instance_url;
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

  _clients(opts, done) {
    const option = {
      url: this.CLIENTS_URL,
      method: "GET",
      json: true,
      body: this.getThisClientInfo()
    }
    if (opts) option.qs = opts;
    request(option, (err, req, body) => {
      if (err) throw err;
      if (done) done(body.instances);
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
      this._instance_id = body.renewed.instance_id;
      this._instance_url = body.renewed.instance_url;
      done && done(body.renewed);
    })
  }

}

module.exports = DiscovererClient;