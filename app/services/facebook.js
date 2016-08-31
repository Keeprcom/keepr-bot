'use strict';

const request = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');

const config = require('../../config');
const scraper = require('./scraper');

function sendFBMsg(sender, text) {
  return request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: config.Facebook.pageToken},
    method: 'POST',
    body: {
      recipient: {id: sender},
      message: {
        text: text
      }
    },
    json: true
  });
}

module.exports = {
  getFirstMessagingEntry: (body) => {
    const val = body.object == 'page' &&
      body.entry &&
      Array.isArray(body.entry) &&
      body.entry.length > 0 &&
      body.entry[0] &&
      body.entry[0].id == config.Facebook.pageId &&
      body.entry[0].messaging &&
      Array.isArray(body.entry[0].messaging) &&
      body.entry[0].messaging.length > 0 &&
      body.entry[0].messaging[0]
      ;
    return val || null;
  },
  sendFBMsg: sendFBMsg,
  sendTextMessage: (sender, elements, keyword) => {
    return Promise.all(elements).then((values) => {
      console.log(values);
      const urlWithImage = _.reject(values, _.isEmpty);

      const messageData = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: urlWithImage.slice(0, 3)
          }
        }
      };

      const text = `The top news stories about ${keyword} are:`;
      return sendFBMsg(sender, text).then(() => {
        return request({
          uri: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: config.Facebook.pageToken},
          method: 'POST',
          body: {
            recipient: {id: sender},
            message: messageData,
          },
          json: true
        });
      });
    }).catch((err) => {
      console.log(err.stack);
      return sendFBMsg(sender, text);
    });
  }
};
