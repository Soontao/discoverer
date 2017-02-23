const express = require('express');
const router = express.Router();
const ServiceInstanceModel = require('../data/ServiceInstanceSchema').ServiceInstanceModel;
const check_expired = require('../data/check_expired').remove_expired;

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
        // if renewed instance are not in db, create it;
        return ServiceInstanceModel.create(req.body)
      }
    })
    .then(saved => res.json({
      'api': 'renew a instance',
      'renewed': saved
    }))
    .catch(err => next(err));

});

router.all('/check_expired', req => {
  check_expired()
    .then(removeds => req.res.json({
      'api': 'remove expired service instances',
      'removedCount': removeds && removeds.length
    }))
    .catch(err => next(err));
});

module.exports = router;