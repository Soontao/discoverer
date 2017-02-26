#!/usr/bin/env node

// discoverer client
const request = require('request');
const debug = require('debug')('discoverer:client');
const config = require('./config');
const rp = require('request-promise');
const ApiClient = require('./apiclient');


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
  constructor(server_url, service_name, instance_url, instance_id, heartBreakInterval = 15) {
    this._server_url = server_url || config.server_url;
    this._service_name = service_name || config.service_name;
    this._instance_url = instance_url || config.instance_url;
    this._instance_id = instance_id || config.instance_id;
    this._heartBreakInterval = heartBreakInterval;
    this._server_prefix = '/discoverer'
    this.REGISTE_URL = `${this._server_url}${this._server_prefix}/registe`;
    this.RENEW_URL = `${this._server_url}${this._server_prefix}/renew`;
    this.UNREGISTE_URL = `${this._server_url}${this._server_prefix}/unregiste`;
    this.CLIENTS_URL = `${this._server_url}${this._server_prefix}/clients`;
    this.SERVICES_URL = `${this._server_url}${this._server_prefix}/services`;
    this.cache = new Map();
    if (!this._service_name || !this._instance_url)
      throw new Error("should give out the service_name and this instance url")
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
    return rp({
      url: this.REGISTE_URL,
      method: "POST",
      json: true,
      body: this.getThisClientInfo()
    }).then(body => {
      this._instance_id = body.registed.instance_id;
      this._instance_url = body.registed.instance_url;
      this._startHeartBreak();
      debug(`registe with info ${JSON.stringify(body, '', ' ')}`)
      return body.registed;
    }).catch(err => {
      if (err) throw err;
    })
  }

  _unregiste() {
    return rp({
        url: this.UNREGISTE_URL,
        method: "DELETE",
        json: true,
        body: this.getThisClientInfo()
      })
      .then(body => body.unregisted)
      .catch(err => {
        if (err) throw err;
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

    return rp(option)
      .then(body => body.instances)
      .catch(err => {
        if (err) throw err;
      })
  }

  create_api_of(service_name) {
    const api_client = new ApiClient(service_name, this);
    api_client.refresh_instances();
    return api_client;
  }

  _renew() {
    const option = {
      url: this.RENEW_URL,
      method: "PUT",
      json: true,
      body: this.getThisClientInfo()
    }
    return rp(option)
      .then(body => {
        this._instance_id = body.renewed.instance_id;
        this._instance_url = body.renewed.instance_url;
        return body.renewed
      })
      .catch(err => {
        if (err) throw err;
      })
  }

  stop() {
    this._stopHeartBreak();
  }

}


if (require.main === module) {
  try {

    const client = new DiscovererClient();

    client._registe();

    process.on('SIGINT', function () {
      debug('Ctrl-C...');
      process.exit(0);
    });

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}



module.exports = DiscovererClient;