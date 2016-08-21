'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const Facebook = require('./facebook');
const sessions = require('./sessions');
const keepr = require('./keepr');
const config = require('../../config');
const fbFormatter = require('../helpers/facebookFormatter');

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
    fetch_by_keyword(request) {
      const entities = request.entities;
      const sessionId = request.sessionId;
      const context = request.context;
      const keyword = entities.wikipedia_search_query[0].value;

      console.log(`Keyword: ${keyword}`);
      console.log(`entities: ${JSON.stringify(entities, null, 4)}`);
      console.log(`context: ${context}`);

      const recipientId = sessions.getSessions()[sessionId].fbid;
      if (recipientId) {
        return keepr.latestNewsByKeyword(keyword).then((response) => {
          const urlsWithAnImage = fbFormatter.formatForFacebook(response);
          
          return Facebook.sendTextMessage(recipientId, urlsWithAnImage).catch((error) => {
            console.log(error);
          });
        });
      }
      return Promise.reject('Oops! Couldn\'t find user for session: ' + sessionId);
    },
  }
};
