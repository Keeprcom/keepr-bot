'use strict';

const Wit = require('node-wit').Wit;
const Hapi = require('hapi');
const request = require('request');

const config = require('./config');
const witService = require('./app/services/wit');

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

// Our bot actions
const actions = {
  say(sessionId, context, message, cb) {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
        // Let's give the wheel back to our bot
        //
        sendTextMessage(recipientId, 'This is the response from our Bot!');
        cb();
    } else {
      console.log('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      cb();
    }
  },
  merge(sessionId, context, entities, message, cb) {
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
};


const witClient = new Wit(config.Wit.serverToken, actions);
server.connection({port: port});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

const sessions = {};

const findOrCreateSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

const getFirstMessagingEntry = (body) => {
  const val = body.object == 'page' &&
    body.entry &&
    Array.isArray(body.entry) &&
    body.entry.length > 0 &&
    body.entry[0] &&
    body.entry[0].id == FB_PAGE_ID &&
    body.entry[0].messaging &&
    Array.isArray(body.entry[0].messaging) &&
    body.entry[0].messaging.length > 0 &&
    body.entry[0].messaging[0]
    ;
  return val || null;
};

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
    console.log('Get new message');
    const messaging = getFirstMessagingEntry(req.payload); 
    console.log(messaging);
    const msg = messaging.message.text;
    const sender = messaging.sender.id;
    const sessionId = findOrCreateSession(sender);

    wit.runActions(sessionId, msg, sessions[sessionId].context,
      (error, context) => {
        if (error) {
          console.log(error);
        }

        sessions[sessionId].context = context;
      });
    /*
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
    */
    reply('Accepted').code(200)
  }
}
]);

