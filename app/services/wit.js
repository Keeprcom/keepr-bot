'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const Facebook = require('./facebook');
const sessions = require('./sessions');
const keepr = require('./keepr');
const config = require('../../config');

module.exports = {
  actions: {
    send: ({sessionId}, {text}) => {
      const recipientId = sessions.getSessions()[sessionId].fbid;
      console.log('Response from Wit: ' + text);
      if (recipientId) {
          return Facebook.sendTextMessage(recipientId, text).then(() => null)
            .catch((err) => {
              console.error(
                'Oops! An error occurred while forwarding the response to',
                recipientId,
                ':',
                err.stack || err
                );
            });
      } else {
        console.error('Oops! Couldn\'t find user for session:', sessionId);
        return Promise.resolve();
      }
    },
    fetch_by_keyword: (request) => {
      const entities = request.entities;
      const sessionId = request.sessionId;
      const context = require.context;
      const keyword = entities.local_search_query[0].value;
      console.log('Keyword' + keyword);

      const recipientId = sessions.getSessions()[sessionId].fbid;
      if (recipientId) {
        return keepr.latestNewsByKeyword(keyword).then((response) => {
          const numbers = response.numbers;
          const newsWithUrls = _.filter(numbers, (tweet) => {
            return tweet.urls.length > 0;
          });
          
          return Facebook.sendTextMessage(recipientId, newsWithUrls.slice(0, 3)).catch((error) => {
            console.log(error);
          });
        });
      }
      return Promise.reject('Oops! Couldn\'t find user for session: ' + sessionId);
    },
  }
};
