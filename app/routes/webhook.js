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
      const msg = messaging.message.text;
      console.log('Message: ' + msg);
      const sender = messaging.sender.id;
      const sessionId = sessions.findOrCreateSession(sender);
      const session = sessions.getSessions()[sessionId];

      witClient.runActions(sessionId, msg, session.context).then((context) => {
        console.log(context);
        session.context = context;
      }).catch((err) => {
        console.log(err);
      });
    }
    reply('Accepted').code(200)
  }
};
