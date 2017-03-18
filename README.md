# discoverer

[![Build Status](https://travis-ci.org/Soontao/discoverer.svg?branch=master)](https://travis-ci.org/Soontao/discoverer) [![Coverage Status](https://coveralls.io/repos/github/Soontao/discoverer/badge.svg?branch=master)](https://coveralls.io/github/Soontao/discoverer?branch=master)

nodejs service discover

in dev now. document will be wrote later, thanks

## Architecture

![arch](https://res.cloudinary.com/digf90pwi/image/upload/v1489805512/discoverer_1_qzlptg.png)

## install

```
npm i discoverer --save
```

## use server

```javascript
const DiscovererServer = require('discoverer').DiscovererServer;

const server = new DiscovererServer();

server.start();
```

## service provider

```javascript
const restify = require('restify');
const DiscovererClient = require('discoverer').DiscovererClient;

const listenPort = process.env.PORT || 1234;

const server = restify.createServer();

const discovererClient = new DiscovererClient();

server.use(restify.queryParser());

server.get('/api/v1/add', function (req, res, next) {
  res.json({
    sum: parseInt(req.query.a) + parseInt(req.query.b)
  });
});

server.listen(listenPort, () => {
  console.log(`${server.name} listen on ${server.url}`)
})

discovererClient._registe(info => console.log(info))
```

## service consumer

```javascript
const DiscovererClient = require('discoverer').DiscovererClient;

// construct a new Discoverer client
const discover = new DiscovererClient();

// create a client load balance api client
const compute_server = discover.create_api_of('add-compute-service');

// wrap a request as a function
const add = (a, b) => {
  return compute_server
    .request(`/api/v1/add?a=${a}&b=${b}`, {
      json: true
    })
    .then(result => result.sum)
    .catch(err => {
      throw err;
    })
}

// another js file
add(1,2).then(console.log)
// out: 3

```


## environment variable

All config items can be configured by system env variables

### server

1. USE_AUTH, default is false, set "true" will enable http digest auth
1. AUTH_USER, avoid server access by un auth user, system will generte a random str if it not set
1. AUTH_PASS, avoid server access by un auth user, system will generte a random str if it not set
1. CONNECT_URI, **required**, default is mongodb://localhost/discoverer
1. LISTEN_HOST, default is 0.0.0.0
1. PORT, default is 3999
1. CHECK_INTERVAL, default is 2s, 服务器会每隔几秒检测数据库中是否有超时的instance，有的话就会移除记录

### client

1. C_SERVER_URL, default is http://127.0.0.1:3999, 如果server配置了http basic auth, 需要在url中指明，例如: http://discover.example.com
1. C_AUTH_USER, use to pass the server auth
1. C_AUTH_PASS, use to pass the server auth
1. C_SERVICE_NAME, **required**, default is hostname, 服务名非常重要, consumer也是通过这个名称拉取provider列表
1. C_INSTANCE_URL, **required**, default is http://yourip:80, 这里配置的地址是被外部服务远程调用的地址
1. C_INSTANCE_ID, if not set, server will give you one
1. C_HEART_BREAK_INTERVAL, default is 15s
1. C_NO_REGISTE, default is false, if set this flag is true, client无论如何都不会注册到服务器，即使显式的调用了_registe方法

## tasks

- [x] mongodb storage
- [x] move operate to service layer, [cancel]
- [ ] add log
- [x] client cli
- [x] client default url is ip
- [x] promisefy discoverer client
- [x] api client, load balance, round method
- [x] need a switch to adapt a client just want to consume services
- [x] if there is not client info when renew, server should registe
- [x] authorize should be more attention, security with http digest auth
- [x] center config file
- [ ] command line var
- [ ] server side health check
- [ ] when ApiClient catch an exception, should refresh client list
