const express = require('express');
const router = express.Router();
const ServiceInstanceModel = require('../data/ServiceInstanceSchema').ServiceInstanceModel;

/**
 * if you want to registe a discoverer instance, 
 * you should give out your instancePort and serviceName
 */
router.all('/*', (req, res, next) => {
  // only get method not need param check
  if (['get', 'delete'].indexOf(req.method.toLowerCase()) > -1) {
    next();
    return;
  }
  // if param not enough
  if (!req.body.service_name) {
    const err = new Error("you have to give out the service_name")
    err.status = 400;
    next(err);
    return;
  }
  // if client not give the ip, server will detect the client ip
  req.body.instance_url = req.body.instance_url || `http://${req.ip}`;
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

router.get('/services', (req, res, next) => {
  ServiceInstanceModel.aggregate({
      $group: {
        _id: null,
        service_name: {
          $max: "$service_name"
        },
        instance_count: {
          "$sum": 1
        }
      }
    })
    .exec()
    .then(result => res.json({
      "api": "all service type",
      "services": result
    }))
    .catch(err => next(err))
})

router.get('/clients', (req, res, next) => {
  ServiceInstanceModel.find(req.query)
    .then(clients => {
      res.json({
        'api': 'get active services clients with param',
        'instances': clients
      })
    })
    .catch(err => {
      next(err);
    });
});

router.put('/renew', (req, res, next) => {
  // just more time
  ServiceInstanceModel
    .findOne({ instance_id: req.body.instance_id })
    .then(instance => {
      if (instance) {
        instance.renew_expires();
        return instance.save()
      } else {
        const err = new Error("no such instance");
        throw err;
      }
    })
    .then(saved => res.json({
      'api': 'renew a instance',
      'renewed': saved
    }))
    .catch(err => next(err));

});

router.all('/check_expired', req => {
  ServiceInstanceModel
    .find({ expires: { $lte: new Date() } })
    .then(expired_instances => Promise.all(expired_instances.map(instance => instance.remove())))
    .then(removeds => req.res.json({
      'api': 'remove expired service instances',
      'removedCount': removeds && removeds.length
    }))
    .catch(err => next(err));
})

module.exports = router;