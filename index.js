'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || '';
server.connection({port: port});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

server.route({
  method: 'GET',
  path: '/webhook',
  handler: function (req, reply) {
    console.log(verifyToken);
    if (req.query['hub.verify_token'] === verifyToken) {
      return reply(req.query['hub.challenge']);
    }
    return reply('Error, wrong validation token');
  }
});
