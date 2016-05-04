'use strict';

const Hapi = require('hapi');
const request = require('request');

const server = new Hapi.Server();
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || '';
const token = process.env.PAGE_TOKEN || '';

function sendTextMessage(sender, text) {
  let messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, (error, response, body) => {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

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
}, {
  method: 'POST',
  path: '/webhook',
  handler: (req, reply) => {
    let messaging_events = req.payload.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.payload.entry[0].messaging[i];
      let sender = event.sender.id;
      if (event.message && event.message.text) {
        let text = event.message.text;
        console.log('Got ' + text);
        sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
      }
    }
    reply('Accepted').code(200)
  }
}
]);

