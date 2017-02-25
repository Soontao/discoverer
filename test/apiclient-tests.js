const assert = require("assert");
const DiscovererClient = require('../client');
const DiscovererServer = require('../server');
const ApiClient = require('../client/apiclient');
const http = require('http');
const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');

describe("#ApiClient Tests", function () {

  this.timeout(0);

  const provider_server_port = 7893;

  const provider_server_url = `http://localhost:${provider_server_port}`;

  const test_service_name = "add_sum_service";

  const request_json_body = {
    json: true,
    body: {
      a: 1,
      b: 3
    }
  }

  const server = new DiscovererServer();
  const provider_discover_client = new DiscovererClient(undefined, test_service_name, provider_server_url);
  const consumer_discover_client = new DiscovererClient()

  before(done => {
    server.start(() => {
      done();
    })
  });

  const add_sum_service_app =
    express()
    .use(bodyParser.json())
    .use(function (req, res, next) {
      res.json({
        result: req.body.a + req.body.b
      });
    });

  const add_sum_service_server =
    http
    .createServer(add_sum_service_app)
    .listen(provider_server_port);

  it("should registe service provider", function (done) {
    provider_discover_client._registe().then(registed => {
      assert.ok(registed.service_name, test_service_name);
      done();
    })
  })

  it("direct test service is ok", function (done) {
    rp.post(provider_server_url, request_json_body)
      .then(body => {
        assert.equal(parseInt(body.result), 4)
        done()
      })
      .catch(err => {
        throw err;
      })
  });

  it('test service with ApiClient (manual)', function (done) {
    const api = new ApiClient(test_service_name, consumer_discover_client);
    api.request("/", request_json_body)
      .then(body => {
        assert.equal(parseInt(body.result), 4)
        done()
      })
      .catch(err => {
        throw err;
      })
  })

  it('test service with ApiClient (create by discover client)', function (done) {
    consumer_discover_client
      .create_api_of(test_service_name)
      .request("/", request_json_body)
      .then(body => {
        assert.equal(parseInt(body.result), 4)
        done()
      })
      .catch(err => {
        throw err;
      })
  })

  after(done => {
    server.stop();
    add_sum_service_server.close();
    provider_discover_client.stop();
    done();
  })
})