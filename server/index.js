
var app = require('./app');
var debug = require('debug')('discoverer:server');
var http = require('http');


class DiscovererServer {
  constructor(host = '0.0.0.0', port = 3000) {
    this.host = host;
    this.port = port;
    app.set('port', this.normalizePort(process.env.PORT || '3000'));
    this.server = http.createServer(app);
    this.server.on('error', this.onError);
    this.server.on('listening', this.onListening);
  }

  start(done) {
    this.server.listen(this.port, this.host, function () {
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

    var bind = typeof port === 'string' ?
      'Pipe ' + this.port :
      'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  onListening() {
    var addr = this.address();
    var bind = typeof addr === 'string' ?
      'pipe ' + addr :
      'port ' + addr.port;
    console.log(`Listen on port :${addr.port}, in ${app.settings.env}`)
  }


}



if (require.main === module) {
  const server = new DiscovererServer();
  server.start();
}

module.exports = DiscovererServer;