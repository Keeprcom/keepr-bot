'use strict';

const Hapi = require('hapi');

const config = require('./config');
const routes = require('./app/routes');

const server = new Hapi.Server();

server.connection({port: config.server.port});

server.route([{
  method: 'GET',
  path: '/webhook',
  handler: routes.webhook.get
}, {
  method: 'POST',
  path: '/webhook',
  handler: routes.webhook.post
}
]);

server.register([require('./plugins/wit')], (err) => {
  if (err) {
    throw err;
  }

  if(!module.parent) {
    server.start(() => {
      console.log('Server running at:', server.info.uri);
    });
  }
});
