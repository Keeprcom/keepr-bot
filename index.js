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
  handler: function (request, reply) {
    if (req.query['hub.verify_token'] === verifyToken) {
      res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
  }
});
