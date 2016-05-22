'use strict';

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
    merge: (sessionId, context, entities, message, cb) => {
      console.log(entities);
      console.log(context);
      let keyword = entities.keyword[0].value;
      if (keyword) {
        context.keyword = keyword;
      }
      return cb(context);
    },
    error: (sessionId, context, err) => {
      console.log(err.message);
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
  }
};
