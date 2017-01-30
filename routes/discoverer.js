const express = require('express');
const route = express.Router();
const servicesStore = require('../service/storage')


route.post('/registe', (req, res, next) => {
  servicesStore.addInstance(req.body);
  res.json({
    'api': 'registe a new client',
    'payload': req.body
  })
});

route.delete('/unregiste', (req, res, next) => {
  res.json({
    'api': 'unregiste a existed client'
  })
});

route.get('/clients', (req, res, next) => {
  res.json({
    'api': 'get all active services clients',
    'services': servicesStore.getInstances()
  })
});

route.put('/renew', (req, res, next) => {
  res.json({
    'api': 'renew this service'
  })
})

module.exports = route;