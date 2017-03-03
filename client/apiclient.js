const rp = require('request-promise');


/**
 * API Client
 * 
 * 在service instances中轮训
 * 
 * @class ApiClient
 */
class ApiClient {

  /**
   * Creates an instance of ApiClient.
   * @param {any} service_name 服务名
   * @param {DiscovererClient} discover_client 
   * 
   * @memberOf ApiClient
   */
  constructor(service_name, discover_client) {
    this._discover_client = discover_client;
    this._service_name = service_name;
    this._instance_index = 0;
  }

  set_instances(instances) {
    this._instances = instances;
    this._instances_num = instances.length;
  }

  get_instances() {
    if (this._instances) {
      return new Promise((resolve, reject) => {
        resolve(this._instances);
      });
    } else {
      return this.refresh_instances()
    }
  }

  refresh_instances() {
    return this._discover_client
      ._clients({
        service_name: this._service_name
      })
      .then(instances => {
        this.set_instances(instances)
        return instances;
      })
      .catch(err => {
        if (err) throw err;
      })
  }

  /**
   * process error
   * 
   * @param {Error} err an error
   * 
   * @memberOf DiscovererClient
   */
  err_process(err) {
    /**
     * if error occurs
     * 
     * apiclient willremove local cache
     * 
     * apiclient should notify server refresh instances
     * 
     * so server should add a new api
     * 
     */
  }



  request(path, option) {
    return this
      .get_instances()
      .then(instances => {
        const currnet_instance = instances[this._instance_index % this._instances_num];
        const uri = `${currnet_instance.instance_url}/${path}`;
        this._instance_index += 1;
        return rp(uri, option)
          .catch(err => {
            if (err) throw err
          });
      })


  }
}

module.exports = ApiClient