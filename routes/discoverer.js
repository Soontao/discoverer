const express = require('express');
const route = express.Router();
const servicesStore = require('../service/storage')

route.post('/registe', (req, res, next) => {
  const addedInstanceInfo = servicesStore.addInstance(req.body);
  res.json({
    'api': 'registe a new client',
    'payload': addedInstanceInfo
  })
});

route.delete('/unregiste', (req, res, next) => {
  const deletedInstanceInfo = servicesStore.deleteInstance(req.body);
  res.json({
    'api': 'unregiste a existed client',
    'deleted': `delete instance ${deletedInstanceInfo.instanceId}`
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
    'renew': `have renew instance info ${updatedInstanceInfo.instanceId}`
  })
})

module.exports = route;