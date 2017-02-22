#!/usr/bin/env node

var app = require('./app');
var debug = require('debug')('discoverer:server');
var http = require('http');

/**
 * 需要为每一个Discoverer节点生成storage
 * 
 */
class DiscovererServer {

  constructor(host = '0.0.0.0', port = parseInt(process.env.PORT) || 3999) {
    this.host = host;
    this.port = port;
    app.set('port', port);
    this.server = http.createServer(app);
    this.server.on('error', this.onError);
    this.server.on('listening', this.onListening);
  }

  start(done) {
    this.server.listen(this.port, this.host, function() {
      done && done();
    });
  }

  stop() {
    this.server.close();
  }

  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    console.error(error.code);
  }

  onListening() {
    const addr = this.address();
    debug(`Listen on port :${addr.port}, in ${app.settings.env}`)
  }


}



if (require.main === module) {
  const server = new DiscovererServer();
  server.start();
}

module.exports = DiscovererServer;