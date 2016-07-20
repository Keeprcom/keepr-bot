'use strict';

const Wit = require('node-wit').Wit;

const witService  = require('./app/services/wit');
const config = require('./config');

const client = new Wit({
  accessToken: config.Wit.serverToken, 
  actions: witService.actions
});
client.interactive();
