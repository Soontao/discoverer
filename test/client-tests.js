const assert = require("assert");
const DiscovererClient = require('../client');
const DiscovererServer = require('../server');
const request = require('request');
const uuid = require('uuid');

describe('#discoverer client test', function () {
  // disable timeout
  this.timeout(0);
  const server = new DiscovererServer();
  const client = new DiscovererClient(`http://127.0.0.1:${server._port}`, 'new service', 'http://localhost:74319');

  it('start discoverer server', function (done) {
    server.start(() => {
      done();
    });
  })


  it('should registe success', function (done) {
    client._registe()
      .then(registed => {
        assert.ok(registed.instance_id)
        assert.ok(client.heartbreak)
        done();
      })
      .catch(err => {
        throw err;
      })
  })

  it('should get itself', function (done) {
    client._clients()
      .then(instance => {
        assert.ok(instance)
        done();
      })
      .catch(err => {
        throw err;
      })
  })

  it('should renew this instance', function (done) {
    client._renew()
      .then(renewed => {
        assert.ok(renewed)
        done();
      })
      .catch(err => {
        throw err;
      })
  })

  it('should unregiste this instance', function (done) {
    client._unregiste()
      .then(unregisted => {
        assert.ok(unregisted);
        done();
      })
      .catch(err => {
        throw err;
      })
  })

  it('stop heartBreak', function () {
    client._stopHeartBreak()
  })

  it('should stop the discoverer server', function () {
    server.stop();
  })


})