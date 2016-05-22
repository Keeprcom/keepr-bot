'use strict';

const Wit = require('node-wit').Wit;

const witService  = require('./app/services/wit');
const config = require('./config');

const client = new Wit(config.Wit.serverToken, witService.actions);
client.interactive();
