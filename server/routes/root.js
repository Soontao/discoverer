const express = require('express');
const discovererRouter = require('./discoverer');
const router = express.Router();
const _ = require('lodash');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({
    server: 'discoverer',
    discover_api: _.map(discovererRouter.stack, info => {
      return {
        url:`${req.protocol}://${req.headers.host}/discoverer${info.route.path}`,
        method:`${_.keys(info.route.methods)[0]}`
      }
    })
  })
});

module.exports = router;