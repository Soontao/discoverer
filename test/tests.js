const assert = require("assert");
const DiscovererClient = require('../client');
const DiscovererServer = require('../server');

describe('discoverer client test', function () {
  // disable timeout
  this.timeout(0);
  const server = new DiscovererServer();
  const client = new DiscovererClient();

  it('start discoverer server', function (done) {
    server.start(() => {
      done();
    });
  })


  it('should registe success', function (done) {
    client.registe(function (body) {
      assert.ok(body.registed.instanceId)
      done();
    });
  })

  it('should get itself', function (done) {
    client.clients(function (body) {
      assert.ok(body.services[client.serviceName][client.instanceId])
      done();
    })
  })

  it('should renew this instance', function (done) {
    client.renew(body => {
      assert.ok(body.renewed);
      done();
    })
  })

  it('should unregiste this instance', function (done) {
    client.unregiste(body => {
      assert.ok(body.unregisted);
      done();
    })
  })

  it('should stop the discoverer server', function () {
    server.stop();
  })


})

