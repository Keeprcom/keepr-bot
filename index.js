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

server.route([{
  method: 'GET',
  path: '/webhook',
  handler: (req, reply) => {
    if (req.query['hub.verify_token'] === verifyToken) {
      return reply(req.query['hub.challenge']);
    }
    return reply('Error, wrong validation token');
  }
},
{
  method: 'POST',
  path: '/webhook',
  handler: (req, reply) => {
    messaging_events = req.payload.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
      let event = req.payload.entry[0].messaging[i];
      let sender = event.sender.id;
      if (event.message && event.message.text) {
        let text = event.message.text;
        console.log(text);
      }
    }
    reply('Accepted').code(200)
  }
}
]);

