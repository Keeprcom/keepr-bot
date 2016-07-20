'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const Facebook = require('./facebook');
const sessions = require('./sessions');
const keepr = require('./keepr');
const config = require('../../config');

module.exports = {
  actions: {
    send: (request, response) => {
      const sessionId = request.sessionId;
      const context = request.context;
      const entities = request.entities;
      const recipientId = sessions.getSessions()[sessionId].fbid;
      if (recipientId) {
          return Facebook.sendTextMessage(recipientId, message);
      } else {
        return Promise.reject('Oops! Couldn\'t find user for session: ' + sessionId);
      }
    },
    ['fetch_latest_news_by_keyword'](request) {
      const entities = request.entities;
      const sessionId = request.sessionId;
      const context = require.context;
      const keyword = entities.local_search_query;
      console.log(keyword);
      const recipientId = sessions.getSessions()[sessionId].fbid;
      if (recipientId) {
        return keepr.latestNewsByKeyword(entities.keyword).then((response) => {
          const numbers = response.numbers;
          const newsWithUrls = _.filter(numbers, (tweet) => {
            return tweet.urls.length > 0;
          });
          const firstBreakingNews = newsWithUrls[0].urls[0].expanded_url;
          
          return Facebook.sendTextMessage(recipientId, firstBreakingNews).catch((error) => {
            console.log(error);
          });
        });
      }
      return Promise.reject('Oops! Couldn\'t find user for session: ' + sessionId);
    },
  }
};
