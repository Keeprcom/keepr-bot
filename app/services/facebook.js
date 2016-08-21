'use strict';

const request = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');

const config = require('../../config');
const scraper = require('./scraper');

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
  sendTextMessage: (sender, elements) => {
    return Promise.all(elements).then((values) => {
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
  }
};
