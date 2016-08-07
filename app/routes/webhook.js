'use strict';

const config = require('../../config');
const Facebook = require('../../app/services/facebook');
const sessions = require('../../app/services/sessions');

module.exports = {
  get: (req, reply) => {
    if (req.query['hub.verify_token'] === config.Facebook.verifyToken) {
      return reply(req.query['hub.challenge']);
    }
    return reply('Error, wrong validation token');
  },
  post: (req, reply) => {
    const witClient = req.server.plugins['keepr-bot'].witClient;
    const messaging = Facebook.getFirstMessagingEntry(req.payload); 

    console.log(messaging);

    if (messaging && messaging.message) {
      const {text, attachments} = messaging.message;
      console.log('Message is: ' + text);

      const sender = messaging.sender.id;
      const sessionId = sessions.findOrCreateSession(sender);
      const session = sessions.getSessions()[sessionId];

      witClient.runActions(sessionId, text, session.context).then((context) => {
        console.log(context);
        session.context = context;
      }).catch((err) => {
        console.log(err);
      });
    }
    reply('Accepted').code(200)
  }
};
