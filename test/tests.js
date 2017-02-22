const assert = require("assert");
const DiscovererClient = require('../client');
const DiscovererServer = require('../server');
const request = require('request');
const uuid = require('uuid');

describe('#discoverer server test', function() {

  this.timeout(0);

  const listenHost = 'localhost';

  const listenPort = 3000;

  const server = new DiscovererServer(listenHost, listenPort);

  const serverUrl = `http://${listenHost}:${listenPort}`

  const discovererUrl = `http://${listenHost}:${listenPort}/discoverer`

  let testService = {
    service_name: `testService-${uuid()}`,
    instance_id: uuid()
  }

  it('start test server', function(done) {
    server.start(() => {
      done();
    });
  })

  it('should throw 404 error', function(done) {
    request.get(`${discovererUrl}/not-exist/${uuid()}`, {
      json: true
    }, function(err, req, body) {
      if (err) throw err;
      assert.ok(body.status = 404);
      done();
    })
  })

  it('should get index page', function(done) {
    request.get(`${serverUrl}`, { json: true }, function(err, req, body) {
      if (err) throw err;
      assert.ok(body['discover_api'])
      done();
    })
  })

  it('should throw error when not give out the service_name', done => {
    request.post(`${discovererUrl}/registe`, { json: true, body: {} }, (err, req, body) => {
      assert.ifError(err);
      assert.ok(body.error);
      done();
    })
  })


  it('should registe a client', function(done) {
    request.post(`${discovererUrl}/registe`, { json: true, body: testService }, function(err, req, body) {
      if (err) throw err;
      assert.ok(body);
      assert.equal(body.registed.service_name, testService.service_name)
      done();
    })
  })

  it('get services type', done => {
    request.get(`${discovererUrl}/services`, { json: true }, (err, req, body) => {
      if (err) throw err;
      assert.ok(body);
      assert.ok(body.services);
      done();
    })
  })

  it('should see itself', function(done) {
    request.get(`${discovererUrl}/clients`, { json: true }, function(err, req, body) {
      if (err) throw err;
      assert.ok(body.instances);
      done();
    })
  })

  it('should check expired and remove expired instances', function(done) {
    request.get(`${discovererUrl}/check_expired`, { json: true }, function(err, req, body) {
      if (err) throw err;
      assert.ok(body.removedCount >= 0);
      done();
    })
  })

  it('should stop the discoverer server', function() {
    server.stop();
  })

})


describe('#discoverer client test', function() {
  // disable timeout
  this.timeout(0);
  const server = new DiscovererServer();
  const client = new DiscovererClient();

  it('start discoverer server', function(done) {
    server.start(() => {
      done();
    });
  })


  it('should registe success', function(done) {
    client._registe(function(registed) {
      assert.ok(registed.instance_id)
      assert.ok(client.heartbreak)
      done();
    });
  })

  it('should get itself', function(done) {
    client._clients(client.getThisClientInfo(), function(instance) {
      assert.ok(instance)
      done();
    })
  })

  it('should renew this instance', function(done) {
    client._renew(renewed => {
      assert.ok(renewed.instance_id);
      done();
    })
  })

  it('should unregiste this instance', function(done) {
    client._unregiste(unregisted => {
      assert.ok(unregisted);
      done();
    })
  })

  it('stop heartBreak', function() {
    client._stopHeartBreak()
  })

  it('should stop the discoverer server', function() {
    server.stop();
  })


})