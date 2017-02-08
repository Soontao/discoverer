const express = require('express');
const route = express.Router();
const servicesStore = require('../service/storage')

route.all('/*', (req, res, next) => {
  // only get method not need param check
  if (req.method.toLowerCase() == 'get') {
    next();
    return;
  }
  // if param not enough
  if (!req.body.instancePort || !req.body.serviceName) {
    res.status(400).json({
      error: "param error",
      message: "you have to give out the name of service, and the port of the instance that will be registed"
    });
    return;
  }
  // if client not give the ip, server will detect the client ip
  req.body.instanceIp = req.body.instanceIp || req.ip;
  next();
})

route.post('/registe', (req, res, next) => {
  const addedInstanceInfo = servicesStore.addInstance(req.body);
  res.json({
    'api': 'registe a new client',
    'registed': addedInstanceInfo
  })
});

route.delete('/unregiste', (req, res, next) => {
  const deletedInstanceInfo = servicesStore.deleteInstance(req.body);
  res.json({
    'api': 'unregiste a existed client',
    'message': `unregiste instance ${deletedInstanceInfo.instanceId}`,
    'unregisted': deletedInstanceInfo
  })
});

route.get('/clients', (req, res, next) => {
  res.json({
    'api': 'get all active services clients',
    'services': servicesStore.getInstances()
  })
});

route.put('/renew', (req, res, next) => {
  const updatedInstanceInfo = servicesStore.updateInstance(req.body);
  res.json({
    'api': 'renew this service',
    'message': `have renew instance info ${updatedInstanceInfo.instanceId}`,
    'renewed': updatedInstanceInfo
  })
})

module.exports = route;