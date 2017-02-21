const express = require('express');
const router = express.Router();
const ServiceInstanceModel = require('../data/ServiceInstanceSchema').ServiceInstanceModel;

/**
 * if you want to registe a discoverer instance, 
 * you should give out your instancePort and serviceName
 */
router.all('/*', (req, res, next) => {
  // only get method not need param check
  if (req.method.toLowerCase() == 'get' || 'delete') {
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

router.post('/registe', (req, res, next) => {
  const model = new ServiceInstanceModel(req.body);
  model.save()
    .then(saved => res.json({
      'api': 'registe a new client',
      'registed': saved
    }))
    .catch(err => {
      next(err);
    })
});

router.delete('/unregiste', (req, res, next) => {
  ServiceInstanceModel.remove(req.body)
    .then(removed => res.json({
      'api': 'unregiste a existed client',
      'unregisted': removed
    }))
    .catch(err => {
      next(err);
    });
});

router.get('/clients', (req, res, next) => {
  ServiceInstanceModel.find()
    .then(clients => {
      res.json({
        'api': 'get all active services clients',
        'services': clients
      })
    })
    .catch(err => {
      next(err);
    });
});

router.put('/renew', (req, res, next) => {
  // just more time
  ServiceInstanceModel
    .findOne({ instanceId: req.body.instanceId })
    .then(instance => {
      instance.renew_expires();
      return instance.save()
    })
    .then(saved => res.json({
      'api': 'renew a instance',
      'renewd': saved
    }))
    .catch(err => next(err));

});

router.all('/checkExpired', req => {
  ServiceInstanceModel
    .find({ expires: { $lte: new Date() } })
    .then(expired_instances => {
      Promise.all(expired_instances.map(instance => instance.remove()))
        .then(removeds => {
          req.res.json({
            'api': 'remove expired service instances',
            'removedCount': removeds.length
          })
        })
    })
    .catch(err => next(err));
})

module.exports = router;