'use strict';

const config = require('../../config');

module.exports = {
  get: (req, reply) => {
    if (req.query['hub.verify_token'] === config.Facebook.verifyToken) {
      return reply(req.query['hub.challenge']);
    }
    return reply('Error, wrong validation token');
  }
};
