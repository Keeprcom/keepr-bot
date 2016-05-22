'use strict';

const Wit = require('node-wit').Wit;
const Hapi = require('hapi');
const request = require('request');

const config = require('./config');
const witService = require('./app/services/wit');
const keepr = require('./app/services/keepr');
const Facebook = require('./app/services/facebook');
const sessions = require('./app/services/sessions');

const routes = require('./app/routes');

const server = new Hapi.Server();

const actions = {
  say(sessionId, context, message, cb) {
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions.getSessions()[sessionId].fbid;
    if (recipientId) {
        Facebook.sendTextMessage(recipientId, message).then(() => {
          cb();
        }).catch(() => {
          cb();
        });
    } else {
      console.log('Oops! Couldn\'t find user for session:', sessionId);
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
    const recipientId = sessions.getSessions()[sessionId].fbid;
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
    const recipientId = sessions.getSessions()[sessionId].fbid;
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
};

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
