#!/usr/bin/env node

var logger = require('./lib/logger')("server");
var http = require('http');

/**
 * 需要为每一个Discoverer节点生成storage
 * 
 */
class DiscovererServer {

  constructor(host = '0.0.0.0', port = parseInt(process.env.PORT) || 3999) {
    this._host = host;
    this._port = port;
    this._app = require('./app');
    this._app.set('port', port);
    this._server = http.createServer(this._app);
    this._server.on('error', this.onError.bind(this));
    this._server.on('listening', this.onListening.bind(this));
  }

  start(done) {
    this._server.listen(this._port, this._host, function() {
      done && done();
    });
  }

  stop() {
    this._server.close();
  }

  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    console.error(error.code);
  }

  onListening() {
    const addr = this._server.address();
    logger(`Listen on port :${addr.port}, in ${this._app.settings.env}`)
  }


}



if (require.main === module) {
  const server = new DiscovererServer();
  server.start();
}

module.exports = DiscovererServer;