'use strict';

const Wit = require('node-wit').Wit;

const config = require('../config');
const actions = require('../app/services/wit');

exports.register = (server, options, next) => {

  const witClient = new Wit(config.Wit.serverToken, actions.actions);

  server.expose('witClient', witClient);
  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
