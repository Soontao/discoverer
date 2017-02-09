const express = require('express');
const discovererRouter = require('./discoverer');
const router = express.Router();
const _ = require('lodash');

function getDiscovererRouterInfo() {
  return _.map(discovererRouter.stack, (info) => {
    return {
      path: `/discoverer${info.route.path}`,
      method: info.route.methods
    }
  })
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({
    server: 'discoverer',
    routes: getDiscovererRouterInfo()
  })
});

module.exports = router;