'use strict';

const _ = require('lodash');
const Facebook = require('./facebook');
const sessions = require('./sessions');
const keepr = require('./keepr');

module.exports = {
  actions: {
    say: (sessionId, context, message, cb) => {
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
    ['fetch_latest_news_by_keyword'](sessionId, context, entities, cb) {
      console.log('fetching latest news by keyword');
      console.log(context);
      console.log(entities);
      const recipientId = sessions.getSessions()[sessionId].fbid;
      if (recipientId) {

        keepr.latestNewsByKeyword(entities.keyword).then((response) => {
          const numbers = response.numbers;

          const firstBreakingNews = numbers[1].urls[0].expanded_url;
          
          console.log('Messages');
          console.log(firstBreakingNews);
          Facebook.sendTextMessage(recipientId, firstBreakingNews).then(() => {
            cb(context);
          }).catch(() => {
            cb(context);
          });
        });
      }
      return cb(context);
    },
  }
};
