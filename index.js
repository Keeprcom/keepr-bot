'use strict';

const Wit = require('node-wit').Wit;
const Hapi = require('hapi');
const request = require('request');

const config = require('./config');
const witService = require('./app/services/wit');
const keepr = require('./app/services/keepr');
const Facebook = require('./app/services/facebook');

const routes = require('./app/routes');

const server = new Hapi.Server();

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
        Facebook.sendTextMessage(recipientId, message).then(() => {
          cb();
        }).catch(() => {
          cb();
        });
    } else {
      console.log('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      cb();
    }
  },
  merge(sessionId, context, entities, message, cb) {
    console.log(entities);
    console.log(context);
    let keyword = entities.keyword[0].value;
    if (keyword) {
      context.keyword = keyword;
    }
    return cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  ['fetch_latest_news_by_keyword'](sessionId, context, cb) {
    console.log('fetching latest news by keyword');
    console.log(context);
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {

      keepr.latestNewsByKeyword(context.keyword).then((response) => {
        const firstBreakingNews = response.numbers[0].text;
        Facebook.sendTextMessage(recipientId, firstBreakingNews).then(() => {
          cb(context);
        }).catch(() => {
          cb(context);
        });
      });
    }
    return cb(context);
  },
  ['fetch_latest_news'](sessionId, context, cb) {
    console.log('executing fetch_latest_news');
    const recipientId = sessions[sessionId].fbid;
    console.log(recipientId);
    if (recipientId) {

      keepr.latestNews().then((response) => {
        const firstBreakingNews = response.numbers[0].text;
        Facebook.sendTextMessage(recipientId, firstBreakingNews).then(() => {
          cb(context);
        }).catch(() => {
          cb(context);
        });
      });
    }
    console.log('No recipientId');
    cb(context);
  }
  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
};


const witClient = new Wit(config.Wit.serverToken, actions);
server.connection({port: config.server.port});

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

server.route([{
  method: 'GET',
  path: '/webhook',
  handler: routes.webhook.get
}, {
  method: 'POST',
  path: '/webhook',
  handler: (req, reply) => {
    console.log('Get new message');
    const messaging = Facebook.getFirstMessagingEntry(req.payload); 
    console.log(messaging);
    if (messaging && messaging.message) {
      const msg = messaging.message.text;
      const sender = messaging.sender.id;
      const sessionId = findOrCreateSession(sender);

      witClient.runActions(sessionId, msg, sessions[sessionId].context,
          (error, context) => {
            if (error) {
              console.log(error);
            }

            sessions[sessionId].context = context;
          });
    }
    reply('Accepted').code(200)
  }
}
]);

